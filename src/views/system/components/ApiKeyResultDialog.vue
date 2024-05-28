<template>
  <Dialog
    :open="showResultDialog"
    @update:open="
      (value) => {
        showResultDialog = value;
      }
    "
  >
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Created successfully</DialogTitle>
        <DialogDescription>
          <div class="flex gap-2 items-center">
            Save API Key to a safe place, API Key will not be shown again
          </div>
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Label for="apiKey" class="sr-only"> Link </Label>
          <Input id="apiKey" read-only :model-value="apiKey?.token" disabled>
          </Input>
        </div>
        <Button
          type="submit"
          size="sm"
          class="px-3"
          @click="copyToClipboard(apiKey?.token ?? '')"
        >
          <span class="sr-only">Copy</span>
          <CopyIcon class="w-4 h-4" />
        </Button>
      </div>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { CopyIcon } from "@radix-icons/vue";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useClipboard from "@/hooks/useClipboard";
import { ApiKeyCreateResponse } from "@/types/apiKey";

const { copyToClipboard } = useClipboard();

defineProps<{
  apiKey?: ApiKeyCreateResponse;
}>();

const showResultDialog = defineModel("showResultDialog", {
  type: Boolean,
});
</script>
