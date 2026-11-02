/**
 * Project card hover. On desktop pointer devices the media box tilts toward
 * the cursor (max 2°) and, if the card carries a `[data-card-loop]` video,
 * the loop plays muted in place of the cover while hovered. Everything is
 * delegated at the document level so it survives view-transition page swaps.
 * CSS handles the lift, cover scale and arrow nudge (`.pc:hover`).
 */
const TILT = 2; // degrees

const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let active: HTMLElement | null = null;
let media: HTMLElement | null = null;
let raf = 0;
let lastX = 0;
let lastY = 0;

function applyTilt() {
  raf = 0;
  if (!active || !media) return;
  const r = active.getBoundingClientRect();
  const rx = (lastX - r.left) / r.width - 0.5;
  const ry = (lastY - r.top) / r.height - 0.5;
  media.style.transform = `perspective(800px) rotateX(${(-ry * TILT * 2).toFixed(2)}deg) rotateY(${(rx * TILT * 2).toFixed(2)}deg) translateY(-2px)`;
}

function enter(card: HTMLElement) {
  active = card;
  media = card.querySelector<HTMLElement>('[data-card-media]');
  const v = card.querySelector<HTMLVideoElement>('[data-card-loop]');
  if (v && !reduce()) v.play().catch(() => {});
}

function leave() {
  if (!active) return;
  const v = active.querySelector<HTMLVideoElement>('[data-card-loop]');
  if (v) v.pause();
  if (media) media.style.transform = '';
  active = null;
  media = null;
}

function initCards() {
  if (!fine()) return;

  document.addEventListener('pointerover', (e) => {
    const card = (e.target as Element).closest<HTMLElement>('[data-card]');
    if (card === active) return;
    leave();
    if (card) enter(card);
  });
  document.addEventListener('pointerout', (e) => {
    if (!active) return;
    const to = e.relatedTarget as Element | null;
    if (!to || !active.contains(to)) leave();
  });
  document.addEventListener(
    'pointermove',
    (e) => {
      if (!active || reduce()) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(applyTilt);
    },
    { passive: true },
  );

  // Crossfade the loop in only once it is actually rendering frames.
  const flag = (on: boolean) => (e: Event) => {
    const v = e.target as HTMLElement;
    if (v.matches?.('[data-card-loop]')) v.closest('[data-card]')?.classList.toggle('is-playing', on);
  };
  document.addEventListener('playing', flag(true), true);
  document.addEventListener('pause', flag(false), true);

  document.addEventListener('astro:before-swap', leave);
}

initCards();
