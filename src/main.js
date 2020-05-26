import Vue from 'vue'
import App from '@/App'
import store from '@/store/index'
import router from '@/router/index'
import ELEMENT from 'element-ui'
import i18n from './lang' // internationalization
import '@/styles/index.scss' // global css
import '@/icons'

Vue.use(ELEMENT, {
    i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

const whiteList = ['/login', '/register'] // no redirect whitelist
const adminList = ['/trojan'] // need admin role

router.beforeEach((to, from, next) => {
    if (store.state.UserToken) {
        if (!store.state.isAdmin) {
            router.options.routes.map((x) => {
                if (adminList.indexOf(x.path) !== -1) {
                    x.hidden = true
                }
            })
        }
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
