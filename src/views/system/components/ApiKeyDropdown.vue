<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="emits('edit', apiKey)">Edit</DropdownMenuItem>
      <DropdownMenuItem @click="emits('delete', apiKey)"
        >Delete</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ApiKey } from "@/types/apiKey";

defineProps<{
  apiKey: ApiKey;
}>();

const emits = defineEmits<{
  (event: "edit", apiKey: ApiKey): void;
  (event: "delete", apiKey: ApiKey): void;
}>();
</script>
