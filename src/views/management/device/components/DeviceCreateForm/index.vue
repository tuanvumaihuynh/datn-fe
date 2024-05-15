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

    <DialogContent class="flex flex-col flex-1 h-[60vh]">
      <template v-if="isSubmitting">Loading</template>
      <template v-else>
        <DialogHeader class="flex gap-4">
          <DialogTitle>Create new device</DialogTitle>
          <Stepper :values="stepValues" :active-value="selectedStep" />
        </DialogHeader>
        <DetailsStep
          v-if="selectedStep === 'Details'"
          ref="detailsStepRef"
          v-model:name="name"
          v-model:description="description"
          v-model:is-gateway="isGateway"
        />
        <TagsStep v-else-if="selectedStep === 'Tags'" :tag-list="tagList" />
        <CredentialsStep
          v-else-if="selectedStep === 'Credentials'"
          ref="credentialsStepRef"
          v-model:username="username"
          v-model:password="password"
        />
      </template>
      <DialogFooter
        class="flex flex-1 items-end"
        :class="selectedStep === 'Details' ? 'justify-end' : 'justify-between'"
      >
        <Button
          v-if="selectedStep !== 'Details'"
          variant="outline"
          class="flex-none"
          @click="onPrevious"
        >
          <ChevronLeft class="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div class="flex gap-2">
          <Button variant="outline" @click="showCreateDialog = false">
            Cancel
          </Button>
          <Button @click="onSubmit">
            {{ selectedStep === "Credentials" ? "Create" : "Next" }}
            <ChevronRight
              v-if="selectedStep !== 'Credentials'"
              class="w-4 h-4 ml-2"
            />
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Plus, ChevronRight, ChevronLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Stepper from "@/components/Stepper.vue";
import DetailsStep from "./DetailsStep.vue";
import TagsStep from "./TagsStep.vue";
import CredentialsStep from "./CredentialsStep.vue";

import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { createDevice } from "@/api/device";
import { getTags } from "@/api/tag";
import { TagWithSelected } from "@/types/tag";

type TagNameWithSelected = Pick<TagWithSelected, "name" | "selected">;

type Step = "Details" | "Tags" | "Credentials";
const stepValues: Step[] = ["Details", "Tags", "Credentials"];

const showCreateDialog = defineModel("showCreateDialog", {
  type: Boolean,
});
const emits = defineEmits<{
  (event: "submitted"): void;
}>();

const router = useRouter();

const tagList = ref<TagNameWithSelected[]>([]);

const name = ref<string>("");
const description = ref<string>();
const isGateway = ref<boolean>(false);
const tagNames = computed(() =>
  tagList.value.filter((tag) => tag.selected).map((tag) => tag.name)
);
const username = ref<string>("");
const password = ref<string>("");

const selectedStep = ref<Step>("Details");
const isSubmitting = ref<boolean>(false);
const deviceId = ref<string>();

const detailsStepRef = ref();
const credentialsStepRef = ref();

function onPrevious() {
  if (selectedStep.value === "Tags") {
    selectedStep.value = "Details";
    return;
  }
  if (selectedStep.value === "Credentials") {
    selectedStep.value = "Tags";
    return;
  }
}

async function onSubmit() {
  if (selectedStep.value == "Details") {
    if (!(await detailsStepRef.value.validate())) {
      return;
    }
    if (tagList.value.length === 0) {
      await fetchTags();
    }
    selectedStep.value = "Tags";
    return;
  }
  if (selectedStep.value === "Tags") {
    selectedStep.value = "Credentials";
    return;
  }
  if (selectedStep.value === "Credentials") {
    if (!(await credentialsStepRef.value.validate())) {
      return;
    }
    isSubmitting.value = true;
    try {
      const { data } = await createDevice({
        name: name.value,
        description: description.value,
        isGateway: isGateway.value,
        tags: tagNames.value,
        credentials: {
          username: username.value,
          password: password.value,
        },
      });
      deviceId.value = data.id;
      router.push(`/devices/${deviceId.value}`);
      emits("submitted");
      showCreateDialog.value = false;
    } catch (error) {
      console.error(error);
    } finally {
      isSubmitting.value = false;
    }
  }
}

async function fetchTags() {
  try {
    const { data } = await getTags({
      page: 1,
      pageSize: 100,
    });
    tagList.value = data.items.map((item: any) => {
      return {
        name: item.name,
        selected: false,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

function resetForm() {
  name.value = "";
  description.value = "";
  isGateway.value = false;
  selectedStep.value = "Details";
  tagList.value.forEach((tag) => (tag.selected = false));
  username.value = "";
  password.value = "";
}
watch(
  showCreateDialog,
  (value) => {
    if (!value) {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
