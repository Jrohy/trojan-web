import request from '@/utils/request'

export function userList() {
    return request.get('/trojan/user')
}

export function addUser(data) {
    return request.post('/trojan/user', data)
}

export function delUser(id) {
    return request.delete(`/trojan/user?id=${id}`)
}
