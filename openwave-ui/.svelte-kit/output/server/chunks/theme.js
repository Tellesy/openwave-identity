import { V as writable, z as get } from "./index-server.js";
import "./index-server2.js";
//#region src/lib/stores/theme.js
var STORAGE_KEY = "ow_identity_theme";
var isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";
function systemTheme() {
	if (!isBrowser) return "light";
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(value) {
	const theme = value === "dark" ? "dark" : "light";
	if (isBrowser) {
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem(STORAGE_KEY, theme);
	}
	return theme;
}
function createThemeStore() {
	const initial = isBrowser ? localStorage.getItem(STORAGE_KEY) || systemTheme() : "light";
	const { subscribe, set } = writable(initial);
	return {
		subscribe,
		init() {
			set(applyTheme(isBrowser ? localStorage.getItem(STORAGE_KEY) || systemTheme() : initial));
		},
		toggle() {
			set(applyTheme(get({ subscribe }) === "dark" ? "light" : "dark"));
		},
		set(value) {
			set(applyTheme(value));
		}
	};
}
var theme = createThemeStore();
//#endregion
export { theme as t };
