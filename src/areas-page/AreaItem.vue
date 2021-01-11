<template>
    <div class="area-item">
        <template v-if="area">
            <ui-card
                    class="area-item-card"
                    outlined
            >
                <ui-card-content
                        class="content"
                >
                    <ui-card-media
                            class="media"
                            v-if="areaImageUrl"
                            square
                            :style="{
                                backgroundImage: areaImageUrl,
                            }"
                    ></ui-card-media>
                    <div class="text">
                        <div
                                class="name"
                                :class="$tt('headline5')"
                        >
                            {{ areaVisible.name }}
                        </div>
                        <div
                                class="category_text"
                                :class="$tt('subtitle1')"
                        >
                            {{ areaCategoryText }}
                        </div>
                    </div>
                    <div
                            class="offline-marker"
                            v-if="areaHasAnyOfflineFlag"
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
import Area, { areaHasAnyOfflineFlag, areaBackgroundImage, areaOverrideUpdateData } from '@/models/Area';

export default defineComponent({
    name: 'AreaItem',
    props: {
        area: {
            type: Object as () => Area,
            required: true,
        },
    },
    computed: {
        areaCategoryText(): string | undefined {
            return areaService.getAreaCategoryText(this.areaVisible.category);
        },
        areaImageUrl(): string {
            return areaBackgroundImage(this.areaVisible, true);
        },
        areaHasAnyOfflineFlag(): boolean {
            return areaHasAnyOfflineFlag(this.areaVisible);
        },
        areaVisible(): Area {
            return areaOverrideUpdateData(this.area);
        },
    },
});
</script>

<style scoped>
.area-item {
    cursor: pointer;
    margin: 16px;
}

.content {
    display: flex;
    flex-direction: row;
}

.media {
    width: 120px;
    height: 100%;
    flex-shrink: 0;
}

.text {
    padding: 16px;
    word-break: break-all;
}

.offline-marker {
    display: flex;

    margin: 16px 16px auto auto;
}

.offline-marker .mdc-icon-button {
    width: 24px;
    height: 24px;
    font-size: 24px;

    padding: 0;
}
</style>
