import request from '@/utils/request'

export function userList() {
    return request.get('/trojan/user')
}

export function addUser(data) {
    return request.post('/trojan/user', data)
}

export function updateUser(data) {
    return request.post('/trojan/user/update', data)
}

export function delUser(id) {
    return request.delete(`/trojan/user?id=${id}`)
}

export function setExpire(data) {
    return request.post('/trojan/user/expire', data)
}

export function cancelExpire(id) {
    return request.delete(`/trojan/user/expire?id=${id}`)
}
