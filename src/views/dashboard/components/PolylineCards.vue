<template>
  <Select v-model:model-value="timeRangeStr">
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Last hour" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Time Range</SelectLabel>
        <SelectItem
          v-for="option in timeRangeOptions"
          :value="option.value.toString()"
        >
          {{ option.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
  <div class="grid gap-4 md:gap-8 xl:grid-cols-2 grid-cols-1">
    <Card>
      <CardHeader>
        <CardTitle>Incoming Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex h-96 justify-center items-center">
          <LoaderCircle
            class="w-12 h-12 animate-spin text-primary"
            aria-label="Loading..."
          />
        </div>
        <AreaChart
          v-else
          :data="metricLog.received"
          index="x"
          :categories="['y']"
          :show-legend="false"
        />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Outgoing Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex h-96 justify-center items-center">
          <LoaderCircle
            class="w-12 h-12 animate-spin text-primary"
            aria-label="Loading..."
          />
        </div>
        <AreaChart
          v-else
          :data="metricLog.sent"
          index="x"
          :categories="['y']"
          :show-legend="false"
          :colors="chartColorList.sent"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
// Source: EMQX dashboard github
import { LoaderCircle } from "lucide-vue-next";

import { AreaChart } from "@/components/ui/chart-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ref, reactive, computed, watch } from "vue";
import Moment from "moment";
import useSyncPolling from "@/hooks/useSyncPolling";
import { loadChartData } from "@/api/monitor";

const POLLING_INTERVAL = 60000;

enum ChartType {
  Connections = "connections",
  Dropped = "dropped",
  Received = "received",
  ReceivedBytes = "received_bytes",
  Topics = "topics",
  Sent = "sent",
  SentBytes = "sent_bytes",
  Subscriptions = "subscriptions",
}
interface MetricData {
  x?: string;
  y: number;
}

const timeRange = ref(3600);
const timeRangeStr = computed({
  get() {
    return timeRange.value.toString();
  },
  set(value: string) {
    timeRange.value = parseInt(value);
  },
});

const isLoading = ref(false);

const _formatTime = (time: number, format = "MM/DD HH:mm:ss") => {
  return Moment(time).format(format);
};

const timeRangeOptions = [
  { label: "Last Hour", value: 3600 },
  { label: "Last 6 Hours", value: 21600 },
  { label: "Last 12 Hours", value: 43200 },
  { label: "Last Day", value: 86400 },
  { label: "Last 3 Days", value: 259200 },
  { label: "Last 7 Days", value: 604800 },
];

const chartDataFill = (length: number): Array<MetricData> =>
  Array.from({ length }).map(() => ({
    x: undefined,
    y: 0,
  }));

const messageDataTypeMap = reactive({
  [ChartType.Received]: "messageIn",
  [ChartType.Sent]: "messageOut",
});

const metricLog: Record<string, Array<MetricData>> = reactive({
  [ChartType.Received]: chartDataFill(32),
  [ChartType.Sent]: chartDataFill(32),
});

const dataTypeList: Array<ChartType> = reactive([
  ChartType.Sent,
  ChartType.Received,
]);

// const messageDataTypeFilter = computed(() => {
//   return Object.entries(messageDataTypeMap).map(([value, text]) => ({
//     text,
//     value,
//   }));
// });

const chartColorList = computed<Record<string, string[]>>(() => {
  const getLineColors = (index: number) => {
    const totalColors = [
      "#3D7FF9",
      "#5D4EFF",
      "#757789",
      "#00A890",
      "#F49845",
      "#66CFDA",
    ];
    // Swap the first and index positions
    const changedColorArr = [...totalColors.splice(0, 1, totalColors[index])];
    totalColors.splice(index, 1, changedColorArr[0]);
    return totalColors;
  };
  return {
    received: getLineColors(0),
    sent: getLineColors(1),
    dropped: getLineColors(2),
    connections: getLineColors(3),
    topics: getLineColors(4),
    subscriptions: getLineColors(5),
  };
});

const { syncPolling } = useSyncPolling();

const loadChartMetrics = async () => {
  try {
    isLoading.value = true;
    const { data } = await loadChartData(timeRange.value);
    dataTypeList.forEach((typeName) => {
      metricLog[typeName] = chartDataFill(1);
    });
    data.forEach((data: Record<string, any>) => {
      dataTypeList.forEach((typeName) => {
        const currentMetric = metricLog[typeName];
        currentMetric.push({
          x: Moment(data.time_stamp).format("MM/DD HH:mm:ss"),
          y: data[typeName],
        });
      });
    });
  } catch (error) {
    //
  } finally {
    isLoading.value = false;
  }
};
watch(timeRange, () => {
  loadChartMetrics();
});
syncPolling(loadChartMetrics, POLLING_INTERVAL);
</script>
