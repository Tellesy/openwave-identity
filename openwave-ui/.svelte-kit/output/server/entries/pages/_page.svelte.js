import "../../chunks/index-server.js";
import "../../chunks/index-server2.js";
import "../../chunks/client.js";
import "../../chunks/navigation.js";
import "../../chunks/auth.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="min-h-screen bg-[#050508]"></div>`);
	});
}
//#endregion
export { _page as default };
