<template>
    <div
            class="app-banner"
            v-shadow="1"
    >
        <div class="text">
            <slot name="text">
                <span>{{ message }}}</span>
            </slot>
        </div>
        <div class="actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'AppBanner',
    props: {
        message: String,
    },
};
</script>

<style scoped>
.app-banner {
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
}

.text {
    padding: 8px 0;
    margin-right: 16px;
}
</style>
