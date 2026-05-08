<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  let signedIn = $state(false);

  onMount(() => {
    signedIn = Boolean(get(auth)?.role);
  });

  const endpoints = [
    ['GET', '/v1/identity/resolve', 'Public NPT alias resolution for gateways, apps, and merchants.'],
    ['POST', '/v1/identity/claim', 'Bank-vouched handle claim using X-OpenWave-Bank-Key.'],
    ['POST', '/v1/identity/{handle}/accounts', 'Link a bank-owned account to an existing handle.'],
    ['PATCH', '/v1/identity/{handle}/default', 'Set the default receiving account for the customer.'],
    ['GET', '/v1/banks', 'Public participating bank directory and routing phonebook.'],
    ['GET', '/v1/registry/info', 'Registry operator, governance, and source metadata.']
  ];

  const rules = [
    'A customer owns the global username, for example tellesy.',
    'A bank can only manage accounts it vouched for, for example tellesy@andalus.',
    'Resolution is public, but administration is bank-scoped or registry-admin scoped.',
    'The registry stores routing facts, not balances, transactions, or broad KYC records.'
  ];
</script>

<svelte:head>
  <title>OpenWave Identity Registry - NPT Developer Portal</title>
  <meta name="description" content="Neptune-built OpenWave Identity Registry for NPT aliases, bank-vouched account links, and gateway identity resolution." />
</svelte:head>

<main class="identity-public">
  <nav class="identity-nav">
    <a class="identity-logo" href="/">
      <span class="identity-mark">OW</span>
      <span>
        <b>OW Identity</b>
        <small>Neptune-built NPT registry</small>
      </span>
    </a>
    <div class="identity-actions">
      <a href="https://neptune-ly.github.io/openwave-spec/" target="_blank" rel="noreferrer">OpenWave Spec</a>
      <button onclick={() => goto(signedIn ? '/portal' : '/login')}>
        {signedIn ? 'Open portal' : 'Sign in'}
      </button>
    </div>
  </nav>

  <section class="identity-hero">
    <div>
      <p class="identity-kicker">National Payment Tag registry</p>
      <h1>One username. Multiple banks. Public routing, bank-scoped control.</h1>
      <p class="identity-lede">
        OpenWave Identity is the source of truth for NPT handles such as <code>tellesy</code> and
        bank-qualified aliases such as <code>tellesy@andalus</code>. It lets any compliant gateway
        resolve where money should go without giving merchants direct access to bank systems.
      </p>
      <div class="identity-hero-actions">
        <a class="primary" href="/login">Open admin portal</a>
        <a href="https://github.com/neptune-ly/openwave-identity" target="_blank" rel="noreferrer">View source</a>
      </div>
    </div>

    <div class="identity-panel" aria-label="NPT routing example">
      <div class="identity-panel-head">
        <span>Resolution example</span>
        <b>Public API</b>
      </div>
      <div class="alias-card">
        <small>Customer handle</small>
        <strong>tellesy</strong>
        <span>Default account selected by customer</span>
      </div>
      <div class="route-row">
        <span>tellesy@andalus</span>
        <b>Andalus account</b>
      </div>
      <div class="route-row">
        <span>tellesy@nub</span>
        <b>NUB account</b>
      </div>
      <pre>GET /v1/identity/resolve?alias=tellesy</pre>
    </div>
  </section>

  <section class="identity-grid">
    <article>
      <b>For banks</b>
      <p>Claim handles, link customer accounts, set bank-owned account metadata, and manage only the records your bank vouched for.</p>
      <code>X-OpenWave-Bank-Key: owbk_...</code>
    </article>
    <article>
      <b>For gateways</b>
      <p>Resolve aliases before payment routing, decide whether the debtor or creditor bank is local, and hand off to OW-GIP when another gateway owns the route.</p>
      <code>GET /v1/identity/resolve</code>
    </article>
    <article>
      <b>For registry admins</b>
      <p>Register banks, rotate bank credentials, audit handle activity, and publish operator governance through registry metadata.</p>
      <code>X-OpenWave-Registry-Key</code>
    </article>
  </section>

  <section class="identity-docs">
    <div>
      <p class="identity-kicker">Endpoint map</p>
      <h2>Read the API by operation</h2>
      <p>Identity is intentionally small. It resolves handles, records bank-vouched account links, and publishes the bank phonebook. It does not execute payments.</p>
    </div>
    <div class="endpoint-list">
      {#each endpoints as endpoint}
        <div class="endpoint-row">
          <span>{endpoint[0]}</span>
          <code>{endpoint[1]}</code>
          <p>{endpoint[2]}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="identity-rules">
    <p class="identity-kicker">Governance rules</p>
    <div>
      {#each rules as rule}
        <p>{rule}</p>
      {/each}
    </div>
  </section>

  <footer>
    <span>Neptune Fintech</span>
    <span>OpenWave Identity Registry</span>
    <a href="https://neptune-ly.github.io/openwave-spec/guide/npt.html" target="_blank" rel="noreferrer">NPT guide</a>
  </footer>
</main>
