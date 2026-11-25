'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';

interface Stages3DSceneProps {
  activeIdx: number;
}

// Shared Stage 2 geometry anchors so main point cloud & traveling signal packets align cleanly
const STAGE2_MODEL_A: [number, number, number] = [-1.85, 0.96, 0.15];
const STAGE2_MODEL_B: [number, number, number] = [-1.95, 0.0, -0.18];
const STAGE2_MODEL_C: [number, number, number] = [-1.85, -0.96, 0.15];
const STAGE2_GATE_X = -0.22;
const STAGE2_ARBITER: [number, number, number] = [1.45, 0.0, 0.0];

const STREAM1_CTRL: [number, number, number][] = [
  [STAGE2_MODEL_A[0] + 0.35, STAGE2_MODEL_A[1], STAGE2_MODEL_A[2]],
  [STAGE2_GATE_X - 0.4, STAGE2_MODEL_A[1] * 0.78, 0.2],
  [STAGE2_GATE_X + 0.55, 0.32, 0.08],
  [STAGE2_ARBITER[0] - 0.55, 0.14, 0]
];

const STREAM2_CTRL: [number, number, number][] = [
  [STAGE2_MODEL_B[0] + 0.35, STAGE2_MODEL_B[1], STAGE2_MODEL_B[2]],
  [STAGE2_GATE_X - 0.35, 0.04, -0.14],
  [STAGE2_GATE_X + 0.55, -0.04, -0.06],
  [STAGE2_ARBITER[0] - 0.58, -0.04, 0]
];

const STREAM3_CTRL: [number, number, number][] = [
  [STAGE2_MODEL_C[0] + 0.35, STAGE2_MODEL_C[1], STAGE2_MODEL_C[2]],
  [STAGE2_MODEL_C[0] + 0.85, STAGE2_MODEL_C[1] * 0.88, 0.14],
  [STAGE2_GATE_X - 0.45, STAGE2_MODEL_C[1] * 0.72, 0.1],
  [STAGE2_GATE_X - 0.08, STAGE2_MODEL_C[1] * 0.62, 0.06]
];

const STAGE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec4 uWeights;
  uniform vec3 uMouse;
  uniform float uHover;

  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aScatter;
  attribute float aScale;
  attribute float aRandom;
  attribute float aStreamId;
  attribute float aPathT;
  attribute float aJuryId;
  attribute float aStage3Ring;

  varying float vRim;
  varying float vScan;
  varying float vGreenPulse;
  varying float vRedPulse;
  varying float vHoverGlow;
  varying float vTone;
  varying vec3 vBaseTint;

  float wrapDist(float a, float b) {
    float d = abs(a - b);
    return min(d, 1.0 - d);
  }

  void main() {
    // GPU-interpolated morph across all 4 particle sculptures
    vec3 pos = aPos0 * uWeights.x
             + aPos1 * uWeights.y
             + aPos2 * uWeights.z
             + aPos3 * uWeights.w;

    // Gentle orbital expansion burst during stage transitions
    float settled = max(max(uWeights.x, uWeights.y), max(uWeights.z, uWeights.w));
    float transitionAmt = 1.0 - settled;
    pos += normalize(pos + vec3(0.001)) * sin(aRandom * 12.0 + uTime * 3.0) * (transitionAmt * 0.38);

    // Subtle organic breathing drift
    float t = uTime * 0.48;
    pos.x += sin(pos.y * 2.4 + t + aRandom * 6.28) * 0.016;
    pos.y += cos(pos.x * 2.4 - t + aRandom * 6.28) * 0.016;

    // Stage 0 vertical sandbox scan sweep (physical subtle radial wave + cyan-ivory glow)
    float scanY = sin(uTime * 1.15) * 1.32;
    vScan = uWeights.x * exp(-pow((pos.y - scanY) * 2.6, 2.0));
    pos.xz += normalize(pos.xz + vec2(0.001)) * vScan * 0.045;

    float greenPulse = 0.0;
    float redPulse = 0.0;

    // Stage 1: Multi-model jury traveling cyan/gold signals toward central diff core
    if (uWeights.y > 0.01 && aStreamId > 0.5 && aStreamId < 3.5) {
      float head1 = fract(uTime * 0.44 + aStreamId * 0.33);
      float d1 = wrapDist(aPathT, head1);
      float w1 = exp(-pow(d1 * 7.5, 2.0));
      greenPulse += uWeights.y * w1 * 0.85;
      pos += aScatter * (uWeights.y * w1 * 0.055);
    }

    // Stage 2: Proof Gate — visible physical pulse waves + shockwave ripples
    float gateAcceptFlare = 0.0;
    float gateRejectFlare = 0.0;
    if (uWeights.z > 0.01) {
      float phaseA = fract(uTime * 0.44);
      float phaseB = fract(uTime * 0.44 + 0.5);
      float cycC = fract(uTime * 0.52 + 0.14);

      // Stream 1 & 2: Accepted pulse waves physically swell filament particles as packets travel
      if (aStreamId > 0.5 && aStreamId < 2.5) {
        float phase = aStreamId < 1.5 ? phaseA : phaseB;
        float dAcc = wrapDist(aPathT, phase);
        float wave = exp(-pow(dAcc * 8.2, 2.0));
        greenPulse += uWeights.z * wave;
        // Physical transverse ripple wave traveling down the filament
        pos += aScatter * (uWeights.z * wave * 0.085);
      }

      // Stream 3: Rejected crimson-coral pulse travels forward, slams Proof Gate, rebounds back
      if (aStreamId > 2.5 && aStreamId < 3.5) {
        float pingPos = cycC < 0.54 ? (cycC / 0.54) : (1.0 - ((cycC - 0.54) / 0.46) * 0.88);
        float dRej = abs(aPathT - pingPos);
        float wave = exp(-pow(dRej * 7.5, 2.0));
        float impact = exp(-pow((cycC - 0.54) * 10.5, 2.0)) * smoothstep(0.6, 1.0, aPathT);
        redPulse += uWeights.z * clamp(wave + impact * 1.35, 0.0, 1.6);
        // Physical shock recoil scatter on impact
        pos += aScatter * (uWeights.z * (wave * 0.075 + impact * 0.16));
      }

      // Model C sphere (streamId 4.0) pulses subtly with warm crimson warning heartbeat
      if (aStreamId > 3.5 && aStreamId < 4.5) {
        float launch = exp(-pow(cycC * 6.5, 2.0));
        redPulse += uWeights.z * launch * 0.55;
        vec3 cNorm = normalize(pos - vec3(-1.85, -0.96, 0.15) + vec3(0.001));
        pos += cNorm * (uWeights.z * launch * 0.038);
      }

      // Arbiter Core sphere (streamId 5.0): expands physically like a heartbeat on accepted arrival
      if (aStreamId > 4.5 && aStreamId < 5.5) {
        float arrA = exp(-pow((phaseA - 0.94) * 9.0, 2.0));
        float arrB = exp(-pow((phaseB - 0.94) * 9.0, 2.0));
        float arrival = clamp(arrA + arrB, 0.0, 1.15);
        greenPulse += uWeights.z * arrival;
        vec3 coreNorm = normalize(pos - vec3(1.45, 0.0, 0.0) + vec3(0.001));
        pos += coreNorm * (uWeights.z * arrival * 0.085);
      }

      // Proof Gate Ring (streamId 6.0): pulses cyan-emerald when accepted signals pass, flashes & recoils red at bottom on reject
      if (aStreamId > 5.5) {
        float passA = exp(-pow((phaseA - 0.47) * 9.5, 2.0));
        float passB = exp(-pow((phaseB - 0.47) * 9.5, 2.0));
        float rejImpact = exp(-pow((cycC - 0.54) * 10.5, 2.0));

        float upperZone = smoothstep(-0.35, 0.65, pos.y);
        float lowerZone = smoothstep(0.1, -0.85, pos.y);

        gateAcceptFlare = clamp((passA + passB) * (0.45 + 0.55 * upperZone), 0.0, 1.0);
        gateRejectFlare = rejImpact * lowerZone;

        greenPulse += uWeights.z * gateAcceptFlare * 0.9;
        redPulse += uWeights.z * gateRejectFlare * 1.25;

        // Visible radial pulse expansion on ring
        vec3 ringOut = normalize(vec3(0.0, pos.y, pos.z) + vec3(0.001));
        pos += ringOut * (uWeights.z * (gateAcceptFlare * 0.075 + gateRejectFlare * 0.11));
        pos.x -= uWeights.z * gateRejectFlare * 0.06;
      }
    }

    // Stage 3: Subtle harmonic breathing wave on verified sphere + orbital seal
    if (uWeights.w > 0.01) {
      float haloBeat = 0.5 + 0.5 * sin(uTime * 1.6 - length(pos.xz) * 1.4);
      greenPulse += uWeights.w * haloBeat * 0.25 * aStage3Ring;
    }

    // Toned-down localized hover dispersion (soft dust loosening like motion.dev)
    vec3 toMouse = pos - uMouse;
    float distMouse = length(toMouse);
    float hoverRadius = 0.88;
    float influence = pow(1.0 - smoothstep(0.0, hoverRadius, distMouse), 1.5) * uHover;

    if (influence > 0.001) {
      vec3 pushDir = normalize(toMouse + vec3(0.0001));
      vec3 drift = pushDir * 0.095 + aScatter * 0.135;
      float microSwirl = sin(uTime * 2.0 + aRandom * 12.566) * 0.02;
      pos += (drift + vec3(-pushDir.y, pushDir.x, 0.0) * microSwirl) * influence;
    }

    // Multi-tonal rich palette per stage (warm champagne-gold, electric cyan, iris-violet, emerald-teal, crimson-coral)
    vec3 warmGold = vec3(0.92, 0.74, 0.42);
    vec3 platinum = vec3(0.90, 0.93, 0.98);
    vec3 cyanJewel = vec3(0.28, 0.84, 0.94);
    vec3 violetJewel = vec3(0.68, 0.54, 0.96);
    vec3 auroraTeal = vec3(0.22, 0.90, 0.68);
    vec3 coralRed = vec3(0.96, 0.36, 0.44);

    // Stage 0 tint: champagne-gold plates with cool platinum edge
    vec3 tint0 = mix(warmGold, platinum, clamp((pos.y + 1.2) * 0.38, 0.0, 1.0));

    // Stage 1 tint: distinct rival model colors (cyan, champagne-gold, iris-violet) + platinum diff core
    vec3 tint1 = platinum;
    if (aJuryId < 0.5) tint1 = cyanJewel;
    else if (aJuryId < 1.5) tint1 = warmGold;
    else if (aJuryId < 2.5) tint1 = violetJewel;
    else tint1 = mix(warmGold, auroraTeal, 0.45);

    // Stage 2 tint: Model A cyan, Model B champagne-gold, Model C crimson-coral, Gate platinum-champagne, Arbiter deep gold-teal
    vec3 tint2 = mix(warmGold, platinum, 0.5);
    if (aStreamId < 0.5) {
      // Model A & B spheres split cleanly by y
      tint2 = pos.y > 0.42 ? cyanJewel : warmGold;
    } else if (aStreamId < 1.5) {
      tint2 = mix(cyanJewel, auroraTeal, aPathT);
    } else if (aStreamId < 2.5) {
      tint2 = mix(warmGold, auroraTeal, aPathT);
    } else if (aStreamId < 3.5 || aStreamId < 4.5) {
      tint2 = coralRed;
    } else if (aStreamId < 5.5) {
      // Arbiter Core: warm champagne-gold with teal heart
      tint2 = mix(warmGold, auroraTeal, 0.45);
    } else {
      // Proof Gate Ring: crisp platinum-silver with faint champagne warmth
      tint2 = mix(platinum, warmGold, 0.25);
    }

    // Stage 3 tint: warm champagne-gold outer shell + aurora teal-emerald orbital verification ring
    vec3 tint3 = mix(
      mix(warmGold, auroraTeal, 0.32 + 0.28 * sin(pos.x * 1.4 + pos.y)),
      mix(cyanJewel, auroraTeal, 0.65),
      aStage3Ring
    );

    vBaseTint = tint0 * uWeights.x + tint1 * uWeights.y + tint2 * uWeights.z + tint3 * uWeights.w;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec3 viewNormal = normalize(normalMatrix * normalize(pos + vec3(0.0001)));
    vec3 viewDir = normalize(-mvPosition.xyz);
    float ndotv = abs(dot(viewNormal, viewDir));
    vRim = pow(1.0 - ndotv, 1.6);

    vGreenPulse = greenPulse;
    vRedPulse = redPulse;
    vHoverGlow = influence;
    vTone = clamp((pos.x * 0.25 + pos.y * 0.25) + 0.5, 0.0, 1.0);

    float distScale = 14.8 / max(1.5, -mvPosition.z);
    float pulseSize = 1.0 + clamp(greenPulse + redPulse, 0.0, 1.3) * 0.85 + influence * 0.24;
    gl_PointSize = clamp(aScale * distScale * uPixelRatio * pulseSize, 1.25, 7.2);
  }
`;

const STAGE_FRAGMENT_SHADER = /* glsl */ `
  varying float vRim;
  varying float vScan;
  varying float vGreenPulse;
  varying float vRedPulse;
  varying float vHoverGlow;
  varying float vTone;
  varying vec3 vBaseTint;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float strength = pow(smoothstep(0.5, 0.05, d), 1.6);

    vec3 shadowCol = vBaseTint * 0.52;
    vec3 rimCol = mix(vBaseTint, vec3(1.0, 0.97, 0.90), 0.62);
    vec3 scanCyan = vec3(0.45, 0.95, 0.96);
    vec3 acceptHot = mix(vec3(0.30, 0.98, 0.78), vec3(0.95, 1.0, 0.92), 0.55);
    vec3 rejectHot = mix(vec3(1.0, 0.30, 0.38), vec3(1.0, 0.76, 0.58), 0.45);
    vec3 hoverIvory = vec3(1.0, 0.97, 0.90);

    vec3 col = mix(shadowCol, rimCol, smoothstep(0.08, 0.88, vRim));
    col = mix(col, scanCyan, clamp(vScan * 0.85, 0.0, 0.9));
    col = mix(col, acceptHot, clamp(vGreenPulse, 0.0, 1.0));
    col = mix(col, rejectHot, clamp(vRedPulse, 0.0, 1.0));
    col = mix(col, hoverIvory, clamp(vHoverGlow * 0.28, 0.0, 0.32));

    float energy = max(max(vRim, vScan), max(max(vGreenPulse, vRedPulse), vHoverGlow * 0.35));
    float alpha = strength * mix(0.42, 1.0, clamp(energy + 0.14, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

// Dedicated physical traveling pulse packets & shockwave rings for Stage 2
const PACKET_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uStage2Weight;

  attribute float aPacketStream; // 0 = Stream 1 (accept), 1 = Stream 2 (accept), 2 = Stream 3 (reject), 3 = Gate accept shock ring, 4 = Gate reject shock ring, 5 = Arbiter arrival shock ring
  attribute float aSlot;         // 0 or 1 for staggered pulse pairs, or angle for rings
  attribute float aTrail;        // 0 = leading hot core, 0..1 = trailing comet tail
  attribute vec3 aOffset;        // local cluster spread
  attribute float aScale;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 cubicBezier(float t, vec3 p0, vec3 p1, vec3 p2, vec3 p3) {
    float u = 1.0 - t;
    float uu = u * u;
    float tt = t * t;
    return (uu * u) * p0 + (3.0 * uu * t) * p1 + (3.0 * u * tt) * p2 + (tt * t) * p3;
  }

  void main() {
    vec3 pos = vec3(0.0);
    float alpha = 0.0;
    vec3 col = vec3(1.0);
    float sizeMult = 1.0;

    if (uStage2Weight > 0.01) {
      float phaseA = fract(uTime * 0.44);
      float phaseB = fract(uTime * 0.44 + 0.5);
      float cycC = fract(uTime * 0.52 + 0.14);

      // Accepted Stream 1 traveling comet pulse packets (2 staggered pulses)
      if (aPacketStream < 0.5) {
        float head = fract(phaseA + aSlot * 0.5);
        float tPos = clamp(head - aTrail * 0.16, 0.0, 1.0);
        float visible = smoothstep(0.0, 0.07, head) * (1.0 - smoothstep(0.93, 1.0, head));
        vec3 base = cubicBezier(
          tPos,
          vec3(-1.50, 0.96, 0.15),
          vec3(-0.62, 0.7488, 0.20),
          vec3(0.33, 0.32, 0.08),
          vec3(0.90, 0.14, 0.0)
        );
        float radiusTight = mix(0.045, 0.11, aTrail);
        pos = base + aOffset * radiusTight;
        // Cyan-emerald comet with bright warm white-mint head
        col = mix(vec3(0.94, 1.0, 0.96), vec3(0.18, 0.94, 0.76), smoothstep(0.0, 0.65, aTrail));
        alpha = visible * pow(1.0 - aTrail, 1.55) * uStage2Weight;
        sizeMult = mix(1.9, 0.75, aTrail);
      }
      // Accepted Stream 2 traveling comet pulse packets (2 staggered pulses)
      else if (aPacketStream < 1.5) {
        float head = fract(phaseB + aSlot * 0.5);
        float tPos = clamp(head - aTrail * 0.16, 0.0, 1.0);
        float visible = smoothstep(0.0, 0.07, head) * (1.0 - smoothstep(0.93, 1.0, head));
        vec3 base = cubicBezier(
          tPos,
          vec3(-1.60, 0.0, -0.18),
          vec3(-0.57, 0.04, -0.14),
          vec3(0.33, -0.04, -0.06),
          vec3(0.87, -0.04, 0.0)
        );
        float radiusTight = mix(0.045, 0.11, aTrail);
        pos = base + aOffset * radiusTight;
        // Champagne-gold -> emerald-mint comet with white-gold head
        col = mix(vec3(1.0, 0.98, 0.88), vec3(0.24, 0.94, 0.66), smoothstep(0.0, 0.65, aTrail));
        alpha = visible * pow(1.0 - aTrail, 1.55) * uStage2Weight;
        sizeMult = mix(1.9, 0.75, aTrail);
      }
      // Rejected Stream 3 pulse packet: shoots from Model C -> hits Proof Gate -> deflects/scatters backward
      else if (aPacketStream < 2.5) {
        bool outbound = cycC < 0.54;
        float head = outbound ? (cycC / 0.54) : (1.0 - ((cycC - 0.54) / 0.46) * 0.88);
        float trailSign = outbound ? -1.0 : 1.0;
        float tPos = clamp(head + trailSign * aTrail * 0.15, 0.0, 1.0);
        vec3 base = cubicBezier(
          tPos,
          vec3(-1.50, -0.96, 0.15),
          vec3(-1.00, -0.8448, 0.14),
          vec3(-0.67, -0.6912, 0.10),
          vec3(-0.30, -0.5952, 0.06)
        );
        // On rebound, particles disperse wider as the rejected claim breaks apart
        float reboundScatter = outbound ? 0.0 : smoothstep(0.54, 0.86, cycC) * 0.22;
        float radiusTight = mix(0.048, 0.11, aTrail) + reboundScatter;
        pos = base + aOffset * radiusTight;
        col = mix(vec3(1.0, 0.82, 0.68), vec3(1.0, 0.24, 0.36), smoothstep(0.0, 0.55, aTrail));
        float fadeOut = outbound ? smoothstep(0.0, 0.08, cycC) : (1.0 - smoothstep(0.78, 1.0, cycC));
        alpha = fadeOut * pow(1.0 - aTrail, 1.35) * uStage2Weight;
        sizeMult = mix(1.95, 0.7, aTrail);
      }
      // Expanding red shockwave deflection ring right at the Proof Gate impact point
      else if (aPacketStream < 3.5) {
        float age = clamp((cycC - 0.52) / 0.34, 0.0, 1.0);
        float active = step(0.52, cycC) * (1.0 - step(0.86, cycC));
        float ringR = 0.06 + age * 0.48;
        float ang = aSlot * 6.2831853;
        pos = vec3(-0.24 - age * 0.10, -0.5952 + cos(ang) * ringR, 0.06 + sin(ang) * ringR) + aOffset * 0.025;
        col = mix(vec3(1.0, 0.85, 0.74), vec3(1.0, 0.26, 0.38), age);
        alpha = active * pow(1.0 - age, 1.45) * uStage2Weight;
        sizeMult = mix(1.45, 0.65, age);
      }
      // Expanding emerald-cyan ripple ring on Proof Gate when accepted signal crosses
      else if (aPacketStream < 4.5) {
        float passPhase = aTrail < 0.5 ? phaseA : phaseB;
        float cy = aTrail < 0.5 ? 0.48 : 0.0;
        float cz = aTrail < 0.5 ? 0.12 : -0.09;
        float age = clamp((passPhase - 0.45) / 0.32, 0.0, 1.0);
        float active = step(0.45, passPhase) * (1.0 - step(0.77, passPhase));
        float ringR = 0.05 + age * 0.44;
        float ang = aSlot * 6.2831853;
        pos = vec3(-0.22 + age * 0.08, cy + cos(ang) * ringR, cz + sin(ang) * ringR) + aOffset * 0.02;
        col = mix(vec3(0.92, 1.0, 0.96), vec3(0.22, 0.94, 0.78), age);
        alpha = active * pow(1.0 - age, 1.5) * uStage2Weight;
        sizeMult = mix(1.4, 0.6, age);
      }
      // Expanding concentric pulse wave around the Arbiter Core when an accepted signal lands
      else {
        float arrPhase = aTrail < 0.5 ? phaseA : phaseB;
        float wrapped = fract(arrPhase - 0.92);
        float age = clamp(wrapped / 0.34, 0.0, 1.0);
        float active = 1.0 - step(0.34, wrapped);
        float sphereR = 0.62 + age * 0.42;
        pos = vec3(1.45, 0.0, 0.0) + normalize(aOffset + vec3(0.0001)) * sphereR;
        col = mix(vec3(1.0, 0.96, 0.84), vec3(0.24, 0.95, 0.74), age);
        alpha = active * pow(1.0 - age, 1.65) * 0.85 * uStage2Weight;
        sizeMult = mix(1.35, 0.55, age);
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vColor = col;
    vAlpha = alpha;

    float distScale = 15.0 / max(1.5, -mvPosition.z);
    gl_PointSize = clamp(aScale * distScale * uPixelRatio * sizeMult, 0.0, 10.5);
  }
`;

const PACKET_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.008) discard;
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    float core = pow(smoothstep(0.5, 0.02, d), 1.45);
    gl_FragColor = vec4(vColor, core * vAlpha);
  }
`;

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

function sampleSphere(
  rand: () => number,
  cx: number,
  cy: number,
  cz: number,
  radius: number,
  shellJitter = 0.05
): [number, number, number] {
  const u = rand();
  const v = rand();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = radius + (rand() - 0.5) * shellJitter;
  return [
    cx + r * Math.sin(phi) * Math.cos(theta),
    cy + r * Math.cos(phi),
    cz + r * Math.sin(phi) * Math.sin(theta)
  ];
}

function sampleCubic(
  t: number,
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number]
): [number, number, number] {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  const uuu = uu * u;
  const ttt = tt * t;
  return [
    uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
    uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1],
    uuu * p0[2] + 3 * uu * t * p1[2] + 3 * u * tt * p2[2] + ttt * p3[2]
  ];
}

interface MorphingParticleCloudProps {
  activeIdx: number;
  reducedMotion: boolean;
  hoveredRef: React.MutableRefObject<boolean>;
}

const MorphingParticleCloud: React.FC<MorphingParticleCloudProps> = ({
  activeIdx,
  reducedMotion,
  hoveredRef
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const packetMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const weightsRef = useRef(new THREE.Vector4(1, 0, 0, 0));
  const mouseWorldRef = useRef(new THREE.Vector3(0, 0, 0.8));
  const hoverStrengthRef = useRef(0);
  const invQuatRef = useRef(new THREE.Quaternion());
  const rayTargetRef = useRef(new THREE.Vector3());
  const { viewport } = useThree();

  const { geometry, uniforms, packetGeometry, packetUniforms } = useMemo(() => {
    const rand = mulberry32(991731);
    const total = 15000;

    const p0 = new Float32Array(total * 3);
    const p1 = new Float32Array(total * 3);
    const p2 = new Float32Array(total * 3);
    const p3 = new Float32Array(total * 3);
    const scatters = new Float32Array(total * 3);
    const scales = new Float32Array(total);
    const randoms = new Float32Array(total);
    const streamIds = new Float32Array(total);
    const pathTs = new Float32Array(total);
    const juryIds = new Float32Array(total);
    const stage3Rings = new Float32Array(total);

    const plateYs = [-1.05, -0.35, 0.35, 1.05];
    const juryCenters: [number, number, number][] = [
      [-1.42, 0.78, 0.3],
      [1.42, 0.72, -0.25],
      [0.0, -1.12, 0.15]
    ];

    for (let i = 0; i < total; i++) {
      const i3 = i * 3;
      scales[i] = 0.55 + rand() * 0.78;
      randoms[i] = rand();
      streamIds[i] = 0.0;
      pathTs[i] = 0.0;
      juryIds[i] = 3.0;
      stage3Rings[i] = 0.0;

      // Random unit-ish 3D vector for delicate dust scatter & transverse filament pulse ripples
      const su = rand() * Math.PI * 2;
      const sv = Math.acos(2 * rand() - 1);
      const sm = 0.45 + rand() * 0.75;
      scatters[i3] = Math.sin(sv) * Math.cos(su) * sm;
      scatters[i3 + 1] = Math.cos(sv) * sm;
      scatters[i3 + 2] = Math.sin(sv) * Math.sin(su) * sm;

      // --- STAGE 0: 4 Layered Sandbox Discs
      {
        const layer = i % 4;
        const ang = rand() * Math.PI * 2;
        const edgeBias = Math.pow(rand(), 0.38);
        const rad = 0.35 + edgeBias * 1.28;
        p0[i3] = Math.cos(ang) * rad;
        p0[i3 + 1] = plateYs[layer] + (rand() - 0.5) * 0.055;
        p0[i3 + 2] = Math.sin(ang) * rad;
      }

      // --- STAGE 1: 3 Distinct Rival Model Spheres + Central Diff Core + Bridges
      {
        if (i < total * 0.66) {
          const cluster = i % 3;
          juryIds[i] = cluster;
          const [cx, cy, cz] = juryCenters[cluster];
          const [x, y, z] = sampleSphere(rand, cx, cy, cz, 0.58, 0.06);
          p1[i3] = x;
          p1[i3 + 1] = y;
          p1[i3 + 2] = z;
        } else if (i < total * 0.84) {
          juryIds[i] = 3.0;
          const [x, y, z] = sampleSphere(rand, 0, 0, 0, 0.44, 0.05);
          p1[i3] = x;
          p1[i3 + 1] = y;
          p1[i3 + 2] = z;
        } else {
          const branch = i % 3;
          juryIds[i] = branch;
          const t = rand();
          const [cx, cy, cz] = juryCenters[branch];
          p1[i3] = cx * (1 - t) + (rand() - 0.5) * 0.05;
          p1[i3 + 1] = cy * (1 - t) + (rand() - 0.5) * 0.05;
          p1[i3 + 2] = cz * (1 - t) + (rand() - 0.5) * 0.05;
        }
      }

      // --- STAGE 2: 3 Model Spheres -> Proof Gate Ring -> Arbiter Core + Pulsing Accept/Reject Filaments
      {
        const frac = i / total;
        if (frac < 0.14) {
          const [x, y, z] = sampleSphere(rand, STAGE2_MODEL_A[0], STAGE2_MODEL_A[1], STAGE2_MODEL_A[2], 0.38, 0.045);
          p2[i3] = x;
          p2[i3 + 1] = y;
          p2[i3 + 2] = z;
        } else if (frac < 0.28) {
          const [x, y, z] = sampleSphere(rand, STAGE2_MODEL_B[0], STAGE2_MODEL_B[1], STAGE2_MODEL_B[2], 0.38, 0.045);
          p2[i3] = x;
          p2[i3 + 1] = y;
          p2[i3 + 2] = z;
        } else if (frac < 0.42) {
          const [x, y, z] = sampleSphere(rand, STAGE2_MODEL_C[0], STAGE2_MODEL_C[1], STAGE2_MODEL_C[2], 0.38, 0.045);
          p2[i3] = x;
          p2[i3 + 1] = y;
          p2[i3 + 2] = z;
          streamIds[i] = 4.0;
        } else if (frac < 0.62) {
          const [x, y, z] = sampleSphere(rand, STAGE2_ARBITER[0], STAGE2_ARBITER[1], STAGE2_ARBITER[2], 0.62, 0.055);
          p2[i3] = x;
          p2[i3 + 1] = y;
          p2[i3 + 2] = z;
          streamIds[i] = 5.0;
        } else if (frac < 0.78) {
          const ang = rand() * Math.PI * 2;
          const r = 1.32 + (rand() - 0.5) * 0.08;
          p2[i3] = STAGE2_GATE_X + (rand() - 0.5) * 0.05;
          p2[i3 + 1] = Math.cos(ang) * r;
          p2[i3 + 2] = Math.sin(ang) * r;
          streamIds[i] = 6.0;
        } else if (frac < 0.86) {
          const t = rand();
          const [cx, cy, cz] = sampleCubic(t, STREAM1_CTRL[0], STREAM1_CTRL[1], STREAM1_CTRL[2], STREAM1_CTRL[3]);
          p2[i3] = cx + (rand() - 0.5) * 0.045;
          p2[i3 + 1] = cy + (rand() - 0.5) * 0.045;
          p2[i3 + 2] = cz + (rand() - 0.5) * 0.045;
          streamIds[i] = 1.0;
          pathTs[i] = t;
        } else if (frac < 0.94) {
          const t = rand();
          const [cx, cy, cz] = sampleCubic(t, STREAM2_CTRL[0], STREAM2_CTRL[1], STREAM2_CTRL[2], STREAM2_CTRL[3]);
          p2[i3] = cx + (rand() - 0.5) * 0.045;
          p2[i3 + 1] = cy + (rand() - 0.5) * 0.045;
          p2[i3 + 2] = cz + (rand() - 0.5) * 0.045;
          streamIds[i] = 2.0;
          pathTs[i] = t;
        } else {
          const t = rand();
          const [cx, cy, cz] = sampleCubic(t, STREAM3_CTRL[0], STREAM3_CTRL[1], STREAM3_CTRL[2], STREAM3_CTRL[3]);
          const scatter = Math.pow(t, 3.0) * 0.14;
          p2[i3] = cx + (rand() - 0.5) * (0.042 + scatter);
          p2[i3 + 1] = cy + (rand() - 0.5) * (0.042 + scatter);
          p2[i3 + 2] = cz + (rand() - 0.5) * (0.042 + scatter);
          streamIds[i] = 3.0;
          pathTs[i] = t;
        }
      }

      // --- STAGE 3: Luminous Champagne-Gold & Aurora-Teal Verified Sphere + Orbital Seal
      {
        if (i < total * 0.78) {
          const [x, y, z] = sampleSphere(rand, 0, 0, 0, 1.56, 0.05);
          p3[i3] = x;
          p3[i3 + 1] = y;
          p3[i3 + 2] = z;
          stage3Rings[i] = 0.0;
        } else {
          const ang = rand() * Math.PI * 2;
          const r = 1.92 + (rand() - 0.5) * 0.08;
          p3[i3] = Math.cos(ang) * r;
          p3[i3 + 1] = (rand() - 0.5) * 0.08 + Math.cos(ang) * 0.22;
          p3[i3 + 2] = Math.sin(ang) * r;
          stage3Rings[i] = 1.0;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(p0, 3));
    geo.setAttribute('aPos0', new THREE.BufferAttribute(p0, 3));
    geo.setAttribute('aPos1', new THREE.BufferAttribute(p1, 3));
    geo.setAttribute('aPos2', new THREE.BufferAttribute(p2, 3));
    geo.setAttribute('aPos3', new THREE.BufferAttribute(p3, 3));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(scatters, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aStreamId', new THREE.BufferAttribute(streamIds, 1));
    geo.setAttribute('aPathT', new THREE.BufferAttribute(pathTs, 1));
    geo.setAttribute('aJuryId', new THREE.BufferAttribute(juryIds, 1));
    geo.setAttribute('aStage3Ring', new THREE.BufferAttribute(stage3Rings, 1));

    const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

    const uni = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uWeights: { value: new THREE.Vector4(1, 0, 0, 0) },
      uMouse: { value: new THREE.Vector3(0, 0, 0.8) },
      uHover: { value: 0 }
    };

    // --- Secondary particle system: Visible physical traveling pulse packets + shockwave rings ---
    const pRand = mulberry32(448219);
    const packetTotal = 960;
    const pkPos = new Float32Array(packetTotal * 3);
    const pkStream = new Float32Array(packetTotal);
    const pkSlot = new Float32Array(packetTotal);
    const pkTrail = new Float32Array(packetTotal);
    const pkOffset = new Float32Array(packetTotal * 3);
    const pkScale = new Float32Array(packetTotal);

    for (let i = 0; i < packetTotal; i++) {
      const i3 = i * 3;
      const u = pRand() * Math.PI * 2;
      const v = Math.acos(2 * pRand() - 1);
      const rad = Math.pow(pRand(), 0.55);
      pkOffset[i3] = Math.sin(v) * Math.cos(u) * rad;
      pkOffset[i3 + 1] = Math.cos(v) * rad;
      pkOffset[i3 + 2] = Math.sin(v) * Math.sin(u) * rad;

      if (i < 220) {
        // Stream 1 accepted pulse comets (2 staggered packets)
        pkStream[i] = 0.0;
        pkSlot[i] = i % 2;
        pkTrail[i] = Math.pow(pRand(), 1.45);
        pkScale[i] = 0.75 + pRand() * 0.9;
      } else if (i < 440) {
        // Stream 2 accepted pulse comets (2 staggered packets)
        pkStream[i] = 1.0;
        pkSlot[i] = i % 2;
        pkTrail[i] = Math.pow(pRand(), 1.45);
        pkScale[i] = 0.75 + pRand() * 0.9;
      } else if (i < 640) {
        // Stream 3 rejected crimson-coral pulse comet
        pkStream[i] = 2.0;
        pkSlot[i] = 0.0;
        pkTrail[i] = Math.pow(pRand(), 1.4);
        pkScale[i] = 0.8 + pRand() * 0.95;
      } else if (i < 750) {
        // Expanding red impact shockwave ring at Proof Gate
        pkStream[i] = 3.0;
        pkSlot[i] = (i - 640) / 110;
        pkTrail[i] = 0.0;
        pkScale[i] = 0.7 + pRand() * 0.65;
      } else if (i < 850) {
        // Expanding accepted pass-through ripple rings on Proof Gate
        pkStream[i] = 4.0;
        pkSlot[i] = ((i - 750) % 50) / 50;
        pkTrail[i] = i < 800 ? 0.25 : 0.75;
        pkScale[i] = 0.65 + pRand() * 0.6;
      } else {
        // Expanding concentric pulse shell around Arbiter Core on signal arrival
        pkStream[i] = 5.0;
        pkSlot[i] = pRand();
        pkTrail[i] = i % 2 === 0 ? 0.25 : 0.75;
        pkScale[i] = 0.65 + pRand() * 0.6;
      }
    }

    const pkGeo = new THREE.BufferGeometry();
    pkGeo.setAttribute('position', new THREE.BufferAttribute(pkPos, 3));
    pkGeo.setAttribute('aPacketStream', new THREE.BufferAttribute(pkStream, 1));
    pkGeo.setAttribute('aSlot', new THREE.BufferAttribute(pkSlot, 1));
    pkGeo.setAttribute('aTrail', new THREE.BufferAttribute(pkTrail, 1));
    pkGeo.setAttribute('aOffset', new THREE.BufferAttribute(pkOffset, 3));
    pkGeo.setAttribute('aScale', new THREE.BufferAttribute(pkScale, 1));

    const pkUni = {
      uTime: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uStage2Weight: { value: 0 }
    };

    return {
      geometry: geo,
      uniforms: uni,
      packetGeometry: pkGeo,
      packetUniforms: pkUni
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = reducedMotion ? 1 : Math.min(1, 4.2 * dt);

    const target = new THREE.Vector4(
      activeIdx === 0 ? 1 : 0,
      activeIdx === 1 ? 1 : 0,
      activeIdx === 2 ? 1 : 0,
      activeIdx === 3 ? 1 : 0
    );

    weightsRef.current.lerp(target, speed);

    const targetHover = !reducedMotion && hoveredRef.current ? 1 : 0;
    hoverStrengthRef.current = THREE.MathUtils.lerp(hoverStrengthRef.current, targetHover, 5.2 * dt);

    const t = reducedMotion ? 1.6 : state.clock.getElapsedTime();

    if (groupRef.current) {
      const baseX = activeIdx === 0 ? 0.32 : activeIdx === 2 ? 0.08 : 0.14;
      const baseY = activeIdx === 2 ? -0.22 + Math.sin(t * 0.35) * 0.08 : t * 0.14;
      const ptrX = reducedMotion ? 0 : state.pointer.x * 0.2;
      const ptrY = reducedMotion ? 0 : -state.pointer.y * 0.14;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseY + ptrX, 3 * dt);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseX + ptrY, 3 * dt);

      // Project mouse into local sculpture space for subtle localized dust dispersion
      rayTargetRef.current.set(
        state.pointer.x * viewport.width * 0.5,
        state.pointer.y * viewport.height * 0.5,
        0.55
      );
      invQuatRef.current.copy(groupRef.current.quaternion).invert();
      rayTargetRef.current.applyQuaternion(invQuatRef.current);
      mouseWorldRef.current.lerp(rayTargetRef.current, 9.5 * dt);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uWeights.value.copy(weightsRef.current);
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uHover.value = hoverStrengthRef.current;
      materialRef.current.uniforms.uMouse.value.copy(mouseWorldRef.current);
    }

    if (packetMaterialRef.current) {
      packetMaterialRef.current.uniforms.uTime.value = t;
      packetMaterialRef.current.uniforms.uStage2Weight.value = weightsRef.current.z;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={STAGE_VERTEX_SHADER}
          fragmentShader={STAGE_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={packetGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={packetMaterialRef}
          vertexShader={PACKET_VERTEX_SHADER}
          fragmentShader={PACKET_FRAGMENT_SHADER}
          uniforms={packetUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export const Stages3DScene: React.FC<Stages3DSceneProps> = ({ activeIdx }) => {
  const prefersReduced = useReducedMotion();
  const hoveredRef = useRef(false);

  return (
    <div
      className="relative w-full h-[340px] sm:h-[400px] lg:h-[490px] cursor-crosshair"
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 5.8], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <MorphingParticleCloud
          activeIdx={activeIdx}
          reducedMotion={Boolean(prefersReduced)}
          hoveredRef={hoveredRef}
        />
      </Canvas>
    </div>
  );
};

export default Stages3DScene;
