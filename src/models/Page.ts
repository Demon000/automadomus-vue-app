import TotalItemsInfo from '@/models/TotalItemsInfo';

export default interface Page<T> extends TotalItemsInfo {
    limit: number;
    skip: number;
    noItems: number;
    noTotalItems: number;
    noItemsBefore: number;
    noItemsAfter: number;
    page: number;
    noPages: number;
    noPagesBefore: number;
    noPagesAfter: number;
    items: T[];
}
