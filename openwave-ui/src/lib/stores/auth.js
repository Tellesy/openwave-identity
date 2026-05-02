import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'ow_session';
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function createAuthStore() {
  const initial = loadSession();
  const { subscribe, set, update } = writable(initial);

  function loadSession() {
    if (!isBrowser) return null;
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'); } catch { return null; }
  }

  function saveSession(s) {
    if (!isBrowser) return;
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  }

  return {
    subscribe,
    loginAdmin(adminKey, baseUrl) {
      const s = { role: 'ADMIN', adminKey, baseUrl: baseUrl || 'http://localhost:8095/v1' };
      set(s); saveSession(s);
    },
    loginBank(bankKey, bankHandle, baseUrl) {
      const s = { role: 'BANK', bankKey, bankHandle, baseUrl: baseUrl || 'http://localhost:8095/v1' };
      set(s); saveSession(s);
    },
    logout() { set(null); saveSession(null); },
    get current() { return get({ subscribe }); }
  };
}

export const auth = createAuthStore();
