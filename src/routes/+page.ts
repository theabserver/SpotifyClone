import type { PageLoad } from "./$types";
import { fetchRefresh } from "$lib/helpers";

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
  const { user } = await parent();
  // we need to wrap the fetch function so that it will refresh the token if it is expired
  const fetch = (path: string) => fetchRefresh(_fetch, path);
  // we don't need to await these requests, so we can make them in parallel
  const newReleases = fetch("/api/spotify/browse/new-releases?limit=6");
  const featuredPlaylists = fetch(
    "/api/spotify/browse/featured-playlists?limit=6"
  );
  const userPlaylists = fetch(
    `/api/spotify/users/${user?.id}/playlists?limit=6`
  );
  // wait for this data to be available before the page is rendered
  const categoriesResponse = await fetch(`api/spotify/browse/categories`);
  const categoriesResponseJSON:
    | SpotifyApi.MultipleCategoriesResponse
    | undefined = categoriesResponse.ok
    ? await categoriesResponse.json()
    : undefined;
  // get random 3 categories from the categoriesResponseJSON
  const random3Categories = categoriesResponseJSON
    ? categoriesResponseJSON?.categories.items
        .sort(() => Math.random() - Math.random())
        .slice(0, 3)
    : [];
  // Fetch the playlists for randomCategories
  const randomPlaylistPromises = random3Categories.map(
    async (category) =>
      await fetch(
        `api/spotify/browse/categories/${category.id}/playlists?limit=6`
      )
  );

  // wait for all the requests to resolve
  const [
    newReleasesResponse,
    featuredPlaylistsResponse,
    userPlaylistsResponse,
    ...randomPlaylistResponse
  ] = await Promise.all([
    newReleases,
    featuredPlaylists,
    userPlaylists,
    ...randomPlaylistPromises,
  ]);
  return {
    newReleases: newReleasesResponse.ok
      ? (newReleasesResponse.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>) // specify the type
      : undefined,
    featuredplaylists: featuredPlaylistsResponse.ok
      ? (featuredPlaylistsResponse.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse>)
      : undefined,
    userplaylists: userPlaylistsResponse.ok
      ? (userPlaylistsResponse.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>)
      : undefined,
    categories: random3Categories,
    categoriesPlaylists: await Promise.all(
      randomPlaylistResponse.map(async (response) =>
        response.ok ? response.json() : undefined
      )
    ),
  };
};
