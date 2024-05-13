<template>
  <form @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Select the theme for the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField v-slot="{ componentField }" type="radio" name="theme">
          <FormItem class="space-y-1">
            <RadioGroup
              class="grid max-w-md grid-cols-2 gap-8 pt-2"
              v-bind="componentField"
            >
              <FormItem>
                <FormLabel
                  class="[&:has([data-state=checked])>div]:border-primary"
                >
                  <FormControl>
                    <RadioGroupItem value="light" class="sr-only" />
                  </FormControl>
                  <div
                    class="items-center rounded-md border-2 border-muted p-1 hover:border-accent"
                  >
                    <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
                        <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div
                        class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm"
                      >
                        <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div
                        class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm"
                      >
                        <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                        <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                  </div>
                  <span class="block w-full p-2 text-center font-normal">
                    Light
                  </span>
                </FormLabel>
              </FormItem>
              <FormItem>
                <FormLabel
                  class="[&:has([data-state=checked])>div]:border-primary"
                >
                  <FormControl>
                    <RadioGroupItem value="dark" class="sr-only" />
                  </FormControl>
                  <div
                    class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
                  >
                    <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div
                        class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm"
                      >
                        <div class="h-2 w-20 rounded-lg bg-slate-400" />
                        <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div
                        class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"
                      >
                        <div class="h-4 w-4 rounded-full bg-slate-400" />
                        <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                      <div
                        class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"
                      >
                        <div class="h-4 w-4 rounded-full bg-slate-400" />
                        <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                      </div>
                    </div>
                  </div>
                  <span class="block w-full p-2 text-center font-normal">
                    Dark
                  </span>
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter>
        <Button type="submit"> Update preferences </Button>
      </CardFooter>
    </Card>
  </form>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useColorMode } from "@vueuse/core";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const mode = useColorMode();

const appearanceFormSchema = toTypedSchema(
  z.object({
    theme: z.enum(["light", "dark"], {
      required_error: "Please select a theme.",
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema: appearanceFormSchema,
  initialValues: {
    theme: mode.value as "light" | "dark",
  },
});

const onSubmit = handleSubmit((values) => {
  mode.value = values.theme;
});
</script>
