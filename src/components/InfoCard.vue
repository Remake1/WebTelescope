<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value: string;
  subValue?: string;
  icon?: string;
}>();

const valueFontSize = computed(() => {
  if (props.value.length > 20) return 'text-xs';
  if (props.value.length > 12) return 'text-sm';
  return 'text-base';
});

const iconSrc = computed(() => {
  if (!props.icon) return null;
  return new URL(`../assets/${props.icon}.svg`, import.meta.url).href;
});
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden transition-shadow hover:shadow-md">
    <!-- Label Tab -->
    <div class="absolute top-0 left-0 bg-gray-100 px-3 py-1.5 rounded-br-2xl">
      <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
        {{ label }}
      </span>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col items-center justify-center px-4 pt-10 pb-4">
      <div class="flex items-center gap-2">
        <img v-if="iconSrc" :src="iconSrc" class="w-5 h-5" alt="" />
        <span :class="['font-bold text-gray-900', valueFontSize]">{{ value }}</span>
      </div>

      <div v-if="subValue" class="text-xs text-gray-500 font-medium mt-1">
        {{ subValue }}
      </div>
    </div>
  </div>
</template>
