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
            <TableHead class="w-[15vw]">Timestamp</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="metrics.length">
            <TableRow
              v-for="metric in metrics.sort((a, b) =>
                b.key.localeCompare(a.key)
              )"
              :key="metric.key"
            >
              <TableCell>{{ metric.ts }}</TableCell>
              <TableCell>{{ metric.key }}</TableCell>
              <TableCell class="max-w-[500px]">{{ metric.value }}</TableCell>
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
import { getLatestDeviceMetrics } from "@/api/telemetry";
import { Metric } from "@/types/telemetry";

const LATEST_METRIC_POLLING_INTERVAL = 2000;

const route = useRoute();
const { syncPolling } = useSyncPolling();
const isLoading = ref(true);
const deviceId = computed(() => route.params.id as string);

const metrics = ref<Metric[]>([]);

async function fetchLatestMetric() {
  try {
    const { data } = await getLatestDeviceMetrics(deviceId.value);
    metrics.value = data.map((item: any) => {
      return {
        key: item.key,
        value: item.value,
        ts: useDateFormat(item.ts, "YYYY-MM-DD HH:mm:ss").value,
      };
    });
  } catch (error) {
    console.error(error);
  } finally {
  }
}
onMounted(async () => {
  isLoading.value = true;
  await fetchLatestMetric();
  if (metrics.value.length) {
    syncPolling(fetchLatestMetric, LATEST_METRIC_POLLING_INTERVAL);
  }
  isLoading.value = false;
});
</script>
