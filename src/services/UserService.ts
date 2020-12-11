import EventEmitter from 'eventemitter3';

import UserRepository from '@/repositories/UserRepository';
import UserAPI from '@/api/UserAPI';
import { isNetworkError } from '@/utils/misc';
import User, { UserLoginData } from '@/models/User';

export enum UserServiceEvent {
    USER_LOGGED_IN = 'user-logged-in',
    USER_LOGGED_OUT = 'user-logged-out',
    USER_LOGIN_ERROR = 'user-login-error',
    USER_LOGOUT_ERROR = 'user-logout-error',
    USER_GET_LOGGED_IN_ERROR = 'user-get-logged-in-error',
}

export default class UserService {
    public emitter: EventEmitter;
    private _userApi: UserAPI;
    private _userRepository: UserRepository;

    constructor(userApi: UserAPI, userRepository: UserRepository) {
        this._userApi = userApi;
        this._userRepository = userRepository;
        this.emitter = new EventEmitter();
    }

    async loginUser(data: UserLoginData): Promise<void> {
        let user;

        try {
            user = await this._userApi.postUserLogin(data);
        } catch (err) {
            this.emitter.emit(UserServiceEvent.USER_LOGIN_ERROR, err);
            return;
        }

        this._userRepository.setLoggedInUser(user);
        this.emitter.emit(UserServiceEvent.USER_LOGGED_IN, user);
    }

    async logoutUser(): Promise<void> {
        try {
            await this._userApi.postUserLogout();
        } catch (err) {
            this.emitter.emit(UserServiceEvent.USER_LOGOUT_ERROR, err);
            return;
        }

        this._userRepository.setLoggedInUser(undefined);
        this.emitter.emit(UserServiceEvent.USER_LOGGED_OUT);
    }

    async getLoggedInUser(): Promise<User | undefined> {
        try {
            const user = await this._userApi.getUser();
            this._userRepository.setLoggedInUser(user);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(UserServiceEvent.USER_GET_LOGGED_IN_ERROR, err);
                this._userRepository.setLoggedInUser(undefined);
            }
        }

        return this._userRepository.getLoggedInUser();
    }
}
