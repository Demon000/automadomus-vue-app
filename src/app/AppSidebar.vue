<template>
    <div class="app-sidebar">
        <!--        <ion-menu side="start" menu-id="app-sidebar-menu" content-id="app-sidebar-content">-->
        <!--            <ion-content id="app-sidebar-content">-->
        <!--                <div class="sidebar-item">-->
        <!--                    <div class="logo-container">-->
        <!--                        <app-logo></app-logo>-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--                <template v-if="user">-->
        <!--                    <div-->
        <!--                            class="sidebar-item"-->
        <!--                            v-on:click="onHomeButtonClick"-->
        <!--                    >-->
        <!--                        <i class="icon mdi mdi-home"></i>-->
        <!--                        <span>Home</span>-->
        <!--                    </div>-->
        <!--                    <div class="sidebar-item">-->
        <!--                        <i class="icon mdi mdi-account"></i>-->
        <!--                        <span>{{ user.firstName }} {{ user.lastName }}</span>-->
        <!--                    </div>-->
        <!--                    <div-->
        <!--                            class="sidebar-item"-->
        <!--                            v-on:click="onLogoutButtonClick"-->
        <!--                    >-->
        <!--                        <i class="icon mdi mdi-exit-to-app"></i>-->
        <!--                        <span>-->
        <!--                        Logout-->
        <!--                    </span>-->
        <!--                    </div>-->
        <!--                </template>-->
        <!--            </ion-content>-->
        <!--        </ion-menu>-->
    </div>
</template>

<script lang="ts">
// import {
//     IonMenu,
//     IonContent,
//     IonIcon,
// } from "@ionic/vue";
import { defineComponent } from 'vue';

import { RouteNames, userService } from '@/dependencies';

import AppLogo from '@/app/AppLogo.vue';

import User from '@/models/User';

export default defineComponent({
    name: 'AppSidebar',
    components: {
        // IonMenu,
        // IonContent,
        // IonIcon,
        AppLogo,
    },
    data() {
        return {
            user: undefined as User | undefined,
        };
    },
    mounted() {
        this.reloadUser();
    },
    methods: {
        async reloadUser(): Promise<void> {
            this.user = await userService.getLoggedInUser();
        },
        async onHomeButtonClick(): Promise<void> {
            await this.$router.push({
                name: RouteNames.AREAS,
                query: {
                    page: 0,
                },
            });
        },
        async onLogoutButtonClick(): Promise<void> {
            await userService.logoutUser();
        },
    },
});
</script>

<style scoped>
#app-sidebar-content {
    cursor: initial;
    pointer-events: initial;
}

.sidebar-item {
    padding: 16px 24px;
    line-height: 24px;
    border-bottom: 1px solid var(--menu-bottom-border-color);

    display: flex;

    vertical-align: middle;

    cursor: pointer;

    z-index: 100;
}

.sidebar-item > * {
    display: block;
}

.sidebar-item .icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
    margin-right: 24px;
}

.logo-container {
    font-size: 20px;
}
</style>
