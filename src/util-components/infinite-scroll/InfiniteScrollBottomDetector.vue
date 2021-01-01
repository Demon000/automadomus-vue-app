<template>
    <div
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
