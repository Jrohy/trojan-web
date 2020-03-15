const User = () => import('@/views/user')

const dynamicRoutes = [
    {
        path: '/user',
        component: User,
        name: 'user',
        meta: {
            name: '用户管理',
            icon: 'example'
        }
    }
]

export default dynamicRoutes
