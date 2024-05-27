<template>
  <div
    class="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100"
  >
    <ol
      class="relative z-10 flex justify-between text-sm font-medium text-muted-foreground"
    >
      <li
        v-for="(step, i) in stepVals"
        :key="i"
        class="flex items-center gap-2 bg-background p-2"
      >
        <span
          class="flex justify-center items-center size-6 rounded-full text-center text-[10px]/6 font-bold"
          :class="{
            'bg-primary text-white': step.active || step.done,
            'bg-gray-100': !step.active && !step.done,
          }"
        >
          <template v-if="step.done">
            <Check class="w-3 h-3" />
          </template>
          <template v-else>
            {{ i + 1 }}
          </template>
        </span>

        <span class="hidden sm:block"> {{ step.value }} </span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  values: string[];
  activeValue: string;
}>();

const stepVals = computed(() => {
  return props.values.map((value) => {
    return {
      value,
      active: value === props.activeValue,
      done:
        props.values.indexOf(value) < props.values.indexOf(props.activeValue),
    };
  });
});
</script>
