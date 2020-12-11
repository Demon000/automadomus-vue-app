<template>
    <div class="area-details-page">
        <app-sidebar></app-sidebar>
        <app-navbar :has-back-button="true" :title="`Update area ${areaName}`">
            <template v-slot:actions>
                <i class="action-icon mdi mdi-check" v-on:click="onSaveButtonClick"></i>
            </template>
        </app-navbar>
        <!--        <ion-card v-if="area">-->
        <!--            <ion-card-content>-->
        <!--                <ion-item>-->
        <!--                    <ion-label position="floating">Name</ion-label>-->
        <!--                    <ion-input v-model="area.name"></ion-input>-->
        <!--                </ion-item>-->

        <!--                <ion-item>-->
        <!--                    <ion-label>Category</ion-label>-->
        <!--                    <ion-select ok-text="Select" cancel-text="Cancel" v-model="area.category">-->
        <!--                        <template v-for="(name, value) in categories">-->
        <!--                            <ion-select-option :value="value">{{ name }}</ion-select-option>-->
        <!--                        </template>-->
        <!--                    </ion-select>-->
        <!--                </ion-item>-->

        <!--                <ion-item>-->
        <!--                    <ion-label position="floating">Location</ion-label>-->
        <!--                    <ion-input v-model="area.location"></ion-input>-->
        <!--                </ion-item>-->
        <!--            </ion-card-content>-->
        <!--        </ion-card>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppSidebar from '@/app/AppSidebar.vue';
import AppNavbar from '@/app/AppNavbar.vue';
// import {
//     IonCard,
//     IonCardContent,
//     IonCardHeader,
//     IonCardSubtitle,
//     IonCardTitle, IonInput, IonItem,
//     IonLabel,
//     IonSelect,
//     IonSelectOption
// } from '@ionic/vue';
import { areaService } from '@/dependencies';
import { AreaCategoriesMap } from '@/models/Area';

export default defineComponent({
    name: 'AreaUpdatePage',
    components: {
        AppSidebar,
        AppNavbar,
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardSubtitle,
    // IonCardContent,
    // IonItem,
    // IonLabel,
    // IonSelect,
    // IonSelectOption,
    // IonInput,
    },
    props: {
        areaId: {
            type: String,
        },
    },
    computed: {
        areaName(): string {
            if (this.area && this.area.name) {
                return this.area.name;
            } else {
                return '';
            }
        },
    },
    watch: {
        areaId() {
            this.reloadArea();
        },
    },
    data() {
        return {
            area: {
                name: '',
                category: '',
                location: '',
            },
            categories: {} as AreaCategoriesMap,
        };
    },
    async mounted() {
        this.loadCategories();
        this.reloadArea();
    },
    methods: {
        async loadCategories() {
            const categories = await areaService.getAreaCategories();
            if (!categories) {
                return;
            }

            this.categories = categories;
        },
        async reloadArea() {
            if (!this.areaId) {
                return;
            }

            const area = await areaService.getAreaDetails(this.areaId);
            if (!area) {
                return;
            }

            this.area.name = area.name;
            this.area.category = '' + area.category;
            this.area.location = area.location;
        },
        async onSaveButtonClick() {
            if (!this.areaId) {
                return;
            }

            await areaService.updateArea(this.areaId, {
                name: this.area.name,
                category: +this.area.category,
                location: this.area.location,
            });
        },
    },
});
</script>

<style scoped></style>
