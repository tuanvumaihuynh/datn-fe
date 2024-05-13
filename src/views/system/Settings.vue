<template>
  <Tabs default-value="account">
    <div class="flex items-center">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <p>Account settings</p>
          </CardDescription>
          <CardFooter>
            <button class="btn">Save</button>
          </CardFooter>
        </CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="appearance">
      <SettingAppearanceForm />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingAppearanceForm from "./components/SettingAppearanceForm.vue";
</script>
