<template>
    <div
            class="mdd-card"
            :class="{
                'elevation-1': elevation === 1,
                'elevation-2': elevation === 2,
                'elevation-3': elevation === 3,
                'elevation-4': elevation === 4,
                'elevation-5': elevation === 5,
                'hover-elevation-1': hoverElevation === 1,
                'hover-elevation-2': hoverElevation === 2,
                'hover-elevation-3': hoverElevation === 3,
                'hover-elevation-4': hoverElevation === 4,
                'hover-elevation-5': hoverElevation === 5,
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
.mdd-card {
    --margin: var(--mdd-card-margin, 16px);
    --padding: var(--mdd-card-padding, 8px);

    margin: var(--margin);

    transition: 0.25s box-shhadow ease-out;
}

.content {
    padding: var(--padding);
}

.elevation-1,
.hover-elevation-1:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.elevation-2,
.hover-elevation-2:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.elevation-3,
.hover-elevation-3:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.elevation-4,
.hover-elevation-4:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.elevation-5,
.hover-elevation-5:hover {
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
}
</style>
