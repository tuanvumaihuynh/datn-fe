<template>
  <div
    v-if="isLoading"
    class="flex flex-col flex-1 items-center justify-center"
  >
    <LoaderCircle
      class="w-12 h-12 animate-spin text-primary"
      aria-label="Loading..."
    />
  </div>
  <div v-else class="grid gap-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-sm font-medium">Name</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ device?.name }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">Connected node</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.node ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">Location</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">Vietnam</p>
      </div>
      <div>
        <span class="text-sm font-medium">Connected/Disconnected at</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{
            (connectivity?.connected
              ? connectivity?.conn_connected_at
              : connectivity?.conn_disconnected_at) ?? "N/A"
          }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">Description</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ device?.description ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">IP address</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ ipAddress }}
        </p>
      </div>
    </div>

    <Separator orientation="horizontal" />
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-sm font-medium">Bytes sent</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.bytes_sent ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">Bytes received</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.bytes_received ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">PUBLISH Received message</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.recv_msg_send ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">PUBLISH Message sent</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.pub_msg_send ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS0 message received</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.recv_msg_send_qos0 ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS0 message sent</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.pub_msg_send_qos0 ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS1 message received</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.recv_msg_send_qos1 ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS1 message sent</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.pub_msg_send_qos1 ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS2 message received</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.recv_msg_send_qos2 ?? "N/A" }}
        </p>
      </div>
      <div>
        <span class="text-sm font-medium">QoS2 message sent</span>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ connectivity?.pub_msg_send_qos2 ?? "N/A" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getDeviceConnectivity } from "@/api/device";
import { Device, DeviceConnectivity } from "@/types/device";

const props = defineProps<{
  device: Device;
}>();

const route = useRoute();
const isLoading = ref(true);
const connectivity = ref<DeviceConnectivity>();
const deviceId = computed(() => route.params.id as string);
const ipAddress = computed(() => {
  const ip = connectivity.value?.ip_address;
  const port = connectivity.value?.port;
  return ip && port ? `${ip}:${port}` : "N/A";
});

async function fetchConnectivity() {
  try {
    const { data } = await getDeviceConnectivity(deviceId.value);
    connectivity.value = data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  if (props.device.type !== "SubDevice") {
    await fetchConnectivity();
  }
  isLoading.value = false;
});
</script>
