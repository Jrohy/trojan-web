import request from '@/utils/request'

export function version() {
    return request.get('/common/version')
}

export function setLoginInfo(data) {
    return request.post('/common/loginInfo', data)
}
