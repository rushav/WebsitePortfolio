/* ════════════════════════════════════════════════════════════
   RUSHAV DASH — PORTFOLIO  /  script.js
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. ENGINEERING CANVAS ───────────────────────────────── */
/*
 * Rotating 3D torus wireframe with depth shading, dot grid,
 * scanning highlight ring, crosshair, and corner bracket markers.
 * Evokes CAD / product-design / technical drawing.
 */
class EngineeringCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.time   = 0;
    this.raf    = null;
    this.active = true;

    this.uSteps   = 42;   // parallels — rings around the tube cross-section
    this.vSteps   = 24;   // meridians — loops around the full ring
    this.rotXBase = 0.42; // fixed forward tilt (radians)

    this.gridImg  = null; // cached offscreen dot-grid canvas

    this.resize();
    this.bindEvents();
    this.tick();
  }

  /* ── Geometry ── */
  resize() {
    const hero = this.canvas.parentElement;
    const W = hero.offsetWidth;
    const H = hero.offsetHeight;
    this.canvas.width  = W;
    this.canvas.height = H;
    this.W  = W;  this.H  = H;
    this.cx = W * 0.5;
    this.cy = H * 0.5;

    const dim  = Math.min(W, H);
    this.R   = dim * 0.25;    // major radius (center of ring to center of tube)
    this.r   = dim * 0.088;   // minor radius (tube thickness)
    this.fov = dim * 1.05;    // perspective focal length

    this.buildGrid();
  }

  buildGrid() {
    // Pre-render static dot grid once — very cheap to blit each frame
    const off = document.createElement('canvas');
    off.width = this.W;  off.height = this.H;
    const ctx = off.getContext('2d');
    const sp  = 46;
    ctx.fillStyle = 'rgba(0,212,255,0.048)';
    for (let x = sp / 2; x < this.W; x += sp) {
      for (let y = sp / 2; y < this.H; y += sp) {
        ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
      }
    }
    this.gridImg = off;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Pause animation when hero is off-screen
    const obs = new IntersectionObserver(entries => {
      this.active = entries[0].isIntersecting;
      if (this.active && !this.raf) this.tick();
    }, { threshold: 0 });
    obs.observe(this.canvas.parentElement);
  }

  /* ── Math helpers ── */
  rx([x, y, z], a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x, y * c - z * s, y * s + z * c];
  }
  ry([x, y, z], a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, y, -x * s + z * c];
  }
  // Perspective projection — camera looks in the +z direction
  project([x, y, z]) {
    const s = this.fov / (this.fov + z);
    return [x * s + this.cx, y * s + this.cy, z];
  }
  // Torus surface point: u = angle around ring, v = angle around tube
  torusPoint(u, v) {
    return [
      (this.R + this.r * Math.cos(v)) * Math.cos(u),
      (this.R + this.r * Math.cos(v)) * Math.sin(u),
      this.r * Math.sin(v),
    ];
  }
  xform(pt, rotY) {
    return this.ry(this.rx(pt, this.rotXBase), rotY);
  }

  /* ── Draw ── */
  draw() {
    const ctx  = this.ctx;
    const rotY = this.time * 0.20;
    const maxR = this.R + this.r;

    ctx.clearRect(0, 0, this.W, this.H);

    // Dot grid
    if (this.gridImg) ctx.drawImage(this.gridImg, 0, 0);

    // ── Meridians: full loops around the torus ring (constant v)
    ctx.lineWidth = 0.5;
    for (let j = 0; j < this.vSteps; j++) {
      const v = (j / this.vSteps) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= this.uSteps; i++) {
        const u       = (i / this.uSteps) * Math.PI * 2;
        const [px, py] = this.project(this.xform(this.torusPoint(u, v), rotY));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,212,255,0.07)';
      ctx.stroke();
    }

    // ── Parallels: circles around the tube cross-section (constant u)
    //    Depth-shade: front-facing rings are brighter
    ctx.lineWidth = 0.65;
    for (let i = 0; i < this.uSteps; i++) {
      const u = (i / this.uSteps) * Math.PI * 2;

      // Center of this parallel's ring — used for depth
      const center    = this.xform([this.R * Math.cos(u), this.R * Math.sin(u), 0], rotY);
      const frontness = (-center[2] + maxR) / (2 * maxR); // 0 (back) → 1 (front)
      const opacity   = 0.04 + frontness * 0.22;

      ctx.beginPath();
      for (let j = 0; j <= this.vSteps; j++) {
        const v       = (j / this.vSteps) * Math.PI * 2;
        const [px, py] = this.project(this.xform(this.torusPoint(u, v), rotY));
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,212,255,${opacity.toFixed(3)})`;
      ctx.stroke();
    }

    // ── Scanning highlight ring — a single bright meridian that orbits
    const scanV = (this.time * 0.38) % (Math.PI * 2);
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= this.uSteps; i++) {
      const u       = (i / this.uSteps) * Math.PI * 2;
      const [px, py] = this.project(this.xform(this.torusPoint(u, scanV), rotY));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,212,255,0.42)';
    ctx.stroke();

    // ── Center crosshair
    const { cx, cy } = this;
    const cs = 22;
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = 'rgba(0,212,255,0.13)';
    ctx.beginPath();
    ctx.moveTo(cx - cs, cy); ctx.lineTo(cx + cs, cy);
    ctx.moveTo(cx, cy - cs); ctx.lineTo(cx, cy + cs);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,212,255,0.22)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // ── Corner bracket markers — engineering drawing style
    const bs = 30, bg = 22;
    const corners = [
      [bg,          bg,          1,  1 ],
      [this.W - bg, bg,         -1,  1 ],
      [this.W - bg, this.H - bg,-1, -1 ],
      [bg,          this.H - bg, 1, -1 ],
    ];
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(0,212,255,0.16)';
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * bs);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * bs, y);
      ctx.stroke();
    });
  }

  tick() {
    if (!this.active) { this.raf = null; return; }
    this.time += 0.008;
    this.draw();
    this.raf = requestAnimationFrame(() => this.tick());
  }
}


/* ─── 2. NAVIGATION ───────────────────────────────────────── */
function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('nav-toggle');
  const links     = document.getElementById('nav-links');
  const overlay   = document.getElementById('nav-overlay');
  const navLinks  = document.querySelectorAll('.nav-link');

  let lastScrollY = 0;
  let ticking     = false;
  let menuOpen    = false;

  // Scroll behaviour: hide on down, show on up, add bg when scrolled
  function handleScroll() {
    const current = window.scrollY;
    const scrolled = current > 50;

    nav.classList.toggle('is-scrolled', scrolled);

    if (!menuOpen) {
      if (current > lastScrollY && current > 120) {
        nav.classList.add('is-hidden');
        nav.classList.remove('is-visible-force');
      } else {
        nav.classList.remove('is-hidden');
        nav.classList.add('is-visible-force');
      }
    }
    lastScrollY = current;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  function openMenu() {
    menuOpen = true;
    links.classList.add('is-open');
    overlay.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    nav.classList.remove('is-hidden');
  }

  function closeMenu() {
    menuOpen = false;
    links.classList.remove('is-open');
    overlay.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Active nav link tracking with IntersectionObserver
  const sections = document.querySelectorAll('section[id]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id  = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('is-active', entry.isIntersecting);
      }
    });
  }, {
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  });

  sections.forEach(s => activeObserver.observe(s));
}


/* ─── 3. HERO STAGGER ANIMATION ──────────────────────────── */
function initHeroAnimation() {
  // Tiny delay so paint is settled before animations start
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('hero-loaded');
    });
  });
}


/* ─── 4. SCROLL REVEAL ────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  els.forEach(el => observer.observe(el));
}


/* ─── 5. TIMELINE PROGRESS LINE ──────────────────────────── */
function initTimelineProgress() {
  const timeline = document.getElementById('timeline');
  const fill     = document.getElementById('tl-fill');

  if (!timeline || !fill) return;

  let ticking = false;

  function update() {
    const rect    = timeline.getBoundingClientRect();
    const winH    = window.innerHeight;
    // Progress 0→1 as the center of the viewport travels from timeline top to bottom
    const scrolled = winH * 0.6 - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / rect.height));

    fill.style.height = (progress * 100) + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // initial paint
}


/* ─── 6. SMOOTH ANCHOR SCROLL (enhances html scroll-behavior) */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ─── 7. INIT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Engineering canvas (torus wireframe + technical overlay)
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new EngineeringCanvas(canvas);
  }

  initNav();
  initHeroAnimation();
  initScrollReveal();
  initTimelineProgress();
  initSmoothScroll();
});
