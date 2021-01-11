import API from '@/api/API';
import Area, {
    AreaCategoriesMap,
    AreaAddData,
    IAreaPage,
    AreaUpdateData,
} from '../models/Area';

export default class AreasAPI {
    private api: API;

    constructor(api: API) {
        this.api = api;
    }

    async areasGetCategories(): Promise<AreaCategoriesMap> {
        const response = await this.api.baseRequest.get('/areas/categories');
        return response.data;
    }

    async areasGetPage(page = 0, limit = 0): Promise<IAreaPage> {
        const response = await this.api.baseRequest.get('/areas', {
            params: {
                page,
                limit,
            },
        });
        return response.data as IAreaPage;
    }

    async areasPost(data: AreaAddData): Promise<Area> {
        const response = await this.api.baseRequest.post('/areas', data);
        return response.data as Area;
    }

    async areasGetArea(id: string): Promise<Area> {
        const response = await this.api.baseRequest.get(`/areas/${id}`);
        return response.data as Area;
    }

    async areasPatchArea(id: string, data: AreaUpdateData): Promise<Area> {
        const response = await this.api.baseRequest.patch(`/areas/${id}`, data);
        return response.data as Area;
    }

    async areasDeleteArea(id: string): Promise<void> {
        await this.api.baseRequest.delete(`/areas/${id}`);
    }
}
