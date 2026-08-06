"use client";

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// =============================================================================
// CAMERA KEYFRAMES  —  tune these to fine-tune each stage of the sequence.
//
// Each keyframe defines:
//   pos       : camera world position       [x, y, z]
//   target    : camera lookAt point         [x, y, z]
//   modelRotY : subtle model Y-rotation     (radians)
//
// Distance-from-origin profile follows the "medium → closer → close → medium
// → medium" curve. The scroll driver smoothstep-interpolates between each
// adjacent pair.
//
// If the CAD model imported facing the wrong way, tune MODEL_INITIAL_ROTATION
// below instead of the keyframes — it's applied ONCE at load, before scaling.
// =============================================================================

type Keyframe = {
  pos: [number, number, number];
  target: [number, number, number];
  modelRotY: number;
};

// 7-keyframe choreography. Product opens at ~55% vh, enlarges to ~65% during
// engineering. Camera pos interpolated with slerp (smooth arc).
//
// COMPOSITION FLIP (engineering scene):
// The rear/internal camera pose puts the product naturally on the LEFT of
// the viewport — we lean into that. Product on LEFT, engineering copy on
// the RIGHT (editorial split-screen), not the previous product-right layout.
//
// target.x moves product LEFT via a NEGATIVE offset on stages 4→7. The
// motion is progressive: stage 4 partially shifts, stage 5 fully arrives,
// so the right side visibly CLEARS before any text fades in.
//
// target.y kept constant (0.15) across engineering so there's zero vertical
// camera motion during the exit — no upward jump toward the navbar.
const KEYFRAMES: Record<string, Keyframe> = {
  // 0.00–0.15  Opening hero. Front 3/4, product ~55% vh, heading + specs visible.
  stage1_hero:            { pos: [ 3.7,  2.1,  6.2], target: [ 0.00, 0.25, 0.0], modelRotY: 0.00 },
  // 0.15–0.32  Heading/specs fade, product enlarges, slow rotation begins.
  stage2_enlarge:         { pos: [ 3.5,  1.7,  5.6], target: [ 0.00, 0.15, 0.0], modelRotY: 0.03 },
  // 0.32–0.50  Product rotates toward the side, camera swings to the right.
  stage3_sideRotate:      { pos: [ 5.9,  1.3,  3.3], target: [ 0.00, 0.15, 0.0], modelRotY: 0.05 },
  // 0.50–0.60  Camera arrives at rear-left. target.x begins moving product LEFT.
  stage4_engineeringIn:   { pos: [-3.5,  1.7, -6.0], target: [-0.55, 0.15, 0.0], modelRotY: 0.08 },
  // 0.60–0.82  Engineering DOMINANT. target.x = -1.0 → product center ≈ 36vw,
  // right side of the viewport CLEAR for the copy block.
  stage5_engineering:     { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
  // 0.82–0.92  HOLD the final engineering composition — no motion.
  stage6_hold:            { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
  // 0.92–1.00  Graceful exit. Same pose — NO camera jump; only wrapper scale.
  stage7_exit:            { pos: [-2.5,  1.5, -5.7], target: [-1.00, 0.15, 0.0], modelRotY: 0.08 },
};

// Stage 4 ends at 0.60 so the product is FULLY at its final left position
// before any engineering copy fades in (0.62+). Guarantees zero overlap
// during the transition, not just at the final frame.
const STAGES: { key: keyof typeof KEYFRAMES; end: number }[] = [
  { key: "stage1_hero",           end: 0.15 },
  { key: "stage2_enlarge",        end: 0.32 },
  { key: "stage3_sideRotate",     end: 0.50 },
  { key: "stage4_engineeringIn",  end: 0.60 },
  { key: "stage5_engineering",    end: 0.82 },
  { key: "stage6_hold",           end: 0.92 },
  { key: "stage7_exit",           end: 1.00 },
];

const MODEL_INITIAL_ROTATION: [number, number, number] = [0, 0, 0];
const MODEL_TARGET_SIZE = 2.6;
// Compressed timeline — every scroll segment produces a visible change,
// no long stretches of empty black space.
const SCROLL_DISTANCE_PX = 3200;
const SECTION_SELECTOR = ".werner-cinematic-section";
const MODEL_URL = "/models/werner-switch.gltf";

// =============================================================================

useGLTF.preload(MODEL_URL);

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const rampIn = (p: number, s: number, e: number) => clamp01((p - s) / (e - s));
const rampOut = (p: number, s: number, e: number) => 1 - rampIn(p, s, e);

// Reusable temporaries for slerpPos — avoid per-frame allocations
const _tmpVA = new THREE.Vector3();
const _tmpVB = new THREE.Vector3();

/**
 * Spherical interpolation of a position around the world origin.
 * Direction slerps on the sphere, magnitude lerps linearly. Keeps the
 * interpolated point on a smooth arc so distance never dips below the
 * endpoints — critical for consistent product size during large orbits.
 */
function slerpPos(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  _tmpVA.set(a[0], a[1], a[2]);
  _tmpVB.set(b[0], b[1], b[2]);
  const magA = _tmpVA.length();
  const magB = _tmpVB.length();

  if (magA < 1e-4 || magB < 1e-4) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  const invA = 1 / magA;
  const invB = 1 / magB;
  const ax = _tmpVA.x * invA, ay = _tmpVA.y * invA, az = _tmpVA.z * invA;
  const bx = _tmpVB.x * invB, by = _tmpVB.y * invB, bz = _tmpVB.z * invB;
  const dot = Math.min(1, Math.max(-1, ax * bx + ay * by + az * bz));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  if (sinOmega < 1e-4) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }

  const wa = Math.sin((1 - t) * omega) / sinOmega;
  const wb = Math.sin(t * omega) / sinOmega;
  const dx = ax * wa + bx * wb;
  const dy = ay * wa + by * wb;
  const dz = az * wa + bz * wb;
  const mag = magA + (magB - magA) * t;
  // Normalize (interpolated direction has length ~1 already, but not exact)
  const dLen = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
  const scale = mag / dLen;
  return [dx * scale, dy * scale, dz * scale];
}

function getPose(p: number) {
  let fromKey: keyof typeof KEYFRAMES = STAGES[0].key;
  let spanStart = 0;
  for (let i = 0; i < STAGES.length; i++) {
    const s = STAGES[i];
    if (p <= s.end || i === STAGES.length - 1) {
      const from = KEYFRAMES[fromKey];
      const to = KEYFRAMES[s.key];
      const t = s.end === spanStart ? 1 : clamp01((p - spanStart) / (s.end - spanStart));
      const k = smooth(t);
      return {
        // Position on a sphere → distance from origin varies smoothly, never dips
        pos: slerpPos(from.pos, to.pos, k),
        // Targets are small offsets near origin — plain lerp is fine
        target: [
          lerp(from.target[0], to.target[0], k),
          lerp(from.target[1], to.target[1], k),
          lerp(from.target[2], to.target[2], k),
        ] as [number, number, number],
        modelRotY: lerp(from.modelRotY, to.modelRotY, k),
      };
    }
    fromKey = s.key;
    spanStart = s.end;
  }
  const last = KEYFRAMES[STAGES[STAGES.length - 1].key];
  return { pos: last.pos, target: last.target, modelRotY: last.modelRotY };
}

function SwitchModel({
  progressRef,
  onReady,
}: {
  progressRef: MutableRefObject<number>;
  onReady: () => void;
}) {
  const { scene } = useGLTF(MODEL_URL) as unknown as { scene: THREE.Group };
  const wrapperRef = useRef<THREE.Group>(null);
  const baseScaleRef = useRef(1);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !scene) return;

    wrapper.position.set(0, 0, 0);
    wrapper.rotation.set(0, 0, 0);
    wrapper.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.rotation.set(
      MODEL_INITIAL_ROTATION[0],
      MODEL_INITIAL_ROTATION[1],
      MODEL_INITIAL_ROTATION[2],
    );
    scene.scale.set(1, 1, 1);

    // Force the matrix chain to recompute BEFORE measuring the box.
    //
    // Box3.setFromObject reads each object's cached matrixWorld. Three.js
    // only refreshes matrixWorld during a render — useLayoutEffect runs
    // BEFORE the next frame, so without manual updates the box can be
    // measured against a stale wrapper.matrixWorld left over from a
    // previous mount (React StrictMode double-invoke, HMR, fast refresh).
    // That stale matrix can contain residual scale, making the measured
    // box huge, the computed scale tiny, and the model render at ~1% of
    // intended size on some reloads. Explicitly refresh the chain first.
    wrapper.updateMatrix();
    wrapper.matrixWorld.copy(wrapper.matrix);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_TARGET_SIZE / maxDim;

    scene.position.sub(center);
    wrapper.scale.setScalar(scale);
    baseScaleRef.current = scale;

    // Names/keywords that identify the third-party ETI brand decal baked
    // into the GLB. Any mesh (or material) matching any of these gets
    // hidden. Doesn't modify the .gltf file — pure runtime filter.
    const HIDE_PATTERNS = ["eti", "logo", "decal", "brand", "label", "watermark"];
    const shouldHide = (s: string | undefined | null) => {
      if (!s) return false;
      const lower = s.toLowerCase();
      return HIDE_PATTERNS.some((p) => lower.includes(p));
    };

    // One-time debug: list every mesh name so we can identify the ETI mesh
    // if the pattern above misses it. Remove after verifying.
    const meshNames: string[] = [];

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;

      const matArr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const matNames = matArr.map((m) => (m ? m.name : "")).filter(Boolean).join(",");
      meshNames.push(`${mesh.name || "(unnamed)"}  [mat: ${matNames || "(none)"}]`);

      // Hide by mesh name OR by material name (branding is often a separately-named material)
      if (shouldHide(mesh.name) || matArr.some((m) => shouldHide(m?.name))) {
        mesh.visible = false;
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      matArr.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        if (!std || !(std as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) return;
        if (std.metalness !== undefined && std.metalness > 0.5) {
          std.envMapIntensity = 1.4;
        } else {
          std.envMapIntensity = 0.7;
        }
        std.needsUpdate = true;
      });
    });

    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.info("[SwitchShowcase] meshes in GLB:\n" + meshNames.join("\n"));
    }

    onReady();
  }, [scene, onReady]);

  useFrame(() => {
    if (!wrapperRef.current) return;
    const p = progressRef.current;
    wrapperRef.current.rotation.y = getPose(p).modelRotY;
    // Graceful exit (0.92 → 1.00): subtle 5% scale recede. No position
    // change — product stays exactly where it is in viewport, no upward
    // jump toward the navbar.
    const handoff = rampIn(p, 0.92, 1.0);
    wrapperRef.current.scale.setScalar(baseScaleRef.current * (1 - 0.05 * handoff));
  });

  return (
    <group ref={wrapperRef}>
      <primitive object={scene} />
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const { pos, target } = getPose(0);
    camera.position.set(pos[0], pos[1], pos[2]);
    lookAt.current.set(target[0], target[1], target[2]);
    camera.lookAt(lookAt.current);
    if ((camera as THREE.PerspectiveCamera).updateProjectionMatrix) {
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }
  }, [camera]);

  useFrame(() => {
    const { pos, target } = getPose(progressRef.current);
    camera.position.set(pos[0], pos[1], pos[2]);
    lookAt.current.set(target[0], target[1], target[2]);
    camera.lookAt(lookAt.current);
  });
  return null;
}

function RearAccentLight({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (!ref.current) return;
    // Warm accent for copper/orange internals — reads with Werner's amber.
    // Starts earlier (0.32) for the side-rotation reveal, holds strong
    // through engineering (0.82).
    ref.current.intensity = lerp(0.60, 3.0, rampIn(progressRef.current, 0.32, 0.72));
  });
  return <directionalLight ref={ref} position={[0.8, 2.2, -6]} intensity={0.60} color="#ffcf9a" />;
}

export default function SwitchShowcase() {
  const progressRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector<HTMLElement>(SECTION_SELECTOR);
    if (!section) return;

    // Scope all DOM queries to inside the section so we can NEVER touch
    // any element outside the cinematic wrapper.
    const eyebrow  = section.querySelector<HTMLElement>(".features__eyebrow");
    const title    = section.querySelector<HTMLElement>(".features__title");
    const caption  = section.querySelector<HTMLElement>(".features__caption");
    // Rear-text children animate INDIVIDUALLY (staggered editorial entrance):
    // ENGINEERED → heading → paragraph
    const rearEyebrow = section.querySelector<HTMLElement>(".werner-cinematic-rear-text__eyebrow");
    const rearTitle   = section.querySelector<HTMLElement>(".werner-cinematic-rear-text__title");
    const rearBody    = section.querySelector<HTMLElement>(".werner-cinematic-rear-text__body");
    const rearChildren: (HTMLElement | null)[] = [rearEyebrow, rearTitle, rearBody];

    // Explicit progress-0 text state
    if (eyebrow) { eyebrow.style.opacity = "1"; eyebrow.style.transform = "translateX(-50%) translateY(0px)"; }
    if (title)   { title.style.opacity   = "1"; title.style.transform   = "translateX(-50%) translateY(0px)"; }
    if (caption) caption.style.opacity = "1";
    rearChildren.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });

    // Non-overlapping fades. Hero heading exits with a slight UPWARD lift so
    // the transition reads as intentional rather than passive.
    //   eyebrow      1→0  during 0.10–0.18  (translateY 0 → -10)
    //   title        1→0  during 0.15–0.28  (translateY 0 → -22)
    //   caption      1→0  during 0.20–0.32
    // Engineering copy — product fully settled on LEFT at 0.60, then text
    // fades in on the RIGHT with a 4%-scroll stagger for editorial rhythm:
    //   rearEyebrow  0→1  during 0.62–0.70  (translateY 20 → 0)
    //   rearTitle    0→1  during 0.66–0.74
    //   rearBody     0→1  during 0.70–0.78
    // All three exit together 0.94–1.00.
    const applyRearChild = (
      el: HTMLElement | null,
      inStart: number,
      inEnd: number,
      p: number,
    ) => {
      if (!el) return;
      const inK  = rampIn(p, inStart, inEnd);
      const outK = rampOut(p, 0.94, 1.00);
      el.style.opacity = String(inK * outK);
      el.style.transform = `translateY(${lerp(20, 0, inK)}px)`;
    };

    const applyText = (p: number) => {
      if (eyebrow) {
        const k = rampIn(p, 0.10, 0.18);
        eyebrow.style.opacity = String(1 - k);
        eyebrow.style.transform = `translateX(-50%) translateY(${lerp(0, -10, k)}px)`;
      }
      if (title) {
        const k = rampIn(p, 0.15, 0.28);
        title.style.opacity = String(1 - k);
        title.style.transform = `translateX(-50%) translateY(${lerp(0, -22, k)}px)`;
      }
      if (caption) caption.style.opacity = String(rampOut(p, 0.20, 0.32));
      applyRearChild(rearEyebrow, 0.62, 0.70, p);
      applyRearChild(rearTitle,   0.66, 0.74, p);
      applyRearChild(rearBody,    0.70, 0.78, p);
    };
    applyText(0);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // gsap.context() with the section as scope. Anything created inside
    // (animations, ScrollTriggers) is tracked. ctx.revert() on unmount
    // cleans up ONLY the animations created here — never touches triggers
    // owned by Animations.tsx or any other section.
    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      stRef.current = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${SCROLL_DISTANCE_PX}`,
        pin: true,
        pinSpacing: true,
        scrub: 1.0,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          applyText(self.progress);
        },
      });
    }, section);

    // Hide the site's custom cursor ring while the pointer is over this
    // section — the experience should feel cinematic, not like a 3D viewer.
    // Uses a body class so the CSS rule can target the cursor elements
    // (they're appended to <body> outside this component's DOM subtree).
    const onEnter = () => document.body.classList.add("werner-cinematic-hover");
    const onLeave = () => document.body.classList.remove("werner-cinematic-hover");
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      stRef.current = null;
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("werner-cinematic-hover");
    };
  }, []);

  // Called from SwitchModel once GLTF is loaded, centered and scaled.
  // Refresh ONLY our own trigger so measurements are correct — never touch
  // triggers owned by other components/sections.
  const handleModelReady = () => {
    requestAnimationFrame(() => {
      stRef.current?.refresh();
    });
  };

  const initialCam = KEYFRAMES.stage1_hero.pos;

  return (
    <>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [initialCam[0], initialCam[1], initialCam[2]], fov: 35, near: 0.1, far: 100 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Studio 3-point lighting — KEY from upper-LEFT-front (viewer's left),
            FILL cool from opposite, RIM warm from directly behind.
            Grazing edge kickers reveal black-plastic curvature against the
            black environment without lifting mid-tones (which would make the
            white face plate blow out). */}
        <ambientLight intensity={0.10} />

        {/* KEY — soft warm, upper-LEFT-front */}
        <directionalLight
          position={[-4, 6, 5]}
          intensity={1.9}
          color="#fff1d8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* FILL — cool, opposite side, keeps shadow side moody but readable */}
        <directionalLight position={[5, 2, 3.5]} intensity={0.7} color="#c9d9ff" />

        {/* RIM — cool white from directly behind. BOOSTED so the black
            housing silhouette reads clearly against the black environment. */}
        <directionalLight position={[0, 3, -6]} intensity={2.0} color="#e6ecff" />

        {/* Grazing edge kickers — near-horizontal, opposite sides.
            Reveal the curvature of the black plastic without lifting mid-tones. */}
        <directionalLight position={[ 6.5, 0.3, -1.5]} intensity={1.2} color="#ffd0a0" />
        <directionalLight position={[-6.5, 0.3, -1.5]} intensity={1.2} color="#b0c8ff" />

        <Suspense fallback={null}>
          <SwitchModel progressRef={progressRef} onReady={handleModelReady} />
          <RearAccentLight progressRef={progressRef} />
          {/* Soft contact shadow directly beneath the model — grounds it */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={5}
            blur={2.6}
            far={3.5}
            resolution={512}
            color="#000000"
          />
          {/* Reflections only — never a background */}
          <Environment preset="studio" background={false} environmentIntensity={0.55} />
        </Suspense>

        <CameraRig progressRef={progressRef} />
      </Canvas>
    </>
  );
}
