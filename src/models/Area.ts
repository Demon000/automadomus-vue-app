import User from '@/models/User';
import Page from '@/models/Page';

export enum AreaFlags {
    OFFLINE_ADDED = 1 << 0,
    OFFLINE_UPDATED = 1 << 1,
    OFFLINE_DELETED = 1 << 2,
    UPDATE_CONFLICT = 1 << 3,
}

export const AreaAnyFlag = AreaFlags.OFFLINE_ADDED |
    AreaFlags.OFFLINE_UPDATED |
    AreaFlags.OFFLINE_DELETED |
    AreaFlags.UPDATE_CONFLICT;

export interface AreaAddData {
    name: string;
    category: number;
    location: string;
    locationPoint: [number, number];
    image?: string;
}

export type AreaUpdateData = Partial<AreaAddData> & {
    updatedAtTimestamp?: number;
};

export default interface Area {
    id: string;
    owner: User;
    name: string;
    category: number;
    location: string;
    locationPoint: [number, number];
    createdAtTimestamp: number;
    updatedAtTimestamp: number;

    image?: string;
    thumbnail?: string;

    noDevices?: number;
    noControllers?: number;

    flags?: number;
    savedUpdateData?: AreaUpdateData;
}

export type IAreaPage = Page<Area>;
export type AreaCategoriesMap = { [key: number]: string };
export type AreaCategorySelectOption = {
    value: number,
    label: string,
};
export type IdPartialAreaMap = { [key: string]: Partial<Area> };

export const EmptyArea: Area = {
    id: '',
    owner: {
        username: '',
        firstName: '',
        lastName: '',
    },
    name: '',
    category: 0,
    location: '',
    locationPoint: [0.0, 0.0],
    image: '',
    createdAtTimestamp: 0,
    updatedAtTimestamp: 0,
};

export function areaHasFlag(area: Area | undefined, flag: number): boolean {
    return area !== undefined && area.flags !== undefined && !!(area.flags & flag);
}

export function areaHasAnyFlag(area: Area | undefined): boolean {
    return areaHasFlag(area, AreaAnyFlag);
}

export function areaHasOfflineAddedFlag(area: Area | undefined): boolean {
    return areaHasFlag(area, AreaFlags.OFFLINE_ADDED);
}

export function areaHasOfflineUpdatedFlag(area: Area | undefined): boolean {
    return areaHasFlag(area, AreaFlags.OFFLINE_UPDATED);
}

export function areaHasOfflineDeletedFlag(area: Area | undefined): boolean {
    return areaHasFlag(area, AreaFlags.OFFLINE_DELETED);
}

export function areaHasUpdateConflictFlag(area: Area | undefined): boolean {
    return areaHasFlag(area, AreaFlags.UPDATE_CONFLICT);
}

export function areaOverrideUpdateData(area: Area): Area {
    if (!area?.savedUpdateData) {
        return area;
    }

    return Object.assign({}, area, area.savedUpdateData);
}
