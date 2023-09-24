import type { PageLoad } from "./$types";
import Finder from "../lib/finder";

export const load = (() => {
  const finder = new Finder();
  const data = finder.go([]);
  return data;
}) satisfies PageLoad;
