<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { apiCall } from '$lib/api/client';
  import { get } from 'svelte/store';
  import { toast } from 'svelte-sonner';

  let session     = $state(null);
  let delHandle   = $state('');
  let delConfirm  = $state('');
  let delLoading  = $state(false);
  let showModal   = $state(false);

  onMount(() => {
    session = get(auth);
    if (session?.role !== 'ADMIN') goto('/portal');
  });

  async function doDelete() {
    if (delConfirm !== delHandle) { toast.error('Handle does not match'); return; }
    delLoading = true;
    const r = await apiCall('delete', `/identity/${delHandle}`);
    delLoading = false;
    if (r.ok) {
      toast.success(`${delHandle} deleted`);
      showModal = false; delHandle = ''; delConfirm = '';
    } else {
      toast.error(r.error);
    }
  }
</script>

<svelte:head><title>Manage — OpenWave</title></svelte:head>

<div class="p-8 max-w-4xl mx-auto">
  <div class="mb-8">
    <h1 class="text-2xl font-semibold tracking-tight">Manage</h1>
    <p class="text-white/40 text-sm mt-1">Administrative operations — handle with care</p>
  </div>

  <!-- Danger zone -->
  <div class="rounded-2xl bg-white/[0.02] border border-red-500/10 p-6">
    <div class="flex items-start gap-4 mb-6">
      <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 text-sm font-bold">!</div>
      <div>
        <div class="text-sm font-semibold">Danger Zone</div>
        <div class="text-[12px] text-white/30 mt-0.5">These operations are irreversible. Proceed with caution.</div>
      </div>
    </div>

    <div class="border-t border-white/[0.06] pt-5">
      <div class="flex items-start justify-between">
        <div>
          <div class="text-[13px] font-medium">Delete Identity</div>
          <div class="text-[12px] text-white/30 mt-0.5">Permanently removes a handle and all linked accounts</div>
        </div>
        <div class="flex gap-2 items-center">
          <input
            bind:value={delHandle}
            placeholder="NPT handle"
            class="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all w-44"
          />
          <button
            onclick={() => { if (delHandle) showModal = true; }}
            disabled={!delHandle}
            class="px-4 py-2 bg-red-600/70 hover:bg-red-600 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Confirm modal -->
{#if showModal}
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
    <div class="bg-[#0d0d14] border border-white/[0.1] rounded-2xl p-7 w-full max-w-sm shadow-2xl">
      <div class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-base font-bold mb-5">!</div>
      <div class="text-base font-semibold mb-1">Delete "{delHandle}"?</div>
      <div class="text-[13px] text-white/35 mb-5">This cannot be undone. Type the handle to confirm.</div>
      <input
        bind:value={delConfirm}
        placeholder={delHandle}
        class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all mb-4"
      />
      <div class="flex gap-2">
        <button
          onclick={doDelete}
          disabled={delLoading || delConfirm !== delHandle}
          class="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white text-[13px] font-semibold rounded-xl transition-all"
        >
          {delLoading ? 'Deleting…' : 'Confirm Delete'}
        </button>
        <button
          onclick={() => { showModal = false; delConfirm = ''; }}
          class="flex-1 py-2.5 border border-white/[0.1] hover:border-white/20 text-white/40 hover:text-white text-[13px] font-semibold rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}
