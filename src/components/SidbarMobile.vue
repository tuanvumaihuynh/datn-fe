<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline" size="icon" class="shrink-0 lg:hidden">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="flex flex-col">
      <VisuallyHidden as-child>
        <DialogTitle class="text-center">Menu</DialogTitle>
      </VisuallyHidden>
      <nav class="grid gap-2 text-lg font-medium">
        <template v-for="(section, i) in sections">
          <span
            class="mx-[-0.65rem] text-muted-foreground text-sm px-3 py-2"
            :class="i === 0 ? 'mt-2' : 'mt-7'"
            >{{ section.sectionName }}</span
          >
          <SheetTrigger>
            <router-link
              v-for="(menu, i) in section.menus"
              :key="i"
              :to="menu.path"
              active-class="text-primary bg-muted"
              class="text-muted-foreground"
            >
              <a
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              >
                <component :is="menu.icon" class="h-4 w-4" />
                {{ menu.title }}
              </a>
            </router-link>
          </SheetTrigger>
        </template>
      </nav>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Menu } from "lucide-vue-next";
import { VisuallyHidden } from "radix-vue";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import useMenus from "@/hooks/useMenus";

const { sections } = useMenus();
</script>
