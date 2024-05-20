<template>
  <div class="grid gap-4">
    <Label class="text-left text-lg"> Credentials type: MQTT Basic</Label>
    <div class="grid gap-3">
      <Label for="mqttUsername" class="text-left">
        Username
        <span class="text-red-500">*</span>
      </Label>
      <div class="relative items-center">
        <Input id="mqttUsername" v-model="username" class="pr-10" />
        <span
          v-if="!showUsernameCopy"
          class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
          @click="
            () => {
              username = generateRandomString();
            }
          "
        >
          <RefreshCcw class="size-4 text-muted-foreground" />
        </span>
        <span
          v-else
          class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
          @click="copyToClipboard(username)"
        >
          <Copy class="size-4 text-muted-foreground" />
        </span>
      </div>
      <span class="text-sm text-red-500">{{ usernameFieldError }}</span>
    </div>
    <div class="grid gap-3">
      <Label for="mqttPassword" class="text-left">
        Password
        <span class="text-red-500">*</span>
      </Label>
      <div class="relative items-center">
        <Input
          id="mqttPassword"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
        />
        <span
          class="absolute end-8 inset-y-0 rounded-lg flex items-center justify-center p-2 hover:bg-gray-100 cursor-pointer"
          @click="showPassword = !showPassword"
        >
          <component
            :is="showPassword ? EyeOff : Eye"
            class="size-4 text-muted-foreground"
          />
        </span>
        <span
          v-if="!showPasswordCopy"
          class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
          @click="
            () => {
              password = generateRandomString();
            }
          "
        >
          <RefreshCcw class="size-4 text-muted-foreground" />
        </span>
        <span
          v-else
          class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
          @click="copyToClipboard(password)"
        >
          <Copy class="size-4 text-muted-foreground" />
        </span>
      </div>
      <span class="text-sm text-red-500">{{ passwordFieldError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RefreshCcw, Copy, Eye, EyeOff } from "lucide-vue-next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ref, computed } from "vue";
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import useTokenGen from "@/hooks/useTokenGen";
import useClipboard from "@/hooks/useClipboard";

const { generateRandomString } = useTokenGen();
const { copyToClipboard } = useClipboard();

defineProps<{
  username: string;
  password: string;
}>();

const showPassword = ref(false);

const usernameSchema = toTypedSchema(
  z
    .string()
    .min(4, "Username is too short, min 4 characters")
    .max(20, "Username is too long, max 20 characters")
);
const passwordSchema = toTypedSchema(
  z
    .string()
    .min(4, "Password is too short, min 4 characters")
    .max(20, "Password is too long, max 20 characters")
);

const {
  value: username,
  errorMessage: usernameFieldError,
  validate: usernameValidate,
} = useField<string>("username", usernameSchema, {
  syncVModel: "username",
});
const {
  value: password,
  errorMessage: passwordFieldError,
  validate: passwordValidate,
} = useField<string>("password", passwordSchema, {
  syncVModel: "password",
});

const showUsernameCopy = computed(() => username.value);
const showPasswordCopy = computed(() => password.value);

async function validate() {
  const { valid: usernameValid } = await usernameValidate();
  const { valid: passwordValid } = await passwordValidate();
  return usernameValid && passwordValid;
}

defineExpose({
  validate,
});
</script>
