import request from '@/utils/request'

export function setQuota(data) {
    return request.post('/trojan/data', data)
}

export function cleanData(id) {
    return request.delete(`/trojan/data?id=${id}`)
}
