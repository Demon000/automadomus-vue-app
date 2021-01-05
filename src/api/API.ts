import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { camelKeys, snakeKeys } from 'js-convert-case/lib';
import { isNetworkError } from '@/utils/misc';
import EventEmitter from 'eventemitter3';

export enum APIEvents {
    NETWORK_ERROR = 'network-error',
    ACCESS_TOKEN_UPDATED = 'access-token-updated',
    REFRESH_TOKEN_UPDATED = 'refresh-token-update',
}

const ACCESS_TOKEN_HEADER_NAME = 'access-token';
const REFRESH_TOKEN_HEADER_NAME = 'refresh-token';

export default class API {
    public baseRequest: AxiosInstance;
    public uninterceptedBaseRequest: AxiosInstance;
    public emitter: EventEmitter;

    private accessToken: string;
    private refreshToken: string;

    constructor(baseURL: string, accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.emitter = new EventEmitter();

        const baseRequestConfig = {
            baseURL,
            withCredentials: true,
        };

        this.baseRequest = axios.create(baseRequestConfig);
        this.uninterceptedBaseRequest = axios.create(baseRequestConfig);

        this.baseRequest.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                if (this.accessToken) {
                    config.headers[ACCESS_TOKEN_HEADER_NAME] = this.accessToken;
                }

                if (this.refreshToken) {
                    config.headers[REFRESH_TOKEN_HEADER_NAME] = this.refreshToken;
                }

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
                console.log(response.headers);

                if (response.headers[ACCESS_TOKEN_HEADER_NAME]) {
                    this.emitter.emit(APIEvents.ACCESS_TOKEN_UPDATED, response.headers[ACCESS_TOKEN_HEADER_NAME]);
                }

                if (response.headers[REFRESH_TOKEN_HEADER_NAME]) {
                    this.emitter.emit(APIEvents.REFRESH_TOKEN_UPDATED, response.headers[REFRESH_TOKEN_HEADER_NAME]);
                }

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

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    setRefreshToken(token: string): void {
        this.refreshToken = token;
    }
}
