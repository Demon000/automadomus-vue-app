import EventEmitter from 'eventemitter3';
import ObjectID from 'bson-objectid';

import Area, {
    AreaAddData,
    AreaCategoriesMap,
    AreaFlags,
    areaHasAnyFlag,
    areaHasFlag,
    areaHasOfflineAddedFlag,
    areaHasOfflineDeletedFlag,
    areaHasOfflineUpdatedFlag,
    AreaUpdateData,
} from '@/models/Area';

import AreasAPI from '@/api/AreasAPI';
import AreaRepository from '@/repositories/AreaRepository';
import UserRepository from '@/repositories/UserRepository';
import { isNetworkError } from '@/utils/errors';
import { isErrorAreaUpdatedAtInvalid } from '@/models/APIErrors';

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
    SYNC_DONE = 'sync-done',
}

export default class AreaService {
    public emitter: EventEmitter;
    private areasAPI: AreasAPI;
    private areaRepository: AreaRepository;
    private userRepository: UserRepository;

    constructor(
        areasApi: AreasAPI,
        areaRepository: AreaRepository,
        userRepository: UserRepository,
    ) {
        this.areasAPI = areasApi;
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
        this.emitter = new EventEmitter();
    }

    async getAreaCategories(): Promise<AreaCategoriesMap | undefined> {
        try {
            const categories = await this.areasAPI.areasGetCategories();
            this.areaRepository.setAreaCategories(categories);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_CATEGORIES_ERROR, err);
                return;
            }
        }

        return this.areaRepository.getAreaCategories();
    }

    getAreaCategoryText(value: number | undefined): string | undefined {
        if (!value && value !== 0) {
            return undefined;
        }

        return this.areaRepository.getAreaCategoryText(value);
    }

    async getOrLoadAreasPage(page = 0, limit = 0, searchText = ''): Promise<Area[] | false> {
        try {
            const areasPage = await this.areasAPI.areasGetPage(page, limit);

            if (page === 0 && !searchText) {
                this.areaRepository.clearAreas();
            }

            if (!areasPage.noItems) {
                return false;
            }

            for (const area of areasPage.items) {
                this.areaRepository.setArea(area);
            }
        } catch (err) {
            if (isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_PAGE_NETWORK_ERROR);
            } else {
                this.emitter.emit(AreaServiceEvent.AREA_GET_PAGE_ERROR, err);
                return false;
            }
        }

        const areas = this.areaRepository.getAreasPaginated(page, limit, true, searchText);
        if (!areas) {
            return false;
        }

        return areas;
    }

    isLocallyAdded(id: string): boolean {
        const area = this.areaRepository.getArea(id);
        return !!area && areaHasFlag(area, AreaFlags.OFFLINE_ADDED);
    }

    setArea(area: Area): void {
        this.areaRepository.setArea(area);
        this.emitter.emit(AreaServiceEvent.AREA_UPDATED, area);
    }

    async getArea(id: string): Promise<Area | undefined> {
        try {
            const area = await this.areasAPI.areasGetArea(id);

            this.areaRepository.setArea(area);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_GET_DETAILS_ERROR, err);
                return;
            }
        }

        return this.areaRepository.getArea(id);
    }

    async addArea(data: AreaAddData, handleNetworkError = true, emitEvent = true): Promise<Area | undefined> {
        let response;

        try {
            response = await this.areasAPI.areasPost(data);
            this.areaRepository.setArea(response);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_ADD_ERROR, err);
                throw err;
            }

            if (!handleNetworkError) {
                throw err;
            }

            const id = new ObjectID().toHexString();
            const owner = this.userRepository.getLoggedInUser();
            response = {
                id,
                owner,
                ...data,
            } as Area;

            this.areaRepository.setArea(response, id);
            this.areaRepository.setAreaFlag(id, AreaFlags.OFFLINE_ADDED);
        }

        const area = this.areaRepository.getArea(response.id);

        if (emitEvent) {
            this.emitter.emit(AreaServiceEvent.AREA_ADDED, area);
        }

        if (emitEvent && areaHasAnyFlag(area)) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }

        return area;
    }

    async updateArea(id: string, data: AreaUpdateData, handleNetworkError = true,
        emitEvent = true, clearConflict = false, skipUpdatedAtInvalid = true): Promise<void> {
        try {
            let response;

            if (this.isLocallyAdded(id)) {
                response = data;
            } else {
                response = await this.areasAPI.areasPatchArea(id, data);
            }

            this.areaRepository.setArea(response, id);

            if (clearConflict) {
                this.areaRepository.clearAreaFlags(id);
                this.areaRepository.clearAreaSavedUpdate(id);
            }
        } catch (err) {
            let setUpdateConflict = false;
            if (!isNetworkError(err)) {
                if (skipUpdatedAtInvalid && isErrorAreaUpdatedAtInvalid(err)) {
                    setUpdateConflict = true;
                } else {
                    this.emitter.emit(AreaServiceEvent.AREA_UPDATE_ERROR, err);
                    throw err;
                }
            }

            if (!handleNetworkError) {
                throw err;
            }

            this.areaRepository.setAreaSavedUpdate(id, data);
            const flag = setUpdateConflict ? AreaFlags.UPDATE_CONFLICT : AreaFlags.OFFLINE_UPDATED;
            this.areaRepository.setAreaFlag(id, flag);
        }

        const area = this.areaRepository.getArea(id);

        if (emitEvent) {
            this.emitter.emit(AreaServiceEvent.AREA_UPDATED, area);
        }

        if (emitEvent && areaHasAnyFlag(area)) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }
    }

    async deleteArea(id: string, handleNetworkError = true, emitEvent = true): Promise<void> {
        let offlineModifications = false;

        try {
            if (!this.isLocallyAdded(id)) {
                await this.areasAPI.areasDeleteArea(id);
            }

            this.areaRepository.deleteArea(id);
        } catch (err) {
            if (!isNetworkError(err)) {
                this.emitter.emit(AreaServiceEvent.AREA_DELETE_ERROR, err);
                throw err;
            }

            if (!handleNetworkError) {
                throw err;
            }

            this.areaRepository.setAreaFlag(id, AreaFlags.OFFLINE_DELETED);
            offlineModifications = true;
        }

        if (emitEvent) {
            this.emitter.emit(AreaServiceEvent.AREA_DELETED, id);
        }

        if (emitEvent && offlineModifications) {
            this.emitter.emit(AreaServiceEvent.OFFLINE_MODIFICATIONS);
        }
    }

    async syncAreaOfflineDeleted(area: Area): Promise<void> {
        const isDeleted = areaHasOfflineDeletedFlag(area);
        if (!isDeleted) {
            return;
        }

        try {
            await this.deleteArea(area.id, false, true);
            this.areaRepository.deleteArea(area.id);
        } catch (err) {
            console.error(err);
        }
    }

    async syncAreaOfflineAdded(area: Area): Promise<void> {
        const isAdded = areaHasOfflineAddedFlag(area);
        if (!isAdded) {
            return;
        }

        try {
            await this.addArea(area, false, false);
            this.areaRepository.deleteArea(area.id);
        } catch (err) {
            console.error(err);
        }
    }

    async syncAreaOfflineUpdated(area: Area): Promise<void> {
        const isUpdated = areaHasOfflineUpdatedFlag(area);
        if (!isUpdated) {
            return;
        }

        if (!area.savedUpdateData) {
            console.error(`Area with id ${area.id} updated offline but saved update data missing`);
            return;
        }

        try {
            await this.updateArea(area.id, area.savedUpdateData, false, false);
            this.areaRepository.clearAreaFlags(area.id);
            this.areaRepository.clearAreaSavedUpdate(area.id);
        } catch (err) {
            console.error(err);
            this.areaRepository.setAreaFlag(area.id, AreaFlags.UPDATE_CONFLICT);
        }
    }

    async syncAreaOfflineChanges(area: Area): Promise<void> {
        await this.syncAreaOfflineDeleted(area);
        await this.syncAreaOfflineAdded(area);
        await this.syncAreaOfflineUpdated(area);
    }

    async syncOfflineChanges(): Promise<void> {
        const areas = this.areaRepository.getFlaggedAreas(AreaFlags.OFFLINE_ADDED |
            AreaFlags.OFFLINE_UPDATED |
            AreaFlags.OFFLINE_DELETED);

        for (const area of areas) {
            await this.syncAreaOfflineChanges(area);
        }

        this.emitter.emit(AreaServiceEvent.SYNC_DONE);
    }
}
