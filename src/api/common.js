import request from '@/utils/request'

export function version() {
    return request.get('/common/version')
}

export function serverInfo() {
    return request.get('/common/serverInfo')
}

export function setLoginInfo(data) {
    return request.post('/common/loginInfo', data)
}
