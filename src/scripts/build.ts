/**
 * "Agents build the page". On the session's first load (html.is-building, set
 * before paint by the inline script in BaseLayout), `[data-build]` content is
 * held at opacity 0 while flock agents sprint to each element, trace a
 * blueprint selection box around it on an overlay canvas, and the real
 * content materialises inside. Later sections are built the first time they
 * scroll into view. Agents are borrowed from, and returned to, the ambient
 * flock (src/scripts/flock.ts plugin API).
 *
 * Escape hatches: once per session; click / key / >200px scroll during the
 * first build finishes it instantly; reduced motion never sets the class;
 * deep links (hash, or any page but home) build the first viewport only;
 * under 768px only cards and the headline are built, with fewer agents; a
 * per-batch deadline makes anything an agent cannot reach in time fade in
 * normally; the inline script drops the hidden state after 3s if this module
 * never reports in (`html.build-ok`).
 */
import { recruit, freeAgent, setPlugin, isRunning, drawAgent, agentColor, type Agent } from './flock';

type Kind = 'img' | 'text' | 'box';
type Side = 'l' | 'r' | 't' | 'b';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Job {
  el: HTMLElement;
  label: string;
  kind: Kind;
  r: Rect;
  agent: Agent | null;
  phase: 0 | 1 | 2 | 3 | 4; // queued, travelling, drawing, holding, fading
  p: number; // outline progress 0..1
  t: number; // phase timer, s
  prev: Job | null; // sibling that must start drawing first (left-to-right rows)
  deadline: number; // performance.now() ms by which content must be materialising
  first: boolean;
  ax: number; // where the agent set off from (decides the wipe side)
  ay: number;
}

const DRAW_S = 0.22; // per box, as in the brief (~250ms)
const HOLD_S = 0.15;
const FADE_S = 0.25;
const MAT_MS = 350; // CSS materialise duration (build-in)
const WORK_SPEED = 1400; // px/s: a courier sprint, not the ambient drift
const WORK_FORCE = 9000;
const FLY_IN_S = 0.25; // the flocks arrive before anyone is dispatched
const SECTION_BUDGET_MS = 900;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let vw = 0;
let vh = 0;
let frame: Rect = { x: 0, y: 0, w: 0, h: 0 };
let lineColor = 'rgba(47,111,235,0.7)';
let fillColor = 'rgba(47,111,235,0.08)';
let bgColor = '#fff';
let queue: Job[] = [];
let active: Job[] = [];
let dirty = true;
let dispatchAt = 0;
let cap = 10;
let firstPending = 0;
let io: IntersectionObserver | null = null;
let startScroll = 0;
let cleanups: (() => void)[] = [];

const mobile = () => window.innerWidth < 768;

/* ---------- Classification ---------- */

function kindOf(label: string): Kind {
  if (label.startsWith('img')) return 'img';
  if (/^(h1|h2|text|p|status|meta)$/.test(label)) return 'text';
  return 'box';
}

function isHome() {
  const first = document.querySelector<HTMLAnchorElement>('.nav__link');
  const home = first ? new URL(first.href, location.href).pathname.replace(/\/+$/, '') : '';
  return location.pathname.replace(/\/+$/, '') === home;
}

function showNow(el: HTMLElement) {
  el.classList.add('is-built');
}

/* ---------- Geometry ---------- */

function rectOf(el: Element): Rect {
  // A chip row inside the tech-stack marquee moves; box its static wrapper.
  const r = (el.closest('.marquee') ?? el).getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

function refresh() {
  dirty = false;
  const f = document.querySelector('.frame');
  frame = f ? rectOf(f) : { x: 0, y: 0, w: vw, h: vh };
  for (const j of active) j.r = rectOf(j.el);
}

/** Point and edge direction at fraction q (0..1) clockwise from the top-left. */
function perimeter(r: Rect, q: number): [number, number, number] {
  const L = 2 * (r.w + r.h) || 1;
  let d = Math.max(0, Math.min(1, q)) * L;
  if (d <= r.w) return [r.x + d, r.y, 0];
  d -= r.w;
  if (d <= r.h) return [r.x + r.w, r.y + d, Math.PI / 2];
  d -= r.h;
  if (d <= r.w) return [r.x + r.w - d, r.y + r.h, Math.PI];
  d -= r.w;
  return [r.x, r.y + r.h - d, -Math.PI / 2];
}

function sideFrom(ax: number, ay: number, r: Rect): Side {
  const dx = ax - (r.x + r.w / 2);
  const dy = ay - (r.y + r.h / 2);
  if (Math.abs(dx) / (r.w || 1) > Math.abs(dy) / (r.h || 1)) return dx < 0 ? 'l' : 'r';
  return dy < 0 ? 't' : 'b';
}

/* ---------- Jobs ---------- */

function makeJob(el: HTMLElement, deadline: number, first: boolean, prev: Job | null): Job {
  const label = el.dataset.build || 'box';
  return { el, label, kind: kindOf(label), r: rectOf(el), agent: null, phase: 0, p: 0, t: 0, prev, deadline, first, ax: 0, ay: 0 };
}

function enqueue(els: HTMLElement[], deadline: number, first: boolean) {
  let prev: Job | null = null;
  let prevGroup: Element | null = null;
  for (const el of els) {
    const group = el.closest('[data-build-group]');
    const j = makeJob(el, deadline, first, group && group === prevGroup ? prev : null);
    if (j.r.w <= 0 || j.r.h <= 0) {
      showNow(el); // display:none or collapsed: nothing to draw around
      continue;
    }
    queue.push(j);
    if (first) firstPending++;
    prev = j;
    prevGroup = group;
  }
}

function materialize(j: Job, side: Side) {
  const el = j.el;
  if (j.kind === 'img') {
    const wipe = { l: 'inset(0 100% 0 0)', r: 'inset(0 0 0 100%)', t: 'inset(0 0 100% 0)', b: 'inset(100% 0 0 0)' }[side];
    el.style.setProperty('--wipe', wipe);
  } else if (j.kind === 'text') {
    // Line-by-line reads as a top-down wipe paced by the number of lines.
    const lines = Math.max(1, Math.round(j.r.h / 24));
    el.style.setProperty('--wipe', 'inset(0 0 100% 0)');
    el.style.setProperty('--build-ms', `${Math.min(900, 300 + lines * 110)}ms`);
    el.classList.add('build-text');
  }
  el.classList.add('is-built');
  // The marquee's aria-hidden clone carries the same attributes: build it too.
  const wrap = el.closest('.marquee');
  if (wrap) for (const c of wrap.querySelectorAll('[data-build]')) c.classList.add('is-built');
}

function finishJob(j: Job) {
  if (j.first) firstPending--;
  if (firstPending === 0 && j.first) endFirstBatch();
}

/** Deadline or user skip: content fades in normally, the agent goes home. */
function force(j: Job) {
  if (j.phase >= 3) return;
  const qi = queue.indexOf(j);
  if (qi >= 0) queue.splice(qi, 1);
  if (!j.el.classList.contains('is-built')) materialize(j, 'l');
  if (j.agent) {
    freeAgent(j.agent);
    j.agent = null;
  }
  finishJob(j);
  if (j.p > 0 && active.includes(j)) {
    j.phase = 4;
    j.t = 0;
  } else {
    const ai = active.indexOf(j);
    if (ai >= 0) active.splice(ai, 1);
  }
}

function skipPending() {
  for (const j of [...queue]) force(j);
  for (const j of [...active]) force(j);
}

function endFirstBatch() {
  for (const c of cleanups) c();
  cleanups = [];
}

/* ---------- Simulation ---------- */

function tick(dt: number, now: number) {
  if (dirty) refresh();

  // Dispatch: nearest free agent per job, a few at a time.
  if (now >= dispatchAt) {
    let working = 0;
    for (const j of active) if (j.phase < 3) working++;
    while (working < cap && queue.length) {
      const j = queue[0];
      const a = recruit(j.r.x, j.r.y);
      if (!a) break;
      queue.shift();
      j.agent = a;
      j.phase = 1;
      j.ax = a.x;
      j.ay = a.y;
      a.cap = WORK_SPEED;
      active.push(j);
      working++;
    }
  }

  for (const j of [...active]) {
    if (j.phase < 3 && now > j.deadline) {
      force(j);
      continue;
    }
    const a = j.agent;
    if (j.phase === 1 && a) {
      // Rows build left to right: wait just off the corner until the
      // previous sibling has started its outline.
      const prev = j.prev;
      const gate = !!prev && prev.phase < 3 && (prev.phase < 2 || prev.p < 0.35);
      const tx = gate ? j.r.x - 12 : j.r.x;
      const ty = gate ? j.r.y - 12 : j.r.y;
      const dx = tx - a.x;
      const dy = ty - a.y;
      const d = Math.hypot(dx, dy);
      if (d < 4 && !gate) {
        a.x = j.r.x;
        a.y = j.r.y;
        a.vx = 60;
        a.vy = 0;
        j.phase = 2;
        j.p = 0;
      } else {
        const sp = d < 4 ? 0 : Math.min(WORK_SPEED, 40 + d * 8);
        let fx = ((dx / (d || 1)) * sp - a.vx) * 14;
        let fy = ((dy / (d || 1)) * sp - a.vy) * 14;
        const fl = Math.hypot(fx, fy);
        if (fl > WORK_FORCE) {
          fx = (fx / fl) * WORK_FORCE;
          fy = (fy / fl) * WORK_FORCE;
        }
        a.vx += fx * dt;
        a.vy += fy * dt;
        const v = Math.hypot(a.vx, a.vy);
        if (v > WORK_SPEED) {
          a.vx = (a.vx / v) * WORK_SPEED;
          a.vy = (a.vy / v) * WORK_SPEED;
        }
        a.x += a.vx * dt;
        a.y += a.vy * dt;
      }
    } else if (j.phase === 2 && a) {
      j.p += dt / DRAW_S;
      const [x, y, dir] = perimeter(j.r, j.p);
      a.x = x;
      a.y = y;
      a.vx = Math.cos(dir) * 120;
      a.vy = Math.sin(dir) * 120;
      if (j.p >= 1) {
        materialize(j, sideFrom(j.ax, j.ay, j.r));
        // Release along the edge it was tracing; the sprint cap decays.
        a.cap = 300;
        a.vx = Math.cos(dir) * 160;
        a.vy = Math.sin(dir) * 160;
        freeAgent(a);
        j.agent = null;
        j.phase = 3;
        j.t = 0;
        finishJob(j);
      }
    } else if (j.phase === 3) {
      j.t += dt;
      if (j.t >= HOLD_S) {
        j.phase = 4;
        j.t = 0;
      }
    } else if (j.phase === 4) {
      j.t += dt;
      if (j.t >= FADE_S) active.splice(active.indexOf(j), 1);
    } else if (!a) {
      // Agent lost (e.g. flock resized it away): fall back.
      force(j);
    }
  }
  for (const j of [...queue]) if (now > j.deadline) force(j);
}

/* ---------- Drawing ---------- */

function line(x1: number, y1: number, x2: number, y2: number) {
  ctx!.beginPath();
  ctx!.moveTo(x1, y1);
  ctx!.lineTo(x2, y2);
  ctx!.stroke();
}

function handle(x: number, y: number) {
  ctx!.fillStyle = bgColor;
  ctx!.fillRect(Math.round(x) - 2.5, Math.round(y) - 2.5, 5, 5);
  ctx!.strokeRect(Math.round(x) - 2.5, Math.round(y) - 2.5, 5, 5);
}

function drawWire(j: Job, now: number) {
  const c = ctx!;
  const r = j.r;
  const q = j.phase >= 3 ? 1 : j.phase === 2 ? Math.min(1, j.p) : 0;
  if (q <= 0) return;
  const a = j.phase === 4 ? Math.max(0, 1 - j.t / FADE_S) : 1;
  const x = Math.round(r.x) + 0.5;
  const y = Math.round(r.y) + 0.5;
  const w = Math.round(r.w);
  const h = Math.round(r.h);
  c.lineWidth = 1;
  c.strokeStyle = lineColor;

  // Guides out to the frame edges.
  c.globalAlpha = 0.22 * a;
  line(x, frame.y, x, frame.y + frame.h);
  line(x + w, frame.y, x + w, frame.y + frame.h);
  line(frame.x, y, frame.x + frame.w, y);
  line(frame.x, y + h, frame.x + frame.w, y + h);

  // Image slots: translucent fill and a + crosshair.
  if (j.kind === 'img') {
    c.globalAlpha = a * Math.min(1, q * 2);
    c.fillStyle = fillColor;
    c.fillRect(x, y, w, h);
    if (q >= 1) {
      c.globalAlpha = 0.9 * a;
      const cx = Math.round(r.x + r.w / 2) + 0.5;
      const cy = Math.round(r.y + r.h / 2) + 0.5;
      line(cx - 7, cy, cx + 7, cy);
      line(cx, cy - 7, cx, cy + 7);
    }
  }

  // Outline, grown clockwise with the agent.
  c.globalAlpha = a;
  const L = 2 * (w + h) || 1;
  const pts: [number, number][] = [[x, y]];
  const segs = [w, h, w, h];
  const dirs: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  let left = q * L;
  let px = x;
  let py = y;
  for (let i = 0; i < 4 && left > 0; i++) {
    const len = Math.min(left, segs[i]);
    px += dirs[i][0] * len;
    py += dirs[i][1] * len;
    pts.push([px, py]);
    left -= len;
  }
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.stroke();

  // Corner handles appear as the outline reaches them.
  const reach = q * L;
  handle(x, y);
  if (reach >= w) handle(x + w, y);
  if (reach >= w + h) handle(x + w, y + h);
  if (reach >= L - 1) handle(x, y + h);

  // Blinking I-beam at the start of text.
  if (j.kind === 'text' && Math.floor(now / 400) % 2 === 0) {
    const ih = Math.min(h - 4, 18);
    c.globalAlpha = 0.9 * a;
    line(x + 2, y + 2, x + 2, y + 2 + ih);
    line(x, y + 2, x + 4, y + 2);
    line(x, y + 2 + ih, x + 4, y + 2 + ih);
  }

  // Label tag above the top-left corner.
  c.globalAlpha = a;
  c.font = '500 10px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
  c.textBaseline = 'middle';
  const tw = Math.ceil(c.measureText(j.label).width) + 8;
  const ty = y - 16;
  c.fillStyle = lineColor;
  c.beginPath();
  c.roundRect(x - 0.5, ty, tw, 14, 2);
  c.fill();
  c.fillStyle = '#fff';
  c.fillText(j.label, x + 3.5, ty + 7.5);
  c.globalAlpha = 1;
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, vw, vh);
  if (active.length === 0) return;
  const now = performance.now();
  for (const j of active) drawWire(j, now);
  for (const j of active) {
    if (!j.agent) continue;
    // The agent drawing a box takes the blueprint colour; couriers keep theirs.
    drawAgent(ctx, j.agent, dpr, j.phase === 2 ? lineColor : agentColor(j.agent), 0.95);
  }
}

/* ---------- Setup ---------- */

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  lineColor = cs.getPropertyValue('--build-line').trim() || lineColor;
  fillColor = cs.getPropertyValue('--build-fill').trim() || fillColor;
  bgColor = cs.getPropertyValue('--bg-frame').trim() || bgColor;
}

function resize() {
  if (!canvas || !ctx) return;
  vw = window.innerWidth;
  vh = window.innerHeight;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  dirty = true;
}

function teardown() {
  skipPending();
  endFirstBatch();
  io?.disconnect();
  io = null;
  setPlugin(null);
  canvas?.remove();
  canvas = null;
  ctx = null;
  queue = [];
  active = [];
}

async function start(firstEls: HTMLElement[], laterEls: HTMLElement[], budgetMs: number) {
  // Rects are measured after the fonts are in, so no box is drawn at a stale size.
  await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 400))]);
  if (!isRunning()) {
    // No flock (no canvas / rAF): everything simply fades in.
    for (const el of [...firstEls, ...laterEls]) showNow(el);
    return;
  }
  canvas = document.createElement('canvas');
  canvas.className = 'build-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  if (!ctx) {
    for (const el of [...firstEls, ...laterEls]) showNow(el);
    return;
  }
  readColors();
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => (dirty = true), { passive: true });
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const t0 = performance.now();
  dispatchAt = t0 + FLY_IN_S * 1000;
  cap = mobile() ? 6 : 10;
  enqueue(firstEls, t0 + budgetMs - MAT_MS, true);

  // Skip: any click, key, or a real scroll during the first build.
  startScroll = window.scrollY;
  const skip = () => skipPending();
  const onScroll = () => {
    if (Math.abs(window.scrollY - startScroll) > 200) skipPending();
  };
  document.addEventListener('click', skip, true);
  document.addEventListener('keydown', skip, true);
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => {
    document.removeEventListener('click', skip, true);
    document.removeEventListener('keydown', skip, true);
    window.removeEventListener('scroll', onScroll);
  });
  if (firstPending === 0) endFirstBatch();

  // Later sections: built the first time they enter the viewport.
  if (laterEls.length && 'IntersectionObserver' in window) {
    const waiting = new Set(laterEls);
    io = new IntersectionObserver(
      (entries) => {
        const batch = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        for (const el of batch) {
          io?.unobserve(el);
          waiting.delete(el);
        }
        if (batch.length) enqueue(batch, performance.now() + SECTION_BUDGET_MS, false);
      },
      { threshold: 0.05 },
    );
    for (const el of laterEls) io.observe(el);

    // A jump (anchor link, End key, fast fling) can carry a section past the
    // viewport without it ever intersecting: anything already above the fold
    // just appears, so scrolling back up never finds an empty slot.
    let pendingCheck = 0;
    const passed = () => {
      pendingCheck = 0;
      for (const el of waiting) {
        if (el.getBoundingClientRect().bottom < 0) {
          io?.unobserve(el);
          waiting.delete(el);
          showNow(el);
        }
      }
      if (waiting.size === 0) window.removeEventListener('scroll', onPass);
    };
    const onPass = () => {
      if (!pendingCheck) pendingCheck = requestAnimationFrame(passed);
    };
    window.addEventListener('scroll', onPass, { passive: true });
  } else {
    for (const el of laterEls) showNow(el);
  }

  setPlugin({ tick, draw });
}

export function initBuild() {
  const html = document.documentElement;
  if (!html.classList.contains('is-building')) return;
  const all = Array.from(document.querySelectorAll<HTMLElement>('[data-build]'));
  if (all.length === 0) {
    html.classList.remove('is-building');
    return;
  }
  const small = mobile();
  const deep = location.hash !== '' || !isHome();
  const vhNow = window.innerHeight;
  const first: HTMLElement[] = [];
  const later: HTMLElement[] = [];
  for (const el of all) {
    const label = el.dataset.build || 'box';
    const eligible = !small || /^(h1|card|img)/.test(label);
    const r = el.getBoundingClientRect();
    const inView = r.top < vhNow && r.bottom > 0;
    if (!eligible) showNow(el);
    else if (inView) {
      first.push(el);
      el.setAttribute('data-building', '');
    } else if (deep || small) {
      // Off-screen on a deep link (or the short mobile version): normal reveal.
      showNow(el);
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
    } else {
      later.push(el);
      el.setAttribute('data-building', '');
    }
  }
  html.classList.add('build-ok'); // cancels the inline script's 3s safety release
  void start(first, later, small ? 1200 : 1600);
}

document.addEventListener('astro:page-load', initBuild);
document.addEventListener('astro:before-swap', teardown);
