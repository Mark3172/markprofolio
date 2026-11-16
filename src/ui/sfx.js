/** Tiny synth for game sounds: no audio files, starts on the first click, can be muted. */
let ctx = null;
let muted = false;
try {
  muted = localStorage.getItem('sfx-muted') === '1';
} catch {
  /* storage blocked */
}

function tone(freq, dur, { type = 'sine', vol = 0.07, at = 0, to = 0 } = {}) {
  const t0 = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

const SOUNDS = {
  jump: () => tone(300, 0.16, { type: 'triangle', to: 620, vol: 0.05 }),
  pad: () => tone(220, 0.4, { type: 'sawtooth', to: 1100, vol: 0.04 }),
  shard: () => [880, 1320].forEach((f, i) => tone(f, 0.18, { at: i * 0.07 })),
  open: () => tone(520, 0.1, { type: 'triangle', to: 700, vol: 0.05 }),
  zone: () => [392, 523].forEach((f, i) => tone(f, 0.35, { at: i * 0.1, vol: 0.04 })),
  talk: () => [660, 880, 740].forEach((f, i) => tone(f, 0.07, { type: 'square', at: i * 0.07, vol: 0.02 })),
  ring: () => tone(1046, 0.22, { to: 1568 }),
  go: () => [523, 523, 784].forEach((f, i) => tone(f, i === 2 ? 0.35 : 0.12, { type: 'square', at: i * 0.16, vol: 0.035 })),
  quest: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, { type: 'triangle', at: i * 0.09 })),
  win: () => [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, i === 6 ? 0.6 : 0.16, { type: 'triangle', at: i * 0.12 })),
  fail: () => tone(300, 0.3, { type: 'triangle', to: 140, vol: 0.05 }),
};

export const sfx = {
  get muted() {
    return muted;
  },
  toggle() {
    muted = !muted;
    try {
      localStorage.setItem('sfx-muted', muted ? '1' : '0');
    } catch {
      /* storage blocked */
    }
    return muted;
  },
  play(name) {
    if (muted || !SOUNDS[name]) return;
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      SOUNDS[name]();
    } catch {
      /* audio not available */
    }
  },
};
