import type { ImageMetadata } from 'astro';

/**
 * Resolve a content path like `/projects/vespr/cover.jpg` to the imported
 * image under `src/assets/`, so Astro's <Image> can generate responsive
 * WebP variants at build time. Throws at build if the file is missing, which
 * is better than a broken cover in production.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export function asset(path: string): ImageMetadata {
  const key = `/src/assets${path.startsWith('/') ? path : `/${path}`}`;
  const mod = files[key];
  if (!mod) {
    throw new Error(`No image at src/assets${path}. Known images:\n  ${Object.keys(files).join('\n  ')}`);
  }
  return mod.default;
}
