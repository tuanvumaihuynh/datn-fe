<template>
  <Table>
    <TableHeader class="sticky top-0 bg-background z-50">
      <TableRow
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <TableHead
          v-for="(header, i) in headerGroup.headers"
          :key="header.id"
          :class="{
            'w-[20vw]': i === 0,
            'w-[10vw]': i === 1 || i === 2,
            'w-[25vw]': i === 3,
          }"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <template v-if="isLoading">
        <TableRow class="relative">
          <TableCell
            :colSpan="columns.length"
            class="absolute inset-64 flex justify-center items-center"
          >
            <LoaderCircle
              class="w-12 h-12 animate-spin text-primary"
              aria-label="Loading..."
            />
          </TableCell>
        </TableRow>
      </template>
      <template v-else-if="table.getRowModel().rows?.length && !isError">
        <TableRow
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          :data-state="row.getIsSelected() ? 'selected' : undefined"
        >
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </TableCell>
        </TableRow>
      </template>
      <template v-else>
        <TableRow>
          <TableCell :colSpan="columns.length" class="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>

<script setup lang="ts" generic="TData, TValue">
import { LoaderCircle } from "lucide-vue-next";
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  getSortedRowModel,
} from "@tanstack/vue-table";
import { valueUpdater } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ref, watch } from "vue";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  isError: boolean;
}>();
const pageSize = defineModel("pageSize", {
  type: Number,
  required: true,
});

const sorting = ref<SortingState>([]);

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  state: {
    get sorting() {
      return sorting.value;
    },
  },
  initialState: {
    pagination: {
      pageSize: pageSize.value,
    },
  },
});

watch(pageSize, (newPageSize) => {
  table.setPageSize(newPageSize);
});
</script>
