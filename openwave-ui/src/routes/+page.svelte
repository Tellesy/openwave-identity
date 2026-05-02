<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { get } from 'svelte/store';

  onMount(() => {
    const s = get(auth);
    if (s?.role) goto('/portal');
    else goto('/login');
  });
</script>

<div class="min-h-screen bg-[#050508]"></div>
