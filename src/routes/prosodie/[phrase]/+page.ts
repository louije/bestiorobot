import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { loadPhrase } from "@/lib/svgloader";

export const load = (({ params }) => {
  const data = loadPhrase(params.phrase);
  if (data) {
    return data;
  }
  throw error(404, "Not found");
}) satisfies PageLoad;
