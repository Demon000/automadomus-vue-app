import API from '@/api/API';

export default class PingAPI {
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async ping(): Promise<boolean> {
        try {
            await this.api.uninterceptedBaseRequest.get('/ping');
        } catch (err) {
            return false;
        }

        return true;
    }
}
