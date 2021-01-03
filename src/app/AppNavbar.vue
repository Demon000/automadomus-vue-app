<template>
    <div class="app-navbar">
        <div class="top">
            <div class="start">
                <mdd-icon
                        name="mdi mdi-arrow-left"
                        v-if="hasBackButton"
                        @click="onBackButtonClick"
                >
                </mdd-icon>
                <slot name="start"></slot>
            </div>
            <div class="middle">
                <div class="title"> {{ title }} </div>
            </div>
            <div class="end">
                <slot name="end"></slot>
            </div>
        </div>
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

import MddIcon from '@/mdd-components/MddIcon.vue';
import { networkTrackingService } from '@/dependencies';

export default defineComponent({
    name: 'AppNavbar',
    components: {
        MddIcon,
    },
    props: {
        title: String,
        hasBackButton: Boolean,
        hasMenuButton: Boolean,
    },
    data() {
        return {
            networkStatus: true as boolean,
            networkStatusCheckTime: 0 as number,
        };
    },
    async mounted() {
        networkTrackingService.on(this.onNetworkStateChange, true);
    },
    beforeUnmount() {
        networkTrackingService.off(this.onNetworkStateChange);
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
.app-navbar {
    --bg: var(--navbar-bg-color, #000000);
    --horizontal-padding: var(--navbar-horizontal-padding, 16px);
    --line-height: var(--navbar-line-height, 36px);
    --vertical-padding: var(--navbar-vertical-padding, 10px);

    box-sizing: border-box;
    height: var(--height);
    line-height: var(--line-height);
    padding: var(--vertical-padding) var(--horizontal-padding);

    background: var(--bg);
}

.top,
.start,
.end,
.sub {
    display: flex;
}

.end {
    margin-left: auto;
}

.title {
    font-size: 20px;
}

.mdd-icon {
    padding: 6px;
    margin-left: -6px;
    margin-right: 6px;

    line-height: 24px;
    border-radius: 50%;
    cursor: pointer;

    transition: 0.125s background ease-out;

    --hover-bg: var(--navbar-action-button-hover-bg);
    --active-bg: var(--navbar-action-button-active-bg);
}

.mdd-icon:hover {
    background: var(--hover-bg);
}

.mdd-icon:active {
    background: var(--active-bg);
}

.sub {
    font-size: 14px;
    line-height: 16px;

    color: rgba(0, 0, 0, 0.57);

    display: flex;
    justify-content: center;
}

.offline-text {
    cursor: pointer;
    user-select: none;
}
</style>
