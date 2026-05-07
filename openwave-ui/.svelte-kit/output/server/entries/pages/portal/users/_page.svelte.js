import { _ as slot, et as attr, f as ensure_array_like, g as sanitize_props, nt as escape_html, p as head, u as derived, v as spread_props } from "../../../../chunks/index-server.js";
import "../../../../chunks/index-server2.js";
import "../../../../chunks/toast-state.svelte.js";
import "../../../../chunks/auth.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/building-2.js";
import "../../../../chunks/client2.js";
//#region node_modules/lucide-svelte/dist/icons/user-plus.svelte
function User_plus($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "user-plus" },
		sanitize_props($$props),
		{
			/**
			* @component @name UserPlus
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KICA8bGluZSB4MT0iMTkiIHgyPSIxOSIgeTE9IjgiIHkyPSIxNCIgLz4KICA8bGluZSB4MT0iMjIiIHgyPSIxNiIgeTE9IjExIiB5Mj0iMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user-plus
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
				["line", {
					"x1": "19",
					"x2": "19",
					"y1": "8",
					"y2": "14"
				}],
				["line", {
					"x1": "22",
					"x2": "16",
					"y1": "11",
					"y2": "11"
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
//#region src/routes/portal/users/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let session = null;
		let banks = [];
		let saving = false;
		let form = {
			username: "",
			displayName: "",
			email: "",
			role: "BANK_OPERATOR",
			bankHandle: ""
		};
		const registryRoles = ["REGISTRY_ADMIN", "REGISTRY_OPERATOR"];
		const bankRoles = [
			"BANK_ADMIN",
			"BANK_OPERATOR",
			"BANK_VIEWER"
		];
		const roleLabels = {
			REGISTRY_ADMIN: "Registry Admin",
			REGISTRY_OPERATOR: "Registry Operator",
			BANK_ADMIN: "Bank Admin",
			BANK_OPERATOR: "Bank Operator",
			BANK_VIEWER: "Bank Viewer"
		};
		const visibleRoles = derived(() => session?.role === "ADMIN" ? [...registryRoles, ...bankRoles] : bankRoles);
		head("m648oq", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Portal Users - OpenWave</title>`);
			});
		});
		$$renderer.push(`<div class="p-8 max-w-7xl mx-auto"><div class="flex items-start justify-between gap-6 mb-8"><div><h1 class="text-2xl font-semibold tracking-tight">Portal Users</h1> <p class="text-white/40 text-sm mt-1">Manage username/password access, roles, and bank-scoped privileges.</p></div> <button class="px-4 py-2 rounded-xl border border-white/[0.09] bg-white/[0.035] hover:bg-white/[0.06] text-[13px] text-white/70 transition-all">Refresh</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6"><section class="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 h-fit"><div class="flex items-center gap-3 mb-5"><div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">`);
		User_plus($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----></div> <div><div class="text-sm font-semibold">Create user</div> <div class="text-[12px] text-white/30">Portal access, not API integration access</div></div></div> <div class="space-y-3"><input${attr("value", form.username)} placeholder="username" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"/> <input${attr("value", form.displayName)} placeholder="Display name" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"/> <input${attr("value", form.email)} placeholder="email@example.com" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"/> `);
		$$renderer.select({
			value: form.role,
			class: "w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
		}, ($$renderer) => {
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(visibleRoles());
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let role = each_array[$$index];
				$$renderer.option({ value: role }, ($$renderer) => {
					$$renderer.push(`${escape_html(roleLabels[role])}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` `);
		if (form.role.startsWith("BANK_")) {
			$$renderer.push("<!--[0-->");
			if (session?.role === "ADMIN") {
				$$renderer.push("<!--[0-->");
				$$renderer.select({
					value: form.bankHandle,
					class: "w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500/50"
				}, ($$renderer) => {
					$$renderer.option({ value: "" }, ($$renderer) => {
						$$renderer.push(`Select bank`);
					});
					$$renderer.push(`<!--[-->`);
					const each_array_1 = ensure_array_like(banks);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let bank = each_array_1[$$index_1];
						$$renderer.option({ value: bank.bankHandle }, ($$renderer) => {
							$$renderer.push(`${escape_html(bank.displayName)} (${escape_html(bank.bankHandle)})`);
						});
					}
					$$renderer.push(`<!--]-->`);
				});
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2.5 text-[13px] text-emerald-200">Bank scope: ${escape_html(session?.bankHandle)}</div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button${attr("disabled", saving, true)} class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold transition-all">${escape_html("Create portal user")}</button></div></section> <section class="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"><div class="grid grid-cols-[1.25fr_1fr_1fr_0.7fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30"><span>User</span><span>Role</span><span>Scope</span><span>Status</span><span></span></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="p-10 text-center text-white/30 text-sm">Loading users...</div>`);
		$$renderer.push(`<!--]--></section></div></div>`);
	});
}
//#endregion
export { _page as default };
