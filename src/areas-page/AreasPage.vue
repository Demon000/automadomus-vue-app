<template>
    <div class="areas-page">
        <app-sidebar></app-sidebar>
        <app-navbar :has-menu-button="true" title="Areas">
            <template v-slot:actions>
                <i class="action-icon mdi mdi-plus" v-on:click="onAddButtonClick"></i>
            </template>
        </app-navbar>
        <div id="areas-content">
            <template
                v-for="item in items"
                v-bind:key="item.id"
            >
                <area-item
                    v-bind="item"
                    class="area-item"
                    v-on:click="openAreaDetailsPage(item.id)"
                ></area-item>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppNavbar from '@/app/AppNavbar.vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AreaItem from '@/areas-page/AreaItem.vue';
import { areaService, RouteNames } from '@/dependencies';
import Area from '@/models/Area';
import { CONFIG_AREAS_PAGINATED_LIMIT } from '@/config';

export default defineComponent({
    name: 'AreasPage',
    components: {
        AppSidebar,
        AppNavbar,
        AreaItem,
    },
    props: {
        page: {
            type: Number,
            default: 0,
            required: false,
        },
    },
    data() {
        return {
            items: [] as Array<Area>,
            noPages: 0,
            RouteNames: RouteNames,
        };
    },
    watch: {
        page() {
            this.reloadItems();
        },
    },
    mounted() {
        this.reloadItems();
    },
    methods: {
        async reloadItems() {
            const items = await areaService.getAreasPage(
                this.page,
                CONFIG_AREAS_PAGINATED_LIMIT,
            );
            if (!items) {
                return;
            }

            this.items = items;
        },
        async openAreaDetailsPage(areaId: string) {
            this.$router.push({
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
#areas-content {
    overflow: auto;
}

.area-item {
    cursor: pointer;
}
</style>
