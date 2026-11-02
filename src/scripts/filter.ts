/**
 * /projects category filter. Shows/hides cards by `data-cats`
 * (primary|secondary). Where the View Transitions API exists the grid
 * re-flows inside a transition: leaving cards fade and scale to 0.96,
 * staying cards slide to their new slot (see `.vt-filter` rules in
 * global.css). Elsewhere, and under reduced motion, the change is instant.
 */
export function initFilter() {
  const grid = document.querySelector<HTMLElement>('[data-project-grid]');
  if (!grid) return;
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-cats]'));

  const apply = (chip: HTMLButtonElement) => {
    const cat = chip.dataset.filter ?? '';
    for (const c of chips) {
      const on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    let shown = 0;
    for (const card of cards) {
      const has = cat === '' || (card.dataset.cats ?? '').split('|').includes(cat);
      card.hidden = !has;
      if (has) shown++;
    }
    if (empty) empty.hidden = shown > 0;
  };

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!doc.startViewTransition || reduce) {
        apply(chip);
        return;
      }
      // Name each visible card for the duration so it gets its own group.
      for (const card of cards) if (!card.hidden) card.style.viewTransitionName = `pc-${card.dataset.slug}`;
      document.documentElement.classList.add('vt-filter');
      const vt = doc.startViewTransition(() => {
        apply(chip);
        for (const card of cards) card.style.viewTransitionName = card.hidden ? '' : `pc-${card.dataset.slug}`;
      });
      vt.finished.finally(() => {
        for (const card of cards) card.style.viewTransitionName = '';
        document.documentElement.classList.remove('vt-filter');
      });
    });
  }
}

document.addEventListener('astro:page-load', initFilter);
