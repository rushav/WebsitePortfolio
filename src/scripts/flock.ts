/**
 * Ambient flock. Tiny chevrons on a fixed canvas behind the content, steered
 * by classic boids (separation / alignment / cohesion) plus a little wander.
 * A nod to bio-inspired robotics: agents avoid the cursor like birds avoiding
 * a hand, perch on the top edge of `[data-perch]` elements for a few seconds,
 * and gather into a slow orbit around `[data-perch="cta"]` while it is on
 * screen. Everything pauses when the tab is hidden and never runs under
 * prefers-reduced-motion. Renders nothing if canvas or rAF is unavailable.
 *
 * The build sequence (src/scripts/build.ts) borrows agents through the small
 * plugin API at the bottom: a recruited agent enters `St.Work`, the plugin
 * moves and draws it (on its own overlay canvas) and hands it back with
 * `freeAgent()`.
 */

export const enum St {
  Fly,
  Land,
  Perch,
  Work,
}

export interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  h: number; // drawn heading (rad), eased toward the velocity heading
  c: number; // colour index into `colors`
  s: number; // size, px
  st: St;
  p: Perch | null;
  px: number; // fraction along the perch's top edge
  t: number; // perched countdown, or re-landing cooldown, seconds
  wa: number; // wander angle offset
  cap: number; // current speed cap; decays back to MAX_SPEED after a sprint
}

interface Perch {
  el: Element;
  x: number;
  y: number;
  w: number;
  h: number;
  n: number; // agents currently landing/perched here
  vis: boolean;
}

export interface Plugin {
  tick(dt: number, now: number): void;
  draw(): void;
}

export const MAX_SPEED = 46; // px/s. Ambient, not a screensaver.
const MIN_SPEED = 18;
const MAX_FORCE = 70;
const ORBIT_SPEED = 34;
const R_NEIGH = 64;
const R_SEP = 28;
const R_CURSOR = 120;
const MARGIN = 40;
const MAX_PER_PERCH = 3;
const CAP_DECAY = 1500; // px/s² at which a sprint cap relaxes back to ambient

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let agents: Agent[] = [];
let perches: Perch[] = [];
let cta: Perch | null = null;
let colors: string[] = [];
let alpha = 0.35;
let dpr = 1;
let vw = 0;
let vh = 0;
let raf = 0;
let last = 0;
let running = false;
let fade = 0; // 0..1 global opacity
let fadeRate = 0; // per second
let fadeDelay = 0; // seconds before fading in
let rectsDirty = true;
let plugin: Plugin | null = null;
const cur = { x: -9999, y: -9999 };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  const faint = v('--text-faint') || '#a3a3a0';
  colors = [
    faint,
    v('--cat-autonomy-text'),
    v('--cat-manip-text'),
    v('--cat-perception-text'),
    v('--cat-mech-text'),
    v('--cat-software-text'),
  ].map((c) => c || faint);
  // Spec says ~35%: at 35% the faint grey vanished on the white frame at 1x, so
  // 45% light / 60% dark (the dark faint has even less contrast on its surface).
  alpha = document.documentElement.dataset.theme === 'dark' ? 0.6 : 0.45;
}

function targetCount() {
  if (vw < 700) return 25;
  return Math.max(40, Math.min(70, Math.round((vw * vh) / 25000)));
}

function makeAgent(flyIn: boolean): Agent {
  const a = Math.random() * Math.PI * 2;
  const sp = rnd(MIN_SPEED, MAX_SPEED);
  return {
    x: flyIn ? rnd(-220, -10) : rnd(0, vw),
    y: rnd(MARGIN, vh - MARGIN),
    vx: flyIn ? rnd(40, 60) : Math.cos(a) * sp,
    vy: flyIn ? rnd(-8, 8) : Math.sin(a) * sp,
    h: flyIn ? 0 : a,
    // ~10% of agents pick up a category tint so the flock carries the palette.
    c: Math.random() < 0.1 ? 1 + Math.floor(Math.random() * 5) : 0,
    s: rnd(6, 8),
    st: St.Fly,
    p: null,
    px: 0,
    t: rnd(0, 3),
    wa: 0,
    cap: MAX_SPEED,
  };
}

/** Build fly-in: 2–3 small flocks enter from off-screen at speed. */
function spawnClusters() {
  const spots = [
    { x: -120, y: vh * 0.35, tx: vw * 0.3, ty: vh * 0.4 },
    { x: vw * 0.7, y: -120, tx: vw * 0.6, ty: vh * 0.3 },
    { x: vw * 0.4, y: vh + 120, tx: vw * 0.5, ty: vh * 0.7 },
  ].slice(0, vw < 700 ? 2 : 3);
  agents = agents.map((_, i) => {
    const s = spots[i % spots.length];
    const a = makeAgent(false);
    a.x = s.x + rnd(-50, 50);
    a.y = s.y + rnd(-50, 50);
    const dx = s.tx - a.x;
    const dy = s.ty - a.y;
    const d = Math.hypot(dx, dy) || 1;
    const sp = rnd(600, 760);
    a.vx = (dx / d) * sp;
    a.vy = (dy / d) * sp;
    a.h = Math.atan2(a.vy, a.vx);
    a.cap = sp;
    return a;
  });
}

function resize() {
  if (!canvas || !ctx) return;
  vw = window.innerWidth;
  vh = window.innerHeight;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(vw * dpr);
  canvas.height = Math.round(vh * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = targetCount();
  while (agents.length > n) {
    const a = agents.pop()!;
    if (a.st !== St.Work) release(a);
    else agents.unshift(a); // never drop a working agent; try the other end
    if (agents.length <= n) break;
  }
  while (agents.length < n) agents.push(makeAgent(false));
  rectsDirty = true;
}

/** Re-query perch targets. Called on every page load (the DOM is new). */
function collectTargets() {
  const next: Perch[] = [];
  cta = null;
  for (const el of document.querySelectorAll('[data-perch]')) {
    const p: Perch = { el, x: 0, y: 0, w: 0, h: 0, n: 0, vis: false };
    if ((el as HTMLElement).dataset.perch === 'cta') cta = p;
    else next.push(p);
  }
  // Agents sitting on elements that no longer exist take off.
  for (const a of agents) if (a.p && !a.p.el.isConnected) release(a);
  perches = next;
  rectsDirty = true;
}

function refreshRects() {
  rectsDirty = false;
  const read = (p: Perch) => {
    const r = p.el.getBoundingClientRect();
    p.x = r.left;
    p.y = r.top;
    p.w = r.width;
    p.h = r.height;
    p.vis = r.width > 0 && r.bottom > 0 && r.top < vh;
  };
  for (const p of perches) read(p);
  if (cta) {
    read(cta);
    // Orbit only while a decent slice of the band is on screen.
    cta.vis = cta.vis && cta.y < vh - 96 && cta.y + cta.h > 96;
  }
}

function release(a: Agent) {
  if (a.p) a.p.n--;
  a.p = null;
  if (a.st === St.Perch) {
    a.vx = (Math.random() < 0.5 ? -1 : 1) * rnd(18, 28);
    a.vy = -rnd(28, 40);
  }
  a.st = St.Fly;
  a.t = rnd(4, 8); // don't land again straight away
}

function tryLand(a: Agent, dt: number) {
  if (a.t > 0 || perches.length === 0) return;
  for (const p of perches) {
    if (!p.vis || p.n >= MAX_PER_PERCH) continue;
    const dy = p.y - a.y;
    if (dy < -12 || dy > 72 || a.x < p.x - 24 || a.x > p.x + p.w + 24) continue;
    // Roughly a 50% chance per second while hovering over a card top.
    if (Math.random() < 0.5 * dt) {
      a.st = St.Land;
      a.p = p;
      a.px = rnd(0.08, 0.92);
      p.n++;
      return;
    }
  }
}

function step(dt: number) {
  const orbit = cta && cta.vis ? cta : null;
  const n = agents.length;

  for (let i = 0; i < n; i++) {
    const a = agents[i];
    if (a.st === St.Work) continue; // moved by the build plugin

    if (a.st === St.Perch) {
      const p = a.p!;
      a.t -= dt;
      if (a.t <= 0 || !p.vis) {
        release(a);
      } else {
        a.x = p.x + a.px * p.w;
        a.y = p.y - 3;
        a.vx = a.vy = 0;
        continue;
      }
    }

    let fx = 0;
    let fy = 0;

    if (a.st === St.Land) {
      const p = a.p!;
      if (!p.vis) {
        release(a);
      } else {
        const tx = p.x + a.px * p.w;
        const ty = p.y - 3;
        const dx = tx - a.x;
        const dy = ty - a.y;
        const d = Math.hypot(dx, dy);
        if (d < 1.5) {
          a.x = tx;
          a.y = ty;
          a.vx = a.vy = 0;
          a.st = St.Perch;
          a.t = rnd(2, 5);
          continue;
        }
        // Arrival: slow down over the last 40px.
        const sp = Math.min(MAX_SPEED, 12 + d * 1.6);
        fx = ((dx / d) * sp - a.vx) * 4;
        fy = ((dy / d) * sp - a.vy) * 4;
      }
    }

    if (a.st === St.Fly) {
      a.t -= dt;
      // Boids.
      let sx = 0;
      let sy = 0;
      let ax = 0;
      let ay = 0;
      let cx = 0;
      let cy = 0;
      let cnt = 0;
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const b = agents[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > R_NEIGH * R_NEIGH || d2 === 0) continue;
        const d = Math.sqrt(d2);
        if (d < R_SEP) {
          const k = (1 - d / R_SEP) / d;
          sx += dx * k;
          sy += dy * k;
        }
        if (b.st === St.Fly) {
          ax += b.vx;
          ay += b.vy;
          cx += b.x;
          cy += b.y;
          cnt++;
        }
      }
      fx += sx * 90;
      fy += sy * 90;
      if (cnt > 0 && !orbit) {
        const al = Math.hypot(ax, ay) || 1;
        fx += ((ax / al) * MAX_SPEED - a.vx) * 0.6;
        fy += ((ay / al) * MAX_SPEED - a.vy) * 0.6;
        const mx = cx / cnt - a.x;
        const my = cy / cnt - a.y;
        const ml = Math.hypot(mx, my) || 1;
        fx += ((mx / ml) * MAX_SPEED - a.vx) * 0.22;
        fy += ((my / ml) * MAX_SPEED - a.vy) * 0.22;
      }

      // Wander: a slowly drifting offset from the current heading.
      a.wa += rnd(-2.4, 2.4) * dt;
      if (a.wa > 1) a.wa = 1;
      else if (a.wa < -1) a.wa = -1;
      const hd = Math.atan2(a.vy, a.vx) + a.wa;
      fx += Math.cos(hd) * 22;
      fy += Math.sin(hd) * 22;

      // Orbit the CTA band when it is in view.
      if (orbit) {
        const rx = orbit.w / 2 + 44;
        const ry = orbit.h / 2 + 44;
        const ox = orbit.x + orbit.w / 2;
        const oy = orbit.y + orbit.h / 2;
        const nx = (a.x - ox) / rx;
        const ny = (a.y - oy) / ry;
        const rho = Math.hypot(nx, ny) || 1e-3;
        // Tangent (counter-clockwise) mapped back to screen space.
        let tx = -ny * rx;
        let ty = nx * ry;
        const tl = Math.hypot(tx, ty) || 1;
        tx /= tl;
        ty /= tl;
        // Radial correction toward the ring.
        const k = Math.max(-1, Math.min(1, (1 - rho) * 2.5));
        let dx = tx + (nx / rho) * k;
        let dy = ty + (ny / rho) * k;
        const dl = Math.hypot(dx, dy) || 1;
        dx = (dx / dl) * ORBIT_SPEED;
        dy = (dy / dl) * ORBIT_SPEED;
        fx += (dx - a.vx) * 2.2;
        fy += (dy - a.vy) * 2.2;
      } else {
        tryLand(a, dt);
      }
    }

    // Cursor: steer away, never toward.
    {
      const dx = a.x - cur.x;
      const dy = a.y - cur.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R_CURSOR * R_CURSOR && d2 > 0) {
        const d = Math.sqrt(d2);
        const k = ((1 - d / R_CURSOR) * 220) / d;
        fx += dx * k;
        fy += dy * k;
      }
    }

    // Soft viewport bounds.
    if (a.x < MARGIN) fx += ((MARGIN - a.x) / MARGIN) * 90;
    else if (a.x > vw - MARGIN) fx -= ((a.x - vw + MARGIN) / MARGIN) * 90;
    if (a.y < MARGIN) fy += ((MARGIN - a.y) / MARGIN) * 90;
    else if (a.y > vh - MARGIN) fy -= ((a.y - vh + MARGIN) / MARGIN) * 90;

    // Clamp force, integrate, clamp speed. A sprint cap (fly-in, or just
    // released from building) relaxes back to the ambient speed.
    if (a.cap > MAX_SPEED) a.cap = Math.max(MAX_SPEED, a.cap - CAP_DECAY * dt);
    const fl = Math.hypot(fx, fy);
    const fmax = a.st === St.Land ? MAX_FORCE * 2 : MAX_FORCE;
    if (fl > fmax) {
      fx = (fx / fl) * fmax;
      fy = (fy / fl) * fmax;
    }
    a.vx += fx * dt;
    a.vy += fy * dt;
    const sp = Math.hypot(a.vx, a.vy);
    const lo = a.st === St.Land ? 0 : MIN_SPEED;
    if (sp > a.cap) {
      a.vx = (a.vx / sp) * a.cap;
      a.vy = (a.vy / sp) * a.cap;
    } else if (sp < lo && sp > 0) {
      a.vx = (a.vx / sp) * lo;
      a.vy = (a.vy / sp) * lo;
    }
    a.x += a.vx * dt;
    a.y += a.vy * dt;

    // Hard wrap only if something still escaped (e.g. a resize); sprinting
    // agents coming in from off-screen are left alone.
    if (a.cap <= MAX_SPEED) {
      if (a.x < -60) a.x = vw + 20;
      else if (a.x > vw + 60) a.x = -20;
      if (a.y < -60) a.y = vh + 20;
      else if (a.y > vh + 60) a.y = -20;
    }
  }
}

/** Draw one chevron. Shared with the build overlay. */
export function drawAgent(c: CanvasRenderingContext2D, a: Agent, scale: number, color: string, al: number) {
  // Ease the drawn heading toward the velocity heading; perched agents face
  // along the edge they sit on.
  let th: number;
  if (a.st === St.Perch) th = a.h > Math.PI / 2 || a.h < -Math.PI / 2 ? Math.PI : 0;
  else if (a.vx === 0 && a.vy === 0) th = a.h;
  else th = Math.atan2(a.vy, a.vx);
  let d = th - a.h;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  a.h += d * (a.st === St.Work ? 0.35 : 0.18);

  c.globalAlpha = al;
  c.fillStyle = color;
  const s = a.s;
  c.setTransform(scale, 0, 0, scale, a.x * scale, a.y * scale);
  c.rotate(a.h);
  c.beginPath();
  c.moveTo(s * 0.55, 0);
  c.lineTo(-s * 0.45, -s * 0.42);
  c.lineTo(-s * 0.22, 0);
  c.lineTo(-s * 0.45, s * 0.42);
  c.closePath();
  c.fill();
  c.setTransform(scale, 0, 0, scale, 0, 0);
  c.globalAlpha = 1;
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, vw, vh);
  for (const a of agents) {
    if (a.st === St.Work) continue; // drawn by the build overlay, above content
    drawAgent(ctx, a, dpr, colors[a.c] || colors[0], alpha * fade);
  }
}

function frame(now: number) {
  if (!running) return;
  raf = requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.05) dt = 0.05; // tab was throttled; don't let agents jump
  if (dt <= 0) return;

  if (fadeDelay > 0) fadeDelay -= dt;
  else if (fade < 1) fade = Math.min(1, fade + fadeRate * dt);

  if (rectsDirty) refreshRects();
  step(dt);
  plugin?.tick(dt, now);
  draw();
  plugin?.draw();
}

function play() {
  if (running || !canvas) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

function pause() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

function stop() {
  pause();
  agents = [];
  if (ctx) ctx.clearRect(0, 0, vw, vh);
  if (canvas) canvas.style.opacity = '0';
}

let booted = false;

function boot() {
  const el = document.querySelector<HTMLCanvasElement>('[data-flock]');
  if (!el || typeof el.getContext !== 'function' || !('requestAnimationFrame' in window)) return;
  const c = el.getContext('2d', { alpha: true });
  if (!c) return;
  canvas = el;
  ctx = c;
  booted = true;

  readColors();
  vw = window.innerWidth;
  vh = window.innerHeight;

  // First load of the session: with the build sequence, 2–3 flocks sprint in
  // from off-screen; otherwise the headline plays first and the flock drifts
  // in from the left over 800ms. Later pages: already here, quick fade.
  const html = document.documentElement.classList;
  const building = html.contains('is-building');
  const flyIn = html.contains('enter');
  resize();
  if (building) {
    spawnClusters();
    fadeRate = 1 / 0.2;
  } else if (flyIn) {
    agents = agents.map(() => makeAgent(true));
    fadeDelay = 0.7;
    fadeRate = 1 / 0.8;
  } else {
    fadeRate = 1 / 0.4;
  }
  canvas.style.opacity = '1';
  collectTargets();

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => (rectsDirty = true), { passive: true });
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'mouse') {
        cur.x = e.clientX;
        cur.y = e.clientY;
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => (cur.x = cur.y = -9999));
  window.addEventListener('blur', () => (cur.x = cur.y = -9999));
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  play();
}

export function initFlock() {
  if (reduce()) {
    stop();
    return;
  }
  if (!booted) boot();
  else {
    // New page (view transition): the canvas persisted, the targets did not.
    collectTargets();
    play();
  }
}

/* ---------- Plugin API (used by build.ts) ---------- */

export function setPlugin(p: Plugin | null) {
  plugin = p;
}

export function isRunning() {
  return booted && running;
}

/** Nearest agent that can be pulled off whatever it is doing to go and work. */
export function recruit(x: number, y: number): Agent | null {
  let best: Agent | null = null;
  let bd = Infinity;
  for (const a of agents) {
    if (a.st === St.Work) continue;
    const d = (a.x - x) ** 2 + (a.y - y) ** 2 + (a.st === St.Perch ? 200 ** 2 : 0);
    if (d < bd) {
      bd = d;
      best = a;
    }
  }
  if (best) {
    if (best.p) release(best);
    best.st = St.Work;
  }
  return best;
}

/** Hand a working agent back to the flock, keeping its momentum. */
export function freeAgent(a: Agent) {
  a.st = St.Fly;
  a.t = rnd(3, 6);
  const sp = Math.hypot(a.vx, a.vy);
  if (sp < MIN_SPEED) {
    a.vx = Math.cos(a.h) * MIN_SPEED * 2;
    a.vy = Math.sin(a.h) * MIN_SPEED * 2;
  }
}

/** Working agents are drawn by the build overlay; this is the colour set. */
export function agentColor(a: Agent) {
  return colors[a.c] || colors[0];
}

const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
mq.addEventListener('change', () => {
  if (mq.matches) stop();
  else if (booted && canvas) {
    resize();
    fade = 0;
    fadeRate = 1 / 0.4;
    canvas.style.opacity = '1';
    play();
  } else initFlock();
});

document.addEventListener('astro:page-load', initFlock);
