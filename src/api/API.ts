import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelKeys, snakeKeys } from 'js-convert-case/lib';

export default class API {
    public baseRequest: AxiosInstance;

    constructor(baseURL: string) {
        this.baseRequest = axios.create({
            baseURL,
            withCredentials: true,
        });

        this.baseRequest.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                config.data = snakeKeys(config.data, {
                    recursive: true,
                    recursiveInArray: true,
                });
                return config;
            },
            (error: Error) => {
                return Promise.reject(error);
            },
        );

        this.baseRequest.interceptors.response.use(
            (response: AxiosResponse) => {
                response.data = camelKeys(response.data, {
                    recursive: true,
                    recursiveInArray: true,
                });
                return response;
            },
            (error: Error) => {
                return Promise.reject(error);
            },
        );
    }
}
