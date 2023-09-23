import type { PageLoad } from "./$types";
import type { MonsterSlug, LevelSlug } from "$/src/lib/finder";
import Finder from "$/src/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  const monster = params.monster as MonsterSlug;
  const level = parseInt(params.level) as LevelSlug;
  const board = params.board;

  const data = finder.go([monster, level, board]);
  console.log(data)
  return data;

}) satisfies PageLoad;
