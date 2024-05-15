<template>
  <Badge :variant="device.connected ? 'default' : 'destructive'">
    {{ device.connected ? "Connected" : "Disconnected" }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
defineProps<{
  device: {
    connected: boolean;
  };
}>();
</script>
