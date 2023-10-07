<script lang="ts">
  import { Clock8, ListPlus } from "lucide-svelte";
  import msToTime from "$helpers/msToTime";
  import { Player } from "$components";
  import playingGif from "$assets/playing.gif";
  export let tracks:
    | SpotifyApi.TrackObjectFull[]
    | SpotifyApi.TrackObjectSimplified[];

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
    <div class="actions-column" />
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
      <div class="actions-column">
        <ListPlus aria-hidden focusable="false" />
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
						span.number,
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
			}
			.info-column {
				flex: 1;
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
			}
			.actions-column {
				width: 30px;
				margin-left: 15px;
			}
		}
	}
</style>