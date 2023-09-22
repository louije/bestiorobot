import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MonsterSlug } from "$/src/lib/finder";
import Finder from "$/src/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  if (!finder.checkLevel(params.monster as MonsterSlug, params.level)) {
    throw error(404, "Not found");
  }
  return {
    monster: params.monster,
    level: params.level,
  }
}) satisfies PageLoad;
