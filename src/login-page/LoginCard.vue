<template>
    <div class="login-card">
        <ui-textfield
                class="ui-textfield"
                fullwidth
                outlined
                v-model="username"
                @keyup.enter="onLoginButtonClick"
        >
            Username
        </ui-textfield>

        <ui-textfield
                class="ui-textfield"
                fullwidth
                outlined
                v-model="password"
                input-type="password"
                @keyup.enter="onLoginButtonClick"
        >
            Password
        </ui-textfield>

        <ui-fab
                extended
                @click="onLoginButtonClick"
        >
            <span>Login</span>
        </ui-fab>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { userService } from '@/dependencies';

export default defineComponent({
    name: 'LoginCard',
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

.ui-textfield {
    margin-bottom: 16px;
}
</style>
