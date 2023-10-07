import { SPOTIFY_BASE_URL } from "$env/static/private";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  followPlaylist: async ({ cookies, params, fetch, request }) => {
    debugger;
    console.log(`fetching url: ${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`);
    const res = await fetch(
      `${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookies.get("spotify_auth_access_token")}`,
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      return fail(res.status, { followError: res.statusText });
    }
  },
  unFollowPlaylist: async ({ cookies, params, fetch }) => {
    debugger;
    const res = await fetch(
      `${SPOTIFY_BASE_URL}/playlists/${params.id}/followers`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.get("spotify_auth_access_token")}`,
        },
      }
    );
    if (!res.ok) {
      return fail(res.status, { followError: res.statusText });
    }
  },
};
