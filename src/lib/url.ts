/**
 * Prefix an internal path with the configured `base` so links keep working
 * when the site is published under a sub-path (GitHub Pages project site).
 * External links (http, mailto, placeholders in [[brackets]]) pass through.
 */
export function url(path: string): string {
  if (/^(https?:|mailto:|\[\[)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** True when `pathname` is the page at `href` or a child of it. */
export function isActive(pathname: string, href: string): boolean {
  const target = url(href).replace(/\/+$/, '') || '/';
  const current = pathname.replace(/\/+$/, '') || '/';
  if (target === '/' || target === url('/').replace(/\/+$/, '')) return current === target;
  return current === target || current.startsWith(`${target}/`);
}
