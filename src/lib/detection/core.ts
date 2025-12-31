/**
 * Core framework detectors
 * Detects: React, Vue, Angular, Svelte, jQuery
 */

import type { DetectionResult } from './types';

/**
 * Detect React framework
 * Checks DevTools hook, DOM keys, React root containers, and internal fiber
 */
export function detectReact(): DetectionResult {
    const result: DetectionResult = {
        name: 'React',
        icon: 'react',
        detected: false,
    };

    const w = window as any;

    // Check DevTools hook (most reliable for version)
    const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook?.renderers) {
        const renderers = [...hook.renderers.values()];
        if (renderers.length > 0) {
            result.detected = true;
            const renderer = renderers[0];
            result.version = renderer.version || renderer.reconcilerVersion;
            return result;
        }
    }

    // Check for React internal fiber properties on DOM elements
    const rootElement = document.getElementById('root') || document.getElementById('__next') || document.body.firstElementChild;
    if (rootElement) {
        const keys = Object.keys(rootElement);
        const reactKey = keys.find(key =>
            key.startsWith('__reactFiber$') ||
            key.startsWith('__reactInternalInstance$') ||
            key.startsWith('__reactContainer$')
        );
        if (reactKey) {
            result.detected = true;
            return result;
        }
    }

    // Check for React root containers
    const allElements = document.querySelectorAll('*');
    for (const node of allElements) {
        const nodeAny = node as any;
        if (nodeAny._reactRootContainer) {
            result.detected = true;
            return result;
        }
        // Check for React 18+ root
        const keys = Object.keys(node);
        if (keys.some(k => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'))) {
            result.detected = true;
            return result;
        }
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

    // Check for Vue 3 global marker (most common for Vue 3)
    if (w.__VUE__) {
        result.detected = true;
        // Try to get version from app instance
    }

    // Check for Vue 2 global
    if (w.Vue?.version) {
        result.detected = true;
        result.version = w.Vue.version;
        return result;
    }

    // Scan DOM for Vue instances
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
        const element = el as any;

        // Vue 3 attaches to __vue_app__ on the app root
        if (element.__vue_app__) {
            result.detected = true;
            result.version = element.__vue_app__.version;
            return result;
        }

        // Vue 2 attaches to __vue__
        if (element.__vue__) {
            result.detected = true;
            result.version = element.__vue__.$options?._base?.version || '2.x';
            return result;
        }
    }

    // Check DevTools hook for Vue
    const vueHook = w.__VUE_DEVTOOLS_GLOBAL_HOOK__;
    if (vueHook) {
        // Vue 3 apps array
        if (vueHook.apps?.length > 0) {
            result.detected = true;
            result.version = vueHook.apps[0]?.version;
            return result;
        }
        // Vue 2 renderers
        if (vueHook.Vue?.version) {
            result.detected = true;
            result.version = vueHook.Vue.version;
            return result;
        }
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
