import { AxiosConfig, AxiosConfigFormdata } from './axiosConfig';

async function post(url, data, headers) {
    const conn = new AxiosConfig(headers);
    return conn.post(url, data);
}

async function postWithoutToken(url, data, headers) {
    const conn = new AxiosConfig(headers, false);
    return conn.post(url, data);
}

async function get(url, params, headers) {
    const conn = new AxiosConfig(headers);
    return conn.get(url, params);
}

async function put(url, data, headers) {
    const conn = new AxiosConfig(headers);
    return conn.put(url, data);
}

async function del(url, params, headers) {
    const conn = new AxiosConfig(headers);
    return conn.delete(url + params);
}
async function postFormData(url, data, headers) {
    const conn = new AxiosConfigFormdata(headers);
    return conn.post(url, data);
}

async function putFormData(url, data, headers) {
    const conn = new AxiosConfigFormdata(headers);
    return conn.put(url, data);
}

export default {
    post,
    get,
    put,
    del,
    postWithoutToken,
    postFormData,
    putFormData
};
