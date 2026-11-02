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

## Motion pass (2026-11-02)

Motion only: no colours, spacing, type or copy changed. Plain TypeScript + CSS, one `<canvas>`, no libraries.

### Environment and budget

- **No frontend-design, animation or design-engineering skill was installed** in this session (the available skills were CAD, document and artifact tooling), so the brief's timing and easing rules were applied directly: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances (`--ease-out`), `cubic-bezier(0.4, 0, 0.2, 1)` for hovers (new `--ease-hover` token), durations 150–600 ms. The one exception is the cover settle (1.04 → 1) at 900 ms, because 600 ms read as a pop.
- **Added JS: 5.7 KB gzipped** for all motion modules (`flock`, `reveal`, `counters`, `timeline`, `cards`, `nav`, `marquee`, `filter`, plus the existing `theme`) in one bundle, `BaseLayout.astro_astro_type_script_*.js` (15.0 KB raw). Before this pass the site's only scripts (theme + a generic reveal) were small enough that Astro inlined them, so the external-JS baseline was 0 KB. Astro's view-transition router (`ClientRouter`) adds a second 5.7 KB gzipped file; it is framework code the brief asked to enable, but counting it the total is 11.4 KB gzipped, still under the ~12 KB ceiling.
- **Frame timing** (headless Chrome driven over CDP, 1440×900, scrolling the home page while sampling rAF deltas and `longtask` entries for 2000 frames; the probe script lives in the session scratchpad, not the repo): with the flock running, mean 4.18 ms per frame, p99 4.3 ms, max 12.6 ms, no frame over 17 ms, no long tasks. The same run with the flock removed: mean 4.23 ms, max 46 ms (three frames over 34 ms, during image decode), so the flock is not the cost. Headless rAF is unthrottled, so these are per-frame main-thread costs rather than display refresh; the 60 Hz budget is 16.7 ms. An in-page sampler run through the Chrome extension showed periodic ~366 ms stalls, but the same stalls appeared on a blank SVG page, so they come from the extension's debugger attach, not the site. The DevTools Performance panel itself was not driven from this session.

### 1. The flock (`src/scripts/flock.ts`)

- **Canvas placement.** The brief says "behind the frame, above the page background", but perching on card tops and orbiting the CTA only make sense if the agents are visible inside the frame. So the canvas is `position: fixed; z-index: 0` in `<body>`, and `.frame__grid` and `.footer` get `position: relative; z-index: 1`. The frame itself is not positioned, so its white surface paints below the canvas while every card, image and line of text paints above it. Agents fly over the page background and the frame surface and pass behind cards and text, so they never cover a word.
- **Opacity is 45% light / 60% dark, not the brief's ~35%.** At 35%, `--text-faint` on the white frame was invisible in a 1× screenshot; 45% is the lowest value that reads as "something is there" without competing with text. Dark mode's faint grey has even less contrast on its surface, hence 60%.
- **Count:** 25 agents under 700 px wide, otherwise `clamp(40, viewport area / 25 000, 70)`: 46 at 1440×900, 70 at 1920×1080. About 10% of agents are drawn in the five category text tints so the flock carries the palette; the rest use `--text-faint`. Colours are re-read from the CSS variables whenever `data-theme` changes (a `MutationObserver`).
- **Boids:** separation (28 px), alignment and cohesion (64 px neighbourhood), a slowly drifting wander angle, soft steering back inside a 40 px viewport margin, and a hard wrap only as a safety net after resizes. Max speed 46 px/s, min 18 px/s. Cohesion was tuned down (0.35 → 0.22) after the first build produced tight knots of ten agents; the hero now reads loose and spread out as asked.
- **Cursor:** agents within 120 px steer away with a force that falls off linearly; mouse pointers only, and the cursor is parked off-screen on `pointerleave`/`blur`.
- **Perching:** `data-perch` is on every project card's media box and on each stat tile. Perch rects are re-read on scroll and resize (coalesced to one read per frame through a dirty flag), never per frame unprompted. A flying agent that drifts within 72 px above a visible perch has roughly a 50% chance per second of committing to land; it decelerates to a random point on the top edge (3 px above it, so the chevron is not hidden behind the card), sits for 2–5 s facing along the edge, then takes off with a 4–8 s cooldown. At most three agents per perch. Agents are released immediately if their perch scrolls out of view or, after a page navigation, no longer exists.
- **Section moods:** there is no explicit mode state. Perching only happens where perch targets are on screen (the project grid, the stat tiles), and the CTA band carries `data-perch="cta"`, which switches every flying agent to an elliptical orbit 44 px outside the band (tangent plus a radial correction toward the ring, 34 px/s, cohesion and alignment off) while at least 96 px of the band is visible. Leaving the band releases them. Agents take 5–10 s to assemble from across the viewport, which looks like a flock gathering rather than a snap.
- **Lifecycle:** one rAF loop, paused on `visibilitychange`, dt capped at 50 ms so a throttled tab does not teleport agents. `prefers-reduced-motion` stops the loop, clears the canvas and hides it (CSS also sets `display: none`); flipping the media query back restarts it. If `getContext` or rAF is missing, nothing is drawn. The brief's "pause when the element is off-screen" does not apply to a fixed, always-on-screen canvas, so there is no IntersectionObserver on it.
- **Across page navigations** the canvas is `transition:persist`ed, so the same agents keep flying while Astro swaps the page; the module only re-collects perch targets on `astro:page-load`. During the ~300 ms swap the persisted canvas renders in the view-transition layer above the content; that is a browser constraint and well under the 400 ms rule.

### 2. Hero entrance

- An inline `<script>` in the `<head>` (home page only) checks `sessionStorage` before paint and adds `html.enter` on the session's first load; the headline lines then rise 12 px and fade in with an 80 ms stagger through a CSS animation keyed on `--i`. Because the class is set before paint there is no flash, and because it is an animation rather than an initial hidden state, a JS failure never hides the headline. If `sessionStorage` throws, the entrance simply plays.
- The flock reads the same class: on an entrance load every agent spawns 10–220 px left of the viewport heading right, and the global fade starts 700 ms in (after the third line lands) and lasts 800 ms. On later loads agents spawn in place and fade in over 400 ms.
- The availability dot gets two pseudo-element rings: one ring on the entrance load (900 ms, starting 600 ms after load), then an ambient ring every 4 s. The static tinted halo is unchanged.

### 3. Scroll reveals (`src/scripts/reveal.ts`)

- `data-reveal` moved from whole sections to `.section__head`; cards and list items reveal individually through `data-reveal-group` on their container (its direct children are the targets). Elements that intersect in the same observer callback are staggered 60 ms apart in DOM order, capped at the sixth (the rest arrive with it). Each element reveals once; after the entrance the `reveal`/`is-visible` classes are removed so the element's own hover transitions take over (otherwise `.reveal`'s transition shorthand would override `.card`'s).
- Project covers start at `scale(1.04)` inside their clipped media box and settle to 1 over 900 ms with the card's delay. Anything already in the viewport on load, or after a client-side navigation, is shown immediately rather than animated.

### 4. Counters (`src/scripts/counters.ts`)

- `StatTiles` renders the value twice: a `.sr-only` copy and an `aria-hidden` visible copy with `data-count-num`. Screen readers and no-JS get the final value; JS counts the visible copy up from 0 over 900 ms (cubic ease-out) once it is 50% visible. **`aria-label` on the `<dd>` was not used** because `aria-label` on a `<dd>` is unreliably exposed; the sr-only span is the dependable form of the same intent.
- The parser keeps prefix and suffix (`46+`, `62.7%`, `0.45 px`, `120 Hz`), the source's decimal places and thousands separators. The home page has no numeric stat tiles, so counters currently run on project pages only.

### 5. Experience timeline (`src/scripts/timeline.ts`)

- The 1 px rule sits in the gutter at `left: -1rem` of the experience list (`[data-timeline]`), so no padding or spacing changed; the accent rule draws over it with `scaleY` from scroll progress, with the head of the line at 72% of the viewport height. Items light up (date fades and rises in over 300 ms, category rule fades in over 400 ms) when the head passes their top and stay lit on scroll back; the accent line itself follows progress both ways.
- The item's 3 px category rule became a `::before` pseudo-element instead of an inset `box-shadow` (same geometry) so it can be faded with opacity. Dates and rules are only held back once JS adds `.tl-ready`, so no-JS and reduced-motion users see everything with just the static grey rule.
- The scroll listener is attached only while the list is near the viewport (IntersectionObserver with a 20% top margin) and coalesced to one rAF.

### 6. Project cards

- Hover is on the whole card (`.pc:hover`): the media box lifts 2 px, the cover scales to 1.03 over 400 ms, the title arrow nudges 2 px up-right (it used to be 1 px on title hover only). **Only the media box tilts** (max 2°, `perspective(800px)`), not the text, so nothing you might be reading moves. The tilt is delegated at the document level, rAF-throttled, and gated by `(hover: hover) and (pointer: fine)`.
- **Hover loops:** `ProjectCard` checks at build time (an `import.meta.glob` over `public/projects/*/loop.{mp4,webm}`, used only for its key list) and renders a muted `preload="none"` `<video data-card-loop>` over the cover when a file exists. It plays on hover, pauses on leave, and crossfades in over 200 ms only once the `playing` event fires, so a cold video never flashes black. **No project ships a loop yet; Drunky is the first candidate** (drop `public/projects/drunky/loop.mp4`, 16:9, no audio, a few MB at most). The code path is wired but could not be exercised without a file.

### 7. Small touches

- **Nav pill** (`src/scripts/nav.ts`): one absolutely positioned `.nav__pill` created by JS slides between links. The `<nav>` is `transition:persist`ed so the pill has somewhere to slide from on client-side navigation, which means the active state is recomputed from `location.pathname` on every page load (the persisted markup would otherwise show the previous page). **This is the one place a layout property is transitioned** (`width`/`height` alongside `transform`, 300 ms): a `scaleX` pill distorts its rounded ends, and the element is an isolated childless absolute box, so the layout cost is negligible. Reduced motion disables the transition. The theme toggle inside the persisted nav is bound by delegation for the same reason.
- **Skills grid:** the 36 px icon tile rotates 6° and its tint deepens (`color-mix` of 12% category text into the tint) over 200 ms.
- **Tech stack marquee** (`src/scripts/marquee.ts`): built only if the chip row is taller than 1.6 chip heights, i.e. wraps. At 1440 it wraps to four lines, so the marquee is on. It wraps the list and an `aria-hidden` clone in a track that translates by half its width at ~28 px/s behind a soft edge mask; it pauses on hover, focus-within, tap (non-mouse pointers) and when scrolled off screen, and tears itself down on resize if the chips no longer wrap or when reduced motion is switched on. This changes the section's height versus the wrapping row; the brief asked for it.
- **/projects filter** (`src/scripts/filter.ts`): the filter script moved out of the page into a module so it rebinds after client-side navigation. With `document.startViewTransition` available, visible cards get a temporary `view-transition-name` and the grid re-flows inside a transition: leaving cards fade and scale to 0.96 over 200 ms, staying cards slide to their new slot over 300 ms (`view-transition-class: pc`); the names are cleared when it finishes. Elsewhere, and under reduced motion, the change is instant. **Bug fixed on the way:** `.pc { display: flex }` was overriding the `hidden` attribute, so filtered cards never actually disappeared; `.pc[hidden] { display: none }` now wins.
- **Page navigation:** Astro's `<ClientRouter />` is enabled; the card's media box and the project page's cover wrapper share `transition:name="cover-<slug>"`, so the cover morphs from the card into the page hero. Because the router replaces `<html>` attributes on swap, `theme.ts` re-applies the stored theme on `astro:after-swap` (the inline head script does not re-run). All modules initialise on `astro:page-load` rather than at import time.

### Reduced motion

Verified with headless Chrome and `--force-prefers-reduced-motion`: no `.reveal` classes are applied, no `tl-ready`, no marquee, no `enter` class, the canvas stays hidden, counters keep their rendered final values, and the full-page screenshot shows every section readable. On top of the existing global `0.01ms` override, the motion block explicitly sets `animation: none` on the pulse rings, headline lines and marquee track (an infinite 0.01 ms animation would otherwise spin) and disables view-transition animations.

### Verification

Checked in Chrome at 1440×900 (light and dark) and in headless Chrome at 390 wide: hero entrance (session-scoped), flock fly-in, perching on card tops in the project grid, the timeline drawing and items lighting, the CTA orbit, marquee, reveals with stagger, counters on `/projects/intrinsic-aic/`, the pill sliding Home → Projects, the filter transition, the card tilt (`rotateX(0.9deg) rotateY(-0.8deg)` at the sampled pointer position), and the cover morph names matching on both ends. `npm run check` and `npm run build` are clean.

## Build sequence: agents construct the page (2026-11-02)

No frontend or animation skill was installed in this session, so the brief was followed directly. No layout, colour, type or copy changed; the only new tokens are `--build-line` and `--build-fill` (light `#2F6FEB`, dark `#5B8DFF`, at 70% and 8%).

### How it works

- **`src/scripts/build.ts`** is a plugin on the existing flock (`flock.ts` gained a `Work` state and a small API: `recruit`, `freeAgent`, `setPlugin`, `drawAgent`). It owns a second fixed canvas above the content (`z-index: 5`, `pointer-events: none`) for boxes, handles, guides, labels, and the agents while they work. Released agents go back to the flock canvas behind the content.
- **Sequence:** 2–3 flocks sprint in from off-screen (left, top, bottom) at ~700 px/s, decaying to ambient speed. After 250 ms, each queued target is assigned the nearest free agent (max 10 working, 6 on mobile). The agent seeks the target's top-left corner, then traces the outline clockwise in 220 ms. The outline grows behind it, corner handles appear as it reaches them, guides run to the frame edges and the label tag sits above the top-left corner. Image slots get the translucent fill and a `+` crosshair; text slots get a blinking I-beam. The working agent turns `--build-line` while drawing.
- **Materialise:** images clip-path wipe in from the side the agent arrived from; text wipes top-down with a duration paced by its line count (300 ms + 110 ms per line, max 900 ms); everything else fades and rises 6 px. The wireframe holds 150 ms, then fades over 250 ms.
- **Rows** (`data-build-group`: headline lines, card grids, experience, education, skills, stat tiles) build left to right: each agent waits just off its corner until the previous sibling's outline is about a third drawn, so you can watch the row assemble.
- **Hidden state:** an inline `<head>` script adds `html.enter is-building` on the first load of the session (not under reduced motion). CSS holds `[data-build]` at `opacity: 0` under that class; a container that holds other targets (a card around its image) hides only its own non-target children, so nested boxes measure and appear independently. Layout never changes, so CLS stays 0. If the module never reports in (`html.build-ok`), the inline script drops the class after 3 s.
- **Timing:** each first-viewport job has a deadline of 1.6 s (1.2 s on mobile) minus the 350 ms materialise; later sections get 900 ms from when they enter the viewport. A job whose agent hasn't started drawing by then just fades in. Rects are measured after `document.fonts.ready` (capped at 400 ms) and re-read on resize and scroll.
- **Integration:** `reveal.ts` skips elements the build owns (`data-building`) and stays the fallback for everything else. Counters wait until their tile is built before counting. The timeline, card hovers, perching and the CTA orbit are unchanged; agents released after building the CTA band are ordinary flock agents, so they fall straight into the orbit while the band is on screen.

### Escape hatches

- **Once per session:** the same `sessionStorage` key as the hero entrance (`entered`, try/catch). Internal navigations don't re-run it: Astro's router replaces the `<html>` classes on swap and the build tears itself down on `astro:before-swap`.
- **Skip:** a click, key press, or scroll of more than 200 px during the first build forces every queued and active job to materialise immediately.
- **Reduced motion:** the class is never set, so there's no overlay, no flock, and everything is visible.
- **Deep links** (any `#hash`, or any page other than home): only targets in the first viewport are built. Everything else gets the normal reveal.
- **Mobile (< 768 px):** only `h1`, `card` and `img` targets are built, by at most 6 working agents, with a 1.2 s budget. The ambient flock keeps its 25 agents; "6–8 agents" was read as the working team, not the whole flock.
- **Jumps:** a section carried past the viewport without ever intersecting (End key, anchor link, fling) is shown as soon as it is above the fold, so scrolling back never finds an empty slot.

### Targets and skips

Built: nav (as one box), each headline line, identity block, availability strip, section headings, every project card plus its image (separate boxes), experience, education and publication items, skill cells, the tech-stack row, stat tiles, CTA band, and on project pages the header, cover, meta row and each text block. About's prose block is a text target.

Skipped, and why:

- **Individual tech chips:** the row is one `chips` target. On desktop it becomes a moving marquee with an `aria-hidden` clone, so per-chip boxes would be drawn around moving or duplicated elements. The box is drawn around the static marquee window and the clone materialises with it.
- **Sponsor logo tiles** on project pages are inside the header's text block rather than separate targets. Twenty-odd tiny boxes in the first viewport would blow the 1.6 s budget at 10 agents.
- **Footer, project pager, /projects filter chips, About photo:** left to the normal reveal. They're below the fold or utility chrome, and building them added time without adding to the effect.
- **Text "line-by-line":** done as a top-down clip-path wipe paced by line count, not true per-line spans. Splitting text into lines needs DOM changes per breakpoint, and copy is out of scope.

### Measurements

| Check | Result |
| --- | --- |
| First viewport built, home 1440×900 (cold, headless) | 1.52 s |
| First viewport built, `/projects/drunky/` (cold) | 1.52 s |
| First viewport built, 390 px mobile | about 1.05 s |
| Click at 0.5 s | everything visible by 0.62 s |
| Second load in the same session | no build, no overlay |
| Reduced motion | no build class, no overlay canvas |
| Lighthouse perf, mobile / desktop: `/`, `/projects/`, `/projects/drunky/` | 99–100 / 100, CLS 0 on all six |
| Motion JS gzipped | 9.1 KB (was 5.7 KB); plus the 5.7 KB ClientRouter |

The motion bundle plus the router is now 14.7 KB gzipped, over the previous pass's ~12 KB ceiling. This brief didn't restate a budget. The build module is about 3.4 KB of that and could be lazy-loaded on first-session loads only if the ceiling matters.
