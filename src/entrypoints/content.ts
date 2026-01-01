/**
 * Content script for tech detection
 * Injects main world script and handles messaging
 */

import type { DetectionResults } from './injected';

// Store detection results
let cachedResults: DetectionResults | null = null;

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  async main() {
    // Create promise to receive detection results
    const resultsPromise = new Promise<DetectionResults>((resolve) => {
      const handleResponse = (event: Event) => {
        if (event instanceof CustomEvent && event.detail) {
          cachedResults = event.detail;
          resolve(event.detail);
        }
      };

      // Inject script with event listeners
      injectScript('/injected.js', {
        keepInDom: true,
        modifyScript(script) {
          script.addEventListener('detect-response', handleResponse);
        },
      });
    });

    // Wait for initial detection
    cachedResults = await resultsPromise;
    console.log('[WebTelescope] Detection complete:', cachedResults);

    // Notify background script to update badge
    browser.runtime.sendMessage({
      type: 'DETECTION_COMPLETE',
      results: cachedResults,
    });
  },
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_DETECTION_RESULTS') {
    sendResponse(cachedResults);
    return true;
  }
});
