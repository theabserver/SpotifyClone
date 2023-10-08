import { SPOTIFY_BASE_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
  const access_token = cookies.get("spotify_auth_access_token");
  const refresh_token = cookies.get("spotify_auth_refresh_token");
  if (!access_token) {
    return { user: null };
  }
  //  get user profile
  const profileResponse = await fetch(`${SPOTIFY_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (profileResponse.ok) {
    const user: SpotifyApi.CurrentUsersProfileResponse =
      await profileResponse.json();
    let userAllPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];
    // get user playlists
    const userPlaylistsRes = await fetch("/api/spotify/me/playlists?limit=50");
    if (userPlaylistsRes.ok) {
      // TODO check why playlists has no data
      const userPlaylistsResJSON: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
        await userPlaylistsRes.json();
      userAllPlaylists = userPlaylistsResJSON.items;
      // console.log(userAllPlaylists);
    }
    return {
      user,
      userAllPlaylists,
    };
  }
  if (profileResponse.status === 401 && refresh_token) {
    //refresh token
    const response = await fetch(`/api/auth/refresh`);
    if (response.ok) {
      throw redirect(307, url.pathname);
    }
    return {
      user: null,
    };
  } else {
    return { user: null };
  }
};
