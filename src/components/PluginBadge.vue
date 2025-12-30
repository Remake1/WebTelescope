<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-default">
    {{ name }}
  </div>
</template>
