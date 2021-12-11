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

export function setClashRules(data) {
    return request.post('/common/clashRules', data)
}

export function getClashRules() {
    return request.get('/common/clashRules')
}

export function resetClashRules() {
    return request.delete('/common/clashRules')
}
