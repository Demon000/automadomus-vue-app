<template>
    <div>
        <!--    <ion-card class="login-card">-->
        <!--        <ion-card-header>-->
        <!--            <ion-card-title>Login</ion-card-title>-->
        <!--        </ion-card-header>-->

        <!--        <ion-card-content class="login-card-content">-->
        <!--            <ion-item>-->
        <!--                <ion-label position="floating">Username</ion-label>-->
        <!--                <ion-input-->
        <!--                        v-model="username"-->
        <!--                        v-on:keyup.enter="onLoginButtonClick"-->
        <!--                ></ion-input>-->
        <!--            </ion-item>-->

        <!--            <ion-item>-->
        <!--                <ion-label position="floating">Password</ion-label>-->
        <!--                <ion-input-->
        <!--                        type="password"-->
        <!--                        v-model="password"-->
        <!--                        v-on:keyup.enter="onLoginButtonClick"-->
        <!--                ></ion-input>-->
        <!--            </ion-item>-->

        <!--            <ion-fab-->
        <!--                    vertical="bottom"-->
        <!--                    horizontal="end"-->
        <!--                    edge="true"-->
        <!--                    slot="fixed"-->
        <!--                    v-on:click="onLoginButtonClick"-->
        <!--            >-->
        <!--                <ion-fab-button>-->
        <!--                    <ion-icon class="mdi mdi-arrow-right"></ion-icon>-->
        <!--                </ion-fab-button>-->
        <!--            </ion-fab>-->
        <!--        </ion-card-content>-->
        <!--    </ion-card>-->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// import {
//     IonCard,
//     IonCardContent,
//     IonCardHeader,
//     IonCardSubtitle,
//     IonCardTitle,
//     IonInput,
//     IonItem,
//     IonLabel,
//     IonFab,
//     IonFabButton,
//     IonIcon,
// } from '@ionic/vue'
import MddInput from 'mdd-vue-components';
import { userService } from '@/dependencies';

export default defineComponent({
    name: 'LoginCard',
    components: {
        MddInput,
    // IonCard,
    // IonCardHeader,
    // IonCardSubtitle,
    // IonCardTitle,
    // IonCardContent,
    // IonItem,
    // IonLabel,
    // IonInput,
    // IonFab,
    // IonFabButton,
    // IonIcon,
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
    overflow: visible;
}

.login-card-content {
    padding-bottom: 56px;
}
</style>
