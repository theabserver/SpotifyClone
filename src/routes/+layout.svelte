<script lang="ts">
  import "modern-normalize/modern-normalize.css";
  import "../styles/main.scss";
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
  //   import TailwindCss from "../styles/TailwindCSS.svelte";
</script>

<!-- <TailwindCss /> -->
<!-- Main layout -->
{data.user && data.user.display_name}
<slot />
