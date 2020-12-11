import { AreaCategoriesMap, AreasDetailsMap } from '@/models/Area';
import User from '@/models/User';

export default interface StoreState {
    loggedInUser: User | undefined;
    areasDetailsMap: AreasDetailsMap;
    areaCategories: AreaCategoriesMap;
}
