<script lang="ts">
  import type { LayoutData } from "./$types";
  import { LogoutButton } from "$components/index";
  export let data: LayoutData;
</script>

<div class="container mx-auto px-4">
  <!-- Login page link if user is not logged in -->
  {#if !data.user}
    <div><a href="/login">Login</a></div>
  {/if}
  <!-- Logout button if user is logged in -->
  {#if data.user}
    <div>
      Hello {data.user.display_name}.
      <LogoutButton />
    </div>
  {/if}
  <h1>Welcome to SvelteKit</h1>
  <p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
  </p>
  <h2 class="p-3 text-gray-800">Tailwind trial</h2>
</div>
