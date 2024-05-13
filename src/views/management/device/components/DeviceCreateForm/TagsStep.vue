<template>
  <div>
    <Label class="text-left text-lg">
      Select up to 5 tags for the device
    </Label>
    <p class="text-sm text-muted-foreground">
      Tags help you organize and filter your devices
    </p>
  </div>

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
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { ref, computed, watch } from "vue";
import { TagWithSelected } from "@/types/tag";

const MAX_TAGS = 5;
const TAG_ERROR_MSG = "You can only select up to 5 tags";

type TagNameWithSelected = Pick<TagWithSelected, "name" | "selected">;

const props = defineProps<{
  tagList: TagNameWithSelected[];
}>();

const seletedTagCount = computed(
  () => props.tagList.filter((tag) => tag.selected).length
);
const errorMsg = ref<string | null>(null);

function onTagClick(tag: TagNameWithSelected) {
  if (seletedTagCount.value >= MAX_TAGS && !tag.selected) {
    errorMsg.value = TAG_ERROR_MSG;
    return;
  }
  tag.selected = !tag.selected;
}

watch(
  seletedTagCount,
  (count) => {
    if (count < MAX_TAGS) {
      errorMsg.value = null;
    }
  },
  { immediate: true }
);
</script>
