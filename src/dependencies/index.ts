import { CONFIG_API_BASE_URL, CONFIG_SOCKET_BASE_URL } from '@/config';

import _store, { _StoreMutations } from '@/dependencies/_store';
import _router, { _RouteNames, redirectToIndex, redirectToLogin } from '@/dependencies/_router';

import API, { APIEvent } from '@/api/API';
import UserAPI from '@/api/UserAPI';
import UserRepository from '@/repositories/UserRepository';
import UserService, { UserServiceEvent } from '@/services/UserService';

import AreasAPI from '@/api/AreasAPI';
import AreaRepository from '@/repositories/AreaRepository';
import AreaService, { AreaServiceEvent } from '@/services/AreaService';
import NetworkTrackingService, { NetworkTrackerEvent } from '@/services/NetworkTrackingService';
import PingAPI from '@/api/PingAPI';
import GeocodeAPI from '@/api/GeocodeAPI';
import GeocodeService from '@/services/GeocodeService';
import NotificationService, { NotificationServiceEvent } from '@/services/NotificationService';
import { APIError, errorToHTMLString } from '@/models/APIErrors';

const _api = new API(CONFIG_API_BASE_URL);

const _geocodeApi = new GeocodeAPI(_api);
const geocodeService = new GeocodeService(_geocodeApi);

const _pingApi = new PingAPI(_api);
const networkTrackingService = new NetworkTrackingService(_pingApi);

const _userApi = new UserAPI(_api);
const _userRepository = new UserRepository(_store);
const userService = new UserService(_userApi, _userRepository);

const notificationService = new NotificationService(CONFIG_SOCKET_BASE_URL);

_api.setAccessToken(userService.getAccessToken());
_api.setRefreshToken(userService.getRefreshToken());

const _areasApi = new AreasAPI(_api);
const _areaRepository = new AreaRepository(_store);
const areaService = new AreaService(
    _areasApi,
    _areaRepository,
    _userRepository,
);

async function logErrorMessage(err: APIError) {
    const messages = errorToHTMLString(err).split('<br>');
    for (const message of messages) {
        console.error(message);
    }
}

_api.emitter.on(APIEvent.NETWORK_ERROR, async () => {
    try {
        networkTrackingService.checkServerConnection();
    } catch (err) {
        console.error(err);
    }
});

_api.emitter.on(APIEvent.ACCESS_TOKEN_UPDATED, async (token: string) => {
    userService.setAccessToken(token);
    notificationService.authenticate(token);
});

_api.emitter.on(APIEvent.REFRESH_TOKEN_UPDATED, async (token: string) => {
    userService.setRefreshToken(token);
});

networkTrackingService.emitter.on(NetworkTrackerEvent.STATUS_CHANGE, async () => {
    const status = networkTrackingService.getStatus();
    if (!status) {
        return;
    }

    notificationService.connect();
    await areaService.syncOfflineChanges();
});

notificationService.emitter.on(NotificationServiceEvent.AREA_UPDATED, async (area) => {
    await areaService.setArea(area);
});

notificationService.emitter.on(NotificationServiceEvent.CONNECTION, () => {
    const accessToken = userService.getAccessToken();
    notificationService.authenticate(accessToken);
});

userService.emitter.on(
    UserServiceEvent.USER_GET_LOGGED_IN_ERROR,
    logErrorMessage,
);
userService.emitter.on(
    UserServiceEvent.USER_GET_LOGGED_IN_ERROR,
    redirectToLogin,
);
userService.emitter.on(UserServiceEvent.USER_LOGGED_IN, redirectToIndex);
userService.emitter.on(UserServiceEvent.USER_LOGGED_OUT, redirectToLogin);
userService.emitter.on(UserServiceEvent.USER_LOGIN_ERROR, logErrorMessage);
userService.emitter.on(UserServiceEvent.USER_LOGOUT_ERROR, logErrorMessage);

areaService.emitter.on(
    AreaServiceEvent.AREA_GET_CATEGORIES_ERROR,
    logErrorMessage,
);
areaService.emitter.on(AreaServiceEvent.AREA_GET_PAGE_ERROR, logErrorMessage);
areaService.emitter.on(
    AreaServiceEvent.AREA_GET_DETAILS_ERROR,
    logErrorMessage,
);
areaService.emitter.on(AreaServiceEvent.AREA_ADD_ERROR, logErrorMessage);
areaService.emitter.on(AreaServiceEvent.AREA_UPDATE_ERROR, logErrorMessage);
areaService.emitter.on(AreaServiceEvent.AREA_DELETE_ERROR, logErrorMessage);

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
    geocodeService,
    notificationService,
    _store as store,
    _router as router,
    _StoreMutations as StoreMutations,
    _RouteNames as RouteNames,
};
