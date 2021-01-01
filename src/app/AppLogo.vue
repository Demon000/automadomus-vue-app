<template>
    <div class="logo">
        <span class="first-part">o</span>
        <span class="second-part">domu</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppLogo',
});
</script>

<style scoped>
.logo {
    font-family: "Nunito", sans-serif;
}

.logo .first-part {
    color: var(--logo-second-part-color);
}

.logo .second-part {
    color: var(--logo-first-part-color);
}
</style>
