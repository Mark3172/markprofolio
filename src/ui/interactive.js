/**
 * Small interactions for the classic view. Each one helps a visitor do something
 * (copy the email, see the time difference, find projects for a skill), and the
 * motion is skipped for reduced-motion users and on touch screens where it doesn't help.
 */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Does a skill (e.g. "User Acceptance Testing") match a project tech tag (e.g. "UAT")? */
const ALIAS = { 'user acceptance testing': ['uat'], 'help desk support': ['help desk'], 'chatbots & nlp': ['chatbots', 'nlp'], 'ui/ux': ['ux', 'ui/ux'] };
const norm = (s) => s.toLowerCase().trim();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function skillMatches(skill, tech) {
  const s = norm(skill);
  const t = norm(tech);
  if (s === t || ALIAS[s]?.includes(t)) return true;
  if (t.length < 3 || s.length < 3) return false;
  const wb = (a, b) => new RegExp(`(^|[^a-z0-9])${esc(a)}([^a-z0-9]|$)`).test(b);
  return wb(t, s) || wb(s, t);
}
export const projectsFor = (skill, projects) => projects.map((p, i) => ((p.tech || []).some((t) => skillMatches(skill, t)) ? i : -1)).filter((i) => i >= 0);

export function toast(root, msg) {
  let el = root.querySelector('.cv-toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'cv-toast';
    el.setAttribute('role', 'status');
    root.appendChild(el);
  }
  el.textContent = msg;
  el.classList.remove('on');
  void el.offsetWidth;
  el.classList.add('on');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('on'), 2200);
}

export function enhance(root, { projects }) {
  /* ---- hero portrait: layers drift at different depths with the pointer ---- */
  const px = root.querySelector('[data-parallax]');
  if (px && finePointer && !reduced) {
    const layers = [...px.querySelectorAll('[data-depth]')].map((el) => ({ el, d: Number(el.dataset.depth) }));
    const hero = px.closest('section') || px;
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      const r = px.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layers.forEach(({ el, d }) => el.style.setProperty('--px', `${x * d * 22}px`) || el.style.setProperty('--py', `${y * d * 16}px`)));
    });
    hero.addEventListener('pointerleave', () => layers.forEach(({ el }) => (el.style.setProperty('--px', '0px'), el.style.setProperty('--py', '0px'))));
  }

  /* ---- copy email (falls back to opening the mail app) ---- */
  root.querySelectorAll('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      const v = b.dataset.copy;
      try {
        await navigator.clipboard.writeText(v);
        b.classList.add('done');
        setTimeout(() => b.classList.remove('done'), 1800);
        toast(root, `Copied ${v}`);
      } catch {
        location.href = `mailto:${v}`;
      }
    }),
  );

  /* ---- live local time in Yangon, with the difference from the visitor ---- */
  const clock = root.querySelector('[data-clock]');
  if (clock) {
    const tz = clock.dataset.clock;
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });
    const offsetMin = (d) => {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(d).map((x) => [x.type, x.value]));
      return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes())) / 60000;
    };
    const tick = () => {
      const now = new Date();
      const diff = (offsetMin(now) + now.getTimezoneOffset()) / 60;
      const rel = Math.abs(diff) < 0.01 ? 'same time as you' : `${Math.abs(diff) % 1 ? Math.abs(diff).toFixed(1) : Math.abs(diff)}h ${diff > 0 ? 'ahead of' : 'behind'} you`;
      clock.querySelector('b').textContent = fmt.format(now);
      clock.querySelector('small').textContent = rel;
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---- skills -> the projects that used them ---- */
  const projSec = root.querySelector('#projects');
  const pill = projSec?.querySelector('.skill-filter');
  const clearSkill = () => {
    if (!pill || pill.hidden) return;
    pill.hidden = true;
    root.querySelectorAll('[data-skill].on').forEach((c) => c.classList.remove('on'));
    projSec.querySelectorAll('.spot-row').forEach((r) => (r.hidden = false));
    projSec.querySelector('[data-spot]')?.dispatchEvent(new Event('spot:first'));
  };
  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-skill]');
    if (!chip || !projSec) return;
    const skill = chip.dataset.skill;
    const hits = projectsFor(skill, projects);
    // show all categories, then only the matching rows
    projSec.querySelector('[data-tabs] button[data-cat="all"]')?.click();
    projSec.querySelectorAll('.spot-row').forEach((r) => (r.hidden = !hits.includes(Number(r.querySelector('.spot-btn').dataset.i))));
    root.querySelectorAll('[data-skill]').forEach((c) => c.classList.toggle('on', c.dataset.skill === skill));
    pill.hidden = false;
    pill.querySelector('b').textContent = skill;
    pill.querySelector('em').textContent = `${hits.length} project${hits.length === 1 ? '' : 's'}`;
    projSec.querySelector('[data-spot]')?.dispatchEvent(new Event('spot:first'));
    projSec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
  pill?.querySelector('button').addEventListener('click', clearSkill);
  projSec?.querySelector('[data-tabs]')?.addEventListener('click', (e) => e.isTrusted && e.target.closest('button') && clearSkill());

  /* ---- stats count up the first time they scroll into view ---- */
  const stats = root.querySelectorAll('[data-count]');
  if (stats.length && !reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const end = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const t0 = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - t0) / 900);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      }),
    );
    stats.forEach((s) => io.observe(s));
  }

  /* ---- cards: a soft light follows the cursor ---- */
  if (finePointer && !reduced) {
    root.addEventListener(
      'pointermove',
      (e) => {
        const c = e.target.closest?.('.glass, .bento-card, .stat, .news-item');
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', `${e.clientX - r.left}px`);
        c.style.setProperty('--my', `${e.clientY - r.top}px`);
      },
      { passive: true },
    );
  }

  /* ---- experience: a line fills as you read down the timeline ---- */
  const xp = root.querySelector('.xp');
  const line = xp?.querySelector('.xp-line i');
  if (line) {
    let pending = false;
    const update = () => {
      pending = false;
      const r = xp.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      line.style.transform = `scaleY(${k})`;
    };
    addEventListener('scroll', () => !pending && (pending = true) && requestAnimationFrame(update), { passive: true });
    update();
  }
}
