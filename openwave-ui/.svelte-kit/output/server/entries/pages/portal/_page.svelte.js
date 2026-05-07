import { et as attr, f as ensure_array_like, nt as escape_html, p as head } from "../../../chunks/index-server.js";
import "../../../chunks/index-server2.js";
import "../../../chunks/auth.js";
import "../../../chunks/client2.js";
//#region src/routes/portal/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let searchQ = "";
		head("8l8a07", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Dashboard — OpenWave Identity</title>`);
			});
		});
		$$renderer.push(`<div class="p-8 max-w-4xl mx-auto"><div class="mb-8"><h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1> <p class="text-white/40 text-sm mt-1">OpenWave Identity Registry — global overview</p></div> `);
		{
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="grid grid-cols-3 gap-4 mb-8"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(6));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				each_array_1[$$index_1];
				$$renderer.push(`<div class="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="text-sm font-semibold mb-1">Resolve NPT Handle</div> <div class="text-[12px] text-white/30 mb-4">Public lookup — resolves alias to IBAN</div> <div class="flex gap-2"><input${attr("value", searchQ)} placeholder="mtellesy  or  mtellesy@andalus" class="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/> <button${attr("disabled", !searchQ.trim(), true)} class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-sm font-semibold rounded-xl transition-all">${escape_html("Resolve")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
