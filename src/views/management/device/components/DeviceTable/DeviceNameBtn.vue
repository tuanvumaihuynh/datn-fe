<template>
  <a
    class="text-left text-sm font-medium hover:cursor-pointer"
    @click="$router.push(`/devices/${device.id}`)"
  >
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
