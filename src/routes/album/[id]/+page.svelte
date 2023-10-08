<script lang="ts">
  import type { PageData } from "./$types";
  import { getCopyrightSymbol } from "$helpers";
  import { ItemPage } from "$components";
  import TrackList from "$components/TrackList.svelte";
  import Button from "$components/Button.svelte";
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
      {#each album.artists as artist, index}
        <a href="/artist/{artist.id}">{artist.name}</a>
        {index + 1 < album.artists.length ? ", " : ""}
      {/each}
    </span>
    <span class="date">
      {new Date(album.release_date).getFullYear()}
    </span>
    <span class="track-count">
      {album.total_tracks}
      {album.total_tracks === 1 ? "track" : "tracks"}
    </span>
  </p>
  <!-- User can't own album, so there is no isOwner property -->
  <TrackList
    tracks={album.tracks.items}
    userPlaylists={data.userAllPlaylists?.filter(
      (pl) => pl.owner.id === data.user?.id
    )}
  />
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
