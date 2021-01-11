import { AreaCategoriesMap, IdPartialAreaMap } from '@/models/Area';
import User from '@/models/User';

export default interface StoreState {
    loggedInUser: User | undefined;
    idAreaMap: IdPartialAreaMap;
    areaCategories: AreaCategoriesMap;
    accessToken: string | undefined;
    refreshToken: string | undefined;
}
