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
                            v-model="editedArea.locationPoint[0]"
                    >
                        Latitude
                    </ui-textfield>
                    <ui-textfield
                            class="ui-textfield"
                            v-model="editedArea.locationPoint[1]"
                    >
                        Longitude
                    </ui-textfield>
                </div>
            </div>
        </ui-card>
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
import Area, { AreaAddData, AreaCategoriesMap, AreaCategorySelectOption } from '@/models/Area';
import AreaLocationSelectPage from '@/area-location-select-page/AreaLocationSelectPage.vue';
import Location, { LocationPoint } from '@/models/Location';

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
            } as AreaAddData,
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
        initialLocationPoint(): LocationPoint {
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

            const areaUpdateData = [
                'name',
                'category',
                'location',
                'locationPoint',
            ].forEach(key => {
                if (this.editedArea[key] !== this.area[key]) {
                    areaUpdateData[key] = this.editedArea[key];
                }
            });

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
        async onLocationSelectSaveButtonClick(location: Location): Promise<void> {
            this.editedArea.location = location.address;
            this.editedArea.locationPoint = [location.lat, location.lng];
            this.mode = PageMode.FIELDS;
        },
        async onLocationSelectExitButtonClick(): Promise<void> {
            this.mode = PageMode.FIELDS;
        },
        async onOpenMapButtonClick(): Promise<void> {
            this.mode = PageMode.LOCATION;
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
