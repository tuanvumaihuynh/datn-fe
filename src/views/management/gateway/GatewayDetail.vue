<template>
  <Skeleton v-if="isLoading" />
  <template v-if="!isLoading">
    <div class="grid gap-4 xl:grid-cols-4 md:gap-8 grid-cols-2">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">Connected Devices</CardTitle>
          <Package class="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ gatewayDevices.length }}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">IP Address</CardTitle>
          <Podcast class="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ gateway?.ipAddress ?? "N/A" }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">RAM Usage</CardTitle>
          <MemoryStick class="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ latestRamUsage }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu class="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            {{ latestCpuUsage }}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="overflow-hidden">
      <CardHeader class="bg-muted/50">
        <div class="flex flex-row items-start">
          <div class="flex gap-6 items-center">
            <Router
              class="h-24 w-24 px-4 border-2 rounded-lg border-dashed ro text-primary"
            ></Router>
            <div class="grid gap-0.5">
              <CardTitle class="group flex items-center gap-2 text-lg">
                {{ gateway?.name }}
                <Badge
                  class="cursor-default"
                  :variant="gateway?.connected ? 'default' : 'destructive'"
                >
                  {{ gateway?.connected ? "Connected" : "Disconnected" }}
                </Badge>
              </CardTitle>
              <CardDescription>
                <div>
                  Created at:
                  {{
                    useDateFormat(gateway?.createdAt, "HH:mm A MMM DD, YYYY")
                      .value
                  }}
                </div>
              </CardDescription>
              <div class="pt-2 flex flex-row gap-1">
                <Badge
                  v-for="item in gateway?.tags"
                  variant="outline"
                  class="cursor-default"
                  >{{ item }}
                </Badge>
                <Sheet>
                  <SheetTrigger as-child>
                    <Button
                      size="icon"
                      variant="outline"
                      class="h-6 w-6"
                      @click="onConfigureTagClick"
                    >
                      <Plus class="h-3 w-3" />
                      <span class="sr-only">Add tag</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent class="">
                    <SheetTitle>Configure tags</SheetTitle>
                    <SheetDescription>
                      Make changes to your tag here. Click save when you're
                      done.
                    </SheetDescription>
                    <div class="py-3 flex flex-wrap gap-2">
                      <Badge
                        v-for="(item, i) in tagList"
                        :key="i"
                        variant="outline"
                        class="h-8 flex gap-2 cursor-default hover:cursor-pointer"
                        :class="{ 'bg-primary text-white': item.selected }"
                        @click="item.selected = !item.selected"
                      >
                        {{ item.name }}
                      </Badge>
                    </div>
                    <SheetFooter>
                      <SheetTrigger as-child>
                        <Button @click="onUpdateTagsSubmit">
                          Save changes
                        </Button>
                      </SheetTrigger>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          <div class="ml-auto flex items-center gap-1">
            <GatewayModeSwitch
              v-if="gateway"
              :device-id="gateway?.id"
              :initial-gateway-mode="true"
            />
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="icon" variant="outline" class="h-8 w-8">
                  <MoreVertical class="h-3.5 w-3.5" />
                  <span class="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="copyToClipboard(gateway!.id)">
                  Copy gateway Id
                </DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Reboot</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent class="pt-2">
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium">Name</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ gateway?.name }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium">Connected node</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ gateway?.node ?? "N/A" }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium">Location</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ location }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium">Connected/Disconnected at</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{
                  (gateway?.connected
                    ? gateway?.connectedAt
                    : gateway?.disconnectedAt) ?? "N/A"
                }}
              </p>
            </div>
          </div>
          <div>
            <span class="text-sm font-medium">Description</span>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ gateway?.description }}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle class="text-lg font-medium">Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <LogTable :logs="logMetrics" />
      </CardContent>
    </Card>
  </template>
</template>

<script setup lang="ts">
import {
  Package,
  Podcast,
  MoreVertical,
  MemoryStick,
  Router,
  Plus,
  Cpu,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogTable from "./components/LogTable.vue";
import Skeleton from "./components/Skeleton.vue";
import GatewayModeSwitch from "@/components/GatewayModeSwitch.vue";

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import useSyncPolling from "@/hooks/useSyncPolling";
import useClipboard from "@/hooks/useClipboard";
import { getTags } from "@/api/tag";
import { update_tags } from "@/api/device";
import { getGateway, getGatewayDevices } from "@/api/gateway";
import {
  getDeviceAttributes,
  getLatestDeviceMetrics,
  getDeviceMetrics,
} from "@/api/telemetry";
import { Gateway } from "@/types/gateway";
import { Device } from "@/types/device";
import { Metric, Log } from "@/types/telemetry";
import { TagWithSelected } from "@/types/tag";

const LATEST_METRIC_POLLING_INTERVAL = 5000;
const GATEWAY_INFO_POLLING_INTERVAL = 5000;
const LOG_KEY = "log";
const LOCATION_KEY = "location";
const LOG_POLLING_INTERVAL = 2000;
const RAM_USAGE_PERCENT_KEY = "ram_usage_percent";
const CPU_USAGE_PERCENT_KEY = "cpu_usage_percent";

const route = useRoute();
const { syncPolling } = useSyncPolling();
const { copyToClipboard } = useClipboard();

const isLoading = ref(false);
const gateway = ref<Gateway | null>(null);
const gatewayDevices = ref<Device[]>([]);
const location = ref<string>("N/A");
const latestMetrics = ref<Metric[]>([]);
const logMetrics = ref<Log[]>([]);
const tagList = ref<TagWithSelected[]>([]);

const latestRamUsage = computed(() => {
  const metric = latestMetrics.value.find(
    (metric) => metric.key === RAM_USAGE_PERCENT_KEY
  );
  return metric ? `${metric.value.toFixed(2)}%` : "N/A";
});
const latestCpuUsage = computed(() => {
  const metric = latestMetrics.value.find(
    (metric) => metric.key === CPU_USAGE_PERCENT_KEY
  );
  return metric ? `${metric.value.toFixed(2)}%` : "N/A";
});
const seletedTagNames = computed(() =>
  tagList.value.filter((tag) => tag.selected).map((tag) => tag.name)
);
const gatewayId = computed(() => route.params.id as string);

async function fetchGateway() {
  try {
    const { data } = await getGateway(gatewayId.value);
    gateway.value = {
      id: data.id,
      name: data.name,
      description: data.description,
      tags: data.tags,
      credentials: {
        clientId: data.credentials.client_id,
        username: data.credentials.username,
        password: data.credentials.password,
      },
      createdAt: data.created_at,
      ipAddress: data.ip_address,
      port: data.port,
      node: data.node,
      connected: data.connected,
      connectedAt: data.conn_connected_at,
      disconnectedAt: data.conn_disconnected_at,
    };
  } catch (error) {
    console.error(error);
  }
}

async function fetchDevices() {
  try {
    const { data } = await getGatewayDevices({
      gatewayId: gatewayId.value,
      page: 1,
      pageSize: 100,
    });
    gatewayDevices.value = data.items.map((device: any) => ({
      id: device.id,
      name: device.name,
      description: device.description,
      tags: device.tags,
      createdAt: device.created_at,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function fetchLocation() {
  try {
    const { data } = await getDeviceAttributes({
      deviceId: gatewayId.value,
      keys: [LOCATION_KEY],
    });
    location.value = data[0].value;
  } catch (error) {
    console.error(error);
  }
}

async function fetchLatestMetric() {
  try {
    const { data } = await getLatestDeviceMetrics(gatewayId.value);
    latestMetrics.value = data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchLogs() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  try {
    const { data } = await getDeviceMetrics({
      deviceId: gatewayId.value,
      key: LOG_KEY,
      limit: 50,
      start: oneHourAgo,
      end: now,
    });
    logMetrics.value = data.map((item: any) => ({
      timestamp: item.ts,
      level: item.value.level,
      message: item.value.message,
    }));
  } catch (error) {
    console.error(error);
  }
}

async function fetchTags() {
  try {
    const { data } = await getTags({
      page: 1,
      pageSize: 100,
    });
    tagList.value = data.items.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        selected: gateway.value?.tags.includes(item.name),
        createdAt: useDateFormat(item.created_at, "HH:mm A MMM DD, YYYY").value,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function onUpdateTagsSubmit() {
  const tagNames = seletedTagNames.value;
  try {
    await update_tags(gatewayId.value, tagNames);
    gateway.value!.tags = tagNames;
  } catch (error) {
    console.error(error);
  }
}

async function onConfigureTagClick() {
  await fetchTags();
}

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    fetchGateway(),
    fetchLocation(),
    fetchDevices(),
    fetchLatestMetric(),
    fetchLogs(),
  ]);
  isLoading.value = false;
});
syncPolling(fetchLatestMetric, LATEST_METRIC_POLLING_INTERVAL);
syncPolling(fetchGateway, GATEWAY_INFO_POLLING_INTERVAL);
syncPolling(fetchLogs, LOG_POLLING_INTERVAL);
</script>
