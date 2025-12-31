<script setup lang="ts">
import Header from '@/components/Header.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import InfoCard from '@/components/InfoCard.vue';
import PluginBadge from '@/components/PluginBadge.vue';
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />
    
    <main class="p-6">
      <!-- Info Section -->
      <section class="mb-8">
        <SectionHeader title="INFO">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </template>
        </SectionHeader>

        <div class="grid grid-cols-3 gap-4">
          <InfoCard label="VUE VERSION" value="2.7.16" icon="vue" />
          <InfoCard label="UI FRAMEWORK" value="Bootstrap Vue" icon="bootstrap" />
          <InfoCard label="RENDERING" value="Client-side" />
        </div>
      </section>

      <!-- Plugins Section -->
      <section>
        <SectionHeader title="PLUGINS">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 3v5"></path>
              <path d="M15 3v5"></path>
              <path d="M21 12H3"></path>
              <path d="M3 21h18"></path>
              <path d="M11 12v9"></path>
            </svg>
          </template>
        </SectionHeader>

        <div class="flex flex-wrap gap-3">
          <PluginBadge name="vue-apollo" />
          <PluginBadge name="vuex" />
        </div>
      </section>
    </main>
  </div>
</template>

<style>
</style>
