<template>
    <div class="mdd-menu">
        <template
                v-for="(item, index) in items"
                :key="index"
        >
            <div class="item">
                <slot :name="index">
                    <div class="item-default">
                        {{ item }}
                    </div>
                </slot>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MddMenu',
    props: {
        items: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
});
</script>

<style scoped>
.mdd-menu {
    padding: 8px 0;
}

.item {
    padding: 0 16px;
}

.item-default {
    padding: 16px 0;
    line-height: 1em;
}
</style>
