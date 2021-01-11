<template>
    <div class="areas-page page">
        <app-sidebar></app-sidebar>
        <app-navbar
                contentSelector=".areas-content"
                title="Areas"
                has-menu-button
                has-search-bar
                v-model:search-text="searchText"
                @searchTextSubmit="onSearchTextSubmit"
        >
            <template #toolbar>
                <div
                        :class="{
                            'search-field-visible': isSearchFieldVisible,
                        }"
                >
                    <ui-icon-button
                            v-model="isSearchFieldVisible"
                    >
                        <template #default>
                            <i
                                    class="mdi mdi-magnify"
                                    v-if="!isSearchFieldVisible"
                            ></i>
                            <i
                                    class="mdi mdi-close"
                                    v-if="isSearchFieldVisible"
                            ></i>
                        </template>
                    </ui-icon-button>
                </div>
                <ui-icon-button
                        @click="onRefreshButtonClick"
                >
                    <i class="mdi mdi-refresh"></i>
                </ui-icon-button>
                <ui-icon-button
                        @click="onAddButtonClick"
                >
                    <i class="mdi mdi-plus"></i>
                </ui-icon-button>
            </template>

            <template #sub>
                <height-transition>
                    <div
                            class="search-field"
                            v-show="isSearchFieldVisible"
                    >
                        <ui-textfield
                                fullwidth
                                v-model="searchText"
                                @keyup.enter="onSearchTextSubmit"
                                class="search-field-input"
                        >
                            Search
                        </ui-textfield>
                    </div>
                </height-transition>
            </template>

            <template
                    #banner
            >
                <height-transition>
                    <app-banner
                            v-if="showNewItemsAvailableBanner"
                    >
                        <template #text>
                            New items available!
                        </template>
                        <template #actions>
                            <ui-button
                                    @click="onNewItemsAvailableBannerReload"
                            >
                                RELOAD
                            </ui-button>
                            <ui-button
                                    @click="onNewItemsAvailableBannerDismiss"
                            >
                                DISMISS
                            </ui-button>
                        </template>
                    </app-banner>
                </height-transition>
            </template>
        </app-navbar>
        <div class="page-content">
            <template
                    v-for="item in items"
                    :key="item.id"
            >
                <area-item
                        class="area-item"
                        :area="item"
                        @click="onAreaItemClick(item.id)"
                ></area-item>
            </template>

            <infinite-scroll-bottom-detector
                    @visibility-change="onScrolledToBottom"
            ></infinite-scroll-bottom-detector>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { areaService, notificationService, RouteNames } from '@/dependencies';
import { CONFIG_AREAS_PAGINATED_LIMIT } from '@/config';

import Area from '@/models/Area';

import InfiniteScrollBottomDetector from '@/util-components/InfiniteScrollBottomDetector.vue';

import AppNavbar from '@/app/AppNavbar.vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AreaItem from '@/areas-page/AreaItem.vue';
import { AreaServiceEvent } from '@/services/AreaService';
import AppBanner from '@/app/AppBanner.vue';
import HeightTransition from '@/util-components/HeightTransition.vue';
import { NotificationServiceEvent } from '@/services/NotificationService';

export default defineComponent({
    name: 'AreasPage',
    components: {
        HeightTransition,
        AppSidebar,
        AppNavbar,
        AppBanner,
        AreaItem,
        InfiniteScrollBottomDetector,
    },
    data() {
        return {
            items: [] as Area[],
            page: -1,
            RouteNames: RouteNames,
            scrolledToBottom: false,
            searchText: '',
            isSearchFieldVisible: false,
            showNewItemsAvailableBanner: false,
        };
    },
    mounted() {
        this.reloadPages();

        areaService.emitter.on(AreaServiceEvent.SYNC_DONE, this.onSyncDone, this);
        notificationService.emitter.on(NotificationServiceEvent.AREA_ADDED, this.onAreaAddedDeleted, this);
        notificationService.emitter.on(NotificationServiceEvent.AREA_DELETED, this.onAreaAddedDeleted, this);
    },
    beforeUnmount() {
        areaService.emitter.off(AreaServiceEvent.SYNC_DONE, this.onSyncDone);
        notificationService.emitter.off(NotificationServiceEvent.AREA_ADDED, this.onAreaAddedDeleted, this);
        notificationService.emitter.off(NotificationServiceEvent.AREA_DELETED, this.onAreaAddedDeleted, this);
    },
    methods: {
        onSearchTextSubmit() {
            this.reloadPages();
        },
        async loadItemsPage(page = 0, searchText = ''): Promise<boolean> {
            const items = await areaService.getOrLoadAreasPage(
                page,
                CONFIG_AREAS_PAGINATED_LIMIT,
                searchText,
            );

            if (!items || !items.length) {
                return false;
            }

            this.items = this.items.concat(items);

            return true;
        },
        async loadNextPage(): Promise<boolean> {
            const hasLoadedAnything = await this.loadItemsPage(this.page + 1, this.searchText);
            if (!hasLoadedAnything) {
                return false;
            }

            this.page++;

            return hasLoadedAnything;
        },
        async loadNextPageUntilNotScrolledToBottom() {
            if (!this.scrolledToBottom) {
                return;
            }

            const hasLoadedAnything = await this.loadNextPage();
            if (!hasLoadedAnything) {
                return;
            }

            setTimeout(this.loadNextPageUntilNotScrolledToBottom, 0);
        },
        async reloadPages() {
            this.page = -1;
            this.items = [];

            await this.loadNextPageUntilNotScrolledToBottom();
        },
        onScrolledToBottom(status: boolean) {
            this.scrolledToBottom = status;
            if (!status) {
                return;
            }

            this.loadNextPageUntilNotScrolledToBottom();
        },
        async onAreaItemClick(areaId: string) {
            await this.$router.push({
                name: RouteNames.AREA_DETAILS,
                params: {
                    areaId,
                },
            });
        },
        async onAddButtonClick() {
            await this.$router.push({
                name: RouteNames.AREA_ADD,
            });
        },
        async onRefreshButtonClick() {
            await this.reloadPages();
        },
        async onNewItemsAvailableBannerReload() {
            await this.reloadPages();
            this.showNewItemsAvailableBanner = false;
        },
        onNewItemsAvailableBannerDismiss() {
            this.showNewItemsAvailableBanner = false;
        },
        onSyncDone() {
            this.showNewItemsAvailableBanner = true;
        },
        onAreaAddedDeleted() {
            this.showNewItemsAvailableBanner = true;
        },
    },
});
</script>

<style scoped>
@import '../app/page.css';

.area-item {
    cursor: pointer;
}

.search-field {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px 4px;
}

.search-field-visible .mdc-icon-button::before,
.search-field-visible .mdc-icon-button.mdc-ripple-surface--hover::before {
    opacity: 0.12;
    background: #ffffff;
}

.search-field-animation-enter-active,
.search-field-animation-leave-active {
    transition:
            max-height 0.25s ease,
            padding 0.25s ease;
    overflow: hidden;
    max-height: 56px;
}

.search-field-animation-enter-from,
.search-field-animation-leave-to {
    max-height: 0;
    padding: 0 16px 0;
}

</style>
