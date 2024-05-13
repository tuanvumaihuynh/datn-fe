<template>
  <Card class="flex flex-col">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Total devices: {{ totalCount }}</CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <DialogCreateForm
          :show-create-dialog="showCreateDialog"
          @submitted="
            fetchDevices({
              currentPage: page,
              currentPageSize: pageSize,
            })
          "
        />
        <Button
          variant="outline"
          size="sm"
          class="h-7 gap-1 rounded-md px-3"
          @click="onRefresh"
        >
          <RefreshCcw class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only">Refresh</span>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <DeviceTable
        :is-loading="tableLoading"
        :columns="columns"
        :data="devices"
        class="w-full overflow-x-auto h-[calc(100vh-300px)]"
      />
    </CardContent>
    <CardFooter class="flex flex-1 items-end gap-4 justify-end space-x-2 mr-4">
      <div class="text-sm text-muted-foreground flex items-center gap-1">
        Items per page:
        <Select
          :model-value="pageSizeString"
          @update:model-value="pageSizeString = $event"
        >
          <SelectTrigger class="w-[70px]">
            <SelectValue :placeholder="pageSizeString" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Pagination
        v-slot="{ page }"
        :total="totalCount"
        :sibling-count="1"
        :default-page="1"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst :disabled="isFirstPage" @click="currentPage = 1" />
          <PaginationPrev :disabled="isFirstPage" @click="prev" />
          <!-- <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-9 h-9 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="
                  () => {
                    if (item.value !== currentPage) currentPage = item.value;
                  }
                "
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template> -->

          <PaginationNext :disabled="isLastPage" @click="next" />
          <PaginationLast
            :disabled="isLastPage"
            @click="currentPage = currentPageSize"
          />
        </PaginationList>
      </Pagination>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { RefreshCcw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import DialogCreateForm from "./components/DeviceCreateForm/index.vue";

import { ref, computed, onMounted } from "vue";
import { useOffsetPagination } from "@vueuse/core";

import { getDevices } from "@/api/device";
import { Device } from "@/types/device";
import DeviceTable from "./components/DeviceTable/index.vue";
import { columns } from "./components/DeviceTable/column";

const showCreateDialog = ref<boolean>(false);

const tableLoading = ref<boolean>(false);
const devices = ref<Device[]>([]);
const totalCount = ref<number>(0);
const page = ref<number>(1);
const pageSize = ref<number>(10);
const pageSizeString = computed({
  get: () => pageSize.value.toString(),
  set: (value) => {
    pageSize.value = parseInt(value);
  },
});

async function fetchDevices({
  currentPage,
  currentPageSize,
}: {
  currentPage: number;
  currentPageSize: number;
}) {
  tableLoading.value = true;
  try {
    const { data } = await getDevices({
      page: currentPage,
      pageSize: currentPageSize,
    });
    totalCount.value = data.total_count;
    devices.value = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isGateway: item.is_gateway,
      tags: item.tags,
      createdAt: item.created_at,
    }));
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
}

function onRefresh() {
  fetchDevices({
    currentPage: page.value,
    currentPageSize: pageSize.value,
  });
}

const {
  currentPage,
  currentPageSize,
  // pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = useOffsetPagination({
  total: totalCount,
  page: page,
  pageSize: pageSize,
  onPageChange: fetchDevices,
  onPageSizeChange: fetchDevices,
  onPageCountChange: fetchDevices,
});

onMounted(async () => {
  await fetchDevices({
    currentPage: page.value,
    currentPageSize: pageSize.value,
  });
});
</script>
