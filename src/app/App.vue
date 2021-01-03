<template>
    <div id="app-content">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { areaService } from '@/dependencies';

export default defineComponent({
    name: 'App',
    async mounted() {
        await areaService.getAreaCategories();
    },
});
</script>

<style>
:root {
    --accent-color: #0070ff;

    --menu-bottom-border-color: #eeeeee;

    --navbar-bg-color: var(--accent-color);
    --navbar-fg-color: rgba(255, 255, 255, 1);
    --navbar-network-tracker-fg-color: rgba(255, 255, 255, 0.87);
    --navbar-action-button-hover-bg: rgba(255, 255, 255, 0.08);
    --navbar-action-button-active-bg: rgba(255, 255, 255, 0.16);

    --shade-color: #e0e0e0;

    --logo-first-part-color: #111111;
    --logo-second-part-color: #0070ff;
}

#app-content {
    overflow: auto;
    height: 100%;
}
</style>
