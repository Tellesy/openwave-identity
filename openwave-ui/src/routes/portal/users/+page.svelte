<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { apiCall } from '$lib/api/client';
  import { get } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import UserPlus from 'lucide-svelte/icons/user-plus';
  import RefreshCw from 'lucide-svelte/icons/refresh-cw';
  import ShieldCheck from 'lucide-svelte/icons/shield-check';
  import Building2 from 'lucide-svelte/icons/building-2';
  import Copy from 'lucide-svelte/icons/copy';

  let session = $state(null);
  let users = $state([]);
  let banks = $state([]);
  let loading = $state(true);
  let saving = $state(false);
  let tempPassword = $state('');
  let createdUsername = $state('');

  let form = $state({
    username: '',
    displayName: '',
    email: '',
    role: 'BANK_OPERATOR',
    bankHandle: ''
  });

  const registryRoles = ['REGISTRY_ADMIN', 'REGISTRY_OPERATOR'];
  const bankRoles = ['BANK_ADMIN', 'BANK_OPERATOR', 'BANK_VIEWER'];
  const roleLabels = {
    REGISTRY_ADMIN: 'Registry Admin',
    REGISTRY_OPERATOR: 'Registry Operator',
    BANK_ADMIN: 'Bank Admin',
    BANK_OPERATOR: 'Bank Operator',
    BANK_VIEWER: 'Bank Viewer'
  };

  const visibleRoles = $derived(session?.role === 'ADMIN' ? [...registryRoles, ...bankRoles] : bankRoles);

  onMount(async () => {
    session = get(auth);
    if (session?.role === 'BANK') form.bankHandle = session.bankHandle || '';
    await Promise.all([loadUsers(), loadBanks()]);
  });

  async function loadUsers() {
    loading = true;
    const r = await apiCall('get', '/portal-users');
    loading = false;
    if (r.ok) users = r.data.users || [];
    else toast.error(r.error);
  }

  async function loadBanks() {
    const r = await apiCall('get', '/banks');
    if (r.ok) banks = r.data.banks || [];
  }

  async function createUser() {
    if (!form.username.trim()) { toast.error('Username is required'); return; }
    saving = true;
    const payload = {
      username: form.username.trim(),
      displayName: form.displayName.trim() || form.username.trim(),
      email: form.email.trim() || null,
      role: form.role,
      bankHandle: form.role.startsWith('BANK_') ? (form.bankHandle || session?.bankHandle) : null
    };
    const r = await apiCall('post', '/portal-users', payload);
    saving = false;
    if (r.ok) {
      tempPassword = r.data.temporaryPassword;
      createdUsername = r.data.user.username;
      toast.success('Portal user created');
      form.username = ''; form.displayName = ''; form.email = '';
      await loadUsers();
    } else {
      toast.error(r.error);
    }
  }

  async function toggleUser(user) {
    const r = await apiCall('patch', `/portal-users/${user.id}`, { active: !user.active });
    if (r.ok) {
      toast.success(user.active ? 'User suspended' : 'User activated');
      await loadUsers();
    } else toast.error(r.error);
  }

  async function resetPassword(user) {
    const r = await apiCall('post', `/portal-users/${user.id}/reset-password`);
    if (r.ok) {
      tempPassword = r.data.temporaryPassword;
      createdUsername = r.data.user.username;
      toast.success('Temporary password generated');
    } else toast.error(r.error);
  }

  async function copyTemp() {
    await navigator.clipboard.writeText(`${createdUsername}\n${tempPassword}`);
    toast.success('Credentials copied');
  }
</script>

<svelte:head><title>Portal Users - OpenWave</title></svelte:head>

<div class="p-8 max-w-7xl mx-auto">
  <div class="flex items-start justify-between gap-6 mb-8">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Portal Users</h1>
      <p class="text-white/40 text-sm mt-1">Manage username/password access, roles, and bank-scoped privileges.</p>
    </div>
    <button onclick={loadUsers} class="px-4 py-2 rounded-xl border border-white/[0.09] bg-white/[0.035] hover:bg-white/[0.06] text-[13px] text-white/70 transition-all">
      Refresh
    </button>
  </div>

  {#if tempPassword}
    <div class="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.08] p-5">
      <div class="flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/20 flex items-center justify-center text-amber-200 font-semibold">1x</div>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-semibold text-amber-100">Temporary password - shown once</div>
          <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <code class="block rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3 text-sm text-amber-100 font-mono truncate">{createdUsername}</code>
            <code class="block rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3 text-sm text-amber-100 font-mono truncate">{tempPassword}</code>
          </div>
        </div>
        <button onclick={copyTemp} class="px-3 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/20 text-amber-100 text-[12px] font-semibold flex items-center gap-2">
          <Copy class="w-3.5 h-3.5" /> Copy
        </button>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
    <section class="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 h-fit">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
          <UserPlus class="w-4 h-4" />
        </div>
        <div>
          <div class="text-sm font-semibold">Create user</div>
          <div class="text-[12px] text-white/30">Portal access, not API integration access</div>
        </div>
      </div>

      <div class="space-y-3">
        <input bind:value={form.username} placeholder="username" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50" />
        <input bind:value={form.displayName} placeholder="Display name" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50" />
        <input bind:value={form.email} placeholder="email@example.com" class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50" />
        <select bind:value={form.role} class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500/50">
          {#each visibleRoles as role}
            <option value={role}>{roleLabels[role]}</option>
          {/each}
        </select>
        {#if form.role.startsWith('BANK_')}
          {#if session?.role === 'ADMIN'}
            <select bind:value={form.bankHandle} class="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-indigo-500/50">
              <option value="">Select bank</option>
              {#each banks as bank}
                <option value={bank.bankHandle}>{bank.displayName} ({bank.bankHandle})</option>
              {/each}
            </select>
          {:else}
            <div class="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3.5 py-2.5 text-[13px] text-emerald-200">
              Bank scope: {session?.bankHandle}
            </div>
          {/if}
        {/if}
        <button onclick={createUser} disabled={saving} class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-[13px] font-semibold transition-all">
          {saving ? 'Creating...' : 'Create portal user'}
        </button>
      </div>
    </section>

    <section class="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
      <div class="grid grid-cols-[1.25fr_1fr_1fr_0.7fr_1fr] gap-4 px-5 py-3 border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/30">
        <span>User</span><span>Role</span><span>Scope</span><span>Status</span><span></span>
      </div>
      {#if loading}
        <div class="p-10 text-center text-white/30 text-sm">Loading users...</div>
      {:else if users.length === 0}
        <div class="p-10 text-center text-white/30 text-sm">No portal users yet.</div>
      {:else}
        {#each users as user}
          <div class="grid grid-cols-[1.25fr_1fr_1fr_0.7fr_1fr] gap-4 items-center px-5 py-4 border-b border-white/[0.045] hover:bg-white/[0.025] transition-colors">
            <div class="min-w-0">
              <div class="text-sm font-medium text-white truncate">{user.displayName}</div>
              <div class="text-[12px] text-white/35 font-mono truncate">{user.username}</div>
            </div>
            <div class="flex items-center gap-2 text-[12px] text-white/60">
              <ShieldCheck class="w-3.5 h-3.5 text-indigo-300" />
              {roleLabels[user.role] || user.role}
            </div>
            <div class="flex items-center gap-2 text-[12px] text-white/45">
              <Building2 class="w-3.5 h-3.5 text-white/25" />
              {user.bankHandle || 'Registry'}
            </div>
            <div>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border {user.active ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' : 'bg-red-400/10 text-red-300 border-red-400/20'}">
                {user.active ? 'Active' : 'Suspended'}
              </span>
            </div>
            <div class="flex items-center justify-end gap-2">
              <button onclick={() => resetPassword(user)} class="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] text-[12px] text-white/60 flex items-center gap-1.5">
                <RefreshCw class="w-3 h-3" /> Reset
              </button>
              <button onclick={() => toggleUser(user)} class="px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] text-[12px] {user.active ? 'text-red-300' : 'text-emerald-300'}">
                {user.active ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </section>
  </div>
</div>
