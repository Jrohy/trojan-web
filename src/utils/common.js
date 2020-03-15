export function readablizeBytes(bytes) {
    if (bytes === 0) {
        return '0'
    }
    let s = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    let e = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e]
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
