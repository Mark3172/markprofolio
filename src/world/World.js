import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { profile, projects, experience, certificates, achievements } from '../data/portfolio.js';
import { canvasTexture, rrect, wrap, fonts, makeLabel, chipRow, coverImage, withImage } from './textures.js';
import { TYPE_LABEL, TYPE_COLOR, mediaUrl } from '../ui/cards.js';

const R = 34; // island radius
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rand = mulberry(7); // deterministic so the island looks the same for everyone

function mulberry(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ZONES = [
  { id: 'plaza', name: 'Welcome Plaza', sub: 'Start here', color: '#ffffff', c: V(0, 0, 0), r: 6 },
  { id: 'projects', name: 'Project Workshop', sub: 'What I build', color: '#ff6b9d', c: V(0, 0, -21), r: 10, section: 'project' },
  { id: 'certs', name: 'Hall of Badges', sub: 'Certificates & licenses', color: '#ffb547', c: V(21, 0, 1), r: 9, section: 'certificate' },
  { id: 'timeline', name: 'Timeline Trail', sub: 'Experience & education', color: '#7cf5ff', c: V(0, 0, 21), r: 11, section: 'experience' },
  { id: 'about', name: 'The Beacon', sub: 'About me & contact', color: '#b18cff', c: V(-21, 0, 1), r: 9, section: 'about' },
  { id: 'arena', name: 'Hackathon Arena', sub: 'Hackathons & achievements', color: '#3ddc84', c: V(17, 0, 17), r: 6.5, section: 'achievement' },
];

const SHARD_SPOTS = [
  [45, 14], [135, 14], [225, 14], [315, 14],
  [20, 28], [110, 27], [200, 28], [290, 27],
].map(([deg, r]) => V(Math.cos((deg * Math.PI) / 180) * r, 1.3, Math.sin((deg * Math.PI) / 180) * r));

// floating parkour route out to a secret lookout (top = standing height)
const PLATFORMS = [
  { x: -13, z: -15, top: 1.0, r: 1.8 },
  { x: -16.5, z: -18.5, top: 2.1, r: 1.5 },
  { x: -20.5, z: -21, top: 3.2, r: 1.4 },
  { x: -24.5, z: -23.5, top: 4.3, r: 1.4 },
  { x: -28.5, z: -26, top: 5.4, r: 1.4 },
  { x: -31, z: -30.5, top: 6.5, r: 1.4 },
  { x: -29, z: -35.5, top: 7.6, r: 2.8, goal: true },
];
const SECRET_SHARD = V(-29, 7.6 + 1.2, -35.5);
const JUMP_PADS = [{ x: 7, z: -7, power: 16 }];

export function createWorld(container, hooks = {}) {
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(innerWidth, innerHeight) < 700;
  const low = isTouch || small || (navigator.hardwareConcurrency || 8) <= 4;
  const quality = { bloom: !low, shadows: !low, dpr: Math.min(devicePixelRatio, low ? 1.5 : 1.75) };

  /* ---------------- renderer / scene ---------------- */
  const renderer = new THREE.WebGLRenderer({ antialias: !quality.bloom, powerPreference: 'high-performance' });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = quality.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#1d1846', 70, 210);
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 700);

  let composer = null;
  let bloom = null;
  function setupComposer() {
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.75, 0.55, 0.78);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.setPixelRatio(quality.dpr);
    composer.setSize(container.clientWidth, container.clientHeight);
  }
  if (quality.bloom) setupComposer();

  /* ---------------- sky ---------------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(500, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { top: { value: new THREE.Color('#070818') }, mid: { value: new THREE.Color('#2a1d5c') }, bot: { value: new THREE.Color('#5b3a7a') } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, smoothstep(0.0, 0.55, h)) : mix(mid, bot, smoothstep(0.0, -0.4, h)); gl_FragColor = vec4(c, 1.0); }',
    }),
  );
  scene.add(sky);

  {
    const n = 1400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const y = Math.abs(u) * 0.95 + 0.05;
      pos.set([Math.cos(th) * s * 380, y * 380, Math.sin(th) * s * 380], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 })));
  }
  const moon = new THREE.Mesh(new THREE.SphereGeometry(14, 32, 16), new THREE.MeshBasicMaterial({ color: '#fff3d6', fog: false }));
  moon.position.set(-160, 150, -260);
  scene.add(moon);

  /* ---------------- lights ---------------- */
  scene.add(new THREE.HemisphereLight('#9fb0ff', '#3a2a5a', 1.25));
  const sun = new THREE.DirectionalLight('#d9e0ff', 2.0);
  sun.position.set(-30, 50, -20);
  if (quality.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 140 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.04;
  }
  scene.add(sun);

  /* ---------------- helpers ---------------- */
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0.05, ...extra });
  const glow = (color, intensity = 2.2) => new THREE.MeshStandardMaterial({ color: '#000', emissive: color, emissiveIntensity: quality.bloom ? intensity : Math.min(1, intensity * 0.4) });
  const shadowy = (m, cast = true, receive = true) => {
    m.castShadow = cast && quality.shadows;
    m.receiveShadow = receive && quality.shadows;
    return m;
  };

  const animators = []; // (t, dt) => void
  const colliders = []; // { x, z, r }
  const interactables = []; // { pos, radius, label, section, index, root, hover }
  const clickTargets = []; // meshes for raycasting -> interactable
  const fadeLabels = []; // sprites that fade out when the camera gets close

  function addInteractable(root, { section, index = 0, label, radius = 3.2, pos }) {
    const it = { root, section, index, label, radius, pos: pos || root.position.clone(), hover: 0 };
    interactables.push(it);
    root.traverse((o) => {
      if (o.isMesh) {
        o.userData.interactable = it;
        clickTargets.push(o);
      }
    });
    return it;
  }

  /* ---------------- island ---------------- */
  const island = new THREE.Group();
  scene.add(island);
  {
    const top = new THREE.CylinderGeometry(R, R - 1.2, 1.4, 64, 1);
    const p = top.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const d = Math.hypot(x, z);
      if (d > R - 2) {
        const a = Math.atan2(z, x);
        const k = 1 + 0.035 * Math.sin(a * 5) + 0.025 * Math.sin(a * 13 + 1);
        p.setX(i, x * k);
        p.setZ(i, z * k);
      }
    }
    top.computeVertexNormals();
    const grass = shadowy(new THREE.Mesh(top, mat('#2f7a68')), false, true);
    grass.position.y = -0.7;
    grass.name = 'ground';
    island.add(grass);

    const under = new THREE.ConeGeometry(R - 0.8, 26, 28, 6);
    under.rotateX(Math.PI);
    const up = under.attributes.position;
    for (let i = 0; i < up.count; i++) {
      const y = up.getY(i);
      if (y < 12.9 && y > -12.9) {
        up.setX(i, up.getX(i) * (0.9 + rand() * 0.22));
        up.setZ(i, up.getZ(i) * (0.9 + rand() * 0.22));
        up.setY(i, y + (rand() - 0.5) * 1.5);
      }
    }
    under.computeVertexNormals();
    const rock = new THREE.Mesh(under, mat('#4b3a6e'));
    rock.position.y = -14.4;
    island.add(rock);

    // dirt ring under the grass lip
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(R - 1.1, R - 3, 2.2, 48, 1, true), mat('#6b4f7d'));
    lip.position.y = -2.4;
    island.add(lip);

    // small floating rocks
    for (let i = 0; i < 9; i++) {
      const a = rand() * Math.PI * 2;
      const d = R + 6 + rand() * 18;
      const s = 1 + rand() * 2.5;
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(i % 2 ? '#5a4580' : '#4b3a6e'));
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.9, s * 0.9, 0.3, 7), mat('#2f7a68'));
      cap.position.y = s * 0.7;
      m.add(cap);
      const y0 = -4 + rand() * 8;
      m.position.set(Math.cos(a) * d, y0, Math.sin(a) * d);
      const ph = rand() * 6;
      animators.push((t) => {
        m.position.y = y0 + Math.sin(t * 0.5 + ph) * 0.6;
        m.rotation.y = t * 0.05 + ph;
      });
      scene.add(m);
    }
  }

  /* ---------------- clouds below ---------------- */
  {
    const n = low ? 40 : 70;
    const g = new THREE.IcosahedronGeometry(1, 1);
    const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: '#c9b8ff', roughness: 1, flatShading: true, emissive: '#3a2a70', emissiveIntensity: 0.35 }), n);
    const o = new THREE.Object3D();
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const d = 20 + rand() * 110;
      o.position.set(Math.cos(a) * d, -22 - rand() * 14, Math.sin(a) * d);
      const s = 5 + rand() * 9;
      o.scale.set(s * 1.6, s * 0.55, s);
      o.rotation.y = rand() * 3;
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    const clouds = new THREE.Group();
    clouds.add(m);
    scene.add(clouds);
    animators.push((t) => (clouds.rotation.y = t * 0.01));
  }

  /* ---------------- plaza + paths ---------------- */
  const pathMat = mat('#c8b48e', { roughness: 1 });
  {
    const plaza = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 0.2, 40), mat('#8c86b8')), false, true);
    plaza.position.y = 0.0;
    scene.add(plaza);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.07, 6, 64), glow('#7cf5ff', 2));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    scene.add(ring);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(1.4, 6), glow('#b18cff', 1.4));
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.12;
    scene.add(inner);
    animators.push((t) => (inner.rotation.z = t * 0.3));

    // paths from plaza to each zone
    for (const z of ZONES.slice(1)) {
      const dir = z.c.clone().setY(0).normalize();
      const len = z.c.length() - 6 - 2;
      const path = shadowy(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, len), pathMat), false, true);
      const mid = dir.clone().multiplyScalar(6 + len / 2);
      path.position.set(mid.x, 0.02, mid.z);
      path.rotation.y = Math.atan2(dir.x, dir.z);
      scene.add(path);
      // lanterns
      const side = V(dir.z, 0, -dir.x);
      for (let k = 0; k < 2; k++) {
        const p = dir.clone().multiplyScalar(8 + k * (len - 4)).add(side.clone().multiplyScalar(k % 2 ? 2 : -2));
        lantern(p, z.color);
      }
    }
  }

  function lantern(p, color) {
    const g = new THREE.Group();
    const pole = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2, 6), mat('#2a2440')));
    pole.position.y = 1;
    const bulb = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), glow(color, 3));
    bulb.position.y = 2.15;
    g.add(pole, bulb);
    g.position.copy(p);
    scene.add(g);
    colliders.push({ x: p.x, z: p.z, r: 0.3, h: 2.3 });
    return g;
  }

  /* ---------------- signpost + title ---------------- */
  {
    const post = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 4, 8), mat('#5b4a3a')));
    post.position.set(0, 2, 0);
    scene.add(post);
    colliders.push({ x: 0, z: 0, r: 0.4, h: 99 });
    ZONES.slice(1).forEach((z, i) => {
      const tex = canvasTexture(512, 96, (g, w, h) => {
        g.fillStyle = '#efe1c0';
        g.fillRect(0, 0, w, h);
        g.fillStyle = z.color === '#ffffff' ? '#222' : '#2a2240';
        g.font = `700 48px ${fonts.DISPLAY}`;
        g.textAlign = 'center';
        g.fillText(z.name, w / 2, 64, w - 30);
      });
      const board = new THREE.Group();
      const front = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.48, 0.08), [mat('#c9a77a'), mat('#c9a77a'), mat('#c9a77a'), mat('#c9a77a'), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })]);
      front.position.x = 1.35;
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 3), mat(z.color));
      tip.rotation.x = Math.PI / 2;
      tip.rotation.y = Math.PI / 2;
      tip.position.x = 2.8;
      board.add(front, tip);
      board.position.y = 3.3 - i * 0.6;
      board.rotation.y = -Math.atan2(z.c.z, z.c.x);
      post.add(board);
      board.position.y -= 2;
      front.castShadow = quality.shadows;
    });

    const title = makeLabel(profile.nickname === profile.name ? profile.name : `${profile.name}`, { sub: "Welcome to the island of", scale: 1.25 });
    title.position.set(0, 7.2, 0);
    scene.add(title);
    fadeLabels.push(title);
    animators.push((t) => (title.position.y = 7.2 + Math.sin(t * 1.2) * 0.15));
  }

  /* ---------------- zone labels ---------------- */
  for (const z of ZONES.slice(1)) {
    const l = makeLabel(z.name, { sub: z.sub, accent: z.color, scale: 1.1 });
    l.position.set(z.c.x, z.id === 'about' ? 12.5 : 7.5, z.c.z);
    scene.add(l);
    fadeLabels.push(l);
  }

  /* ---------------- PROJECT WORKSHOP ---------------- */
  {
    const zc = ZONES[1].c;
    // only the featured projects stand in the world; the rest live in the kiosk
    const shown = projects.map((p, i) => ({ p, i })).filter((x) => x.p.featured);
    const n = shown.length;
    const r = Math.min(11, 7 + Math.max(0, n - 5) * 0.9);
    const spread = Math.min(1.6, 0.32 * (n - 1));
    shown.forEach(({ p, i }, k) => {
      const a = n === 1 ? 0 : -spread + (2 * spread * k) / (n - 1);
      const pos = V(zc.x + Math.sin(a) * r, 0, zc.z + 3 - Math.cos(a) * r);
      const g = new THREE.Group();
      g.position.copy(pos);
      g.lookAt(zc.x, 0, zc.z + 12);

      const base = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.45, 0.9, 6), mat('#3a3462')));
      base.position.y = 0.45;
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.05, 6, 6), glow(p.color, 2.6));
      rim.rotation.x = Math.PI / 2;
      rim.rotation.z = Math.PI / 6;
      rim.position.y = 0.92;
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 1.1, 2.2, 6, 1, true),
        new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      beam.position.y = 2;

      const drawScreen = (g2, w, h, img) => {
        if (img) {
          // screenshot fills the screen, title sits on a dark fade at the bottom
          g2.save();
          rrect(g2, 6, 6, w - 12, h - 12, 28);
          g2.clip();
          coverImage(g2, img, 6, 6, w - 12, h - 12, 0);
          const fade = g2.createLinearGradient(0, h * 0.35, 0, h);
          fade.addColorStop(0, 'rgba(10,12,32,0)');
          fade.addColorStop(1, 'rgba(10,12,32,0.95)');
          g2.fillStyle = fade;
          g2.fillRect(0, 0, w, h);
          g2.restore();
          rrect(g2, 6, 6, w - 12, h - 12, 28);
          g2.lineWidth = 6;
          g2.strokeStyle = p.color;
          g2.stroke();
          g2.fillStyle = p.color;
          g2.font = `700 24px ${fonts.BODY}`;
          g2.fillText(`★ FEATURED${p.year ? ' · ' + p.year : ''}`, 40, h - 118);
          g2.fillStyle = '#ffffff';
          g2.font = `700 54px ${fonts.DISPLAY}`;
          g2.fillText(p.title, 40, h - 66, w - 80);
          g2.fillStyle = '#d4d8ff';
          g2.font = `500 26px ${fonts.BODY}`;
          g2.fillText(p.tagline, 40, h - 30, w - 80);
          return;
        }
        const grd = g2.createLinearGradient(0, 0, w, h);
        grd.addColorStop(0, '#141836');
        grd.addColorStop(1, '#1e1446');
        rrect(g2, 6, 6, w - 12, h - 12, 28);
        g2.fillStyle = grd;
        g2.fill();
        g2.lineWidth = 6;
        g2.strokeStyle = p.color;
        g2.stroke();
        g2.fillStyle = p.color;
        g2.font = `600 26px ${fonts.BODY}`;
        g2.fillText(`★ FEATURED${p.year ? ' · ' + p.year : ''}`, 40, 64);
        g2.fillStyle = '#ffffff';
        g2.font = `700 58px ${fonts.DISPLAY}`;
        const y = wrap(g2, p.title, 40, 130, w - 80, 62, 2);
        g2.fillStyle = '#b9bfe6';
        g2.font = `400 28px ${fonts.BODY}`;
        wrap(g2, p.tagline, 40, y + 6, w - 80, 36, 2);
        chipRow(g2, (p.tech || []).slice(0, 4), 40, h - 100, w - 80, p.color);
      };
      const tex = canvasTexture(640, 400, (g2, w, h) => drawScreen(g2, w, h, null));
      withImage(tex, mediaUrl(p.image), drawScreen);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.125), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
      screen.position.y = 3.2;
      const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 0), glow(p.color, 3));
      gem.position.y = 4.8;
      g.add(base, rim, beam, screen, gem);
      scene.add(g);
      colliders.push({ x: pos.x, z: pos.z, r: 1.45, h: 0.9 });
      const it = addInteractable(g, { section: 'project', index: i, label: p.title, radius: 3.4 });
      const ph = i * 0.9;
      animators.push((t) => {
        const k = 1 + it.hover * 0.08;
        screen.position.y = 3.2 + Math.sin(t * 1.4 + ph) * 0.12;
        screen.scale.setScalar(k);
        gem.rotation.y = t * 1.5;
        gem.rotation.x = t * 0.7;
        gem.position.y = 4.8 + Math.sin(t * 2 + ph) * 0.15;
        beam.material.opacity = 0.1 + it.hover * 0.18;
      });
    });
  }

  /* ---------------- HALL OF BADGES ---------------- */
  // Two tidy arcs that face the plaza: featured medals big in front, the rest smaller behind.
  // Each medal shows only issuer + a short name; details live in the card.
  {
    const zc = ZONES[2].c;
    const podium = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 1, 8), mat('#3a3462')));
    podium.position.set(zc.x - 3, 0.5, zc.z);
    const trophy = new THREE.Mesh(new THREE.TorusKnotGeometry(0.45, 0.15, 64, 8), new THREE.MeshStandardMaterial({ color: '#ffcf6b', metalness: 0.9, roughness: 0.25, emissive: '#ff9a1f', emissiveIntensity: 0.5 }));
    trophy.position.set(zc.x - 3, 2, zc.z);
    scene.add(podium, trophy);
    colliders.push({ x: zc.x - 3, z: zc.z, r: 1.4, h: 1 });
    animators.push((t) => {
      trophy.rotation.y = t * 0.8;
      trophy.position.y = 2 + Math.sin(t * 1.5) * 0.15;
    });

    const front = certificates.map((c, i) => ({ c, i })).filter((x) => x.c.featured);
    const back = certificates.map((c, i) => ({ c, i })).filter((x) => !x.c.featured);
    void back; // the other certificates are in the kiosk
    const rows = [{ list: front, r: 5, size: 1.25, h: 2.7, spread: 0.36 }];
    const lookTarget = V(zc.x - 14, 0, zc.z);
    for (const row of rows) {
      const n = row.list.length;
      const sp = Math.min(1.25, row.spread * (n - 1));
      row.list.forEach(({ c, i }, k) => {
        const a = n === 1 ? 0 : -sp + (2 * sp * k) / (n - 1);
        const pos = V(zc.x - 3 + Math.cos(a) * row.r, 0, zc.z + Math.sin(a) * row.r);
        const g = new THREE.Group();
        g.position.copy(pos);
        g.lookAt(lookTarget.x, 0, lookTarget.z);
        const col = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, row.h - row.size, 6), mat('#3a3462')));
        col.position.y = (row.h - row.size) / 2;
        const tex = canvasTexture(512, 512, (g2, w) => {
          const cx = w / 2;
          const grd = g2.createRadialGradient(cx, cx * 0.8, 40, cx, cx, cx);
          grd.addColorStop(0, '#1d2350');
          grd.addColorStop(1, '#10132e');
          g2.fillStyle = grd;
          g2.beginPath();
          g2.arc(cx, cx, cx, 0, Math.PI * 2);
          g2.fill();
          g2.lineWidth = 16;
          g2.strokeStyle = c.color;
          g2.beginPath();
          g2.arc(cx, cx, cx - 24, 0, Math.PI * 2);
          g2.stroke();
          g2.textAlign = 'center';
          g2.fillStyle = c.color;
          g2.font = `700 40px ${fonts.BODY}`;
          g2.fillText((c.issuerShort || c.issuer).toUpperCase(), cx, 150, 340);
          g2.fillStyle = '#ffffff';
          g2.font = `700 62px ${fonts.DISPLAY}`;
          const label = c.short || c.name;
          // vertically centre 1–2 lines
          const words = label.split(' ');
          let lines = [label];
          if (g2.measureText(label).width > 360 && words.length > 1) {
            let best = 1;
            let bestW = Infinity;
            for (let s = 1; s < words.length; s++) {
              const wmax = Math.max(g2.measureText(words.slice(0, s).join(' ')).width, g2.measureText(words.slice(s).join(' ')).width);
              if (wmax < bestW) {
                bestW = wmax;
                best = s;
              }
            }
            lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
          }
          const y0 = lines.length === 1 ? 285 : 255;
          lines.forEach((ln, li) => g2.fillText(ln, cx, y0 + li * 68, 380));
          if (c.date) {
            g2.fillStyle = '#9aa1d6';
            g2.font = `500 32px ${fonts.BODY}`;
            g2.fillText(c.date.split(' – ')[0], cx, 410);
          }
        });
        const medal = new THREE.Group();
        const R0 = row.size;
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(R0, R0, 0.16, 40, 1, true), new THREE.MeshStandardMaterial({ color: c.color, metalness: 0.8, roughness: 0.3, emissive: c.color, emissiveIntensity: 0.35 }));
        rim.rotation.x = Math.PI / 2;
        const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
        const f1 = new THREE.Mesh(new THREE.CircleGeometry(R0, 40), faceMat);
        f1.position.z = 0.08;
        const f2 = new THREE.Mesh(new THREE.CircleGeometry(R0, 40), new THREE.MeshStandardMaterial({ color: '#1a1f45', metalness: 0.6, roughness: 0.4 }));
        f2.position.z = -0.08;
        f2.rotation.y = Math.PI;
        medal.add(rim, f1, f2);
        medal.position.y = row.h;
        g.add(col, medal);
        if (c.featured) {
          const ribbon = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.6, 3), glow(c.color, 1.8));
          ribbon.position.set(0, row.h - R0 - 0.1, 0.05);
          ribbon.rotation.z = Math.PI;
          g.add(ribbon);
        }
        scene.add(g);
        colliders.push({ x: pos.x, z: pos.z, r: 0.5, h: 99 });
        const it = addInteractable(g, { section: 'certificate', index: i, label: c.name, radius: 2.6 });
        const ph = i * 1.3;
        animators.push((t) => {
          medal.position.y = row.h + Math.sin(t * 1.2 + ph) * 0.1;
          medal.rotation.y = Math.sin(t * 0.5 + ph) * 0.08 + it.hover * Math.sin(t * 3) * 0.1;
          medal.scale.setScalar(1 + it.hover * 0.1);
        });
      });
    }
  }

  /* ---------------- HACKATHON ARENA ---------------- */
  {
    const zc = ZONES.find((z) => z.id === 'arena').c;
    const floor = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.4, 0.14, 40), mat('#3b3470')), false, true);
    floor.position.set(zc.x, 0.05, zc.z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.07, 6, 64), glow('#3ddc84', 2));
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(zc.x, 0.14, zc.z);
    scene.add(floor, ring);
    // spotlights (cheap: additive cones)
    for (let k = 0; k < 3; k++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 9, 20, 1, true),
        new THREE.MeshBasicMaterial({ color: ['#3ddc84', '#7cf5ff', '#b18cff'][k], transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      );
      cone.position.set(zc.x, 4.5, zc.z);
      scene.add(cone);
      animators.push((t) => {
        cone.rotation.z = Math.sin(t * 0.6 + k * 2) * 0.35;
        cone.rotation.x = Math.cos(t * 0.5 + k * 2) * 0.35;
      });
    }

    const away = Math.atan2(zc.z, zc.x); // pointing away from the plaza
    const featured = achievements.map((a, i) => ({ a, i })).filter((x) => x.a.featured);
    const others = achievements.map((a, i) => ({ a, i })).filter((x) => !x.a.featured);
    void others; // the rest are in the kiosk
    const rows = [{ list: featured, r: 3.4, w: 2.5, h: 2.3, spread: 0.55 }];
    const KIND = { hackathon: 'HACKATHON', event: 'EVENT', award: 'AWARD', leadership: 'LEADERSHIP' };
    for (const row of rows) {
      const n = row.list.length;
      const sp = Math.min(1.3, row.spread * (n - 1));
      row.list.forEach(({ a, i }, k) => {
        const ang = away + (n === 1 ? 0 : -sp + (2 * sp * k) / (n - 1));
        const pos = V(zc.x + Math.cos(ang) * row.r, 0, zc.z + Math.sin(ang) * row.r);
        const g = new THREE.Group();
        g.position.copy(pos);
        g.lookAt(0, 0, 0);
        const featuredRow = !!a.featured;
        const H = row.w * 0.66;
        const drawBoard = (g2, w, h, img) => {
          g2.fillStyle = '#121633';
          rrect(g2, 0, 0, w, h, 26);
          g2.fill();
          if (img) {
            // event photo on the board, text on a dark fade
            g2.save();
            rrect(g2, 0, 0, w, h, 26);
            g2.clip();
            coverImage(g2, img, 0, 0, w, h, 0.3);
            const fade = g2.createLinearGradient(0, h * 0.3, 0, h);
            fade.addColorStop(0, 'rgba(10,12,32,0)');
            fade.addColorStop(1, 'rgba(10,12,32,0.94)');
            g2.fillStyle = fade;
            g2.fillRect(0, 0, w, h);
            g2.restore();
            g2.fillStyle = a.color;
            g2.fillRect(0, 0, w, 12);
            g2.font = `700 22px ${fonts.BODY}`;
            g2.fillText(`${KIND[a.kind] || 'EVENT'}  ·  ${a.date}`, 28, h - 92);
            g2.fillStyle = '#fff';
            g2.font = `700 40px ${fonts.DISPLAY}`;
            g2.fillText(a.title, 28, h - 48, w - 56);
            g2.fillStyle = '#d4d8ff';
            g2.font = `500 22px ${fonts.BODY}`;
            g2.fillText(a.result || a.role || '', 28, h - 18, w - 56);
            return;
          }
          g2.fillStyle = a.color;
          g2.fillRect(0, 0, w, 12);
          g2.font = `700 24px ${fonts.BODY}`;
          g2.fillText(`${KIND[a.kind] || 'EVENT'}  ·  ${a.date}`, 32, 62);
          g2.fillStyle = '#fff';
          g2.font = `700 50px ${fonts.DISPLAY}`;
          const y = wrap(g2, a.title, 32, 130, w - 64, 54, 2);
          g2.fillStyle = '#aeb4e0';
          g2.font = `500 28px ${fonts.BODY}`;
          wrap(g2, a.result || a.role, 32, y + 8, w - 64, 34, 1);
        };
        const tex = canvasTexture(512, 338, (g2, w, h) => drawBoard(g2, w, h, null));
        withImage(tex, mediaUrl(a.image), drawBoard);
        const board = new THREE.Mesh(new THREE.PlaneGeometry(row.w, H), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
        board.position.y = row.h;
        const poleM = mat('#2a2440');
        const p1 = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, row.h - H / 2, 6), poleM));
        p1.position.set(-row.w / 2 + 0.15, (row.h - H / 2) / 2, -0.02);
        const p2 = p1.clone();
        p2.position.x = row.w / 2 - 0.15;
        g.add(board, p1, p2);
        // emblem on top
        let emblem;
        if (a.kind === 'hackathon' || a.kind === 'award') {
          const pts = [
            [0, 0], [0.22, 0], [0.22, 0.05], [0.07, 0.1], [0.06, 0.28], [0.2, 0.36], [0.28, 0.62], [0.26, 0.64], [0, 0.64],
          ].map(([x, y]) => new THREE.Vector2(x, y));
          emblem = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), new THREE.MeshStandardMaterial({ color: a.kind === 'award' ? '#ffd166' : '#ffcf6b', metalness: 0.9, roughness: 0.25, emissive: '#ff9a1f', emissiveIntensity: 0.35 }));
          emblem.scale.setScalar(featuredRow ? 1.4 : 1);
        } else {
          emblem = new THREE.Mesh(new THREE.OctahedronGeometry(featuredRow ? 0.3 : 0.22, 0), glow(a.color, 2.6));
        }
        emblem.position.y = row.h + H / 2 + 0.25;
        g.add(emblem);
        scene.add(g);
        colliders.push({ x: pos.x, z: pos.z, r: 0.5, h: 99 });
        const it = addInteractable(g, { section: 'achievement', index: i, label: a.title, radius: 2.8 });
        const ph = i;
        const ey = emblem.position.y;
        animators.push((t) => {
          emblem.rotation.y = t * 1.2 + ph;
          emblem.position.y = ey + Math.sin(t * 2 + ph) * 0.08;
          board.scale.setScalar(1 + it.hover * 0.08);
        });
      });
    }
  }

  /* ---------------- TIMELINE TRAIL ---------------- */
  {
    const zc = ZONES[3].c;
    const firstEdu = experience.findIndex((e) => e.type === 'education');
    const shownXp = experience.map((e, i) => ({ e, i })).filter((x) => x.e.type !== 'education' || x.i === firstEdu);
    const n = shownXp.length;
    // monoliths stand on an arc that opens toward the plaza
    const r = Math.min(11, Math.max(8, n * 1.3));
    const spread = n === 1 ? 0 : Math.min(1.45, 0.3 * (n - 1));
    const arc = (a, rr) => [zc.x + Math.sin(a) * rr, zc.z - 3 + Math.cos(a) * rr * 0.7];
    const stones = 22;
    for (let s = 0; s <= stones; s++) {
      const a = -spread - 0.2 + ((2 * spread + 0.4) * s) / stones;
      const [x, z] = arc(a, r - 3.2);
      const st = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.55 + rand() * 0.2, 0.65, 0.16, 7), mat('#9a93c4')), false, true);
      st.position.set(x, 0.06, z);
      st.rotation.y = rand() * 3;
      scene.add(st);
    }
    shownXp.forEach(({ e, i }, k) => {
      // newest (index 0) ends up on the right when seen from the plaza
      const a = n === 1 ? 0 : -spread + (2 * spread * k) / (n - 1);
      const [x, z] = arc(a, r);
      const color = TYPE_COLOR[e.type] || '#7cf5ff';
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.lookAt(zc.x + Math.sin(a) * 2, 0, zc.z - 10);
      const stone = shadowy(new THREE.Mesh(new THREE.BoxGeometry(3.3, 4.4, 0.5), mat('#2e2952')));
      stone.position.y = 2.2;
      const tex = canvasTexture(512, 680, (g2, w, h) => {
        g2.fillStyle = '#171b3d';
        g2.fillRect(0, 0, w, h);
        g2.fillStyle = color;
        g2.fillRect(0, 0, w, 10);
        g2.font = `600 28px ${fonts.BODY}`;
        g2.fillText((TYPE_LABEL[e.type] || '').toUpperCase(), 40, 80);
        g2.fillStyle = '#ffffff';
        g2.font = `700 78px ${fonts.DISPLAY}`;
        g2.fillText(`${e.start}`, 40, 175);
        g2.fillStyle = '#8f96c8';
        g2.font = `500 34px ${fonts.BODY}`;
        g2.fillText(`→ ${e.end}`, 40, 222);
        g2.fillStyle = '#fff';
        g2.font = `700 46px ${fonts.DISPLAY}`;
        const y = wrap(g2, e.role, 40, 320, w - 80, 52, 3);
        g2.fillStyle = color;
        g2.font = `500 32px ${fonts.BODY}`;
        wrap(g2, e.org, 40, y + 12, w - 80, 40, 2);
        g2.fillStyle = '#6f76a8';
        g2.font = `400 24px ${fonts.BODY}`;
        g2.fillText('Press E or tap to read more', 40, h - 40);
      });
      const face = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.98), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      face.position.set(0, 2.2, 0.26);
      const backFace = face.clone();
      backFace.position.z = -0.26;
      backFace.rotation.y = Math.PI;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), glow(color, 3));
      orb.position.y = 5;
      g.add(stone, face, backFace, orb);
      scene.add(g);
      colliders.push({ x, z, r: 1.7, h: 4.4 });
      const it = addInteractable(g, { section: 'experience', index: i, label: e.role + ' · ' + e.org, radius: 3.6 });
      animators.push((tt) => {
        orb.position.y = 5 + Math.sin(tt * 2 + i) * 0.2;
        orb.scale.setScalar(1 + it.hover * 0.4);
      });
    });
  }

  /* ---------------- "SEE EVERYTHING" KIOSKS ---------------- */
  // The world only shows the highlights. Each zone has one small terminal that
  // opens a list of everything else in that section.
  function addKiosk(x, z, color, title, count, moreIndex) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.lookAt(0, 0, 0);
    const post = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, 0.4), mat('#2e2952')));
    post.position.y = 0.55;
    const tex = canvasTexture(400, 260, (g2, w, h) => {
      g2.fillStyle = '#121633';
      rrect(g2, 0, 0, w, h, 24);
      g2.fill();
      g2.lineWidth = 6;
      g2.strokeStyle = color;
      g2.stroke();
      g2.fillStyle = color;
      g2.font = `700 26px ${fonts.BODY}`;
      g2.fillText('SEE EVERYTHING', 30, 58);
      g2.fillStyle = '#fff';
      g2.font = `700 44px ${fonts.DISPLAY}`;
      wrap(g2, title, 30, 118, w - 60, 48, 2);
      g2.fillStyle = '#aeb4e0';
      g2.font = `500 26px ${fonts.BODY}`;
      g2.fillText(`+${count} more · press E`, 30, h - 34);
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.975), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, toneMapped: false }));
    screen.position.set(0, 1.55, 0.05);
    screen.rotation.x = -0.25;
    g.add(post, screen);
    scene.add(g);
    colliders.push({ x, z, r: 0.5, h: 99 });
    const it = addInteractable(g, { section: 'more', index: moreIndex, label: `all ${title.toLowerCase()}`, radius: 2.4 });
    animators.push(() => screen.scale.setScalar(1 + it.hover * 0.12));
  }
  {
    const extra = (list, keep) => list.length - list.filter(keep).length;
    const pz = ZONES[1].c;
    addKiosk(pz.x + 3.2, pz.z + 7.5, '#ff6b9d', 'All projects', extra(projects, (p) => p.featured), 0);
    const az = ZONES[5].c;
    const dir = az.clone().normalize();
    const perp = V(-dir.z, 0, dir.x);
    const ak = az.clone().sub(dir.clone().multiplyScalar(2.5)).add(perp.multiplyScalar(4.2));
    addKiosk(ak.x, ak.z, '#3ddc84', 'All hackathons & events', extra(achievements, (a) => a.featured), 1);
    const cz = ZONES[2].c;
    addKiosk(cz.x - 6, cz.z + 5, '#ffb547', 'All certifications', extra(certificates, (c) => c.featured), 2);
    const tz = ZONES[3].c;
    const firstEdu = experience.findIndex((e) => e.type === 'education');
    addKiosk(tz.x + 5, tz.z - 6, '#7cf5ff', 'Full experience & education', experience.filter((e, i) => e.type === 'education' && i !== firstEdu).length, 3);
  }

  /* ---------------- GUIDE (highlights tour) ---------------- */
  // A light pillar on the next stop and an arrow over the player's head.
  const guide = { zone: null };
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 40, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }),
  );
  pillar.position.y = 20;
  pillar.visible = false;
  scene.add(pillar);
  const arrowGeo = new THREE.ConeGeometry(0.28, 0.75, 4);
  arrowGeo.rotateX(Math.PI / 2); // tip points +z
  const arrow = new THREE.Mesh(arrowGeo, glow('#ffffff', 3));
  arrow.visible = false;
  scene.add(arrow);
  function setGuide(id) {
    const z = ZONES.find((zz) => zz.id === id) || null;
    guide.zone = z;
    pillar.visible = !!z;
    if (z) {
      pillar.position.x = z.c.x;
      pillar.position.z = z.c.z;
      pillar.material.color.set(z.color);
      arrow.material.color.set(z.color);
    } else arrow.visible = false;
  }

  /* ---------------- THE BEACON (about) ---------------- */
  {
    const zc = ZONES[4].c;
    const tx = zc.x - 3;
    const tz = zc.z;
    const tower = new THREE.Group();
    tower.position.set(tx, 0, tz);
    const base = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 1, 10), mat('#3a3462')));
    base.position.y = 0.5;
    tower.add(base);
    const segs = 5;
    for (let s = 0; s < segs; s++) {
      const seg = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(1.25 - s * 0.08, 1.33 - s * 0.08, 1.6, 10), mat(s % 2 ? '#b18cff' : '#eae6ff')));
      seg.position.y = 1.8 + s * 1.6;
      tower.add(seg);
    }
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), glow('#fff2c4', 4));
    lamp.position.y = 1 + segs * 1.6 + 0.6;
    const roof = shadowy(new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.4, 10), mat('#2a2440')));
    roof.position.y = lamp.position.y + 1.2;
    tower.add(lamp, roof);
    const pivot = new THREE.Group();
    pivot.position.y = lamp.position.y;
    const beamGeo = new THREE.ConeGeometry(2.2, 22, 24, 1, true);
    beamGeo.translate(0, -11, 0);
    beamGeo.rotateZ(Math.PI / 2);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: '#fff0b8', transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }));
    pivot.add(beam);
    tower.add(pivot);
    scene.add(tower);
    colliders.push({ x: tx, z: tz, r: 2.5, h: 1 }, { x: tx, z: tz, r: 1.4, h: 99 });
    animators.push((t) => (pivot.rotation.y = t * 0.6));

    // skill crystals orbiting
    const crystals = profile.skills.map((s, i) => {
      const colors = ['#7cf5ff', '#ff6b9d', '#ffb547', '#3ddc84', '#b18cff'];
      const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), glow(colors[i % colors.length], 2.6));
      tower.add(m);
      return m;
    });
    animators.push((t) => {
      crystals.forEach((m, i) => {
        const a = t * 0.5 + (i / crystals.length) * Math.PI * 2;
        m.position.set(Math.cos(a) * 3.4, 6 + Math.sin(t + i) * 0.6, Math.sin(a) * 3.4);
        m.rotation.y = t * 2;
      });
    });

    // terminal kiosk
    const kiosk = new THREE.Group();
    kiosk.position.set(zc.x + 3.2, 0, zc.z);
    kiosk.lookAt(0, 0, 0);
    const stand = shadowy(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.9), mat('#3a3462')));
    stand.position.y = 0.6;
    const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
    const tex = canvasTexture(512, 384, (g, w, h) => {
      g.fillStyle = '#10163a';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#b18cff';
      g.lineWidth = 10;
      g.strokeRect(5, 5, w - 10, h - 10);
      const grd = g.createLinearGradient(40, 40, 160, 160);
      grd.addColorStop(0, '#7cf5ff');
      grd.addColorStop(1, '#b18cff');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(110, 110, 64, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#0b0d1f';
      g.font = `700 56px ${fonts.DISPLAY}`;
      g.textAlign = 'center';
      g.fillText(initials, 110, 130);
      g.textAlign = 'left';
      g.fillStyle = '#fff';
      g.font = `700 48px ${fonts.DISPLAY}`;
      g.fillText('About me', 200, 100);
      g.fillStyle = '#b9bfe6';
      g.font = `400 28px ${fonts.BODY}`;
      g.fillText('skills · contact', 200, 145);
      g.fillStyle = '#7cf5ff';
      g.font = `500 30px ${fonts.BODY}`;
      wrap(g, profile.status || profile.location, 40, 250, w - 80, 38, 2);
      g.fillStyle = '#6f76a8';
      g.font = `400 24px ${fonts.BODY}`;
      g.fillText('Press E or tap to open', 40, h - 34);
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.65), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    screen.position.set(0, 2.1, 0.1);
    screen.rotation.x = -0.25;
    kiosk.add(stand, screen);
    scene.add(kiosk);
    colliders.push({ x: kiosk.position.x, z: kiosk.position.z, r: 0.9, h: 1.2 });
    const it = addInteractable(kiosk, { section: 'about', index: 0, label: 'About me & contact', radius: 3.4 });
    addInteractable(tower, { section: 'about', index: 0, label: 'About me & contact', radius: 0, pos: tower.position.clone() });
    animators.push(() => screen.scale.setScalar(1 + it.hover * 0.08));
  }

  /* ---------------- trees & rocks ---------------- */
  {
    const pathDist = (x, z) => {
      let best = Infinity;
      for (const zn of ZONES.slice(1)) {
        const d = zn.c.clone().setY(0);
        const L = d.length();
        const ux = d.x / L;
        const uz = d.z / L;
        const proj = Math.max(0, Math.min(L, x * ux + z * uz));
        best = Math.min(best, Math.hypot(x - ux * proj, z - uz * proj));
      }
      return best;
    };
    const ok = (x, z) => {
      if (Math.hypot(x, z) > R - 3) return false;
      for (const zn of ZONES) if (Math.hypot(x - zn.c.x, z - zn.c.z) < zn.r + 0.5) return false;
      if (pathDist(x, z) < 2.8) return false;
      for (const s of SHARD_SPOTS) if (Math.hypot(x - s.x, z - s.z) < 2) return false;
      for (const p of PLATFORMS) if (Math.hypot(x - p.x, z - p.z) < p.r + 2) return false;
      for (const p of JUMP_PADS) if (Math.hypot(x - p.x, z - p.z) < 2.5) return false;
      return true;
    };
    const n = low ? 55 : 95;
    const spots = [];
    for (let tries = 0; spots.length < n && tries < 4000; tries++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * (R - 3);
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      if (ok(x, z) && spots.every((s) => Math.hypot(s.x - x, s.z - z) > 1.8)) spots.push({ x, z, s: 0.7 + rand() * 0.8 });
    }
    const trunkG = new THREE.CylinderGeometry(0.12, 0.18, 1, 6);
    trunkG.translate(0, 0.5, 0);
    const leafG = new THREE.ConeGeometry(1, 2.2, 7);
    leafG.translate(0, 1.1, 0);
    const trunks = shadowy(new THREE.InstancedMesh(trunkG, mat('#4d3a33'), spots.length));
    const leaves = shadowy(new THREE.InstancedMesh(leafG, mat('#ffffff'), spots.length * 2));
    const o = new THREE.Object3D();
    const palette = ['#1f6b5c', '#2a8a6e', '#3a9e7a', '#5b4b9a', '#2c7a8a'].map((c) => new THREE.Color(c));
    spots.forEach((s, i) => {
      o.position.set(s.x, 0, s.z);
      o.rotation.set(0, rand() * 3, 0);
      o.scale.set(s.s, s.s * 1.2, s.s);
      o.updateMatrix();
      trunks.setMatrixAt(i, o.matrix);
      const c = palette[Math.floor(rand() * palette.length)];
      for (let k = 0; k < 2; k++) {
        o.position.set(s.x, s.s * (0.9 + k * 1.1), s.z);
        o.scale.set(s.s * (1 - k * 0.3), s.s * (1 - k * 0.25), s.s * (1 - k * 0.3));
        o.updateMatrix();
        leaves.setMatrixAt(i * 2 + k, o.matrix);
        leaves.setColorAt(i * 2 + k, c);
      }
      colliders.push({ x: s.x, z: s.z, r: 0.3 * s.s + 0.15, h: 99 });
    });
    scene.add(trunks, leaves);

    const rockG = new THREE.DodecahedronGeometry(0.6, 0);
    const rocks = shadowy(new THREE.InstancedMesh(rockG, mat('#7a72a8'), 26));
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2;
      const d = R - 3 - rand() * 3;
      o.position.set(Math.cos(a) * d, 0.1, Math.sin(a) * d);
      const s = 0.5 + rand() * 1.3;
      o.scale.set(s, s * 0.7, s);
      o.rotation.set(rand(), rand() * 3, rand());
      o.updateMatrix();
      rocks.setMatrixAt(i, o.matrix);
    }
    scene.add(rocks);

    // flowers: tiny glowing dots in the grass
    const fl = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.09, 0), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 160);
    const fc = ['#ff8fb8', '#ffe08a', '#9ff0ff', '#c9a6ff'].map((c) => new THREE.Color(c));
    for (let i = 0, k = 0; i < 600 && k < 160; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * (R - 2);
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      if (!ok(x, z)) continue;
      o.position.set(x, 0.15, z);
      o.scale.setScalar(1);
      o.updateMatrix();
      fl.setMatrixAt(k, o.matrix);
      fl.setColorAt(k, fc[k % 4]);
      k++;
    }
    scene.add(fl);
  }

  /* ---------------- fireflies ---------------- */
  const flies = (() => {
    const n = low ? 70 : 140;
    const base = new Float32Array(n * 3);
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * (R - 2);
      base.set([Math.cos(a) * d, 0.6 + rand() * 4, Math.sin(a) * d], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffe9a8', size: 0.22, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(pts);
    animators.push((t) => {
      for (let i = 0; i < n; i++) {
        const j = i * 3;
        pos[j] = base[j] + Math.sin(t * 0.4 + i) * 0.8;
        pos[j + 1] = base[j + 1] + Math.sin(t * 0.9 + i * 1.7) * 0.4;
        pos[j + 2] = base[j + 2] + Math.cos(t * 0.35 + i * 0.5) * 0.8;
      }
      g.attributes.position.needsUpdate = true;
    });
    return pts;
  })();

  /* ---------------- data shards (collectibles) ---------------- */
  const shardGeo = new THREE.OctahedronGeometry(0.42, 0);
  const shards = [...SHARD_SPOTS, SECRET_SHARD].map((p, i, all) => {
    const secret = i === all.length - 1;
    const m = new THREE.Mesh(shardGeo, glow(secret ? '#ffb547' : i % 2 ? '#7cf5ff' : '#b18cff', 3.2));
    m.position.copy(p);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.65, 24), new THREE.MeshBasicMaterial({ color: '#7cf5ff', transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(p.x, p.y - 1.24, p.z);
    scene.add(m, halo);
    return { m, halo, base: p.clone(), secret, got: false, t: 0 };
  });
  let shardCount = 0;
  const burst = createBurst(scene);

  /* ---------------- sky parkour route + jump pads ---------------- */
  for (const p of PLATFORMS) {
    const g = new THREE.Group();
    const top = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r * 0.95, 0.5, 9), mat('#2f7a68')), true, true);
    top.position.y = -0.25;
    const under = new THREE.Mesh(new THREE.ConeGeometry(p.r * 0.95, p.r * 1.8, 9), mat('#4b3a6e'));
    under.rotation.x = Math.PI;
    under.position.y = -0.5 - p.r * 0.9;
    const edge = new THREE.Mesh(new THREE.TorusGeometry(p.r - 0.05, 0.05, 6, 24), glow(p.goal ? '#ffb547' : '#7cf5ff', 2));
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.02;
    g.add(top, under, edge);
    g.position.set(p.x, p.top, p.z);
    scene.add(g);
    colliders.push({ x: p.x, z: p.z, r: p.r, y0: p.top - 0.5 - p.r * 1.8, h: p.top, platform: true });
  }
  {
    const goal = PLATFORMS[PLATFORMS.length - 1];
    const sign = makeLabel('Sky Lookout', { sub: 'Secret spot', accent: '#ffb547', scale: 0.7 });
    sign.position.set(goal.x, goal.top + 4.2, goal.z);
    scene.add(sign);
    fadeLabels.push(sign);
    const hint = makeLabel('Parkour ↑', { sub: 'Jump with Space', accent: '#7cf5ff', scale: 0.55 });
    hint.position.set(PLATFORMS[0].x, PLATFORMS[0].top + 2.6, PLATFORMS[0].z);
    scene.add(hint);
    fadeLabels.push(hint);
  }
  const pads = JUMP_PADS.map((p) => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.25, 0.25, 24), mat('#2a2440'));
    disc.position.set(p.x, 0.12, p.z);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.09, 8, 32), glow('#3ddc84', 3));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(p.x, 0.28, p.z);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.6, 4), glow('#3ddc84', 2.5));
    arrow.position.set(p.x, 1.2, p.z);
    scene.add(disc, ring, arrow);
    animators.push((t) => {
      arrow.position.y = 1.1 + ((t * 1.5) % 1) * 1.2;
      arrow.material.opacity = 1;
      ring.scale.setScalar(1 + Math.sin(t * 6) * 0.06);
    });
    return { ...p, ring };
  });

  /* ---------------- player character ---------------- */
  const player = new THREE.Group();
  const hero = makeCharacter(mat, glow, shadowy);
  player.add(hero.root);
  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.6, 24),
    new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.35, depthWrite: false }),
  );
  blob.rotation.x = -Math.PI / 2;
  scene.add(blob);
  const SPAWN = V(0, 0, 9);
  player.position.copy(SPAWN);
  scene.add(player);
  const heroLight = new THREE.PointLight('#7cf5ff', 4, 6, 1.6);
  heroLight.position.y = 1.2;
  player.add(heroLight);

  const target = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.5, 24), new THREE.MeshBasicMaterial({ color: '#7cf5ff', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
  target.rotation.x = -Math.PI / 2;
  target.visible = false;
  scene.add(target);

  /* ---------------- state ---------------- */
  const keys = new Set();
  const joy = { x: 0, y: 0 };
  let moveTo = null;
  let yaw = 0;
  let pitch = 0.32;
  let dist = isTouch ? 8 : 7;
  let view = 'tpp'; // 'tpp' | 'fpp'
  const vel = V(0, 0, 0);
  let vy = 0;
  let grounded = true;
  let jumpQueued = false;
  let coyote = 0;
  let heading = Math.PI;
  let speedNow = 0;
  let paused = false;
  let flight = null; // fast travel animation
  let introT = 0;
  let hovered = null;
  let aimed = null;
  let nearest = null;
  let shown = null;
  let currentZone = null;
  const HEIGHT = 1.75;

  /* ---------------- physics helpers ---------------- */
  function groundAt(x, z, feet) {
    let g = Math.hypot(x, z) < R - 0.6 ? 0 : -Infinity;
    for (const c of colliders) {
      if (c.h >= 50) continue;
      if (Math.hypot(x - c.x, z - c.z) < c.r && feet >= c.h - 0.35 && c.h > g) g = c.h;
    }
    return g;
  }

  /* ---------------- input ---------------- */
  const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'q', 'r'];
  const onKey = (e, down) => {
    if (e.target.closest?.('input,textarea')) return;
    const k = e.key.toLowerCase();
    if (down && !e.repeat && !paused) {
      if (k === 'e' || k === 'enter') {
        const it = aimed || nearest;
        if (it) {
          e.preventDefault();
          open(it);
        }
        return;
      }
      if (k === ' ') {
        e.preventDefault();
        jumpQueued = true;
        return;
      }
      if (k === 'v' || k === 'c') {
        api.toggleView();
        return;
      }
    }
    if (k === ' ') e.preventDefault();
    if (MOVE_KEYS.includes(k)) {
      if (down) keys.add(k);
      else keys.delete(k);
      if (down) moveTo = null;
      if (k.startsWith('arrow')) e.preventDefault();
    }
  };
  addEventListener('keydown', (e) => onKey(e, true));
  addEventListener('keyup', (e) => onKey(e, false));
  addEventListener('blur', () => keys.clear());

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down = null;
  const el = renderer.domElement;
  const locked = () => document.pointerLockElement === el;
  const setNdc = (e) => {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  };
  const look = (dx, dy, k) => {
    yaw -= dx * k;
    pitch = THREE.MathUtils.clamp(pitch + dy * k, view === 'fpp' ? -1.35 : -0.25, view === 'fpp' ? 1.35 : 1.25);
  };
  document.addEventListener('pointerlockchange', () => hooks.onLock?.(locked()));
  document.addEventListener('mousemove', (e) => {
    if (locked() && !paused) look(e.movementX || 0, e.movementY || 0, 0.0022);
  });
  el.addEventListener('pointerdown', (e) => {
    if (locked()) {
      if (e.button === 0 && aimed && !paused) open(aimed);
      return;
    }
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, id: e.pointerId, drag: false };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (locked()) return;
    if (down && down.id === e.pointerId) {
      if (!down.drag && Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y) > 6) down.drag = true;
      if (down.drag) {
        look(e.clientX - down.lx, e.clientY - down.ly, isTouch ? 0.007 : 0.005);
        el.style.cursor = 'grabbing';
      }
      down.lx = e.clientX;
      down.ly = e.clientY;
      return;
    }
    if (isTouch) return;
    setNdc(e);
    const hit = ray.intersectObjects(clickTargets, false)[0];
    hovered = hit ? hit.object.userData.interactable : null;
    el.style.cursor = hovered ? 'pointer' : 'crosshair';
  });
  el.addEventListener('pointerup', (e) => {
    if (!down || down.id !== e.pointerId) return;
    const wasDrag = down.drag;
    down = null;
    el.style.cursor = 'crosshair';
    if (wasDrag || paused) return;
    setNdc(e);
    const hit = ray.intersectObjects(clickTargets, false)[0];
    if (hit) return open(hit.object.userData.interactable);
    // desktop: a plain click on the world captures the mouse for free look
    if (!isTouch && el.requestPointerLock) {
      try {
        const p = el.requestPointerLock();
        p?.catch?.(() => {});
      } catch {
        /* pointer lock not available (e.g. iframe) — drag-to-look still works */
      }
    }
  });
  el.addEventListener('pointercancel', () => (down = null));
  el.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (view === 'fpp') return;
      dist = THREE.MathUtils.clamp(dist + e.deltaY * 0.01, 3, 13);
    },
    { passive: false },
  );
  el.style.cursor = 'crosshair';

  function open(it) {
    if (!it) return;
    if (locked()) document.exitPointerLock?.();
    hooks.onOpen?.(it.section, it.index);
  }

  /* ---------------- resize / visibility ---------------- */
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.fov = view === 'fpp' ? (w < h ? 75 : 68) : w < h ? 62 : 52;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer?.setSize(w, h);
  }
  addEventListener('resize', resize);

  /* ---------------- loop ---------------- */
  const clock = new THREE.Timer();
  const tmp = V(0, 0, 0);
  const camGoal = V(0, 0, 0);
  const lookGoal = V(0, 0, 0);
  const lookAt = V(0, 1, 0);
  const center = new THREE.Vector2(0, 0);
  camera.position.set(0, 60, 80);
  let frames = 0;
  let fpsT = 0;
  let checkedPerf = false;
  let aimTick = 0;

  function respawn() {
    player.position.copy(SPAWN);
    vel.set(0, 0, 0);
    vy = 0;
    yaw = 0;
    hooks.onRespawn?.();
  }

  function step() {
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.1);
    const t = clock.getElapsed();

    // adaptive quality after ~3s
    if (!checkedPerf) {
      frames++;
      fpsT += dt;
      if (fpsT > 3) {
        checkedPerf = true;
        if (frames / fpsT < 40) {
          composer = null;
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
          renderer.shadowMap.enabled = false;
          renderer.setSize(container.clientWidth, container.clientHeight);
        }
      }
    }

    // ---- input -> desired horizontal velocity
    let ix = joy.x;
    let iy = joy.y;
    if (keys.has('a') || keys.has('arrowleft')) ix -= 1;
    if (keys.has('d') || keys.has('arrowright')) ix += 1;
    if (keys.has('w') || keys.has('arrowup')) iy += 1;
    if (keys.has('s') || keys.has('arrowdown')) iy -= 1;
    if (keys.has('q')) yaw += dt * 2;
    if (keys.has('r')) yaw -= dt * 2;
    const fwd = V(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = V(Math.cos(yaw), 0, -Math.sin(yaw));
    const want = V(0, 0, 0);
    if (ix || iy) {
      want.addScaledVector(right, ix).addScaledVector(fwd, iy);
      if (want.lengthSq() > 1) want.normalize();
      moveTo = null;
      target.visible = false;
    } else if (moveTo) {
      tmp.set(moveTo.x - player.position.x, 0, moveTo.z - player.position.z);
      const d = tmp.length();
      if (d < 0.4) {
        moveTo = null;
        target.visible = false;
      } else want.copy(tmp.normalize()).multiplyScalar(Math.min(1, d / 2));
    }
    if (paused) want.set(0, 0, 0);
    const sprint = keys.has('shift') || Math.hypot(joy.x, joy.y) > 0.95;
    const maxSpeed = sprint ? 10 : 6;
    vel.lerp(want.multiplyScalar(maxSpeed), 1 - Math.exp(-dt * (grounded ? 12 : 3)));

    if (flight) {
      flight.t += dt / flight.dur;
      const k = Math.min(1, flight.t);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      player.position.lerpVectors(flight.from, flight.to, e);
      player.position.y = THREE.MathUtils.lerp(flight.from.y, flight.to.y, e) + Math.sin(k * Math.PI) * 9;
      vel.set(0, 0, 0);
      vy = 0;
      grounded = false;
      if (k >= 1) {
        flight = null;
        grounded = true;
      }
    } else {
      // horizontal move + collisions
      player.position.x += vel.x * dt;
      player.position.z += vel.z * dt;
      const feet = player.position.y;
      for (const c of colliders) {
        const y0 = c.y0 ?? -10;
        if (feet >= c.h - 0.35 || feet + HEIGHT <= y0) continue; // above it (can stand on it) or below it
        const dx = player.position.x - c.x;
        const dz = player.position.z - c.z;
        const d = Math.hypot(dx, dz);
        const min = c.r + 0.4;
        if (d < min && d > 0.0001) {
          player.position.x = c.x + (dx / d) * min;
          player.position.z = c.z + (dz / d) * min;
        }
      }
      // vertical
      const g = groundAt(player.position.x, player.position.z, feet);
      if (grounded && feet - g > 0.4) grounded = false; // walked off a ledge
      if (grounded) coyote = 0.12;
      else coyote -= dt;
      if (jumpQueued && (grounded || coyote > 0) && !paused) {
        vy = 9.2;
        grounded = false;
        coyote = 0;
        hooks.onJump?.();
      }
      jumpQueued = false;
      if (!grounded) {
        vy -= 24 * dt;
        player.position.y += vy * dt;
        if (player.position.y <= g && vy <= 0) {
          player.position.y = g;
          vy = 0;
          grounded = true;
        }
      } else {
        player.position.y = THREE.MathUtils.lerp(player.position.y, g, 1 - Math.exp(-dt * 20)); // smooth small steps
      }
      // jump pads
      if (grounded) {
        for (const p of pads) {
          if (Math.hypot(player.position.x - p.x, player.position.z - p.z) < 1.1) {
            vy = p.power;
            grounded = false;
            burst.fire(V(p.x, 0.5, p.z), new THREE.Color('#3ddc84'), 30);
            hooks.onJump?.();
          }
        }
      }
      if (player.position.y < -28) respawn();
    }

    speedNow = Math.hypot(vel.x, vel.z);
    if (view === 'fpp') heading = yaw + Math.PI;
    else if (speedNow > 0.3) heading = Math.atan2(vel.x, vel.z);
    player.rotation.y = lerpAngle(player.rotation.y, heading, 1 - Math.exp(-dt * 12));
    hero.update(dt, speedNow / 6, grounded, vy);
    hero.root.visible = view !== 'fpp';
    const gb = groundAt(player.position.x, player.position.z, player.position.y + 0.01);
    blob.visible = gb > -100;
    if (blob.visible) {
      blob.position.set(player.position.x, gb + 0.04, player.position.z);
      blob.scale.setScalar(Math.max(0.3, 1 - (player.position.y - gb) * 0.12));
    }
    if (target.visible) target.scale.setScalar(1 + Math.sin(t * 6) * 0.15);

    // ---- aim (what the crosshair points at)
    aimTick -= dt;
    if (aimTick <= 0) {
      aimTick = 0.1;
      aimed = null;
      if (view === 'fpp' || locked()) {
        ray.setFromCamera(center, camera);
        const hit = ray.intersectObjects(clickTargets, false)[0];
        if (hit && hit.object.userData.interactable && hit.point.distanceTo(player.position) < 12) aimed = hit.object.userData.interactable;
      }
    }

    // ---- proximity / zones
    let best = null;
    let bestD = Infinity;
    for (const it of interactables) {
      if (!it.radius) continue;
      const d = Math.hypot(player.position.x - it.pos.x, player.position.z - it.pos.z);
      if (d < it.radius && d < bestD) {
        best = it;
        bestD = d;
      }
    }
    nearest = best;
    const focus = aimed || nearest;
    if (focus !== shown) {
      shown = focus;
      hooks.onNear?.(focus);
    }
    for (const it of interactables) {
      const goal = it === focus || it === hovered || (focus && focus.section === 'about' && it.section === 'about') ? 1 : 0;
      it.hover += (goal - it.hover) * Math.min(1, dt * 8);
    }
    let zone = null;
    for (const z of ZONES) if (Math.hypot(player.position.x - z.c.x, player.position.z - z.c.z) < z.r) zone = z;
    if (zone !== currentZone) {
      currentZone = zone;
      if (zone) hooks.onZone?.(zone);
    }
    if (guide.zone) {
      const gz = guide.zone;
      const dx = gz.c.x - player.position.x;
      const dz = gz.c.z - player.position.z;
      const far = Math.hypot(dx, dz) > gz.r * 0.8;
      arrow.visible = far && view === 'tpp' && !flight;
      if (arrow.visible) {
        arrow.position.set(player.position.x + (dx / Math.hypot(dx, dz)) * 1.1, player.position.y + 2.6 + Math.sin(t * 4) * 0.08, player.position.z + (dz / Math.hypot(dx, dz)) * 1.1);
        arrow.rotation.set(0, Math.atan2(dx, dz), 0);
      }
      pillar.material.opacity = 0.08 + Math.sin(t * 2) * 0.03;
    }

    // ---- shards
    for (const s of shards) {
      if (s.got) {
        if (s.t < 1) {
          s.t += dt * 2.5;
          s.m.position.y += dt * 6;
          s.m.scale.setScalar(Math.max(0.001, 1 - s.t));
          s.halo.material.opacity = Math.max(0, 0.5 - s.t);
          if (s.t >= 1) s.m.visible = s.halo.visible = false;
        }
        continue;
      }
      s.m.rotation.y = t * 2;
      s.m.position.y = s.base.y + Math.sin(t * 2 + s.base.x) * 0.25;
      s.halo.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
      if (
        Math.hypot(player.position.x - s.m.position.x, player.position.z - s.m.position.z) < 1.3 &&
        Math.abs(player.position.y + 0.9 - s.m.position.y) < 1.6
      ) {
        s.got = true;
        shardCount++;
        burst.fire(s.m.position, s.m.material.emissive);
        hooks.onShard?.(shardCount, shards.length, s.secret);
        if (shardCount === shards.length) {
          burst.fire(player.position.clone().setY(player.position.y + 3), new THREE.Color('#ffb547'), 160);
          hooks.onAllShards?.();
        }
      }
    }
    burst.update(dt);

    for (const a of animators) a(t, dt);

    // ---- camera
    const head = V(player.position.x, player.position.y + 1.55, player.position.z);
    if (view === 'fpp') {
      camGoal.copy(head).addScaledVector(fwd, 0.15);
      lookGoal.set(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)).add(camGoal);
    } else {
      const cp = Math.cos(pitch);
      camGoal.set(head.x + Math.sin(yaw) * cp * dist, head.y + Math.sin(pitch) * dist, head.z + Math.cos(yaw) * cp * dist).addScaledVector(right, 0.55);
      const floor = Math.max(groundAt(camGoal.x, camGoal.z, camGoal.y), -2) + 0.5;
      if (camGoal.y < floor) camGoal.y = floor;
      lookGoal.copy(head).addScaledVector(right, 0.55);
    }
    if (introT < 1) {
      introT = Math.min(1, introT + dt / 2.6);
      const e = 1 - Math.pow(1 - introT, 3);
      camera.position.lerpVectors(V(-40, 55, 75), camGoal, e);
      lookAt.lerpVectors(V(0, 0, 0), lookGoal, e);
    } else if (view === 'fpp') {
      camera.position.copy(camGoal);
      lookAt.copy(lookGoal);
    } else {
      camera.position.lerp(camGoal, 1 - Math.exp(-dt * (flight ? 4 : 14)));
      lookAt.lerp(lookGoal, 1 - Math.exp(-dt * 18));
    }
    camera.lookAt(lookAt);
    for (const l of fadeLabels) l.material.opacity = THREE.MathUtils.smoothstep(camera.position.distanceTo(l.position), 6, 13);
    sun.position.set(player.position.x - 30, 50, player.position.z - 20);
    sun.target.position.set(player.position.x, 0, player.position.z);
    sun.target.updateMatrixWorld();

    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
  }

  let running = false;
  function start() {
    if (running) return;
    running = true;
    clock.update();
    renderer.setAnimationLoop(step);
  }
  function stop() {
    running = false;
    renderer.setAnimationLoop(null);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if (import.meta.env.DEV) window.__w = { player, camera, get flight() { return flight; }, setYaw: (v) => (yaw = v) };
  renderer.compile(scene, camera);
  resize();
  start();

  const api = {
    zones: ZONES,
    islandRadius: R,
    get shardTotal() {
      return shards.length;
    },
    get view() {
      return view;
    },
    setPaused(v) {
      paused = v;
      if (v) keys.clear();
    },
    setJoystick(x, y) {
      joy.x = x;
      joy.y = y;
    },
    jump() {
      jumpQueued = true;
    },
    toggleView() {
      view = view === 'tpp' ? 'fpp' : 'tpp';
      pitch = view === 'fpp' ? 0.05 : 0.32;
      resize();
      hooks.onView?.(view);
    },
    lockMouse() {
      try {
        el.requestPointerLock?.()?.catch?.(() => {});
      } catch {
        /* ignore */
      }
    },
    interact() {
      open(aimed || nearest);
    },
    travelTo(id) {
      const z = ZONES.find((zz) => zz.id === id);
      if (!z) return;
      const dir = z.c.clone().setY(0);
      const toward = dir.length() ? dir.clone().normalize() : V(0, 0, 1);
      const to = z.id === 'plaza' ? V(0, 0, 8) : z.c.clone().sub(toward.multiplyScalar(z.id === 'timeline' ? 7 : 5.5)).setY(0);
      flight = { from: player.position.clone(), to, t: 0, dur: 1.4 };
      moveTo = null;
      target.visible = false;
      yaw = z.id === 'plaza' ? 0 : Math.atan2(-(z.c.x - to.x), -(z.c.z - to.z)) || 0;
    },
    moveToWorld(x, z) {
      if (Math.hypot(x, z) > R - 2.5) return;
      moveTo = V(x, 0, z);
      target.position.set(x, 0.08, z);
      target.visible = true;
    },
    minimap() {
      return { px: player.position.x, pz: player.position.z, heading: player.rotation.y, yaw, guide: guide.zone, shards: shards.filter((s) => !s.got).map((s) => s.m.position) };
    },
    setGuide,
  };
  return api;
}

/** Low-poly explorer with a simple procedural walk cycle. */
function makeCharacter(mat, glow, shadowy) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const hoodie = mat('#6a4bd6');
  const pants = mat('#26213f');
  const skin = mat('#f0c9a0');
  const shoe = mat('#f2f0ff');

  const limb = (w, h, d, m, x, y) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    const mesh = shadowy(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m), true, false);
    mesh.position.y = -h / 2;
    pivot.add(mesh);
    body.add(pivot);
    return { pivot, mesh };
  };
  const legL = limb(0.24, 0.8, 0.26, pants, -0.15, 0.82);
  const legR = limb(0.24, 0.8, 0.26, pants, 0.15, 0.82);
  for (const l of [legL, legR]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.38), shoe);
    s.position.set(0, -0.78, 0.05);
    l.pivot.add(s);
  }
  const torso = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.36), hoodie), true, false);
  torso.position.y = 1.18;
  body.add(torso);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.06, 0.38), glow('#7cf5ff', 2.2));
  stripe.position.y = 1.08;
  body.add(stripe);
  const armL = limb(0.18, 0.66, 0.2, hoodie, -0.41, 1.5);
  const armR = limb(0.18, 0.66, 0.2, hoodie, 0.41, 1.5);
  for (const a of [armL, armR]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.18), skin);
    h.position.y = -0.7;
    a.pivot.add(h);
  }
  const headG = new THREE.Group();
  headG.position.y = 1.62;
  const head = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.46, 0.44), skin), true, false);
  head.position.y = 0.22;
  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.48), mat('#1d1830'));
  hair.position.y = 0.48;
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), mat('#1d1830'));
  fringe.position.set(0, 0.38, 0.2);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.04), glow('#7cf5ff', 2.6));
  visor.position.set(0, 0.24, 0.23);
  headG.add(head, hair, fringe, visor);
  body.add(headG);
  const pack = shadowy(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.5, 0.2), mat('#2a2440')), true, false);
  pack.position.set(0, 1.2, -0.28);
  const jet = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8, 1, true), new THREE.MeshBasicMaterial({ color: '#7cf5ff', transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
  jet.rotation.x = Math.PI;
  jet.position.set(0, 0.88, -0.3);
  body.add(pack, jet);

  let phase = 0;
  return {
    root,
    update(dt, speed, grounded, vy) {
      const s = Math.min(speed, 1.7);
      phase += dt * (4 + s * 7) * (s > 0.05 ? 1 : 0);
      let swing = Math.sin(phase) * 0.8 * Math.min(s, 1.2);
      if (!grounded) swing = 0;
      const air = grounded ? 0 : 1;
      legL.pivot.rotation.x = THREE.MathUtils.lerp(swing, -0.6, air);
      legR.pivot.rotation.x = THREE.MathUtils.lerp(-swing, 0.3, air);
      armL.pivot.rotation.x = THREE.MathUtils.lerp(-swing * 0.9, -2.6, air * (vy > 0 ? 1 : 0.5));
      armR.pivot.rotation.x = THREE.MathUtils.lerp(swing * 0.9, -2.6, air * (vy > 0 ? 1 : 0.5));
      armL.pivot.rotation.z = -0.08 - air * 0.3;
      armR.pivot.rotation.z = 0.08 + air * 0.3;
      body.position.y = grounded ? Math.abs(Math.sin(phase)) * 0.06 * Math.min(s, 1) : 0;
      body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, grounded ? s * 0.12 : 0.05, 0.2);
      headG.rotation.y = s < 0.05 ? Math.sin(phase * 0.2 + performance.now() * 0.0004) * 0.25 : 0;
      jet.visible = !grounded;
      jet.scale.y = 1 + Math.random() * 0.4;
    },
  };
}

function lerpAngle(a, b, k) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

/** Cheap particle burst for collecting shards. */
function createBurst(scene) {
  const MAX = 300;
  const pos = new Float32Array(MAX * 3);
  const vel = new Float32Array(MAX * 3);
  const life = new Float32Array(MAX);
  const col = new Float32Array(MAX * 3);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.25, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  pts.frustumCulled = false;
  scene.add(pts);
  let head = 0;
  return {
    fire(p, color, n = 60) {
      for (let i = 0; i < n; i++) {
        const j = head;
        head = (head + 1) % MAX;
        pos.set([p.x, p.y, p.z], j * 3);
        const a = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const s = Math.sqrt(1 - u * u);
        const sp = 3 + Math.random() * 5;
        vel.set([Math.cos(a) * s * sp, Math.abs(u) * sp + 2, Math.sin(a) * s * sp], j * 3);
        col.set([color.r * 1.5, color.g * 1.5, color.b * 1.5], j * 3);
        life[j] = 1;
      }
    },
    update(dt) {
      for (let j = 0; j < MAX; j++) {
        if (life[j] <= 0) continue;
        life[j] -= dt * 1.1;
        const k = j * 3;
        vel[k + 1] -= 9 * dt;
        pos[k] += vel[k] * dt;
        pos[k + 1] += vel[k + 1] * dt;
        pos[k + 2] += vel[k + 2] * dt;
        if (life[j] <= 0) pos[k + 1] = -999;
      }
      g.attributes.position.needsUpdate = true;
      g.attributes.color.needsUpdate = true;
    },
  };
}
