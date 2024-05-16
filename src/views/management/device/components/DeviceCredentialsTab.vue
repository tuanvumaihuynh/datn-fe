<template>
  <div class="w-[50vw]">
    <div>
      <h3 class="text-lg font-medium">MQTT Credentials (MQTT Basic)</h3>
      <p class="text-sm text-muted-foreground">
        MQTT credentials are used to authenticate the device to the MQTT broker.
      </p>
    </div>
    <Separator class="my-4" />
    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="clientid">
        <FormItem>
          <FormLabel>Client ID</FormLabel>
          <FormControl>
            <div class="relative items-center">
              <Input
                class="pr-10"
                disabled
                type="text"
                :placeholder="props.credentials.clientId"
                v-bind="componentField"
              />
              <span
                class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
                @click="copyToClipboard(props.credentials.clientId)"
              >
                <Copy class="size-4 text-muted-foreground" />
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <div class="relative items-center">
              <Input class="pr-10" type="text" v-bind="componentField" />
              <span
                v-if="!componentField.modelValue"
                class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
                @click="setFieldValue('username', generateRandomString())"
              >
                <RefreshCcw class="size-4 text-muted-foreground" />
              </span>
              <span
                v-else
                class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
                @click="copyToClipboard(componentField.modelValue)"
              >
                <Copy class="size-4 text-muted-foreground" />
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div class="relative items-center">
              <Input
                class="pr-10"
                :type="showPassword ? 'text' : 'password'"
                v-bind="componentField"
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
                v-if="!componentField.modelValue"
                class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
                @click="setFieldValue('password', generateRandomString())"
              >
                <RefreshCcw class="size-4 text-muted-foreground" />
              </span>
              <span
                v-else
                class="absolute end-0 inset-y-0 rounded-lg flex items-center justify-center px-2 hover:bg-gray-100 cursor-pointer"
                @click="copyToClipboard(componentField.modelValue)"
              >
                <Copy class="size-4 text-muted-foreground" />
              </span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit">Update credentials</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { RefreshCcw, Copy, Eye, EyeOff } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";

import useTokenGen from "@/hooks/useTokenGen";
import useClipboard from "@/hooks/useClipboard";

const { toast } = useToast();
const { generateRandomString } = useTokenGen();
const { copyToClipboard } = useClipboard();

const props = defineProps<{
  credentials: {
    clientId: string;
    username: string;
    password: string;
  };
}>();

const showPassword = ref(false);

const credentialsFormSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(4, "Username is too short, min 4 characters")
      .max(20, "Username is too long, max 20 characters"),
    password: z
      .string()
      .min(4, "Password is too short, min 4 characters")
      .max(20, "Password is too long, max 20 characters"),
  })
);

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: credentialsFormSchema,
  initialValues: {
    username: props.credentials.username,
    password: props.credentials.password,
  },
});
const onSubmit = handleSubmit((values) => {
  toast({
    title: "Credentials updated",
    description: "Your MQTT credentials have been updated successfully",
  });
});
</script>
