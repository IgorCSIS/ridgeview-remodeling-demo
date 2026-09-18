// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Astro config for the Ridgeview Remodeling demo.
 *
 * `site` and `base` both matter for GitHub Pages. Deploying to
 * <user>.github.io/<repo> means every internal link and asset URL has to
 * carry the repo name, or it 404s in production while working fine locally.
 * If this ever moves to a custom domain, set `site` to the apex and delete
 * `base`.
 */
export default defineConfig({
  site: "https://igorcsis.github.io",
  base: "/ridgeview-remodeling-demo",
  integrations: [
    tailwind({
      // We inject Tailwind's base stylesheet ourselves in global.css so our
      // own base layer can sit alongside it rather than fight it.
      applyBaseStyles: false,
    }),
    sitemap({
      // The thank-you page is a post-conversion destination, not a landing
      // page. It carries noindex, so keep it out of the sitemap too.
      filter: (page) => !page.includes("/thanks"),
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@assets": path.resolve(__dirname, "./src/assets"),
      },
    },
  },
});
