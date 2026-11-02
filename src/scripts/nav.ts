/**
 * Sliding nav pill. One absolutely positioned pill sits under the active
 * link and slides to the new one on client-side navigation (the nav element
 * is persisted across view transitions, so the pill has somewhere to slide
 * from). Active state is recomputed here from `location.pathname` because the
 * persisted markup still shows the previous page's state.
 */
let pill: HTMLElement | null = null;

const strip = (p: string) => p.replace(/\/+$/, '') || '/';

function activeLink(links: HTMLAnchorElement[]) {
  const here = strip(location.pathname);
  let best: HTMLAnchorElement | null = null;
  let bestLen = -1;
  for (const a of links) {
    const target = strip(new URL(a.href, location.href).pathname);
    const home = a === links[0];
    const hit = home ? here === target : here === target || here.startsWith(`${target}/`);
    if (hit && target.length > bestLen) {
      best = a;
      bestLen = target.length;
    }
  }
  return best;
}

function place(animate: boolean) {
  const list = document.querySelector<HTMLElement>('[data-nav-list]');
  if (!list) return;
  const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('.nav__link'));
  const active = activeLink(links);
  for (const a of links) {
    const on = a === active;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }

  if (!pill || !pill.isConnected) {
    pill = document.createElement('span');
    pill.className = 'nav__pill';
    pill.setAttribute('aria-hidden', 'true');
    list.prepend(pill);
    animate = false;
  }
  if (!active) {
    pill.style.opacity = '0';
    return;
  }
  const lr = list.getBoundingClientRect();
  const r = active.getBoundingClientRect();
  if (!animate) pill.classList.add('no-anim');
  pill.style.opacity = '1';
  pill.style.width = `${r.width}px`;
  pill.style.height = `${r.height}px`;
  pill.style.transform = `translate(${r.left - lr.left}px, ${r.top - lr.top}px)`;
  if (!animate) {
    void pill.offsetWidth; // flush so the next change transitions
    pill.classList.remove('no-anim');
  }
  list.classList.add('has-pill');
}

let first = true;
document.addEventListener('astro:page-load', () => {
  place(!first && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  first = false;
});
window.addEventListener('resize', () => place(false), { passive: true });
