import router, { MainRoutes } from '@/router/index'
import dynamicRouter from '@/router/dynamic-router'

export default {
    namespaced: true,
    state: {
        sidebarMenu: [] /** 导航菜单 */,
        currentMenu: '' /** 当前active导航菜单 */
    },
    getters: {},
    mutations: {
        SET_MENU(state, menu) {
            state.sidebarMenu = menu
        },
        CLEAR_MENU(state) {
            state.sidebarMenu = []
        },
        SET_CURRENT_MENU(state, currentMenu) {
            state.currentMenu = currentMenu
        }
    },
    actions: {
        GEN_MENU({ commit }) {
            let MainContainer = MainRoutes.find(v => v.path === '')
            let children = MainContainer.children
            children.push(...dynamicRouter)
            commit('SET_MENU', children)
            router.addRoutes(MainRoutes)
        }
    }
}
