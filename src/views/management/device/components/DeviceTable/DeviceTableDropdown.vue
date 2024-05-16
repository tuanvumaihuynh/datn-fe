<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copyToClipboard(device.id)">
        Copy device ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="$router.push(`/devices/${device.id}`)">
        View detail
      </DropdownMenuItem>
      <DropdownMenuItem @click="onDelete">Delete</DropdownMenuItem>
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/toast/use-toast";
import useClipboard from "@/hooks/useClipboard";

const { toast } = useToast();
const { copyToClipboard } = useClipboard();

defineProps<{
  device: {
    id: string;
  };
}>();

function onDelete() {
  toast({
    title: "Admin permission required",
    description: "You need permission to delete device",
  });
}
</script>
