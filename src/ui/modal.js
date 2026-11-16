import { sections } from './cards.js';

/** A single reusable modal that shows any item, with prev/next inside its section. */
export function createModal({ onClose } = {}) {
  const el = document.createElement('div');
  el.className = 'modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.innerHTML = `<div class="card"><button class="card-close" aria-label="Close">✕</button><div class="card-body"></div><div class="card-nav"><button data-dir="-1">← Prev</button><button data-dir="1">Next →</button></div></div>`;
  document.body.appendChild(el);

  const card = el.querySelector('.card');
  const body = el.querySelector('.card-body');
  const nav = el.querySelector('.card-nav');
  let state = null;
  let lastFocus = null;

  function show(section, index = 0) {
    const s = sections[section];
    if (!s) return;
    index = (index + s.list.length) % s.list.length;
    state = { section, index };
    const { color, html } = s.render(s.list[index]);
    card.style.setProperty('--c', color);
    body.innerHTML = html;
    nav.style.display = s.list.length > 1 ? '' : 'none';
    card.scrollTop = 0;
    if (!el.classList.contains('on')) {
      lastFocus = document.activeElement;
      el.classList.add('on');
      el.querySelector('.card-close').focus({ preventScroll: true });
    }
  }

  function hide() {
    if (!el.classList.contains('on')) return;
    el.classList.remove('on');
    state = null;
    lastFocus?.focus?.({ preventScroll: true });
    onClose?.();
  }

  el.addEventListener('click', (e) => {
    if (e.target === el || e.target.closest('.card-close')) hide();
    const open = e.target.closest('[data-open]')?.dataset.open;
    if (open) {
      const [sec, i] = open.split(':');
      show(sec, Number(i));
      return;
    }
    const dir = e.target.closest('[data-dir]')?.dataset.dir;
    if (dir && state) show(state.section, state.index + Number(dir));
  });
  window.addEventListener('keydown', (e) => {
    if (!state) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowRight') show(state.section, state.index + 1);
    if (e.key === 'ArrowLeft') show(state.section, state.index - 1);
  });

  return { show, hide, isOpen: () => !!state };
}
