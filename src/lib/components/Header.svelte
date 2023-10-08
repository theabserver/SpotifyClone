<script lang="ts">
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { HeaderNav, Navigation, SearchForm } from "$components";
  import tippy from "$actions/tippy";
  import { ChevronDown, ExternalLink } from "lucide-svelte";
  import LogoutButton from "./LogoutButton.svelte";
  $: user = $page.data.user;
  export let userAllPlaylists:
    | SpotifyApi.PlaylistObjectSimplified[]
    | undefined;
</script>

<div class="content">
  <!-- The left side of the header -->
  <div class="left">
    <!-- The navigation component for mobile devices -->
    {#if browser}
      <Navigation desktop={false} {userAllPlaylists} />
    {/if}
    {#if $page.url.pathname.startsWith("/search")}
      <div class="search-form">
        <SearchForm />
      </div>
    {/if}
    <HeaderNav />
  </div>
  <!-- The right side of the header -->
  <div class="right">
    <div id="profileButton">
      <button
        class="profile-button"
        use:tippy={{
          content: document.getElementById("profileMenu") || undefined,
          onMount: () => {
            const template = document.getElementById("profileMenu");
            if (template) {
              template.style.display = "block";
            }
          },
          trigger: "click",
          placement: "bottom-end",
          interactive: true,
          theme: "menu",
        }}
      >
        {#if user?.images && user?.images.length > 0}
          <img src={user.images[0].url} width="32px" height="32px" alt="" />
        {/if}
        {user?.display_name} <span class="visually-hidden">Profile-menu</span>
        <ChevronDown class="profile-arrow" size={22} />
      </button>
    </div>
    <div id="profileMenu" style="display: none;">
      <ul>
        <li>
          <a
            href={user?.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            >View on Spotify
            <ExternalLink focusable="false" aria-hidden size={20} />
          </a>
        </li>
        <li><a href="/profile">View Profile</a></li>
        <li><LogoutButton /></li>
      </ul>
    </div>
  </div>
</div>

<style lang="scss">
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .profile-button {
    background: none;
    border: 1px solid var(--border);
    padding: 5px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    color: var(--text-color);
    cursor: pointer;
    :global(.profile-arrow) {
      margin-left: 3px;
    }
    img {
      width: 28px;
      height: 28px;
      border-radius: 100%;
      margin-right: 10px;
    }
    &:hover {
      background-color: var(--accent-color);
    }
  }
  #profileMenu {
    padding: 5px 0;
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      li {
        &:hover {
          background-image: linear-gradient(rgba(255, 255, 255, 0.07) 0 0);
        }
        a :global(svg) {
          vertical-align: middle;
          margin-left: 10px;
        }
        a,
        :global(button) {
          display: inline-block;
          padding: 10px 15px;
          background: none;
          border: none;
          text-decoration: none;
          cursor: pointer;
          color: var(--menu-text-color);
          width: 100%;
          text-align: left;
          font-size: functions.toRem(14);
        }
      }
    }
  }
</style>
