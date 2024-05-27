<template>
  <Dialog
    :open="showEditDialog"
    @update:open="
      (value) => {
        showEditDialog = value;
      }
    "
  >
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit value</DialogTitle>
        <DialogDescription>
          Update the value for this key-value pair.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="key" class="text-right">Key</Label>
          <Input
            id="key"
            :default-value="attribute.key"
            disabled
            class="col-span-3"
          />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="key" class="text-right">Data type</Label>
          <Select
            :disabled="isLoading"
            :model-value="selectedDataType"
            @update:model-value="(val:string)=>{
              onDataTypeChanged(val as DataType);
              selectedDataType = val as DataType;
          }"
          >
            <SelectTrigger class="w-[150px]">
              <SelectValue :placeholder="attributeDataType" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="(item, i) in dataTypes"
                  :key="i"
                  :value="item"
                  >{{ item }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div
          :aria-disabled="isLoading"
          class="grid grid-cols-4 items-center gap-4"
        >
          <Label class="text-right">
            Value
            <span class="text-red-500">*</span>
          </Label>
          <Input
            v-if="selectedDataType === 'Integer'"
            placeholder="Enter an integer"
            type="number"
            v-model="attributeValue"
            class="col-span-3"
          />
          <Input
            v-else-if="selectedDataType === 'Double'"
            placeholder="Enter a double"
            type="number"
            v-model="attributeValue"
            class="col-span-3"
          />
          <div
            v-else-if="selectedDataType === 'Boolean'"
            class="flex items-center col-span-3 space-x-2 py-2"
          >
            <Switch id="boolV" v-model:checked="attributeValue as boolean" />
            <Label for="boolV">True</Label>
          </div>
          <Input
            v-else-if="selectedDataType === 'String'"
            placeholder="Enter a string"
            type="text"
            v-model="attributeValue"
            class="col-span-3"
          />
          <Input
            v-else
            default-value="{}"
            v-model="jsonValue"
            class="col-span-3"
          />
          <span class="text-sm text-red-500 col-span-3">{{
            errorMessage
          }}</span>
        </div>
      </div>
      <DialogFooter class="flex items-end justify-end gap-2">
        <Button variant="outline" @click="showEditDialog = false">
          Cancle
        </Button>
        <Button :disabled="isLoading" @click="onSubmit">Update</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { saveDeviceAttributes } from "@/api/telemetry";
import { Attribute } from "@/types/telemetry";

const dataTypes = ["Integer", "Double", "String", "Boolean", "JSON"] as const;
type DataType = (typeof dataTypes)[number];

const showEditDialog = defineModel("showEditDialog", {
  type: Boolean,
});
const props = defineProps<{
  attribute: Attribute;
}>();
const emits = defineEmits<{
  (event: "submitted"): void;
}>();

const route = useRoute();
const { toast } = useToast();

const isLoading = ref(false);
const deviceId = computed(() => route.params.id as string);
const attributeDataType = computed<DataType>(() => {
  const value = props.attribute.value;
  if (typeof value === "number" && !Number.isInteger(value)) {
    return "Double";
  } else if (typeof value === "number" && Number.isInteger(value)) {
    return "Integer";
  } else if (typeof value === "boolean") {
    return "Boolean";
  } else if (typeof value === "string") {
    try {
      JSON.parse(value);
      return "JSON";
    } catch {
      return "String";
    }
  } else if (typeof value === "object") {
    return "JSON";
  } else {
    return "String";
  }
});
const selectedDataType = ref<DataType>(attributeDataType.value);

const attributeValue = ref<string | number | boolean | Record<string, unknown>>(
  props.attribute.value
);
const jsonValue = computed({
  get() {
    return JSON.stringify(attributeValue.value);
  },
  set(value: string) {
    try {
      attributeValue.value = JSON.parse(value);
    } catch {
      attributeValue.value = value;
    }
  },
});

const errorMessage = ref<string | null>(null);

function validate(): boolean {
  if (selectedDataType.value === "Integer") {
    if (
      typeof attributeValue.value !== "number" ||
      !Number.isInteger(attributeValue.value)
    ) {
      errorMessage.value = "Value must be an integer";
      return false;
    }
  } else if (selectedDataType.value === "Double") {
    if (
      typeof attributeValue.value !== "number" ||
      Number.isInteger(attributeValue.value)
    ) {
      errorMessage.value = "Value must be a double";
      return false;
    }
  } else if (selectedDataType.value === "Boolean") {
    if (typeof attributeValue.value !== "boolean") {
      errorMessage.value = "Value must be a boolean";
      return false;
    }
  } else if (selectedDataType.value === "String") {
    if (typeof attributeValue.value !== "string") {
      errorMessage.value = "Value must be a string";
      return false;
    }
  } else if (selectedDataType.value === "JSON") {
    if (typeof attributeValue.value !== "object") {
      errorMessage.value = "Value must be a JSON object";
      return false;
    }
  }
  errorMessage.value = null;
  return true;
}

function onDataTypeChanged(dataType: DataType) {
  errorMessage.value = null;
  if (dataType === "Boolean") {
    attributeValue.value = false;
  } else if (dataType === "JSON") {
    attributeValue.value = {};
  } else {
    attributeValue.value = "";
  }
}

async function onSubmit() {
  isLoading.value = true;
  if (!validate()) {
    isLoading.value = false;
    return;
  }
  try {
    const {} = await saveDeviceAttributes({
      deviceId: deviceId.value,
      attributes: {
        [props.attribute.key]: attributeValue.value,
      },
    });
    emits("submitted");
    showEditDialog.value = false;
    toast({
      title: "Attribute updated",
      description: "The attribute has been updated successfully",
    });
  } catch (error: any) {
    toast({
      title: error.response.data.message,
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
}

watch(
  showEditDialog,
  (newVal) => {
    if (!newVal) {
      attributeValue.value = props.attribute.value;
    }
    selectedDataType.value = attributeDataType.value;
    errorMessage.value = null;
  },
  { immediate: true }
);
</script>
