<template>
    <div class="app-sidebar">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { RouteNames, userService } from '@/dependencies';

import User from '@/models/User';

export default defineComponent({
    name: 'AppSidebar',
    data() {
        return {
            user: undefined as User | undefined,
        };
    },
    mounted() {
        this.reloadUser();
    },
    methods: {
        async reloadUser(): Promise<void> {
            this.user = await userService.getLoggedInUser();
        },
        async onHomeButtonClick(): Promise<void> {
            await this.$router.push({
                name: RouteNames.AREAS,
                query: {
                    page: 0,
                },
            });
        },
        async onLogoutButtonClick(): Promise<void> {
            await userService.logoutUser();
        },
    },
});
</script>

<style scoped>
#app-sidebar-content {
    cursor: initial;
    pointer-events: initial;
}

.sidebar-item {
    padding: 16px 24px;
    line-height: 24px;
    border-bottom: 1px solid var(--menu-bottom-border-color);

    display: flex;

    vertical-align: middle;

    cursor: pointer;

    z-index: 100;
}

.sidebar-item > * {
    display: block;
}

.sidebar-item .icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
    margin-right: 24px;
}

.logo-container {
    font-size: 20px;
}
</style>
