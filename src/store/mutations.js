export default {
    LOGIN_IN(state, token) {
        state.UserToken = token
    },
    LOGIN_OUT(state) {
        state.UserToken = ''
    },
    SET_ADMIN(state, bool) {
        state.isAdmin = bool
    },
    SET_TITLE(state, docTitle) {
        state.docTitle = docTitle
        localStorage.setItem('docTitle', state.docTitle)
    },
    SET_WIDTH(state, width) {
        state.dialogWidth = width
    },
    SET_NPROGRESS(state, bool) {
        state.nprogress = bool
    },
    SET_NOERROR(state, bool) {
        state.noerror = bool
    },
    SET_LINE(state, line) {
        state.line = line
        localStorage.setItem('line', state.line)
    },
    SET_LOGLEVEL(state, loglevel) {
        state.loglevel = loglevel
        localStorage.setItem('loglevel', state.loglevel)
    },
    SET_TYPE(state, type) {
        state.type = type
        localStorage.setItem('type', state.type)
    }
}
