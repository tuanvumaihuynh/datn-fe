<template>
  <div
    class="flex flex-col justify-center items-center h-screen bg-background"
    :style="{
      'background-image': ' url(' + LooperPatern + ')',
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    }"
  >
    <Card class="w-full max-w-sm">
      <form @submit="onSubmit">
        <CardHeader>
          <CardTitle class="text-2xl">Sign in</CardTitle>
          <CardDescription> to continue to ProjectEnergyAdmin </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="username"
              required
              v-model="username"
            />
            <span class="text-red-500">{{ errors.username }}</span>
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              v-model="password"
            />
            <span class="text-red-500">{{ errors.password }}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full" type="submit" :disabled="isLoading">
            <LoaderCircle v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import LooperPatern from "@/assets/looper-pattern.svg";
import { LoaderCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { useRouter } from "vue-router";
import { login } from "@/api/auth";
import { useUserStore } from "@/stores";

const isLoading = ref(false);
const userStore = useUserStore();
const router = useRouter();

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(4, "Too short, must be at least 4 characters"),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: username } = useField<string>("username");
const { value: password } = useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const { data } = await login(values);
    userStore.setAccessToken(data.access_token);
    router.push("/devices");
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
