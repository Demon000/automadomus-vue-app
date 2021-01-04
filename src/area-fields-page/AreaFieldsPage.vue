<template>
    <div class="page">
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
                class="area-add-card"
                outlined
        >
            <div class="area-add-card__content">
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
            </div>
        </ui-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AppNavbar from '@/app/AppNavbar.vue';
import { areaService } from '@/dependencies';
import Area, { AreaAddData, AreaCategoriesMap, AreaCategorySelectOption } from '@/models/Area';

export default defineComponent({
    name: 'AreaFieldPage',
    components: {
        AppSidebar,
        AppNavbar,
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
            } as Area,
            editedArea: {
                name: '',
                category: 0,
                location: '',
            } as AreaAddData,
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
        categoriesSelectOptions(): Array<AreaCategorySelectOption> {
            const categoriesSelectOptions = [];

            for (const [key, value] of Object.entries(this.categories)) {
                categoriesSelectOptions.push({
                    value: Number.parseInt(key),
                    label: value,
                });
            }

            return categoriesSelectOptions;
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
        },
        async onSaveUpdateButtonClick(): Promise<void> {
            if (!this.areaId) {
                return;
            }

            await areaService.updateArea(this.areaId, {
                name: this.editedArea.name,
                category: this.editedArea.category,
                location: this.editedArea.location,
            });
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
        async onOpenMapButtonClick(): Promise<void> {
            console.log('bla');
        },
    },
});
</script>

<style scoped>
@import '../app/page.css';

.area-add-card {
    margin: 16px;
}

.area-add-card__content {
    padding: 16px;
}

.ui-textfield {
    margin-bottom: 16px;
}
</style>
