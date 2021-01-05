import Location from '@/models/Location';
import GeocodeAPI from '@/api/GeocodeAPI';

export default class GeocodeService {
    private geocodeApi: GeocodeAPI;

    constructor(geocodeApi: GeocodeAPI) {
        this.geocodeApi = geocodeApi;
    }

    async getPosition(address: string): Promise<Location> {
        return await this.geocodeApi.forward(address);
    }

    async getAddress(position: Location): Promise<string> {
        return await this.geocodeApi.reverse(position);
    }
}
