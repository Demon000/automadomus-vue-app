import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelKeys, snakeKeys } from 'js-convert-case/lib';
import { isNetworkError } from '@/utils/misc';
import EventEmitter from 'eventemitter3';

export enum APIEvents {
    NETWORK_ERROR = 'network-error',
}

export default class API {
    public baseRequest: AxiosInstance;
    public uninterceptedBaseRequest: AxiosInstance;
    public emitter: EventEmitter;

    constructor(baseURL: string) {
        this.emitter = new EventEmitter();

        const baseRequestConfig = {
            baseURL,
            withCredentials: true,
        };

        this.baseRequest = axios.create(baseRequestConfig);
        this.uninterceptedBaseRequest = axios.create(baseRequestConfig);

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
                if (isNetworkError(error)) {
                    this.emitter.emit(APIEvents.NETWORK_ERROR, error);
                }

                return Promise.reject(error);
            },
        );
    }
}
