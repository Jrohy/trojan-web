const User = () => import('@/views/user')
const Trojan = () => import('@/views/trojan')

const dynamicRoutes = [
    {
        path: '/user',
        component: User,
        name: 'user',
        meta: {
            name: '用户管理',
            icon: 'user'
        }
    },
    {
        path: '/trojan',
        component: Trojan,
        name: 'trojan',
        meta: {
            name: 'trojan管理',
            icon: 'table'
        }
    }
]

export default dynamicRoutes
