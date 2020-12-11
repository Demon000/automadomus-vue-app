<template>
    <div class="login-page">
        <div class="logo-container">
            <app-logo></app-logo>
        </div>

        <login-card class="login-card"></login-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LoginCard from './LoginCard.vue';
import AppLogo from '@/app/AppLogo.vue';

export default defineComponent({
    name: 'LoginPage',
    components: {
        LoginCard,
        AppLogo,
    },
});
</script>

<style scoped>
.login-page {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 16px;
}

.login-card {
    width: 500px;

    max-width: 100%;
    max-height: 100vh;
}

.logo-container {
    font-size: 64px;
    text-align: center;

    width: 100%;

    padding: 32px 0;
}

@media (max-width: 1024px) {
}
</style>
