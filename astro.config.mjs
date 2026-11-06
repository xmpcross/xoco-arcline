// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import rehypeFigureCredit from "./src/lib/rehype-figure-credit.ts";
import { siteConfig } from "./src/config/site.ts";

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug, rehypeFigureCredit],
    }),
    // Arcline is an editorial theme, not a developer blog: no syntax
    // highlighter is bundled and fenced blocks stay plain markup.
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
