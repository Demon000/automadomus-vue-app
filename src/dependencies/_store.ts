import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import StoreState from '@/models/StoreState';
import Area, { AreaCategoriesMap } from '@/models/Area';
import User from '@/models/User';

export enum _StoreMutations {
    SET_LOGGED_IN_USER = 'setLoggedInUser',
    SET_AREA_DETAILS = 'setAreaDetails',
    CLEAR_AREAS_DETAILS_MAP = 'clearAreasDetailsMap',
    DELETE_AREA_DETAILS = 'deleteAreaDetails',
    SET_AREA_CATEGORIES = 'setAreaCategories',
    SET_ACCESS_TOKEN = 'setAccessToken',
    SET_REFRESH_TOKEN = 'setRefreshToken',
}

export default createStore({
    plugins: [createPersistedState()],
    state: {
        loggedInUser: undefined,
        areaCategories: {},
        areasDetailsMap: {},
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
        [_StoreMutations.SET_AREA_DETAILS](state: StoreState, area: Area) {
            if (!(area.id in state.areasDetailsMap)) {
                state.areasDetailsMap[area.id] = area;
                return;
            }

            Object.assign(state.areasDetailsMap[area.id], area);
        },
        [_StoreMutations.CLEAR_AREAS_DETAILS_MAP](state: StoreState) {
            state.areasDetailsMap = {};
        },
        [_StoreMutations.DELETE_AREA_DETAILS](state: StoreState, id: string) {
            delete state.areasDetailsMap[id];
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
        areas(state: StoreState): Area[] {
            return Object.values(state.areasDetailsMap);
        },
        areaCategories(state: StoreState): AreaCategoriesMap {
            return state.areaCategories;
        },
        getAreaCategoryText: (state: StoreState) => (value: number): string => {
            return state.areaCategories[value];
        },
        getAreaDetails: (state: StoreState) => (id: string): Area | undefined => {
            return state.areasDetailsMap[id];
        },
    },
});
