import API from '@/api/API';
import Location from '@/models/Location';

export default class GeocodeAPI {
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async forward(address: string): Promise<Location> {
        const response = await this.api.baseRequest.get('/geocode/forward', {
            params: {
                address,
            },
        });

        return {
            address: response.data.address,
            lat: response.data.latitude,
            lng: response.data.longitude,
        };
    }

    async reverse(position: Location): Promise<string> {
        const response = await this.api.baseRequest.get('/geocode/reverse', {
            params: {
                latitude: position.lat,
                longitude: position.lng,
            },
        });

        return response.data.address;
    }
}
