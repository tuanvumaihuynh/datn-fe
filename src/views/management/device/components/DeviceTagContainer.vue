<template>
  <div class="pt-2 flex flex-row gap-1">
    <span
      v-if="device?.tags.length === 0"
      class="text-gray-500 dark:text-gray-400"
      >No tags found
    </span>
    <Badge v-for="item in device?.tags" variant="outline" class="cursor-default"
      >{{ item }}
    </Badge>
    <Sheet>
      <SheetTrigger as-child>
        <Button
          size="icon"
          variant="outline"
          class="h-6 w-6"
          @click="onConfigureTagClick"
        >
          <Plus class="h-3 w-3" />
          <span class="sr-only">Add tag</span>
        </Button>
      </SheetTrigger>
      <SheetContent class="">
        <SheetTitle>Configure tags</SheetTitle>
        <SheetDescription>
          Make changes to your tag here. Click save when you're done.
        </SheetDescription>
        <div class="py-3 flex flex-wrap gap-2">
          <Badge
            v-for="(item, i) in tagList"
            :key="i"
            variant="outline"
            class="h-8 flex gap-2 cursor-default hover:cursor-pointer"
            :class="{ 'bg-primary text-white': item.selected }"
            @click="onTagClick(item)"
          >
            {{ item.name }}
          </Badge>
        </div>
        <span class="text-sm text-red-500">{{ errorMsg }}</span>
        <SheetFooter>
          <SheetTrigger as-child>
            <Button @click="onUpdateTagsSubmit"> Save changes </Button>
          </SheetTrigger>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ref, computed, onMounted } from "vue";
import { getTags } from "@/api/tag";
import { update_tags } from "@/api/device";
import { TagWithSelected } from "@/types/tag";
import { Device } from "@/types/device";

const MAX_TAGS = 5;
const TAG_ERROR_MSG = "You can only select up to 5 tags";

type CustomTag = Pick<TagWithSelected, "selected" | "name">;

const device = defineModel<Device>("device", { required: true });

const errorMsg = ref<string | null>(null);

let initialTags: CustomTag[] = [];
const tagList = ref<CustomTag[]>([]);
const seletedTagNames = computed(() =>
  tagList.value.filter((tag) => tag.selected).map((tag) => tag.name)
);
const seletedTagCount = computed(
  () => tagList.value.filter((tag) => tag.selected).length
);

async function fetchTags() {
  try {
    const { data } = await getTags({
      page: 1,
      pageSize: 100,
    });
    tagList.value = data.items.map((item: any) => {
      return {
        name: item.name,
        selected: device.value.tags.includes(item.name),
      };
    });
    initialTags = tagList.value;
  } catch (error) {
    console.error(error);
  }
}

function onTagClick(tag: CustomTag) {
  if (seletedTagCount.value >= MAX_TAGS && !tag.selected) {
    errorMsg.value = TAG_ERROR_MSG;
    return;
  }
  tag.selected = !tag.selected;
}

async function onUpdateTagsSubmit() {
  const tagNames = seletedTagNames.value;

  try {
    const {} = await update_tags(device.value.id, tagNames);
    device.value.tags = tagNames;
  } catch (error) {
    tagList.value = initialTags;
  }
}

async function onConfigureTagClick() {
  await fetchTags();
}

onMounted(async () => {
  await fetchTags();
});
</script>
