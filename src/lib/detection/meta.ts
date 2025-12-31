/**
 * Meta framework detectors
 * Detects: Next.js, Nuxt, Astro, VitePress, Gatsby
 */

import type { DetectionResult } from './types';

/**
 * Detect Next.js framework
 * Checks window.next global and DOM markers
 */
export function detectNext(): DetectionResult {
    const result: DetectionResult = {
        name: 'Next.js',
        icon: 'nextjs',
        detected: false,
    };

    const w = window as any;

    // Fast detect via global
    if (w.next && typeof w.next === 'object') {
        result.detected = true;
        result.version = w.next.version || undefined;
        return result;
    }

    // Fallback to DOM detection
    const isNext =
        document.getElementById('__NEXT_DATA__') ||
        document.getElementById('__next');

    if (isNext) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect Nuxt framework
 * Checks window.__NUXT__ and DOM markers
 */
export function detectNuxt(): DetectionResult {
    const result: DetectionResult = {
        name: 'Nuxt',
        icon: 'nuxt',
        detected: false,
    };

    const w = window as any;

    // Nuxt 2 global payload
    if (w.__NUXT__) {
        result.detected = true;
        result.version =
            w.__NUXT__.version ||
            w.__NUXT__?.state?.nuxtVersion ||
            w.__NUXT__.nuxtVersion ||
            undefined;
        return result;
    }

    // Nuxt 3 DOM markers
    const isNuxt3 =
        document.querySelector('[data-nuxt-app]') ||
        document.getElementById('__nuxt');

    if (isNuxt3) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect Astro framework
 * Checks astro-island elements and script markers
 */
export function detectAstro(): DetectionResult {
    const result: DetectionResult = {
        name: 'Astro',
        icon: 'astro',
        detected: false,
    };

    // DOM hydration markers (Astro islands)
    if (document.querySelector('[astro-island],astro-island')) {
        result.detected = true;
        return result;
    }

    // Astro client loaders on scripts
    const hasAstroScripts = [...document.scripts].some(
        s => s.type?.startsWith('astro') || /astro\./.test(s.src)
    );
    if (hasAstroScripts) {
        result.detected = true;
        return result;
    }

    // Static build pattern
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('data-astro')) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect VitePress framework
 * Checks window.__VP_SITE_DATA__
 */
export function detectVitePress(): DetectionResult {
    const result: DetectionResult = {
        name: 'VitePress',
        icon: 'vitejs',
        detected: false,
    };

    const vp = (window as any).__VP_SITE_DATA__;
    if (vp && typeof vp === 'object') {
        result.detected = true;
        result.version = vp.version || undefined;
    }

    return result;
}

/**
 * Detect Gatsby framework
 * Checks window.___gatsby and DOM markers
 */
export function detectGatsby(): DetectionResult {
    const result: DetectionResult = {
        name: 'Gatsby',
        icon: 'gatsby',
        detected: false,
    };

    const w = window as any;

    // Global runtime Gatsby object
    if (w.___gatsby) {
        result.detected = true;
        result.version =
            w.___gatsby?.version ||
            w.___gatsby?.buildVersion ||
            w.___gatsby?.siteVersion ||
            undefined;
        return result;
    }

    // DOM markers
    const isGatsby =
        document.getElementById('gatsby-focus-wrapper') ||
        document.getElementById('___gatsby');

    if (isGatsby) {
        result.detected = true;
        return result;
    }

    // Script filename fallback
    const scripts = [...document.scripts].map(s => s.src);
    if (scripts.some(src => /gatsby/i.test(src))) {
        result.detected = true;
    }

    return result;
}

/**
 * Run all meta framework detectors
 */
export function detectAllMeta(): DetectionResult[] {
    return [
        detectNext(),
        detectNuxt(),
        detectAstro(),
        detectVitePress(),
        detectGatsby(),
    ];
}
