FROM oneartifactorycloud.vpc.verizon.com:8091/vzdocker/nodejs:12.14.1-alpine3.11-1 As builder

ARG ENV=dev
ENV REACT_APP_KIRKE_ENV ${ENV}
USER root
RUN mkdir app

WORKDIR /app

COPY . .

RUN npm config set registry https://oneartifactory.verizon.com/artifactory/api/npm/npm-virtual
RUN npm config set package-lock false
RUN npm cache verify
RUN npm install kirke-react-datetime@2.16.34
RUN npm install kirke-react-timekeeper@^1.1.0
RUN npm install kirke-react-closeable-tabs@1.1.2
RUN npm install --verbose
RUN npm run build

FROM oneartifactorycloud.vpc.verizon.com:8091/vzdocker/httpd-sso:2.4.6-centos8-2

ARG ENV=dev
ENV REACT_APP_KIRKE_ENV ${ENV}
USER root
RUN yum update -y

COPY --chown=apache:apache /conf/${ENV}/httpd.conf /etc/httpd/conf/
COPY --chown=apache:apache /conf/magic /etc/httpd/conf/
COPY --chown=apache:apache --from=builder /app/build/ /var/www/html/
COPY --chown=apache:apache /conf/kirke-keep-alive.json /var/www/html/

RUN sed -i 's/SmTrace.conf/WebAgentTrace.conf/' /etc/httpd/conf/WebAgent.conf
RUN sed -i 's|TraceFileName="/dev/stdout"|TraceFileName="/run/httpd/Smtrace_log"|' /etc/httpd/conf/WebAgent.conf
RUN echo 'MaxSessionCacheSize="700"' >> /etc/httpd/conf/WebAgent.conf
RUN echo 'FCCForceIsProtected="NO"' >> /etc/httpd/conf/WebAgent.conf
RUN echo 'MaxResourceCacheSize="700"' >> /etc/httpd/conf/WebAgent.conf
RUN echo 'ResourceCacheTimeout="600"' >> /etc/httpd/conf/WebAgent.conf
RUN echo 'IgnoreExt=".ttf, .class, .gif, .jpg, .jpeg, .png, .fcc, .scc, .sfcc, .ccc, .ntc, .js, .css, .svg"' >> /etc/httpd/conf/WebAgent.conf

RUN find / -name *.pem -print0 | xargs -0 rm -rf \
    && find / -name *.key -print0 | xargs -0 rm -rf \
    && find / -name *.crt -print0 | xargs -0 rm -rf

RUN rm -rf /var/www/html/keepalive \
    && echo "<HTML>OK</HTML>" > /var/www/html/keepalive \
    && echo "<HTML>OK</HTML>" > /var/www/html/liveness \
    && echo "<HTML>OK</HTML>" > /var/www/html/readiness

USER apache
