<template>
    <i :class="`mdd-icon ${name}`"></i>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MddIcon',
    props: {
        name: String,
    },
});
</script>

<style scoped>
.mdd-icon {
    --size: var(--mdd-icon-size, 24px);

    display: inline-block;

    width: var(--size);
    height: var(--size);
    line-height: var(--size);
    font-size: var(--size);
    vertical-align: middle;
}
</style>
