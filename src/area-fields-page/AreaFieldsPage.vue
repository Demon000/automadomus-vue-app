<template>
    <div
            class="page"
            v-if="mode === PageMode.FIELDS"
    >
        <app-sidebar></app-sidebar>
        <app-navbar
                has-nav-button
                :title="title"
        >
            <template #toolbar>
                <ui-icon-button
                        @click="onSaveButtonClick"
                >
                    <i class="mdi mdi-check"></i>
                </ui-icon-button>
            </template>
        </app-navbar>
        <div class="page-content">
            <ui-card
                    class="card"
                    outlined
            >
                <div class="content">
                    <ui-textfield
                            class="ui-textfield"
                            fullwidth
                            outlined
                            v-model="editedArea.name"
                    >
                        Name
                    </ui-textfield>

                    <ui-select
                            class="ui-textfield"
                            fullwidth
                            outlined
                            :options="categoriesSelectOptions"
                            v-model="editedArea.category"
                    >
                        Category
                    </ui-select>

                    <ui-textfield
                            class="ui-textfield"
                            fullwidth
                            outlined
                            v-model="editedArea.location"
                    >
                        Location
                        <template #after>
                            <ui-textfield-icon>
                                <ui-icon-button
                                        @click="onOpenMapButtonClick"
                                >
                                    <i class="mdi mdi-map-marker"></i>
                                </ui-icon-button>
                            </ui-textfield-icon>
                        </template>
                    </ui-textfield>

                    <div class="point-fields" v-if="editedArea.locationPoint">
                        <ui-textfield
                                class="ui-textfield"
                                outlined
                                v-model="editedArea.locationPoint[0]"
                        >
                            Latitude
                        </ui-textfield>
                        <ui-textfield
                                class="ui-textfield"
                                outlined
                                v-model="editedArea.locationPoint[1]"
                        >
                            Longitude
                        </ui-textfield>
                    </div>

                    <ui-textfield
                            class="ui-textfield"
                            fullwidth
                            outlined
                            v-model="imageName"
                            @keydown.capture.prevent.stop
                    >
                        Image
                        <template #after>
                            <ui-textfield-icon>
                                <ui-icon-button
                                        @click="onOpenCameraButtonClick"
                                >
                                    <i class="mdi mdi-camera"></i>
                                </ui-icon-button>
                            </ui-textfield-icon>
                        </template>
                    </ui-textfield>
                </div>
            </ui-card>
        </div>
    </div>
    <area-location-select-page
            v-else-if="mode === PageMode.LOCATION"
            :initial-location-point="initialLocationPoint"
            @saveButtonClick="onLocationSelectSaveButtonClick"
            @exitButtonClick="onLocationSelectExitButtonClick"
    ></area-location-select-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AppNavbar from '@/app/AppNavbar.vue';
import { areaService } from '@/dependencies';
import Area, { AreaAddData, AreaCategoriesMap, AreaCategorySelectOption, AreaUpdateData } from '@/models/Area';
import AreaLocationSelectPage from '@/area-location-select-page/AreaLocationSelectPage.vue';
import Location, { LocationPoint } from '@/models/Location';

import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

enum PageMode {
    FIELDS = 'fields',
    LOCATION = 'location',
}

export default defineComponent({
    name: 'AreaFieldPage',
    components: {
        AppSidebar,
        AppNavbar,
        AreaLocationSelectPage,
    },
    props: {
        areaId: {
            type: String,
        },
    },
    data() {
        return {
            area: {
                name: '',
                category: 0,
                location: '',
                locationPoint: [0, 0],
            } as Area,
            editedArea: {
                name: '',
                category: 0,
                location: '',
                locationPoint: [0, 0],
                image: '',
            } as AreaAddData,
            imageName: '',
            PageMode,
            mode: PageMode.FIELDS,
            categories: {} as AreaCategoriesMap,
        };
    },
    computed: {
        isAddMode(): boolean {
            return !this.areaId;
        },
        isUpdateMode(): boolean {
            return !!this.areaId;
        },
        title(): string {
            if (this.isAddMode) {
                return 'Add area';
            } else if (this.isUpdateMode && this.area) {
                return `Update area ${this.area.name}`;
            }

            return '';
        },
        categoriesSelectOptions(): AreaCategorySelectOption[] {
            const categoriesSelectOptions = [];

            for (const [key, value] of Object.entries(this.categories)) {
                categoriesSelectOptions.push({
                    value: Number.parseInt(key),
                    label: value,
                });
            }

            return categoriesSelectOptions;
        },
        initialLocationPoint(): LocationPoint | undefined {
            if (this.isAddMode) {
                return undefined;
            }

            return {
                lat: this.editedArea.locationPoint[0],
                lng: this.editedArea.locationPoint[1],
            };
        },
    },
    watch: {
        areaId() {
            this.reloadArea();
        },
    },
    mounted() {
        this.loadCategories();

        if (this.areaId) {
            this.reloadArea();
        }
    },
    methods: {
        async loadCategories() {
            const categories = await areaService.getAreaCategories();
            if (!categories) {
                return;
            }

            this.categories = categories;
        },
        async reloadArea(): Promise<void> {
            if (!this.areaId) {
                return;
            }

            const area = await areaService.getAreaDetails(this.areaId);
            if (!area) {
                return;
            }

            this.area = area;
            this.editedArea.name = area.name;
            this.editedArea.category = area.category;
            this.editedArea.location = area.location;
            this.editedArea.locationPoint = area.locationPoint;
        },
        async onSaveUpdateButtonClick(): Promise<void> {
            if (!this.areaId) {
                return;
            }

            const areaUpdateData: AreaUpdateData = {};

            if (this.area.name !== this.editedArea.name) {
                areaUpdateData.name = this.editedArea.name;
            }

            if (this.area.category !== this.editedArea.category) {
                areaUpdateData.category = this.editedArea.category;
            }

            if (this.area.location !== this.editedArea.location) {
                areaUpdateData.location = this.editedArea.location;
            }

            if (this.area.locationPoint !== this.editedArea.locationPoint) {
                areaUpdateData.locationPoint = this.editedArea.locationPoint;
            }

            if (this.area.image !== this.editedArea.image && this.editedArea.image) {
                areaUpdateData.image = this.editedArea.image;
            }

            await areaService.updateArea(this.areaId, areaUpdateData);
        },
        async onSaveAddButtonClick(): Promise<void> {
            await areaService.addArea(this.editedArea);
        },
        async onSaveButtonClick(): Promise<void> {
            if (this.areaId) {
                await this.onSaveUpdateButtonClick();
            } else {
                await this.onSaveAddButtonClick();
            }
        },
        onLocationSelectSaveButtonClick(location: Location): void {
            this.editedArea.location = location.address;
            this.editedArea.locationPoint = [location.lat, location.lng];
            this.mode = PageMode.FIELDS;
        },
        onLocationSelectExitButtonClick(): void {
            this.mode = PageMode.FIELDS;
        },
        onOpenMapButtonClick(): void {
            this.mode = PageMode.LOCATION;
        },
        async onOpenCameraButtonClick() {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64,
            });

            const date = new Date(Date.now());

            this.imageName = [
                'image',
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
            ].join('-') + '.png';
            this.editedArea.image = image.base64String;
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

.ui-textfield {
    margin-bottom: 16px;
}

.point-fields {
    display: flex;
}

.point-fields .ui-textfield {
    flex-grow: 1;
}

.point-fields .ui-textfield:not(:last-child) {
    margin-right: 16px;
}
</style>
