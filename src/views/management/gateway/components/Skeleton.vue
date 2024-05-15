<template>
  <div class="grid gap-4 xl:grid-cols-4 md:gap-8 grid-cols-2">
    <Skeleton class="h-[125px] rounded-lg" />
    <Skeleton class="h-[125px] rounded-lg" />
    <Skeleton class="h-[125px] rounded-lg" />
    <Skeleton class="h-[125px] rounded-lg" />
  </div>
  <Skeleton class="h-[400px] rounded-lg" />
  <Skeleton class="h-[300px] rounded-lg" />
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton";
</script>
