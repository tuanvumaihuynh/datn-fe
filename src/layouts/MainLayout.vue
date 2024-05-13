<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <Sidebar />
    <div class="flex flex-col sm:gap-4 sm:py-4 lg:pl-80">
      <header
        class="flex h-14 items-center justify-between gap-4 px-4 lg:h-[60px] lg:px-6"
      >
        <SidebarMobile />
        <a href="/" class="flex items-center gap-2 font-semibold lg:hidden">
          <CodeXml color="" class="h-8 w-8" />
          <span class="font-bold">Project Energy</span>
        </a>
        <div class="relative flex-1 ml-auto grow-0">
          <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
            <Bell class="h-4 w-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{{ userInfo?.username }}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              @click="() => $router.push({ name: 'OrganizationSettings' })"
              >Users</DropdownMenuItem
            >
            <DropdownMenuItem @click="toLogin()">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main
        class="flex flex-1 flex-col gap-4 p-4 overflow-auto lg:gap-6 lg:p-6"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, CircleUser, CodeXml } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Sidebar from "@/components/Sidebar.vue";
import SidebarMobile from "@/components/SidbarMobile.vue";

import { onMounted } from "vue";

import { storeToRefs } from "pinia";
import { toLogin } from "@/router";
import { getCurrentUser } from "@/api/user";
import { useUserStore } from "@/stores";

const { setUserInfo } = useUserStore();
const { userInfo } = storeToRefs(useUserStore());

const initUserInfo = async () => {
  try {
    const { data } = await getCurrentUser();
    setUserInfo({
      id: data.id,
      username: data.username,
      role: data.role,
      enabled: data.enabled,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("Failed to fetch user info", error);
    // toast({
    //   title: "Failed to fetch user info",
    // });
  }
};

onMounted(() => {
  initUserInfo();
});
</script>
