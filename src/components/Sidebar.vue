<template>
  <aside
    class="fixed inset-y-0 left-0 z-10 hidden w-80 flex-col border-r bg-background lg:flex"
  >
    <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
      <a href="/" class="flex items-center gap-2 py-5 font-semibold">
        <CodeXml color="" class="h-8 w-8" />
        <span class="font-bold">Project Energy</span>
      </a>
      <template v-for="(section, i) in sections">
        <span
          class="text-muted-foreground text-xs px-2 py-2"
          :class="i === 0 ? 'mt-2' : 'mt-7'"
          >{{ section.sectionName }}
        </span>
        <router-link
          v-for="(menu, i) in section.menus"
          :key="i"
          :to="menu.path"
          class="text-muted-foreground rounded-lg"
          active-class="text-primary bg-muted"
        >
          <a
            class="flex items-center gap-3 px-2 py-2 transition-all hover:text-primary"
          >
            <component :is="menu.icon" class="h-4 w-4" />
            {{ menu.title }}
          </a>
        </router-link>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { CodeXml } from "lucide-vue-next";
import useMenus from "@/hooks/useMenus";

const { sections } = useMenus();
</script>
