<template>
    <div class="area-details-page">
        <app-sidebar></app-sidebar>
        <app-navbar :has-back-button="true" title="Add area">
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
import { AreaAddData, AreaCategoriesMap } from '@/models/Area';

export default defineComponent({
    name: 'AreaAddPage',
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
    data() {
        return {
            area: {
                name: '',
                category: -1,
                location: '',
            } as AreaAddData,
            categories: {} as AreaCategoriesMap,
        };
    },
    async mounted() {
        this.loadCategories();
    },
    methods: {
        async loadCategories() {
            const categories = await areaService.getAreaCategories();
            if (!categories) {
                return;
            }

            this.categories = categories;
        },
        async onSaveButtonClick() {
            await areaService.addArea(this.area);
        },
    },
});
</script>

<style scoped>
.property {
    margin: 8px 0;
}

.property .type {
    color: rgba(0, 0, 0, 0.5);
}

.property .value {
    color: black;
}
</style>
