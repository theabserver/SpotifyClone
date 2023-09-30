<script lang="ts">
  import "modern-normalize/modern-normalize.css";
  // import "../app.css";
  import "$styles/main.scss";
  //   import TailwindCss from "../styles/TailwindCSS.svelte";
</script>

<style lang="scss">
  @use "@unsass/breakpoint";
</style>

<!-- <TailwindCss /> -->
<!-- Main layout -->
<div id="main">
  <div id="content">
    <main id="main-content">
      <slot />
    </main>
  </div>
</div>
