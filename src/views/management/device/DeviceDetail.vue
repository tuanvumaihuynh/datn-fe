<template>
  <Card
    v-if="device === undefined"
    class="flex flex-col flex-1 items-center justify-center"
  >
    <LoaderCircle
      class="w-12 h-12 animate-spin text-primary"
      aria-label="Loading..."
    />
  </Card>
  <Card v-else class="flex flex-col flex-1">
    <Tabs v-model="tabValue" class="flex flex-col flex-1">
      <CardHeader class="bg-muted/50 pb-1">
        <div class="flex flex-col gap-3">
          <div class="flex flex-row items-start">
            <div class="flex gap-6 items-center">
              <Package
                class="h-24 w-24 px-4 border-2 rounded-lg border-dashed ro text-primary"
              >
              </Package>
              <div class="grid gap-0.5">
                <CardTitle class="group flex items-center gap-2 text-lg">
                  {{ device?.name }}
                  <Badge
                    class="cursor-default"
                    :variant="device?.connected ? 'default' : 'destructive'"
                  >
                    {{ device?.connected ? "Connected" : "Disconnected" }}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <div>
                    Created at:
                    {{
                      useDateFormat(device?.createdAt, "HH:mm A MMM DD, YYYY")
                        .value
                    }}
                  </div>
                </CardDescription>
                <DeviceTagContainer v-model:device="device" />
              </div>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button size="icon" variant="outline" class="h-8 w-8">
                    <MoreVertical class="h-3.5 w-3.5" />
                    <span class="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    @click="copyToClipboard(device?.id ?? 'N/A')"
                  >
                    Copy device Id
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Disable</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Reboot</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsList class="bg-transparent self-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="metric">Latest metric</TabsTrigger>
            <TabsTrigger v-if="device.type !== 'SubDevice'" value="credentials"
              >Credentials</TabsTrigger
            >
            <TabsTrigger value="relation">Relation</TabsTrigger>
          </TabsList>
        </div>
      </CardHeader>

      <CardContent class="pt-2 w-full flex flex-1">
        <TabsContent
          value="details"
          :class="tabValue === 'details' ? tabClass : 'hidden'"
        >
          <DeviceDetailsTab v-if="device" :device="device" />
        </TabsContent>
        <TabsContent
          value="attributes"
          :class="tabValue === 'attributes' ? tabClass : 'hidden'"
        >
          <DeviceAttributesTab />
        </TabsContent>
        <TabsContent
          value="metric"
          :class="tabValue === 'metric' ? tabClass : 'hidden'"
        >
          <DeviceMetricTab />
        </TabsContent>
        <TabsContent
          v-if="device.type !== 'SubDevice'"
          value="credentials"
          :class="tabValue === 'credentials' ? tabClass : 'hidden'"
        >
          <DeviceCredentialsTab :credentials="device.credentials!" />
        </TabsContent>
        <TabsContent
          value="relation"
          :class="tabValue === 'relation' ? tabClass : 'hidden'"
        >
          <DeviceRelationTab />
        </TabsContent>
      </CardContent>
    </Tabs>
  </Card>
</template>

<script setup lang="ts">
import { Package, MoreVertical, LoaderCircle } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import DeviceTagContainer from "./components/DeviceTagContainer.vue";
import DeviceDetailsTab from "./components/DeviceDetailsTab.vue";
import DeviceAttributesTab from "./components/DeviceAttributesTab.vue";
import DeviceMetricTab from "./components/DeviceMetricTab.vue";
import DeviceCredentialsTab from "./components/DeviceCredentialsTab.vue";
import DeviceRelationTab from "./components/DeviceRelationTab.vue";

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDateFormat } from "@vueuse/core";
import useClipboard from "@/hooks/useClipboard";
import useSyncPolling from "@/hooks/useSyncPolling";
import useDeviceType from "@/hooks/useDeviceType";
import { getDevice, isDeviceConnected } from "@/api/device";
import { Device } from "@/types/device";

const DEVICE_STATE_POLLING_INTERVAL = 2000;

type TabValue =
  | "details"
  | "attributes"
  | "metric"
  | "credentials"
  | "relation";
const tabClass = "flex flex-1 flex-col";

const tabValue = ref<TabValue>("details");

const route = useRoute();
const { syncPolling } = useSyncPolling();
const { copyToClipboard } = useClipboard();
const { getDeviceType } = useDeviceType();

const device = ref<Device>();
const deviceId = computed(() => route.params.id as string);

async function fetchDevice() {
  try {
    const { data } = await getDevice(deviceId.value);
    device.value = {
      id: data.id,
      name: data.name,
      description: data.description,
      type: getDeviceType(data),
      credentials: data.credentials
        ? {
            clientId: data.credentials.client_id,
            username: data.credentials.username,
            password: data.credentials.password,
          }
        : undefined,
      connected: data.connected,
      tags: data.tags,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error(error);
  }
}

async function getDeviceState() {
  try {
    const { data } = await isDeviceConnected(deviceId.value);
    if (device.value) {
      device.value.connected = data;
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await fetchDevice();
  if (device.value) {
    syncPolling(getDeviceState, DEVICE_STATE_POLLING_INTERVAL);
  }
});
</script>
