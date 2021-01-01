import { CONFIG_API_BASE_URL } from '@/config';

// import {toastController} from '@ionic/vue';

import _store, { _StoreMutations } from '@/dependencies/_store';
import _router, { _RouteNames } from '@/dependencies/_router';

import API from '@/api/API';
import UserAPI from '@/api/UserAPI';
import UserRepository from '@/repositories/UserRepository';
import UserService, { UserServiceEvent } from '@/services/UserService';

import AreasAPI from '@/api/AreasAPI';
import AreaRepository from '@/repositories/AreaRepository';
import AreaService, { AreaServiceEvent } from '@/services/AreaService';
import Area from '@/models/Area';
import NetworkTracker from '@/network-tracker/NetworkTracker';
import { AxiosError } from 'axios';

const networkTracker = new NetworkTracker();

const _api = new API(CONFIG_API_BASE_URL);

const _userApi = new UserAPI(_api);
const _userRepository = new UserRepository(_store);
const userService = new UserService(_userApi, _userRepository);

const _areasApi = new AreasAPI(_api);
const _areaRepository = new AreaRepository(_store);
const areaService = new AreaService(
    _areasApi,
    _areaRepository,
    _userRepository,
);

async function createErrorToast(err: Error) {
    let message = `${err.message}<br>`;
    const response = (err as AxiosError).response;

    if (response && response.data.error && response.data.message) {
        message += response.data.message;
    }

    // const toast = await toastController
    //     .create({
    //         message: message,
    //         duration: 2000,
    //     });
    // return toast.present();
}

async function redirectToLogin() {
    await _router.replace({
        name: _RouteNames.LOGIN,
    });
}

async function redirectToIndex() {
    await _router.replace({
        name: _RouteNames.INDEX,
    });
}

async function redirectToAreaDetails(area: Area) {
    await _router.replace({
        name: _RouteNames.AREA_DETAILS,
        params: {
            areaId: area.id,
        },
    });
}

userService.emitter.on(
    UserServiceEvent.USER_GET_LOGGED_IN_ERROR,
    createErrorToast,
);
userService.emitter.on(
    UserServiceEvent.USER_GET_LOGGED_IN_ERROR,
    redirectToLogin,
);
userService.emitter.on(UserServiceEvent.USER_LOGGED_IN, redirectToIndex);
userService.emitter.on(UserServiceEvent.USER_LOGGED_OUT, redirectToLogin);
userService.emitter.on(UserServiceEvent.USER_LOGIN_ERROR, createErrorToast);
userService.emitter.on(UserServiceEvent.USER_LOGOUT_ERROR, createErrorToast);

areaService.emitter.on(AreaServiceEvent.AREA_UPDATED, async (area: Area) => {
    if (area.id !== _router.currentRoute.value.params.areaId) {
        return;
    }

    await redirectToAreaDetails(area);
});

areaService.emitter.on(AreaServiceEvent.AREA_ADDED, async (area: Area) => {
    await redirectToAreaDetails(area);
});

areaService.emitter.on(
    AreaServiceEvent.AREA_GET_CATEGORIES_ERROR,
    createErrorToast,
);
areaService.emitter.on(AreaServiceEvent.AREA_GET_PAGE_ERROR, createErrorToast);
areaService.emitter.on(
    AreaServiceEvent.AREA_GET_DETAILS_ERROR,
    createErrorToast,
);
areaService.emitter.on(AreaServiceEvent.AREA_ADD_ERROR, createErrorToast);
areaService.emitter.on(AreaServiceEvent.AREA_UPDATE_ERROR, createErrorToast);
areaService.emitter.on(AreaServiceEvent.AREA_DELETE_ERROR, createErrorToast);

_router.beforeEach(async (to, from, next) => {
    if (to.name === _RouteNames.LOGIN && _store.getters.loggedInUser) {
        return next({
            name: _RouteNames.INDEX,
        });
    }

    if (to.name !== _RouteNames.LOGIN && !_store.getters.loggedInUser) {
        await userService.getLoggedInUser();
    }

    if (to.name !== _RouteNames.LOGIN && !_store.getters.loggedInUser) {
        return next({
            name: _RouteNames.LOGIN,
        });
    }

    return next();
});

export {
    networkTracker,
    userService,
    areaService,
    _store as store,
    _router as router,
    _StoreMutations as StoreMutations,
    _RouteNames as RouteNames,
};
