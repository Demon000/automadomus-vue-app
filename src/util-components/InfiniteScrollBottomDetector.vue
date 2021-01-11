<template>
    <div
            class="bottom-detector"
            :style="{
                height: detection,
            }"
            v-observe-visibility="{
                callback: onVisibilityChange,
                throttle: debounce,
            }"
    ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'InfiniteScrollBottomDetector',
    props: {
        debounce: {
            type: Number,
            default: 0,
        },
        detection: {
            type: String,
            default: '4px',
        },
    },
    emits: [
        'visibilityChange',
    ],
    methods: {
        onVisibilityChange(isVisible: boolean) {
            this.$emit('visibilityChange', isVisible);
        },
    },
});
</script>

<style scoped>
.bottom-detector {
    height: 2px;
}
</style>
