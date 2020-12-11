<template>
    <div class="connectivity-status">
        <template v-if="!isOnline" class="text">
            Offline
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { networkTracker } from '@/dependencies';

export default defineComponent({
    name: 'AppConnectivityStatus',
    data() {
        return {
            isOnline: true as boolean,
        };
    },
    async mounted() {
        await networkTracker.on(this.onNetworkStateChange);
    },
    beforeUnmount() {
        networkTracker.off(this.onNetworkStateChange);
    },
    methods: {
        onNetworkStateChange(isOnline: boolean) {
            this.isOnline = isOnline;
        },
    },
});
</script>

<style scoped>
.connectivity-status {
    padding: 0 8px;
}
</style>
