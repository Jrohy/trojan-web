export function readablizeBytes(bytes) {
    if (bytes === 0) {
        return '0'
    }
    let s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    let e = Math.floor(Math.log(bytes) / Math.log(1024))
    let r = bytes / Math.pow(1024, Math.floor(e))
    return ((r + '').indexOf('.') !== -1 ? r.toFixed(2) : r) + ' ' + s[e]
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip)
}
