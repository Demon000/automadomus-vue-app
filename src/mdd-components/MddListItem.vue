<template>
    <div
            class="mdd-list-item"
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
.mdd-list-item {
    --border-color: var(--mdd-list-item-border-color, rgba(0, 0, 0, 0.12));
    --subheader-color: var(--mdd-list-item-subheader-color, rgba(0, 0, 0, 0.54));
    --hover-background: var(--mdd-list-item-hover-background, rgba(0, 0, 0, 0.04));
    --active-background: var(--mdd-list-item-focus-background, rgba(0, 0, 0, 0.08));
    --top-padding: var(--mdd-list-item-top-padding, 16px);
    --side-padding: var(--mdd-list-item-side-padding, 16px);
    --bottom-padding: var(--mdd-list-item-bottom-padding, 16px);

    padding: var(--top-padding) var(--side-padding) var(--bottom-padding);

    transition: 0.125s background ease-out;

    user-select: none;
}

.mdd-list-item.with-border {
    border-bottom: 1px solid var(--border-color);
}

.mdd-list-item:hover {
    background: var(--hover-background);
}

.mdd-list-item:active {
    background: var(--active-background);
}

.header,
.subheader {
    vertical-align: bottom;
}

.header {
    margin-bottom: 0.25em;

    line-height: 1em;
}

.subheader {
    line-height: 1em;
    font-size: 0.875em;

    color: var(--subheader-color);
}
</style>
