import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MonsterSlug, LevelSlug } from "$/src/lib/finder";
import Finder from "$/src/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  const monster = params.monster as MonsterSlug;
  const level = parseInt(params.level) as LevelSlug;
  const board = params.board;

  if (!finder.checkBoard(monster, level, board)) {
    throw error(404, "Not found");
  }
  return finder.fileForRoute([monster, level, board]);

}) satisfies PageLoad;
