import { SPOTIFY_BASE_URL } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import { error } from "console";

// This file handles all Spotify API calls
export const GET: RequestHandler = async ({ fetch, cookies, params, url }) => {
  const access_token = cookies.get("access_token");
  console.log(
    `Fetching: ${SPOTIFY_BASE_URL}/${params.path}/${params.path}${url.search}`
  );
  const response = await fetch(
    `${SPOTIFY_BASE_URL}/${params.path}/${params.path}${url.search}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const responseJSON = await response.json();
  if (responseJSON.error) {
    throw error(responseJSON.error.status, responseJSON.error.message);
  }
  return responseJSON;
};
