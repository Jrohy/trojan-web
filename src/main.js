import Vue from 'vue'
import App from '@/App'
import store from '@/store/index'
import router from '@/router/index'
import ELEMENT from 'element-ui'
import '@/styles/index.scss' // global css

import * as globalFilter from './filters/filters'
import '@/icons'

for (var key in globalFilter) {
    Vue.filter(key, globalFilter[key])
}

Vue.use(ELEMENT)

Vue.config.productionTip = false

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    if (store.state.UserToken) {
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
    render: h => h(App)
})
