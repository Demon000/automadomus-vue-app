// import '@ionic/vue/css/core.css';
// import '@ionic/vue/css/normalize.css';
// import '@ionic/vue/css/structure.css';
// import '@ionic/vue/css/typography.css';

import '@mdi/font/css/materialdesignicons.css';
import '@/app/index.css';

import { createApp, VNode } from 'vue';
// import {IonicVue} from '@ionic/vue';

import { store, router } from '@/dependencies';

import { ObserveVisibility } from 'vue-observe-visibility';

import App from '@/app/App.vue';

const app = createApp(App);

app.directive('observe-visibility', {
    beforeMount: (el, binding, vnode: VNode) => {
        (vnode as any).context = binding.instance;
        ObserveVisibility.bind(el, binding, vnode);
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
});

// app.use(IonicVue);
app.use(store);
app.use(router);
app.mount('#app');
