<template>
  <div
    class="flex flex-1 bg-background shrink-0 items-center justify-center rounded-md border border-dashed"
  >
    <div
      class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center"
    >
      <Rocket class="w-10 h-10 text-muted-foreground" />

      <h3 class="mt-4 text-lg font-semibold">Feature in development</h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground">
        This feature is currently under development and not fully functional.
      </p>

      <Button
        size="sm"
        class="relative"
        @click="$router.push({ name: 'Devices' })"
        >Back to home</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rocket } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
</script>
