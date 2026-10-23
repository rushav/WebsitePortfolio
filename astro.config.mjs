// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  // GitHub Pages project site: https://rushav.github.io/WebsitePortfolio/
  // `base` must match the repository name; all internal links go through
  // `import.meta.env.BASE_URL` (src/lib/url.ts) so nothing else needs to change.
  site: 'https://rushav.github.io',
  base: '/WebsitePortfolio',

  build: {
    // Keep `/projects/` style URLs with trailing slashes so GitHub Pages
    // serves `index.html` without a redirect.
    format: 'directory',
  },
  trailingSlash: 'always',
});
