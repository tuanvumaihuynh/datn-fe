<template>
  <div>Credentials</div>
</template>

<script setup lang="ts">
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
  credentials: {
    clientId: string;
    username: string;
    password: string;
  };
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
</script>
