import { getLanguage } from '@/lang/index'

const state = {
    sidebar: {
        opened: Object.prototype.hasOwnProperty.call(localStorage, 'sidebarStatus') ? localStorage.getItem('sidebarStatus') === 0 : true,
        withoutAnimation: false
    },
    language: getLanguage(),
    device: 'desktop'
}

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            localStorage.setItem('sidebarStatus', 1)
        } else {
            localStorage.setItem('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        localStorage.setItem('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    },
    SET_LANGUAGE: (state, language) => {
        state.language = language
        localStorage.setItem('language', language)
    }
}

const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
        commit('SET_LANGUAGE', language)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
