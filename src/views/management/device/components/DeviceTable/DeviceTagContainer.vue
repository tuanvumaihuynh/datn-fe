<template>
  <div>
    <Badge
      v-for="tag in device.tags"
      :key="tag"
      variant="outline"
      class="mr-1 my-0.5"
    >
      {{ tag }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";

defineProps<{
  device: {
    tags: string[];
  };
}>();
</script>
