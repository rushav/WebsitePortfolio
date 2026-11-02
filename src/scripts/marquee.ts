/**
 * Tech-stack marquee. Only when the chip row wraps past one line on the
 * current viewport does it become a slow horizontal marquee (one wrapping
 * list → two side-by-side copies in a track that translates by half its
 * width). Otherwise the row stays static. Pauses on hover/focus, on tap, when
 * scrolled off screen, and never runs under reduced motion.
 */
const SPEED = 28; // px/s

let cleanup: (() => void) | null = null;

function build(list: HTMLElement) {
  const wrap = document.createElement('div');
  wrap.className = 'marquee';
  const track = document.createElement('div');
  track.className = 'marquee__track';
  list.parentElement!.insertBefore(wrap, list);
  const clone = list.cloneNode(true) as HTMLElement;
  clone.setAttribute('aria-hidden', 'true');
  clone.removeAttribute('aria-label');
  clone.removeAttribute('data-marquee');
  track.append(list, clone);
  wrap.append(track);
  const w = list.scrollWidth;
  track.style.setProperty('--marquee-t', `${Math.max(20, Math.round(w / SPEED))}s`);
  return wrap;
}

function unbuild(wrap: HTMLElement) {
  const list = wrap.querySelector<HTMLElement>('[data-marquee]');
  if (list) wrap.parentElement!.insertBefore(list, wrap);
  wrap.remove();
}

export function initMarquee() {
  cleanup?.();
  cleanup = null;
  const list = document.querySelector<HTMLElement>('[data-marquee]');
  if (!list) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Reduced motion (possibly switched on mid-session): back to the static wrapping row.
    const built = list.closest<HTMLElement>('.marquee');
    if (built) unbuild(built);
    return;
  }

  let wrap: HTMLElement | null = null;
  let io: IntersectionObserver | null = null;

  const wraps = () => {
    const first = list.firstElementChild as HTMLElement | null;
    return !!first && list.getBoundingClientRect().height > first.getBoundingClientRect().height * 1.6;
  };

  const settle = () => {
    if (wrap) {
      // Measure the plain list again without tearing the marquee down.
      wrap.classList.add('is-measuring');
      const over = wraps();
      wrap.classList.remove('is-measuring');
      if (!over) {
        io?.disconnect();
        unbuild(wrap);
        wrap = null;
      }
    } else if (wraps()) {
      wrap = build(list);
      io = new IntersectionObserver(([e]) => wrap?.classList.toggle('is-off', !e.isIntersecting), { threshold: 0 });
      io.observe(wrap);
      wrap.addEventListener('pointerdown', (e) => {
        if ((e as PointerEvent).pointerType !== 'mouse') wrap?.classList.toggle('is-paused');
      });
    }
  };

  let t = 0;
  const onResize = () => {
    clearTimeout(t);
    t = window.setTimeout(settle, 150);
  };
  settle();
  window.addEventListener('resize', onResize, { passive: true });
  cleanup = () => {
    window.removeEventListener('resize', onResize);
    io?.disconnect();
    clearTimeout(t);
  };
}

document.addEventListener('astro:page-load', initMarquee);
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', initMarquee);
