export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false
}
