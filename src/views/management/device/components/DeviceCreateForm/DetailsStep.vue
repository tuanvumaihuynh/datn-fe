<template>
  <div class="grid gap-4">
    <div class="grid gap-3">
      <Label for="name" class="text-left">Name</Label>
      <Input id="name" placeholder="e.g. Demo device" v-model="name" />
      <span class="text-sm text-red-500">{{ nameFieldError }}</span>
    </div>
    <div class="grid gap-3">
      <Label for="deviceType" class="text-left">Type</Label>
      <Select
        id="deviceType"
        :model-value="deviceType"
        @update:model-value="
          (value:any) => {
            if (value !== 'gateway' && value !== 'normal') {
              return;
            }
            deviceType = value;
          }
        "
      >
        <SelectTrigger>
          <SelectValue :placeholder="deviceType" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="gateway">TBE Gateway</SelectItem>
            <SelectItem value="normal">Other device</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <span class="text-sm text-red-500">{{ null }}</span>
    </div>
    <div class="grid gap-3">
      <Label for="description" class="text-left">Description</Label>
      <Textarea
        id="description"
        placeholder="e.g. Something about device"
        v-model="description"
        class="h-32 max-h-32"
      />
      <span class="text-sm text-red-500">{{ descriptionFieldError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { computed } from "vue";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const props = defineProps<{
  name: string;
  description?: string;
  isGateway: boolean;
}>();

const nameSchema = toTypedSchema(
  z
    .string()
    .min(1, "Device name is required")
    .max(30, "Device name is too long")
);
const descriptionSchema = toTypedSchema(
  z.string().max(255, "Description is too long").optional()
);
const isGatewaySchema = toTypedSchema(z.boolean().default(false));

const {
  value: name,
  errorMessage: nameFieldError,
  validate: nameValidate,
} = useField<string>("name", nameSchema, {
  syncVModel: "name",
});

const {
  value: description,
  errorMessage: descriptionFieldError,
  validate: descriptionValidate,
} = useField<string | undefined>("description", descriptionSchema, {
  syncVModel: "description",
});

const { value: isGateway, validate: isGatewayValidate } = useField<
  boolean | undefined
>("isGateway", isGatewaySchema, {
  syncVModel: "isGateway",
});

const deviceType = computed({
  get: () => (isGateway.value ? "gateway" : "normal"),
  set: (value: string) => {
    isGateway.value = value === "gateway";
  },
});

async function validate() {
  const { valid: nameValid } = await nameValidate();
  const { valid: descriptionValid } = await descriptionValidate();
  const { valid: isGatewayValid } = await isGatewayValidate();
  return nameValid && descriptionValid && isGatewayValid;
}

defineExpose({
  validate,
});
</script>
