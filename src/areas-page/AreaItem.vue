<template>
    <div class="area-item">
        <!--        <ion-card>-->
        <!--            <ion-card-header>-->
        <!--                <ion-card-title>{{ name }}</ion-card-title>-->
        <!--                <ion-card-subtitle>{{ categoryText }}</ion-card-subtitle>-->
        <!--            </ion-card-header>-->
        <!--        </ion-card>-->
    </div>
</template>

<script lang="ts">
// import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/vue';
import { defineComponent } from 'vue';
import { areaService } from '@/dependencies';

export default defineComponent({
    name: 'AreaItem',
    components: {
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardSubtitle,
    },
    props: {
        id: String,
        name: String,
        category: Number,
        hasImage: Boolean,
        withDetails: Boolean,
    },
    computed: {
        categoryText(): string | undefined {
            return areaService.getAreaCategoryText(this.category);
        },
    },
});
</script>

<style scoped>
.area-item {
}
</style>
