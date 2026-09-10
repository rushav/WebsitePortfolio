/** Prefix a site-root-relative path with the configured `base` (e.g. /WebsitePortfolio). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
