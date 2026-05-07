import { _ as slot, et as attr, g as sanitize_props, n as onDestroy, u as derived, v as spread_props, x as unsubscribe_stores } from "../../../chunks/index-server.js";
import "../../../chunks/index-server2.js";
import { t as theme } from "../../../chunks/theme.js";
import "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import { t as auth } from "../../../chunks/auth.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Building_2 } from "../../../chunks/building-2.js";
import "../../../chunks/sun.js";
//#endregion
//#region node_modules/lucide-svelte/dist/icons/layout-dashboard.svelte
function Layout_dashboard($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "layout-dashboard" },
		sanitize_props($$props),
		{
			/**
			* @component @name LayoutDashboard
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI5IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxNCIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMTQiIHk9IjEyIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIxNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-dashboard
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["rect", {
					"width": "7",
					"height": "9",
					"x": "3",
					"y": "3",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "5",
					"x": "14",
					"y": "3",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "9",
					"x": "14",
					"y": "12",
					"rx": "1"
				}],
				["rect", {
					"width": "7",
					"height": "5",
					"x": "3",
					"y": "16",
					"rx": "1"
				}]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/users.svelte
function Users($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "users" },
		sanitize_props($$props),
		{
			/**
			* @component @name Users
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KICA8cGF0aCBkPSJNMjIgMjF2LTJhNCA0IDAgMCAwLTMtMy44NyIgLz4KICA8cGF0aCBkPSJNMTYgMy4xM2E0IDQgMCAwIDEgMCA3Ljc1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/users
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
				["circle", {
					"cx": "9",
					"cy": "7",
					"r": "4"
				}],
				["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }],
				["path", { "d": "M16 3.13a4 4 0 0 1 0 7.75" }]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/settings.svelte
function Settings($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "settings" },
		sanitize_props($$props),
		{
			/**
			* @component @name Settings
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/settings
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }], ["circle", {
				"cx": "12",
				"cy": "12",
				"r": "3"
			}]],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region node_modules/lucide-svelte/dist/icons/user-cog.svelte
function User_cog($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "user-cog" },
		sanitize_props($$props),
		{
			/**
			* @component @name UserCog
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjE1IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMCAxNUg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8cGF0aCBkPSJtMjEuNyAxNi40LS45LS4zIiAvPgogIDxwYXRoIGQ9Im0xNS4yIDEzLjktLjktLjMiIC8+CiAgPHBhdGggZD0ibTE2LjYgMTguNy4zLS45IiAvPgogIDxwYXRoIGQ9Im0xOS4xIDEyLjIuMy0uOSIgLz4KICA8cGF0aCBkPSJtMTkuNiAxOC43LS40LTEiIC8+CiAgPHBhdGggZD0ibTE2LjggMTIuMy0uNC0xIiAvPgogIDxwYXRoIGQ9Im0xNC4zIDE2LjYgMS0uNCIgLz4KICA8cGF0aCBkPSJtMjAuNyAxMy44IDEtLjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user-cog
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["circle", {
					"cx": "18",
					"cy": "15",
					"r": "3"
				}],
				["circle", {
					"cx": "9",
					"cy": "7",
					"r": "4"
				}],
				["path", { "d": "M10 15H6a4 4 0 0 0-4 4v2" }],
				["path", { "d": "m21.7 16.4-.9-.3" }],
				["path", { "d": "m15.2 13.9-.9-.3" }],
				["path", { "d": "m16.6 18.7.3-.9" }],
				["path", { "d": "m19.1 12.2.3-.9" }],
				["path", { "d": "m19.6 18.7-.4-1" }],
				["path", { "d": "m16.8 12.3-.4-1" }],
				["path", { "d": "m14.3 16.6 1-.4" }],
				["path", { "d": "m20.7 13.8 1-.4" }]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/routes/portal/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		let { children } = $$props;
		let session = null;
		let currentTheme = "light";
		const unsub = auth.subscribe((s) => session = s);
		const unsubTheme = theme.subscribe((t) => currentTheme = t);
		onDestroy(() => {
			unsub();
			unsubTheme();
		});
		const allNav = [
			{
				href: "/portal",
				label: "Dashboard",
				icon: Layout_dashboard,
				exact: true,
				roles: ["ADMIN", "BANK"]
			},
			{
				href: "/portal/identity",
				label: "Identity",
				icon: Users,
				exact: false,
				roles: ["ADMIN", "BANK"]
			},
			{
				href: "/portal/banks",
				label: "Banks",
				icon: Building_2,
				exact: false,
				roles: ["ADMIN", "BANK"]
			},
			{
				href: "/portal/users",
				label: "Users",
				icon: User_cog,
				exact: false,
				roles: ["ADMIN", "BANK"]
			},
			{
				href: "/portal/manage",
				label: "Manage",
				icon: Settings,
				exact: false,
				roles: ["ADMIN"]
			}
		];
		derived(() => allNav.filter((n) => !session?.role || n.roles.includes(session.role)));
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="ow-theme-root min-h-screen bg-[#050508] flex items-center justify-center"${attr("data-theme", currentTheme)}><div class="w-6 h-6 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin"></div></div>`);
		$$renderer.push(`<!--]-->`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
export { _layout as default };
