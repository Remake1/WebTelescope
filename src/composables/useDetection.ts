/**
 * Composable to fetch detection results from content script
 */

import { ref, onMounted } from 'vue';
import type { DetectionResults } from '@/entrypoints/injected';

export function useDetection() {
    const results = ref<DetectionResults | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);

    async function fetchResults() {
        loading.value = true;
        error.value = null;

        try {
            // Get the active tab
            const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

            if (!tab?.id) {
                throw new Error('No active tab found');
            }

            // Send message to content script
            const response = await browser.tabs.sendMessage(tab.id, {
                type: 'GET_DETECTION_RESULTS',
            });

            if (response) {
                results.value = response;
            } else {
                error.value = 'No detection results available';
            }
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Failed to get detection results';
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        fetchResults();
    });

    return {
        results,
        loading,
        error,
        refresh: fetchResults,
    };
}
