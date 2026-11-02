/**
 * Scroll reveals. `[data-reveal]` elements and the direct children of
 * `[data-reveal-group]` fade + rise once on first intersection. Elements that
 * enter together are staggered 60ms apart, up to six; the rest arrive with the
 * sixth. Anything already on screen at load is shown immediately so the page
 * never looks blank, and the classes are removed after the entrance so the
 * element's own hover transitions take over. Disabled under reduced motion
 * (everything simply renders visible) and when IntersectionObserver is missing.
 */
const STAGGER = 60;
const MAX_STAGGER = 6;
const DURATION = 700;

let io: IntersectionObserver | null = null;

function inDomOrder(a: Element, b: Element) {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

export function initReveal() {
  if (io) {
    io.disconnect();
    io = null;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  const targets: HTMLElement[] = [];
  for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
    for (const child of group.children) targets.push(child as HTMLElement);
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) targets.push(el);
  if (targets.length === 0) return;

  io = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      batch.sort(inDomOrder);
      batch.forEach((el, i) => {
        const delay = Math.min(i, MAX_STAGGER - 1) * STAGGER;
        el.style.setProperty('--d', `${delay}ms`);
        el.classList.add('is-visible');
        io?.unobserve(el);
        window.setTimeout(() => {
          el.classList.remove('reveal', 'is-visible');
          el.style.removeProperty('--d');
        }, delay + DURATION);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  const limit = window.innerHeight * 0.9;
  for (const el of targets) {
    // Elements the build sequence is constructing (src/scripts/build.ts) get
    // their entrance from the agents; this fade is the fallback for the rest.
    if (el.hasAttribute('data-building')) continue;
    if (el.getBoundingClientRect().top < limit) continue;
    el.classList.add('reveal');
    io.observe(el);
  }
}

document.addEventListener('astro:page-load', initReveal);
