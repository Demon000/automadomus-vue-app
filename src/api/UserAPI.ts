import API from '@/api/API';
import User, { UserLoginData } from '@/models/User';

export default class UserAPI {
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async postUserLogin(data: UserLoginData): Promise<User> {
        const response = await this.api.baseRequest.post('/user/login', {
            username: data.username,
            password: data.password,
        });
        return response.data as User;
    }

    async postUserLogout(): Promise<void> {
        await this.api.baseRequest.post('/user/logout');
    }

    async getUser(): Promise<User> {
        const response = await this.api.baseRequest.get('/user');
        return response.data as User;
    }
}
