import { createRouter, createWebHashHistory } from 'vue-router';
import AreasPage from '@/areas-page/AreasPage.vue';
import LoginPage from '@/login-page/LoginPage.vue';
import AreaDetailsPage from '@/area-details-page/AreaDetailsPage.vue';
import AreaFieldsPage from '@/area-fields-page/AreaFieldsPage.vue';

export enum _RouteNames {
    INDEX = 'index',
    LOGIN = 'login',
    AREAS = 'areas',
    AREA_DETAILS = 'area-details',
    AREA_EDIT = 'area-edit',
    AREA_ADD = 'area-add',
    AREA_SOLVE_CONFLICT = 'area-solve-conflict',
}

const _router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: _RouteNames.INDEX,
            redirect: {
                name: _RouteNames.AREAS,
            },
        },
        {
            path: '/login',
            name: _RouteNames.LOGIN,
            component: LoginPage,
        },
        {
            path: '/areas',
            name: _RouteNames.AREAS,
            component: AreasPage,
        },
        {
            path: '/area-details/:areaId',
            name: _RouteNames.AREA_DETAILS,
            component: AreaDetailsPage,
            props: route => {
                return {
                    areaId: route.params.areaId,
                };
            },
        },
        {
            path: '/area-edit/:areaId',
            name: _RouteNames.AREA_EDIT,
            component: AreaFieldsPage,
            props: route => {
                return {
                    areaId: route.params.areaId,
                };
            },
        },
        {
            path: '/area-conflict/:areaId',
            name: _RouteNames.AREA_SOLVE_CONFLICT,
            component: AreaFieldsPage,
            props: route => {
                return {
                    areaId: route.params.areaId,
                    conflict: true,
                };
            },
        },
        {
            path: '/area-add',
            name: _RouteNames.AREA_ADD,
            component: AreaFieldsPage,
        },
    ],
});

export async function redirectToLogin(): Promise<void> {
    await _router.replace({
        name: _RouteNames.LOGIN,
    });
}

export async function redirectToIndex(): Promise<void> {
    await _router.replace({
        name: _RouteNames.INDEX,
    });
}

export default _router;
