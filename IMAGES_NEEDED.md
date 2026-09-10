# Image slots

Every image slot on the page, where it lives, and whether it is currently a placeholder or a salvaged asset.
Paths are relative to `public/`. Change a path in `src/content/site.ts` if you rename a file.

| # | Slot | Path | Recommended | Status |
|---|------|------|-------------|--------|
| 1 | Hero profile photo (circular, 140 px desktop / 96 px mobile) | `images/profile.jpg` | Square, ≥ 400×400, face centered; JPG or WebP | **Supplied** — 400×400 JPG, face-centered crop of the studio portrait |
| 2 | Project Roost card hero | `images/projects/roost/placeholder.svg` | 16:9, ≥ 1280×720 WebP (or MP4/WebM if you want video) | **Placeholder** SVG |
| 3 | Intrinsic AI Challenge card hero | `images/projects/intrinsic/hero.webp` | 16:9, 1280×720 | **Salvaged** — cover-cropped from `port-labeled.png` (wrist-camera view, red crosshair on target port) |
| 4 | Project Thoth card hero | `images/projects/thoth/hero.webp` | 16:9, 1280×720 | **Supplied** — cover-cropped from the Thoth title card (1690×952) |
| 5 | Drunky card hero | `images/projects/drunky/hero.webp` | 16:9, 1280×720 | **Salvaged** from `tonyechen/drunky_ros` `dataset/raw/group/group_000.jpg` (overhead RealSense view of the shelf and both arms); original kept as `overhead-shelf.jpg` |
| 6 | ShoeHugger card hero | `images/projects/shoehugger/hero.webp` | 16:9, 1280×720 | **Supplied** — cover-cropped from the shell render (1440×906, kept as `render-shell.jpg`); the earlier as-built photo is still there as `real-orthographic.jpg` |
| 7 | VitreaClear card hero | `images/projects/vitreaclear/hero.webp` | 16:9, 1280×720 | **Salvaged but weak** — `rod-assembly.jpg` is a portrait CAD render, so it is letterboxed on white. A 16:9 bench or prototype photo would look much better. |
| 8 | Favicon | `favicon.svg` | Any square SVG | Generated — amber "RD" on warm black |

## Notes

- All hero slots render at about 440 px wide on desktop (40% of the 1100 px content column) and full width on mobile, with `object-fit: cover`. Supplying a true 16:9 file avoids cropping.
- To swap a hero: drop the new file in the project folder and point `image.src` in `src/content/site.ts` at it; set `placeholder: false`. Real heroes are served with `srcset`, so also provide a 640×360 copy named `<name>-640.webp` next to the 1280×720 file (a one-liner with `sharp`: `sharp('hero.webp').resize(640,360).webp({quality:78}).toFile('hero-640.webp')`).
- To use video instead of an image for a card, replace the `<img>` in `src/components/ProjectCard.astro` with a muted, looping `<video>` — the slot is already `aspect-ratio: 16/9`.
- The other salvaged images (Intrinsic camera views, Drunky training charts, ShoeHugger renders and build photos) are kept alongside each hero in `public/images/projects/<slug>/` but are not referenced by the page.
- Images from the old site for projects that are no longer on the page (Mini Desktop Arcade, Synthetic Sleep Data, SkinSafe) are only in the gitignored `_salvage/images/` folder.
