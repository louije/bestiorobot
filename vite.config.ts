import { sveltekit } from "@sveltejs/kit/vite";
import svg from "@poppanator/sveltekit-svg";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    svg({
      svgoOptions: {
        plugins: [
          { name: "collapseGroups" }
          // { name: 'cleanupIds', params: { remove: false, minify: false, } },
          // { name: "preset-default", params: { cleanupIds: false } },
          // { name: "removeAttrs", params: { attrs: "(fill|stroke|style)" } },
        ]
      }
    })
  ]
});
