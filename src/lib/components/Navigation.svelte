<script lang="ts">
  import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    MenuIcon,
    X,
    type Icon,
  } from "lucide-svelte";
  import logo from "$assets/Spotify_Logo_RGB_White.png";
  import { tick, type ComponentType } from "svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { beforeNavigate } from "$app/navigation";
  import { IconButton } from "$components";

  export let desktop: boolean;
  export let userAllPlaylists:
    | SpotifyApi.PlaylistObjectSimplified[]
    | undefined;
  let lastFocusableElement: HTMLAnchorElement;
  let openMenuButton: IconButton;
  let closeMenuButton: IconButton;
  let isMobileMenuOpen = false;
  $: isOpen = desktop || isMobileMenuOpen;
  console.log(`Desktop: ${desktop}`);
  const menuItems: {
    path: string;
    label: string;
    icon: ComponentType<Icon>;
  }[] = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/search", label: "Search", icon: SearchIcon },
    { path: "/playlists", label: "Your Library", icon: LibraryIcon },
  ];
  const openMenu = async () => {
    console.log("openMenu");
    await tick(); // wait for the DOM to update
    isMobileMenuOpen = true;
  };
  const handleEscape = (event: KeyboardEvent) => {
    console.log("handleEscape");
    if (event.key === "Escape") {
      closeMenu();
    }
  };
  const closeMenu = async () => {
    console.log("closeMenu");
    await tick(); // wait for the DOM to update
    isMobileMenuOpen = false;
    openMenuButton.getButton().focus();
  };
  beforeNavigate(() => {
    closeMenu();
  });
  const moveFocusToTop = (event: KeyboardEvent) => {
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
      closeMenuButton.getButton().focus();
    }
  };
  const moveFocusToBottom = (event: KeyboardEvent) => {
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      lastFocusableElement.focus();
    }
  };
</script>

<!-- inject style to head element to prevent scrolling on the body when mobile menu is open -->
<svelte:head>
  {#if !desktop && isMobileMenuOpen}
    <style>
      body {
        overflow: hidden;
      }
    </style>
  {/if}
</svelte:head>

<aside class="nav-content" class:desktop class:mobile={!desktop}>
  {#if !desktop && isMobileMenuOpen}
    <div
      class="overlay"
      on:click={closeMenu}
      transition:fade={{ duration: 200 }}
      on:keyup={handleEscape}
    />
  {/if}
  <nav aria-label="Main">
    {#if !desktop}
      <!-- The "Open" button for mobile devices -->
      <IconButton
        icon={MenuIcon}
        bind:this={openMenuButton}
        label="Open menu"
        on:click={openMenu}
        aria-expanded={isOpen}
        class="menu-button"
      />
    {/if}
    <!-- The navigation content -->
    <div
      class="nav-content-inner"
      class:is-hidden={!isOpen}
      style:visibility={isOpen ? "visible" : "hidden"}
      on:keyup={handleEscape}
    >
      {#if !desktop}
        <!-- The "Close" button for mobile devices -->
        <IconButton
          icon={X}
          bind:this={closeMenuButton}
          label="Close menu"
          on:click={closeMenu}
          aria-expanded={isOpen}
          class="menu-button"
        />
      {/if}
      <div class="logo-and-menu">
        <img src={logo} class="logo" alt="Spotify" />
        <ul>
          {#each menuItems as item, index}
            {@const iconProps = {
              focusable: "false",
              "aria-hidden": true,
              color: "var(--text-color)",
              size: 26,
              strokeWidth: 2,
            }}
            <li class:active={item.path === $page.url.pathname}>
              {#if menuItems.length === index + 1}
                <a
                  bind:this={lastFocusableElement}
                  href={item.path}
                  on:keydown={moveFocusToTop}
                >
                  <svelte:component this={item.icon} {...iconProps} />
                  {item.label}
                </a>
              {:else}
                <a href={item.path}>
                  <svelte:component this={item.icon} {...iconProps} />
                  {item.label}
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
      {#if userAllPlaylists && userAllPlaylists.length > 0}
        <div class="all-playlists">
          <ul>
            {#each userAllPlaylists as playlist}
              <li
                class:active={$page.url.pathname === `/playlist/${playlist.id}`}
              >
                <a href="/playlist/{playlist.id}">{playlist.name}</a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </nav>
</aside>

<style lang="scss">
  .nav-content {
    .overlay {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: var(--sidebar-color);
      opacity: 0.75;
      z-index: 100;
      @include breakpoint.up("md") {
        display: none;
      }
    }
    .logo {
      max-width: 100%;
      width: 130px;
    }
    .nav-content-inner {
      padding: 20px;
      min-width: var(--sidebar-width);
      background-color: var(--sidebar-color);
      height: 100vh;
      overflow: auto;
      display: none;
      .logo-and-menu {
        padding: 20px 20px 0;
        overflow: hidden;
      }
      .all-playlists {
        flex: 1;
        overflow: auto;
        padding: 15px 20px;
        border-top: 1px solid var(--border);
        :global(html.no-js) & {
          @include breakpoint.down("md") {
            display: none;
          }
        }
        ul {
          list-style: none;
          margin: 0;
          li {
            margin: 0 0 5px;
            a {
              margin: 0;
            }
          }
        }
      }
      :global(html.no-js) & {
        @include breakpoint.down("md") {
          display: block;
          height: auto;
        }
      }
      ul {
        padding: 0;
        margin: 20px 0 0;
        list-style: none;
        li {
          &.active {
            a {
              opacity: 1;
            }
          }
          a {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: var(--text-color);
            font-size: functions.toRem(14);
            font-weight: 500;
            padding: 5px;
            margin: 10px 0;
            opacity: 0.7;
            transition: opacity 0.2s;
            &:hover,
            &:focus {
              opacity: 1;
            }
            :global(svg) {
              margin-right: 12px;
            }
          }
        }
      }
    }
    &.desktop {
      position: sticky;
      top: 0;
      .nav-content-inner {
        @include breakpoint.up("md") {
          display: flex;
          flex-direction: column;
        }
      }
    }
    &.mobile .nav-content-inner {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      transition: transform 200ms, opacity 200ms;
      &.is-hidden {
        transition: transform 200ms, opacity 200ms, visibility 200ms;
        transform: translateX(-100%);
        opacity: 0;
      }
      @include breakpoint.down("md") {
        display: flex;
        flex-direction: column;
      }
    }
    :global(.menu-button) {
      @include breakpoint.up("md") {
        display: none;
      }
    }
    :global(.close-menu-button) {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>
