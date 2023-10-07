<script lang="ts" context="module">
  // Share this among all Player instances
  let current: HTMLAudioElement;
</script>

<script lang="ts">
  import { Pause, Play } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import TrackList from "./TrackList.svelte";

  type Track = SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;
  export let track: Track;

  let audio: HTMLAudioElement;
  let paused = true;

  const dispatcher = createEventDispatcher<{
    play: { track: Track };
    pause: { track: Track };
  }>();

  function onPlay() {
    if (current && current !== audio) {
      current.currentTime = 0;
      //   Pause other players
      current.pause();
    }
    current = audio;
    dispatcher("play", { track });
  }
  function onPause() {
    paused = true;
    dispatcher("pause", { track });
  }
</script>

<div class="player">
  <audio
    bind:this={audio}
    bind:paused
    controls
    src={track.preview_url}
    preload="none"
    on:play={onPlay}
    on:pause={onPause}
  />
  <button
    on:click={() => {
      // If the audio is paused, play it
      if (paused) {
        audio.play();
      }
      // Otherwise, pause the audio
      else {
        audio.pause();
      }
    }}
    aria-label="paused ? Play {track.name} : Pause {track.name}"
  >
    {#if paused}
      <Play aria-hidden focusable="false" color="var(--text-color)" />
    {:else}
      <Pause aria-hidden focusable="false" color="var(--text-color)" />
    {/if}
  </button>
</div>

<style lang="scss">
  .player {
    audio {
      display: none;
    }
    button {
      width: 12px;
      height: 12px;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      :global(svg) {
        fill: var(--text-color);
        width: 12px;
        height: 12px;
      }
    }
  }
</style>
