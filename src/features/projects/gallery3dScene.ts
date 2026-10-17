import * as THREE from 'three';
import { animate, type AnimationPlaybackControls } from 'framer-motion';

// Three.js scene behind the "View All" gallery: every project screenshot is a
// glowing panel on a slowly turning carousel. Drag to spin it (with inertia),
// scroll or pinch to zoom, click a panel to bring it to the front. Per-panel
// transitions are Framer Motion springs on plain state objects, applied to the
// meshes each frame.

export interface GalleryScene {
  /** Bring a screenshot to the front, or pass `null` to return to the carousel. */
  focus: (index: number | null) => void;
  /** Index of the screenshot currently facing the viewer. */
  frontIndex: () => number;
  dispose: () => void;
}

interface GalleryOptions {
  images: string[];
  reducedMotion: boolean;
  onReady: () => void;
  /** A panel was clicked (its index), or empty space was clicked (`null`). */
  onSelect: (index: number | null) => void;
}

interface PanelState {
  lift: number; // pushed out from the carousel toward the viewer
  scale: number;
  opacity: number;
  glow: number;
  level: number; // 0 = floating at its own height and lean, 1 = upright in the focused spot
}

interface Panel {
  index: number;
  angle: number;
  body: THREE.Group;
  screen: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
  frame: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
  back: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>;
  glow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  width: number;
  height: number;
  baseY: number;
  tilt: number;
  focusY: number; // height it settles at when focused
  phase: number;
  state: PanelState;
  tween?: AnimationPlaybackControls;
}

const PANEL_WIDTH = 3.4;
const CORNER = 0.16;
const BORDER = 0.035;
const GLOW_MARGIN = 0.7;
const FOV = 40;
const FOG_COLOR = 0x0f0f11;
const REST: PanelState = { lift: 0, scale: 1, opacity: 1, glow: 0.45, level: 0 };
const HOVER: Partial<PanelState> = { lift: 0.35, scale: 1.04, glow: 0.95 };

const roundedShape = (w: number, h: number, r: number) => {
  const x = -w / 2;
  const y = -h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
};

// ShapeGeometry's UVs are in shape units; remap them to 0..1 so a texture
// covers the rounded rectangle exactly.
const roundedGeometry = (w: number, h: number, r: number) => {
  const geometry = new THREE.ShapeGeometry(roundedShape(w, h, r), 8);
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, position.getX(i) / w + 0.5, position.getY(i) / h + 0.5);
  }
  return geometry;
};

// Soft halo drawn once per panel size: a blurred gold outline that sits just
// behind the screen and is added on top of the scene (a cheap stand-in for bloom).
const glowTexture = (w: number, h: number, color: THREE.Color) => {
  const canvas = document.createElement('canvas');
  const pxPerUnit = 512 / (w + GLOW_MARGIN * 2);
  canvas.width = 512;
  canvas.height = Math.round((h + GLOW_MARGIN * 2) * pxPerUnit);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const hex = `#${color.getHexString()}`;
    ctx.shadowColor = hex;
    ctx.shadowBlur = 40;
    ctx.strokeStyle = hex;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(
      GLOW_MARGIN * pxPerUnit,
      GLOW_MARGIN * pxPerUnit,
      w * pxPerUnit,
      h * pxPerUnit,
      CORNER * pxPerUnit
    );
    ctx.stroke();
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

// The site's gold, read from the theme so the scene follows it.
const themeGold = () => {
  const hsl = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
  const [h, s, l] = hsl.split(/\s+/);
  return new THREE.Color(hsl ? `hsl(${h}, ${s}, ${l})` : '#c49a45');
};

export const createGalleryScene = (
  container: HTMLElement,
  { images, reducedMotion, onReady, onSelect }: GalleryOptions
): GalleryScene => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  const tilt = new THREE.Group(); // up/down drag
  const carousel = new THREE.Group(); // left/right drag
  tilt.add(carousel);
  scene.add(tilt);

  const gold = themeGold();
  const panels: Panel[] = [];
  const glowTextures = new Map<string, THREE.CanvasTexture>();
  const loaded = new Map<number, THREE.Texture>();
  let radius = 6;
  let baseDistance = 9; // camera to the front of the carousel, before zoom
  let focused: number | null = null;
  let hovered: number | null = null;
  let disposed = false;

  // Current view eases toward the target every frame.
  const view = { rotY: 0, rotX: 0.06, zoom: 1 };
  const target = { rotY: 0, rotX: 0.06, zoom: 1 };
  let spin = 0; // inertia after a drag, radians per frame
  let lastInteraction = performance.now();

  const springTo = (panel: Panel, to: Partial<PanelState>) => {
    panel.tween?.stop();
    panel.tween = animate(
      panel.state,
      to,
      reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 19, mass: 0.9 }
    );
  };

  const restOf = (panel: Panel): Partial<PanelState> =>
    panel.index === hovered && focused === null ? { ...REST, ...HOVER } : REST;

  const nearestRotation = (angle: number) => {
    const turn = Math.PI * 2;
    return -angle + turn * Math.round((target.rotY + angle) / turn);
  };

  const focus = (index: number | null) => {
    const panel = panels.find((p) => p.index === index);
    focused = panel ? index : null;
    if (!panel) {
      panels.forEach((p) => springTo(p, restOf(p)));
      return;
    }

    // Swing the carousel so the panel faces the viewer, then pull it forward
    // and size it to fill most of the screen while the others fade back.
    spin = 0;
    target.rotY = nearestRotation(panel.angle);
    target.rotX = 0.02;
    const distance = baseDistance * target.zoom;
    const finalDistance = distance * 0.62;
    const visibleHeight = 2 * finalDistance * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const visibleWidth = visibleHeight * camera.aspect;
    const scale = Math.min((visibleWidth * 0.82) / panel.width, (visibleHeight * 0.55) / panel.height);
    // Sit a touch above centre, clear of the caption bar at the bottom.
    panel.focusY = visibleHeight * 0.05;

    panels.forEach((p) =>
      springTo(
        p,
        p === panel
          ? { lift: distance - finalDistance, scale, opacity: 1, glow: 1, level: 1 }
          : { lift: 0, scale: 1, opacity: 0.22, glow: 0.08, level: 0 }
      )
    );
  };

  const frontIndex = () => {
    if (!panels.length) return 0;
    const step = (Math.PI * 2) / panels.length;
    const slot = Math.round(-view.rotY / step);
    return panels[((slot % panels.length) + panels.length) % panels.length].index;
  };

  const layout = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Keep the front panel comfortably inside narrow (phone) screens.
    const fit = (PANEL_WIDTH / 0.8) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * camera.aspect);
    baseDistance = Math.max(9, fit);
    scene.fog = new THREE.Fog(FOG_COLOR, baseDistance - 1, baseDistance + radius * 2 + 2);
  };

  const buildPanels = () => {
    const entries = images.map((_, i) => i).filter((i) => loaded.has(i));
    radius = Math.max(6, (entries.length * (PANEL_WIDTH + 1)) / (Math.PI * 2));

    entries.forEach((index, slot) => {
      const texture = loaded.get(index)!;
      const image = texture.image as { width: number; height: number };
      const width = PANEL_WIDTH;
      const height = width * (image.height / image.width);

      const screen = new THREE.Mesh(
        roundedGeometry(width, height, CORNER),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      );
      screen.userData.index = index;

      const frameShape = roundedShape(width + BORDER * 2, height + BORDER * 2, CORNER + BORDER);
      frameShape.holes.push(roundedShape(width, height, CORNER));
      const frame = new THREE.Mesh(
        new THREE.ShapeGeometry(frameShape, 8),
        new THREE.MeshBasicMaterial({ color: gold, transparent: true, side: THREE.DoubleSide })
      );

      // Seen from behind (the far side of the carousel), a panel is a dark slab.
      const back = new THREE.Mesh(
        roundedGeometry(width + BORDER * 2, height + BORDER * 2, CORNER + BORDER),
        new THREE.MeshBasicMaterial({ color: 0x18181b, transparent: true })
      );
      back.rotation.y = Math.PI;
      back.position.z = -0.01;

      const key = `${width.toFixed(2)}x${height.toFixed(2)}`;
      if (!glowTextures.has(key)) glowTextures.set(key, glowTexture(width, height, gold));
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(width + GLOW_MARGIN * 2, height + GLOW_MARGIN * 2),
        new THREE.MeshBasicMaterial({
          map: glowTextures.get(key),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        })
      );
      glow.position.z = -0.03;

      const body = new THREE.Group();
      body.add(glow, back, screen, frame);
      const angle = (slot / entries.length) * Math.PI * 2;
      const pivot = new THREE.Group();
      pivot.rotation.y = angle;
      pivot.add(body);
      carousel.add(pivot);

      // Staggered heights and a slight lean, so the ring reads as floating screens.
      const baseY = Math.sin(slot * 2.4) * 0.95;
      const tilt = Math.sin(slot * 1.7) * 0.025;
      panels.push({
        index,
        angle,
        body,
        screen,
        frame,
        back,
        glow,
        width,
        height,
        baseY,
        tilt,
        focusY: 0,
        phase: slot * 1.3,
        state: { ...REST },
      });
    });

    layout();
  };

  // --- Pointer input: drag to spin, pinch or wheel to zoom, click to select ---
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointers = new Map<number, { x: number; y: number }>();
  let dragging = false;
  let moved = 0;
  let pinchGap = 0;
  let pinchZoom = 1;

  const pick = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(
      panels.map((p) => p.screen),
      false
    )[0];
    return hit ? (hit.object.userData.index as number) : null;
  };

  const gap = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const setHovered = (index: number | null) => {
    if (index === hovered) return;
    const previous = panels.find((p) => p.index === hovered);
    hovered = index;
    canvas.style.cursor = index === null ? 'grab' : 'pointer';
    if (focused !== null) return;
    if (previous) springTo(previous, REST);
    const next = panels.find((p) => p.index === index);
    if (next) springTo(next, { ...REST, ...HOVER });
  };

  const onPointerDown = (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lastInteraction = performance.now();
    spin = 0;
    moved = 0;
    if (pointers.size === 2) {
      dragging = false;
      pinchGap = gap();
      pinchZoom = target.zoom;
    } else {
      dragging = true;
      canvas.style.cursor = 'grabbing';
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    const last = pointers.get(e.pointerId);
    if (!last) {
      if (e.pointerType !== 'touch') setHovered(pick(e.clientX, e.clientY));
      return;
    }
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lastInteraction = performance.now();

    if (pointers.size === 2 && pinchGap > 0) {
      target.zoom = THREE.MathUtils.clamp((pinchZoom * pinchGap) / gap(), 0.7, 1.6);
      return;
    }
    if (!dragging) return;
    moved += Math.abs(dx) + Math.abs(dy);
    target.rotY += dx * 0.006;
    target.rotX = THREE.MathUtils.clamp(target.rotX + dy * 0.003, -0.35, 0.35);
    spin = dx * 0.006;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!pointers.delete(e.pointerId)) return;
    if (pointers.size > 0) return;
    const wasClick = e.type === 'pointerup' && dragging && moved < 6;
    dragging = false;
    canvas.style.cursor = hovered === null ? 'grab' : 'pointer';
    lastInteraction = performance.now();
    if (wasClick) {
      spin = 0;
      onSelect(pick(e.clientX, e.clientY));
    }
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    target.zoom = THREE.MathUtils.clamp(target.zoom * (1 + e.deltaY * 0.001), 0.7, 1.6);
    lastInteraction = performance.now();
  };

  const onPointerLeave = () => {
    if (!dragging) setHovered(null);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  const observer = new ResizeObserver(layout);
  observer.observe(container);
  layout();

  // --- Render loop ---
  let frame = 0;
  let previous = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;

    if (!dragging) {
      if (Math.abs(spin) > 0.00005) {
        target.rotY += spin;
        spin *= Math.pow(0.94, dt * 60);
      } else if (focused === null && !reducedMotion && now - lastInteraction > 2500) {
        target.rotY += dt * 0.12; // idle drift
      }
    }

    const ease = 1 - Math.pow(0.001, dt);
    view.rotY += (target.rotY - view.rotY) * ease;
    view.rotX += (target.rotX - view.rotX) * ease;
    view.zoom += (target.zoom - view.zoom) * ease;
    carousel.rotation.y = view.rotY;
    tilt.rotation.x = view.rotX;
    camera.position.set(0, 0.3, radius + baseDistance * view.zoom);
    camera.lookAt(0, 0, 0);

    const t = now / 1000;
    for (const panel of panels) {
      const { state, body } = panel;
      const bob = reducedMotion ? 0 : Math.sin(t * 0.7 + panel.phase) * 0.12 * (1 - state.level);
      // `level` blends from the panel's floating height and lean to its focused pose.
      body.position.set(
        0,
        panel.baseY * (1 - state.level) + panel.focusY * state.level + bob,
        radius + state.lift
      );
      body.rotation.z = panel.tilt * (1 - state.level);
      body.scale.setScalar(state.scale);
      panel.screen.material.opacity = state.opacity;
      panel.back.material.opacity = state.opacity;
      panel.frame.material.opacity = state.opacity * 0.9;
      panel.glow.material.opacity = state.glow * state.opacity;
    }

    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  // --- Textures ---
  const loader = new THREE.TextureLoader();
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  Promise.allSettled(
    images.map((src, index) =>
      loader.loadAsync(src).then((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
        loaded.set(index, texture);
      })
    )
  ).then(() => {
    if (disposed) {
      loaded.forEach((texture) => texture.dispose());
      return;
    }
    buildPanels();
    onReady();
  });

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerLeave);
    canvas.removeEventListener('wheel', onWheel);
    panels.forEach((p) => p.tween?.stop());
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
      if (!mesh.isMesh) return;
      mesh.geometry.dispose();
      mesh.material.map?.dispose();
      mesh.material.dispose();
    });
    renderer.dispose();
    canvas.remove();
  };

  return { focus, frontIndex, dispose };
};
