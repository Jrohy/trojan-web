import axios from 'axios'
import store from '@/store/index.js'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

function validateStatus(status) {
    switch (status) {
    case 400:
        Message.error('请求出错')
        break
    case 401:
        Message.warning({
            message: '授权失败，请重新登录'
        })
        store.commit('LOGIN_OUT')
        setTimeout(() => {
            window.location.reload()
        }, 1000)
        return
    case 403:
        Message.warning({
            message: '拒绝访问'
        })
        break
    case 404:
        Message.warning({
            message: '请求错误,未找到该资源'
        })
        break
    case 500:
        if (!store.state.noerror) {
            Message.warning({
                message: '服务端错误'
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
            Message.error('连接服务器失败')
        }
        NProgress.done()
        return Promise.reject(err.response)
    }
)

export default instance
