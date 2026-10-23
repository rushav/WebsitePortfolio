/**
 * Theme toggle. The initial theme is applied before paint by the inline
 * script in BaseLayout.astro; this module only wires the button(s).
 */
type Theme = 'light' | 'dark';

const KEY = 'theme';

function current(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable (private mode etc.) — toggle still works for this page */
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
}

export function initTheme() {
  apply(current());
  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    btn.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark'));
  }

  // Follow the OS if the user has never chosen explicitly.
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (!stored) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
  });
}

initTheme();
