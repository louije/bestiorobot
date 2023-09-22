import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import Finder from "$/src/lib/finder";

export const load = (async ({ params }) => {
  const finder = new Finder();
  if (!finder.checkMonster(params.monster)) {
    throw error(404, "Not found");
  }
  throw redirect(302, `/${params.monster}/1`);
}) satisfies PageLoad;
