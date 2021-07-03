import { loginUser } from '@/api/permission'

export default {
    loginUser({ commit }) {
        return new Promise((resolve, reject) => {
            loginUser().then(res => {
                if (res.code === 200) {
                    commit('SET_ADMIN', res.data.username === 'admin')
                } else if (res.code === 201) {
                    commit('LOGIN_OUT')
                    location.reload()
                }
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
