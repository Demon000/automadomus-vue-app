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
                            v-if="area.hasImage"
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
                            {{ area.name }}
                        </div>
                        <div
                                class="category_text"
                                :class="$tt('subtitle1')"
                        >
                            {{ areaCategoryText }}
                        </div>
                        <div
                                class="offline-marker"
                                v-if="hasOfflineFlag(AreaOfflineFlags.ADDED
                                        | AreaOfflineFlags.UPDATED
                                        | AreaOfflineFlags.DELETED)
                                "
                        >
                            <ui-icon-button>
                                <i class="mdi mdi-sync-alert"></i>
                            </ui-icon-button>
                        </div>
                    </div>
                </ui-card-content>
            </ui-card>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { areaService } from '@/dependencies';
import { AreaOfflineFlags } from '@/repositories/AreaRepository';
import Area from '@/models/Area';

export default defineComponent({
    name: 'AreaItem',
    props: {
        area: {
            type: Object as () => Area,
            required: true,
        },
    },
    data() {
        return {
            AreaOfflineFlags,
        };
    },
    computed: {
        areaCategoryText(): string | undefined {
            return areaService.getAreaCategoryText(this.area.category);
        },
        areaImageUrl(): string {
            if (!this.area.hasImage) {
                return '';
            }

            return `url(data:image/png;base64,${this.area.thumbnail})`;
        },
    },
    methods: {
        hasOfflineFlag(flag: number): boolean {
            return areaService.hasAreaOfflineFlag(this.area, flag);
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
}

.text {
    padding: 16px;
}

.offline-marker {
    position: absolute;
    right: 16px;
    top: 16px;

    display: flex;
}

.offline-marker .mdc-icon-button {
    width: 24px;
    height: 24px;
    font-size: 24px;

    padding: 0;
}
</style>
