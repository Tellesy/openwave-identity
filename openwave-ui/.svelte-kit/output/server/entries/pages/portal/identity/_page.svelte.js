import { b as stringify, et as attr, f as ensure_array_like, nt as escape_html, o as attr_class, p as head, u as derived } from "../../../../chunks/index-server.js";
import "../../../../chunks/index-server2.js";
import "../../../../chunks/auth.js";
import "../../../../chunks/client2.js";
//#region src/routes/portal/identity/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let session = null;
		let banks = [];
		let enroll = {
			nptHandle: "",
			iban: "",
			customerDisplayName: "",
			bankCustomerRef: "",
			setAsDefault: true
		};
		let linkHandle = "";
		let linkIban = "";
		let linkDefault = false;
		let unlinkHandle = "";
		let unlinkIban = "";
		let defHandle = "";
		let defIban = "";
		let defBankHandle = "";
		let defBankSelected = "";
		const isBank = derived(() => session?.role === "BANK");
		head("uqsks6", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Identity — OpenWave</title>`);
			});
		});
		$$renderer.push(`<div class="p-8 max-w-4xl mx-auto space-y-5"><div class="mb-8"><h1 class="text-2xl font-semibold tracking-tight">Identity</h1> <p class="text-white/40 text-sm mt-1">`);
		if (isBank()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`Claim handles and manage your bank's linked accounts`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`Manage all identity handles and linked accounts`);
		}
		$$renderer.push(`<!--]--></p></div> <section class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="flex items-start justify-between mb-5"><div><div class="text-sm font-semibold">Claim NPT Handle</div> <div class="text-[12px] text-white/30 mt-0.5">Bank vouches for the customer's identity</div></div> <div${attr_class(`px-2.5 py-1 rounded-lg border text-[11px] ${stringify(isBank() ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400")}`)}>${escape_html(isBank() ? "Bank Access Active" : "Admin Mode")}</div></div> <div class="grid grid-cols-2 gap-3"><!--[-->`);
		const each_array = ensure_array_like([
			[
				"nptHandle",
				"NPT Handle",
				"e.g. mtellesy"
			],
			[
				"customerDisplayName",
				"Display Name",
				"Full name"
			],
			[
				"iban",
				"IBAN",
				"LY83002700…"
			],
			[
				"bankCustomerRef",
				"Customer Ref",
				"Internal bank ID"
			]
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [field, label, ph] = each_array[$$index];
			$$renderer.push(`<div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">${escape_html(label)}</label> <input${attr("value", enroll[field])}${attr("placeholder", ph)} class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div>`);
		}
		$$renderer.push(`<!--]--> <div class="col-span-2 flex items-center gap-2.5"><input type="checkbox"${attr("checked", enroll.setAsDefault, true)} id="sd" class="w-4 h-4 accent-indigo-500"/> <label for="sd" class="text-[13px] text-white/40">Set as default bank for this handle</label></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button${attr("disabled", !enroll.nptHandle || !enroll.iban, true)} class="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">${escape_html("Claim Handle")}</button></section> <section class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="text-sm font-semibold mb-1">Link Additional IBAN</div> <div class="text-[12px] text-white/30 mb-4">Add another account to an existing identity</div> <div class="grid grid-cols-3 gap-3 items-end"><div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">NPT Handle</label> <input${attr("value", linkHandle)} placeholder="mtellesy" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div> <div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">IBAN</label> <input${attr("value", linkIban)} placeholder="LY92010500…" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div> <div class="space-y-2"><div class="flex items-center gap-2"><input type="checkbox"${attr("checked", linkDefault, true)} id="ld" class="w-4 h-4 accent-indigo-500"/> <label for="ld" class="text-[12px] text-white/35">Set as default</label></div> <button${attr("disabled", true, true)} class="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">${escape_html("Link IBAN")}</button></div></div></section> <section class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="text-sm font-semibold mb-1">Unlink IBAN</div> <div class="text-[12px] text-white/30 mb-4">Remove an account from an identity</div> <div class="grid grid-cols-3 gap-3 items-end"><div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">NPT Handle</label> <input${attr("value", unlinkHandle)} placeholder="mtellesy" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-red-500/60 transition-all"/></div> <div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">IBAN</label> <input${attr("value", unlinkIban)} placeholder="LY83002700…" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-red-500/60 transition-all"/></div> <button${attr("disabled", true, true)} class="px-4 py-2.5 bg-red-600/70 hover:bg-red-600 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">${escape_html("Unlink")}</button></div></section> <section class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="text-sm font-semibold mb-1">Set Default IBAN</div> <div class="text-[12px] text-white/30 mb-4">Which IBAN resolves for <code class="text-white/40">handle@bank</code></div> <div class="grid grid-cols-3 gap-3 items-end"><div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">NPT Handle</label> <input${attr("value", defHandle)} placeholder="mtellesy" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div> <div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">IBAN</label> <input${attr("value", defIban)} placeholder="LY83002700…" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div> <button${attr("disabled", true, true)} class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">${escape_html("Set Default")}</button></div></section> <section class="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6"><div class="text-sm font-semibold mb-1">Set Default Bank</div> <div class="text-[12px] text-white/30 mb-4">Which bank resolves for bare <code class="text-white/40">handle</code></div> <div class="grid grid-cols-3 gap-3 items-end"><div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">NPT Handle</label> <input${attr("value", defBankHandle)} placeholder="mtellesy" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 transition-all"/></div> <div><label class="block text-[11px] text-white/35 mb-1.5 uppercase tracking-wider">Bank</label> `);
		$$renderer.select({
			value: defBankSelected,
			class: "w-full bg-[#0d0d18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500/60 transition-all"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Select bank`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(banks);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let b = each_array_2[$$index_2];
				$$renderer.option({ value: b.bankHandle }, ($$renderer) => {
					$$renderer.push(`${escape_html(b.displayName || b.bankHandle)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <button${attr("disabled", true, true)} class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all">${escape_html("Set Default")}</button></div></section></div>`);
	});
}
//#endregion
export { _page as default };
