<template>
    <transition
            name="expand"
            enter-active-class="enter-active"
            leave-active-class="leave-active"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @before-leave="beforeLeave"
            @leave="leave"
            @after-leave="afterLeave"
            :style="{
                transition: `height ${speed} ${timing}`,
            }"
    >
        <slot></slot>
    </transition>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HeightTransition',
    props: {
        speed: {
            type: String,
            default: '0.25s',
        },
        timing: {
            type: String,
            default: 'ease-out',
        },
    },
    methods: {
        beforeEnter(element: HTMLElement): void {
            requestAnimationFrame(() => {
                if (!element.style.height) {
                    element.style.height = '0px';
                }

                element.style.display = '';
            });
        },
        enter(element: HTMLElement): void {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.height = `${element.scrollHeight}px`;
                });
            });
        },
        afterEnter(element: HTMLElement): void {
            element.style.height = '';
        },
        beforeLeave(element: HTMLElement): void {
            requestAnimationFrame(() => {
                if (!element.style.height) {
                    element.style.height = `${element.offsetHeight}px`;
                }
            });
        },
        leave(element: HTMLElement): void {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    element.style.height = '0px';
                });
            });
        },
        afterLeave(element: HTMLElement): void {
            element.style.height = '';
        },
    },
});
</script>

<style scoped>
.enter-active,
.leave-active {
    overflow: hidden;
    transition: height 1s linear;
}

.content {
    background: grey;
}
</style>
