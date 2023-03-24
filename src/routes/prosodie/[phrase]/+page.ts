import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
  if (params.phrase && params.phrase !== "") {
    return {
      phrase: params.phrase
    };
  }
  throw error(404, "Not found");
}) satisfies PageLoad;