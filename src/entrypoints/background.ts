import type { DetectionResults } from './injected';

// Map of core framework names to their badge letters
const coreBadgeMap: Record<string, string> = {
  'React': 'R',
  'Vue': 'V',
  'Angular': 'A',
  'Svelte': 'S',
  'jQuery': 'j',
};

// Map of core framework names to their badge colors
const coreColorMap: Record<string, string> = {
  'React': '#61dafb',    // React blue
  'Vue': '#42b883',      // Vue green
  'Angular': '#dd0031',  // Angular red
  'Svelte': '#ff3e00',   // Svelte orange
  'jQuery': '#6b7280',   // Grey
};

// Get the action API (browser.action for MV3, browser.browserAction for MV2/Firefox)
function getActionAPI() {
  // @ts-ignore - browserAction exists in Firefox/MV2
  return browser.action || browser.browserAction;
}

// Set badge based on detection results
async function updateBadge(tabId: number, results: DetectionResults | null) {
  const action = getActionAPI();

  if (!results) {
    await action.setBadgeText({ tabId, text: '' });
    return;
  }

  // Find first detected core framework
  const detectedCore = results.core.find(r => r.detected);

  if (detectedCore) {
    const badgeText = coreBadgeMap[detectedCore.name] || detectedCore.name.charAt(0).toUpperCase();
    const badgeColor = coreColorMap[detectedCore.name] || '#3b82f6';

    await action.setBadgeText({ tabId, text: badgeText });
    await action.setBadgeBackgroundColor({ tabId, color: badgeColor });

    // setBadgeTextColor is not supported in Firefox, so wrap in try-catch
    try {
      if (action.setBadgeTextColor) {
        await action.setBadgeTextColor({ tabId, color: '#ffffff' });
      }
    } catch (_) {
      // Firefox doesn't support setBadgeTextColor
    }
  } else {
    await action.setBadgeText({ tabId, text: '' });
  }
}

export default defineBackground(() => {
  const action = getActionAPI();

  // Listen for detection results from content script
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'DETECTION_COMPLETE' && sender.tab?.id) {
      updateBadge(sender.tab.id, message.results);
    }
  });

  // Clear badge when navigating to a new page
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      action.setBadgeText({ tabId, text: '' });
    }
  });
});
