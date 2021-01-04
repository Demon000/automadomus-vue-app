<template>
    <div class="area-item">
        <template v-if="area">
            <ui-card
                    class="area-add-card"
                    outlined
            >
                <ui-card-content
                        class="area-add-card__content"
                >
                    <div
                            :class="[
                                $tt('headline5'),
                                'area-card__name'
                            ]"
                    >
                        {{ area.name }}
                    </div>
                    <div
                            :class="[
                                $tt('subtitle1'),
                                'area-card__category_text'
                            ]"
                    >
                        {{ areaCategoryText }}
                    </div>
                </ui-card-content>
            </ui-card>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { areaService } from '@/dependencies';

export default defineComponent({
    name: 'AreaItem',
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

.area-add-card {
    margin: 16px;
}

.area-add-card__content {
    padding: 16px;
}
</style>
