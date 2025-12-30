<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex items-center gap-2 mb-3">
    <div class="text-blue-600">
        <slot name="icon"></slot>
    </div>
    <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wide">{{ title }}</h3>
  </div>
</template>
