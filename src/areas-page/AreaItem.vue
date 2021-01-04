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
                            v-if="
                                hasOfflineFlag(AreaOfflineFlags.ADDED
                                | AreaOfflineFlags.UPDATED
                                | AreaOfflineFlags.DELETED)
                            "
                            :class="{
                                'deleted': hasOfflineFlag(AreaOfflineFlags.DELETED),
                            }"
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
import { AreaOfflineFlags } from '@/repositories/AreaRepository';
import Area from '@/models/Area';

export default defineComponent({
    name: 'AreaItem',
    props: {
        area: {
            type: Object as () => Area,
            default: undefined,
        },
    },
    data() {
        return {
            AreaOfflineFlags,
        };
    },
    computed: {
        areaCategoryText(): string | undefined {
            if (!this.area) {
                return undefined;
            }

            return areaService.getAreaCategoryText(this.area.category);
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
}

.area-item-card {
    margin: 16px;
}

.content {
    padding: 16px;
}

.offline-marker {
    position: absolute;
    right: 16px;
    top: 16px;

    display: flex;
}

.offline-marker.deleted {
    color: #b00020;
}

.offline-marker .mdc-icon-button {
    width: 24px;
    height: 24px;
    font-size: 24px;

    padding: 0;
}
</style>
