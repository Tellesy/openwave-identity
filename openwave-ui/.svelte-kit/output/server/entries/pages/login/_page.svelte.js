import { b as stringify, et as attr, f as ensure_array_like, n as onDestroy, nt as escape_html, o as attr_class, p as head } from "../../../chunks/index-server.js";
import "../../../chunks/index-server2.js";
import { t as theme } from "../../../chunks/theme.js";
import "../../../chunks/client.js";
import "../../../chunks/navigation.js";
import { n as configuredRegistryUrl } from "../../../chunks/auth.js";
import { n as Moon, t as Sun } from "../../../chunks/sun.js";
import "axios";
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		configuredRegistryUrl();
		let username = "";
		let password = "";
		let mode = "admin";
		let currentTheme = "light";
		onDestroy(theme.subscribe((t) => currentTheme = t));
		head("1x05zx6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Sign In - OpenWave Identity Registry</title>`);
			});
		});
		$$renderer.push(`<div class="ow-theme-root min-h-screen bg-[#050508] flex relative overflow-hidden"${attr("data-theme", currentTheme)} style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;"><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/[0.04] blur-[140px] pointer-events-none"></div> <div class="hidden lg:flex flex-col w-[440px] shrink-0 border-r border-white/[0.06] p-12 justify-between relative"><div class="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-violet-950/20 pointer-events-none"></div> <div class="ow-logo-lockup relative"><div class="ow-logo-mark"><span>OW</span></div> <div><div class="ow-logo-word">OW Identity</div> <div class="ow-logo-sub">NPT handle registry</div></div></div> <div class="relative"><h2 class="text-3xl font-semibold text-white leading-tight tracking-tight">Global NPT Identity<br/>Registry</h2> <p class="mt-4 text-white/40 text-[14px] leading-relaxed">Manage NPT handle ownership, bank enrollment, and cross-gateway alias resolution for the OpenWave payment protocol.</p> <div class="mt-8 space-y-2.5"><!--[-->`);
		const each_array = ensure_array_like([
			{
				label: "Bank-vouched identity claims",
				color: "indigo"
			},
			{
				label: "Multi-IBAN per handle",
				color: "violet"
			},
			{
				label: "Public alias resolution",
				color: "emerald"
			},
			{
				label: "Cross-gateway federation",
				color: "sky"
			}
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<div class="flex items-center gap-3"><div${attr_class(`w-1.5 h-1.5 rounded-full bg-${stringify(f.color)}-400/60`)}></div> <span class="text-[13px] text-white/40">${escape_html(f.label)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="text-[11px] text-white/20 relative">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Neptune Fintech · OpenWave v1.0</div></div> <div class="flex-1 flex items-center justify-center p-8"><div class="w-full max-w-[380px]"><div class="lg:hidden ow-logo-lockup mb-10"><div class="ow-logo-mark"><span>OW</span></div> <div><div class="ow-logo-word">OW Identity</div> <div class="ow-logo-sub">NPT handle registry</div></div></div> <div class="mb-8"><div class="flex items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold text-white tracking-tight">Sign in</h1> <p class="text-white/40 text-[13px] mt-1">Use your portal username and password</p></div> <button class="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-white/60 hover:text-white flex items-center justify-center transition-all" title="Toggle theme">`);
		if (currentTheme === "dark") {
			$$renderer.push("<!--[0-->");
			Sun($$renderer, { class: "w-4 h-4" });
		} else {
			$$renderer.push("<!--[-1-->");
			Moon($$renderer, { class: "w-4 h-4" });
		}
		$$renderer.push(`<!--]--></button></div></div> <div class="flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1 mb-6"><button${attr_class(`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${stringify(mode === "admin" ? "bg-indigo-600 text-white shadow-sm" : "text-white/40 hover:text-white/70")}`)}>Registry Admin</button> <button${attr_class(`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all ${stringify(mode === "bank" ? "bg-emerald-600 text-white shadow-sm" : "text-white/40 hover:text-white/70")}`)}>Bank Portal</button></div> <div class="space-y-4"><div><label class="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Username</label> <input${attr("value", username)} class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"${attr("placeholder", mode === "admin" ? "ow_admin" : "andalus_admin")} autofocus=""/></div> <div><label class="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Password</label> <input type="password"${attr("value", password)} class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all" placeholder="Portal password"/> <p class="text-[11px] text-white/25 mt-1.5">System API keys remain available for integrations, but portal access uses user credentials.</p></div> <button${attr("disabled", !username.trim(), true)}${attr_class(`w-full py-3 text-[14px] font-semibold text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-2 ${stringify(mode === "admin" ? "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.3)]" : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]")}`)}>`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`Connect to Registry`);
		$$renderer.push(`<!--]--></button></div> <div class="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">`);
		if (mode === "admin") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-[11px] text-white/30 leading-relaxed"><span class="text-indigo-400 font-medium">Admin access</span> - full registry control: register banks, manage identities, view all accounts, delete handles.</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="text-[11px] text-white/30 leading-relaxed"><span class="text-emerald-400 font-medium">Bank access</span> - scoped to your bank: claim handles for customers, link/unlink IBANs, manage your bank's accounts.</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.015]"><button class="w-full flex items-center justify-between px-4 py-3 text-[11px] text-white/30 hover:text-white/50 transition-colors"><span>Registry endpoint</span> <span class="font-mono">${escape_html("Advanced")}</span></button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}
//#endregion
export { _page as default };
