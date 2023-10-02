import { SPOTIFY_BASE_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
  const access_token = cookies.get("spotify_auth_access_token");
  const refresh_token = cookies.get("spotify_auth_refresh_token");
  if (!access_token) {
    return { user: null };
  }
  const profileResponse = await fetch(`${SPOTIFY_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (profileResponse.ok) {
    const user: SpotifyApi.CurrentUsersProfileResponse =
      await profileResponse.json();
    return { user };
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
