<script lang="ts">
  import { invalidateAll } from "$app/navigation";
</script>

<form
  action="/api/auth/logout"
  method="post"
  on:submit|preventDefault={async () => {
    /* Invoked when JS is enabled, else form is submit */
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      invalidateAll();
    }
  }}
>
  <button class="btn" type="submit">Logout</button>
</form>
<style lang="scss">
  form {
    display: inline-block;
  }
</style>