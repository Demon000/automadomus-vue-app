import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import Area, { AreaCategoriesMap, AreaUpdateData } from '@/models/Area';
import { StoreMutations } from '@/dependencies';

export enum AreaOfflineFlags {
    ADDED = 1 << 0,
    UPDATED = 1 << 1,
    DELETED = 1 << 2,
    CONFLICT = 1 << 3,
}

export default class AreaRepository {
    private store: Store<StoreState>;

    constructor(store: Store<StoreState>) {
        this.store = store;
    }

    getAreasPaginated(page = 0, limit = 0, filterDeleted = true, searchText = ''): Area[] {
        let areas = this.store.getters.areas;

        if (filterDeleted) {
            areas = areas.filter((area: Area) => {
                const offlineFlags = area.offlineFlags || 0;
                return !(offlineFlags & AreaOfflineFlags.DELETED);
            });
        }

        if (searchText) {
            const lowerSearchText = searchText.toLowerCase();
            areas = areas.filter((area: Area) => {
                return area.name.toLowerCase().includes(lowerSearchText);
            });
        }

        return areas
            .sort((first: Area, second: Area) => {
                return -first.id.localeCompare(second.id);
            })
            .slice(page * limit, (page + 1) * limit);
    }

    getOfflineChangedAreas(): Area[] {
        return this.store.getters.areas
            .filter((area: Area) => {
                return !!area.offlineFlags;
            });
    }

    clearAreasDetailsMap(): void {
        this.store.commit(StoreMutations.CLEAR_AREAS_DETAILS_MAP);
    }

    getAreaDetails(id: string): Area | undefined {
        return this.store.getters.getAreaDetails(id);
    }

    setAreaDetails(area: Area): void {
        this.store.commit(StoreMutations.SET_AREA_DETAILS, area);
    }

    addAreaOffline(area: Area): void {
        if (!area.offlineFlags) {
            area.offlineFlags = 0;
        }
        area.offlineFlags |= AreaOfflineFlags.ADDED;

        this.store.commit(StoreMutations.SET_AREA_DETAILS, area);
    }

    updateAreaDetailsOffline(id: string, data: AreaUpdateData): void {
        if (!data.offlineFlags) {
            data.offlineFlags = 0;
        }
        data.offlineFlags |= AreaOfflineFlags.UPDATED;

        this.store.commit(StoreMutations.SET_AREA_DETAILS, {
            id,
            ...data,
        });
    }

    deleteAreaDetails(id: string): void {
        return this.store.commit(StoreMutations.DELETE_AREA_DETAILS, id);
    }

    deleteAreaDetailsOffline(id: string): void {
        const area = this.getAreaDetails(id);
        if (!area) {
            console.error(`Trying to delete non-existent area with id: ${id}?`);
            return;
        }

        if (!area.offlineFlags) {
            area.offlineFlags = 0;
        }
        area.offlineFlags |= AreaOfflineFlags.DELETED;
        this.setAreaDetails(area);
    }

    clearAreaDetailsOfflineFlags(id: string): void {
        const area = this.getAreaDetails(id);
        if (!area) {
            console.error(`Trying to clear offline flags for non-existent area with id: ${id}?`);
            return;
        }

        area.offlineFlags = 0;
        this.setAreaDetails(area);
    }

    setAreaCategories(categories: AreaCategoriesMap): void {
        this.store.commit(StoreMutations.SET_AREA_CATEGORIES, categories);
    }

    getAreaCategories(): AreaCategoriesMap {
        return this.store.getters.areaCategories;
    }

    getAreaCategoryText(value: number): string {
        return this.store.getters.getAreaCategoryText(value);
    }
}
