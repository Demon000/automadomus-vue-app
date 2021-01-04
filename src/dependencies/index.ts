import { CONFIG_API_BASE_URL } from '@/config';

import _store, { _StoreMutations } from '@/dependencies/_store';
import _router, { _RouteNames } from '@/dependencies/_router';

import API, { APIEvents } from '@/api/API';
import UserAPI from '@/api/UserAPI';
import UserRepository from '@/repositories/UserRepository';
import UserService, { UserServiceEvent } from '@/services/UserService';

import AreasAPI from '@/api/AreasAPI';
import AreaRepository from '@/repositories/AreaRepository';
import AreaService, { AreaServiceEvent } from '@/services/AreaService';
import Area from '@/models/Area';
import NetworkTrackingService, { NetworkTrackerEvent } from '@/services/NetworkTrackingService';
import { AxiosError } from 'axios';
import PingAPI from '@/api/PingAPI';

const _api = new API(CONFIG_API_BASE_URL);

const _pingApi = new PingAPI(_api);
const _userApi = new UserAPI(_api);
const _userRepository = new UserRepository(_store);
const userService = new UserService(_userApi, _userRepository);

const _areasApi = new AreasAPI(_api);
const _areaRepository = new AreaRepository(_store);

const networkTrackingService = new NetworkTrackingService(_pingApi);
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

    console.error(message);
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

async function redirectToAreaDetails(id: string) {
    await _router.replace({
        name: _RouteNames.AREA_DETAILS,
        params: {
            areaId: id,
        },
    });
}

_api.emitter.on(APIEvents.NETWORK_ERROR, async () => {
    try {
        networkTrackingService.checkServerConnection();
    } catch (err) {
        console.error(err);
    }
});

networkTrackingService.emitter.on(NetworkTrackerEvent.STATUS_CHANGE, async () => {
    const status = networkTrackingService.getStatus();
    if (!status) {
        return;
    }

    await areaService.syncOfflineChanges();
});

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
    const loadedAreaId = _router.currentRoute.value.params.areaId;
    const routeName = _router.currentRoute.value.name;
    if (routeName !== _RouteNames.AREA_EDIT || area.id !== loadedAreaId) {
        return;
    }

    await redirectToAreaDetails(area.id);
});

areaService.emitter.on(AreaServiceEvent.AREA_ADDED, async (area: Area) => {
    const routeName = _router.currentRoute.value.name;
    if (routeName !== _RouteNames.AREA_ADD) {
        return;
    }

    await redirectToAreaDetails(area.id);
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
    networkTrackingService,
    userService,
    areaService,
    _store as store,
    _router as router,
    _StoreMutations as StoreMutations,
    _RouteNames as RouteNames,
};
