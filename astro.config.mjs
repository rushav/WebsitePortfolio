// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://rushav.github.io/WebsitePortfolio/
export default defineConfig({
  site: 'https://rushav.github.io',
  base: '/WebsitePortfolio',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
