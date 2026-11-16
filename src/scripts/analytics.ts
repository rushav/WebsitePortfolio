/**
 * Clarity custom events and client-router page views. Loaded by
 * src/components/Analytics.astro in production builds only. Every call is a
 * no-op when Clarity is not on the page (opted out via ?notrack, or blocked).
 *
 * Events are inferred from link targets by one delegated listener, so no
 * markup needs per-link attributes:
 *   resume_click            link to resume.pdf
 *   project_open_<slug>     internal link to /projects/<slug>/ (cards, pager)
 *   github_click_<slug>     github.com link inside a project card / project page ([data-slug])
 *   email_click             mailto: link
 *   linkedin_click          linkedin.com link
 *   theme_dark              theme toggle switched to dark
 */
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

function clarity(...args: unknown[]) {
  if (typeof window.clarity === 'function') window.clarity(...args);
}

const event = (name: string) => clarity('event', name);

const projectPath = /\/projects\/([^/?#]+)\/?$/;

document.addEventListener(
  'click',
  (e) => {
    const target = e.target as Element | null;

    // Theme toggle: this capture listener runs before theme.ts flips the
    // theme, so read the result once the click has been handled.
    if (target?.closest('[data-theme-toggle]')) {
      setTimeout(() => {
        if (document.documentElement.dataset.theme === 'dark') event('theme_dark');
      }, 0);
      return;
    }

    const a = target?.closest<HTMLAnchorElement>('a[href]');
    if (!a) return;
    const href = a.href;

    if (href.startsWith('mailto:')) return event('email_click');

    let u: URL;
    try {
      u = new URL(href, location.href);
    } catch {
      return;
    }

    if (/(^|\.)linkedin\.com$/.test(u.hostname)) return event('linkedin_click');
    if (/\/resume\.pdf$/i.test(u.pathname)) return event('resume_click');

    if (u.hostname === 'github.com') {
      const slug = a.closest<HTMLElement>('[data-slug]')?.dataset.slug;
      if (slug) event(`github_click_${slug}`);
      return;
    }

    if (u.origin === location.origin) {
      const m = u.pathname.match(projectPath);
      if (m) event(`project_open_${m[1]}`);
    }
  },
  { capture: true },
);

// Client-router navigations are history.pushState changes. Clarity follows
// those on its own, but tag the page explicitly as well so every view-transition
// navigation is attributed to the right path. The first load is already counted.
let first = true;
document.addEventListener('astro:page-load', () => {
  if (first) {
    first = false;
    return;
  }
  clarity('set', 'page', location.pathname);
});

export {};
