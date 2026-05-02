<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { auth } from '$lib/stores/auth';
  import { get } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import axios from 'axios';

  let baseUrl   = $state(browser ? (localStorage.getItem('ow_baseUrl') || 'http://localhost:8095/v1') : 'http://localhost:8095/v1');
  let adminKey  = $state('');
  let bankKey   = $state('');
  let loading   = $state(false);
  let mode      = $state('admin');

  $effect(() => { if (browser) localStorage.setItem('ow_baseUrl', baseUrl); });

  onMount(() => {
    const s = get(auth);
    if (s?.role) goto('/portal');
  });

  async function connect() {
    if (loading) return;
    const key = mode === 'admin' ? adminKey.trim() : bankKey.trim();
    if (!key) { toast.error('Enter a key to connect'); return; }

    loading = true;
    try {
      if (mode === 'admin') {
        await axios.get(baseUrl + '/registry/info', {
          headers: { 'X-OpenWave-Registry-Key': key }
        });
        auth.loginAdmin(key, baseUrl);
        toast.success('Connected as Registry Admin');
        goto('/portal');
      } else {
        const r = await axios.get(baseUrl + '/banks', {
          headers: { 'X-OpenWave-Bank-Key': key }
        });
        const banks = r.data?.banks || r.data || [];
        auth.loginBank(key, banks[0]?.bankHandle || '', baseUrl);
        toast.success('Connected as Bank');
        goto('/portal');
      }
    } catch (e) {
      const status = e.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Invalid key — access denied');
      } else if (!e.response) {
        toast.error('Cannot reach registry — check URL');
      } else {
        auth.loginAdmin(key, baseUrl);
        goto('/portal');
      }
    } finally {
      loading = false;
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') connect();
  }
</script>

<svelte:head>
  <title>Sign In — OpenWave Identity Registry</title>
</svelte:head>

<div class="min-h-screen bg-[#050508] flex relative overflow-hidden" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;">
  <!-- Ambient glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/[0.04] blur-[140px] pointer-events-none"></div>

  <!-- Left brand panel -->
  <div class="hidden lg:flex flex-col w-[440px] shrink-0 border-r border-white/[0.06] p-12 justify-between relative">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-violet-950/20 pointer-events-none"></div>

    <!-- Logo -->
    <div class="flex items-center gap-3 relative">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" stroke="white" stroke-width="1.5" fill="none"/>
          <path d="M14 8L20 11.5V18.5L14 22L8 18.5V11.5L14 8Z" fill="white" fill-opacity="0.15"/>
          <circle cx="14" cy="14" r="3" fill="white"/>
        </svg>
      </div>
      <div>
        <div class="text-white font-semibold text-[15px]">OpenWave</div>
        <div class="text-white/30 text-[11px] tracking-widest uppercase mt-0.5">Identity Registry</div>
      </div>
    </div>

    <!-- Hero text -->
    <div class="relative">
      <h2 class="text-3xl font-semibold text-white leading-tight tracking-tight">
        Global NPT Identity<br/>Registry
      </h2>
      <p class="mt-4 text-white/40 text-[14px] leading-relaxed">
        Manage NPT handle ownership, bank enrollment, and cross-gateway alias resolution for the OpenWave payment protocol.
      </p>

      <!-- Feature pills -->
      <div class="mt-8 space-y-2.5">
        {#each [
          { label: 'Bank-vouched identity claims', color: 'indigo' },
          { label: 'Multi-IBAN per handle', color: 'violet' },
          { label: 'Public alias resolution', color: 'emerald' },
          { label: 'Cross-gateway federation', color: 'sky' },
        ] as f}
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-{f.color}-400/60"></div>
            <span class="text-[13px] text-white/40">{f.label}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="text-[11px] text-white/20 relative">
      © {new Date().getFullYear()} Neptune Fintech · OpenWave v1.0
    </div>
  </div>

  <!-- Right: login form -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="w-full max-w-[380px]">

      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center gap-3 mb-10">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
            <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" stroke="white" stroke-width="2" fill="none"/>
            <circle cx="14" cy="14" r="3" fill="white"/>
          </svg>
        </div>
        <div class="text-white font-semibold text-base">OpenWave Identity</div>
      </div>

      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-white tracking-tight">Sign in</h1>
        <p class="text-white/40 text-[13px] mt-1">Connect with your registry or bank key</p>
      </div>

      <!-- Mode toggle -->
      <div class="flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1 mb-6">
        <button
          onclick={() => mode = 'admin'}
          class="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all
            {mode === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}">
          Registry Admin
        </button>
        <button
          onclick={() => mode = 'bank'}
          class="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all
            {mode === 'bank' ? 'bg-emerald-600 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}">
          Bank Portal
        </button>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Registry URL</label>
          <input
            bind:value={baseUrl}
            onkeydown={onKey}
            class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
            placeholder="http://localhost:8095/v1"
          />
        </div>

        {#if mode === 'admin'}
          <div>
            <label class="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Registry Admin Key</label>
            <input
              type="password"
              bind:value={adminKey}
              onkeydown={onKey}
              class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
              placeholder="Registry admin key from config"
              autofocus
            />
            <p class="text-[11px] text-white/25 mt-1.5">Set via <code class="text-white/40">registry.admin-key</code> in application.yml</p>
          </div>
        {:else}
          <div>
            <label class="block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider">Bank API Key</label>
            <input
              type="password"
              bind:value={bankKey}
              onkeydown={onKey}
              class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-[13px] text-white font-mono placeholder-white/20 focus:outline-none focus:border-emerald-500/60 focus:bg-white/[0.07] transition-all"
              placeholder="owbk_handle_…"
              autofocus
            />
            <p class="text-[11px] text-white/25 mt-1.5">Issued when your bank was registered in the registry</p>
          </div>
        {/if}

        <button
          onclick={connect}
          disabled={loading || (mode === 'admin' ? !adminKey.trim() : !bankKey.trim())}
          class="w-full py-3 text-[14px] font-semibold text-white rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-2
            {mode === 'admin'
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_24px_rgba(99,102,241,0.3)]'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]'}">
          {#if loading}
            <span class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 align-middle"></span>
            Connecting…
          {:else}
            Connect to Registry
          {/if}
        </button>
      </div>

      <!-- Role description -->
      <div class="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        {#if mode === 'admin'}
          <div class="text-[11px] text-white/30 leading-relaxed">
            <span class="text-indigo-400 font-medium">Admin access</span> — full registry control: register banks, manage identities, view all accounts, delete handles.
          </div>
        {:else}
          <div class="text-[11px] text-white/30 leading-relaxed">
            <span class="text-emerald-400 font-medium">Bank access</span> — scoped to your bank: claim handles for customers, link/unlink IBANs, manage your bank's accounts.
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
