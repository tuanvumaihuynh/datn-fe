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
    <ScrollArea class="h-[60vh] w-full relative">
      <Table>
        <TableHeader class="sticky top-0 bg-background z-50">
          <TableRow>
            <TableHead class="w-[12vw]">Last Update</TableHead>
            <TableHead class="w-[10vw]">Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead class="w-[3vw]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="attributes.length">
            <TableRow v-for="attribute in attributes" :key="attribute.key">
              <TableCell>{{ attribute.lastUpdate }}</TableCell>
              <TableCell>{{ attribute.key }}</TableCell>
              <TableCell>
                <span class="line-clamp-6">
                  {{ attribute.value }}
                </span>
              </TableCell>
              <TableCell>
                <Pencil
                  class="w-4 h-4 cursor-pointer hover:text-primary"
                  @click="onEditAttribute(attribute)"
                />
              </TableCell>
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
  <DeviceAttributeEditDialog
    v-if="selectedAttribute"
    v-model:show-edit-dialog="showEditDialog"
    :attribute="selectedAttribute!"
    @submitted="fetchDeviceAttributes"
  />
</template>

<script setup lang="ts">
import { LoaderCircle, Pencil } from "lucide-vue-next";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeviceAttributeEditDialog from "./DeviceAttributeEditDialog.vue";

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import useSyncPolling from "@/hooks/useSyncPolling";
import { getDeviceAttributeKeys, getDeviceAttributes } from "@/api/telemetry";
import { Attribute } from "@/types/telemetry";

const ATTRIBUTES_POLLING_INTERVAL = 2000;

const { syncPolling } = useSyncPolling();

const route = useRoute();

const isLoading = ref(true);
const deviceId = computed(() => route.params.id as string);
const attributes = ref<Attribute[]>([]);
const showEditDialog = ref(false);
const selectedAttribute = ref<Attribute | null>(null);

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

function onEditAttribute(attribute: Attribute) {
  selectedAttribute.value = attribute;
  showEditDialog.value = true;
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
