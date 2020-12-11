<template>
    <div class="app-navbar">
        <!--        <ion-toolbar class="toolbar">-->
        <!--            <ion-buttons slot="start">-->
        <!--                <template v-if="hasBackButton">-->
        <!--                    <ion-back-button></ion-back-button>-->
        <!--                </template>-->
        <!--                <template v-if="hasMenuButton">-->
        <!--                    <ion-menu-button auto-hide="false"></ion-menu-button>-->
        <!--                </template>-->
        <!--            </ion-buttons>-->
        <!--            <ion-buttons class="actions-container" slot="end">-->
        <!--                <slot name="actions"></slot>-->
        <!--                <app-connectivity-status></app-connectivity-status>-->
        <!--            </ion-buttons>-->
        <!--            <ion-title>-->
        <!--                {{ title }}-->
        <!--            </ion-title>-->
        <!--        </ion-toolbar>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLogo from './AppLogo.vue';
// import {IonBackButton, IonButtons, IonMenuButton, IonTitle, IonToolbar} from '@ionic/vue';
import AppConnectivityStatus from '@/app/AppConnectivityStatus.vue';

export default defineComponent({
    name: 'AppNavbar',
    components: {
        AppLogo,
        // IonToolbar,
        // IonButtons,
        // IonBackButton,
        // IonMenuButton,
        // IonTitle,
        AppConnectivityStatus,
    },
    props: {
        title: String,
        hasBackButton: Boolean,
        hasMenuButton: Boolean,
    },
});
</script>

<style scoped>
.toolbar {
    --background: var(--navbar-bg-color);
}

.actions-container:deep(.action-icon) {
    display: block;

    font-size: 20px;
    width: 36px;
    height: 36px;
    line-height: 36px;

    text-align: center;

    border-radius: 50%;

    cursor: pointer;
}

.actions-container:deep(.action-icon:hover) {
    background: var(--navbar-area-action-button-bg-color);
}

.connectivity-icon .text {
    font-size: 20px;
}
</style>
