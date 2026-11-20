import * as THREE from 'three';

/**
 * 3D profile picture for the classic view: the photo on a floating coin that leans
 * toward the cursor, can be dragged to spin (the back says what I'm open to), with
 * skills orbiting it. Clicking a skill filters the project list (same as the chips).
 * Loaded after the page, only with WebGL and without reduced motion; the flat photo
 * stays in place until the 3D one is ready, and comes back if anything fails.
 */
export function mountPortrait(stage, { photo, initials, back, skills, onSkill }) {
  const small = innerWidth < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 2 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'portrait-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 9.9);

  scene.add(new THREE.AmbientLight('#b8b0ff', 1.1));
  const key = new THREE.DirectionalLight('#ffffff', 2.4);
  key.position.set(3, 4, 6);
  const rimL = new THREE.PointLight('#7cf5ff', 30, 12);
  rimL.position.set(-3.5, 1.5, 2);
  const rimR = new THREE.PointLight('#ff6b9d', 24, 12);
  rimR.position.set(3.5, -1.8, 2);
  scene.add(key, rimL, rimR);

  /* ---- the coin ---- */
  const R = 1.55;
  const coin = new THREE.Group();
  scene.add(coin);
  const loader = new THREE.TextureLoader();
  const face = loader.load(photo, () => ready(), undefined, () => fail());
  face.colorSpace = THREE.SRGBColorSpace;
  face.anisotropy = 4;
  const backTex = canvasTex(512, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#2a1f6e');
    grd.addColorStop(1, '#0f1b44');
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.textAlign = 'center';
    g.fillStyle = '#7cf5ff';
    g.font = '700 150px "Space Grotesk", system-ui, sans-serif';
    g.fillText(initials, w / 2, h / 2 - 10);
    g.fillStyle = '#e8e6ff';
    g.font = '600 34px Inter, system-ui, sans-serif';
    back.forEach((line, i) => g.fillText(line, w / 2, h / 2 + 62 + i * 44));
  });
  const capGeo = new THREE.CircleGeometry(R * 0.93, 96);
  const front = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ map: face, roughness: 0.55, metalness: 0.05 }));
  front.position.z = 0.171;
  const rear = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.6 }));
  rear.position.z = -0.171;
  rear.rotation.y = Math.PI;
  const rimMat = new THREE.MeshStandardMaterial({ color: '#8a6dff', metalness: 0.85, roughness: 0.25, emissive: '#3b2a9a', emissiveIntensity: 0.6 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.34, 96, 1, false), rimMat);
  body.rotation.x = Math.PI / 2;
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(R * 0.965, 0.06, 16, 120), new THREE.MeshStandardMaterial({ color: '#7cf5ff', emissive: '#7cf5ff', emissiveIntensity: 1.3, metalness: 0.4, roughness: 0.3 }));
  bezel.position.z = 0.17;
  const bezelB = bezel.clone();
  bezelB.position.z = -0.17;
  coin.add(body, front, rear, bezel, bezelB);

  // soft halo behind the coin
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(R * 1.75, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { c1: { value: new THREE.Color('#7c5cff') }, c2: { value: new THREE.Color('#7cf5ff') } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: 'uniform vec3 c1; uniform vec3 c2; varying vec2 vUv; void main(){ float d = distance(vUv, vec2(.5)); float a = smoothstep(.5, .18, d) * .55; gl_FragColor = vec4(mix(c2, c1, d * 2.), a); }',
    }),
  );
  halo.position.z = -1.2;
  scene.add(halo);

  /* ---- orbiting skills ---- */
  const orbit = new THREE.Group();
  orbit.rotation.x = 0.32;
  orbit.rotation.z = -0.12;
  scene.add(orbit);
  const ORBIT_R = 2.2;
  const tags = skills.map((s, i) => {
    const tex = canvasTex(512, 128, (g, w, h) => {
      g.font = '600 46px Inter, system-ui, sans-serif';
      const tw = Math.min(w - 20, g.measureText(s.label).width + 64);
      const x = (w - tw) / 2;
      g.fillStyle = 'rgba(14, 16, 44, 0.92)';
      rr(g, x, 14, tw, h - 28, 48);
      g.fill();
      g.lineWidth = 4;
      g.strokeStyle = s.color;
      g.stroke();
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(s.label, w / 2, h / 2 + 2);
    });
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.set(1.45, 0.36, 1);
    sp.userData = { skill: s.skill || s.label, a: (i / skills.length) * Math.PI * 2, hover: 0 };
    orbit.add(sp);
    return sp;
  });
  // little sparks on the orbit path
  const sparkGeo = new THREE.BufferGeometry();
  const pts = new Float32Array(90 * 3);
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2;
    pts.set([Math.cos(a) * ORBIT_R, (Math.random() - 0.5) * 0.12, Math.sin(a) * ORBIT_R], i * 3);
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  orbit.add(new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: '#c9c3ff', size: 0.035, transparent: true, opacity: 0.7, depthWrite: false })));

  /* ---- input: lean toward the pointer, drag to spin, click a skill ---- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0; // extra rotation from dragging
  let spinVel = 0;
  let drag = null;
  let hovered = null;
  const setNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    return r;
  };
  const pick = () => {
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(tags, false)[0]?.object || null;
  };
  const onWinMove = (e) => {
    // lean toward the cursor anywhere in the hero
    const r = canvas.getBoundingClientRect();
    look.tx = THREE.MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 1.4), -1, 1);
    look.ty = THREE.MathUtils.clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 1.4), -1, 1);
  };
  addEventListener('pointermove', onWinMove, { passive: true });
  canvas.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, last: e.clientX, t: performance.now(), moved: false, id: e.pointerId };
  });
  canvas.addEventListener('pointermove', (e) => {
    setNdc(e);
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.last;
      if (Math.abs(e.clientX - drag.x) > 6 && !drag.moved) {
        drag.moved = true;
        canvas.setPointerCapture(e.pointerId);
      }
      if (drag.moved) {
        spin += dx * 0.012;
        spinVel = dx * 0.012 * 60;
      }
      drag.last = e.clientX;
      return;
    }
    if (e.pointerType === 'mouse') {
      hovered = pick();
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
    }
  });
  const end = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const wasDrag = drag.moved;
    drag = null;
    if (wasDrag) return;
    setNdc(e);
    const hit = pick();
    if (hit) onSkill(hit.userData.skill);
    else spinVel = 9; // a tap flips the coin
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', () => (drag = null));
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
  });

  /* ---- size + loop ---- */
  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  const clock = new THREE.Timer();
  let raf = 0;
  let visible = true;
  let alive = true;
  const tmp = new THREE.Vector3();
  function frame() {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    clock.update();
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsed();
    look.x += (look.tx - look.x) * Math.min(1, dt * 4);
    look.y += (look.ty - look.y) * Math.min(1, dt * 4);
    if (!drag) {
      spin += spinVel * dt;
      spinVel *= Math.exp(-dt * 2.2);
      // settle on the nearest face once the spin slows down
      if (Math.abs(spinVel) < 1.2) {
        const target = Math.round(spin / Math.PI) * Math.PI;
        spin += (target - spin) * Math.min(1, dt * 5);
      }
    }
    coin.rotation.y = spin + look.x * 0.55 + Math.sin(t * 0.6) * 0.16;
    coin.rotation.x = look.y * 0.4 + Math.sin(t * 0.8) * 0.06;
    coin.position.y = Math.sin(t * 1.1) * 0.08;
    halo.position.y = coin.position.y * 0.5;
    orbit.rotation.y = t * 0.22 + look.x * 0.25;
    for (const sp of tags) {
      const u = sp.userData;
      sp.position.set(Math.cos(u.a) * ORBIT_R, Math.sin(t * 1.3 + u.a * 2) * 0.08, Math.sin(u.a) * ORBIT_R);
      u.hover += ((sp === hovered ? 1 : 0) - u.hover) * Math.min(1, dt * 10);
      // fade tags that pass behind the coin so the photo stays clear
      sp.getWorldPosition(tmp);
      sp.material.opacity = tmp.z < -0.4 ? 0.35 : 1;
      const s = 1 + u.hover * 0.18;
      sp.scale.set(1.45 * s, 0.36 * s, 1);
    }
    renderer.render(scene, camera);
  }

  function ready() {
    if (!alive) return;
    stage.classList.add('is-3d');
    frame();
  }
  function fail() {
    destroy();
  }
  function destroy() {
    alive = false;
    cancelAnimationFrame(raf);
    removeEventListener('pointermove', onWinMove);
    ro.disconnect();
    stage.classList.remove('is-3d');
    canvas.remove();
    renderer.dispose();
  }

  // pause when scrolled away or the tab is hidden
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) cancelAnimationFrame(raf);
    else if (stage.classList.contains('is-3d') && alive) {
      cancelAnimationFrame(raf);
      frame();
    }
  });
  io.observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (visible && alive && stage.classList.contains('is-3d')) {
      cancelAnimationFrame(raf);
      frame();
    }
  });
  canvas.addEventListener('webglcontextlost', fail);
  return { destroy };
}

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
