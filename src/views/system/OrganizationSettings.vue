<template>
  <h1 class="text-2xl font-semibold leading-none tracking-tight">
    Organizations Settings
  </h1>
  <Tabs v-model="tabValue" class="flex flex-col flex-1">
    <div>
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent
      value="users"
      :class="tabValue === 'users' ? tabClass : 'hidden'"
    >
      <UserCard />
    </TabsContent>
    <TabsContent
      value="roles"
      :class="tabValue === 'roles' ? tabClass : 'hidden'"
    >
      <RoleCard />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserCard from "./components/UserCard.vue";
import RoleCard from "./components/RoleCard.vue";

import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const tabValues = ["users", "roles"] as const;
type TabValue = (typeof tabValues)[number];

const tabClass = "flex flex-1 flex-col";

const router = useRouter();
const route = useRoute();

const tabValue = computed({
  get() {
    const tab = route.query.tab as TabValue;
    if (!(tab && tabValues.includes(tab))) {
      router.replace({ query: { ...route.query, tab: "users" } });
      return "users";
    }
    return tab;
  },
  set(value) {
    router.replace({ query: { ...route.query, tab: value } });
  },
});
</script>
