import type { PageLoad } from "./$types";
import type { LevelSlug, MonsterSlug } from "$/src/lib/finder";
import { redirect } from "@sveltejs/kit";
import Finder from "$/src/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  const data = finder.go([params.monster as MonsterSlug, parseInt(params.level) as LevelSlug]);

  if (data.navigation?.redirect) {
    throw redirect(302, data.navigation.redirect);
  }
  return data;
}) satisfies PageLoad;
