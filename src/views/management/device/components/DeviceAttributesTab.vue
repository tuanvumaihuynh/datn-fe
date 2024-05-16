<template>
  <div
    v-if="isLoading"
    class="flex flex-col flex-1 justify-center items-center"
  >
    <LoaderCircle
      class="w-12 h-12 animate-spin text-primary"
      aria-label="Loading..."
    />
  </div>
  <div v-else class="flex flex-col gap-2">
    <ScrollArea class="h-[64vh] w-full relative">
      <Table>
        <TableHeader class="sticky top-0 bg-background z-50">
          <TableRow>
            <TableHead class="w-[15vw]">Last Update</TableHead>
            <TableHead class="w-[20vw]">Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="attributes.length">
            <TableRow v-for="attribute in attributes" :key="attribute.key">
              <TableCell>{{ attribute.lastUpdate }}</TableCell>
              <TableCell>{{ attribute.key }}</TableCell>
              <TableCell>{{ attribute.value }}</TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colSpan="3" class="h-24 text-center">
                No attributes found.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import useSyncPolling from "@/hooks/useSyncPolling";
import { getDeviceAttributeKeys, getDeviceAttributes } from "@/api/telemetry";
import { Attribute } from "@/types/telemetry";

const ATTRIBUTES_POLLING_INTERVAL = 2000;

const route = useRoute();
const { syncPolling } = useSyncPolling();
const isLoading = ref(true);
const deviceId = computed(() => route.params.id as string);

const attributes = ref<Attribute[]>([]);

async function fetchDeviceAttributes() {
  try {
    const { data: keys } = await getDeviceAttributeKeys(deviceId.value);
    const { data } = await getDeviceAttributes({
      deviceId: deviceId.value,
      keys: keys,
    });
    attributes.value = data.map((item: any) => {
      return {
        key: item.key,
        value: item.value,
        lastUpdate: useDateFormat(item.last_update, "YYYY-MM-DD HH:mm:ss")
          .value,
      };
    });
  } catch (error) {
    console.error(error);
  } finally {
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchDeviceAttributes();
  if (attributes.value.length) {
    syncPolling(fetchDeviceAttributes, ATTRIBUTES_POLLING_INTERVAL);
  }
  isLoading.value = false;
});
</script>
