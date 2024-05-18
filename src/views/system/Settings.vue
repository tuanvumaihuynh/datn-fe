<template>
  <Tabs default-value="appearance">
    <div class="flex items-center">
      <TabsList>
        <!-- <TabsTrigger value="account">Account</TabsTrigger> -->
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
    </div>
    <!-- <TabsContent value="account">
      <AccountTab />
    </TabsContent> -->
    <TabsContent class="flex flex-1 flex-col w-full" value="appearance">
      <SettingAppearanceForm />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingAppearanceForm from "./components/SettingAppearanceForm.vue";
</script>
