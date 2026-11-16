import { profile, certificates, achievements } from '../data/portfolio.js';
import { sfx } from './sfx.js';
import { esc, avatarHtml } from './cards.js';

const ICON = {
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path class="waves" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
};

export function createHud(world, { onClassic, onAbout, onAllQuests }) {
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
  const hud = document.createElement('div');
  hud.className = 'hud' + (isTouch ? ' touch' : '');
  hud.innerHTML = `
    <button class="hud-id" data-about style="border:1px solid var(--line);color:inherit;text-align:left">
      <span class="hud-avatar">${avatarHtml(initials)}</span>
      <span><b>${esc(profile.name)}</b><small>${esc(profile.title)}</small></span>
    </button>
    <div class="hud-top-right">
      <button class="icon-btn" data-sound title="Sound on/off" aria-pressed="false">${ICON.sound}</button>
      <button class="icon-btn" data-view title="Switch camera (V)">${ICON.eye}<span class="lbl" data-view-label>First person</span></button>
      <button class="icon-btn" data-travel aria-expanded="false">${ICON.map}<span class="lbl">Fast travel</span></button>
      <button class="icon-btn" data-classic>${ICON.list}<span class="lbl">Classic view</span></button>
    </div>
    <div class="travel" role="menu">
      ${world.zones.map((z) => `<button role="menuitem" data-zone="${z.id}"><span class="sw" style="background:${z.color}"></span><span><b style="display:block;font-size:14px">${esc(z.name)}</b><small style="color:var(--muted)">${esc(z.sub)}</small></span></button>`).join('')}
    </div>
    <div class="tour off" aria-live="polite">
      <div class="tour-top"><span data-tour-step>Highlights tour</span><button data-tour-close aria-label="Hide tour" title="Hide tour">✕</button></div>
      <h4 data-tour-title></h4>
      <p data-tour-sub></p>
      <div class="tour-dots"></div>
      <button class="tour-go" data-tour-go>Fly there</button>
    </div>
    <div class="quests">
      <button class="quest-pill" data-quests aria-expanded="false" title="Explorer quests"><span class="gem"></span><span data-rank>Visitor</span><b data-qcount>0/7</b><i class="qbar"><i data-qbar></i></i></button>
      <div class="quest-list" role="list"></div>
    </div>
    <div class="race" aria-live="polite"><small>Island Dash</small><b data-race-time>0.0s</b><span data-race-ring></span><button data-race-quit title="Stop the dash" aria-label="Stop the dash">✕</button></div>
    <div class="buddy" aria-live="polite"><span class="buddy-face" aria-hidden="true"><i></i></span><p></p></div>
    <div class="zone-title"><small></small><b></b></div>
    <div class="toast-wrap"></div>
    <button class="prompt"><span class="kbd">${isTouch ? 'TAP' : 'E'}</span><span data-label></span></button>
    <div class="minimap" title="Click to fly there"><canvas width="312" height="312"></canvas></div>
    <div class="controls-hint">
      <div><span class="kbd">W</span><span class="kbd">A</span><span class="kbd">S</span><span class="kbd">D</span> walk · <span class="kbd">Shift</span> sprint</div>
      <div><span class="kbd">Space</span> jump · <span class="kbd">E</span> open · <span class="kbd">V</span> 1st/3rd person</div>
      <div>Click to look with the mouse · <span class="kbd">Esc</span> frees it</div>
    </div>
    <div class="crosshair" aria-hidden="true"></div>
    <button class="lock-hint">Click to look around with your mouse</button>
    <div class="joy"><i></i></div>
    <div class="touch-btns"><button data-tview aria-label="Switch camera">${ICON.eye}</button><button data-jump aria-label="Jump">JUMP</button></div>`;
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
  const viewLabel = $('[data-view-label]');
  const setView = (v) => {
    viewLabel.textContent = v === 'fpp' ? 'Third person' : 'First person';
    hud.classList.toggle('fpp', v === 'fpp');
  };
  $('[data-view]').addEventListener('click', (e) => {
    world.toggleView();
    e.currentTarget.blur();
  });
  $('[data-tview]').addEventListener('click', () => world.toggleView());
  const jumpBtn = $('[data-jump]');
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    world.jump();
  });
  const lockHint = $('.lock-hint');
  lockHint.addEventListener('click', () => world.lockMouse());

  /* ---- sound ---- */
  const soundBtn = $('[data-sound]');
  const paintSound = () => {
    soundBtn.classList.toggle('muted', sfx.muted);
    soundBtn.setAttribute('aria-pressed', String(!sfx.muted));
  };
  paintSound();
  soundBtn.addEventListener('click', (e) => {
    sfx.toggle();
    paintSound();
    sfx.play('open');
    e.currentTarget.blur();
  });

  /* ---- companion drone: short spoken tips ---- */
  const buddyEl = $('.buddy');
  let buddyT = 0;
  let lastSay = 0;
  function say(text, sec = 7) {
    buddyEl.querySelector('p').textContent = text;
    buddyEl.classList.add('on');
    world.buddyTalk(2.2);
    sfx.play('talk');
    lastSay = performance.now();
    clearTimeout(buddyT);
    buddyT = setTimeout(() => buddyEl.classList.remove('on'), sec * 1000);
  }
  const act = isTouch ? 'tap it' : 'press E';
  const hacks = achievements.filter((a) => a.kind === 'hackathon').length;
  const ZONE_LINES = {
    projects: `These screens are Mark's featured builds. Walk up to one and ${act} to see the demo and code.`,
    certs: `${certificates.length} licenses and certifications live here. The big medals in front are the ones that matter most.`,
    timeline: 'Each monolith is a chapter of the story, newest first. The kiosk has the full history.',
    about: `This is the Beacon. Open it to read Mark's story, or to send an email.`,
    arena: `${hacks} hackathons so far. Every board shows a photo from the day.`,
  };
  const TIPS = [
    `See the yellow flag in the plaza? Start the Island Dash there and race through 8 rings.`,
    'The green pad near the plaza launches you into the air. Try it!',
    'There is a secret Sky Lookout past the floating platforms. Bring your best jumps.',
    isTouch ? 'Tap the eye button to switch to first person.' : 'Press V to switch to first person.',
    'Tap the minimap to fly straight to any area.',
  ];
  let tip = 0;
  const tipLoop = setInterval(() => {
    if (tip >= TIPS.length) return clearInterval(tipLoop);
    if (performance.now() - lastSay < 26000 || world.racing || document.querySelector('.modal.on')) return;
    say(TIPS[tip++]);
  }, 9000);

  /* ---- explorer quests ---- */
  const QUESTS = [
    { id: 'areas', text: 'Visit all 5 areas', goal: 5 },
    { id: 'exhibits', text: 'Open 5 exhibits', goal: 5 },
    { id: 'news', text: 'Read the news board in the plaza', goal: 1 },
    { id: 'dash', text: 'Finish the Island Dash', goal: 1 },
    { id: 'shards', text: 'Collect every data shard', goal: world.shardTotal },
    { id: 'lookout', text: 'Reach the secret Sky Lookout', goal: 1 },
    { id: 'contact', text: 'Open the Beacon and say hi', goal: 1 },
  ];
  const RANKS = ['Visitor', 'Visitor', 'Explorer', 'Explorer', 'Trailblazer', 'Trailblazer', 'Pathfinder', 'Island Legend'];
  const seen = { areas: new Set(), exhibits: new Set() };
  const prog = Object.fromEntries(QUESTS.map((q) => [q.id, 0]));
  const questList = $('.quest-list');
  const questBtn = $('[data-quests]');
  function paintQuests() {
    const done = QUESTS.filter((q) => prog[q.id] >= q.goal).length;
    questList.innerHTML = QUESTS.map((q) => {
      const ok = prog[q.id] >= q.goal;
      return `<div role="listitem" class="quest${ok ? ' done' : ''}"><i>${ok ? '✓' : ''}</i><span>${q.text}</span>${q.goal > 1 ? `<small>${Math.min(prog[q.id], q.goal)}/${q.goal}</small>` : ''}</div>`;
    }).join('') + (world.dashBest ? `<div class="quest-best">Best dash: <b>${world.dashBest.toFixed(1)}s</b></div>` : '');
    $('[data-qcount]').textContent = `${done}/${QUESTS.length}`;
    $('[data-rank]').textContent = RANKS[done];
    $('[data-qbar]').style.width = `${(done / QUESTS.length) * 100}%`;
    return done;
  }
  function advance(id, value) {
    const q = QUESTS.find((qq) => qq.id === id);
    if (!q || prog[id] >= q.goal) return;
    prog[id] = Math.min(q.goal, value);
    const before = RANKS[QUESTS.filter((qq) => qq.id !== id && prog[qq.id] >= qq.goal).length];
    const done = paintQuests();
    if (prog[id] < q.goal) return;
    sfx.play('quest');
    questBtn.classList.remove('pop');
    void questBtn.offsetWidth;
    questBtn.classList.add('pop');
    toast(`✅ <b>Quest complete:</b> ${q.text}${RANKS[done] !== before ? `<br/>New rank: <b>${RANKS[done]}</b>` : ''}`, RANKS[done] !== before);
    if (done === QUESTS.length) {
      setTimeout(() => {
        sfx.play('win');
        world.celebrate();
        toast('🏆 <b>Island Legend!</b><br/>You finished every quest. Thanks for exploring. Let\'s connect!', true);
        onAllQuests?.();
      }, 1400);
    }
  }
  paintQuests();
  questBtn.addEventListener('click', (e) => {
    const on = $('.quests').classList.toggle('open');
    questBtn.setAttribute('aria-expanded', String(on));
    e.currentTarget.blur();
  });

  /* ---- Island Dash timer ---- */
  const raceEl = $('.race');
  let raceTick = 0;
  $('[data-race-quit]').addEventListener('click', () => world.cancelRace());
  function race(r) {
    clearInterval(raceTick);
    if (r.state === 'start' || r.state === 'ring') {
      raceEl.classList.add('on');
      $('[data-race-ring]').textContent = `Ring ${r.i + 1} of ${r.total}`;
      raceTick = setInterval(() => ($('[data-race-time]').textContent = `${world.raceTime().toFixed(1)}s`), 100);
      if (r.state === 'start') {
        sfx.play('go');
        say(`Go! Follow the yellow arrow through all ${r.total} rings.${r.best ? ` Time to beat: ${r.best.toFixed(1)}s.` : ''}`, 5);
      } else sfx.play('ring');
      return;
    }
    raceEl.classList.remove('on');
    if (r.state === 'finish') {
      sfx.play('win');
      toast(`🏁 <b>Island Dash: ${r.time.toFixed(1)}s</b><br/>${r.record ? 'New best time!' : `Best: ${r.best.toFixed(1)}s. Try again to beat it.`}`, true);
      advance('dash', 1);
      paintQuests();
    } else {
      sfx.play('fail');
      toast('Island Dash stopped. Visit the yellow flag to try again.');
    }
  }

  /* ---- highlights tour: one stop at a time, so visitors know where to look ---- */
  const STOPS = [
    { id: 'arena', title: 'Hackathon Arena', sub: '4 hackathons in 2026, from NASA Space Apps to Cursor.' },
    { id: 'projects', title: 'Project Workshop', sub: 'My featured builds: AstroMed, HRChronicle AI, GreenLens AI and ExpoTrans.' },
    { id: 'timeline', title: 'Timeline Trail', sub: 'Where I work and study: Global Connect Asia, AIESEC, Curtin.' },
    { id: 'certs', title: 'Hall of Badges', sub: 'My top certifications: AWS, CCNA, Google, Lloyds.' },
    { id: 'about', title: 'The Beacon', sub: 'About me and how to reach me.' },
  ];
  const tourEl = $('.tour');
  const dots = tourEl.querySelector('.tour-dots');
  dots.innerHTML = STOPS.map(() => '<i></i>').join('');
  let stop = 0;
  let touring = false;
  function renderTour() {
    const s = STOPS[stop];
    const z = world.zones.find((zz) => zz.id === s.id);
    tourEl.style.setProperty('--tc', z.color);
    $('[data-tour-step]').textContent = `Highlights tour · ${stop + 1} of ${STOPS.length}`;
    $('[data-tour-title]').textContent = `Next: ${s.title}`;
    $('[data-tour-sub]').textContent = s.sub;
    [...dots.children].forEach((d, i) => (d.className = i < stop ? 'done' : i === stop ? 'now' : ''));
    world.setGuide(s.id);
    // show the full card for a moment, then shrink it so it doesn't cover the view
    tourEl.classList.remove('mini');
    clearTimeout(miniT);
    miniT = setTimeout(() => tourEl.classList.add('mini'), 7000);
  }
  let miniT = 0;
  tourEl.addEventListener('pointerenter', () => tourEl.classList.remove('mini'));
  tourEl.addEventListener('pointerleave', () => {
    clearTimeout(miniT);
    miniT = setTimeout(() => touring && tourEl.classList.add('mini'), 2500);
  });
  function startTour() {
    touring = true;
    stop = 0;
    tourEl.classList.remove('off');
    renderTour();
  }
  function endTour() {
    touring = false;
    tourEl.classList.add('off');
    world.setGuide(null);
  }
  $('[data-tour-close]').addEventListener('click', endTour);
  $('[data-tour-go]').addEventListener('click', (e) => {
    world.travelTo(STOPS[stop].id);
    e.currentTarget.blur();
  });
  function tourZone(z) {
    if (!touring || z.id !== STOPS[stop].id) return;
    stop++;
    if (stop >= STOPS.length) {
      endTour();
      toast('🎉 <b>Tour complete!</b> You have seen the highlights. Open the Beacon to get in touch.', true);
    } else {
      setTimeout(() => touring && renderTour(), 1800);
    }
  }

  // the controls card shrinks once people have had time to read it
  const hint = $('.controls-hint');
  setTimeout(() => hint.classList.add('dim'), 14000);

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
    if (st.guide) {
      const [gx, gy] = toMap(st.guide.c.x, st.guide.c.z);
      g.strokeStyle = '#fff';
      g.lineWidth = 4;
      g.beginPath();
      g.arc(gx, gy, 20 + Math.sin(performance.now() / 200) * 3, 0, Math.PI * 2);
      g.stroke();
    }
    if (st.ring) {
      const [rx, ry] = toMap(st.ring.x, st.ring.z);
      g.strokeStyle = '#ffd166';
      g.lineWidth = 5;
      g.beginPath();
      g.arc(rx, ry, 9 + Math.sin(performance.now() / 150) * 2, 0, Math.PI * 2);
      g.stroke();
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
    setView,
    lock(on) {
      hud.classList.toggle('locked', on);
    },
    near(it) {
      if (it) $('[data-label]').textContent = `${it.verb || 'View'} ${it.label}`;
      prompt.classList.toggle('on', !!it);
    },
    startTour,
    zone(z) {
      tourZone(z);
      if (!seen.areas.has(z.id)) {
        seen.areas.add(z.id);
        sfx.play('zone');
        if (ZONE_LINES[z.id] && !world.racing) setTimeout(() => say(ZONE_LINES[z.id]), 900);
        advance('areas', seen.areas.size);
      }
      zoneTitle.querySelector('small').textContent = z.sub;
      zoneTitle.querySelector('b').textContent = z.name;
      zoneTitle.classList.add('on');
      clearTimeout(zoneTimer);
      zoneTimer = setTimeout(() => zoneTitle.classList.remove('on'), 2400);
    },
    race,
    say,
    jump(kind) {
      sfx.play(kind === 'pad' ? 'pad' : 'jump');
    },
    opened(section, index) {
      sfx.play('open');
      if (section === 'news') advance('news', 1);
      else if (section === 'about') advance('contact', 1);
      else if (section !== 'more') {
        seen.exhibits.add(`${section}:${index}`);
        advance('exhibits', seen.exhibits.size);
      }
    },
    shard(n, total, secret) {
      sfx.play('shard');
      advance('shards', n);
      if (secret) advance('lookout', 1);
      if (secret) toast(`🌟 <b>Secret shard!</b> You conquered the Sky Lookout. (${n}/${total})`, n < total);
      else if (n < total) toast(`✦ Data shard ${n}/${total} collected`);
    },

    toast,
    destroy() {
      clearTimeout(mmRaf);
      clearInterval(tipLoop);
      clearInterval(raceTick);
      hud.remove();
    },
  };
}
