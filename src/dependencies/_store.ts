import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import StoreState from '@/models/StoreState';
import Area, { AreaCategoriesMap } from '@/models/Area';
import User from '@/models/User';

export enum _StoreMutations {
    SET_LOGGED_IN_USER = 'setLoggedInUser',
    SET_AREA = 'setAreaDetails',
    DELETE_AREA = 'deleteAreaDetails',
    SET_AREA_CATEGORIES = 'setAreaCategories',
    SET_ACCESS_TOKEN = 'setAccessToken',
    SET_REFRESH_TOKEN = 'setRefreshToken',
}

export default createStore({
    plugins: [createPersistedState()],
    state: {
        loggedInUser: undefined,
        areaCategories: {},
        idAreaMap: {},
        accessToken: undefined,
        refreshToken: undefined,
    } as StoreState,
    mutations: {
        [_StoreMutations.SET_LOGGED_IN_USER](
            state: StoreState,
            user: User | undefined,
        ) {
            state.loggedInUser = user;
        },
        [_StoreMutations.SET_ACCESS_TOKEN](
            state: StoreState,
            token: string,
        ) {
            state.accessToken = token;
        },
        [_StoreMutations.SET_REFRESH_TOKEN](
            state: StoreState,
            token: string,
        ) {
            state.refreshToken = token;
        },
        [_StoreMutations.SET_AREA](state: StoreState, { id, area }: { id: string, area: Partial<Area>}) {
            if (!state.idAreaMap[id]) {
                state.idAreaMap[id] = area;
                return;
            }

            Object.assign(state.idAreaMap[id], area);
        },
        [_StoreMutations.DELETE_AREA](state: StoreState, id: string) {
            delete state.idAreaMap[id];
        },
        [_StoreMutations.SET_AREA_CATEGORIES](
            state: StoreState,
            categories: AreaCategoriesMap,
        ) {
            state.areaCategories = categories;
        },
    },
    getters: {
        loggedInUser(state: StoreState): User | undefined {
            return state.loggedInUser;
        },
        accessToken(state: StoreState): string | undefined {
            return state.accessToken;
        },
        refreshToken(state: StoreState): string | undefined {
            return state.refreshToken;
        },
        areas(state: StoreState): Partial<Area>[] {
            return Object.values(state.idAreaMap);
        },
        areaCategories(state: StoreState): AreaCategoriesMap {
            return state.areaCategories;
        },
        getAreaCategoryText: (state: StoreState) => (value: number): string => {
            return state.areaCategories[value];
        },
        getAreaDetails: (state: StoreState) => (id: string): Partial<Area> | undefined => {
            return state.idAreaMap[id];
        },
    },
});
