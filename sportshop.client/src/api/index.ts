function getFullUrl(endpoint: string) {
    return `api/${endpoint}`
}

function getHeaders(header = {}) {
    return {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            ...header,
        },
    }
}

export { methodGet as getApi } from './methods/get'
export { methodPost as postApi } from './methods/post'
export { methodPut as putApi } from './methods/put'
export { methodDelete as deleteApi } from './methods/delete'
