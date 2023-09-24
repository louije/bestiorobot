import type { PageLoad } from "./$types";
import type { MonsterSlug } from "$/src/lib/finder";
import Finder from "@/lib/finder";

export const load = (({ params }) => {
  const finder = new Finder();
  const data = finder.go([params.monster as MonsterSlug], { outro: true });
  console.log(data)
  return data;
}) satisfies PageLoad;
