import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'ow_identity_theme';
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function systemTheme() {
  if (!isBrowser) return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(value) {
  const theme = value === 'dark' ? 'dark' : 'light';
  if (isBrowser) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }
  return theme;
}

function createThemeStore() {
  const initial = isBrowser ? (localStorage.getItem(STORAGE_KEY) || systemTheme()) : 'light';
  const { subscribe, set } = writable(initial);

  return {
    subscribe,
    init() {
      const next = applyTheme(isBrowser ? (localStorage.getItem(STORAGE_KEY) || systemTheme()) : initial);
      set(next);
    },
    toggle() {
      const next = get({ subscribe }) === 'dark' ? 'light' : 'dark';
      set(applyTheme(next));
    },
    set(value) {
      set(applyTheme(value));
    }
  };
}

export const theme = createThemeStore();
