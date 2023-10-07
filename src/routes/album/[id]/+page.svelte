<script lang="ts">
  import type { PageData } from "./$types";
  import { getCopyrightSymbol } from "$helpers";
  import { ItemPage } from "$components";
  import TrackList from "$components/TrackList.svelte";
  export let data: PageData;

  $: album = data.album;
  $: color = data.color;
</script>

<ItemPage
  title={album.name}
  type={album.album_type}
  {color}
  image={album.images.length > 0 ? album.images[0].url : undefined}
>
  <p class="meta" slot="meta">
    <span class="artists">
      {album.artists.map((artist) => artist.name).join(", ")}
    </span>
    <span class="date">
      {new Date(album.release_date).getFullYear()}
    </span>
    <span class="track-count">
      {album.total_tracks}
      {album.total_tracks === 1 ? "track" : "tracks"}
    </span>
  </p>
  <div class="tracks">
    <ul>
      {#each album.tracks.items as tracks}
        <li>
          {tracks.name}
        </li>
      {/each}
    </ul>
  </div>
  <TrackList tracks={album.tracks.items} />
  <div class="credits">
    <p class="date">
      {new Date(album.release_date).toLocaleDateString()}
    </p>
    {#each album.copyrights as copyrightObj}
      <p>{getCopyrightSymbol(copyrightObj.type)} {copyrightObj.text}</p>
    {/each}
  </div>
</ItemPage>

<style lang="scss">
  .meta {
    font-size: functions.toRem(13);
    font-weight: 600;
    span {
      margin-right: 5px;
      &.tracks-count {
        font-weight: 400;
        margin: 0 0 0 5px;
        color: var(--light-gray);
      }
    }
  }
  .credits {
    margin-top: 40px;
    p {
      color: var(--light-gray);
      margin: 0;
      font-size: functions.toRem(11);
      &.date {
        font-size: functions.toRem(13);
      }
    }
  }
</style>
