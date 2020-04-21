#!/bin/bash
SMHOST_FILE=/apps/opt/siteminder/webagent/config/SmHost.conf
SSO_TEMPDIR=/tempo
SSO_TEMPLATE=$SSO_TEMPDIR/ssi.template
SSO_TMP_SSI=$SSO_TEMPDIR/sso.ssi
rm -rf /etc/SSI/* /apps/etc/SSI/*
#Remove Existing SSL
rm -rf /etc/httpd/conf/httpd.conf /etc/httpd/conf.d/ssl.conf /etc/httpd/conf/Webagent.conf

source $SSO_TEMPDIR/sso.$1.conf $2

perl -p -i -e 's/\$\{([^}]+)\}/defined $ENV{$1} ? $ENV{$1} : $&/eg' < $SSO_TEMPLATE  > $SSO_TMP_SSI
cp $SSO_TMP_SSI /etc/SSI/host.$HOSTNAME.sso.ssi
cp -r $SSO_TMP_SSI /apps/etc/SSI/host.$HOSTNAME.sso.ssi

source /apps/opt/siteminder/webagent/ca_wa_env.sh
cd /apps/opt/siteminder/webagent/bin
SERVER1D=`echo "$SSI_SSO_WA_POLICY_SERVER_IP_LIST" | cut -d "," -f 1`
./smreghost -i ${SERVER1D} -hn ${SSI_SSO_WA_REGISTRATION_HOSTNAME} -sh ${SSI_SSO_WA_REGISTRATION_KEY} -hc ${SSI_SSO_WA_HOST_CONFIG_OBJECT} -f $SMHOST_FILE

sed -i '/policyserver/d' $SMHOST_FILE
echo $SSI_SSO_WA_POLICY_SERVER_IP_LIST | tr ',' '\n' | sed -e 's/^/policyserver="/g' |sed 's/$/,44441,44442,44443"/g' >> $SMHOST_FILE

cp $SSO_TEMPDIR/conf/* /etc/httpd/conf/
cp -r $SSO_TEMPDIR/conf/build/* /var/www/html/
#cp $SSO_TEMPDIR/conf.d/* /etc/httpd/conf.d/

sed -i -e 's/LogAppend="YES"/LogAppend="NO"/g' /etc/httpd/conf/WebAgent.conf
sed -i -e 's/TraceAppend="YES"/TraceAppend="NO"/g' /etc/httpd/conf/WebAgent.conf

chown apache:apache /apps/opt/siteminder/webagent/config/SmHost.conf
touch /etc/httpd/logs/webagent.log /etc/httpd/logs/smtrace.log
chmod 777 /etc/httpd/logs/webagent.log /etc/httpd/logs/smtrace.log
chmod -R 777 /var/log/httpd

#rm -rf $SSO_TEMPDIR/*


#Commenting out prefork
#sed -i '/mpm_prefork_module/s/^/#/g' /etc/httpd/conf.modules.d/00-mpm.conf

#Uncommenting worker module
#sed -i '/mpm_worker_module/s/^#//g' /etc/httpd/conf.modules.d/00-mpm.conf

#if [ $1 == 'prod' ]; then
#        sed -i '/ServerName/c\ServerName orchops.vzwnet.com:80' /etc/httpd/conf/httpd.conf
#else
#        sed -i '/ServerName/c\ServerName orchops-dprod.vici.verizon.com:80' /etc/httpd/conf/httpd.conf
#fi


echo 'MaxSessionCacheSize="700"' >> /etc/httpd/conf/WebAgent.conf
echo 'FCCForceIsProtected="NO"' >> /etc/httpd/conf/WebAgent.conf
echo 'MaxResourceCacheSize="700"' >> /etc/httpd/conf/WebAgent.conf
echo 'ResourceCacheTimeout="600"' >> /etc/httpd/conf/WebAgent.conf
echo 'IgnoreExt=".ttf, .class, .gif, .jpg, .jpeg, .png, .fcc, .scc, .sfcc, .ccc, .ntc, .js, .css, .svg"' >> /etc/httpd/conf/WebAgent.conf

/usr/sbin/httpd -DFOREGROUND -k start
