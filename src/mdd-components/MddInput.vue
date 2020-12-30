<template>
    <div
            class="mdd-input"
            v-bind:class="{
                'focused': focused,
                'outline': outline,
            }"
    >
        <label>
            <span
                    class="mdd-input-label"
                    v-if="label"
            >
                {{ label }}
            </span>
            <input
                    class="mdd-input-field"
                    type="text"
                    v-on:focus="onInputFocus"
                    v-on:blur="onInputBlur"
            >
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MddInput',
    props: {
        label: {
            type: String,
            default: '',
        },
        outline: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            focused: false,
        };
    },
    methods: {
        onInputFocus() {
            this.focused = true;
        },
        onInputBlur() {
            this.focused = false;
        },
    },
});
</script>

<style scoped>
.mdd-input {
    position: relative;

    box-sizing: border-box;
}
.mdd-input.outline {
    --top-padding: 12px;
    --side-padding: 16px;
}

.mdd-input-label {
    position: absolute;
}
.mdd-input.outline .mdd-input-label {
    line-height: 1.875;
    font-size: 1em;

    top: var(--top-padding);
    left: var(--side-padding);

    transition:
            0.25s line-height ease-out,
            0.25s font-size ease-out,
            0.25s top ease-out;
}
.mdd-input.outline.focused .mdd-input-label {
    line-height: 0.85;
    font-size: 0.85em;

    top: -0.425em;
}

.mdd-input-field {
    line-height: 1.875;
    padding: var(--top-padding) var(--side-padding) 14px;

    width: 100%;
    outline: 0 solid transparent;
}
</style>
