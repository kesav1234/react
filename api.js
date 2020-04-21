import axios from 'axios';
import config from './config';

var CryptoJS = require("crypto-js");
const secret = `${config.secret}`;


const api = axios.create({
    baseURL: `${config.apiBaseUrl}`,
    headers: {
        'apikey': `${config.apikey}`
    } 
});

/*
** Created new Axios instance for Apis that will hit microservices directly bypassing apigee
** @params {}
**  baseUrl {string}, config.servicesBaseUrl,
**  timeout {number}, 3 minutes
**  headers {obj} @params
**  content-type {string}, application/json
**  Authorization {string}, Bearer jwtToken that user will receive when logged in
*/    
export let newAxiosInstance = axios.create({
    baseURL: config.servicesBaseUrl,
    timeout: 180000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

export function Kirkekeepalive () {
    var sessionRedirectUrl = config.apiBaseUrl ? config.apiBaseUrl.replace('/api', '') : '';
    axios.get(sessionRedirectUrl + '/kirke-keep-alive.json').then(function(response) {
        // console.log('extended session')
    }).catch(function(error) {
        console.log('session expired');
        window.location.href = sessionRedirectUrl;
    }).finally(function() {
        // console.log('attempted session extension')
    });
}

api.interceptors.request.use(function (config) {
        // below logic to validate session presence
        // MSJVA 194
        // Kirkekeepalive();
        // MSJVA 194 ends

        let url = config.url ? config.url.split('?') : config.url;
        /*
        ** Check if query params {string} equals to savePlan then don't Encrypt payload
        ** For all other endpoints encrypt query string and payload data
        */
        if(url[0]==='/savePlan'){
            if(url && url.length === 1){
                let lngtime = new Date().getTime();  
                let params =  'timestamp=' + lngtime;
                config.url = url[0] +'?'+ params;
            }
        }else {
            if(url && url.length > 1) {
                var baseUrl = url[0];
                var params = url[1];
                var encParams = CryptoJS.AES.encrypt(params, secret).toString();
                config.url = baseUrl + '?' + encParams;
            }
            if(url && url.length === 1)
            {   
                var lngtime = new Date().getTime();  
                let params =  'timestamp=' + lngtime;
                var encParam = CryptoJS.AES.encrypt(JSON.stringify(params), secret).toString();
                config.url = url[0] +'?'+  encParam ;
            }
            if(config.data ) {
                // Encrypt
                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(config.data), secret).toString();
                config.data = ciphertext;
            }
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
});

api.interceptors.response.use(function (response) {
    /*
    ** Check if query params {string} equals to savePlan then don't Decrypt payload
    ** For all other endpoints decrypt response data
    */
   let  url =  response.config.url ? response.config.url.split('?') : response.config.url;
   let savePlanUrl = url[0].replace(response.config.baseURL,'')
        if(response.data && savePlanUrl!=='/savePlan') {
            if(!response.data.isSessionExtended) {
                // Decrypt
                var bytes  = CryptoJS.AES.decrypt(response.data.toString(), secret);
                var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                response.data = JSON.parse(decryptedData);
            }
        }
        return response;
}, error => Promise.reject(error));

export default api;