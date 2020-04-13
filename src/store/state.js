export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    loglevel: localStorage.hasOwnProperty('loglevel') ? parseInt(localStorage.getItem('loglevel')) : 1,
    line: localStorage.hasOwnProperty('line') ? parseInt(localStorage.getItem('line')) : 300,
    docTitle: localStorage.hasOwnProperty('docTitle') ? localStorage.getItem('docTitle') : '',
    dialogWidth: '25%',
    nprogress: true,
    noerror: false,
    isAdmin: localStorage.hasOwnProperty('isAdmin') ? localStorage.getItem('isAdmin') === 'true' : false,
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: localStorage.hasOwnProperty('isSidebarNavCollapse') ? localStorage.getItem('isSidebarNavCollapse') === 'true' : false
}
