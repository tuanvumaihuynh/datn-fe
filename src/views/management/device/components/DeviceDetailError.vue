<template>
  <div
    class="flex flex-1 bg-background shrink-0 items-center justify-center rounded-md border border-dashed"
  >
    <div
      class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center"
    >
      <CircleX class="w-10 h-10 text-muted-foreground" />

      <h3 class="mt-4 text-lg font-semibold">Device not found</h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground">
        The device you are looking for does not exist.
      </p>

      <Button size="sm" class="relative" @click="$router.go(0)">Refresh</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleX } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
</script>
