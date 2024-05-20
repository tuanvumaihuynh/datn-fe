<template>
  <Card class="flex flex-col flex-1">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Total devices: {{ totalCount }}</CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <TagFilterPopover v-model:tags="tagList" />
        <DialogCreateForm
          :show-create-dialog="showCreateDialog"
          @submitted="
            () => {
              fetchDevices({
                currentPage: page,
                currentPageSize: pageSize,
              });
            }
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
      <ScrollArea class="w-full whitespace-nowrap">
        <ScrollArea class="h-[64vh] w-full relative">
          <DeviceTable
            :is-loading="tableLoading"
            :is-error="tableError"
            :columns="columns"
            :data="devices"
            v-model:page-size="pageSize"
          />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
    <CardFooter class="flex flex-1 items-end justify-end mr-4">
      <div class="flex space-x-6">
        <div class="text-sm text-muted-foreground flex items-center gap-1">
          <span class="sr-only sm:not-sr-only">Items per page:</span>
          <Select
            :model-value="pageSizeString"
            @update:model-value="pageSizeString = $event"
          >
            <SelectTrigger class="w-[70px]">
              <SelectValue :placeholder="pageSizeString" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="(item, i) in ITEM_PER_PAGES"
                  :key="i"
                  :value="item.toString()"
                  >{{ item }}</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div
          class="flex w-[100px] items-center justify-center text-sm font-medium"
        >
          Page {{ page }} of
          {{ pageCount }}
        </div>
        <Pagination :total="totalCount">
          <PaginationList class="flex items-center gap-1">
            <PaginationFirst :disabled="isFirstPage" @click="currentPage = 1" />
            <PaginationPrev :disabled="isFirstPage" @click="prev" />
            <PaginationNext :disabled="isLastPage" @click="next" />
            <PaginationLast
              :disabled="isLastPage"
              @click="currentPage = currentPageSize"
            />
          </PaginationList>
        </Pagination>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { RefreshCcw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import DialogCreateForm from "./components/DeviceCreateForm/index.vue";
import TagFilterPopover from "./components/TagFilterPopover.vue";
import DeviceTable from "./components/DeviceTable/index.vue";
import { columns } from "./components/DeviceTable/column";

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOffsetPagination } from "@vueuse/core";
import useDeviceType from "@/hooks/useDeviceType";

import { getDevices } from "@/api/device";
import { Device } from "@/types/device";
import { getTags } from "@/api/tag";

interface TagWithSelected {
  name: string;
  selected: boolean;
}

const ITEM_PER_PAGES = [30, 50, 100];

const router = useRouter();
const route = useRoute();

const { getDeviceType } = useDeviceType();

const showCreateDialog = ref<boolean>(false);

const tableLoading = ref<boolean>(false);
const tableError = ref<boolean>(false);
const devices = ref<Device[]>([]);
const totalCount = ref<number>(0);
const tagList = ref<TagWithSelected[]>([]);

const selectedTagNames = computed(() => {
  return tagList.value.filter((tag) => tag.selected).map((tag) => tag.name);
});

const page = computed({
  get() {
    return route.query.page ? parseInt(route.query.page as string) : 1;
  },
  set(value) {
    router.replace({ query: { ...route.query, page: value } });
  },
});
const pageSize = computed({
  get() {
    const pageSize = route.query.pageSize;
    return pageSize && ITEM_PER_PAGES.toString().includes(pageSize as string)
      ? parseInt(route.query.pageSize as string)
      : 30;
  },
  set(value) {
    router.replace({ query: { ...route.query, pageSize: value } });
  },
});
const pageSizeString = computed({
  get: () => pageSize.value.toString(),
  set: (value) => {
    pageSize.value = parseInt(value);
  },
});

async function fetchDevices({
  currentPage,
  currentPageSize,
  tags,
}: {
  currentPage: number;
  currentPageSize: number;
  tags?: string[];
}) {
  tableLoading.value = true;
  tableError.value = false;
  try {
    const params: any = {
      page: currentPage,
      pageSize: currentPageSize,
    };
    if (tags && tags.length > 0) {
      params.tags = tags;
    }
    const { data } = await getDevices(params);
    totalCount.value = data.total_count;
    devices.value = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: getDeviceType(item),
      connected: item.connected,
      tags: item.tags,
      createdAt: item.created_at,
    }));
  } catch (error) {
    tableError.value = true;
  } finally {
    tableLoading.value = false;
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
        name: item.name,
        selected: false,
      };
    });
  } catch (error) {}
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
  pageCount,
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
});

onMounted(async () => {
  await Promise.all([
    fetchDevices({
      currentPage: page.value,
      currentPageSize: pageSize.value,
    }),
    fetchTags(),
  ]);
});
onBeforeUnmount(() => {
  router.replace({ query: {} });
});

watch(
  selectedTagNames,
  async (newVal, oldVal) => {
    // Avoid fetching devices on first open tag filter popover
    if (oldVal.length == newVal.length) {
      return;
    }
    await fetchDevices({
      currentPage: page.value,
      currentPageSize: pageSize.value,
      tags: newVal,
    });
  },
  { deep: true }
);
</script>
