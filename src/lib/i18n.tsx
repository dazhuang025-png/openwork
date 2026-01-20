
import { createSignal, createMemo, createEffect } from "solid-js";

// -- Types --

export type Locale = "en" | "zh-CN";

export type Dictionary = Record<string, string>;

// -- State --

const STORAGE_KEY = "openwork.locale";

// Helper to read initial locale safely
const getInitialLocale = (): Locale => {
    if (typeof window !== "undefined") {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored === "en" || stored === "zh-CN") {
                return stored;
            }
            // Default to Chinese as requested
            return "zh-CN";
        } catch {
            // ignore
        }
    }
    return "zh-CN";
};

const [locale, _setLocale] = createSignal<Locale>(getInitialLocale());
const [dict, setDict] = createSignal<Dictionary>({});

export const currentLocale = locale;

export const setLocale = (l: Locale) => {
    _setLocale(l);
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, l);
    }
};

// -- Dictionaries --

// We will load these asynchronously or just bundle them if small. 
// For this MVP, we bundle them to ensure simplicity and speed.
import en from "../locales/en";
import zhCN from "../locales/zh-CN";

createEffect(() => {
    const l = locale();
    if (l === "zh-CN") {
        setDict(zhCN);
    } else {
        setDict(en);
    }
});

// -- Hook / Helper --

export const t = (key: string, fallback?: string): string => {
    const d = dict();
    return d[key] || fallback || key;
};

// Reactive helper for usage in JSX
export function useI18n() {
    return {
        t: (key: string, fallback?: string) => t(key, fallback),
        locale: locale,
        setLocale: setLocale,
    };
}
