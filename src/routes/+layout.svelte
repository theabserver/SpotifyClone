<script lang="ts">
  import "modern-normalize/modern-normalize.css";
  // import "../app.css";
  import "$styles/main.scss";
  import { Navigation } from "$components";
  import { Header } from "$components";
  import type { LayoutData } from "./$types";
  import { page } from "$app/stores";
  import NProgress from "nprogress";
  import "nprogress/nprogress.css";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { hideAll } from "tippy.js";
  export let data: LayoutData;
  //   import TailwindCss from "../styles/TailwindCSS.svelte";
  let topbar: HTMLElement;
  let scrollY: number;
  let headerOpacity = 0;

  $: if (topbar) {
    headerOpacity =
      scrollY / topbar.offsetHeight < 1 ? scrollY / topbar.offsetHeight : 1;
  }

  $: user = data.user;
  NProgress.configure({ showSpinner: false });

  beforeNavigate(() => {
    NProgress.start();
    hideAll();
  });
  afterNavigate(() => {
    NProgress.done();
  });
</script>

<svelte:head>
  <title>
    Spotify Clone {$page.data.title ? `- ${$page.data.title}` : ""}
  </title>
</svelte:head>
<!-- Main layout -->
<div id="main">
  {#if user}
    <div id="sidebar">
      <Navigation desktop={true} />
    </div>
  {/if}
  <div id="content">
    <!-- The topbar container -->
    <div id="topbar" bind:this={topbar}>
      <!-- The topbar background element -->
      <div
        class="topbar-bg"
        style:background-color="var(--header-color)"
        style:opacity={`${headerOpacity}`}
      />
      <!-- The header component -->
      <Header />
    </div>
    <main id="main-content" class:logged-in={user}>
      <slot />
    </main>
  </div>
</div>

<style lang="scss">
  #main {
    display: flex;
    :global(html.no-js) & {
      @include breakpoint.down("md") {
        display: block;
      }
    }
    #content {
      flex: 1;
      #topbar {
        position: fixed;
        height: var(--header-height);
        padding: 0 15px;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 100;
        :global(html.no-js) & {
          position: sticky;
          top: 0;
          background-color: var(--header-color);
          height: auto;
          padding: 10px 20px;
          @include breakpoint.up("md") {
            position: fixed;
          }
        }
        .topbar-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          background-image: linear-gradient(rgba(0, 0, 0, 0.2) 0 0);
        }
        @include breakpoint.up("md") {
          padding: 0 30px;
          width: calc(100% - var(--sidebar-width));
        }
      }
      main#main-content {
        padding: 30px 15px 60px;
        @include breakpoint.up("md") {
          padding: 30px 30px 60px;
        }
        &.logged-in {
          padding-top: calc(30px + var(--header-height));
          :global(html.no-js) & {
            @include breakpoint.down("md") {
              padding-top: 30px;
            }
          }
        }
      }
    }
  }
</style>
