<template>
  <Dialog
    :open="showCreateDialog"
    @update:open="
      (value) => {
        showCreateDialog = value;
      }
    "
  >
    <DialogTrigger as-child>
      <Button variant="outline" size="sm" class="h-7 gap-1 rounded-md px-3">
        <Plus class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only">Create</span>
      </Button>
    </DialogTrigger>

    <DialogContent class="flex flex-col flex-1">
      <DialogHeader>
        <DialogTitle>Create new tag</DialogTitle>
        <DialogDescription>
          Create a new tag to categorize your devices.
        </DialogDescription>
      </DialogHeader>
      <Label for="tagName" class="text-left">Tag name</Label>
      <Input
        id="tagName"
        placeholder="e.g. Device type, Location,..."
        v-model="tagName"
        :disabled="isSubmitting"
      />
      <span class="text-sm text-red-500">{{ errorMessage }}</span>
      <DialogFooter class="flex flex-1 justify-end items-end gap-2">
        <Button variant="outline" @click="showCreateDialog = false">
          Cancel
        </Button>
        <Button :disabled="isSubmitting" @click="onSubmit">Create</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { createTag } from "@/api/tag";

const { toast } = useToast();
const isSubmitting = ref(false);

const showCreateDialog = defineModel("showDialog", {
  type: Boolean,
});
const emits = defineEmits<{
  (event: "submitted"): void;
}>();

const tagNameSchema = toTypedSchema(
  z
    .string()
    .min(2, "Tag name is too short, min 2 characters")
    .max(20, "Tag name is too long, max 20 characters")
);

const {
  value: tagName,
  errorMessage,
  validate,
} = useField<string>("tagName", tagNameSchema);

async function onSubmit() {
  isSubmitting.value = true;
  const res = await validate();
  if (!res.valid) {
    return;
  }

  try {
    const {} = await createTag(tagName.value);
    toast({
      title: "Tag created",
      description: `Tag "${tagName.value}" has been created successfully.`,
    });
    showCreateDialog.value = false;
    emits("submitted");
  } catch (error: any) {
    toast({
      title: error.response.data.message,
      variant: "destructive",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
