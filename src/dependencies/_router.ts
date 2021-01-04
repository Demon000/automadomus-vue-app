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
            path: '/area-add',
            name: _RouteNames.AREA_ADD,
            component: AreaFieldsPage,
        },
    ],
});

export default _router;
