import API from '@/api/API';
import { Position } from '@/models/Position';

export default class GeocodeAPI {
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async forward(address: string): Promise<Position> {
        const response = await this.api.baseRequest.get('/forward', {
            params: {
                address,
            },
        });

        return {
            lat: response.data.latitude,
            lng: response.data.longitude,
        };
    }

    async reverse(position: Position): Promise<string> {
        const response = await this.api.baseRequest.get('/reverse', {
            params: {
                latitude: position.lat,
                longitude: position.lng,
            },
        });

        return response.data.address;
    }
}
