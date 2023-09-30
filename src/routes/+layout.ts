import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data, url }) => {
  const { user } = data || {},
    isIoginURL = url.pathname === "/login";
  if (user && isIoginURL) {
    throw redirect(307, "/");
  }
  if (!user && !isIoginURL) {
    throw redirect(307, "/login");
  }
  return { user };
};
