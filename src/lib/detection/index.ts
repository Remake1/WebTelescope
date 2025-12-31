/**
 * WebTelescope Detection Library
 * Detects web technologies: Core frameworks, Meta frameworks, and Styling libraries
 */

// Re-export types
export type { DetectionResult, Detector } from './types';

// Core framework detectors
export {
    detectReact,
    detectVue,
    detectAngular,
    detectSvelte,
    detectJQuery,
    detectAllCore,
} from './core';

// Meta framework detectors
export {
    detectNext,
    detectNuxt,
    detectAstro,
    detectVitePress,
    detectGatsby,
    detectAllMeta,
} from './meta';

// Styling library detectors
export {
    detectTailwind,
    detectMUI,
    detectBootstrap,
    detectAllStyles,
} from './styles';

// Import for aggregate function
import type { DetectionResult } from './types';
import { detectAllCore } from './core';
import { detectAllMeta } from './meta';
import { detectAllStyles } from './styles';

/**
 * Run all detectors and return categorized results
 */
export function detectAll(): {
    core: DetectionResult[];
    meta: DetectionResult[];
    styles: DetectionResult[];
} {
    return {
        core: detectAllCore(),
        meta: detectAllMeta(),
        styles: detectAllStyles(),
    };
}

/**
 * Run all detectors and return only detected technologies
 */
export function detectAllFiltered(): {
    core: DetectionResult[];
    meta: DetectionResult[];
    styles: DetectionResult[];
} {
    return {
        core: detectAllCore().filter(r => r.detected),
        meta: detectAllMeta().filter(r => r.detected),
        styles: detectAllStyles().filter(r => r.detected),
    };
}
