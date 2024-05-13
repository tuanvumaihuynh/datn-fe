<template>
  <Dialog
    :open="showDialog"
    @update:open="
      (value) => {
        showDialog = value;
      }
    "
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Check device connectivity</DialogTitle>
        <!-- <DialogDescription>
          <div class="flex gap-2 items-center">
            Check the connectivity of the device
          </div>
        </DialogDescription> -->
      </DialogHeader>
      <div class="flex items-center space-x-2">Content</div>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

defineProps<{
  deviceId: string;
}>();

const showDialog = defineModel("showDialog", {
  type: Boolean,
});
</script>
