import EventEmitter from 'eventemitter3';
import ObjectID from 'bson-objectid';

import { isNetworkError } from '@/utils/misc';

import Area, {
    AreaCategoriesMap,
    AreaAddData,
    AreaUpdateData,
} from '@/models/Area';

import AreasAPI from '@/api/AreasAPI';
import AreaRepository from '@/repositories/AreaRepository';
import UserRepository from '@/repositories/UserRepository';

export enum AreaServiceEvent {
    AREA_GET_CATEGORIES_ERROR = 'area-get-categories-error',
    AREA_GET_PAGE_ERROR = 'area-get-page-error',
    AREA_GET_PAGE_NETWORK_ERROR = 'area-get-page-network-error',
    AREA_GET_DETAILS_ERROR = 'area-get-details-error',
    AREA_ADDED = 'area-added',
    AREA_ADD_ERROR = 'area-add-error',
    AREA_UPDATED = 'area-updated',
    AREA_UPDATE_ERROR = 'area-update-error',
    AREA_DELETED = 'area-deleted',
    AREA_DELETE_ERROR = 'area-delete-error',
    OFFLINE_MODIFICATIONS = 'offline-modifications',
}

export default class AreaService {
    public emitter: EventEmitter;
    private _areasApi: AreasAPI;
    private _areaRepository: AreaRepository;
    private _userRepository: UserRepository;

    constructor(
        areasApi: AreasAPI,
        areaRepository: AreaRepository,
        userRepository: UserRepository,
    ) {
        this._areasApi = areasApi;
        this._areaRepository = areaRepository;
        this._userRepository = userRepository;
        this.emitter = new EventEmitter();
    }

    async getAreaCategories(): Promise<AreaCategoriesMap | undefined> {
        try {
            const categories = await this._areasApi.areasGetCategories();
            this._areaRepository.setAreaCategories(categories);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_CATEGORIES_ERROR, err);
                return;
            }
        }

        return this._areaRepository.getAreaCategories();
    }

    getAreaCategoryText(value: number | undefined): string | undefined {
        if (!value && value !== 0) {
            return undefined;
        }

        return this._areaRepository.getAreaCategoryText(value);
    }

    async getOrLoadAreasPage(page = 0, limit = 0): Promise<Array<Area> | false> {
        try {
            const areasPage = await this._areasApi.areasGetPage(page, limit);

            if (page === 0) {
                this._areaRepository.clearAreasDetailsMap();
            }

            if (!areasPage.noItems) {
                return false;
            }

            for (const area of areasPage.items) {
                this._areaRepository.setAreaDetails(area);
            }
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_PAGE_ERROR, err);
                return false;
            }
        }

        const areas = this._areaRepository.getAreasPaginated(page, limit);
        if (!areas) {
            return false;
        }

        return areas;
    }

    async getAreaDetails(id: string): Promise<Area | undefined> {
        try {
            const area = await this._areasApi.areasGetArea(id);

            this._areaRepository.setAreaDetails(area);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_DETAILS_ERROR, err);
                return;
            }
        }

        return this._areaRepository.getAreaDetails(id);
    }

    async addArea(data: AreaAddData): Promise<void> {
        let areaResponse;

        try {
            areaResponse = await this._areasApi.areasPost(data);
            this._areaRepository.setAreaDetails(areaResponse);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_ADD_ERROR, err);
                return;
            }

            areaResponse = {
                id: new ObjectID().toHexString(),
                owner: this._userRepository.getLoggedInUser(),
                ...data,
            } as Area;
            this._areaRepository.addAreaOffline(areaResponse);
        }

        const area = this._areaRepository.getAreaDetails(areaResponse.id);

        this.emitter.emit(AreaServiceEvent.AREA_ADDED, area);

        if (area.offlineFlags) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }
    }

    async updateArea(id: string, data: AreaUpdateData): Promise<void> {
        try {
            const areaResponse = await this._areasApi.areasPatchArea(id, data);
            this._areaRepository.setAreaDetails(areaResponse);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_UPDATE_ERROR, err);
                return;
            }

            this._areaRepository.updateAreaDetailsOffline(id, data);
        }

        const area = this._areaRepository.getAreaDetails(id);

        this.emitter.emit(AreaServiceEvent.AREA_UPDATED, area);

        if (area.offlineFlags) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }
    }

    async deleteArea(id: string): Promise<void> {
        let offlineModifications = false;

        try {
            await this._areasApi.areasDeleteArea(id);
            this._areaRepository.deleteAreaDetails(id);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_DELETE_ERROR, err);
                return;
            }

            this._areaRepository.deleteAreaDetailsOffline(id);
            offlineModifications = true;
        }

        this.emitter.emit(AreaServiceEvent.AREA_DELETED, id);

        if (offlineModifications) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }
    }
}
