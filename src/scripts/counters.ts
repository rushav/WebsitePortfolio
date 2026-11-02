/**
 * Count-up stats. The HTML carries the final value (an sr-only copy for
 * screen readers plus an aria-hidden visible copy). When the visible copy is
 * half on screen it counts from 0 to the value over 900ms with an ease-out,
 * keeping any prefix/suffix (`%`, `+`, ` px`, ` Hz`) and the source's decimal
 * places and thousands separators. Under reduced motion nothing runs and the
 * final value stays as rendered.
 */
const DURATION = 900;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Parsed {
  prefix: string;
  suffix: string;
  value: number;
  decimals: number;
  commas: boolean;
}

function parse(text: string): Parsed | null {
  const m = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(text.trim());
  if (!m) return null;
  const num = m[2];
  return {
    prefix: m[1],
    suffix: m[3],
    value: parseFloat(num.replace(/,/g, '')),
    decimals: (num.split('.')[1] || '').length,
    commas: num.includes(','),
  };
}

function format(p: Parsed, v: number) {
  let s = v.toFixed(p.decimals);
  if (p.commas) {
    const [int, frac] = s.split('.');
    s = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (frac ? `.${frac}` : '');
  }
  return p.prefix + s + p.suffix;
}

function run(el: HTMLElement, p: Parsed) {
  // During the build sequence (src/scripts/build.ts) the tile is still held at
  // opacity 0: start counting only once an agent has built it.
  const host = el.closest('[data-build]');
  if (host && document.documentElement.classList.contains('is-building') && !host.classList.contains('is-built')) {
    requestAnimationFrame(() => run(el, p));
    return;
  }
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    el.textContent = format(p, p.value * easeOut(t));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

let io: IntersectionObserver | null = null;

export function initCounters() {
  if (io) {
    io.disconnect();
    io = null;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll<HTMLElement>('[data-count-num]:not([data-counted])');
  if (els.length === 0) return;

  const parsed = new Map<HTMLElement, Parsed>();
  for (const el of els) {
    const p = parse(el.textContent || '');
    if (!p) continue;
    parsed.set(el, p);
    el.textContent = format(p, 0);
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io?.unobserve(el);
        el.dataset.counted = '';
        const p = parsed.get(el);
        if (p) run(el, p);
      }
    },
    { threshold: 0.5 },
  );
  for (const el of parsed.keys()) io.observe(el);
}

document.addEventListener('astro:page-load', initCounters);
