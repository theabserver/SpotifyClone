import { browser } from "$app/environment";
import { error } from "@sveltejs/kit";

export default async function fetchRefresh(
  fetch: (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>,
  path: string
) {
  const req = fetch(path);
  // server side
  if (!browser) return req;
  // client side
  const res = await req;
  // if the response is 401, refresh the token and try again
  if (res.status === 401) {
    if (!window.refreshPromise) {
      window.refreshPromise = fetch("/api/auth/refresh").finally(() => {
        window.refreshPromise = null;
      });
    }
    const refreshRes = await window.refreshPromise;
    if (!refreshRes.ok) throw error(401, "Session Expired!");
    return fetch(path);
  } else {
    return res;
  }
}
