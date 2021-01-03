<template>
    <div
            class="mdd-list-item mdd-list-item-like"
            :class="{
                'with-border': withBorder,
            }"
    >
        <div class="content">
            <slot name="content">
                <div class="header">
                    {{ header }}
                </div>
                <div class="subheader">
                    {{ subheader }}
                </div>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MddListItem',
    props: {
        withBorder: {
            type: Boolean,
            default: true,
        },
        header: {
            type: String,
            default: '',
        },
        subheader: {
            type: String,
            default: '',
        },
    },
});
</script>

<style scoped>
@import 'mdd-list-item-like.css';

.mdd-list-item {
    --border-color: var(--mdd-list-item-border-color, rgba(0, 0, 0, 0.12));
    --hover-bg: var(--mdd-list-item-hover-bg, rgba(0, 0, 0, 0.04));
    --active-bg: var(--mdd-list-item-focus-bg, rgba(0, 0, 0, 0.08));
    --top-padding: var(--mdd-list-item-top-padding, 16px);
    --horizontal-padding: var(--mdd-list-item-horizontal-padding, 16px);
    --bottom-padding: var(--mdd-list-item-bottom-padding, 16px);

    padding: var(--top-padding) var(--horizontal-padding) var(--bottom-padding);

    transition: 0.125s background ease-out;

    user-select: none;
}

.mdd-list-item.with-border {
    border-bottom: 1px solid var(--border-color);
}

.mdd-list-item:hover {
    background: var(--hover-bg);
}

.mdd-list-item:active {
    background: var(--active-bg);
}
</style>
