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
                    <div
                            class="diff"
                            v-if="showNameDiffSelector"
                    >
                        <div
                                class="minus"
                                @click="loadAreaNameInto(oldArea, editedArea)"
                        >
                            {{ oldArea.name }}
                        </div>
                        <div
                                class="plus"
                                @click="loadAreaNameInto(newArea, editedArea)"
                        >
                            {{ newArea.name }}
                        </div>
                    </div>

                    <ui-select
                            class="ui-textfield"
                            fullwidth
                            outlined
                            :options="categoriesSelectOptions"
                            v-model="editedArea.category"
                    >
                        Category
                    </ui-select>
                    <div
                            class="diff"
                            v-if="showCategoryDiffSelector"
                    >
                        <div
                                class="minus"
                                @click="loadAreaCategoryInto(oldArea, editedArea)"
                        >
                            {{ getAreaCategoryText(oldArea.category) }}
                        </div>
                        <div
                                class="plus"
                                @click="loadAreaCategoryInto(newArea, editedArea)"
                        >
                            {{ getAreaCategoryText(newArea.category) }}
                        </div>
                    </div>

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
                    <div
                            class="diff"
                            v-if="showLocationDiffSelector"
                    >
                        <div
                                class="minus"
                                @click="loadAreaLocationInto(oldArea, editedArea)"
                        >
                            {{ oldArea.location }}
                        </div>
                        <div
                                class="plus"
                                @click="loadAreaLocationInto(newArea, editedArea)"
                        >
                            {{ newArea.location }}
                        </div>
                    </div>

                    <div class="point-fields">
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

                    <div
                            class="diff"
                            v-if="showLocationPointDiffSelector"
                    >
                        <div
                                class="minus"
                                @click="loadAreaLocationPointInto(oldArea, editedArea)"
                        >
                            {{ oldArea.locationPoint[0] }}, {{ oldArea.locationPoint[1] }}
                        </div>
                        <div
                                class="plus"
                                @click="loadAreaLocationPointInto(newArea, editedArea)"
                        >
                            {{ newArea.locationPoint[0] }}, {{ newArea.locationPoint[1] }}
                        </div>
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

                    <ui-card
                            outlined
                            v-if="!selectedImageIsNewOrOld"
                    >
                        <ui-card-media
                                square
                                :style="{
                                    backgroundImage: areaImageUrl,
                                }"
                        ></ui-card-media>
                    </ui-card>

                    <div
                            class="diff"
                            v-if="showImageDiffSelector"
                    >
                        <ui-card
                                outlined
                                v-if="getAreaImageUrl(oldArea.image)"
                                class="minus"
                                :class="{
                                    'selected': selectedImageIsOld,
                                }"
                        >
                            <ui-card-content
                                    @click="loadAreaImageInto(oldArea, editedArea)"
                            >
                                <ui-card-media
                                        square
                                        :style="{
                                            backgroundImage: getAreaImageUrl(oldArea.image),
                                        }"
                                ></ui-card-media>
                            </ui-card-content>
                        </ui-card>

                        <ui-card
                                outlined
                                v-if="getAreaImageUrl(newArea.image)"
                                class="plus"
                                :class="{
                                    'selected': selectedImageIsNew,
                                }"
                        >
                            <ui-card-content
                                    @click="loadAreaImageInto(newArea, editedArea)"
                            >
                                <ui-card-media
                                        square
                                        :style="{
                                            backgroundImage: getAreaImageUrl(newArea.image),
                                        }"
                                ></ui-card-media>
                            </ui-card-content>
                        </ui-card>
                    </div>

                    <div class="errors" v-html="errorHTML"></div>
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
import { areaService, notificationService, RouteNames } from '@/dependencies';
import Area, {
    AreaAddData,
    AreaCategoriesMap,
    AreaCategorySelectOption,
    AreaUpdateData,
    EmptyArea,
    areaOverrideUpdateData,
} from '@/models/Area';
import AreaLocationSelectPage from '@/area-location-select-page/AreaLocationSelectPage.vue';
import Location, { LocationPoint } from '@/models/Location';

import { Plugins, CameraResultType } from '@capacitor/core';

import { multiErrorToHTMLString } from '@/models/APIErrors';
import { base64ImageToUrl } from '@/utils/image';
import { NotificationServiceEvent } from '@/services/NotificationService';
const { Camera } = Plugins;

enum EditMode {
    ADD = 'add',
    UPDATE = 'update',
    CONFLICT = 'conflict',
}

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
        conflict: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            area: {
                ...EmptyArea,
            } as Area,
            oldArea: {
                ...EmptyArea,
            } as AreaAddData,
            newArea: {
                ...EmptyArea,
            } as AreaAddData,
            editedArea: {
                ...EmptyArea,
            } as AreaAddData,
            updatedAtTimestamp: 0,
            initialAreaName: '',
            imageName: '',
            errorHTML: '',
            PageMode,
            mode: PageMode.FIELDS,
            categories: {} as AreaCategoriesMap,
        };
    },
    computed: {
        editMode(): EditMode {
            if (this.areaId) {
                if (this.conflict) {
                    return EditMode.CONFLICT;
                } else {
                    return EditMode.UPDATE;
                }
            } else {
                return EditMode.ADD;
            }
        },
        areaVisible(): Area {
            if (this.editMode !== EditMode.UPDATE) {
                return this.area;
            }

            return areaOverrideUpdateData(this.area);
        },
        areaImageUrl(): string {
            return base64ImageToUrl(this.editedArea.image);
        },
        title(): string {
            if (this.editMode === EditMode.ADD) {
                return 'Add area';
            } else if (this.editMode === EditMode.UPDATE) {
                return `Update area ${this.initialAreaName}`;
            } else if (this.editMode === EditMode.CONFLICT) {
                return `Merge area ${this.initialAreaName}`;
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
            if (this.editMode === EditMode.ADD) {
                return undefined;
            }

            return {
                lat: this.editedArea.locationPoint[0],
                lng: this.editedArea.locationPoint[1],
            };
        },
        showNameDiffSelector(): boolean {
            return !!this.newArea.name && this.newArea.name !== this.oldArea.name;
        },
        showCategoryDiffSelector(): boolean {
            return this.newArea.category !== undefined && this.newArea.category !== this.oldArea.category;
        },
        showLocationDiffSelector(): boolean {
            return !!this.newArea.location && this.newArea.location !== this.oldArea.location;
        },
        showLocationPointDiffSelector(): boolean {
            return !!this.newArea.locationPoint && this.newArea.locationPoint[0] !== this.oldArea.locationPoint[0] &&
                    this.newArea.locationPoint[1] !== this.oldArea.locationPoint[1];
        },
        showImageDiffSelector(): boolean {
            return !!this.newArea.image && this.newArea.image !== this.oldArea.image;
        },
        selectedImageIsNew(): boolean {
            return !!this.editedArea.image && this.editedArea.image === this.newArea.image;
        },
        selectedImageIsOld(): boolean {
            return !!this.editedArea.image && this.editedArea.image === this.oldArea.image;
        },
        selectedImageIsNewOrOld(): boolean {
            return this.selectedImageIsNew || this.selectedImageIsOld;
        },
    },
    async mounted() {
        this.loadCategories();

        if (this.editMode === EditMode.UPDATE) {
            await this.loadAreaFromId();
            this.loadAreaInto(this.areaVisible, this.editedArea);
            this.initialAreaName = this.areaVisible.name;
            this.updatedAtTimestamp = this.area.updatedAtTimestamp;
        } else if (this.editMode === EditMode.CONFLICT) {
            await this.loadAreaFromId();
            this.loadAreaInto(this.area, this.oldArea);
            if (this.area.savedUpdateData) {
                this.loadAreaInto(this.area.savedUpdateData as AreaAddData, this.newArea);
            }
            this.loadConflictEditedData();
            this.initialAreaName = this.area.name;
            this.updatedAtTimestamp = this.area.updatedAtTimestamp;
        }

        notificationService.emitter.on(NotificationServiceEvent.AREA_UPDATED, this.onAreaUpdated);
    },
    beforeUnmount() {
        notificationService.emitter.off(NotificationServiceEvent.AREA_UPDATED, this.onAreaUpdated);
    },
    methods: {
        getAreaCategoryText(category: number): string | undefined {
            return areaService.getAreaCategoryText(category);
        },
        getAreaImageUrl(image: string): string {
            return base64ImageToUrl(image);
        },
        async onAreaUpdated(area: Area) {
            if (!this.areaId || this.areaId !== area.id) {
                return;
            }

            await this.loadAreaFromId();
        },
        async loadCategories() {
            const categories = await areaService.getAreaCategories();
            if (!categories) {
                return;
            }

            this.categories = categories;
        },
        loadAreaNameInto(source: AreaAddData, target: AreaAddData): void {
            target.name = source.name;
        },
        loadAreaCategoryInto(source: AreaAddData, target: AreaAddData): void {
            target.category = source.category;
        },
        loadAreaLocationInto(source: AreaAddData, target: AreaAddData): void {
            target.location = source.location;
        },
        loadAreaLocationPointInto(source: AreaAddData, target: AreaAddData): void {
            target.locationPoint[0] = source.locationPoint[0];
            target.locationPoint[1] = source.locationPoint[1];
        },
        loadAreaImageInto(source: AreaAddData, target: AreaAddData): void {
            target.image = source.image;
        },
        loadAreaInto(source: AreaAddData, target: AreaAddData): void {
            target.name = source.name;
            target.category = source.category;
            target.location = source.location;
            target.locationPoint = source.locationPoint;
            target.image = source.image;
        },
        loadConflictEditedData() {
            if (!this.showNameDiffSelector) {
                this.editedArea.name = this.oldArea.name;
            }

            if (!this.showCategoryDiffSelector) {
                this.editedArea.category = this.oldArea.category;
            }

            if (!this.showLocationDiffSelector) {
                this.editedArea.location = this.oldArea.location;
            }

            if (!this.showLocationPointDiffSelector) {
                this.editedArea.locationPoint = this.oldArea.locationPoint;
            }

            if (!this.showImageDiffSelector) {
                this.editedArea.image = this.oldArea.image;
            }
        },
        async loadAreaFromId(): Promise<void> {
            if (!this.areaId) {
                return;
            }

            const area = await areaService.getArea(this.areaId);
            if (!area) {
                return;
            }

            this.area = area;
        },
        async onSaveUpdateButtonClick(): Promise<void> {
            if (!this.areaId) {
                return;
            }

            const areaUpdateData: AreaUpdateData = {};

            if (this.areaVisible.name !== this.editedArea.name) {
                areaUpdateData.name = this.editedArea.name;
            }

            if (this.areaVisible.category !== this.editedArea.category) {
                areaUpdateData.category = this.editedArea.category;
            }

            if (this.areaVisible.location !== this.editedArea.location) {
                areaUpdateData.location = this.editedArea.location;
            }

            if (this.areaVisible.locationPoint[0] !== this.editedArea.locationPoint[0] &&
                this.areaVisible.locationPoint[1] !== this.editedArea.locationPoint[1]) {
                areaUpdateData.locationPoint = this.editedArea.locationPoint;
            }

            if (this.areaVisible.image !== this.editedArea.image && this.editedArea.image) {
                areaUpdateData.image = this.editedArea.image;
            }

            areaUpdateData.updatedAtTimestamp = this.updatedAtTimestamp;

            this.errorHTML = '';

            try {
                const clearConflict = this.editMode === EditMode.CONFLICT;
                await areaService.updateArea(this.areaId, areaUpdateData, undefined,
                    undefined, clearConflict, true);
            } catch (err) {
                this.errorHTML = multiErrorToHTMLString(err);
                return;
            }

            await this.redirectToAreaDetails(this.areaId);
        },
        async onSaveAddButtonClick(): Promise<void> {
            let area;
            this.errorHTML = '';

            try {
                area = await areaService.addArea(this.editedArea);
            } catch (err) {
                this.errorHTML = multiErrorToHTMLString(err);
                return;
            }

            if (!area) {
                return;
            }

            await this.redirectToAreaDetails(area.id);
        },
        async onSaveButtonClick(): Promise<void> {
            if (this.editMode === EditMode.UPDATE || this.editMode === EditMode.CONFLICT) {
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
        async redirectToAreaDetails(id: string): Promise<void> {
            await this.$router.replace({
                name: RouteNames.AREA_DETAILS,
                params: {
                    areaId: id,
                },
            });
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

.diff {
    margin: -8px 0 32px;
}

.minus,
.plus {
    margin: 15px 7px;
    padding: 16px;
    border-radius: 4px;

    cursor: pointer;
    box-sizing: border-box;
}

.minus:hover,
.plus:hover {
    margin: 14px 6px;
}

.minus {
    border: 1px solid rgba(221, 44, 0, 0.5);
}

.minus:hover {
    border: 2px solid rgba(221, 44, 0, 1);
}

.minus.selected {
    background: rgba(0, 0, 0, 0.5);
}

.plus {
    border: 1px solid rgba(100, 221, 23, 0.5);
}

.plus:hover {
    border: 2px solid rgba(100, 221, 23, 1);
}

.plus.selected {
    background: rgba(0, 0, 0, 0.5);
}
</style>
