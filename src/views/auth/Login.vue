<template>
  <section class="bg-white">
    <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
      <section
        class="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
      >
        <img
          alt=""
          src="https://images.unsplash.com/photo-1481127303226-3f47f8af862d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          class="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        <div class="hidden lg:relative lg:block lg:p-12">
          <a class="block text-white" href="#">
            <span class="sr-only">Home</span>
            <Logo class="h-12 w-12 object-contain" />
          </a>

          <h2
            class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-transparent py-1 bg-clip-text mt-6 text-2xl font-bold sm:text-3xl md:text-4xl"
          >
            Welcome to ProjectEnergyAdmin
          </h2>

          <p class="mt-4 leading-relaxed text-white/90">
            Monitoring and collecting energy data from devices.
          </p>
        </div>
      </section>

      <main
        class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
      >
        <div class="max-w-xl lg:max-w-3xl">
          <div class="relative -mt-16 block lg:hidden">
            <a
              class="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
              href="#"
            >
              <span class="sr-only">Home</span>
              <Logo class="h-12 w-12 object-contain" />
            </a>

            <h1
              class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
            >
              Welcome to ProjectEnergyAdmin
            </h1>

            <p class="mt-4 leading-relaxed text-gray-500">
              Monitoring and collecting energy data from devices.
            </p>
          </div>

          <form
            @submit="onSubmit"
            class="mt-8 flex flex-col min-w-[22vw] gap-6"
          >
            <h1 class="text-2xl font-bold">
              Sign in <br />
              <span class="text-gray-500 text-sm font-semibold"
                >to continue to ProjectEnergyAdmin</span
              >
            </h1>
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
              <div class="relative items-center">
                <Input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="********"
                  required
                  v-model="password"
                />
                <span
                  class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center p-2 hover:bg-gray-100 cursor-pointer"
                  @click="showPassword = !showPassword"
                >
                  <component
                    :is="showPassword ? EyeOff : Eye"
                    class="size-4 text-muted-foreground"
                  />
                </span>
              </div>
              <span class="text-red-500">{{ errors.password }}</span>
            </div>

            <div class="col-span-6 sm:flex sm:items-center sm:gap-4">
              <Button class="w-full" type="submit" :disabled="isLoading">
                <LoaderCircle
                  v-if="isLoading"
                  class="w-4 h-4 mr-2 animate-spin"
                />
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Eye, EyeOff, LoaderCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { useRouter, useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";
import { login } from "@/api/auth";
import { useUserStore } from "@/stores";
import Logo from "@/assets/logo.vue";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { toast } = useToast();

const isLoading = ref(false);
const showPassword = ref(false);

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
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
    router.replace({
      path: (route.query.to ?? "/devices").toString(),
    });
  } catch (error: any) {
    toast({
      title: "Failed to login",
      description: error.response.data.message,
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
