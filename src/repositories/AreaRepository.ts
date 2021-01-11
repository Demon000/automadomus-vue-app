import { Store } from 'vuex';
import StoreState from '@/models/StoreState';
import Area, {
    AreaCategoriesMap,
    areaHasAnyFlag,
    areaHasOfflineDeletedFlag, areaHasFlag, AreaAddData, AreaUpdateData,
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
            areas = areas
                .filter((area: Area) => {
                    return area.name.toLowerCase().includes(lowerSearchText);
                })
                .sort((area: Area) => {
                    return area.flags || 0;
                });
        }

        return areas
            .sort((first: Area, second: Area) => {
                return -first.id.localeCompare(second.id);
            })
            .slice(page * limit, (page + 1) * limit);
    }

    getFlaggedAreas(flag: number): Area[] {
        return this.store.getters.areas
            .filter((area: Area) => {
                return areaHasFlag(area, flag);
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
            if (!areaHasAnyFlag(area)) {
                this.deleteArea(area.id);
            }
        }
    }

    setAreaFlag(id: string, flag: number): void {
        const area = this.getArea(id);
        if (!area) {
            console.error(`Trying to set offline flag ${flag} for a non-existent area with id ${id}`);
            return;
        }

        const flags = (area.flags || 0) | flag;
        this.setArea({
            flags,
        }, id);
    }

    clearAreaFlags(id: string): void {
        this.setArea({
            flags: undefined,
        }, id);
    }

    setAreaSavedUpdate(id: string, data: AreaUpdateData | undefined): void {
        const area = this.getArea(id);
        if (!area) {
            console.error(`Trying to set offline update data for a non-existent area with id ${id}`, data);
            return;
        }

        const savedUpdateData = area.savedUpdateData || {};
        Object.assign(savedUpdateData, data);

        this.setArea({
            savedUpdateData: savedUpdateData,
        }, id);
    }

    clearAreaSavedUpdate(id: string): void {
        this.setArea({
            savedUpdateData: undefined,
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
