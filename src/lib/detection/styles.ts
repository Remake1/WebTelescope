/**
 * Styling library detectors
 * Detects: TailwindCSS, MUI, Bootstrap
 */

import type { DetectionResult } from './types';

/**
 * Detect TailwindCSS
 * Checks window global and CSS rules for Tailwind signatures
 */
export function detectTailwind(): DetectionResult {
    const result: DetectionResult = {
        name: 'Tailwind CSS',
        icon: 'tailwindcss',
        detected: false,
    };

    // Check for Tailwind global config injected by JIT
    if ((window as any).__tailwind) {
        result.detected = true;
        return result;
    }

    // Look for Tailwind directives inside loaded stylesheets
    try {
        const hasTailwindCSS = [...document.styleSheets].some(sheet => {
            try {
                return [...(sheet.cssRules || [])].some(
                    rule =>
                        rule.cssText.includes('@tailwind') ||
                        rule.cssText.includes('--tw-') // Tailwind utility variable signature
                );
            } catch (_) {
                // Cross-origin stylesheets throw SecurityError
                return false;
            }
        });

        if (hasTailwindCSS) {
            result.detected = true;
        }
    } catch (_) { }

    return result;
}

/**
 * Detect MUI (Material-UI)
 * Checks DOM classes and CSS rules for Mui signatures
 */
export function detectMUI(): DetectionResult {
    const result: DetectionResult = {
        name: 'MUI',
        icon: 'mui',
        detected: false,
    };

    // Scan DOM for MUI classes
    const hasMUIClass = [...document.querySelectorAll('[class]')].some(el =>
        [...el.classList].some(c => c.startsWith('Mui'))
    );

    if (hasMUIClass) {
        result.detected = true;
        return result;
    }

    // Fallback – scan loaded CSS rules for Mui*
    try {
        const hasMUIRules = [...document.styleSheets].some(sheet => {
            try {
                return [...(sheet.cssRules || [])].some(rule =>
                    (rule as CSSStyleRule).selectorText?.startsWith('.Mui')
                );
            } catch (_) {
                return false;
            }
        });

        if (hasMUIRules) {
            result.detected = true;
        }
    } catch (_) { }

    return result;
}

/**
 * Detect Bootstrap
 * Checks script/link URLs and window global
 */
export function detectBootstrap(): DetectionResult {
    const result: DetectionResult = {
        name: 'Bootstrap',
        icon: 'bootstrap',
        detected: false,
    };

    // Detect link/script URLs
    const scripts = [...document.scripts].map(s => s.src);
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
        l => (l as HTMLLinkElement).href
    );

    const hasFile = [...scripts, ...links].some(
        src => src && src.toLowerCase().includes('bootstrap')
    );

    if (hasFile) {
        result.detected = true;
        return result;
    }

    // Detect JS global (Bootstrap v5 only)
    if ((window as any).bootstrap) {
        result.detected = true;
    }

    return result;
}

/**
 * Run all styling library detectors
 */
export function detectAllStyles(): DetectionResult[] {
    return [detectTailwind(), detectMUI(), detectBootstrap()];
}
