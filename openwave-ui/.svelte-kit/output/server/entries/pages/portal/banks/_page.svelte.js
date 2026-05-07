import { b as stringify, f as ensure_array_like, nt as escape_html, o as attr_class, p as head, u as derived } from "../../../../chunks/index-server.js";
import "../../../../chunks/index-server2.js";
import "../../../../chunks/auth.js";
import "../../../../chunks/client2.js";
//#region src/routes/portal/banks/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let session = null;
		let banks = [];
		const isAdmin = derived(() => session?.role === "ADMIN");
		head("1apja9j", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Banks — OpenWave</title>`);
			});
		});
		$$renderer.push(`<div class="p-8 max-w-4xl mx-auto"><div class="mb-8 flex items-end justify-between"><div><h1 class="text-2xl font-semibold tracking-tight">Banks</h1> <p class="text-white/40 text-sm mt-1">${escape_html(banks.length)} registered member bank${escape_html(banks.length !== 1 ? "s" : "")}</p></div> <div class="flex gap-2"><button class="px-4 py-2 text-[13px] font-medium text-white/40 hover:text-white border border-white/[0.1] rounded-xl transition-all hover:border-white/20">Refresh</button> `);
		if (isAdmin()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="px-4 py-2 text-[13px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all">Register Bank</button>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (banks.length === 0) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="rounded-2xl bg-white/[0.02] border border-white/[0.05] py-16 text-center"><div class="text-4xl mb-3 opacity-20">◻</div> <div class="text-white/30 text-sm">No banks registered yet</div></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden"><div class="grid grid-cols-[40px_1fr_60px_80px_100px] gap-x-4 px-5 py-3 border-b border-white/[0.05] text-[11px] text-white/20 uppercase tracking-wider font-medium"><span></span><span>Bank</span><span>Country</span><span>Status</span><span>Registered</span></div> <div class="divide-y divide-white/[0.04]"><!--[-->`);
			const each_array_2 = ensure_array_like(banks);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let bank = each_array_2[$$index_2];
				$$renderer.push(`<div class="grid grid-cols-[40px_1fr_60px_80px_100px] gap-x-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"><div class="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-[11px] font-bold text-indigo-400">${escape_html(bank.bankHandle?.slice(0, 2).toUpperCase())}</div> <div class="min-w-0"><div class="text-[13px] font-medium text-white truncate">${escape_html(bank.displayName)}</div> <div class="text-[11px] text-white/25 font-mono truncate">${escape_html(bank.bankHandle)} · ${escape_html(bank.coreUrl)}</div></div> <span class="text-[12px] text-white/35">${escape_html(bank.country)}</span> <span${attr_class(`text-[11px] px-2.5 py-1 rounded-full border w-fit ${stringify(bank.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.03] text-white/25 border-white/[0.08]")}`)}>${escape_html(bank.active ? "active" : "inactive")}</span> <span class="text-[11px] text-white/20">${escape_html(bank.registeredAt ? new Date(bank.registeredAt).toLocaleDateString() : "—")}</span></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
