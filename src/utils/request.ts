// src/utils/request.ts

import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosError,
    AxiosResponse,
    AxiosHeaders,
    AxiosRequestHeaders,
} from 'axios';
import { getToken, removeToken } from './token';
import router from '../router';


/**
 * Create an Axios instance with predefined configurations.
 */
const http: AxiosInstance = axios.create({
    baseURL: 'https://4d05995d-c8cf-4640-a38d-dd1828b3fbdb.mock.pstmn.io',
    timeout: 5000,
});

/**
 * Request interceptor to add the Authorization header if a token exists.
 */
http.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getToken();
        if (token) {
            if (!(config.headers instanceof AxiosHeaders)) {
                if (config.headers) {
                    // If headers are a plain object, safely assign Authorization
                    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
                } else {
                    // If headers are undefined, create a new headers object
                    config.headers = {Authorization: `Bearer ${token}`} as AxiosRequestHeaders;
                }
            } else {
                // Use AxiosHeaders methods if headers are AxiosHeaders instance
                config.headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle responses and errors.
 */
http.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        // Directly return the response data without expecting a nested 'data' property
        return response.data;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error(error);

        if (error.response && error.response.status === 401) {
            removeToken();
            router.navigate('/login');
            window.location.reload();
        }

        return Promise.reject(error);
    }
);

export { http };