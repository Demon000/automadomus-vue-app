<template>
    <div class="area-details-page page">
        <app-sidebar></app-sidebar>
        <app-navbar
                has-nav-button
                :title="area ? areaVisible.name : ''">
            <template #toolbar>
                <ui-icon-button
                        @click="onEditButtonClick"
                >
                    <i class="mdi mdi-pencil"></i>
                </ui-icon-button>
                <ui-icon-button
                        @click="onDeleteButtonClick"
                >
                    <i class="mdi mdi-delete"></i>
                </ui-icon-button>
            </template>
        </app-navbar>
        <div class="page-content">
            <ui-card
                    class="card"
                    outlined
            >
                <template
                        #default
                        v-if="areaVisible"
                >
                    <ui-card-media
                            class="media"
                            v-if="areaImageUrl"
                            :style="{
                                backgroundImage: areaImageUrl,
                            }"
                    ></ui-card-media>
                    <div class="content">
                        <div
                                class="property"
                                v-if="areaVisible.id"
                        >
                            <div class="type">Id</div>
                            <div class="value">{{ areaVisible.id }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaVisible.owner"
                        >
                            <div class="type">Owner</div>
                            <div class="value">{{ areaVisible.owner.firstName }} {{ areaVisible.owner.lastName }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaVisible.location"
                        >
                            <div class="type">Location</div>
                            <div class="value">{{ areaVisible.location }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaVisible.locationPoint"
                        >
                            <div class="type">Location point</div>
                            <div class="value">{{ areaVisible.locationPoint[0] }}, {{ areaVisible.locationPoint[1] }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaCategoryText"
                        >
                            <div class="type">Category</div>
                            <div class="value">{{ areaCategoryText }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaVisible.noDevices !== undefined"
                        >
                            <div class="type">Number of devices</div>
                            <div class="value">{{ areaVisible.noDevices }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="areaVisible.noDevices !== undefined"
                        >
                            <div class="type">Number of controllers</div>
                            <div class="value">{{ areaVisible.noControllers }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Added offline</div>
                            <div class="value">{{ areaHasOfflineAddedFlag }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Updated offline</div>
                            <div class="value">{{ areaHasOfflineUpdatedFlag }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Deleted offline</div>
                            <div class="value">{{ areaHasOfflineDeletedFlag }}</div>
                        </div>
                    </div>
                </template>
            </ui-card>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AppNavbar from '@/app/AppNavbar.vue';
import { areaService, RouteNames } from '@/dependencies';
import Area, {
    areaHasOfflineAddedFlag,
    areaHasOfflineDeletedFlag,
    areaHasOfflineUpdatedFlag,
    areaBackgroundImage, areaOverrideUpdateData,
} from '@/models/Area';

export default defineComponent({
    name: 'AreaDetailsPage',
    components: {
        AppSidebar,
        AppNavbar,
    },
    props: {
        areaId: {
            type: String,
        },
    },
    watch: {
        areaId() {
            this.reloadArea();
        },
    },
    data() {
        return {
            area: undefined as Area | undefined,
        };
    },
    computed: {
        areaVisible(): Area | undefined {
            if (!this.area) {
                return undefined;
            }

            return areaOverrideUpdateData(this.area);
        },
        areaCategoryText(): string | undefined {
            if (this.areaVisible === undefined) {
                return;
            }

            return areaService.getAreaCategoryText(this.areaVisible.category);
        },
        areaImageUrl(): string {
            return areaBackgroundImage(this.areaVisible);
        },
        areaHasOfflineAddedFlag(): boolean {
            return areaHasOfflineAddedFlag(this.areaVisible);
        },
        areaHasOfflineUpdatedFlag(): boolean {
            return areaHasOfflineUpdatedFlag(this.areaVisible);
        },
        areaHasOfflineDeletedFlag(): boolean {
            return areaHasOfflineDeletedFlag(this.areaVisible);
        },
    },
    mounted() {
        this.reloadArea();
    },
    methods: {
        async reloadArea() {
            if (!this.areaId) {
                return;
            }

            this.area = await areaService.getArea(this.areaId);
        },
        async onEditButtonClick() {
            if (!this.area) {
                return;
            }

            await this.$router.push({
                name: RouteNames.AREA_EDIT,
                params: {
                    areaId: this.area.id,
                },
            });
        },
        async onDeleteButtonClick() {
            if (!this.area) {
                return;
            }

            try {
                await areaService.deleteArea(this.area.id);
            } catch (err) {
                console.error(err);
                return;
            }

            await this.$router.push({
                name: RouteNames.AREAS,
            });
        },
    },
});
</script>

<style scoped>
@import '../app/page.css';

.card {
    margin: 16px;
}

.content {
    padding: 16px;
}

.property {
    margin-bottom: 8px;
}

.property .type {
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.875em;
    margin-bottom: 4px;
}

.property .value {
    color: black;
}

.media {
    width: 100%;
    height: 360px;
}
</style>
