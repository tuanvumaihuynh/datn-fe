<template>
  <router-view />
  <Toaster />
</template>

<script setup lang="ts">
import { useColorMode, useFavicon, useTitle } from "@vueuse/core";
import Toaster from "@/components/ui/toast/Toaster.vue";

import Logo from "@/assets/logo.png";

useColorMode();
const icon = useFavicon();
const title = useTitle();

icon.value = Logo;
title.value = "ProjectEnergyAdmin";
</script>
