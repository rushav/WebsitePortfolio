/* ════════════════════════════════════════════════════════════
   projects.js — shared script for all project pages
   Lightbox + scroll reveal
   ════════════════════════════════════════════════════════════ */

/* ── Lightbox ── */
document.querySelectorAll('.gallery-img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lb-backdrop"></div>
      <img class="lb-img" src="${img.src}" alt="${img.alt || ''}">
      <button class="lb-close" aria-label="Close lightbox">&times;</button>
    `;
    document.body.appendChild(lb);
    lb.querySelector('.lb-backdrop').addEventListener('click', () => lb.remove());
    lb.querySelector('.lb-close').addEventListener('click', () => lb.remove());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') lb.remove();
    }, { once: true });
    requestAnimationFrame(() => lb.classList.add('is-open'));
  });
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => observer.observe(el));
}

/* ── Nav scroll behaviour ── */
const nav = document.querySelector('.nav');
if (nav) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('is-scrolled');
      if (y > lastScroll + 8) nav.classList.add('is-hidden');
      else if (y < lastScroll - 8) {
        nav.classList.remove('is-hidden');
        nav.classList.add('is-visible-force');
      }
    } else {
      nav.classList.remove('is-scrolled', 'is-hidden', 'is-visible-force');
    }
    lastScroll = y;
  }, { passive: true });
}
