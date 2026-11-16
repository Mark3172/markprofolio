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
  setView('classic');
  location.reload();
}

function startClassic() {
  renderClassic(app, {
    canExplore,
    onExplore: () => {
      setView('');
      location.reload();
    },
  });
}

function intro() {
  const stars = Array.from({ length: 70 }, () => `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;opacity:${Math.random()}"></i>`).join('');
  const el = document.createElement('div');
  el.className = 'intro';
  el.innerHTML = `
    <div class="intro-stars">${stars}</div>
    <div class="intro-card">
      ${profile.status ? `<span class="intro-kicker"><span class="dot"></span>${esc(profile.status)}</span>` : ''}
      <h1>Hi, I'm <span class="grad">${esc(profile.nickname)}</span>.</h1>
      <p>${esc(profile.tagline)}<br/>Explore my floating island on foot: every landmark is a project, certificate or chapter of my story.</p>
      <div class="intro-actions">
        ${canExplore ? '<button class="btn btn-primary btn-lg" data-go>▶ Explore the island</button>' : ''}
        <button class="btn${canExplore ? '' : ' btn-primary btn-lg'}" data-classic>${canExplore ? 'Skip to classic view' : 'View portfolio'}</button>
      </div>
      <div class="loader"><i></i></div>
      <div class="intro-hint">${canExplore ? (matchMedia('(pointer: coarse)').matches ? 'Joystick to walk · drag to look · tap anything glowing' : 'WASD to walk · Space to jump · V for first person · E to open') : 'Your browser does not support 3D, so here is the fast version.'}${reduced && canExplore ? '<br/>Reduced motion is on: the classic view may be more comfortable.' : ''}</div>
    </div>`;
  document.body.appendChild(el);
  el.querySelector('[data-classic]').addEventListener('click', () => {
    el.remove();
    setView('classic');
    startClassic();
  });
  el.querySelector('[data-go]')?.addEventListener('click', (e) => {
    e.currentTarget.disabled = true;
    el.querySelector('.loader').classList.add('on');
    startWorld(el);
  });
  // warm up the 3D chunk while the visitor reads
  if (canExplore) import('./world/World.js');
}

async function startWorld(introEl) {
  const container = document.createElement('div');
  container.id = 'world';
  app.appendChild(container);
  try {
    const [{ createWorld }, { createHud }] = await Promise.all([import('./world/World.js'), import('./ui/hud.js')]);
    await document.fonts?.ready; // so canvas text uses the web fonts
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
    introEl.classList.add('hide');
    setTimeout(() => introEl.remove(), 900);
    setTimeout(() => hud.startTour(), 1200);
    setTimeout(() => hud.say(`Hi, I'm Byte, your guide! Follow the arrow for the highlights. Your quests are in the top right.`, 8), 2600);
  } catch (err) {
    console.error(err);
    container.remove();
    introEl.remove();
    startClassic();
  }
}

if (!canExplore || params.get('view') === 'classic') startClassic();
else intro();
