import config from './config';
import store from './modules/AccessRequest/redux/store.js';
const CryptoJS = require("crypto-js");
const secret = `${config.secret}`;

export function encrypt(msg) {
    const transitmessage = CryptoJS.AES.encrypt(msg, secret).toString();
    return transitmessage;
}

export function replaceUnWantedChars() {
    const { access } = store.getState();
    if (!access) return '';
    const { user } = access;
    if (!user) return '';
    const vzid = user.name;
    if (!vzid) return '';
    return encrypt(vzid);
}

export function decrypt(value) {
    const bytes = CryptoJS.AES.decrypt(value.toString(), secret);
    const decString = bytes.toString(CryptoJS.enc.Utf8);
    return decString;
}

export function removeLeadingTrailingWhitespace(value) {
    return value.replace(/^[ \t]|[ \t]$/g, '');
}
