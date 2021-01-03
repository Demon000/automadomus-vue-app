<template>
    <div class="area-details-page page">
        <app-sidebar></app-sidebar>
        <app-navbar :has-back-button="true" title="Add area">
            <template v-slot:end>
                <mdd-icon
                        name="mdi mdi-check"
                        @click="onSaveButtonClick"
                ></mdd-icon>
            </template>
        </app-navbar>
        <div class="area-add-content">
            <mdd-card>
                <template v-slot:content>
                    <mdd-input
                            label="Name"
                            v-model="area.name"
                    ></mdd-input>

                    <mdd-input
                            label="Category"
                            v-model="area.category"
                            type="select"
                    ></mdd-input>

                    <mdd-input
                            label="Location"
                            v-model="area.location"
                    ></mdd-input>
                </template>
            </mdd-card>
        </div>
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
import MddCard from '@/mdd-components/MddCard.vue';
import MddInput from '@/mdd-components/MddInput.vue';
import MddIcon from '@/mdd-components/MddIcon.vue';

export default defineComponent({
    name: 'AreaAddPage',
    components: {
        AppSidebar,
        AppNavbar,
        MddCard,
        MddInput,
        MddIcon,
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
@import '../app/page.css';

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
