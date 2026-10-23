# Decisions

Judgment calls made while building the skeleton, plus notes for a recruiter-minded reviewer. Nothing here is content; it's about structure.

## Environment

- **No frontend-design, Astro, CSS or motion skill was installed** in the build environment (the available skills were CAD, document and artifact tooling). The build followed the prompt's spec directly and the two references' structure.
- **Astro 7.4** (latest stable at build time). **TypeScript is pinned to 5.x** because `@astrojs/check` does not yet accept TypeScript 7 as a peer.
- `npm run check` and `npm run build` both run clean. Lighthouse against `npm run preview` is recorded at the bottom of this file.

## Layout

- **Sidebar is 320px**, the top of the spec's 300–320 range, so `Home · Projects · About · Resume · toggle` fits on one row. At 300px the row wrapped.
- **No hamburger menu.** The nav is three short links, a Resume button and a toggle. Below 900px it stays as a wrapping row at the top of the page rather than collapsing behind a button. A recruiter on a phone sees "Resume" without tapping anything. If more links are added later, a disclosure button can be dropped into `Sidebar.astro`.
- **Sticky sidebar height** is `100vh` minus frame padding, with the identity block pinned to the bottom with `margin-top: auto`. This matches Reference A's "identity at the bottom" feel without absolute positioning.
- **Frame max width is 1280px.** Wider than that, the content column's line length gets uncomfortable.
- **Footer carries the identity block on mobile only.** On desktop it's hidden (it's in the sidebar); below 900px it shows. Social icons appear in both places on desktop by design: once near the name, once at the end of the page.
- **Headline placeholders are deliberately short** (`[[What you build]]` etc.). The spec's longer descriptive placeholders wrapped to three lines *each* at 52px in a 320px column, which made the skeleton look broken. The guidance for each line is in a comment above the `headline` field in `site.ts`. Real lines should be roughly 12 characters.

## Components

- **Project card link row (GitHub / Paper / Demo / Video) is only shown on the hero variant.** The compact variant on `/projects` keeps the card scannable; the project page has the full pill-button link row.
- **Stat tiles are a `<dl>`** with the number as `<dd>` and the label as `<dt>` so screen readers get "value, label" pairs. Hidden when `stats` is empty or missing. Below 900px they go 4-up so they don't eat vertical space above the content.
- **Prev / next on a project page falls back to "All projects"** when there's no neighbor, so the pager never renders a lone button. With one project both buttons point at the index.
- **Project filter on `/projects` is client-side only**, no URL state. With one placeholder project there's one tag chip plus "All". It shows an empty-state line if a filter hides everything.
- **Media placeholders are `role="img"` with an aria-label** that says "Placeholder: …" so the dashed boxes don't read as mystery regions in a screen reader.
- **Theme toggle shows the icon of the theme you'd switch *to*** (moon in light mode, sun in dark). `aria-pressed` tracks dark.
- **Monogram strips the `[[ ]]`** from `initials` so the tile reads "AB" rather than brackets. It's the only placeholder the UI rewrites.
- **Education year range uses a plain `[[YYYY]]`** rather than `[[MMM YYYY]]`; month precision on a degree is noise to a recruiter.

## Motion

- Entrance reveal is applied only when JS runs and only to elements that start below the fold. Anything visible on load is never hidden, so first paint is never blank and there's no reveal-on-refresh flicker.
- Reduced motion disables the reveal and clamps every transition to ~0.
- Theme switch has a 150ms background/colour transition. The no-flash inline script runs before CSS loads.

## Things NOT done (on purpose)

- **`public/resume.pdf` does not exist.** The Resume button points at `/resume.pdf` and will 404 until the real file is dropped into `public/`. No fake PDF was generated.
- No blog, testimonials, analytics, contact form, OG image, sitemap or RSS. The spec said skeleton only.
- No `robots.txt`. Add one at publish time if needed.
- Skill and tech icons are 14px grey circles. Real logos would need a small SVG set or an icon package; that's a content decision.

## For a recruiter-minded reviewer

- The availability strip is the first thing in the content column and the Resume button is the only orange element above the fold. Those two answer "when" and "where's the resume" in under a second.
- The home page order is: one hero project → experience → education → skills → tech → publications → CTA. A hiring manager who stops after the hero still sees hardware in a 16:9 slot, tags, and links.
- Every project card has an eyebrow (category) and a context line (sponsor · course · stack), which is where "mechanical vs. software" gets answered without reading prose.
- Section headings are quiet (28px, regular weight). That's a design choice from Reference A; if a reviewer finds the page hard to scan at speed, bumping heading weight to 500 is a one-line token change.

## Accessibility and performance fixes made during verification

- **Resume button uses dark ink (`#111`) on the orange fill.** White on `#E8541E` is 3.4:1 and fails AA at 13px; dark on orange is 5.6:1 (7:1 in dark mode). The accent is still the only orange on the page.
- **Media placeholder labels and the footer meta line use `--text-muted`, not `--text-faint`.** Faint (`#A3A3A0`) on the grey surface is 2.3:1. `--text-faint` is kept for non-text hints (the card arrow, separators) only.
- **Fonts: latin subsets only, metric-matched fallbacks, and preload of Inter 400/500 + JetBrains Mono 400.** Importing the full `@fontsource` CSS pulled in every unicode-range subset and the swap from system font to Inter was the sole source of a 0.15 CLS. Fallback `@font-face` rules with `size-adjust`/`ascent-override` sit behind the real fonts in the token stack. If non-Latin content is ever needed, add the matching subset import in `global.css`.

## Lighthouse (npm run preview, headless Chrome, mobile emulation, 2026-10-22)

| Page | Performance | Accessibility | Best practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 | 0.000 |
| `/projects/` | 100 | 100 | 100 | 100 | 0.000 |
| `/projects/placeholder-project/` | 100 | 100 | 100 | 100 | 0.000 |
| `/about/` | 99 | 100 | 100 | 100 | 0.064 |

The About page's small shift comes from Inter 600 (the bold lead sentences), which is not preloaded because no other page uses it above the fold. Preload it in `BaseLayout.astro` if that page ever needs a perfect score.

## Projects content pass (2026-10-22)

Judgment calls made while filling the seven projects. Copy is from the project brief verbatim; nothing below changes wording, only how it was mapped onto the schema.

- **Source image folders were inside the repo root** (`projects/<Folder>/Cover.jpg`), not at the `~/Desktop/WebsitePortfolio/projects` path in the brief (that path doesn't exist; the Desktop is OneDrive-synced). Each folder held exactly one `Cover.jpg` and nothing else: no detail images, no video, no link `.txt`. So every project has a cover and an empty gallery (the Gallery block hides itself). All covers are 1376x768 JPG (1.79:1, within 1% of 16:9) under 1 MB, so none were converted to WebP.
- **`Media.astro` now renders a real `<img>` when given `src`**, falling back to the dashed placeholder otherwise. The wrapper keeps the same class, radius and aspect-ratio box, so the card and page layouts are unchanged. The cover on the home hero and the project page is `loading="eager"`; compact cards and gallery tiles are lazy. This is the one component change in this pass; the brief said content-only, but the skeleton's own README anticipated this swap.
- **`Project.media` shape changed:** `hero` is now the cover's alt text (or the placeholder label when `cover` is absent), `cover` is an optional path under `public/`, and `gallery` is `{ src, alt }[]` instead of `string[]`.
- **Home page shows a compact 2-up grid of the six non-featured projects** under the VESPR hero card, in brief order. This needed a small addition to `src/pages/index.astro` (a `.grid` block, same columns and gap as `/projects`). No tokens or shared components changed.
- **`summary` (project-page intro) reuses `description` verbatim.** The brief gave no separate summary and marked the descriptions as final copy, so no new sentences were invented. Edit `summary` per project if the page intro should differ from the card.
- **`results` is a bullet list in the schema**, so each brief's one-line results sentence was split at its semicolons/periods into bullets. Wording is unchanged.
- **Stat labels** were split into the schema's two lines at a natural break, e.g. "final / portal score".
- **TBD fields:** `stats` omitted (tile block hides), `links: []` (Links block hides). Nothing placeholder is rendered for them.
- **Drunky's GitHub link** points at the teammate's repo as the brief gave it; the button label is just "GitHub".
- **Things the brief flagged `// VERIFY` before publishing:** VESPR results ("flight platform built up; claw ~90% finalized; first perch tests scheduled") and the PANOPTES calibration numbers (120 Hz, 0.32–0.39 px intrinsic RMS, 0.45 px extrinsic RMS). Both are rendered as given; confirm they are still current.
- **Remaining placeholders on the home page:** only the two education logo tiles (`[[LOGO 1:1]]`). No logo asset was supplied and they are outside this task. The About page prose and photo/avatar slots are also still placeholders.
- **Resume PDF:** `public/resume.pdf` is a copy of `Rushav_Dash_Resume 2026.pdf` from the repo root; replace both when the resume changes.

## Polish pass (2026-10-22): card heights, category filter, tints, About copy

- **Covers moved from `public/projects/` to `src/assets/projects/`** so Astro's `<Image>` can generate responsive WebP (widths 480/800/1200/1600, quality 82). Astro does not upscale, so the 1600 variant is clamped to the sources' 1376px; each cover ships as four variants, 7–79 kB each instead of 305–603 kB. `src/lib/covers.ts` resolves the content path (`/projects/<slug>/cover.jpg`) to the imported asset and fails the build if the file is missing.
- **Equal-height cards:** `ProjectCard` is a column flexbox with `height: 100%`, the title and description are clamped to two lines, the tag row is capped at two rows and pinned to the bottom with `margin-top: auto`. Grids use `align-items: stretch`. The media box is 16:9 with `object-fit: cover` and the link wrapper owns the radius and clipping, so no source image's intrinsic size can change the box. Verified in the browser: every card in every grid row measures identical height at 1440 and 390.
- **Category filter replaces the tag union.** `Project.category` (one of five) plus optional `secondaryCategory`; VESPR is the only project using a secondary (Mechanical Design + Autonomy & Navigation). The /projects row is All + the categories actually in use (currently all five). Cards show at most 5 tags, or 4 and a `+N` chip whose `title` lists the rest; project pages still show all tags.
- **Skills grid regrouped into the eight cells the brief named** (Robot Middleware, Perception & Learning, Embedded Hardware, CAD & 3D Assets, Simulation & Scientific, Systems & GPU, Fabrication & Prototyping, Controls & Actuation). The resume's tools were redistributed under those headings; nothing was invented except "Onshape" (from the VESPR stack), "laser cutting" (from the About copy) and "NVIDIA Jetson" (VESPR). Each cell has a 36px tinted icon tile with a new stroke icon in `Icon.astro`.
- **Tech stack chips are a single wrapping row ordered by family** with only the leading dot tinted (plus a 1px tinted left rule on hover). Separate labelled groups looked cluttered at 390px, so this is the brief's fallback option.
- **Category tints resolve through `data-cat`:** `global.css` maps `data-cat="autonomy|manip|perception|mech|software"` to `--cat-bg` / `--cat-text`, and components read those with neutral fallbacks. Dark variants keep each light hue with bg at 18% lightness (30% saturation) and text at 75% (45% saturation).
- **Contrast check (WCAG, computed):** every text/bg pair is ≥ 7.0:1 in light and ≥ 6.75:1 in dark; tinted text on the page/card surfaces is ≥ 7.1:1 light and ≥ 7.3:1 dark. No pair needed adjusting. Lowest pairs: light `mech` text/bg 7.00:1; dark `perception` text/bg 6.75:1.
- **Experience rule uses the category text colour** (not the bg tint) at 3px via an inset box-shadow so the border does not shift layout; the bg tints are too faint to read as a rule on the light surface.
- **CTA headline is shared** by the home and About pages (one `site.cta`), so the new "flies, grips, or perches" line appears on both.

## Project links and sponsor logos (2026-10-22)

- **Links moved into the project header**, directly under the summary, as pill buttons. They used to sit in a "Links" block after Results, roughly 70% down the page, which read as missing.
- **Sponsors** are a `sponsors: Sponsor[]` field per project rendered as white logo tiles (white in both themes, since the marks are drawn for white backgrounds) under a "Sponsored by" label in the header. Mapping: VESPR, PANOPTES, Drunky, ShoeHugger → UW + GIX; Intrinsic AI Challenge → Intrinsic + Google; VitreaClear → UW; Thoth → T-Mobile.
- **Logo sources** (`public/sponsors/`): UW signature and T-Mobile 2022 mark from Wikimedia Commons; Google 2015 wordmark from Wikimedia Commons; Intrinsic wordmark from intrinsic.ai's site header; GIX wordmark cropped (viewBox only, no redraw) from the official UW+GIX primary lockup on gix.uw.edu, so the UW tile and the GIX tile don't both carry the UW signature. All are trademarks of their owners, used here to credit project sponsors.
