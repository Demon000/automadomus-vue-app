import User from '@/models/User';
import Page from '@/models/Page';

export interface AreaAddData {
    name: string;
    category: number | string;
    location: string;
    locationPoint: [number, number];
}

export interface AreaUpdateData {
    name?: string;
    category?: number | string;
    location?: string;
    locationPoint: [number, number];
    offlineFlags?: number;
}

export default interface Area {
    id: string;
    owner: User;
    name: string;
    category: number;
    location: string;
    locationPoint: [number, number];

    hasImage?: boolean;
    noDevices?: number;
    noControllers?: number;
    offlineFlags?: number;
}

export type IAreaPage = Page<Area>;
export type AreaCategoriesMap = { [key: number]: string };
export type AreaCategorySelectOption = {
    value: number,
    label: string,
};
export type AreasDetailsMap = { [key: string]: Area };
