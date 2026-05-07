import { et as attr, p as head } from "../../../../chunks/index-server.js";
import "../../../../chunks/index-server2.js";
import "../../../../chunks/client.js";
import "../../../../chunks/navigation.js";
import "../../../../chunks/auth.js";
import "../../../../chunks/client2.js";
//#region src/routes/portal/manage/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let delHandle = "";
		head("4uanyj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Manage — OpenWave</title>`);
			});
		});
		$$renderer.push(`<div class="p-8 max-w-4xl mx-auto"><div class="mb-8"><h1 class="text-2xl font-semibold tracking-tight">Manage</h1> <p class="text-white/40 text-sm mt-1">Administrative operations — handle with care</p></div> <div class="rounded-2xl bg-white/[0.02] border border-red-500/10 p-6"><div class="flex items-start gap-4 mb-6"><div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 text-sm font-bold">!</div> <div><div class="text-sm font-semibold">Danger Zone</div> <div class="text-[12px] text-white/30 mt-0.5">These operations are irreversible. Proceed with caution.</div></div></div> <div class="border-t border-white/[0.06] pt-5"><div class="flex items-start justify-between"><div><div class="text-[13px] font-medium">Delete Identity</div> <div class="text-[12px] text-white/30 mt-0.5">Permanently removes a handle and all linked accounts</div></div> <div class="flex gap-2 items-center"><input${attr("value", delHandle)} placeholder="NPT handle" class="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all w-44"/> <button${attr("disabled", true, true)} class="px-4 py-2 bg-red-600/70 hover:bg-red-600 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">Delete</button></div></div></div></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
