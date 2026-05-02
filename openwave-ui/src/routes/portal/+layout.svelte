<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { get } from 'svelte/store';
  import { LogOut, LayoutDashboard, Users, Building2, Settings } from 'lucide-svelte';

  let { children } = $props();
  let session = $state(null);
  let ready   = $state(false);

  const unsub = auth.subscribe(s => session = s);
  onDestroy(unsub);

  onMount(() => {
    const s = get(auth);
    if (!s?.role) { goto('/login'); return; }
    session = s;
    ready = true;
  });

  function logout() {
    auth.logout();
    goto('/login');
  }

  const allNav = [
    { href: '/portal',           label: 'Dashboard',  icon: LayoutDashboard, exact: true,  roles: ['ADMIN','BANK'] },
    { href: '/portal/identity',  label: 'Identity',   icon: Users,           exact: false, roles: ['ADMIN','BANK'] },
    { href: '/portal/banks',     label: 'Banks',      icon: Building2,       exact: false, roles: ['ADMIN','BANK'] },
    { href: '/portal/manage',    label: 'Manage',     icon: Settings,        exact: false, roles: ['ADMIN'] },
  ];

  const nav = $derived(allNav.filter(n => !session?.role || n.roles.includes(session.role)));

  function isActive(href, exact = false) {
    const path = $page.url.pathname;
    return exact ? path === href : path.startsWith(href);
  }
</script>

{#if !ready}
  <div class="min-h-screen bg-[#050508] flex items-center justify-center">
    <div class="w-6 h-6 border-2 border-white/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
{:else}
<div class="min-h-screen bg-[#050508] text-white flex" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;">

  <!-- Sidebar -->
  <aside class="w-56 bg-white/[0.025] border-r border-white/[0.07] flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">

    <!-- Logo -->
    <div class="px-5 py-5 flex items-center gap-3 border-b border-white/[0.06]">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(99,102,241,0.4)]">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L25 9V19L14 25L3 19V9L14 3Z" stroke="white" stroke-width="2" fill="none"/>
          <circle cx="14" cy="14" r="3" fill="white"/>
        </svg>
      </div>
      <div class="min-w-0">
        <div class="text-[13px] font-semibold text-white truncate">OpenWave</div>
        <div class="text-[10px] text-white/30 truncate">Identity Registry</div>
      </div>
    </div>

    <!-- Role badge -->
    <div class="px-4 pt-3">
      {#if session?.role === 'ADMIN'}
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
          <span class="text-[11px] text-indigo-300 font-medium">Registry Admin</span>
        </div>
      {:else}
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
          <span class="text-[11px] text-emerald-300 font-medium truncate">
            Bank: {session?.bankHandle || 'Portal'}
          </span>
        </div>
      {/if}
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto">
      {#each nav as item}
        {@const active = isActive(item.href, item.exact)}
        {@const Icon = item.icon}
        <a
          href={item.href}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all
            {active ? 'bg-white/[0.09] text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}"
        >
          <Icon class="w-4 h-4 shrink-0" />
          {item.label}
        </a>
      {/each}
    </nav>

    <!-- Bottom -->
    <div class="px-4 pb-5 pt-3 border-t border-white/[0.06] space-y-3">
      <div class="text-[10px] text-white/20 font-mono truncate">{session?.baseUrl}</div>
      <button
        onclick={logout}
        class="flex items-center gap-2.5 w-full text-[12px] text-red-400/60 hover:text-red-400 transition-colors"
      >
        <LogOut class="w-3.5 h-3.5" />
        Sign out
      </button>
    </div>
  </aside>

  <!-- Main content -->
  <div class="ml-56 flex-1 min-h-screen flex flex-col">
    <!-- Top bar -->
    <header class="sticky top-0 z-30 bg-white/[0.015] border-b border-white/[0.06] backdrop-blur-xl px-8 py-3 flex items-center justify-between">
      <div class="text-[12px] text-white/30">
        {#if session?.role === 'ADMIN'}
          <span class="text-indigo-400 font-medium">Registry Admin</span>
          · Full access
        {:else}
          <span class="text-emerald-400 font-medium">Bank Portal</span>
          · Scoped to your bank
        {/if}
      </div>
      <div class="flex items-center gap-3">
        <div class="text-[11px] px-2.5 py-1 rounded-full border
          {session?.role === 'ADMIN'
            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}">
          {session?.role}
        </div>
      </div>
    </header>

    <!-- Page -->
    <main class="flex-1 overflow-auto">
      {@render children()}
    </main>
  </div>
</div>
{/if}
