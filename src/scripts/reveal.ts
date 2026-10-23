/**
 * One entrance: sections fade + rise 8px the first time they intersect.
 * Fully disabled under prefers-reduced-motion and when IntersectionObserver
 * is unavailable (elements simply render visible).
 */
export function initReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window) || targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  for (const el of targets) {
    // Anything already in view on load is shown immediately so the page
    // never looks blank while the observer wakes up.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      continue;
    }
    el.classList.add('reveal');
    io.observe(el);
  }
}

initReveal();
