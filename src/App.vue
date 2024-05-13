<template>
  <router-view />
  <Toaster />
</template>

<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import Toaster from "@/components/ui/toast/Toaster.vue";
useColorMode();
</script>
