import { Search } from "lucide-svelte";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params, url, route, depends }) => {
  depends(`app:${route.id}`);
  const query = params.query;
  const searchParams = new URLSearchParams({
    q: query,
    type: "album,artist,playlist",
    limit: "6",
  }).toString();
  const resultsResponse = await fetch(`api/spotify/search?${searchParams}`);
  if (!resultsResponse.ok) {
    throw error(resultsResponse.status, "Failed to fetch search results");
  }
  const resultsJSON: SpotifyApi.SearchResponse = await resultsResponse.json();
  return {
    searchResults: resultsJSON,
    title: `Search results for ${query}`,
  };
};
