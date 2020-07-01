import request from '@/utils/request'

export function start() {
    return request.post('/trojan/start')
}

export function stop() {
    return request.post('/trojan/stop')
}

export function restart() {
    return request.post('/trojan/restart')
}

export function update() {
    return request.post('/trojan/update')
}

export function getLoglevel() {
    return request.get('/trojan/loglevel')
}

export function setLoglevel(data) {
    return request.post('/trojan/loglevel', data)
}

export function setDomain(data) {
    return request.post('/trojan/domain', data)
}

export function trojanSwitch(data) {
    return request.post('/trojan/switch', data)
}
