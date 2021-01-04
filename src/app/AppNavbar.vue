<template>
    <div class="app-navbar">
        <ui-top-app-bar
                content-selector=""
                class="ui-top-app-bar"
                :type="1"
        >
            {{ title }}
            <template #nav-icon>
                <ui-icon-button
                        @click="onBackButtonClick"
                >
                    <i class="mdi mdi-arrow-left"></i>
                </ui-icon-button>
            </template>

            <template #toolbar="{ toolbarItemClass }">
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
            <template v-if="!networkStatus">
                <span
                        class="offline-text"
                        @click="onOfflineTextClick"
                >
                    Offline! Checking server connection in {{ networkStatusCheckTime }} seconds.
                    Retry?
                </span>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { networkTrackingService } from '@/dependencies';
import { NetworkTrackerEvent } from '@/services/NetworkTrackingService';

export default defineComponent({
    name: 'AppNavbar',
    props: {
        title: String,
        hasBackButton: Boolean,
        hasMenuButton: Boolean,
        contentSelector: String,
    },
    data() {
        return {
            networkStatus: true as boolean,
            networkStatusCheckTime: 0 as number,
        };
    },
    async mounted() {
        networkTrackingService.emitter.on(NetworkTrackerEvent.STATUS_CHANGE, this.onNetworkStateChange, this);
        this.onNetworkStateChange();
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
    },
});
</script>

<style scoped>
.ui-top-app-bar {
    position: initial;
}

.sub {
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;

    color: var(--navbar-network-tracker-fg-color);
    background: var(--navbar-bg-color);

    display: flex;
    justify-content: center;

    cursor: pointer;
}
</style>
