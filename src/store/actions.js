import { loginUser } from '@/api/permission'

export default {
    loginUser({ commit }) {
        return new Promise((resolve, reject) => {
            loginUser().then(res => {
                if (res.code === 200) {
                    commit('SET_ADMIN', res.data.username === 'admin')
                }
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
