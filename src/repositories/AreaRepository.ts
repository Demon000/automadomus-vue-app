import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import Area, {
    AreaCategoriesMap,
    AreaUpdateData,
    areaHasAnyOfflineFlag,
    areaHasOfflineDeletedFlag,
} from '@/models/Area';
import { StoreMutations } from '@/dependencies';

export default class AreaRepository {
    private store: Store<StoreState>;

    constructor(store: Store<StoreState>) {
        this.store = store;
    }

    getAreas(): Area[] {
        return this.store.getters.areas;
    }

    getAreasPaginated(page = 0, limit = 0, filterDeleted = true, searchText = ''): Area[] {
        let areas = this.getAreas();

        if (filterDeleted) {
            areas = areas.filter((area: Area) =>
                !areaHasOfflineDeletedFlag(area),
            );
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

    getArea(id: string): Area | undefined {
        return this.store.getters.getAreaDetails(id);
    }

    setArea(area: Partial<Area>, id?: string): void {
        id = id || area.id;
        if (!id) {
            console.error('Trying to set area without an id', area);
            return;
        }

        this.store.commit(StoreMutations.SET_AREA, {
            id,
            area,
        });
    }

    deleteArea(id: string): void {
        return this.store.commit(StoreMutations.DELETE_AREA, id);
    }

    clearAreas(): void {
        const areas = this.getAreas();

        for (const area of areas) {
            if (!areaHasAnyOfflineFlag(area)) {
                this.deleteArea(area.id);
            }
        }
    }

    setAreaOfflineFlag(id: string, flag: number): void {
        const area = this.getArea(id);
        if (!area) {
            console.error(`Trying to set offline flag ${flag} for a non-existent area with id ${id}`);
            return;
        }

        const offlineFlags = (area.offlineFlags || 0) | flag;
        this.setArea({
            offlineFlags,
        }, id);
    }

    clearAreaOfflineFlags(id: string): void {
        this.setArea({
            offlineFlags: undefined,
        }, id);
    }

    setAreaOfflineUpdate(id: string, data: AreaUpdateData | undefined): void {
        const area = this.getArea(id);
        if (!area) {
            console.error(`Trying to set offline update data for a non-existent area with id ${id}`, data);
            return;
        }

        const offlineUpdateData = area.offlineUpdateData || {};
        Object.assign(offlineUpdateData, data);

        this.setArea({
            offlineUpdateData,
        }, id);
    }

    clearAreaOfflineUpdate(id: string): void {
        this.setArea({
            offlineUpdateData: undefined,
        }, id);
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
