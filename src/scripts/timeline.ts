/**
 * Experience timeline. A 1px rule sits in the gutter left of `[data-timeline]`
 * (CSS); this module drives a second, accent-coloured rule over it with
 * `scaleY` from scroll progress, and lights each item (date ticks in, category
 * rule fades in) the moment the line's head passes its top. Items stay lit.
 * Only listens to scroll while the list is on screen. Under reduced motion the
 * CSS shows the line fully drawn and nothing here runs.
 */
const HEAD = 0.72; // the line's head sits at 72% of the viewport height

let cleanup: (() => void) | null = null;

export function initTimeline() {
  cleanup?.();
  cleanup = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = document.querySelector<HTMLElement>('[data-timeline]');
  if (!list || reduce || !('IntersectionObserver' in window)) return;

  const items = Array.from(list.children) as HTMLElement[];
  const pending = new Set(items);
  list.classList.add('tl-ready');

  let raf = 0;
  const update = () => {
    raf = 0;
    const head = window.innerHeight * HEAD;
    const r = list.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (head - r.top) / r.height));
    list.style.setProperty('--tl', p.toFixed(4));
    for (const item of pending) {
      if (item.getBoundingClientRect().top <= head) {
        item.classList.add('is-lit');
        pending.delete(item);
      }
    }
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  let listening = false;
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !listening) {
        listening = true;
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else if (!e.isIntersecting && listening) {
        listening = false;
        window.removeEventListener('scroll', onScroll);
        onScroll(); // settle the line at 0 or 1 once it has left
      }
    },
    { rootMargin: '20% 0px 0px 0px' },
  );
  io.observe(list);
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  cleanup = () => {
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}

document.addEventListener('astro:page-load', initTimeline);
