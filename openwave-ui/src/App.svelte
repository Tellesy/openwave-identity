<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  // ── Config ───────────────────────────────────────────────────────────────────
  let baseUrl   = localStorage.getItem('ow_baseUrl')   || 'http://localhost:8095/v1';
  let adminKey  = localStorage.getItem('ow_adminKey')  || '';
  let bankKey   = localStorage.getItem('ow_bankKey')   || '';
  let page      = 'registry';
  let authed    = !!(adminKey || bankKey);

  $: localStorage.setItem('ow_baseUrl',  baseUrl);
  $: localStorage.setItem('ow_adminKey', adminKey);
  $: localStorage.setItem('ow_bankKey',  bankKey);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function adminHeaders()  { return { 'X-OpenWave-Registry-Key': adminKey }; }
  function bankHeaders()   { return { 'X-OpenWave-Bank-Key': bankKey }; }
  function authHeaders()   { return adminKey ? adminHeaders() : bankHeaders(); }

  async function api(method, path, data) {
    try {
      const r = await axios({ method, url: baseUrl + path, data, headers: authHeaders() });
      return { ok: true, data: r.data };
    } catch(e) {
      return { ok: false, error: e.response?.data?.message || e.message };
    }
  }

  // ── Registry stats ──────────────────────────────────────────────────────────
  let registryInfo = null;
  async function loadRegistry() {
    const r = await axios.get(baseUrl + '/registry/info').catch(e => null);
    if (r) registryInfo = r.data;
  }

  // ── Banks ────────────────────────────────────────────────────────────────────
  let banks = [];
  let bankError = '';
  let newBank = { bankHandle:'', displayName:'', country:'LY', coreUrl:'', contactEmail:'' };
  let registeredBank = null;
  let bankLoading = false;

  async function loadBanks() {
    const r = await axios.get(baseUrl + '/banks').catch(() => null);
    if (r) banks = r.data.banks || [];
  }

  async function registerBank() {
    bankError = ''; registeredBank = null; bankLoading = true;
    const r = await api('post', '/banks', newBank);
    bankLoading = false;
    if (r.ok) {
      registeredBank = r.data;
      newBank = { bankHandle:'', displayName:'', country:'LY', coreUrl:'', contactEmail:'' };
      await loadBanks();
    } else {
      bankError = r.error;
    }
  }

  // ── Identity search/browse ───────────────────────────────────────────────────
  let resolveAlias = '';
  let resolveResult = null;
  let resolveError = '';
  let resolveLoading = false;

  async function resolveHandle() {
    resolveError = ''; resolveResult = null; resolveLoading = true;
    try {
      const r = await axios.get(baseUrl + '/identity/resolve', { params: { alias: resolveAlias } });
      resolveResult = r.data;
    } catch(e) {
      resolveError = e.response?.status === 404 ? 'Handle not found in registry' : (e.response?.data?.message || e.message);
    } finally { resolveLoading = false; }
  }

  // ── Identity enrollment (bank key required) ──────────────────────────────────
  let enroll = { nptHandle:'', iban:'', customerDisplayName:'', bankCustomerRef:'', setAsDefault: true };
  let enrollResult = null;
  let enrollError  = '';
  let enrollLoading = false;

  async function enrollHandle() {
    enrollError = ''; enrollResult = null; enrollLoading = true;
    try {
      const r = await axios.post(baseUrl + '/identity/claim', enroll, { headers: bankHeaders() });
      enrollResult = r.data;
      enroll = { nptHandle:'', iban:'', customerDisplayName:'', bankCustomerRef:'', setAsDefault: true };
    } catch(e) {
      enrollError = e.response?.data?.message || e.message;
    } finally { enrollLoading = false; }
  }

  // ── Delete identity ──────────────────────────────────────────────────────────
  let deleteHandle = '';
  let deleteMsg = '';

  async function deleteIdentity() {
    deleteMsg = '';
    const r = await api('delete', `/identity/${deleteHandle}`);
    deleteMsg = r.ok ? `${deleteHandle} deleted` : r.error;
    if (r.ok) deleteHandle = '';
  }

  // ── On mount ─────────────────────────────────────────────────────────────────
  onMount(async () => {
    await loadRegistry();
    await loadBanks();
  });

  function login() {
    authed = true;
    loadRegistry(); loadBanks();
  }

  const NAV = [
    { id: 'registry', label: '🌐 Registry' },
    { id: 'banks',    label: '🏦 Banks' },
    { id: 'identity', label: '🪪 Identity' },
  ];
</script>

<!-- ── Login ──────────────────────────────────────────────────────────────── -->
{#if !authed}
<div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
  <div class="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">OW</div>
      <div>
        <h1 class="text-lg font-bold text-white">OpenWave Identity Registry</h1>
        <p class="text-xs text-gray-500">Admin / Bank Portal</p>
      </div>
    </div>
    <div class="space-y-3">
      <div>
        <label class="block text-xs text-gray-400 mb-1.5 font-medium">Registry URL</label>
        <input bind:value={baseUrl} class="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="http://localhost:8095/v1"/>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5 font-medium">Admin Key <span class="text-gray-600">(optional)</span></label>
        <input type="password" bind:value={adminKey} class="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Registry admin key"/>
      </div>
      <div>
        <label class="block text-xs text-gray-400 mb-1.5 font-medium">Bank Key <span class="text-gray-600">(for enrollment)</span></label>
        <input type="password" bind:value={bankKey} class="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="owbk_…"/>
      </div>
      <button on:click={login} class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2">
        Enter Registry
      </button>
    </div>
  </div>
</div>

<!-- ── Main app ──────────────────────────────────────────────────────────── -->
{:else}
<div class="min-h-screen bg-[#0a0a0f]">

  <!-- Header -->
  <header class="sticky top-0 z-50 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
      <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">OW</div>
      <span class="font-bold text-white text-sm">OpenWave Identity Registry</span>
      <nav class="flex gap-1 ml-4">
        {#each NAV as n}
          <button
            on:click={() => page = n.id}
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors {page === n.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}"
          >{n.label}</button>
        {/each}
      </nav>
      <div class="ml-auto flex items-center gap-3">
        <span class="text-xs text-gray-600 font-mono hidden sm:block">{baseUrl}</span>
        <button on:click={() => { authed = false; adminKey = ''; bankKey = ''; }} class="text-xs text-red-500 hover:text-red-400 transition-colors">Logout</button>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-6 space-y-6">

    <!-- ── REGISTRY PAGE ─────────────────────────────────────────────────── -->
    {#if page === 'registry'}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#if registryInfo}
          {#each [
            ['🏛️ Operator',       registryInfo.operator],
            ['🌍 Country Scope',  registryInfo.country_scope],
            ['🏦 Registered Banks', registryInfo.registered_banks],
            ['🪪 Active Identities', registryInfo.active_identities],
            ['📋 Spec Version',   registryInfo.spec_version],
            ['⏱ Uptime SLA',     registryInfo.uptime_sla],
          ] as [label, value]}
            <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p class="text-xs text-gray-500 mb-1">{label}</p>
              <p class="text-white font-semibold text-sm">{value ?? '—'}</p>
            </div>
          {/each}
        {:else}
          <div class="col-span-3 text-center py-12 text-gray-600 text-sm">Loading registry info…</div>
        {/if}
      </div>

      <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
        <h2 class="text-sm font-semibold text-white mb-3">🔍 Resolve NPT Handle (Public)</h2>
        <div class="flex gap-2">
          <input bind:value={resolveAlias} placeholder="mtellesy or mtellesy@andalus" on:keydown={e => e.key==='Enter' && resolveHandle()}
            class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"/>
          <button on:click={resolveHandle} disabled={resolveLoading || !resolveAlias}
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
            {resolveLoading ? '…' : 'Resolve'}
          </button>
        </div>
        {#if resolveError}
          <p class="mt-2 text-sm text-red-400">{resolveError}</p>
        {/if}
        {#if resolveResult}
          <div class="mt-3 bg-black/30 border border-white/[0.06] rounded-xl p-4 grid grid-cols-2 gap-2 text-sm">
            {#each Object.entries(resolveResult) as [k,v]}
              <div><span class="text-gray-500 text-xs">{k}</span><div class="text-white font-mono text-xs mt-0.5">{v}</div></div>
            {/each}
          </div>
        {/if}
      </div>

    <!-- ── BANKS PAGE ────────────────────────────────────────────────────── -->
    {:else if page === 'banks'}
      <!-- Bank list -->
      <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 class="text-sm font-semibold text-white">Registered Banks</h2>
          <button on:click={loadBanks} class="text-xs text-gray-500 hover:text-white transition-colors">↻ Refresh</button>
        </div>
        {#if banks.length === 0}
          <p class="text-center py-10 text-gray-600 text-sm">No banks registered</p>
        {:else}
          <div class="divide-y divide-white/[0.04]">
            {#each banks as bank}
              <div class="flex items-center gap-4 px-5 py-3">
                <div class="w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 text-xs font-bold">{bank.bankHandle.slice(0,2).toUpperCase()}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-sm font-medium">{bank.displayName}</p>
                  <p class="text-gray-600 text-xs font-mono">{bank.bankHandle} · {bank.country} · {bank.coreUrl}</p>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full border {bank.active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-700 text-gray-500 border-gray-600'}">
                  {bank.active ? 'active' : 'inactive'}
                </span>
                <span class="text-xs text-gray-600">{new Date(bank.registeredAt).toLocaleDateString()}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Register bank (admin only) -->
      {#if adminKey}
        <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
          <h2 class="text-sm font-semibold text-white mb-4">Register New Bank <span class="text-gray-600 text-xs font-normal">(admin)</span></h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each [['bankHandle','Handle (e.g. nub)'],['displayName','Display Name'],['country','Country (2-letter)'],['coreUrl','Core URL'],['contactEmail','Contact Email']] as [f, ph]}
              <div>
                <label class="block text-xs text-gray-500 mb-1 font-medium">{ph}</label>
                <input bind:value={newBank[f]} placeholder={ph}
                  class="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors font-mono"/>
              </div>
            {/each}
          </div>
          {#if bankError}
            <p class="mt-2 text-sm text-red-400">{bankError}</p>
          {/if}
          {#if registeredBank}
            <div class="mt-3 bg-amber-950/30 border border-amber-700/40 rounded-xl p-4">
              <p class="text-amber-400 text-xs font-semibold mb-2">⚠ Save this API key — shown only once</p>
              <p class="text-white font-mono text-sm break-all">{registeredBank.bankApiKey}</p>
            </div>
          {/if}
          <button on:click={registerBank} disabled={bankLoading}
            class="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
            {bankLoading ? 'Registering…' : 'Register Bank'}
          </button>
        </div>
      {/if}

    <!-- ── IDENTITY PAGE ──────────────────────────────────────────────────── -->
    {:else if page === 'identity'}
      <!-- Enroll (bank key) -->
      <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
        <h2 class="text-sm font-semibold text-white mb-1">Claim NPT Handle</h2>
        <p class="text-xs text-gray-600 mb-4">Requires Bank Key — bank vouches for the customer</p>
        {#if !bankKey}
          <div class="bg-amber-950/30 border border-amber-700/40 rounded-xl px-4 py-3 text-xs text-amber-400">
            No bank key set. <button on:click={() => authed = false} class="underline">Go back and enter one.</button>
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each [
              ['nptHandle',           'NPT Handle (e.g. mtellesy)'],
              ['customerDisplayName', 'Customer Display Name'],
              ['iban',                'IBAN'],
              ['bankCustomerRef',     'Bank Customer Reference'],
            ] as [f, ph]}
              <div>
                <label class="block text-xs text-gray-500 mb-1 font-medium">{ph}</label>
                <input bind:value={enroll[f]} placeholder={ph}
                  class="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-700 font-mono focus:outline-none focus:border-indigo-500 transition-colors"/>
              </div>
            {/each}
            <div class="flex items-center gap-2 mt-1">
              <input type="checkbox" id="setDefault" bind:checked={enroll.setAsDefault} class="rounded"/>
              <label for="setDefault" class="text-xs text-gray-400">Set as default bank</label>
            </div>
          </div>
          {#if enrollError}
            <p class="mt-2 text-sm text-red-400">{enrollError}</p>
          {/if}
          {#if enrollResult}
            <div class="mt-3 bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-4">
              <p class="text-emerald-400 text-xs font-semibold mb-2">✅ Handle claimed successfully</p>
              <div class="grid grid-cols-2 gap-2">
                {#each Object.entries(enrollResult) as [k,v]}
                  {#if typeof v !== 'object'}
                    <div><span class="text-gray-500 text-xs">{k}</span><div class="text-white font-mono text-xs mt-0.5">{v}</div></div>
                  {/if}
                {/each}
              </div>
            </div>
          {/if}
          <button on:click={enrollHandle} disabled={enrollLoading || !enroll.nptHandle || !enroll.iban}
            class="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
            {enrollLoading ? 'Claiming…' : 'Claim Handle'}
          </button>
        {/if}
      </div>

      <!-- Resolve -->
      <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
        <h2 class="text-sm font-semibold text-white mb-3">🔍 Resolve Handle</h2>
        <div class="flex gap-2">
          <input bind:value={resolveAlias} placeholder="mtellesy or mtellesy@andalus" on:keydown={e => e.key==='Enter' && resolveHandle()}
            class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"/>
          <button on:click={resolveHandle} disabled={resolveLoading || !resolveAlias}
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
            {resolveLoading ? '…' : 'Resolve'}
          </button>
        </div>
        {#if resolveError}<p class="mt-2 text-sm text-red-400">{resolveError}</p>{/if}
        {#if resolveResult}
          <div class="mt-3 bg-black/30 border border-white/[0.06] rounded-xl p-4 grid grid-cols-2 gap-2 text-sm">
            {#each Object.entries(resolveResult) as [k,v]}
              <div><span class="text-gray-500 text-xs">{k}</span><div class="text-white font-mono text-xs mt-0.5">{v}</div></div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Delete (admin or owning bank) -->
      <div class="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
        <h2 class="text-sm font-semibold text-white mb-3">🗑 Delete Identity</h2>
        <div class="flex gap-2">
          <input bind:value={deleteHandle} placeholder="nptHandle"
            class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-gray-700 focus:outline-none focus:border-red-500 transition-colors"/>
          <button on:click={deleteIdentity} disabled={!deleteHandle}
            class="px-4 py-2 bg-red-600/80 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">Delete</button>
        </div>
        {#if deleteMsg}<p class="mt-2 text-xs {deleteMsg.includes('deleted') ? 'text-emerald-400' : 'text-red-400'}">{deleteMsg}</p>{/if}
      </div>
    {/if}

  </main>
</div>
{/if}
