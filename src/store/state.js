export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    dialogWidth: '25%',
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: localStorage.hasOwnProperty('isSidebarNavCollapse') ? localStorage.getItem('isSidebarNavCollapse') === 'true' : false
}
