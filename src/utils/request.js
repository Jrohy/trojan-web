import axios from 'axios'
import store from '@/store/index.js'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import i18n from '@/lang'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

function validateStatus(status) {
    const { t } = i18n.global
    switch (status) {
    case 400:
        ElMessage.error(t('request.requestError'))
        break
    case 401:
        ElMessage.warning({
            message: t('request.authFail')
        })
        store.commit('LOGIN_OUT')
        setTimeout(() => {
            window.location.reload()
        }, 1000)
        return
    case 403:
        ElMessage.warning({
            ElMessage: t('request.accessDenied')
        })
        break
    case 404:
        ElMessage.warning({
            ElMessage: t('request.notFound')
        })
        break
    case 500:
        if (!store.state.noerror) {
            ElMessage.warning({
                ElMessage: t('request.serverError')
            })
        }
        break
    }
    return status >= 200 && status < 300
}

var instance = axios.create({
    timeout: 8000,
    baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api',
    validateStatus
})

const progressWhiteList = ['/auth/loginUser'] // no progress whitelist
// 添加请求拦截器
instance.interceptors.request.use(
    function(config) {
        if (store.state.nprogress && progressWhiteList.indexOf(config.url) === -1) {
            NProgress.start()
        }
        // 请求头添加token
        if (store.state.UserToken) {
            config.headers.Authorization = `Bearer ${store.state.UserToken}`
        }
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        NProgress.done()
        return response.data
    },
    err => {
        if (store.state.nprogress && err.response === undefined && !store.state.noerror) {
            ElMessage.error(i18n.global.t('request.connectError'))
        }
        NProgress.done()
        return Promise.reject(err.response)
    }
)

export default instance
