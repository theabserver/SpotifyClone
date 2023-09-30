import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, request }) => {
  cookies.delete("spotify_auth_refresh_token", { path: "/" });
  cookies.delete("spotify_auth_access_token", { path: "/" });
  if (request.headers.get("accept") === "application/json") {
    return json({ success: true });
  }
  //   called for form submit only
  throw redirect(303, "/login");
};
