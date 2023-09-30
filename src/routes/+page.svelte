<script lang="ts">
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<h2 class="p-3 text-gray-800">Tailwind trial</h2>
<!-- Login page link if user is not logged in -->
{#if !data.user}
  <div><a href="/login">Login</a></div>
{/if}
<!-- Logout button if user is logged in -->
{#if data.user}
  <div><a href="/api/auth/logout">Logout</a></div>
{/if}
