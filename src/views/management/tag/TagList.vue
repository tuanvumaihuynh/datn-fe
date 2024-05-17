<template>
  <Card class="flex flex-col flex-1">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle class="mb-1">Tags</CardTitle>
        <CardDescription>Manage your tags</CardDescription>
      </div>
      <TagCreateDialog
        v-model:showDialog="showCreateDialog"
        @submitted="
          () => {
            fetchTags();
          }
        "
      />
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
              <template v-if="isLoading">
                <TableRow class="relative">
                  <TableCell
                    colSpan="4"
                    class="absolute inset-64 flex justify-center items-center"
                  >
                    <LoaderCircle
                      class="w-12 h-12 animate-spin text-primary"
                      aria-label="Loading..."
                    />
                  </TableCell>
                </TableRow>
              </template>
              <template v-else-if="tagList.length">
                <TableRow v-for="(item, i) in tagList" :key="i">
                  <TableCell>{{ item.id }}</TableCell>
                  <TableCell>
                    {{ item.name }}
                  </TableCell>
                  <TableCell>
                    {{ item.createdAt }}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" class="w-8 h-8 p-0">
                          <span class="sr-only">Open menu</span>
                          <MoreHorizontal class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem @click="onDelete(item.id)">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
import { LoaderCircle, MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import TagCreateDialog from "./componnents/TagCreateDialog.vue";

import { ref, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useDateFormat } from "@vueuse/core";
import { getTags, deleteTag } from "@/api/tag";
import { Tag } from "@/types/tag";

const { toast } = useToast();

const isLoading = ref(false);
const showCreateDialog = ref(false);
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

async function onDelete(id: string) {
  try {
    await deleteTag(id);
    await fetchTags();
    toast({
      title: "Tag deleted",
      description: "Tag has been deleted successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete tag",
    });
  }
}
onMounted(async () => {
  isLoading.value = true;
  await fetchTags();
  isLoading.value = false;
});
</script>
