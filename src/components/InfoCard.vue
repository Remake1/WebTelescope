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
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden transition-shadow hover:shadow-md min-h-[80px]">
    <!-- Label Tab (smaller) -->
    <div class="absolute top-0 left-0 bg-gray-100 px-1.5 py-1 rounded-br-xl">
      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
        {{ label }}
      </span>
    </div>

    <!-- Main Content (absolutely centered) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="flex items-center gap-2">
        <img v-if="iconSrc" :src="iconSrc" class="w-5 h-5" alt="" />
        <span :class="['font-bold text-gray-900', valueFontSize]">{{ value }}</span>
      </div>
    </div>

    <!-- SubValue (if any) -->
    <div v-if="subValue" class="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 font-medium">
      {{ subValue }}
    </div>
  </div>
</template>
