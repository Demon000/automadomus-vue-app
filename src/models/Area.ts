import User from '@/models/User';
import Page from '@/models/Page';

export interface AreaAddData {
    name: string;
    category: number | string;
    location: string;
}

export interface AreaUpdateData {
    name?: string;
    category?: number | string;
    location?: string;
    offlineFlags?: number;
}

export default interface Area {
    id: string;
    owner: User;
    name: string;
    category: number;
    location: string;

    hasImage?: boolean;
    noDevices?: number;
    noControllers?: number;
    locationPoint?: [number, number];
    offlineFlags?: number;
}

export type IAreaPage = Page<Area>;
export type AreaCategoriesMap = { [key: number]: string };
export type AreasDetailsMap = { [key: string]: Area };
