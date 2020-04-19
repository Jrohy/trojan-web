import Router from 'vue-router'

import Login from '@/views/login/login'
import Register from '@/views/login/register'
import NotFound from '@/views/errorPage/404'
import Forbidden from '@/views/errorPage/403'
import Layout from '@/views/layout/index'
import Home from '@/views/home/index'

/* 初始路由 */
export default new Router({
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        }
    ]
})

/* 准备动态添加的路由 */
export const MainRoutes = [
    {
        path: '',
        component: Layout,
        name: 'container',
        redirect: 'home',
        meta: {
            name: '首页'
        },
        children: [
            {
                path: 'home',
                component: Home,
                name: 'home',
                meta: {
                    name: '首页',
                    icon: 'nested'
                }
            }
        ]
    },
    {
        path: '/403',
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
]
