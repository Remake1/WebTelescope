/**
 * Core framework detectors
 * Detects: React, Vue, Angular, Svelte, jQuery
 */

import type { DetectionResult } from './types';

/**
 * Detect React framework
 * Checks DevTools hook, DOM keys, and React root containers
 */
export function detectReact(): DetectionResult {
    const result: DetectionResult = {
        name: 'React',
        icon: 'react',
        detected: false,
    };

    // Check DevTools hook (most reliable for version)
    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook?.renderers) {
        const renderers = [...hook.renderers.values()];
        if (renderers.length > 0) {
            result.detected = true;
            const renderer = renderers[0];
            result.version = renderer.version || renderer.reconcilerVersion;
            return result;
        }
    }

    // Check for React in document keys
    const hasReactKeys = Object.keys(document).some(key => key.includes('react'));
    if (hasReactKeys) {
        result.detected = true;
        return result;
    }

    // Check for React root containers
    const hasReactRoot = Array.from(document.body.querySelectorAll('*')).some(
        (node: any) => node._reactRootContainer
    );
    if (hasReactRoot) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect Vue framework
 * Checks window globals, DOM properties, and DevTools hook
 */
export function detectVue(): DetectionResult {
    const result: DetectionResult = {
        name: 'Vue',
        icon: 'vue',
        detected: false,
    };

    const w = window as any;

    // Check for Vue 2 global
    if (w.Vue?.version) {
        result.detected = true;
        result.version = w.Vue.version;
        return result;
    }

    // Check for Vue 3 global marker
    if (w.__VUE__) {
        result.detected = true;
    }

    // Scan DOM for Vue instances
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
        const element = el as any;

        // Vue 2 attaches to __vue__
        if (element.__vue__) {
            result.detected = true;
            result.version = element.__vue__.$options?._base?.version || '2.x';
            return result;
        }

        // Vue 3 attaches to __vue_app__
        if (element.__vue_app__) {
            result.detected = true;
            result.version = element.__vue_app__.version;
            return result;
        }
    }

    // Check DevTools hook
    if (!result.version && w.__VUE_DEVTOOLS_GLOBAL_HOOK__?.renderers?.length > 0) {
        result.detected = true;
        result.version = w.__VUE_DEVTOOLS_GLOBAL_HOOK__.renderers[0].version;
    }

    return result;
}

/**
 * Detect Angular framework
 * Checks window globals and ng-version attributes
 */
export function detectAngular(): DetectionResult {
    const result: DetectionResult = {
        name: 'Angular',
        icon: 'angular',
        detected: false,
    };

    const w = window as any;

    // Check for AngularJS (1.x)
    if (w.angular?.version) {
        result.detected = true;
        result.version = w.angular.version.full;
        return result;
    }

    // Check for Angular 2+ via ng-version attribute
    const ngVersionElement =
        document.querySelector('[ng-version]') ||
        document.querySelector('[data-ng-version]');

    if (ngVersionElement) {
        result.detected = true;
        result.version =
            ngVersionElement.getAttribute('ng-version') ||
            ngVersionElement.getAttribute('data-ng-version') ||
            undefined;
        return result;
    }

    // Additional heuristic detection
    const isAngularApp = !!document.querySelector('[ng-app], [data-ng-app], [ng-controller]');
    if (isAngularApp) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect Svelte framework
 * Checks class patterns, SvelteKit attributes, and DOM markers
 */
export function detectSvelte(): DetectionResult {
    const result: DetectionResult = {
        name: 'Svelte',
        icon: 'svelte',
        detected: false,
    };

    const hasAttr = (selector: string) => document.querySelector(selector) !== null;

    // Detect SvelteKit via body/hydrate attributes
    if (
        hasAttr('[data-sveltekit-preload-data]') ||
        hasAttr('[data-sveltekit-hydrate]') ||
        hasAttr('[data-sveltekit-fallback]')
    ) {
        result.detected = true;
        return result;
    }

    // Detect compiled class names (svelte-*)
    const elements = [...document.querySelectorAll('[class]')];
    for (const el of elements) {
        let classList: string[] = [];

        if (el.classList?.length) {
            classList = [...el.classList];
        } else if (typeof el.className === 'string') {
            classList = el.className.split(/\s+/);
        } else if ((el.className as any)?.baseVal) {
            classList = (el.className as any).baseVal.split(/\s+/);
        }

        if (classList.some(c => /^svelte-/.test(c))) {
            result.detected = true;
            return result;
        }
    }

    // Detect DOM hydration markers
    if (hasAttr('[data-svelte-h]') || hasAttr('[data-svelte]')) {
        result.detected = true;
    }

    return result;
}

/**
 * Detect jQuery library
 * Checks window globals and script sources
 */
export function detectJQuery(): DetectionResult {
    const result: DetectionResult = {
        name: 'jQuery',
        icon: 'jquery',
        detected: false,
    };

    const w = window as any;

    // Check common globals
    const jq = w.jQuery || w.$;
    if (jq?.fn?.jquery) {
        result.detected = true;
        result.version = jq.fn.jquery;
        return result;
    }

    // Detect noConflict jQuery (hidden versions)
    for (const key in w) {
        try {
            const obj = w[key];
            if (obj?.fn?.jquery) {
                result.detected = true;
                result.version = obj.fn.jquery;
                return result;
            }
        } catch (_) { }
    }

    // Detect jQuery usage in script filenames
    const scripts = [...document.scripts].map(s => s.src);
    if (scripts.some(src => /jquery/i.test(src))) {
        result.detected = true;
    }

    return result;
}

/**
 * Run all core framework detectors
 */
export function detectAllCore(): DetectionResult[] {
    return [
        detectReact(),
        detectVue(),
        detectAngular(),
        detectSvelte(),
        detectJQuery(),
    ];
}
