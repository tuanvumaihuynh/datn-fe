<template>
  <Button
    size="icon"
    variant="outline"
    :class="props.class"
    @click="handleCopy"
  >
    <component :is="currentIcon" class="h-3 w-3" />
    <span class="sr-only">Copy to clipboard</span>
  </Button>
</template>

<script setup lang="ts">
import { Copy, Check } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

import type { HTMLAttributes } from "vue";
import { ref, shallowRef } from "vue";
import useClipboard from "@/hooks/useClipboard";

const { copyToClipboard } = useClipboard();

const props = defineProps<{
  class?: HTMLAttributes["class"];
  text: string;
}>();

const currentIcon = shallowRef(Copy);
const timeoutId = ref();

const handleCopy = () => {
  copyToClipboard(props.text);
  currentIcon.value = Check;
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
  timeoutId.value = setTimeout(() => {
    currentIcon.value = Copy;
  }, 2000); // Change back to Copy icon after 2 seconds
};
</script>
