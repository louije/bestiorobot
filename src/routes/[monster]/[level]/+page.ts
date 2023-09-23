import type { PageLoad } from "./$types";
import type { LevelSlug, MonsterSlug } from "$/src/lib/finder";
import Finder from "$/src/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  const data = finder.go([params.monster as MonsterSlug, parseInt(params.level) as LevelSlug]);

  return data;
}) satisfies PageLoad;
