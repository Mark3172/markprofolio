import { profile } from '../data/portfolio.js';
import { esc } from './cards.js';

const ICON = {
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
};

export function createHud(world, { onClassic, onAbout }) {
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const hud = document.createElement('div');
  hud.className = 'hud' + (isTouch ? ' touch' : '');
  hud.innerHTML = `
    <button class="hud-id" data-about style="border:1px solid var(--line);color:inherit;text-align:left">
      <span class="hud-avatar">${esc(initials)}</span>
      <span><b>${esc(profile.name)}</b><small>${esc(profile.title)}</small></span>
    </button>
    <div class="hud-top-right">
      <button class="icon-btn" data-travel aria-expanded="false">${ICON.map}<span class="lbl">Fast travel</span></button>
      <button class="icon-btn" data-classic>${ICON.list}<span class="lbl">Classic view</span></button>
    </div>
    <div class="travel" role="menu">
      ${world.zones.map((z) => `<button role="menuitem" data-zone="${z.id}"><span class="sw" style="background:${z.color}"></span><span><b style="display:block;font-size:14px">${esc(z.name)}</b><small style="color:var(--muted)">${esc(z.sub)}</small></span></button>`).join('')}
    </div>
    <div class="shards" title="Collect every data shard hidden around the island"><span class="gem"></span>Shards <b data-count>0/${world.shardTotal}</b></div>
    <div class="zone-title"><small></small><b></b></div>
    <div class="toast-wrap"></div>
    <button class="prompt"><span class="kbd">${isTouch ? 'TAP' : 'E'}</span><span data-label></span></button>
    <div class="minimap" title="Click to fly there"><canvas width="312" height="312"></canvas></div>
    <div class="controls-hint">
      <div><span class="kbd">W</span><span class="kbd">A</span><span class="kbd">S</span><span class="kbd">D</span> fly</div>
      <div><span class="kbd">Shift</span> boost · <span class="kbd">E</span> open</div>
      <div>Drag to look · scroll to zoom · click to move</div>
    </div>
    <div class="joy"><i></i></div>`;
  document.body.appendChild(hud);

  const $ = (s) => hud.querySelector(s);
  const travel = $('.travel');
  const prompt = $('.prompt');
  const zoneTitle = $('.zone-title');
  const toasts = $('.toast-wrap');

  $('[data-about]').addEventListener('click', onAbout);
  $('[data-classic]').addEventListener('click', onClassic);
  $('[data-travel]').addEventListener('click', (e) => {
    const on = travel.classList.toggle('on');
    e.currentTarget.setAttribute('aria-expanded', on);
  });
  travel.addEventListener('click', (e) => {
    const id = e.target.closest('[data-zone]')?.dataset.zone;
    if (!id) return;
    world.travelTo(id);
    travel.classList.remove('on');
  });
  prompt.addEventListener('click', () => world.interact());

  /* ---- minimap ---- */
  const mm = $('.minimap canvas');
  const g = mm.getContext('2d');
  const S = mm.width;
  const scale = (S / 2 - 14) / world.islandRadius;
  const toMap = (x, z) => [S / 2 + x * scale, S / 2 + z * scale];
  function drawMap() {
    const st = world.minimap();
    g.clearRect(0, 0, S, S);
    g.fillStyle = 'rgba(47,122,104,0.55)';
    g.beginPath();
    g.arc(S / 2, S / 2, world.islandRadius * scale, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = 'rgba(200,180,142,0.7)';
    g.lineWidth = 6;
    for (const z of world.zones.slice(1)) {
      g.beginPath();
      g.moveTo(S / 2, S / 2);
      g.lineTo(...toMap(z.c.x, z.c.z));
      g.stroke();
    }
    for (const z of world.zones) {
      const [x, y] = toMap(z.c.x, z.c.z);
      g.fillStyle = z.color;
      g.beginPath();
      g.arc(x, y, z.id === 'plaza' ? 9 : 14, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#7cf5ff';
    for (const p of st.shards) {
      const [x, y] = toMap(p.x, p.z);
      g.save();
      g.translate(x, y);
      g.rotate(Math.PI / 4);
      g.fillRect(-5, -5, 10, 10);
      g.restore();
    }
    const [px, py] = toMap(st.px, st.pz);
    // view cone
    g.fillStyle = 'rgba(255,255,255,0.12)';
    g.beginPath();
    g.moveTo(px, py);
    g.arc(px, py, 60, -st.yaw - Math.PI / 2 - 0.5, -st.yaw - Math.PI / 2 + 0.5);
    g.closePath();
    g.fill();
    g.save();
    g.translate(px, py);
    g.rotate(-st.heading + Math.PI);
    g.fillStyle = '#fff';
    g.beginPath();
    g.moveTo(0, -14);
    g.lineTo(10, 10);
    g.lineTo(0, 5);
    g.lineTo(-10, 10);
    g.closePath();
    g.fill();
    g.restore();
  }
  let mmRaf = 0;
  const loop = () => {
    drawMap();
    mmRaf = setTimeout(loop, 100);
  };
  loop();
  mm.addEventListener('click', (e) => {
    const r = mm.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * S;
    const y = ((e.clientY - r.top) / r.height) * S;
    const wx = (x - S / 2) / scale;
    const wz = (y - S / 2) / scale;
    const z = world.zones.find((zz) => Math.hypot(zz.c.x - wx, zz.c.z - wz) < 5);
    if (z) world.travelTo(z.id);
    else world.moveToWorld(wx, wz);
  });

  /* ---- joystick ---- */
  const joy = $('.joy');
  const knob = joy.querySelector('i');
  let jid = null;
  const setJoy = (e) => {
    const r = joy.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const max = r.width / 2 - 10;
    const d = Math.hypot(dx, dy);
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    world.setJoystick(dx / max, -dy / max);
  };
  joy.addEventListener('pointerdown', (e) => {
    jid = e.pointerId;
    joy.setPointerCapture(jid);
    setJoy(e);
  });
  joy.addEventListener('pointermove', (e) => e.pointerId === jid && setJoy(e));
  const endJoy = (e) => {
    if (e.pointerId !== jid) return;
    jid = null;
    knob.style.transform = '';
    world.setJoystick(0, 0);
  };
  joy.addEventListener('pointerup', endJoy);
  joy.addEventListener('pointercancel', endJoy);

  /* ---- api ---- */
  let zoneTimer = 0;
  function toast(msg, big = false) {
    const t = document.createElement('div');
    t.className = 'toast' + (big ? ' big' : '');
    t.innerHTML = msg;
    toasts.appendChild(t);
    setTimeout(() => t.remove(), big ? 5000 : 2700);
  }

  return {
    near(it) {
      if (it) $('[data-label]').textContent = `View ${it.label}`;
      prompt.classList.toggle('on', !!it);
    },
    zone(z) {
      zoneTitle.querySelector('small').textContent = z.sub;
      zoneTitle.querySelector('b').textContent = z.name;
      zoneTitle.classList.add('on');
      clearTimeout(zoneTimer);
      zoneTimer = setTimeout(() => zoneTitle.classList.remove('on'), 2400);
    },
    shard(n, total) {
      $('[data-count]').textContent = `${n}/${total}`;
      if (n < total) toast(`✦ Data shard ${n}/${total} collected`);
    },
    allShards() {
      toast('🏆 <b>Island Explorer unlocked!</b><br/>You found every shard. Thanks for exploring. Let\'s connect!', true);
    },
    toast,
    destroy() {
      clearTimeout(mmRaf);
      hud.remove();
    },
  };
}
