import { createApp } from 'vue'
import App from '@/App'
import ElementPlus from 'element-plus'
import '@/styles/index.scss' // global css
import store from '@/store/index'
import router from '@/router/index'
import i18n from './lang/index' // internationalization
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'// svg组件
import '@/icons'

const whiteList = ['/login', '/register'] // no redirect whitelist
const adminList = ['/trojan'] // need admin role

router.beforeEach(async (to, from, next) => {
    if (store.state.UserToken) {
        if (store.state.isAdmin === null) {
            await store.dispatch('loginUser')
        }
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

createApp(App).use(ElementPlus).use(router).use(store).use(i18n).component('svg-icon', SvgIcon).mount('#app')
