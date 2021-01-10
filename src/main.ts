import '@mdi/font/css/materialdesignicons.css';
import '@/app/index.css';
import '@/app/theme.scss';

import { createApp, VNode } from 'vue';
import BalmUI from 'balm-ui';

import { store, router } from '@/dependencies';

import { ObserveVisibility } from 'vue-observe-visibility';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

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

app.use(BalmUI);
app.use(store);
app.use(router);
app.mount('#app');

defineCustomElements(window);
