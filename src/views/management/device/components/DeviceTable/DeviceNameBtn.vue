<template>
  <a
    class="text-left hover:underline hover:cursor-pointer transition-all duration-300"
    @click="onClick"
  >
    {{ device.name }}
  </a>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  device: {
    id: string;
    name: string;
    isGateway: boolean;
  };
}>();

function onClick() {
  if (props.device.isGateway) {
    router.push(`/gateways/${props.device.id}`);
  } else {
    router.push(`/devices/${props.device.id}`);
  }
}
</script>
