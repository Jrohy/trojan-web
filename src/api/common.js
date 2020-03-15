import request from '@/utils/request'

export function version() {
    return request.get('/common/version')
}
