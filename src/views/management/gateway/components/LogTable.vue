<template>
  <table class="w-full grid">
    <thead class="sticky top-0 p-2 bg-secondary">
      <tr class="grid grid-cols-[180px_80px_1fr]">
        <th class="text-sm text-left">Timestamp</th>
        <th class="text-sm text-left">Level</th>
        <th class="text-sm text-left">Message</th>
      </tr>
    </thead>
    <tbody
      class="bg-grey-light grid overflow-y-scroll h-[300px] invisible hover:visible"
      ref="el"
    >
      <template v-if="logs.length">
        <tr
          v-for="(item, i) in logs.slice().reverse()"
          :key="i"
          class="grid grid-cols-[180px_80px_1fr] items-center visible w-full p-2 border-b border-grey-light hover:bg-muted"
        >
          <td class="text-sm pr-4">{{ item.timestamp }}</td>
          <td class="text-sm" :class="useLevelColor(item.level)">
            {{ item.level }}
          </td>
          <td class="text-sm">{{ item.message }}</td>
        </tr>
      </template>
      <template v-else>
        <tr class="grid grid-cols-[1fr] h-24 text-center">
          <td>No record.</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { Log } from "@/types/telemetry";
import { ref, onMounted } from "vue";

defineProps<{
  logs: Log[];
}>();

const el = ref<HTMLElement>();

function useLevelColor(level: string) {
  switch (level) {
    case "ERROR":
      return "text-red-500";
    case "WARN":
      return "text-yellow-500";
    case "INFO":
      return "text-blue-500";
    case "DEBUG":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

onMounted(async () => {
  el.value?.scrollTo(0, el.value.scrollHeight);
});
</script>
