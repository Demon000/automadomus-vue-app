import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import Area, { AreaCategoriesMap, AreaUpdateData } from '@/models/Area';
import { StoreMutations } from '@/dependencies';

export enum AreaOfflineFlags {
    ADDED = 1 << 0,
    UPDATED = 1 << 1,
    DELETED = 1 << 2,
}

export default class AreaRepository {
    private _store: Store<StoreState>;

    constructor(store: Store<StoreState>) {
        this._store = store;
    }

    getAreasPage(page = 0, limit = 0): Array<Area> {
        return this._store.getters.areas
            .filter((area: Area) => {
                const offlineFlags = area.offlineFlags || 0;
                return !(offlineFlags & AreaOfflineFlags.DELETED);
            })
            .sort((first: Area, second: Area) => {
                return -first.id.localeCompare(second.id);
            })
            .slice(page * limit, (page + 1) * limit);
    }

    clearAreasDetailsMap(): void {
        this._store.commit(StoreMutations.CLEAR_AREAS_DETAILS_MAP);
    }

    getAreaDetails(id: string): Area {
        return this._store.getters.getAreaDetails(id);
    }

    setAreaDetails(area: Area): void {
        this._store.commit(StoreMutations.SET_AREA_DETAILS, area);
    }

    addAreaOffline(area: Area): void {
        if (!area.offlineFlags) {
            area.offlineFlags = 0;
        }
        area.offlineFlags |= AreaOfflineFlags.ADDED;

        this._store.commit(StoreMutations.SET_AREA_DETAILS, area);
    }

    updateAreaDetailsOffline(id: string, data: AreaUpdateData): void {
        if (!data.offlineFlags) {
            data.offlineFlags = 0;
        }
        data.offlineFlags |= AreaOfflineFlags.UPDATED;

        this._store.commit(StoreMutations.SET_AREA_DETAILS, data);
    }

    deleteAreaDetails(id: string): void {
        return this._store.commit(StoreMutations.DELETE_AREA_DETAILS, id);
    }

    deleteAreaDetailsOffline(id: string): void {
        const area = this.getAreaDetails(id);
        if (!area.offlineFlags) {
            area.offlineFlags = 0;
        }
        area.offlineFlags |= AreaOfflineFlags.DELETED;
        this.setAreaDetails(area);
    }

    setAreaCategories(categories: AreaCategoriesMap): void {
        this._store.commit(StoreMutations.SET_AREA_CATEGORIES, categories);
    }

    getAreaCategories(): AreaCategoriesMap {
        return this._store.getters.areaCategories;
    }

    getAreaCategoryText(value: number): string {
        return this._store.getters.getAreaCategoryText(value);
    }
}
