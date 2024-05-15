<template>
  <Card class="flex flex-col flex-1">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle class="mb-1">Tags</CardTitle>
        <CardDescription>Manage your tags</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea class="w-full whitespace-nowrap">
        <ScrollArea class="h-[64vh] w-full relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[300px]">Id</TableHead>
                <TableHead>Tag name</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="tagList.length">
                <TableRow v-for="(item, i) in tagList" :key="i">
                  <TableCell>{{ item.id }}</TableCell>
                  <TableCell>
                    {{ item.name }}
                  </TableCell>
                  <TableCell>
                    {{ item.createdAt }}
                  </TableCell>

                  <!-- <TableCell>
                <ApiKeyDropdown
                  :api-key="item"
                  @delete="onDelete"
                  @edit="console.log"
                />
              </TableCell> -->
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell :colSpan="5" class="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ref, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { getTags } from "@/api/tag";
import { Tag } from "@/types/tag";

const tagList = ref<Tag[]>([]);

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
        createdAt: useDateFormat(item.created_at, "YYYY-MM-DD HH:mm:ss").value,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await fetchTags();
});
</script>
