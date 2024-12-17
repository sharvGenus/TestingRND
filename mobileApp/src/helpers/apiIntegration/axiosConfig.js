import axios from 'axios';
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { replaceStack } from '../../navigation/navigationHelper';
import apiCalledConstants from './apiCalledConstants';

export class AxiosConfig {
    constructor(headers, isUnauthorized) {
        const { baseUrl } = config;
        this.http = axios.create({
            baseURL: baseUrl,
            withCredentials: true
        });

        this.http.interceptors.request.use(async (config) => {
            token = await AsyncStorage.getItem('token');
            config.headers = {
                'x-mobile-application': 1,
                ...config.headers,
                Authorization: !isUnauthorized ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
                ...headers
            };
            return config;
        });

        this.http.interceptors.response.use(
            function (response) {
                return [response.data, response.status];
            },
            function (error) {
                if (error.response) {
                    if (error.response.status && error.response.status === 401) {
                        Object.keys(apiCalledConstants).forEach((x) => {
                            delete apiCalledConstants[x];
                        });
                        AsyncStorage.multiRemove(['isEnabled', 'token', 'formID', 'headerValues', 'userData']);
                        return replaceStack('Login');
                    } else {
                        return Promise.reject(error.response.data);
                    }
                } else if (error.request) {
                    return Promise.reject(error.request);
                } else {
                    return Promise.reject(error);
                }
            }
        );
        for (const method of ['get', 'post', 'put', 'delete']) {
            this[method] = this.http[method];
        }
    }
}
export class AxiosConfigFormdata {
    constructor(headers) {
        const { baseUrl } = config;
        this.http = axios.create({
            baseURL: baseUrl,
            withCredentials: true
        });

        this.http.interceptors.request.use(async (config) => {
            token = await AsyncStorage.getItem('token');
            config.headers = {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'multipart/form-data',
                ...headers
            };
            return config;
        });

        this.http.interceptors.response.use(
            function (response) {
                return [response.data, response.status];
            },
            function (error) {
                if (error.response) {
                    if (error.response.status && error.response.status === 401) {
                        Object.keys(apiCalledConstants).forEach((x) => {
                            delete apiCalledConstants[x];
                        });
                        AsyncStorage.multiRemove(['isEnabled', 'token', 'formID', 'headerValues', 'userData']);
                        return replaceStack('Login');
                    } else if (error.response?.status === 409) {
                        return [error.response?.data?.message, error.response.status];
                    }
                    return Promise.reject(error.response.data);
                }
                if (error.request) {
                    return Promise.reject(error.request);
                } else {
                    return Promise.reject(error);
                }
            }
        );
        for (const method of ['get', 'post', 'put', 'delete']) {
            this[method] = this.http[method];
        }
    }
}
