import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { isNetworkError, objectToSnake, objectToCamel } from '@/utils/misc';
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

    private accessToken: string | undefined;
    private refreshToken: string | undefined;

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
                if (this.accessToken) {
                    config.headers[ACCESS_TOKEN_HEADER_NAME] = this.accessToken;
                }

                if (this.refreshToken) {
                    config.headers[REFRESH_TOKEN_HEADER_NAME] = this.refreshToken;
                }

                config.data = objectToSnake(config.data);

                return config;
            },
            (error: Error) => {
                return Promise.reject(error);
            },
        );

        this.baseRequest.interceptors.response.use(
            (response: AxiosResponse) => {
                const accessToken = response.headers[ACCESS_TOKEN_HEADER_NAME];
                if (accessToken) {
                    this.setAccessToken(accessToken);
                    this.emitter.emit(APIEvents.ACCESS_TOKEN_UPDATED, accessToken);
                }

                const refreshToken = response.headers[REFRESH_TOKEN_HEADER_NAME];
                if (refreshToken) {
                    this.setRefreshToken(refreshToken);
                    this.emitter.emit(APIEvents.REFRESH_TOKEN_UPDATED, refreshToken);
                }

                response.data = objectToCamel(response.data);
                return response;
            },
            (error: AxiosError) => {
                if (isNetworkError(error)) {
                    this.emitter.emit(APIEvents.NETWORK_ERROR, error);
                }

                if (error.response && error.response.data) {
                    return Promise.reject(objectToCamel(error.response.data));
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
