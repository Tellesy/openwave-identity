

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.B24uyzbb.js","_app/immutable/chunks/CP87K-7Z.js","_app/immutable/chunks/JNEEPU66.js","_app/immutable/chunks/D9FQP20W.js","_app/immutable/chunks/G_mIcEW1.js","_app/immutable/chunks/DdYmzRFP.js","_app/immutable/chunks/CB8jw9HW.js"];
export const stylesheets = ["_app/immutable/assets/0.BkNBClQE.css"];
export const fonts = [];
