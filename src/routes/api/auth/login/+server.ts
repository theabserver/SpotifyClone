import { redirect, type RequestHandler } from "@sveltejs/kit";
import { SPOTIFY_APP_CLIENT_ID, BASE_URL } from "$env/static/private";
import pkce from "pkce-gen";

const scope =
  "ugc-image-upload user-modify-playback-state user-read-playback-state user-read-currently-playing user-follow-modify user-follow-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read";
const generateRandomString = (length: number) => {
  let randomString = "";
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    randomString += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return randomString;
};

const state = generateRandomString(16),
  challenge = pkce.create();
export const GET: RequestHandler = async ({ cookies }) => {
  cookies.set("spotify_auth_state", state);
  cookies.set("spotify_auth_challenge", challenge.code_verifier);
  throw redirect(
    307,
    `https://accounts.spotify.com/authorize?${new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_APP_CLIENT_ID,
      scope: scope,
      redirect_uri: `${BASE_URL}/api/auth/callback`,
      state,
      code_challenge_method: "S256",
      code_challenge: challenge.code_challenge,
    }).toString()}`
  );
};
