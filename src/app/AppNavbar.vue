<template>
    <div class="app-navbar">
        <ui-top-app-bar
                content-selector=""
                class="ui-top-app-bar"
                :nav-icon="hasNavButton"
                :type="1"
        >
            {{ title }}
            <template #nav-icon v-if="hasNavButton">
                <slot name="nav-icon">
                    <ui-icon-button
                            @click="onBackButtonClick"
                    >
                        <i class="mdi mdi-arrow-left"></i>
                    </ui-icon-button>
                </slot>
            </template>

            <template #toolbar="{ toolbarItemClass }">
                <template
                        v-if="user"
                >
                    <span>
                        {{ user.firstName }} {{ user.lastName }}
                    </span>

                    <ui-icon-button
                            @click="onLogoutButtonClick"
                    >
                        <i class="mdi mdi-exit-to-app"></i>
                    </ui-icon-button>

                </template>
                <slot
                        name="toolbar"
                        v-bind="{
                            toolbarItemClass,
                        }"
                >
                </slot>
            </template>
        </ui-top-app-bar>
        <div class="sub">
            <slot name="sub"></slot>
            <div
                    class="network-status"
                    v-if="!networkStatus"
            >
                <span
                        class="offline-text"
                        @click="onOfflineTextClick"
                >
                    Offline! Checking server connection in {{ networkStatusCheckTime }} seconds.
                    Retry?
                </span>
            </div>
        </div>
        <div class="banner">
            <slot name="banner"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { networkTrackingService, userService } from '@/dependencies';
import { NetworkTrackerEvent } from '@/services/NetworkTrackingService';
import User from '@/models/User';

export default defineComponent({
    name: 'AppNavbar',
    props: {
        title: String,
        hasNavButton: Boolean,
        contentSelector: String,
    },
    data() {
        return {
            networkStatus: true as boolean,
            networkStatusCheckTime: 0 as number,
            user: undefined as User | undefined,
        };
    },
    async mounted() {
        networkTrackingService.emitter.on(NetworkTrackerEvent.STATUS_CHANGE, this.onNetworkStateChange, this);
        this.onNetworkStateChange();
        this.user = await userService.getLoggedInUser();
    },
    beforeUnmount() {
        networkTrackingService.emitter.off(NetworkTrackerEvent.STATUS_CHANGE, this.onNetworkStateChange);
    },
    methods: {
        async onBackButtonClick() {
            await this.$router.go(-1);
        },
        onNetworkStateChange() {
            this.networkStatusCheckTime = networkTrackingService.getCheckTimeMs() / 1000;
            this.networkStatus = networkTrackingService.getStatus();
        },
        onOfflineTextClick() {
            networkTrackingService.checkServerConnection(true);
        },
        onLogoutButtonClick() {
            userService.logoutUser();
        },
    },
});
</script>

<style scoped>
.app-navbar {
    z-index: 100;

    overflow: visible;
}

.ui-top-app-bar {
    position: initial;
}

.sub {
    background: var(--navbar-bg-color);

    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;

    cursor: pointer;
}

.network-status {
    vertical-align: middle;
    font-size: 14px;

    color: var(--navbar-network-tracker-fg-color);
    padding: 4px 0;
}

.banner {
    overflow: visible;
    position: relative;
}
</style>
