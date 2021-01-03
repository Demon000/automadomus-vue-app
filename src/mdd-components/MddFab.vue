<template>
    <div
            class="mdd-fab"
            :class="{
                'title-only': hasTitleOnly,
                'icon-only': hasIconOnly,
                'icon-and-title': hasIconAndTitle,
            }"
    >
        <mdd-icon
                v-if="icon"
                :name="icon"
                class="icon"
        >
        </mdd-icon>
        <span class="title">
            {{ title }}
        </span>
    </div>
</template>

<script lang="ts">
import MddIcon from '@/mdd-components/MddIcon.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MddFab',
    components: {
        MddIcon,
    },
    computed: {
        hasIconAndTitle(): boolean {
            return !!this.icon && !!this.title;
        },
        hasIconOnly(): boolean {
            return !!this.icon && !this.title;
        },
        hasTitleOnly(): boolean {
            return !!this.title && !this.icon;
        },
    },
    props: {
        icon: String,
        title: String,
    },
});
</script>

<style scoped>
.mdd-fab {
    display: inline-block;

    --height: var(--mdd-fab-height, 48px);
    --icon-height: var(--mdd-fab-icon-height, 24px);
    --bg: var(--mdd-fab-bg, #0070ff);
    --color: var(--mdd-fab-color, #ffffff);

    box-sizing: border-box;

    height: var(--height);
    line-height: calc(var(--height) - var(--icon-height));

    border-radius: calc(var(--height) / 2);
    padding: calc((var(--height) - var(--icon-height)) / 2) var(--icon-height);

    background: var(--bg);
    color: var(--color);

    box-shadow:
            0 3px 5px -1px rgba(0, 0, 0, 0.2),
            0 6px 10px 0 rgba(0, 0, 0, 0.14),
            0 1px 18px 0 rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    user-select: none;
    cursor: pointer;
}

.mdd-fab.icon-only {
    --height: var(--mdd-fab-height, 56px);

    padding: calc((var(--height) - var(--icon-height)) / 2);
}

.mdd-fab:hover,
.mdd-fab:focus {
    box-shadow:
            0 5px 5px -3px rgba(0, 0, 0, 0.2),
            0 8px 10px 1px rgba(0, 0, 0, 0.14),
            0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.icon,
.title {
    vertical-align: top;
}

.title {
    font-size: 0.875rem;
    font-weight: 500;
}

.icon-and-title .icon {
    margin-right: calc(var(--icon-height) / 2);
    margin-left: calc(var(--icon-height) / -2);
}

</style>
