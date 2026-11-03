/**
 * Theme toggle. Light is the default for everyone; a saved choice (from this
 * toggle, in localStorage) wins. The initial theme is applied before paint by
 * the inline script in BaseLayout.astro; this module wires the button(s) by delegation
 * (the nav persists across view transitions, so no per-page re-binding) and
 * re-applies the stored theme after each client-side swap, because the router
 * replaces the <html> attributes with the new document's.
 */
type Theme = 'light' | 'dark';

const KEY = 'theme';

function stored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

function current(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function reflect(theme: Theme) {
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

function apply(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable (private mode etc.) — toggle still works for this page */
    }
  }
  reflect(theme);
}

export function initTheme() {
  reflect(current());

  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[data-theme-toggle]')) apply(current() === 'dark' ? 'light' : 'dark', true);
  });

  // The router swaps <html> attributes; put the theme back before paint.
  document.addEventListener('astro:after-swap', () => {
    apply(stored() ?? 'light', false);
  });
  document.addEventListener('astro:page-load', () => reflect(current()));
}

initTheme();
