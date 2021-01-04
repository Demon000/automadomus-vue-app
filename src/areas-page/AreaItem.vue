<template>
    <div class="area-item">
        <template v-if="area">
            <ui-card
                    class="area-item-card"
                    outlined
            >
                <ui-card-content
                        class="area-item-card__content"
                >
                    <div
                            class="area-item-card__name"
                            :class="$tt('headline5')"
                    >
                        {{ area.name }}
                    </div>
                    <div
                            class="area-item-card__category_text"
                            :class="$tt('subtitle1')"
                    >
                        {{ areaCategoryText }}
                    </div>
                    <div
                            class="area-item-card__offline-marker"
                            v-if="area.offlineFlags"
                    >
                        <ui-icon-button>
                            <i class="mdi mdi-sync-alert"></i>
                        </ui-icon-button>
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

.area-item-card {
    margin: 16px;
}

.area-item-card__content {
    padding: 16px;
}

.area-item-card__offline-marker {
    position: absolute;
    right: 16px;
    top: 16px;

    display: flex;
}

.area-item-card__offline-marker .mdc-icon-button {
    width: 24px;
    height: 24px;
    font-size: 24px;

    padding: 0;
}
</style>
