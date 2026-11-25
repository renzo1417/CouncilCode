'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uHover;

  attribute float aScale;
  attribute float aRandom;
  attribute float aBand;
  attribute vec3 aScatter;

  varying float vRim;
  varying float vBand;
  varying float vAlpha;
  varying float vTone;
  varying float vHoverGlow;

  void main() {
    vec3 pos = position;

    // Gentle organic atmospheric drift
    float t = uTime * 0.42;
    float wave = sin(pos.x * 2.1 + t + aRandom * 6.2831) * 0.026
               + cos(pos.y * 2.5 - t * 0.8 + aRandom * 3.1415) * 0.022;
    pos += normalize(pos + vec3(0.0001)) * wave;

    // Subtle swirl on equatorial proof band
    if (aBand > 0.5) {
      float ang = uTime * 0.22 + aRandom * 0.4;
      float cs = cos(ang * 0.25);
      float sn = sin(ang * 0.25);
      pos.xz = mat2(cs, -sn, sn, cs) * pos.xz;
    }

    // Subtle localized hover dispersion (motion.dev-inspired soft dust loosening)
    vec3 toMouse = pos - uMouse;
    float distMouse = length(toMouse);
    float hoverRadius = 0.96;
    float influence = pow(1.0 - smoothstep(0.0, hoverRadius, distMouse), 1.45) * uHover;

    if (influence > 0.001) {
      vec3 pushDir = normalize(toMouse + vec3(0.0001));
      // Delicate radial loosen + randomized dust scatter so particles disperse softly without blowing a hole
      vec3 drift = pushDir * 0.095 + aScatter * 0.145;
      float microSwirl = sin(uTime * 2.1 + aRandom * 12.566) * 0.025;
      pos += (drift + vec3(-pushDir.y, pushDir.x, 0.0) * microSwirl) * influence;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // View-space Fresnel rim lighting so sphere edge glows crisply like fine dust
    vec3 viewNormal = normalize(normalMatrix * normalize(pos + vec3(0.0001)));
    vec3 viewDir = normalize(-mvPosition.xyz);
    float ndotv = abs(dot(viewNormal, viewDir));
    float fresnel = pow(1.0 - ndotv, 1.85);

    vRim = fresnel;
    vBand = aBand;
    vTone = clamp((pos.x * 0.28 + pos.y * 0.22) + 0.5, 0.0, 1.0);
    vHoverGlow = influence;
    vAlpha = mix(0.26, 1.0, fresnel) * (0.68 + 0.32 * sin(uTime * 1.35 + aRandom * 18.0));

    float distScale = 14.2 / max(1.5, -mvPosition.z);
    float hoverSize = 1.0 + influence * 0.22;
    gl_PointSize = clamp(aScale * distScale * uPixelRatio * hoverSize, 1.2, 6.2);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying float vRim;
  varying float vBand;
  varying float vAlpha;
  varying float vTone;
  varying float vHoverGlow;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    // Crisp luminous dot core with smooth soft halo
    float strength = pow(smoothstep(0.5, 0.06, d), 1.65);

    // Rich champagne-amber / warm bronze-gold outer shell with alabaster rim
    vec3 bronzeDeep = vec3(0.54, 0.36, 0.18);
    vec3 amberGold = vec3(0.92, 0.72, 0.38);
    vec3 champagneRim = vec3(1.0, 0.96, 0.87);

    // Iridescent teal-cyan -> aurora mint -> warm champagne gradient along the Proof Gate band
    vec3 bandCyan = vec3(0.24, 0.86, 0.88);
    vec3 bandEmerald = vec3(0.32, 0.94, 0.68);
    vec3 bandGold = vec3(0.98, 0.84, 0.52);

    vec3 shellCol = mix(bronzeDeep, amberGold, smoothstep(0.08, 0.62, vRim));
    shellCol = mix(shellCol, champagneRim, smoothstep(0.55, 0.95, vRim));

    vec3 bandCol = mix(bandCyan, bandEmerald, smoothstep(0.15, 0.65, vTone));
    bandCol = mix(bandCol, bandGold, smoothstep(0.62, 0.95, vTone) * 0.65);

    vec3 col = mix(shellCol, mix(bandCol, champagneRim, 0.22), vBand);
    // Gentle warm-ivory sparkle lift on hover
    col = mix(col, champagneRim, clamp(vHoverGlow * 0.28, 0.0, 0.35));

    float alpha = strength * mix(vAlpha * 0.86, 1.0, clamp(vBand * 0.85 + vHoverGlow * 0.3, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

// Deterministic PRNG so hydration/renders are consistent and clean
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface HeroParticleSphereProps {
  reducedMotion: boolean;
  hoveredRef: React.MutableRefObject<boolean>;
}

const HeroParticleSphere: React.FC<HeroParticleSphereProps> = ({ reducedMotion, hoveredRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseLocalRef = useRef(new THREE.Vector3(0, 0, 1.2));
  const rayTargetRef = useRef(new THREE.Vector3());
  const invQuatRef = useRef(new THREE.Quaternion());
  const hoverStrengthRef = useRef(0);
  const { viewport } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const rand = mulberry32(2094773);
    const total = 14500;
    const positions = new Float32Array(total * 3);
    const scales = new Float32Array(total);
    const randoms = new Float32Array(total);
    const bands = new Float32Array(total);
    const scatters = new Float32Array(total * 3);

    const radius = 1.72;

    for (let i = 0; i < total; i++) {
      const i3 = i * 3;
      const rVal = rand();
      randoms[i] = rand();

      // Pre-computed unit-ish random scatter direction per particle for delicate dust dispersion
      const su = rand() * Math.PI * 2;
      const sv = Math.acos(2 * rand() - 1);
      const sm = 0.45 + rand() * 0.75;
      scatters[i3] = Math.sin(sv) * Math.cos(su) * sm;
      scatters[i3 + 1] = Math.cos(sv) * sm;
      scatters[i3 + 2] = Math.sin(sv) * Math.sin(su) * sm;

      if (i < total * 0.68) {
        // Primary spherical particle shell with slight organic thickness
        const u = rand();
        const v = rand();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const r = radius + (rand() - 0.5) * 0.085;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.cos(phi);
        positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        scales[i] = 0.55 + rand() * 0.75;
        bands[i] = 0.0;
      } else if (i < total * 0.90) {
        // Dense tilted luminous Proof Gate slash / band slicing cleanly through center
        const spreadX = (rand() - 0.5) * 2.55;
        const thicknessY = (rand() - 0.5) * 0.26 * (1.0 - Math.abs(spreadX) / 2.9);
        const depthZ = (rand() - 0.5) * 0.85;

        const tilt = 0.18;
        positions[i3] = spreadX;
        positions[i3 + 1] = thicknessY + spreadX * Math.sin(tilt);
        positions[i3 + 2] = depthZ;
        scales[i] = 0.65 + rand() * 0.95;
        bands[i] = 1.0;
      } else {
        // Subtle outer atmospheric stardust halo
        const u = rand();
        const v = rand();
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const r = radius + 0.12 + rVal * 0.55;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.cos(phi);
        positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        scales[i] = 0.35 + rand() * 0.45;
        bands[i] = 0.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aBand', new THREE.BufferAttribute(bands, 1));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(scatters, 3));

    const uni = {
      uTime: { value: 0 },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
      uMouse: { value: new THREE.Vector3(0, 0, 1.4) },
      uHover: { value: 0 }
    };

    return { geometry: geo, uniforms: uni };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = reducedMotion ? 1.8 : state.clock.getElapsedTime();

    const targetHover = !reducedMotion && hoveredRef.current ? 1 : 0;
    hoverStrengthRef.current = THREE.MathUtils.lerp(hoverStrengthRef.current, targetHover, 5.2 * dt);

    if (groupRef.current) {
      const targetY = reducedMotion ? -0.15 : t * 0.08 + state.pointer.x * 0.24;
      const targetX = reducedMotion ? 0.08 : -state.pointer.y * 0.16 + 0.08;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 2.8 * dt);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 2.8 * dt);

      // Project cursor onto the front surface depth of the sphere in local coordinates
      const px = state.pointer.x * viewport.width * 0.5;
      const py = state.pointer.y * viewport.height * 0.5;
      const pz = Math.sqrt(Math.max(0.25, 1.72 * 1.72 - Math.min(px * px + py * py, 2.6)));
      rayTargetRef.current.set(px, py, pz);
      invQuatRef.current.copy(groupRef.current.quaternion).invert();
      rayTargetRef.current.applyQuaternion(invQuatRef.current);
      mouseLocalRef.current.lerp(rayTargetRef.current, 9.5 * dt);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uHover.value = hoverStrengthRef.current;
      materialRef.current.uniforms.uMouse.value.copy(mouseLocalRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const HeroPrism3D: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const hoveredRef = useRef(false);

  return (
    <div
      className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] cursor-crosshair"
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.1], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <HeroParticleSphere reducedMotion={Boolean(prefersReduced)} hoveredRef={hoveredRef} />
      </Canvas>
    </div>
  );
};

export default HeroPrism3D;
