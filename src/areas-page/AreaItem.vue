<template>
    <div class="area-item">
        <template v-if="area">
            <mdd-list-item
                    :header="area.name"
                    :subheader="areaCategoryText"
            >
            </mdd-list-item>
        </template>

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

import MddListItem from '@/mdd-components/MddListItem.vue';

export default defineComponent({
    name: 'AreaItem',
    components: {
        MddListItem,
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardSubtitle,
    },
    props: {
        area: {
            type: Object,
            default: null,
        },
    },
    computed: {
        areaCategoryText(): string | undefined {
            if (!this.area) {
                return undefined;
            }

            return areaService.getAreaCategoryText(this.area.category);
        },
    },
});
</script>

<style scoped>
.area-item {
    cursor: pointer;
}
</style>
