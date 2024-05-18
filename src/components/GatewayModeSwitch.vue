<template>
  <div class="flex items-center space-x-2">
    <Switch id="gateway-mode" v-model:checked="gatewayMode" />
    <Label for="gateway-mode">Gateway Mode</Label>
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  deviceId: string;
  initialGatewayMode: boolean;
}>();

const router = useRouter();
const gatewayMode = ref(props.initialGatewayMode);

watch(gatewayMode, (value) => {
  if (value) {
    router.replace({
      path: `/gateways/${props.deviceId}`,
    });
  } else {
    router.replace({
      path: `/devices/${props.deviceId}`,
    });
  }
});
</script>
