<template>
    <div
            class="mdd-card mdd-list-item-like mdd-elevation"
            :class="{
                'mdd-elevation-1': elevation === 1,
                'mdd-elevation-2': elevation === 2,
                'mdd-elevation-3': elevation === 3,
                'mdd-elevation-4': elevation === 4,
                'mdd-elevation-5': elevation === 5,
                'mdd-hover-elevation-1': hoverElevation === 1,
                'mdd-hover-elevation-2': hoverElevation === 2,
                'mdd-hover-elevation-3': hoverElevation === 3,
                'mdd-hover-elevation-4': hoverElevation === 4,
                'mdd-hover-elevation-5': hoverElevation === 5,
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
    name: 'MddCard',
    props: {
        elevation: {
            type: Number,
            default: 1,
        },
        hoverElevation: {
            type: Number,
            default: 1,
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
@import 'mdd-elevation-shadow.css';

.mdd-card {
    --margin: var(--mdd-card-margin, 16px);
    --padding: var(--mdd-card-padding, 16px);

    margin: var(--margin);

    transition: 0.25s box-shhadow ease-out;

    border-radius: 2px;
}

.content {
    padding: var(--padding);
}
</style>
