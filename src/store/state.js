export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    loglevel: Object.prototype.hasOwnProperty.call(localStorage, 'loglevel') ? parseInt(localStorage.getItem('loglevel')) : 1,
    line: Object.prototype.hasOwnProperty.call(localStorage, 'line') ? parseInt(localStorage.getItem('line')) : 300,
    type: Object.prototype.hasOwnProperty.call(localStorage, 'type') ? localStorage.getItem('type') : 'trojan',
    docTitle: Object.prototype.hasOwnProperty.call(localStorage, 'docTitle') ? localStorage.getItem('docTitle') : '',
    dialogWidth: '25%',
    nprogress: true,
    noerror: false,
    isAdmin: null
}
