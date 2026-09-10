# NOTES — portfolio rebuild (Variant A "Lab Notebook")

## 1. Existing repo (what was here before the rewrite)

| Item | Finding |
|---|---|
| Framework | None. Two hand-written HTML pages (`index.html`, `project.html`) that load **React 18 + Babel-standalone from unpkg at runtime** and compile `.jsx` in the browser. |
| Build tooling | None. No `package.json`, no bundler, no lockfile. |
| Data | `data/projects.js`, `data/experience.js`, `data/skills.js`, `data/about.js` (plain JS globals on `window`). |
| Assets | `assets/images/<slug>/…` (37 images), `assets/resume/Rushav-Dash-Resume.pdf`. |
| Hosting | **GitHub Pages, project site**, live at `https://rushav.github.io/WebsitePortfolio/` (HTTP 200 confirmed). |
| Deploy pipeline | **None** — no `.github/workflows/`, no `vercel.json`, no `netlify.toml`, no `CNAME`. Pages is set to "Deploy from a branch" (`main`, root). `.nojekyll` is present so Pages serves files verbatim. Commit `38dfcd9` switched to relative asset paths because the site lives under the `/WebsitePortfolio/` sub-path. |
| Custom domain | None. |
| Tooling on this machine | Node 24.19 / npm 11.17 available. **`gh` CLI is not installed** — I will read the source repos with `git clone` and the unauthenticated GitHub REST API via `curl` instead. All three source repos are public. |

### Deploy implication (decided — see section 5)

The current setup is "commit raw HTML to `main`, Pages serves it". A build step (Astro/Vite) produces a `dist/` folder, so one of these must happen:

- **A (recommended)**: add `.github/workflows/deploy.yml` that builds and publishes with `actions/deploy-pages`. You flip **Settings → Pages → Source** from "Deploy from a branch" to "GitHub Actions" once. Same URL, no committed build output.
- **B**: build into `docs/` and commit it; switch Pages source folder to `/docs`. No workflow, but build output lives in git.

Either way the site keeps the same URL. The sub-path means the build must be configured with `base: '/WebsitePortfolio/'`.

## 2. Tech decision

**Astro (static output), plain CSS with custom properties, zero client-side frameworks.** Reasons: the existing setup (runtime Babel + unpkg React dev builds) is exactly the "fragile/heavy" case the brief calls out and would never hit Lighthouse 95; Astro renders the content file to static HTML at build time, so `<details>` cards work with no JS; a single tiny script handles nav blur + reduced-motion-aware transitions.

- Content file: `src/content/site.ts` (typed, one ordered `projects` array).
- Fonts: one Google Fonts request — **Manrope** (500/600/700/800) + **JetBrains Mono** (400/500). Two families, as the export uses.
- Everything old (`index.html`, `project.html`, `scripts/`, `data/`, `assets/`) is deleted after salvage.

## 3. Salvaged into `_salvage/` (gitignored)

- `_salvage/images/` — all 37 images from `assets/images/` (drunky, intrinsic, mini-desktop, shoehugger, skinsafe, synthetic-data, vitreaclear). **No GIFs or videos existed.**
- `_salvage/resume/Rushav-Dash-Resume.pdf`
- `_salvage/data/vitreaclear.json`, `_salvage/data/shoehugger.json` — full project objects (context, approach, technical details, role, tech stack, links, images, outcomes, milestones).
- `_salvage/data/projects.js`, `experience.js`, `skills.js`, `about.js` — everything else verbatim.

### Contact / identity found in the old site
- Email `rushavsd@gmail.com` · LinkedIn `linkedin.com/in/rushav-dash` · GitHub `github.com/rushav`
- Location: experience entries say Seattle / Bellevue / Everett, WA. I will set the pin to **Seattle, WA** with a `TODO: confirm`.

### Experience found (8 entries; 6 work/research + 2 education)
- OneCourt — Production Tech Intern, Seattle (Jun 2026 – present)
- Global Innovation Exchange, UW — Prototype Lab Assistant, Bellevue (Dec 2025 – present)
- Zap Energy — R&D Engineering Intern, Everett (Jun–Aug 2024, and Jul–Aug 2023)
- Posner Research Group, UW — Research Lab Assistant (Apr–Aug 2024)
- Integrated Fabrication Lab, UW — Research Lab Assistant (Jan 2023 – Jun 2025)
- Education: MS Tech Innovation (Robotics) UW; BS Mechanical Engineering UW

Plan: **4 entries** on the page (OneCourt, Zap Energy [merged two internships], GIX Prototype Lab, Posner Research Group) and Integrated Fabrication Lab in the "Previously" line. `Previously:` → `OneCourt · Zap Energy · Posner Research Group · Integrated Fabrication Lab · GIX`.

Skills (old site had 5 groups) will be regrouped into the brief's **Mechanical · Electrical · Software · Fabrication**.

## 4. Design tokens — from the export (Variant A `#1a`, 1280px desktop + 390px mobile)

Source: `C:\Users\rusha\Downloads\Rushav Dash Portfolio Variants\Rushav Dash Portfolio - Variants.dc.html`. Markup is inline-styled canvas output; I am extracting the values, not copying the markup.

### Color
| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0E0D0B` | page + nav background |
| `--surface` | `#1A1814` | photo placeholder |
| `--surface-img` | `#161511` | 16:9 image slot background |
| `--fg` | `#F4F1EA` | name, headings, company names, emphasized values, resume button fill |
| `--body` | `#C9C4B8` | body text, nav links, link chips |
| `--mono` | `#9A9385` | secondary mono text (edu lines, tags, "Currently:", Result label) |
| `--muted` | `#7D776C` | tertiary mono (Previously, dates, COMPLETED badge, toggle, footer) |
| `--accent` | `#D9A441` | amber: section numbers, IN PROGRESS badge, capstone link, expanded-section labels, skill group names |
| `--line` | `rgba(255,255,255,.10)` | nav border, section/expanded dividers, experience rows, footer |
| `--line-rule` | `rgba(255,255,255,.12)` | heading rule, tag borders |
| `--line-card` | `rgba(255,255,255,.14)` | card border, photo ring |
| `--line-chip` | `rgba(255,255,255,.20)` | link chip border |
| `--line-img` | `rgba(255,255,255,.08)` | image slot border |
| `--line-badge` | `rgba(255,255,255,.18)` | COMPLETED badge border |
| `--underline` | `rgba(255,255,255,.25)` | Email/LinkedIn/GitHub underline |

### Type
- Sans: **Manrope** — 500/600/700/800. Mono: **JetBrains Mono** — 400/500.
- h1 name: 800 · 64px · line-height 1 · letter-spacing −.02em (mobile 42px)
- h2 section: 700 · 28px (mobile 22px); section number: mono 500 13px accent, baseline-aligned, 20px gap, then 1px rule flex:1
- h3 card title: 700 · 24px (mobile 20px)
- Company name: 700 · 18px
- Interest statement: 18px / 1.55, max-width 680px (mobile 16px)
- Contact line: 20px / 1.5 `--fg`
- Body/card text: 15px / 1.55–1.6 (mobile 14px)
- Edu lines, Currently, Result, Sponsor/Team role: mono 13px / 1.7 (mobile 11–12px)
- Previously, dates, toggle: mono 12px; footer mono 11px
- Tags: mono 400 11px; badges: mono 500 10px letter-spacing .1em; expanded labels: mono 500 11px letter-spacing .1em uppercase
- Link chips: mono 500 12px; hero icon links: mono 500 13px; contact links: mono 500 14px
- Nav: name 700 15px letter-spacing .02em; links mono 500 13px, gap 32px

### Layout & spacing
- Max content width **1100px**, horizontal padding **40px** desktop / **20px** mobile
- Nav: sticky, padding 18px 40px, 1px bottom border, bg `--bg` (brief adds blur-on-scroll)
- Hero: grid `140px 1fr`, gap 48px, padding 96px 0 88px; inner column gap 20px; mobile: stacked, photo 96px, padding 48px 20px 40px, gap 18px
- Section header margin: 96px top (first section none) / 28px bottom
- Card: grid `40% 1fr`, gap 32px, padding 24px, 16px between cards; mobile: single column, padding 16px, gap 14px
- Card inner column gap 14px; tag gap 8px; chip gap 10px
- Expanded block: full-width, border-top `--line`, padding-top 24px, 2-col grid gap 28px 48px; Sponsor/Team role on one full-width row gap 32px; "What I'd do differently" spans both columns
- Experience row: grid `280px 1fr`, gap 40px, padding 28px 0, border-top `--line`; bullets 15px/1.6, list gap 4px, padding-left 18px
- All-skills block: same 280px/1fr grid, mono 12px / 1.9, group name in accent followed by ` · item · item`
- Footer: margin-top 96px, padding-top 20px, border-top
- Resume button: padding 12px 20px (mobile 14px 20px, full width), 700 14px Manrope
- Location pin: 9px circle, 1.5px border `--mono`, gap 7px
- Photo: 140px circle, 1px `--line-card` ring

### Borders & radius
- **All borders 1px** (only the location pin is 1.5px). **Corner radius 0 everywhere** except the circular photo and pin. No shadows, no fills except the resume button and image/photo surfaces.

### Section-number styling
`<span class="num">01</span> <h2>Projects</h2> <span class="rule"/>` — number in accent mono 13px/500, heading in `--fg` 700 28px, both baseline-aligned, hairline rule fills the remaining width.

### Card states
- IN PROGRESS badge: accent text + accent 1px border. COMPLETED: `--muted` text + `--line-badge` border.
- Toggle affordance top-right of the card body: mono 12px `--muted`, `▼ more` / `▲ less`.

## 5. Decisions (confirmed 2026-09-09)

1. **Deploy**: GitHub Actions workflow (`.github/workflows/deploy.yml`) building Astro and publishing with `actions/deploy-pages`. `astro.config.mjs` sets `site: 'https://rushav.github.io'` and `base: '/WebsitePortfolio'`. `.nojekyll` is kept in `public/` so it lands in the build output. One-time manual step after merge: **Settings → Pages → Source → GitHub Actions**.
2. **Resume button**: follow the export — filled cream (`#F4F1EA` on `#0E0D0B`).
3. **Experience title/date**: follow the export — stacked on two mono lines under the company name.
4. No `gh` CLI; source repos read via `git clone` + public REST API.

## 6. Implementation notes (2026-09-09)

- **Fonts are self-hosted** (`public/fonts/Manrope.woff2`, `JetBrainsMono.woff2`, latin-subset variable files fetched from Google Fonts) instead of a runtime Google Fonts request. The render-blocking third-party CSS was the only thing holding mobile Performance at 94; self-hosting plus `<link rel="preload">` took it to 100. Body text is set to weight 500 because the export only loads Manrope 500–800, so its "normal" text renders at 500.
- **`--muted` is `#8A8477`, not the export's `#7D776C`.** The original is 4.37:1 on the background and failed WCAG AA for the 10–12px mono text (dates, badges, toggle, footer). One step lighter gives 5.22:1; everything else is unchanged.
- **Expand/collapse** is native `<details>`; the summary is absolutely positioned top-right of the card (export's `▼ more / ▲ less`). The height/fade transition uses `::details-content` + `interpolate-size: allow-keywords` (Chromium 131+, Safari 18.4+); other browsers snap open with no animation. Spacing inside the expanded block is all padding + a `::before` rule, because a margin there collapses through the `::details-content` box and gets clipped.
- **Drunky contribution** could not be sourced from `git log --author` as the brief asked: the public repo has 13 commits and 1 PR, all by Tony Chen, and the `ros2_ws` submodule is pinned to a commit that is not reachable in its public origin. Decision (2026-09-09): the role and three bullets are written from the README "Contributors" credit and its description of those subsystems, marked `// DRAFT`.
- **Lighthouse (local preview, Chromium 1243 via Playwright)**: mobile 100 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100 (Performance / Accessibility / Best Practices / SEO). Mobile LCP 1.5 s, CLS 0, TBT 0 ms.
