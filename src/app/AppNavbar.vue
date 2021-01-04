<template>
    <div class="app-navbar">
        <ui-top-app-bar
                content-selector=""
                class="ui-top-app-bar"
                :nav-icon="hasBackButton"
                :type="1"
        >
            {{ title }}
            <template #nav-icon v-if="hasBackButton">
                <ui-icon-button
                        @click="onBackButtonClick"
                >
                    <i class="mdi mdi-arrow-left"></i>
                </ui-icon-button>
            </template>

            <template #toolbar="{ toolbarItemClass }">
                <ui-icon-button
                        v-model="isSearchFieldVisible"
                        v-if="hasSearchBar"
                >
                    <template #default="{ onClass, offClass }">
                        <i class="mdi mdi-magnify" :class="offClass"></i>
                        <i class="mdi mdi-close" :class="onClass"></i>
                    </template>
                </ui-icon-button>
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
            <div
                    class="search-field"
                    v-if="isSearchFieldVisible"
            >
                <ui-textfield
                        class="search-field__ui-textfield"
                        fullwidth
                        v-model="searchTextInput"
                        @keyup.enter="onSearchTextSubmit"
                >
                    Search
                </ui-textfield>
            </div>
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
        hasSearchBar: Boolean,
        contentSelector: String,
        searchText: {
            type: String,
            default: '',
        },
    },
    emits: [
        'searchTextSubmit',
        'update:searchText',
    ],
    data() {
        return {
            isSearchFieldVisible: false,
            networkStatus: true as boolean,
            networkStatusCheckTime: 0 as number,
        };
    },
    computed: {
        searchTextInput: {
            get(): string {
                return this.searchText;
            },
            set(value: string) {
                this.$emit('update:searchText', value);
            },
        },
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
        onSearchTextSubmit() {
            this.$emit('searchTextSubmit');
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
    background: var(--navbar-bg-color);

    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;

    cursor: pointer;
}

.search-field {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
}

.network-status {
    vertical-align: middle;
    font-size: 14px;

    color: var(--navbar-network-tracker-fg-color);
    padding: 4px 0;
}
</style>
