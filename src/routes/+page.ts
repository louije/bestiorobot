import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { phrases } from "@/lib/svgloader";

export const load = (() => {
  if (phrases.length > 0) {
    return { phrases };
  }
  throw error(404, "Not found");
}) satisfies PageLoad;
