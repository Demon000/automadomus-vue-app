<template>
    <div
            class="mdd-input"
            :class="{
                'focused': focused,
                'outline': outline,
                'floating-label': isLabelFloating,
            }"
    >
        <div class="border">
            <div class="left"></div>
            <div class="middle">
                <span
                        class="label"
                        v-if="label"
                >
                    <slot name="label">
                        {{ label }}
                    </slot>
                </span>
            </div>
            <div class="right"></div>
        </div>
        <div class="field-container">
            <div class="before-field">
            </div>
            <div
                    class="field"
                    :class="{
                        'select': isSelect,
                    }"
                    v-if="isSelect"
            >
                {{ inputValue }}
            </div>
            <input
                    class="field"
                    :type="type"
                    v-model="inputValue"
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                    v-else
            >
            <div class="after-field">
                <template v-if="isSelect">
                    <mdd-icon
                            v-if="focused"
                            name="mdi mdi-menu-up"
                    ></mdd-icon>
                    <mdd-icon
                            v-else
                            name="mdi mdi-menu-down"
                    ></mdd-icon>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MddIcon from '@/mdd-components/MddIcon.vue';

export default defineComponent({
    name: 'MddInput',
    components: {
        MddIcon,
    },
    props: {
        label: {
            type: String,
            default: '',
        },
        outline: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            default: '',
        },
        iconBefore: {
            type: String,
            default: '',
        },
        iconAfter: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        options: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    emits: [
        'update:modelValue',
    ],
    computed: {
        inputValue: {
            get(): string {
                return this.modelValue;
            },
            set(value: string) {
                this.$emit('update:modelValue', value);
            },
        },
        isLabelFloating(): boolean {
            return this.focused || !!this.modelValue;
        },
        isSelect(): boolean {
            return this.type === 'select';
        },
    },
    data() {
        return {
            focused: false,
        };
    },
    mounted() {
        this.inputValue = '';
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
    --height: var(--mdd-input-height, 56px);

    --border-color: var(--mdd-input-border-color, rgba(0, 0, 0, 0.45));
    --border-color-hovered: var(--mdd-input-border-color-hovered, rgba(0, 0, 0, 0.87));
    --border-color-focused: var(--mdd-input-border-color-focused, #0070ff);
    --border-color-effective: var(--border-color);

    --border-width: var(--mdd-input-border-width, 1px);
    --border-width-focused: var(--mdd-input-border-width-focused, 2px);
    --border-width-effective: var(--border-width);

    --border-radius: var(--mdd-input-border-radius, 4px);

    --top-padding: var(--mdd-input-top-padding, 20px);
    --horizontal-padding: var(--mdd-input-horizontal-padding, 16px);
    --bottom-padding: var(--mdd-input-bottom-padding, 20px);
    --label-horizontal-padding: var(--mdd-input-label-horizontal-padding, 4px);

    position: relative;

    margin-top: 0.375em;
}

.mdd-input:hover {
    --border-color-effective: var(--border-color-hovered);
}

.mdd-input.focused {
    --border-color-effective: var(--border-color-focused);
    --border-width-effective: var(--border-width-focused);
}

.border {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;

    pointer-events: none;
}

.border .left,
.border .right,
.border .middle {
    box-sizing: border-box;

    border-radius: var(--border-radius);
    border: var(--border-width-effective) solid var(--border-color-effective);
    color: var(--border-color-effective);

    --border-transition: 0.125s border-color ease-out;
    transition: var(--border-transition);
}

.border .left {
    width: calc(var(--horizontal-padding) - var(--label-horizontal-padding));

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
}

.border .middle {
    border-radius: 0;
    border-left-width: 0;
    border-right-width: 0;

    position: relative;

    padding: 0 var(--label-horizontal-padding);
}

.floating-label .border .middle {
    border-top-width: 0;
}

.border .middle .label {
    display: block;

    position: relative;
    top: var(--top-padding);

    line-height: 1em;
    height: 1em;

    transition:
            0.125s top ease-out,
            0.125s color ease-out,
            0.125s font-size ease-out;
}

.floating-label .border .middle .label {
    top: -0.5em;

    font-size: 0.75em;

    color: var(--border-color-effective);
}

.border .right {
    flex-grow: 1;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
}

.field-container {
    display: flex;
}

.field {
    display: block;

    font-size: 1em;

    box-sizing: border-box;
    height: calc(var(--top-padding) + var(--bottom-padding) + 1em);
    padding: var(--top-padding) var(--horizontal-padding) var(--bottom-padding);

    width: 100%;
    outline: 0 solid transparent;
    background: transparent;
    border: 0;
}

.field.select {
    padding-right: 0;
}

.before-field {
    padding-left: 16px;
}

.after-field {
    padding-right: 16px;
}
</style>
