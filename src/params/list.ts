import type { ParamMatcher } from "@sveltejs/kit";

/*
routes to match:
  section/new-releases
  section/featured-playlists
  category/[id]
  profile/following
  artist/[id]/albums
  artist/[id]/appears-on
  artist/[id]/related-artists
 */
export const match: ParamMatcher = (param) => {
  return ["section", "category", "artist", "profile"].includes(param);
};
