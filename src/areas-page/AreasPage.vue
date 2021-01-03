<template>
    <div class="areas-page page">
        <app-sidebar></app-sidebar>
        <app-navbar :has-menu-button="true" title="Areas">
            <template v-slot:end>
                <mdd-icon
                        class="mdi mdi-plus"
                        @click="onAddButtonClick"
                ></mdd-icon>
            </template>
        </app-navbar>
        <div class="areas-content">
            <template
                    v-for="item in items"
                    :key="item.id"
            >
                <area-item
                        class="area-item"
                        :area="item"
                        v-on:click="onAreaItemClick(item.id)"
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

import { areaService, RouteNames } from '@/dependencies';
import { CONFIG_AREAS_PAGINATED_LIMIT } from '@/config';

import Area from '@/models/Area';

import InfiniteScrollBottomDetector from '@/util-components/infinite-scroll/InfiniteScrollBottomDetector.vue';

import AppNavbar from '@/app/AppNavbar.vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AreaItem from '@/areas-page/AreaItem.vue';
import MddFab from '@/mdd-components/MddFab.vue';
import MddIcon from '@/mdd-components/MddIcon.vue';

export default defineComponent({
    name: 'AreasPage',
    components: {
        AppSidebar,
        AppNavbar,
        AreaItem,
        InfiniteScrollBottomDetector,
        MddFab,
        MddIcon,
    },
    data() {
        return {
            items: [] as Array<Area>,
            page: -1,
            RouteNames: RouteNames,
            scrolledToBottom: false,
        };
    },
    mounted() {
        this.resetLoadedPages();
        this.loadNextPageUntilNotScrolledToBottom();
    },
    methods: {
        async loadItemsPage(page = 0): Promise<boolean> {
            const items = await areaService.getOrLoadAreasPage(
                page,
                CONFIG_AREAS_PAGINATED_LIMIT,
            );

            if (!items || !items.length) {
                return false;
            }

            this.items = this.items.concat(items);

            return true;
        },
        async resetLoadedPages() {
            this.page = -1;
            this.items = [];
        },
        async loadNextPage(): Promise<boolean> {
            const hasLoadedAnything = await this.loadItemsPage(this.page + 1);
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
    },
});
</script>

<style scoped>
@import '../app/page.css';

.area-item {
    cursor: pointer;
}

.areas-content {
    overflow: auto;
    height: 100%;
}
</style>
