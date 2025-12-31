import { detectAll } from '@/lib/detection';
import type { DetectionResult } from '@/lib/detection';

export interface DetectionResults {
    core: DetectionResult[];
    meta: DetectionResult[];
    styles: DetectionResult[];
}

function runDetection(): DetectionResults {
    return detectAll();
}

export default defineUnlistedScript(() => {
    const script = document.currentScript;

    // Function to dispatch results
    const sendResults = () => {
        const results = runDetection();
        script?.dispatchEvent(
            new CustomEvent<DetectionResults>('detect-response', {
                detail: results,
            })
        );
    };

    // Listen for detection request from content script
    script?.addEventListener('detect-request', sendResults);

    // Wait for page to be fully loaded before detecting
    if (document.readyState === 'complete') {
        // Page already loaded, run detection after a small delay
        // to ensure frameworks have initialized
        setTimeout(sendResults, 100);
    } else {
        // Wait for load event
        window.addEventListener('load', () => {
            // Add small delay to let frameworks fully initialize
            setTimeout(sendResults, 100);
        });
    }
});
