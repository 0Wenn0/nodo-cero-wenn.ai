/**
 * NODO CERO — Fondo atmosférico en Three.js, inspirado en la estética de acuarela de GRIS.
 *
 * Capa 2.5D detrás del lienzo del archipiélago (#worldCanvas):
 *   cielo de acuarela con haces de luz → columnas lejanas → árboles de copa cuadrada
 *   y ruinas de arcos → colinas con borde de tinta → pigmento flotante.
 *
 * Cada etapa del recorrido tiene su paleta (como los capítulos de color de GRIS) y la
 * transición entre etapas es un fundido suave. El parallax sigue a la cámara del mapa.
 *
 * Degradación: si WebGL o el CDN fallan, este módulo no se activa y index.html conserva
 * su fondo de papel pintado en 2D. Con prefers-reduced-motion la escena queda casi quieta.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js';

const PALETTES = {
  observar: { // capítulo rosa / rojo
    skyTop: '#f4ddd6', skyBottom: '#fbf1ea', light: '#fff7f0', far: '#efc4bf',
    trunk: '#d65f68', canopy: '#7d9c86', ruin: '#ecdfd6', hillBack: '#b5c7ad',
    hillFront: '#88a68e', ink: '#2e2828', accent: '#c94b4b'
  },
  identificar: { // capítulo ocre / dorado
    skyTop: '#f5e4c8', skyBottom: '#fcf4e6', light: '#fff9ea', far: '#ead0a2',
    trunk: '#c4863a', canopy: '#98a66a', ruin: '#f0e4cf', hillBack: '#dcc595',
    hillFront: '#bfa36a', ink: '#3a2e22', accent: '#e0a347'
  },
  conectar: { // capítulo verde salvia
    skyTop: '#dcece3', skyBottom: '#f1f7f2', light: '#f8fffa', far: '#b9d9cc',
    trunk: '#3f8f7d', canopy: '#72ad8e', ruin: '#e2ede5', hillBack: '#9cc7ae',
    hillFront: '#5f9c81', ink: '#1f3530', accent: '#2f8f7a'
  },
  imaginar: { // capítulo azul / lavanda
    skyTop: '#cbdcf0', skyBottom: '#eef3fb', light: '#ffffff', far: '#a7c1e4',
    trunk: '#3d3b7a', canopy: '#7e90cf', ruin: '#dce6f4', hillBack: '#86a6cb',
    hillFront: '#5a77a8', ink: '#1d2340', accent: '#7c6bb8'
  },
  proyectar: { // amanecer: todos los colores reunidos
    skyTop: '#f1e3ee', skyBottom: '#fdf6ee', light: '#fffaf2', far: '#e0d0e8',
    trunk: '#c46a7c', canopy: '#6fa79a', ruin: '#f0e7e1', hillBack: '#aebfd2',
    hillFront: '#7d9dab', ink: '#272321', accent: '#d99652'
  }
};
const ROLES = Object.keys(PALETTES.observar);
const TRANSITION_SECONDS = 2.4;

// Intensidad global del movimiento: 0 = quieto, 1 = recomendado, 1.5 = más ventoso.
const WIND_INTENSITY = 1;

// Viento compartido: ráfagas que viajan de izquierda a derecha y modulan todo a la vez
// (vegetación, pétalos, luz). Devuelve ~0.25 (calma) … 1 (ráfaga).
function windAt(x, t) {
  const wave = Math.sin(x * 0.0021 - t * 0.75);
  const gust = Math.pow(0.5 + 0.5 * wave, 2);
  const slow = 0.5 + 0.5 * Math.sin(t * 0.13);
  return 0.25 + 0.75 * gust * (0.55 + 0.45 * slow);
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const NOISE_GLSL = /* glsl */`
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

// ---------------------------------------------------------------------------
// Materiales
// ---------------------------------------------------------------------------
// Pigmento de acuarela: granulación, bordes que se oscurecen y un degradado vertical
// que imita el agua acumulándose en la parte baja de cada pincelada.
function createWashMaterial(colorUniform, opts = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: {
      uColor: colorUniform,
      uOpacity: { value: opts.opacity ?? 0.9 },
      uGrain: { value: opts.grain ?? 0.22 },
      uEdge: { value: opts.edge ?? 0.35 },
      uShade: { value: opts.shade ?? 0.18 },
      uSeed: { value: opts.seed ?? 0 }
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      varying vec2 vWorld;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xy;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      uniform float uOpacity, uGrain, uEdge, uShade, uSeed;
      varying vec2 vUv;
      varying vec2 vWorld;
      ${NOISE_GLSL}
      void main() {
        vec2 p = vWorld * 0.012 + uSeed;
        float grain = fbm(p * 3.0);
        float bloom = fbm(p * 0.6 + 7.3);
        // Borde: el pigmento se acumula donde termina la pincelada (solo en geometrías con uv 0..1)
        vec2 e = min(vUv, 1.0 - vUv);
        float edgeDist = clamp(min(e.x, e.y) * 6.0, 0.0, 1.0);
        float edge = (1.0 - edgeDist) * uEdge;
        vec3 col = uColor;
        col *= 1.0 - uShade * (1.0 - vUv.y);            // agua acumulada abajo
        col *= 1.0 - edge * 0.45;                        // borde más oscuro
        col = mix(col, col * (0.86 + 0.28 * grain), uGrain);
        col = mix(col, vec3(1.0), (bloom - 0.5) * 0.10); // floraciones claras
        float a = uOpacity * (0.84 + 0.16 * bloom);
        gl_FragColor = vec4(col, a);
      }
    `
  });
}

function createSkyMaterial(u) {
  return new THREE.ShaderMaterial({
    depthWrite: false,
    depthTest: false,
    uniforms: u,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uTop, uBottom, uLight, uFar;
      uniform float uTime, uAspect;
      uniform vec2 uParallax;
      varying vec2 vUv;
      ${NOISE_GLSL}
      void main() {
        vec2 uv = vUv;
        vec2 q = vec2(uv.x * uAspect, uv.y) + uParallax * 0.15;
        vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));
        // Nubes de pigmento muy diluido que derivan lentamente
        float clouds = fbm(q * 1.6 + vec2(uTime * 0.06, uTime * 0.008));
        col = mix(col, uFar, smoothstep(0.45, 0.85, clouds) * 0.35);
        // Haces de luz diagonales desde la esquina superior izquierda
        vec2 r = vec2(uv.x * uAspect - uv.y * 0.75, uv.y);
        float shafts = 0.0;
        shafts += smoothstep(0.55, 1.0, sin(r.x * 9.0 + 1.3 + uTime * 0.05)) * 0.55;
        shafts += smoothstep(0.65, 1.0, sin(r.x * 15.0 + 4.1 - uTime * 0.03)) * 0.35;
        shafts *= smoothstep(0.15, 1.0, uv.y) * (0.6 + 0.4 * fbm(r * 3.0 + uTime * 0.08));
        shafts *= 0.72 + 0.28 * sin(uTime * 0.35) * sin(uTime * 0.21 + 1.0);
        shafts *= smoothstep(1.6, 0.2, uv.x * uAspect);
        col = mix(col, uLight, shafts * 0.45);
        // Grano de papel
        col *= 0.97 + 0.05 * noise(gl_FragCoord.xy * 0.9);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
}

function createPigmentMaterial(colorUniform) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    uniforms: { uColor: colorUniform, uTime: { value: 0 }, uPixelRatio: { value: 1 }, uTravel: { value: 0 }, uSpan: { value: 1000 } },
    vertexShader: /* glsl */`
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime, uPixelRatio, uTravel, uSpan;
      varying float vAlpha;
      varying float vAngle;
      void main() {
        vec3 p = position;
        // Viajan con el viento (los grandes, más cerca, van más rápido) y reaparecen al otro lado
        p.x = mod(p.x + uSpan + uTravel * (0.55 + aSize / 16.0) + sin(uTime * 0.35 + aPhase) * 18.0, 2.0 * uSpan) - uSpan;
        p.y += sin(uTime * 0.8 + aPhase) * 14.0 + cos(uTime * 0.27 + aPhase * 1.7) * 10.0;
        vAlpha = 0.38 + 0.37 * (0.5 + 0.5 * sin(uTime * 0.6 + aPhase * 3.0));
        vAngle = uTime * (0.6 + fract(aPhase) * 1.4) + aPhase;
        gl_PointSize = aSize * uPixelRatio;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      varying float vAlpha;
      varying float vAngle;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float cs = cos(vAngle); float sn = sin(vAngle);
        c = mat2(cs, -sn, sn, cs) * c;
        float d = length(c * vec2(1.0, 2.2)); // pétalo alargado que gira
        float a = smoothstep(0.5, 0.15, d) * vAlpha;
        gl_FragColor = vec4(uColor, a);
      }
    `
  });
}

// ---------------------------------------------------------------------------
// Geometrías
// ---------------------------------------------------------------------------
function archShape(w, h, broken, rand) {
  const colW = w * 0.22;
  const r = w / 2;
  const springY = h - r;
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(r, 0);
  s.lineTo(r, springY);
  s.absarc(0, springY, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  const inner = r - colW;
  const hole = new THREE.Path();
  hole.moveTo(-inner, 0);
  hole.lineTo(-inner, springY);
  hole.absarc(0, springY, inner, Math.PI, 0, true);
  hole.lineTo(inner, 0);
  hole.lineTo(-inner, 0);
  s.holes.push(hole);
  const geo = new THREE.ShapeGeometry(s, 24);
  if (broken) {
    // Rompe la corona del arco: aplana vértices por encima de un corte inclinado
    const pos = geo.attributes.position;
    const cut = h * (0.82 + rand() * 0.1);
    const tilt = (rand() - 0.5) * 0.5;
    for (let i = 0; i < pos.count; i++) {
      const limit = cut + pos.getX(i) * tilt;
      if (pos.getY(i) > limit) pos.setY(i, limit);
    }
  }
  normalizeUv(geo);
  return geo;
}

function normalizeUv(geo) {
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  const pos = geo.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const sx = Math.max(1e-6, b.max.x - b.min.x);
  const sy = Math.max(1e-6, b.max.y - b.min.y);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - b.min.x) / sx;
    uv[i * 2 + 1] = (pos.getY(i) - b.min.y) / sy;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

function hillProfile(x0, x1, baseY, amp, rand, step = 16) {
  const f1 = 0.0016 + rand() * 0.0012;
  const f2 = 0.004 + rand() * 0.003;
  const f3 = 0.011 + rand() * 0.006;
  const p1 = rand() * 6.28; const p2 = rand() * 6.28; const p3 = rand() * 6.28;
  const pts = [];
  for (let x = x0; x <= x1 + 0.1; x += step) {
    const y = baseY + amp * (0.62 * Math.sin(x * f1 + p1) + 0.28 * Math.sin(x * f2 + p2) + 0.06 * Math.sin(x * f3 + p3));
    pts.push(new THREE.Vector2(x, y));
  }
  return pts;
}

function hillGeometry(pts, bottomY) {
  const s = new THREE.Shape();
  s.moveTo(pts[0].x, bottomY);
  pts.forEach(p => s.lineTo(p.x, p.y));
  s.lineTo(pts[pts.length - 1].x, bottomY);
  s.lineTo(pts[0].x, bottomY);
  const geo = new THREE.ShapeGeometry(s);
  normalizeUv(geo);
  return geo;
}

// Trazo de tinta irregular siguiendo la cresta, como el borde oscuro de las colinas en GRIS
function inkRibbonGeometry(pts, rand, base = 3.2) {
  const positions = [];
  const uvs = [];
  pts.forEach((p, i) => {
    const t = base * (0.55 + 0.9 * rand());
    positions.push(p.x, p.y + 0.6, 0, p.x, p.y - t, 0);
    const u = i / (pts.length - 1);
    uvs.push(u, 1, u, 0);
  });
  const idx = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = i * 2; const b = a + 1; const c = a + 2; const d = a + 3;
    idx.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  return geo;
}

// ---------------------------------------------------------------------------
// Escena
// ---------------------------------------------------------------------------
class GrisBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = false;
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.time = 0;
    this.lastTs = 0;
    this.parallax = { x: 0, y: 0 };

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    this.renderer.setClearColor(0xf5f0e8, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);

    // Uniformes de color compartidos por rol: cambiar uno recolorea toda la capa
    const initialStage = window.NodoCeroScene?.getStage?.() || document.documentElement.dataset.stage || 'observar';
    this.stage = PALETTES[initialStage] ? initialStage : 'observar';
    this.colors = {};
    this.fromColors = {};
    this.toColors = {};
    ROLES.forEach(role => {
      const c = new THREE.Color(PALETTES[this.stage][role]);
      this.colors[role] = { value: c.clone() };
      this.fromColors[role] = c.clone();
      this.toColors[role] = c.clone();
    });
    this.transition = 1;

    this.skyUniforms = {
      uTop: this.colors.skyTop, uBottom: this.colors.skyBottom, uLight: this.colors.light,
      uFar: this.colors.far, uTime: { value: 0 }, uAspect: { value: 1 }, uParallax: { value: new THREE.Vector2() }
    };
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), createSkyMaterial(this.skyUniforms));
    sky.frustumCulled = false;
    sky.renderOrder = -100;
    this.scene.add(sky);

    this.layers = [];
    this.trees = [];
    this.canopies = [];
    this.twigs = [];
    this.disposables = [];
    this.travel = 0;
    this.resize();
    this.active = true;
  }

  // Las capas se construyen en píxeles CSS con origen en el centro de la pantalla.
  build() {
    this.layers.forEach(l => this.scene.remove(l.group));
    this.disposables.forEach(d => d.dispose());
    this.layers = [];
    this.trees = [];
    this.canopies = [];
    this.twigs = [];
    this.disposables = [];

    const { w, h } = this;
    const rand = mulberry32(20261120);
    const spanX = Math.max(w * 1.6, 1800);
    const bottom = -h / 2;
    const track = (o) => { this.disposables.push(o); return o; };

    const addLayer = (depth, order) => {
      const group = new THREE.Group();
      group.renderOrder = order;
      this.scene.add(group);
      const layer = { group, depth };
      this.layers.push(layer);
      return layer;
    };
    const mesh = (layer, geo, mat, x, y, order) => {
      const m = new THREE.Mesh(track(geo), track(mat));
      m.position.set(x, y, 0);
      m.renderOrder = order;
      layer.group.add(m);
      return m;
    };

    // 1. Columnas lejanas, altas y translúcidas (algunas rematadas en medio punto)
    const far = addLayer(0.06, 1);
    for (let x = -spanX; x < spanX; x += 70 + rand() * 120) {
      const cw = 30 + rand() * 90;
      const ch = h * (0.9 + rand() * 0.8);
      const y = bottom + ch / 2 - h * 0.05;
      const mat = createWashMaterial(this.colors.far, { opacity: 0.22 + rand() * 0.22, edge: 0.15, shade: 0.05, seed: rand() * 50 });
      mesh(far, new THREE.PlaneGeometry(cw, ch), mat, x, y, 1);
      if (rand() < 0.3) {
        const capMat = createWashMaterial(this.colors.far, { opacity: 0.3, edge: 0.1, seed: rand() * 50 });
        const cap = new THREE.CircleGeometry(cw / 2, 24, 0, Math.PI);
        normalizeUv(cap);
        mesh(far, cap, capMat, x, y + ch / 2, 1);
      }
    }

    // 2. Colina trasera
    const backHills = addLayer(0.1, 2);
    const backPts = hillProfile(-spanX - 200, spanX + 200, bottom + h * 0.26, h * 0.07, rand);
    mesh(backHills, hillGeometry(backPts, bottom - 50),
      createWashMaterial(this.colors.hillBack, { opacity: 0.75, edge: 0, shade: 0.12, seed: 3.1 }), 0, 0, 2);

    // 3. Bosque medio: troncos finos con copas cuadradas y ramitas de candelabro.
    // Cada árbol es un grupo que pivota en su base; cada copa pivota donde se une al tronco.
    const forest = addLayer(0.16, 3);
    const groundAt = (pts, x) => {
      const i = Math.max(0, Math.min(pts.length - 1, Math.round((x - pts[0].x) / 16)));
      return pts[i].y;
    };
    const local = (group, geo, mat, x, y, order) => {
      const m = new THREE.Mesh(track(geo), track(mat));
      m.position.set(x, y, 0);
      m.renderOrder = order;
      group.add(m);
      return m;
    };
    for (let x = -spanX; x < spanX; x += 130 + rand() * 200) {
      const ground = groundAt(backPts, x) - 10;
      const tree = new THREE.Group();
      tree.position.set(x, ground, 0);
      forest.group.add(tree);

      const trunkH = h * (0.35 + rand() * 0.55);
      const trunkW = 5 + rand() * 9;
      const trunkMat = createWashMaterial(this.colors.trunk, { opacity: 0.42 + rand() * 0.3, edge: 0.2, shade: 0.1, seed: rand() * 60 });
      local(tree, new THREE.PlaneGeometry(trunkW, trunkH), trunkMat, 0, trunkH / 2, 3);

      // Ramitas en L con brotes cuadrados
      const twigs = 1 + Math.floor(rand() * 3);
      for (let t = 0; t < twigs; t++) {
        const ty = trunkH * (0.25 + rand() * 0.5);
        const dir = rand() < 0.5 ? -1 : 1;
        const len = 14 + rand() * 22;
        const up = 10 + rand() * 24;
        const twigMat = createWashMaterial(this.colors.trunk, { opacity: 0.6, edge: 0, shade: 0, seed: rand() * 60 });
        const twig = new THREE.Group();
        twig.position.set(0, ty, 0);
        tree.add(twig);
        local(twig, new THREE.PlaneGeometry(len, 2), twigMat, dir * len / 2, 0, 3);
        local(twig, new THREE.PlaneGeometry(2, up), twigMat, dir * len, up / 2, 3);
        local(twig, new THREE.PlaneGeometry(5, 5), twigMat, dir * len, up + 2, 3);
        this.twigs.push({ g: twig, x, dir, phase: rand() * 6.28 });
      }

      // Copas cuadradas, a veces dos por tronco
      const canopies = rand() < 0.35 ? 2 : 1;
      for (let c = 0; c < canopies; c++) {
        const size = 40 + rand() * 80;
        const cy = trunkH * (c === 0 ? 0.92 : 0.55 + rand() * 0.15);
        const ch = size * (0.85 + rand() * 0.3);
        const cmat = createWashMaterial(this.colors.canopy, { opacity: 0.5 + rand() * 0.25, edge: 0.4, shade: 0.16, grain: 0.35, seed: rand() * 80 });
        const pivot = new THREE.Group();
        pivot.position.set(0, cy - ch * 0.35, 0);
        tree.add(pivot);
        local(pivot, new THREE.PlaneGeometry(size, ch), cmat, 0, ch * 0.35, 4);
        this.canopies.push({ g: pivot, x, phase: rand() * 6.28, flex: 0.7 + rand() * 0.6 });
      }
      this.trees.push({ g: tree, x, phase: rand() * 6.28, flex: (0.6 + rand() * 0.6) * 260 / trunkH });
    }

    // 4. Ruinas: arcos clásicos, algunos con la corona rota
    const ruins = addLayer(0.2, 5);
    const ruinCount = Math.max(3, Math.round(spanX / 520));
    for (let i = 0; i < ruinCount; i++) {
      const x = -spanX + (i + 0.5) * (2 * spanX / ruinCount) + (rand() - 0.5) * 180;
      const aw = 80 + rand() * 90;
      const ah = aw * (1.5 + rand() * 0.9);
      const ground = groundAt(backPts, x) - 18;
      const mat = createWashMaterial(this.colors.ruin, { opacity: 0.92, edge: 0.3, shade: 0.22, grain: 0.3, seed: rand() * 90 });
      mesh(ruins, archShape(aw, ah, rand() < 0.6, rand), mat, x, ground, 5);
      // Pedestal escalonado
      const stepMat = createWashMaterial(this.colors.ruin, { opacity: 0.95, edge: 0.4, shade: 0.3, seed: rand() * 90 });
      mesh(ruins, new THREE.PlaneGeometry(aw * 1.25, 12), stepMat, x, ground - 4, 5);
    }

    // 5. Colina frontal con trazo de tinta en la cresta
    const front = addLayer(0.3, 6);
    const frontPts = hillProfile(-spanX - 300, spanX + 300, bottom + h * 0.12, h * 0.06, rand, 12);
    mesh(front, hillGeometry(frontPts, bottom - 80),
      createWashMaterial(this.colors.hillFront, { opacity: 0.94, edge: 0, shade: 0.2, grain: 0.3, seed: 9.7 }), 0, 0, 6);
    mesh(front, inkRibbonGeometry(frontPts, rand, 3.6),
      createWashMaterial(this.colors.ink, { opacity: 0.82, edge: 0, shade: 0, grain: 0.4, seed: 2.2 }), 0, 0, 7);

    // 6. Pigmento flotante (pétalos de color)
    const dust = addLayer(0.4, 8);
    const count = Math.round(Math.min(220, (w * h) / 6000));
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * spanX * 2;
      pos[i * 3 + 1] = (rand() - 0.5) * h * 1.2;
      size[i] = 6 + rand() * 10;
      phase[i] = rand() * 100;
    }
    const pgeo = track(new THREE.BufferGeometry());
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pgeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    pgeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    this.pigment = track(createPigmentMaterial(this.colors.accent));
    this.pigment.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
    this.pigment.uniforms.uSpan.value = spanX;
    const points = new THREE.Points(pgeo, this.pigment);
    points.renderOrder = 8;
    points.frustumCulled = false;
    dust.group.add(points);
    this.dustLayer = dust;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    const sizeChanged = Math.abs((this.w || 0) - w) > 40 || Math.abs((this.h || 0) - h) > 40;
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.camera.left = -w / 2; this.camera.right = w / 2;
    this.camera.top = h / 2; this.camera.bottom = -h / 2;
    this.camera.updateProjectionMatrix();
    this.skyUniforms.uAspect.value = w / h;
    if (sizeChanged || !this.layers.length) {
      this.w = w; this.h = h;
      this.build();
    }
    this.render();
  }

  setStage(stage) {
    if (!PALETTES[stage] || stage === this.stage) return;
    this.stage = stage;
    ROLES.forEach(role => {
      this.fromColors[role].copy(this.colors[role].value);
      this.toColors[role].set(PALETTES[stage][role]);
    });
    this.transition = this.reducedMotion ? 0.999 : 0;
  }

  update(dt) {
    if (!this.reducedMotion) this.time += dt;

    if (this.transition < 1) {
      this.transition = Math.min(1, this.transition + dt / TRANSITION_SECONDS);
      const k = easeInOut(this.transition);
      ROLES.forEach(role => this.colors[role].value.lerpColors(this.fromColors[role], this.toColors[role], k));
    }

    // Parallax: la cámara del archipiélago desplaza cada capa según su profundidad.
    const cam = window.NodoCeroScene?.getCamera?.();
    const tx = cam ? cam.x * (cam.zoom || 1) : 0;
    const ty = cam ? cam.y * (cam.zoom || 1) : 0;
    const ease = Math.min(1, dt * 3);
    this.parallax.x += (tx - this.parallax.x) * ease;
    this.parallax.y += (ty - this.parallax.y) * ease;

    // Cámara que flota: dos senos de periodos distintos para que nunca se sienta un bucle.
    const t = this.time;
    const I = WIND_INTENSITY;
    const floatX = (Math.sin(t * Math.PI * 2 / 26) * 25 + Math.sin(t * Math.PI * 2 / 41 + 1.7) * 10) * I;
    const floatY = (Math.sin(t * Math.PI * 2 / 19 + 0.6) * 8) * I;

    this.layers.forEach(l => {
      const floatDepth = l.depth * 2.5; // al frente se mueve más que al fondo → profundidad visible
      l.group.position.x = -this.parallax.x * l.depth - floatX * floatDepth;
      l.group.position.y = this.parallax.y * l.depth * 0.4 - floatY * floatDepth;
    });
    this.skyUniforms.uParallax.value.set((this.parallax.x + floatX * 0.3) / this.w, 0);
    this.skyUniforms.uTime.value = t;

    // Vegetación mecida por el viento. Se resta la media (~0.45) para que oscile
    // alrededor de una leve inclinación, no hacia un solo lado.
    this.trees.forEach(tr => {
      const wv = windAt(tr.x, t) - 0.45;
      tr.g.rotation.z = -(wv * 0.025 + Math.sin(t * 0.9 + tr.phase) * 0.003) * tr.flex * I;
    });
    this.canopies.forEach(c => {
      const wv = windAt(c.x, t) - 0.45;
      const flutter = Math.sin(t * 2.4 + c.phase) * 0.12 * (wv + 0.6);
      c.g.rotation.z = -(wv + flutter) * 0.09 * c.flex * I;
    });
    this.twigs.forEach(tw => {
      const wv = windAt(tw.x, t) - 0.45;
      tw.g.rotation.z = -(wv * 0.06 + Math.sin(t * 3.1 + tw.phase) * 0.02) * I;
    });

    if (this.pigment) {
      const gust = windAt(0, t);
      this.travel += dt * 22 * (0.4 + gust) * I;
      this.pigment.uniforms.uTime.value = t;
      this.pigment.uniforms.uTravel.value = this.travel;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  frame(ts) {
    const dt = Math.min(0.05, (ts - this.lastTs) / 1000 || 0.016);
    this.lastTs = ts;
    this.update(dt);
    this.render();
    requestAnimationFrame(t => this.frame(t));
  }
}

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
function start() {
  const canvas = document.getElementById('grisBackground');
  if (!canvas) return;
  let bg;
  try {
    bg = new GrisBackground(canvas);
  } catch (error) {
    console.warn('[NODO CERO] Fondo Three.js no disponible; se conserva el fondo 2D.', error);
    canvas.remove();
    return;
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    bg.active = false;
    document.documentElement.classList.remove('gris-bg-active');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    bg.layers = [];
    bg.resize();
    bg.active = true;
    document.documentElement.classList.add('gris-bg-active');
  });

  window.addEventListener('resize', () => bg.resize());
  document.addEventListener('nodocero:stage', (e) => bg.setStage(e.detail?.stage));

  window.NodoGrisBackground = {
    get active() { return bg.active; },
    canvas,
    setStage: (s) => bg.setStage(s),
    // Usado por la exportación PNG: dibuja este fondo en un contexto 2D en el mismo frame
    drawInto(ctx2d, w, h) {
      bg.render();
      ctx2d.drawImage(canvas, 0, 0, w, h);
    }
  };
  document.documentElement.classList.add('gris-bg-active');
  requestAnimationFrame(t => bg.frame(t));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
