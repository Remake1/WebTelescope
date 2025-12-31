<script setup lang="ts">
import Header from '@/components/Header.vue';
import InfoCard from '@/components/InfoCard.vue';
import { useDetection } from '@/composables/useDetection';
import { computed } from 'vue';
import type { DetectionResult } from '@/lib/detection';
import ErrorIcon from "@/components/ErrorIcon.vue";
import SearchIcon from "@/components/SearchIcon.vue";

const { results, loading, error } = useDetection();

interface DisplayTech extends DetectionResult {
  category: string;
}

// Format version: cut off everything after '-'
function formatVersion(version: string | undefined): string | undefined {
  if (!version) return undefined;
  const dashIndex = version.indexOf('-');
  return dashIndex > 0 ? version.substring(0, dashIndex) : version;
}

// Combine all detected technologies with category labels
const allDetected = computed<DisplayTech[]>(() => {
  if (!results.value) return [];
  return [
    ...results.value.core.filter(r => r.detected).map(r => ({ ...r, category: 'Core' })),
    ...results.value.meta.filter(r => r.detected).map(r => ({ ...r, category: 'Meta framework' })),
    ...results.value.styles.filter(r => r.detected).map(r => ({ ...r, category: 'UI' })),
  ];
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />

    <main class="p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-sm text-gray-500">Detecting technologies...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <ErrorIcon aria-hidden="true" />
        </div>
        <p class="text-sm text-gray-600">{{ error }}</p>
        <p class="text-xs text-gray-400 mt-1">Make sure you're on a webpage</p>
      </div>

      <!-- Results Grid -->
      <template v-else-if="results">
        <div v-if="allDetected.length > 0" class="grid grid-cols-2 gap-4">
          <InfoCard
            v-for="tech in allDetected"
            :key="tech.name"
            :label="tech.category"
            :value="formatVersion(tech.version) || tech.name"
            :icon="tech.icon"
          />
        </div>

        <!-- No Detection State -->
        <div v-else class="text-center py-12">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <SearchIcon />
          </div>
          <p class="text-sm text-gray-600">No technologies detected</p>
          <p class="text-xs text-gray-400 mt-1">This page may not use detectable frameworks</p>
        </div>
      </template>
    </main>
  </div>
</template>

<style>
</style>
