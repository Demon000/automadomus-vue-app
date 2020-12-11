<template>
    <div class="app-content">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoginPage from '@/login-page/LoginPage.vue';
import { areaService } from '@/dependencies';

export default defineComponent({
    name: 'App',
    components: {
        LoginPage,
    },
    async mounted() {
        await areaService.getAreaCategories();
    },
});
</script>

<style>
:root {
    --accent-color: #0070ff;
    --ion-color-primary: var(--accent-color);

    --menu-bottom-border-color: #eeeeee;

    --navbar-bg-color: #eeeeee;
    --navbar-area-action-button-bg-color: #e0e0e0;

    --shade-color: #e0e0e0;

    --logo-first-part-color: #111111;
    --logo-second-part-color: #0070ff;

    --pagination-page-bg-color: #eeeeee;
    --pagination-page-hover-bg-color: #e0e0e0;
    --pagination-page-disabled-fg-color: #777777;
}

#app,
#app-content {
    overflow: auto;
    min-height: 100%;
}
</style>
