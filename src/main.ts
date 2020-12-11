// import '@ionic/vue/css/core.css';
// import '@ionic/vue/css/normalize.css';
// import '@ionic/vue/css/structure.css';
// import '@ionic/vue/css/typography.css';

import '@mdi/font/css/materialdesignicons.css';
import '@/app/index.css';

import { createApp } from 'vue';
// import {IonicVue} from '@ionic/vue';

import { store, router } from '@/dependencies';

import App from '@/app/App.vue';

const app = createApp(App);

// app.use(IonicVue);
app.use(store);
app.use(router);
app.mount('#app');
