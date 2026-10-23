# Portfolio v3

A content-free skeleton for a robotics engineer's portfolio. Astro, static output, plain CSS with custom properties, self-hosted fonts. No framework, no Tailwind, no component library.

## Run

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # writes ./dist
npm run preview    # serves ./dist (use this for Lighthouse)
npm run check      # Astro + TypeScript diagnostics
```

Node 20 or newer.

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | **All content.** One typed object. Every string is a `[[placeholder]]` right now. |
| `src/styles/tokens.css` | Colour, type, radius, spacing and motion tokens. Light is default, dark under `[data-theme="dark"]`. |
| `src/styles/global.css` | Reset, shared primitives (`.chip`, `.btn`, `.card`, `.media`, `.label`, `.bullets`). |
| `src/layouts/BaseLayout.astro` | `<head>`, no-flash theme script, skip link, wraps everything in `Frame`. |
| `src/components/Frame.astro` | The rounded frame and the two-column grid. Collapses below 900px. |
| `src/components/Sidebar.astro` | Nav, Resume button, theme toggle, headline (the page's `<h1>`), identity block. |
| `src/components/*.astro` | One component per section. Each hides itself when its list is empty. |
| `src/pages/` | `index`, `projects/index`, `projects/[slug]`, `about`. |
| `src/scripts/theme.ts` | Theme toggle + `localStorage` persistence. |
| `src/scripts/reveal.ts` | Fade-and-rise entrance, disabled under `prefers-reduced-motion`. |
| `public/` | Static files. `resume.pdf` goes here (see DECISIONS.md). |

## Adding a project

1. Open `src/content/site.ts`.
2. Copy the object in the `projects` array and paste it below the original.
3. Change `slug` (it becomes `/projects/<slug>/`) and replace every `[[placeholder]]`.
4. Set `featured: true` on exactly one project; it becomes the hero card on the home page.
5. Leave `stats` out, or set it to `[]`, if the project has no headline numbers. The sidebar tiles hide themselves.

The projects index, filter chips, prev/next links and the home hero all update from the array. Nothing else to touch.

## Adding anything else

Experience, education, skills, tech stack and publications are plain arrays in the same file. Add or remove entries; an empty array hides that section.

Project covers live at `src/assets/projects/<slug>/cover.jpg` and gallery images at `gallery-01.jpg`, `gallery-02.jpg`, …; point `media.cover` and `media.gallery[].src` at them as `/projects/<slug>/<file>`. Astro generates responsive WebP variants at build time. Education logos are SVGs under `public/sponsors/` referenced by `education[].logo`. The About photo and avatar slots still render a dashed placeholder label until a `src` is supplied.

## Publishing to GitHub Pages

The site is served at https://rushav.github.io/WebsitePortfolio/. `site` and `base` are set in `astro.config.mjs`; the repository's Pages → Source must be **GitHub Actions**. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and deploys.

All internal links go through `src/lib/url.ts`, so the `base` prefix is applied everywhere automatically.
