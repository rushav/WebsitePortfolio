# Rushav Dash — portfolio

Single-page personal portfolio, live at **https://rushav.github.io/WebsitePortfolio/**.

## Stack

- [Astro](https://astro.build) (static output, no client framework)
- Plain CSS with custom properties for the design tokens (`src/styles/global.css`)
- Fonts: Manrope + JetBrains Mono, self-hosted from `public/fonts/`
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`

## Run it

```bash
npm install
npm run dev       # http://localhost:4321/WebsitePortfolio/
npm run build     # outputs to dist/
npm run preview   # serves dist/ locally
npm run check     # Astro + TypeScript diagnostics
```

The site is served under the `/WebsitePortfolio/` sub-path in production, so `astro.config.mjs` sets `base` accordingly and the dev server mirrors that path.

## Edit content

All copy lives in **`src/content/site.ts`**. Layout files never contain text.

| What | Where in `site.ts` |
|------|--------------------|
| Name, email, LinkedIn, GitHub, location, availability, resume path | `site` |
| Hero education lines, interest statement, "Currently" link, "Previously" list | `site.hero` |
| Contact lead line | `site.contact` |
| Projects (ordered array; order on the page = order in the array) | `projects` |
| Experience entries (ordered array) | `experience` |
| "All skills" block, grouped Mechanical / Electrical / Software / Fabrication | `skills` |

### Project fields

```ts
{
  slug: 'roost',                 // card id; the hero "Currently" link points at #roost
  name: 'Project Roost',
  status: 'in-progress' | 'completed',
  image: { src: 'images/projects/roost/hero.webp', alt: '…', placeholder: false },
  description: '…',              // one line, shown collapsed
  tags: ['ROS 2', '…'],          // 4–5 monospace tags
  result: '…',                   // "Result:" line
  links: { github, cad, video, report },   // null = chip not rendered
  sponsor: '…',
  teamRole: '…',
  longDescription: '…',          // expanded "Description"
  contribution: ['…', '…', '…'], // exactly three bullets
  differently: '…',              // "What I'd do differently" (optional; omit to hide the block)
}
```

Markers to search for before publishing:

- `[TODO: …]` — a fact only you can supply (metric, link, confirmation)
- `// DRAFT` — prose drafted from repo READMEs or the old site; review the wording
- `// REVIEW` — a "What I'd do differently" line drafted from the repo; check it reads as your own view

### Images and files

- Project images: `public/images/projects/<slug>/` (see `IMAGES_NEEDED.md` for every slot and what is still a placeholder)
- Profile photo: `public/images/profile.jpg`
- Resume: `public/resume.pdf`

## Deploy

Pushing to `main` runs the workflow, which builds the site and publishes `dist/` to GitHub Pages.
One-time setup in the repository: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
`public/.nojekyll` is copied into the build so Pages serves files verbatim.

## Repo layout

```
src/
  content/site.ts        all copy
  pages/index.astro      page composition
  layouts/Base.astro     <head>, fonts, meta
  components/            Nav, Hero, SectionHead, ProjectCard, Experience, Contact
  styles/global.css      tokens + shared styles
  lib/url.ts             base-path helper
public/                  static files (copied as-is)
.github/workflows/       Pages deploy
NOTES.md                 what the old repo was, design tokens, decisions
IMAGES_NEEDED.md         image slots and their status
```
