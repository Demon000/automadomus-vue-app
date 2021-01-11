<template>
    <div class="area-details-page page">
        <app-sidebar></app-sidebar>
        <app-navbar
                has-nav-button
                :title="area ? area.name : ''">
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
                        v-if="area"
                >
                    <ui-card-media
                            class="media"
                            v-if="area.hasImage"
                            :style="{
                            backgroundImage: areaImageUrl,
                        }"
                    ></ui-card-media>
                    <div class="content">
                        <div
                                class="property"
                                v-if="area.id"
                        >
                            <div class="type">Id</div>
                            <div class="value">{{ area.id }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="area.owner"
                        >
                            <div class="type">Owner</div>
                            <div class="value">{{ area.owner.firstName }} {{ area.owner.lastName }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="area.hasImage !== undefined"
                        >
                            <div class="type">Has image</div>
                            <div class="value">{{ area.hasImage }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="area.location"
                        >
                            <div class="type">Location</div>
                            <div class="value">{{ area.location }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="area.locationPoint"
                        >
                            <div class="type">Location point</div>
                            <div class="value">{{ area.locationPoint[0] }}, {{ area.locationPoint[1] }}</div>
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
                                v-if="area.noDevices !== undefined"
                        >
                            <div class="type">Number of devices</div>
                            <div class="value">{{ area.noDevices }}</div>
                        </div>
                        <div
                                class="property"
                                v-if="area.noDevices !== undefined"
                        >
                            <div class="type">Number of controllers</div>
                            <div class="value">{{ area.noControllers }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Added offline</div>
                            <div class="value">{{ hasOfflineFlag(AreaOfflineFlags.ADDED) }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Updated offline</div>
                            <div class="value">{{ hasOfflineFlag(AreaOfflineFlags.UPDATED) }}</div>
                        </div>

                        <div class="property">
                            <div class="type">Deleted offline</div>
                            <div class="value">{{ hasOfflineFlag(AreaOfflineFlags.DELETED) }}</div>
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
import Area from '@/models/Area';
import { AreaOfflineFlags } from '@/repositories/AreaRepository';

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
            AreaOfflineFlags,
        };
    },
    computed: {
        areaCategoryText(): string | undefined {
            if (this.area === undefined) {
                return;
            }

            return areaService.getAreaCategoryText(this.area.category);
        },
        areaImageUrl(): string {
            if (!this.area || !this.area.hasImage) {
                return '';
            }

            const image = this.area.image || this.area.thumbnail;
            if (!image) {
                return '';
            }

            return `url(data:image/png;base64,${image})`;
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

            this.area = await areaService.getAreaDetails(this.areaId);
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
        hasOfflineFlag(flag: number): boolean {
            return areaService.hasAreaOfflineFlag(this.area, flag);
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
