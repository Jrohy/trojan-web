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
        GEN_MENU({ commit, rootState }) {
            const MainContainer = MainRoutes.find(v => v.path === '')
            const children = MainContainer.children
            let dr = dynamicRouter
            if (!rootState.isAdmin) {
                dr = dr.filter(v => v.meta.admin === false)
            }
            children.push(...dr)
            commit('SET_MENU', children)
            router.addRoutes(MainRoutes)
        }
    }
}
