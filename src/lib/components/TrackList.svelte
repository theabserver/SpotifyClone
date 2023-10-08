<script lang="ts">
  import { Clock8, ListPlus, ListX } from "lucide-svelte";
  import msToTime from "$helpers/msToTime";
  import { Button, Player } from "$components";
  import playingGif from "$assets/playing.gif";
  import tippy, { hideAll } from "tippy.js";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { toasts } from "$stores";
  import { invalidate } from "$app/navigation";
  export let tracks:
    | SpotifyApi.TrackObjectFull[]
    | SpotifyApi.TrackObjectSimplified[];
  export let isOwner: boolean = false;
  export let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] | undefined;
  let isAddingToPlaylist: string[] = [];
  let isRemovingFromPlaylist: string[] = [];
  let currentlyPlaying: string | null = null;
  let isPaused: boolean = false;
</script>

<div class="tracks">
  <div class="row header">
    <div class="number-column">
      <span>#</span>
    </div>
    <div class="info-column">
      <span class="track-title">Title</span>
    </div>
    <div class="duration-column">
      <Clock8 aria-hidden focusable="false" color="var(--light-gray)" />
    </div>
    <div class="actions-column" class:is-owner={isOwner} />
  </div>
  {#each tracks as track, index}
    <div class="row" class:is-current={currentlyPlaying === track.id}>
      <div class="number-column">
        {#if currentlyPlaying === track.id && !isPaused}
          <img src={playingGif} alt="Playing" />
        {:else}
          <span class="number">{index + 1}</span>
        {/if}
        <div class="player">
          <Player
            {track}
            on:play={(e) => {
              currentlyPlaying = e.detail.track.id;
              isPaused = false;
            }}
            on:pause={(e) => {
              isPaused = currentlyPlaying === e.detail.track.id;
            }}
          />
        </div>
      </div>
      <div class="info-column">
        <div class="track-title">
          <h4>{track.name}</h4>
          {#if track.explicit}
            <span class="explicit" title="Explicit"> Explicit </span>
          {/if}
        </div>
        <p class="artists">
          {#each track.artists as artist, artistsIndex}
            <a href="/artist/{artist.id}">{artist.name}</a
            >{#if artistsIndex < track.artists.length - 1}
              {", "}
            {/if}
          {/each}
        </p>
      </div>
      <div class="duration-column">
        <span class="duration">
          {msToTime(track.duration_ms)}
        </span>
      </div>
      <div class="actions-column" class:is-owner={isOwner}>
        {#if isOwner}
          <!-- Display a form to remove the track from the playlist if the user is the owner -->
          <form
            method="POST"
            action="/playlist/{$page.params.id}?/removeItem"
            use:enhance={({ cancel }) => {
              // Check if the track is already being removed from the playlist
              if (isRemovingFromPlaylist.includes(track.id)) {
                cancel(); // Cancel the enhance function if the track is already being removed
              }

              // Add the track ID to the isRemovingFromPlaylist array
              isRemovingFromPlaylist = [...isRemovingFromPlaylist, track.id];

              // Return a function that will be called when the enhance function is finished
              return ({ result }) => {
                if (result.type === "error") {
                  // If the result is an error, display an error toast
                  toasts.error(result.error.message);
                }
                if (result.type === "redirect") {
                  // If the result is a redirect, handle the redirect URL
                  const url = new URL(`${$page.url.origin}${result.location}`);
                  const error = url.searchParams.get("error");
                  const success = url.searchParams.get("success");
                  if (error) {
                    // If the redirect URL has an error parameter, display an error toast
                    toasts.error(error);
                  }
                  if (success) {
                    // If the redirect URL has a success parameter, display a success toast and invalidate the playlist cache
                    toasts.success(success);
                    invalidate(`/api/spotify/playlists/${$page.params.id}`);
                  }
                }

                // Remove the track ID from the isRemovingFromPlaylist array
                isRemovingFromPlaylist = isRemovingFromPlaylist.filter(
                  (t) => t !== track.id
                );
              };
            }}
          >
            <input hidden name="track" value={track.id} />
            <button
              type="submit"
              title="Remove {track.name} from playlist"
              aria-label="Remove {track.name} from playlist"
              class="remove-pl-button"
              disabled={isRemovingFromPlaylist.includes(track.id)}
            >
              <ListX aria-hidden focusable="false" />
            </button>
          </form>
        {:else}
          <button
            title="Add {track.name} to a playlist"
            aria-label="Add {track.name} to a playlist"
            class="add-pl-button"
            disabled={!userPlaylists}
            use:tippy={{
              content:
                document.getElementById(`${track.id}-playlists-menu`) ||
                undefined,
              allowHTML: true,
              trigger: "click",
              interactive: true,
              theme: "menu",
              placement: "bottom-end",
              onMount: () => {
                // Get the playlists menu template element by ID
                const template = document.getElementById(
                  `${track.id}-playlists-menu`
                );

                // If the template element exists, display it
                if (template) {
                  template.style.display = "block";
                }
              },
            }}
          >
            <ListPlus aria-hidden focusable="false" />
          </button>
          {#if userPlaylists}
            <div
              class="playlists-menu"
              id="{track.id}-playlists-menu"
              style="display: none;"
            >
              <div class="playlists-menu-content">
                <!-- Redirect to the page that invoked the form -->
                <form
                  method="POST"
                  action="/playlist?/addItem&redirect={$page.url.pathname}"
                  use:enhance={({ cancel }) => {
                    // Check if the track is already being added to a playlist
                    if (isAddingToPlaylist.includes(track.id)) {
                      cancel(); // Cancel the enhance function if the track is already being added
                    }

                    // Add the track ID to the isAddingToPlaylist array
                    isAddingToPlaylist = [...isAddingToPlaylist, track.id];

                    // Return a function that will be called when the enhance function is finished
                    return ({ result }) => {
                      // Handle the result of the enhance function
                      if (result.type === "error") {
                        // If the result is an error, display an error toast
                        toasts.error(result.error.message);
                      }
                      if (result.type === "redirect") {
                        // If the result is a redirect, handle the redirect URL
                        const url = new URL(
                          `${$page.url.origin}${result.location}`
                        );
                        const error = url.searchParams.get("error");
                        const success = url.searchParams.get("success");
                        if (error) {
                          // If the redirect URL has an error parameter, display an error toast
                          toasts.error(error);
                        }
                        if (success) {
                          // If the redirect URL has a success parameter, display a success toast and hide all modals
                          toasts.success(success);
                          hideAll();
                        }
                      }

                      // Remove the track ID from the isAddingToPlaylist array
                      isAddingToPlaylist = isAddingToPlaylist.filter(
                        (t) => t !== track.id
                      );
                    };
                  }}
                >
                  <input hidden value={track.id} />
                  <div class="field">
                    <select aria-label="Playlist" name="playlist">
                      {#each userPlaylists as playlist}
                        <option value={playlist.id}>{playlist.name}</option>
                      {/each}
                    </select>
                  </div>
                  <div class="submit-button">
                    <Button element="button" type="submit">
                      Add <span class="visually-hidden">
                        {track.name} to selected playlist.</span
                      >
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .tracks {
    .row {
      display: flex;
      align-items: center;
      padding: 7px 5px;
      border-radius: 4px;
      @include breakpoint.down("md") {
        :global(.no-js) & {
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.03);
          padding: 20px;
          margin-bottom: 20px;
        }
      }
      &.is-current {
        .info-column .track-title h4,
        .number-column span.number {
          color: var(--accent-color);
        }
      }
      &.header {
        border-bottom: 1px solid var(--border);
        border-radius: 0px;
        padding: 5px;
        margin-bottom: 15px;
        @include breakpoint.down("md") {
          :global(.no-js) & {
            display: none;
          }
        }
        .track-title {
          color: var(--light-gray);
          font-size: functions.toRem(12);
          text-transform: uppercase;
        }
        .duration-column :global(svg) {
          width: 16px;
          height: 16px;
        }
      }
      &:not(.header) {
        &:hover {
          background-color: rgba(255, 255, 255, 0.05);
          .number-column {
            .player {
              display: block;
            }
            span.number {
              display: none;
              :global(.no-js) & {
                display: block;
              }
            }
            .playing-gif {
              display: none;
            }
          }
        }
      }
      .number-column {
        width: 30px;
        display: flex;
        justify-content: flex-end;
        margin-right: 15px;
        span.number {
          color: var(--light-gray);
          font-size: functions.toRem(14);
        }
        .playing-gif {
          width: 12px;
        }
        .player {
          display: none;
        }
        :global(html.no-js) & {
          width: 200px;
          display: flex;
          align-items: center;
          @include breakpoint.down("md") {
            width: 100%;
            margin-right: 0;
            margin-bottom: 15px;
          }
          .player {
            display: block;
            width: 100%;
            margin-left: 10px;
          }
        }
      }
      .info-column {
        flex: 1;
        @include breakpoint.down("md") {
          :global(.no-js) & {
            width: 100%;
          }
        }
        .track-title {
          display: flex;
          align-items: center;
          h4 {
            margin: 0;
            font-size: functions.toRem(15);
            font-weight: 400;
            line-height: 1;
          }
          span.explicit {
            text-transform: uppercase;
            font-size: functions.toRem(8);
            margin-left: 10px;
            border: 1px solid;
            padding: 2px 3px;
            border-radius: 2px;
            line-height: functions.toRem(10);
            color: var(--light-gray);
          }
        }
        .artists {
          color: var(--light-gray);
          font-size: functions.toRem(13);
          margin: 7px 0 0;
          line-height: 1;
          a {
            color: inherit;
            text-decoration: none;
          }
        }
      }
      .duration-column {
        span.duration {
          color: var(--light-gray);
          font-size: functions.toRem(14);
        }
        @include breakpoint.down("md") {
          :global(.no-js) & {
            width: 100%;
            margin: 10px 0;
          }
        }
      }
      .actions-column {
        width: 30px;
        margin-left: 15px;
        .add-pl-button {
          background: none;
          border: none;
          padding: 5px;
          cursor: pointer;
          :global(svg) {
            stroke: var(--text-color);
            vertical-align: middle;
            width: 22px;
            height: 22px;
          }
          &:disabled {
            opacity: 0.8;
            cursor: not-allowed;
          }
        }
        .playlists-menu-content {
          padding: 15px;
          .field {
            select {
              width: 100%;
              height: 35px;
              border-radius: 4px;
            }
          }
          .submit-button {
            margin-top: 10px;
            text-align: right;
          }
        }
      }
    }
  }
</style>
