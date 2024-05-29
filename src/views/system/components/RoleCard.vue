<template>
  <Card class="flex flex-col flex-1">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle class="mb-1">Roles</CardTitle>
        <CardDescription>Manage roles in organizations</CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" class="h-7 gap-1 rounded-md px-3">
          <Plus class="h-3.5 w-3.5" />
          <span class="sr-only sm:not-sr-only">Create</span>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea class="w-full whitespace-nowrap">
        <ScrollArea class="h-[64vh] w-full relative">
          <Table>
            <TableHeader class="sticky top-0 bg-background z-50">
              <TableRow>
                <TableHead class="w-[200px]">Role name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="isLoading">
                <TableRow class="relative">
                  <TableCell
                    :colSpan="5"
                    class="absolute inset-64 flex justify-center items-center"
                  >
                    <LoaderCircle
                      class="w-12 h-12 animate-spin text-primary"
                      aria-label="Loading..."
                    />
                  </TableCell>
                </TableRow>
              </template>
              <template v-else-if="roles.length && !isLoading">
                <TableRow v-for="role in roles" :key="role.id">
                  <TableCell> {{ role.name }}</TableCell>
                  <TableCell class="flex flex-col">
                    <span
                      v-for="(scope, i) in role.permissions.slice().sort()"
                      :key="i"
                      class="text-muted-foreground"
                    >
                      {{ scope }}
                    </span>
                  </TableCell>

                  <TableCell>
                    {{ role.created_at.replace("T", " ") }}</TableCell
                  >
                  <TableCell> ...</TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell :colSpan="4" class="h-24 text-center">
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
import { Plus, LoaderCircle } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
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

import { getRoles } from "@/api/role";

interface User {
  id: string;
  name: string;
  permissions: string[];
  created_at: string;
}

const roles = ref<User[]>([]);
const isLoading = ref(true);

async function fetchRoles() {
  isLoading.value = true;
  try {
    const { data } = await getRoles();
    roles.value = data.items;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchRoles();
});
</script>
