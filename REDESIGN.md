# Portfolio site rebuild — Variant A "Lab Notebook"

You are rebuilding this repository (`rushav/WebsitePortfolio`) into a new single-page personal portfolio site from scratch. The visual design is already decided and exported; your job is to implement it faithfully, populate it with real project content pulled from my other repos, and leave clear placeholders where I still need to supply images or numbers.

Work on the current branch (`redesign`). Do not touch `main`. Commit in logical chunks with clear messages. Do not push unless I ask.

\---

## 0\. Before writing any code

1. **Inspect the existing repo.** Determine the framework, build tooling, hosting target and deploy pipeline (look for `vercel.json`, `netlify.toml`, `.github/workflows/`, `CNAME`, `next.config.\*`, `package.json` scripts, `public/`). Write down what you find in a short `NOTES.md` — I need the new site to deploy to the same place with the same domain, so preserve whatever config makes that work.
2. **Salvage content before deleting anything.** Copy these into a scratch folder (`\_salvage/`, gitignored) so they survive the rewrite:

   * All existing project images, GIFs and videos
   * Any resume PDF
   * The full text/data for **VitreaClear** and **ShoeHugger** (wherever they live: components, JSON, MD, etc.)
   * Any list of past employers / positions / dates
3. **Inspect the design export** at `\[C:\\Users\\rusha\\Downloads\\Rushav Dash Portfolio Variants]`. Open its HTML/CSS/assets and record the exact tokens: background color, text colors, accent color, font families and weights, spacing scale, border color/width, corner radius, max content width, section-number styling. Add these to `NOTES.md`. Treat the export as the source of truth for *look*, not as code to copy blindly — if its markup is messy, rebuild it cleanly.

Then show me `NOTES.md` and pause for a one-line go-ahead before continuing.

\---

## 1\. Tech decisions

* Prefer a **lightweight static site**. If the existing repo is Next.js with a working deploy, you may keep Next.js (static export) to avoid breaking deployment, but delete every old component, style, page and asset — nothing from the old design should remain. If the existing setup is fragile or heavy, switch to **Astro** (or plain Vite + HTML/CSS/TS) and update the deploy config accordingly.
* No UI component libraries, no animation libraries, no CSS frameworks beyond what's already there and justified. Plain CSS with custom properties for the design tokens.
* All site copy lives in **one content file** (`src/content/site.ts` or `content/site.json`) so I can edit text without touching layout. Projects are an ordered array of objects.
* Fonts: match the export. Self-host or use a single Google Fonts request; no more than two families (one sans, one mono).
* Performance targets: Lighthouse ≥ 95 on Performance/Accessibility/Best Practices. Images lazy-loaded, sized, and in modern formats where possible. Respect `prefers-reduced-motion`.

\---

## 2\. Page structure (implement exactly this, in this order)

### Nav

Minimal sticky bar. Name on the left, three text links on the right: Projects, Experience, Contact. Transparent background, subtle blur once scrolled. No hamburger on desktop; on mobile collapse links to a simple row or a plain toggle.

### Hero

* Circular profile photo, \~140px. Placeholder image until I supply one. Path: `public/images/profile.jpg`.
* `Rushav Dash` as the largest text on the page.
* Two lines beneath:
`MS Technology Innovation (Robotics) · University of Washington`
`BS Mechanical Engineering · University of Washington`
* Interest statement (use this wording, light editing allowed):
*I'm building a career in robotics, with a focus on the more novel directions of the field — biomimicry and on-board autonomy.*
* Monospace `Currently:` line: `Capstone — on-board machine-vision autonomous drone landing (Project Roost)`, linking down to the Roost card.
* Row: prominent **Download Resume** button (accent outline) linking to `/resume.pdf placeholder ]`; location pin with `\[City, State]` placeholder; icon links for Email, LinkedIn, GitHub (pull handles from the existing site if present; otherwise leave `TODO` placeholders in the content file).
* Monospace `Previously:` line listing past companies/organizations pulled from the salvaged content, separated by `·`. If none found, placeholder.

### Projects

Heading with large section number (`01`) and a thin rule, per the export. Six stacked full-width cards in this order:

1. Project Roost — status **IN PROGRESS** (accent badge)
2. Intrinsic AI Challenge — COMPLETED
3. Project Thoth — COMPLETED
4. Drunky — COMPLETED
5. ShoeHugger — COMPLETED
6. VitreaClear — COMPLETED

**Collapsed card** (visible by default): 16:9 image/video slot on the left (\~40% width, stacks on top on mobile); on the right the project name, status badge, one-line description, a row of 4–5 monospace tech tags, a `Result:` line, and link chips (GitHub · CAD · Video · Report — only render chips that have a URL).

**Expanded card**: reveals a two-column grid with `Sponsor`, `Team role`, then `Description` (short paragraph), `My contribution` (3 bullets), `What I'd do differently` (1–2 lines).

Implement expand/collapse with native `<details>/<summary>` so it works without JavaScript and is keyboard-accessible; enhance with a gentle height/fade transition. First card (Roost) open by default.

### Experience

Heading with section number `02`. 3–4 entries from salvaged content: company in white, title and date range in monospace grey on the same line, 2–3 bullets, a row of skill tags. Close the section with a compact `All skills` block grouped under **Mechanical · Electrical · Software · Fabrication**. If I have no salvageable experience data, build the structure with placeholder entries.

### Contact / footer

Section number `03`. Line: `Open to robotics and mechatronics roles — \[availability]`. Row: Email, LinkedIn, GitHub, Resume. Small monospace footer `Rushav Dash · 2026`.

\---

## 3\. Project content — where to get it

Use `gh repo view <repo> --json description` and `gh api` / cloning to read each README, docs folder, and commit history. **Do not invent facts.** Where a metric or detail is unknown, write `\[TODO: metric]` or `\[TODO: confirm]` in the content file rather than guessing. Mark every description you draft with a `// DRAFT` comment so I know to review it.

|Project|Source|Notes|
|-|-|-|
|**Project Roost**|none yet|Capstone: bio-inspired quadcopter that perches autonomously using onboard vision. Fill Sponsor/Team role/Result with `\[TODO]`. Description: 2–3 sentences from the one-liner above, marked DRAFT.|
|**Intrinsic AI Challenge**|`https://github.com/rushav/aic-workspace`|Solo project. Read README + code structure for the technical approach (vision-guided UR5e connector insertion). Pull any scores/rankings/metrics that appear in the repo.|
|**Project Thoth**|`https://github.com/rushav/T-Mobile-Thoth`|Team project for T-Mobile (hackathon). Read README for purpose and stack. Determine my contribution from `git log --author` and PR history; state it plainly.|
|**Drunky**|`https://github.com/tonyechen/drunky\_ros`|Team project I contributed to but do not own. Read README for the system description. **My contribution must come from `git log --author=rushav` (and variants of my name/email) — list what I actually touched.** Team role from that evidence.|
|**ShoeHugger**|existing site (`\_salvage/`)|Port the text and images from the current site. Restructure into the new fields.|
|**VitreaClear**|existing site (`\_salvage/`)|Port the text and images from the current site. Restructure into the new fields.|

For every project, populate `github` link with the repo URL above (leave `cad`, `video`, `report` as `null` unless you find real links in the repo or salvaged content).

\---

## 4\. Images and placeholders

* Create `public/images/projects/<slug>/` for each project. Move any salvaged images/GIFs in and reference them as the card hero. Where none exists, use a neutral 16:9 placeholder SVG that shows the project name in monospace so I can see which slot is which.
* Generate `IMAGES\_NEEDED.md` listing every image slot on the page, its path, recommended dimensions/aspect ratio, and whether it's currently a placeholder or a salvaged asset.

\---

## 5\. Finishing

1. `npm run build` (or equivalent) must pass with zero warnings you can reasonably fix.
2. Run the dev server and take screenshots of the full page at desktop (1440px) and mobile (390px) widths using Playwright or a similar headless browser. Save to `\_screenshots/` (gitignored) and tell me the paths.
3. Run Lighthouse and report scores.
4. Update `README.md` to describe the new stack, how to run it, and how to edit content (which file, which fields).
5. Give me a final summary: what you built, what you salvaged, every `TODO`/`DRAFT` in the content file grouped by project, and anything you were unsure about.

Do not add features beyond this spec (no dark/light toggle, no blog, no analytics, no contact form). Restraint is part of the design.

