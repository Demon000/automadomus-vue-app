<template>
    <div class="login-card">
        <mdd-input
                :outline="true"
                label="Username"
                v-model="username"
                @keyup.enter="onLoginButtonClick"
        ></mdd-input>

        <mdd-input
                :outline="true"
                label="Password"
                type="password"
                v-model="password"
                @keyup.enter="onLoginButtonClick"
        ></mdd-input>

        <mdd-fab
                title="LOGIN"
                @click="onLoginButtonClick"
        >
        </mdd-fab>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MddInput from '@/mdd-components/MddInput.vue';
import MddFab from '@/mdd-components/MddFab.vue';
import { userService } from '@/dependencies';

export default defineComponent({
    name: 'LoginCard',
    components: {
        MddInput,
        MddFab,
    },
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async onLoginButtonClick() {
            await userService.loginUser({
                username: this.username,
                password: this.password,
            });
        },
    },
});
</script>

<style scoped>
.login-card {
    text-align: center;
}
</style>
