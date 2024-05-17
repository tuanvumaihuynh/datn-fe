<template>
  <div
    class="flex flex-1 bg-background shrink-0 items-center justify-center rounded-md border border-dashed"
  >
    <div
      class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center"
    >
      <h1 class="text-9xl font-black text-gray-200">404</h1>
      <h3 class="mt-4 text-lg font-semibold">Uh-oh!</h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground">
        We can't find that page.
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
import { Button } from "@/components/ui/button";
</script>
