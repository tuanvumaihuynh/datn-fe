<template>
  <Card class="flex flex-col flex-1">
    <CardHeader class="flex flex-row justify-between px-7">
      <div>
        <CardTitle class="mb-1">API Keys</CardTitle>
        <CardDescription>Manage your API keys</CardDescription>
      </div>
      <div class="flex items-center gap-2">
        <ApiKeyCreateDialog
          :permissions="permissions"
          :show-create-dialog="showCreateDialog"
          @submitted="fetchApiKeys"
        />
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea class="w-full whitespace-nowrap">
        <ScrollArea class="h-[64vh] w-full relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="apiKeys.length">
                <TableRow v-for="(item, i) in apiKeys" :key="i">
                  <TableCell>{{ item.name }}</TableCell>
                  <TableCell>
                    <Badge variant="outline" class="text-muted-foreground">{{
                      item.prefix
                    }}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      :id="item.id"
                      :checked="item.enabled"
                      @update:checked="toggleEnabled(item, $event)"
                    />
                  </TableCell>
                  <TableCell>********************</TableCell>
                  <TableCell class="flex flex-col">
                    <span
                      v-for="(scope, i) in item.scopes.slice().sort()"
                      :key="i"
                      class="text-muted-foreground"
                    >
                      {{ scope }}</span
                    >
                  </TableCell>
                  <TableCell>
                    <ApiKeyDropdown
                      :api-key="item"
                      @delete="onDelete"
                      @edit="console.log"
                    />
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import ApiKeyDropdown from "./components/ApiKeyDropdown.vue";
import ApiKeyCreateDialog from "./components/ApiKeyCreateForm.vue";

import { ref, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { getApiKeys, updateApiKey, deleteApiKey } from "@/api/apiKey";
import { getPermissions } from "@/api/role";
import { ApiKey } from "@/types/apiKey";
import { Permission } from "@/types/role";

const { toast } = useToast();

const showCreateDialog = ref<boolean>(false);

const apiKeys = ref<ApiKey[]>([]);
const permissions = ref<Permission[]>([]);

async function fetchApiKeys() {
  try {
    const { data } = await getApiKeys();
    apiKeys.value = data.items.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        prefix: item.prefix,
        enabled: item.enabled,
        scopes: item.scopes,
        createdAt: item.created_at,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchPermissions() {
  try {
    const { data } = await getPermissions();
    permissions.value = data.items.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        createdAt: item.created_at,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

async function toggleEnabled(apiKey: ApiKey, enabled: boolean) {
  apiKey.enabled = enabled;
  try {
    await updateApiKey({
      ...apiKey,
    });
    toast({
      title: `${enabled ? "Enabled" : "Disabled"} successfully`,
    });
  } catch (error) {
    console.error(error);
    apiKey.enabled = !apiKey.enabled;

    toast({
      title: `${enabled ? "Enable" : "Disable"} failed`,
      variant: "destructive",
    });
  }
}

// async function onUpdate(apiKey: ApiKey) {
//   try {
//     await updateApiKey({
//      ...apiKey,
//     });
//     await fetchApiKeys();
//   } catch (error) {
//     console.error(error);
//   }
// }
async function onDelete({ id }: ApiKey) {
  try {
    await deleteApiKey(id);
    await fetchApiKeys();
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await fetchApiKeys();
  await fetchPermissions();
});
</script>
