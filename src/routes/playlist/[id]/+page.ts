import { fetchRefresh } from "$helpers";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({
  fetch: _fetch,
  params,
  depends,
  route,
  url,
  parent,
}) => {
  depends(`app:${route.id}`);
  const fetch = (path: string) => fetchRefresh(_fetch, path);
  const limit = 100;
  const page = url.searchParams.get("page");
  // Fetch the user object from the parent component
  const { user } = await parent();

  // Fetch the playlist data and check if the user is following the playlist
  const [playlistResponse, isFollowingResponse] = await Promise.all([
    fetch(`/api/spotify/playlists/${params.id}`),
    fetch(
      `/api/spotify/playlists/${
        params.id
      }/followers/contains?${new URLSearchParams({
        ids: user ? user.id : "",
      }).toString()}`
    ),
  ]);

  // Initialize the isFollowing variable to null
  let isFollowing: boolean | null = null;

  // If the isFollowingResponse is OK, parse the JSON and set the isFollowing variable
  if (isFollowingResponse.ok) {
    const isFollowingJSON: SpotifyApi.UsersFollowPlaylistResponse =
      await isFollowingResponse.json();
    isFollowing = isFollowingJSON[0];
  }

  if (!playlistResponse.ok) {
    throw error(playlistResponse.status, "Failed to load playlist!");
  }

  const playlistResJSON: SpotifyApi.SinglePlaylistResponse =
    await playlistResponse.json();
  if (page && page !== "1") {
    const tracksRes = await fetch(
      `/api/spotify/playlists/${params.id}/tracks?${new URLSearchParams({
        limit: `${limit}`,
        offset: `${limit * (Number(page) - 1)}`,
      }).toString()}`
    );
    if (!tracksRes.ok) {
      throw error(tracksRes.status, "Failed to load playlist!");
    }
    const tracksResJSON = await tracksRes.json();
    playlistResJSON.tracks = tracksResJSON;
  }
  let color = null;
  if (playlistResJSON.images.length > 0) {
    const colorRes = await fetch(
      `/api/average-color?${new URLSearchParams({
        image: playlistResJSON.images[0].url,
      }).toString()}`
    );

    if (colorRes.ok) {
      color = (await colorRes.json()).color;
    }
  }

  return {
    playlist: playlistResJSON,
    color,
    title: playlistResJSON.name,
    isFollowing,
  };
};
