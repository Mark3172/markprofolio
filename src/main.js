import './style.css';
import { profile } from './data/portfolio.js';
import { esc } from './ui/cards.js';
import { createModal } from './ui/modal.js';
import { renderClassic } from './ui/classic.js';

const app = document.getElementById('app');
const params = new URLSearchParams(location.search);

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch {
    return false;
  }
}

const canExplore = hasWebGL();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setView(v) {
  const u = new URL(location.href);
  if (v) u.searchParams.set('view', v);
  else u.searchParams.delete('view');
  history.replaceState(null, '', u);
}

function goClassic() {
  setView('');
  location.reload();
}

function startClassic() {
  renderClassic(app, {
    canExplore,
    onExplore: () => {
      setView('3d');
      location.reload();
    },
  });
}

// Loading screen for game mode: real progress through each loading step, plus control tips.
function intro() {
  const touch = matchMedia('(pointer: coarse)').matches;
  const tips = touch
    ? ['Use the joystick to walk', 'Drag anywhere to look around', 'Tap anything glowing to open it', 'Finish the quests in the top right']
    : ['<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk', '<kbd>Space</kbd> to jump', '<kbd>E</kbd> to open whatever is glowing', '<kbd>V</kbd> switches to first person', 'Finish the quests in the top right'];
  const stars = Array.from({ length: 60 }, () => `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;opacity:${Math.random()}"></i>`).join('');
  const el = document.createElement('div');
  el.className = 'intro loading';
  el.innerHTML = `
    <div class="intro-stars">${stars}</div>
    <div class="ld-card" role="status" aria-live="polite">
      <div class="ld-logo"><img src="logo.svg" alt="" width="64" height="64"><span class="ld-orbit" aria-hidden="true"></span></div>
      <h1 class="ld-title">Building <span class="grad">${esc(profile.nickname)}</span>'s island</h1>
      <p class="ld-step">Loading the 3D engine…</p>
      <div class="ld-bar" role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      <div class="ld-pct">0%</div>
      <p class="ld-tip"><span>Tip</span><b>${tips[0]}</b></p>
      ${reduced ? '<p class="ld-note">Reduced motion is on: the classic view may be more comfortable.</p>' : ''}
      <button class="ld-skip" type="button" data-classic>← Back to the classic view</button>
    </div>`;
  document.body.appendChild(el);

  const bar = el.querySelector('.ld-bar');
  const fill = bar.querySelector('i');
  const pct = el.querySelector('.ld-pct');
  const stepEl = el.querySelector('.ld-step');
  const tipEl = el.querySelector('.ld-tip b');
  let shown = 0;
  let target = 4;
  let cap = 70;
  let raf = 0;
  const tick = () => {
    if (target < cap) target += (cap - target) * 0.012; // creep while a step is running
    shown += (target - shown) * (reduced ? 1 : 0.12);
    const v = Math.min(100, Math.round(shown));
    fill.style.width = `${v}%`;
    pct.textContent = `${v}%`;
    bar.setAttribute('aria-valuenow', v);
    raf = requestAnimationFrame(tick);
  };
  tick();
  let t = 0;
  const tipTimer = setInterval(() => {
    t = (t + 1) % tips.length;
    tipEl.classList.remove('in');
    void tipEl.offsetWidth;
    tipEl.innerHTML = tips[t];
    tipEl.classList.add('in');
  }, 2400);
  const progress = {
    step(label, reached, nextCap) {
      stepEl.textContent = label;
      target = Math.max(target, reached);
      cap = nextCap;
    },
    done() {
      progress.step('Ready!', 100, 100);
      // let the bar catch up, but never show "Ready!" next to a half-full bar
      const start = performance.now();
      return new Promise((r) => {
        const check = () => {
          if (shown >= 99 || performance.now() - start > 250) {
            shown = target = 100;
            fill.style.width = '100%';
            pct.textContent = '100%';
            bar.setAttribute('aria-valuenow', 100);
            setTimeout(r, reduced ? 0 : 120);
          } else setTimeout(check, 40);
        };
        check();
      });
    },
    stop() {
      cancelAnimationFrame(raf);
      clearInterval(tipTimer);
    },
  };
  el.querySelector('[data-classic]').addEventListener('click', () => {
    progress.stop();
    el.remove();
    goClassic();
  });
  startWorld(el, progress);
}

async function startWorld(introEl, progress) {
  const container = document.createElement('div');
  container.id = 'world';
  app.appendChild(container);
  try {
    const [{ createWorld }, { createHud }] = await Promise.all([import('./world/World.js'), import('./ui/hud.js')]);
    progress.step('Loading fonts…', 70, 80);
    await document.fonts?.ready; // so canvas text uses the web fonts
    progress.step('Building the island…', 80, 94);
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))); // let the label paint first
    let hud;
    let world;
    const modal = createModal({ onClose: () => world?.setPaused(false) });
    world = createWorld(container, {
      onOpen: (section, index) => {
        world.setPaused(true);
        modal.show(section, index);
        hud?.opened(section, index);
      },
      onJump: (kind) => hud?.jump(kind),
      onRace: (r) => hud?.race(r),
      onNear: (it) => hud?.near(it),
      onZone: (z) => z.id !== 'plaza' && hud?.zone(z),
      onShard: (n, t, secret) => hud?.shard(n, t, secret),
      onView: (v) => hud?.setView(v),
      onLock: (on) => hud?.lock(on),
      onRespawn: () => hud?.toast('Whoops, you fell off the island! Back to the plaza.'),
    });
    hud = createHud(world, {
      onClassic: goClassic,
      onAbout: () => {
        world.setPaused(true);
        modal.show('about', 0);
        hud.opened('about', 0);
      },
      onAllQuests: () =>
        setTimeout(() => {
          world.setPaused(true);
          modal.show('about', 0);
        }, 2600),
    });
    progress.step('Placing projects and quests…', 95, 99);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); // first frame drawn
    await progress.done();
    progress.stop();
    introEl.classList.add('hide');
    setTimeout(() => introEl.remove(), 900);
    setTimeout(() => hud.startTour(), 1200);
    setTimeout(() => hud.say(`Hi, I'm Byte, your guide! Follow the arrow for the highlights. Your quests are in the top right.`, 8), 2600);
  } catch (err) {
    console.error(err);
    progress.stop();
    container.remove();
    introEl.remove();
    setView('');
    startClassic();
  }
}

// The classic view is the landing page: the information comes first.
// Game mode is one click away (?view=3d links straight to it).
if (canExplore && ['3d', 'game'].includes(params.get('view'))) intro();
else startClassic();
