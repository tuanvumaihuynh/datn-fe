<template>
  <a class="text-left">
    {{ device.name }}
  </a>
</template>

<script setup lang="ts">
defineProps<{
  device: {
    id: string;
    name: string;
  };
}>();
</script>
