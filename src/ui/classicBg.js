import * as THREE from 'three';

/**
 * Moving 3D backdrop for the classic view: slow-floating low-poly shapes and a
 * star field that drift with scroll and lean toward the mouse.
 * Loaded lazily, skipped for reduced motion, paused when the tab is hidden.
 */
export function mountClassicBg(host) {
  const small = Math.min(innerWidth, innerHeight) < 700;
  const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'cv-3d';
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#07081a', 18, 46);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  scene.add(new THREE.AmbientLight('#8a7dff', 0.9));
  const key = new THREE.DirectionalLight('#7cf5ff', 2.2);
  key.position.set(6, 8, 10);
  const rim = new THREE.DirectionalLight('#ff6b9d', 1.6);
  rim.position.set(-8, -4, 4);
  scene.add(key, rim);

  const COLORS = ['#7c5cff', '#7cf5ff', '#ff6b9d', '#3ddc84', '#ffb547'];
  const geos = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.28, 8, 20),
    new THREE.TorusKnotGeometry(0.7, 0.22, 64, 8),
    new THREE.DodecahedronGeometry(0.9, 0),
  ];
  const shapes = [];
  const count = small ? 10 : 18;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    const color = COLORS[i % COLORS.length];
    const solid = i % 3 !== 0;
    const m = new THREE.Mesh(
      geos[i % geos.length],
      solid
        ? new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.4, flatShading: true, emissive: color, emissiveIntensity: 0.18 })
        : new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.55 }),
    );
    // keep the middle (where the text is) mostly clear
    const side = i % 2 ? 1 : -1;
    m.position.set(side * (7 + rand() * 8), (rand() - 0.5) * 34, -rand() * 16 - 2);
    m.scale.setScalar(0.5 + rand() * 1.1);
    m.userData = { spin: V3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.6), bob: rand() * Math.PI * 2, y: m.position.y };
    scene.add(m);
    shapes.push(m);
  }

  // star field
  const N = small ? 500 : 1100;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (rand() - 0.5) * 60;
    pos[i * 3 + 1] = (rand() - 0.5) * 70;
    pos[i * 3 + 2] = -rand() * 30;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#c9c3ff', size: 0.07, transparent: true, opacity: 0.8, depthWrite: false }));
  scene.add(stars);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e) => {
    mouse.tx = (e.clientX / innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const timer = new THREE.Timer();
  let raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    timer.update();
    const t = timer.getElapsed();
    const dt = Math.min(timer.getDelta(), 0.05);
    mouse.x += (mouse.tx - mouse.x) * dt * 3;
    mouse.y += (mouse.ty - mouse.y) * dt * 3;
    const scroll = scrollY / Math.max(1, innerHeight);
    camera.position.x = mouse.x * 1.2;
    camera.position.y = -scroll * 2.2 - mouse.y * 0.8;
    camera.lookAt(0, camera.position.y, 0);
    for (const m of shapes) {
      const u = m.userData;
      m.rotation.x += u.spin.x * dt;
      m.rotation.y += u.spin.y * dt;
      m.rotation.z += u.spin.z * dt;
      m.position.y = u.y + Math.sin(t * 0.5 + u.bob) * 0.6;
    }
    stars.rotation.y = t * 0.01;
    renderer.render(scene, camera);
  }
  frame();

  const onVis = () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else {
      timer.reset?.();
      frame();
    }
  };
  document.addEventListener('visibilitychange', onVis);
  requestAnimationFrame(() => canvas.classList.add('on'));
}

function V3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
