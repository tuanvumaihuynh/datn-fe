<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="h-7 gap-1 rounded-md px-3 relative mr-3"
      >
        <Filter class="h-3.5 w-3.5" />
        <span class="sr-only sm:not-sr-only">Tag filter</span>
        <div v-if="selectedTagLength && selectedTagLength > 0">
          <span
            class="absolute -top-2 -right-3 -mt-1 -mr-1 inline-flex items-center justify-center rounded-full bg-primary px-2.5 py-0.5 text-background text-xs"
          >
            {{ selectedTagLength }}
          </span>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <ScrollArea class="h-72">
        <div>
          <h4
            class="sticky top-0 bg-background z-50 pb-3 text-sm font-medium leading-none"
          >
            Total tags: {{ tags?.length }}
          </h4>
          <Separator />
          <div
            v-for="(tag, i) in tags?.sort((a, b) =>
              a.name.localeCompare(b.name)
            )"
            :key="i"
          >
            <div class="flex items-center space-x-2 py-1">
              <Checkbox
                :id="'tag-' + i"
                :checked="tag.selected"
                @update:checked="tag.selected = !tag.selected"
              />
              <label
                for="tag"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {{ tag.name }}
              </label>
            </div>
            <Separator class="my-2" />
          </div>
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { Filter } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { computed } from "vue";

interface TagWithSelected {
  name: string;
  selected: boolean;
}

const tags = defineModel<TagWithSelected[]>("tags");
const selectedTagLength = computed(
  () => tags.value?.filter((tag) => tag.selected).length
);
</script>
