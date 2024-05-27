<template>
  <div class="grid gap-4 xl:grid-cols-4 md:gap-8 grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>MQTT Broker Info</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">Broker:</span>
          <span>broker.projectenergy.cloud</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">TCP Port:</span>
          <span>1883</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">SSL/TLS Port:</span>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-red-500" />
            <span>Not Available</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Status:</span>
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span>Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>MQTT Broker Details</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">Authentication:</span>
          <span>MQTT Basic</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Authorization:</span>
          <span>ACL-based</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Persistence:</span>
          <span>PostgreSQL</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Uptime:</span>
          <span>{{ transMsNumToSimpleStr(coreNodeInfo.uptime) }}</span>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent class="flex py-4 flex-col gap-2">
        <span>
          Incoming Rate:
          {{ currentMetrics.received_msg_rate }} messages/sec
        </span>
        <BarChart
          class="h-12"
          :data="currentMetricsLogs.received_msg_rate"
          index="x"
          :categories="['y']"
          :show-y-axis="false"
          :show-x-axis="false"
          :show-legend="false"
          :duration="10"
        />
        <span>
          Outgoing Rate:
          {{ currentMetrics.sent_msg_rate }} messages/sec
        </span>
        <BarChart
          class="h-12"
          :data="currentMetricsLogs.sent_msg_rate"
          index="x"
          :categories="['y']"
          :show-y-axis="false"
          :show-x-axis="false"
          :show-legend="false"
          :duration="10"
        />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Clients monitoring</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2">
        <div class="flex items-center justify-between">
          <span class="font-medium">Connections:</span>
          <span>{{ currentMetrics.connections }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Live connections:</span>
          <span>{{ currentMetrics.live_connections }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Topics:</span>
          <span>{{ currentMetrics.topics }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="font-medium">Subscriptions:</span>
          <span>{{ currentMetrics.subscriptions }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
  <PolylineCards />
</template>

<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PolylineCards from "./components/PolylineCards.vue";

import { reactive, ref, Ref } from "vue";
import Moment from "moment";
import useSyncPolling from "@/hooks/useSyncPolling";
import useDurationStr from "@/hooks/useDurationStr";
import { getMonitorCurrent, getNodesInfo } from "@/api/monitor";

const POLLING_INTERVAL = 2000;

interface MetricData {
  x?: string;
  y: number;
}

const createEmptyDataItem = (length: number) =>
  Array.from({ length }).map(() => ({
    x: undefined,
    y: 0,
  }));

const currentMetricsLogs: Record<string, Array<MetricData>> = reactive({
  received_msg_rate: createEmptyDataItem(32),
  sent_msg_rate: createEmptyDataItem(32),
});
const currentMetrics: Ref<Record<string, number>> = ref({
  node: 0, // Nodes number
  received_msg_rate: 0, // Incoming Rate
  sent_msg_rate: 0, // Outgoing Rate
  received_bytes_rate: 0, // Incoming Bytes Rate
  sent_bytes_rate: 0, // Outgoing Bytes Rate
  subscriptions: 0, // Subs number
  connections: 0, // Connections number
  topics: 0, // Topics
  live_connections: 0, // Live Connections
});
const coreNodeInfo = ref({
  connections: 0,
  live_connections: 0,
  node: "core",
  memory_used: 0,
  memory_total: 100,
  uptime: 0,
});

const { syncPolling } = useSyncPolling();
const { transMsNumToSimpleStr } = useDurationStr();

async function loadData() {
  const { data: state } = await getMonitorCurrent();
  if (!state) return;
  currentMetrics.value = state;
  setCurrentMetricsLogsRealtime(state);
}

async function loadNodesInfo() {
  const { data: nodes } = await getNodesInfo();
  if (!nodes) return;
  const coreNode = nodes[0];
  coreNodeInfo.value = coreNode;
}
function getNow() {
  return Moment().format("HH:mm:ss");
}

const setCurrentMetricsLogsRealtime = (state: Record<string, number> = {}) => {
  ["received_msg_rate", "sent_msg_rate"].forEach((key) => {
    currentMetricsLogs[key] = currentMetricsLogs[key] || [];
    const currentValue = state[key] || 0;
    currentMetricsLogs[key].push({
      x: getNow(),
      y: currentValue,
    });
    if (currentMetricsLogs[key].length >= 16) {
      currentMetricsLogs[key].shift();
    }
  });
};

syncPolling(loadData, POLLING_INTERVAL);
syncPolling(loadNodesInfo, POLLING_INTERVAL);
</script>
