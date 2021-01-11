import User from '@/models/User';
import Page from '@/models/Page';

export enum AreaOfflineFlags {
    ADDED = 1 << 0,
    UPDATED = 1 << 1,
    DELETED = 1 << 2,
    CONFLICT = 1 << 3,
}

export const AreaOfflineAnyFlag = AreaOfflineFlags.ADDED |
    AreaOfflineFlags.UPDATED |
    AreaOfflineFlags.DELETED |
    AreaOfflineFlags.CONFLICT;

export interface AreaAddData {
    name: string;
    category: number;
    location: string;
    locationPoint: [number, number];
    image?: string;
}

export type AreaUpdateData = Partial<AreaAddData> & {
    offlineFlags?: number;
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

    offlineFlags?: number;
    offlineUpdateData?: AreaUpdateData;
}

export type IAreaPage = Page<Area>;
export type AreaCategoriesMap = { [key: number]: string };
export type AreaCategorySelectOption = {
    value: number,
    label: string,
};
export type IdPartialAreaMap = { [key: string]: Partial<Area> };

export function areaHasOfflineFlag(area: Area | undefined, flag: number): boolean {
    return area !== undefined && area.offlineFlags !== undefined && !!(area.offlineFlags & flag);
}

export function areaHasAnyOfflineFlag(area: Area | undefined): boolean {
    return areaHasOfflineFlag(area, AreaOfflineAnyFlag);
}

export function areaHasOfflineAddedFlag(area: Area | undefined): boolean {
    return areaHasOfflineFlag(area, AreaOfflineFlags.ADDED);
}

export function areaHasOfflineUpdatedFlag(area: Area | undefined): boolean {
    return areaHasOfflineFlag(area, AreaOfflineFlags.UPDATED);
}

export function areaHasOfflineDeletedFlag(area: Area | undefined): boolean {
    return areaHasOfflineFlag(area, AreaOfflineFlags.DELETED);
}

export function areaOverrideUpdateData(area: Area): Area {
    if (!area?.offlineUpdateData) {
        return area;
    }

    return Object.assign({}, area, area.offlineUpdateData);
}

export function areaBackgroundImage(area: Area | undefined, thumbnailFirst = false): string {
    if (!area) {
        return '';
    }

    let image;
    if (thumbnailFirst) {
        image = area.thumbnail || area.image;
    } else {
        image = area.image || area.thumbnail;
    }

    if (!image) {
        return '';
    }

    return `url(data:image/png;base64,${image})`;
}
