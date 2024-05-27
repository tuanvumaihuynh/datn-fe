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
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create new API Key</DialogTitle>
        <DialogDescription>
          Grant or revoke access to your application by creating and managing
          API keys.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-3">
          <Label for="name" class="text-left">
            Name
            <span class="text-red-500">*</span>
          </Label>
          <Input id="name" placeholder="e.g. Metric acess" v-model="name" />
          <span class="text-sm text-red-500">{{ errors.name }}</span>
        </div>
        <div class="grid gap-3">
          <Label for="scopes" lass="text-left">Scopes</Label>
          <Select id="scopes">
            <SelectTrigger>
              <SelectValue :placeholder="`${seletedScope.length} selected`" />
            </SelectTrigger>
            <SelectContent class="flex flex-col">
              <div v-for="item in scopes" class="flex flex-row gap-2 px-2 py-1">
                <Checkbox
                  :id="item.id"
                  :checked="item.selected"
                  @update:checked="item.selected = !item.selected"
                />
                <label
                  :for="item.id"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {{ item.name }}
                </label>
              </div>
            </SelectContent>
          </Select>
          <div>
            <Badge
              variant="outline"
              v-for="(scope, i) in seletedScope"
              :key="i"
              @click="scope.selected = !scope.selected"
              class="text-muted-foreground mr-1 mb-1 hover:text-red-600 hover:border-red-600 cursor-pointer"
              >{{ scope.name }}
            </Badge>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button @click="onSubmit" :disabled="isSubmitting">Create</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <ApiKeyResultDialog
    :showResultDialog="showResultDialog"
    :apiKey="resultDialogData"
  />
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiKeyResultDialog from "./ApiKeyResultDialog.vue";

import { ref, computed, watch } from "vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { useToast } from "@/components/ui/toast/use-toast";
import { createApiKey } from "@/api/apiKey";
import { Permission } from "@/types/role";
import { ApiKeyCreateResponse } from "@/types/apiKey";

const { toast } = useToast();

const validationSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, "API Key name is required")
      .max(30, "API Key name is too long"),
  })
);
const { handleSubmit, errors, resetField } = useForm({
  validationSchema,
});
const { value: name } = useField<string>("name");

interface Scope extends Permission {
  selected: boolean;
}

const showCreateDialog = defineModel("showCreateDialog", {
  type: Boolean,
});
const props = defineProps<{
  permissions: Permission[];
}>();
const emits = defineEmits<{
  (event: "submitted"): void;
}>();

const isSubmitting = ref<boolean>(false);
const scopes = ref<Scope[]>([]);
const showResultDialog = ref<boolean>(false);
const resultDialogData = ref<ApiKeyCreateResponse>();

const seletedScope = computed(() => {
  return scopes.value.filter((item) => item.selected);
});

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  const selectedScopeNames = seletedScope.value.map((item) => item.name);
  const payload = {
    name: values.name,
    enabled: true,
    scopes: selectedScopeNames,
  };
  try {
    const { data } = await createApiKey(payload);
    resultDialogData.value = {
      id: data.id,
      name: data.name,
      prefix: data.prefix,
      enabled: data.enabled,
      scopes: data.scopes,
      token: data.token,
      createdAt: data.created_at,
    };
    showResultDialog.value = true;
    toast({
      title: "API Key created",
      description: "API Key has been created successfully.",
    });
    emits("submitted");
    showCreateDialog.value = false;
    resetField("name");
    scopes.value.forEach((item) => (item.selected = false));
  } catch (error: any) {
    toast({
      title: error.response.data.message,
      variant: "destructive",
    });
  } finally {
    isSubmitting.value = false;
  }
});

function fetchScopes() {
  scopes.value = props.permissions.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      selected: false,
    };
  });
}

watch(() => props.permissions, fetchScopes, { immediate: true });
</script>
