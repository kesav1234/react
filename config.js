const { REACT_APP_KIRKE_ENV } = process.env;

let config = {
    apiBaseUrl: 'https://kirke-dev.ebiz.verizon.com/api',
    servicesBaseUrl: 'https://ucmdev-aws.ebiz.verizon.com/services',
    mopFileUploadFolder: '/uploads/mop/',
    ldapUrl: 'https://kirke-dev.ebiz.verizon.com/ldapservices/api/ldap',
    apikey: '1HdTDgFmQ70rkmtVYmcsfcoybS3kUhuu',
    analyticsBaseUrl: 'https://vpc-vz-msjv-kirke-dev-fgap24xdfbafuscrbeslqfmcmy.us-east-1.es.amazonaws.com/kirke-dev/_doc',
    secret: 'KIRKE',
    logoutUrl: 'https://logindev.ebiz.verizon.com/siteminderagent/forms/logout.jsp',
    supportUrl: 'https://nct.nss.vzwnet.com/display/NDNA/Kirke+-+Change+Management+Tool'
};

if (REACT_APP_KIRKE_ENV === 'prod') {
    config = {
        apiBaseUrl: 'https://kirke.verizon.com/api',
        servicesBaseUrl: 'https://ucmprod-east.verizon.com/services',
        mopFileUploadFolder: '/uploads/mop/',
        ldapUrl: 'https://kirke.verizon.com/ldapservices/api/ldap',
        apikey: 'rYhAzXDs63JmLRXyaoQAf3NbstvloCmg',
        analyticsBaseUrl: 'https://vpc-vz-msjv-kirke-dev-fgap24xdfbafuscrbeslqfmcmy.us-east-1.es.amazonaws.com/kirke-uat/_doc',
        secret: 'KIRKE',
        logoutUrl: 'https://login.verizon.com/siteminderagent/forms/logout.jsp',
        supportUrl: 'https://nct.nss.vzwnet.com/display/NDNA/Kirke+-+Change+Management+Tool'
    };

} else if (REACT_APP_KIRKE_ENV === 'uat') {
    config = {
        apiBaseUrl: 'https://kirke-uat.ebiz.verizon.com/api',
        servicesBaseUrl: 'https://ucmuat.ebiz.verizon.com/services',
        mopFileUploadFolder: '/uploads/mop/',
        ldapUrl: 'https://kirke-uat.ebiz.verizon.com/ldapservices/api/ldap',
        apikey: 'rYhAzXDs63JmLRXyaoQAf3NbstvloCmg',
        analyticsBaseUrl: 'https://vpc-vz-msjv-kirke-dev-fgap24xdfbafuscrbeslqfmcmy.us-east-1.es.amazonaws.com/kirke-uat/_doc',
        secret: 'KIRKE',
        logoutUrl: 'https://loginuat.ebiz.verizon.com/siteminderagent/forms/logout.jsp',
        supportUrl: 'https://nct.nss.vzwnet.com/display/NDNA/Kirke+-+Change+Management+Tool'
    };

} else if (REACT_APP_KIRKE_ENV === 'qa') {
    config = {
        apiBaseUrl: 'https://kirke-qa.ebiz.verizon.com/api',
        servicesBaseUrl: 'https://ucmqa.ebiz.verizon.com/services',
        mopFileUploadFolder: '/uploads/mop/',
        ldapUrl: 'https://kirke-qa.ebiz.verizon.com/ldapservices/api/ldap',
        apikey: 'OPuOJvh6mVj1iyVcs5Ydqev3EDy5et0z',
        analyticsBaseUrl: 'https://vpc-vz-msjv-kirke-dev-fgap24xdfbafuscrbeslqfmcmy.us-east-1.es.amazonaws.com/kirke-qa/_doc',
        secret: 'KIRKE',
        logoutUrl: 'https://loginuat.ebiz.verizon.com/siteminderagent/forms/logout.jsp',
        supportUrl: 'https://nct.nss.vzwnet.com/display/NDNA/Kirke+-+Change+Management+Tool'
    }
}

export default config 
