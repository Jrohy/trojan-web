export function readablizeBytes(bytes) {
    if (bytes === 0) {
        return '0'
    }
    const s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    const e = Math.floor(Math.log(bytes) / Math.log(1024))
    const r = bytes / Math.pow(1024, Math.floor(e))
    return ((r + '').indexOf('.') !== -1 ? r.toFixed(2) : r) + ' ' + s[e]
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function base64Encode(str) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
}

export function base64Decode(str) {
    return CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8)
}
