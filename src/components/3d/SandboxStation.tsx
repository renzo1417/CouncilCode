'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FloatingBadge3D } from './FloatingBadge3D';
import * as THREE from 'three';
import { useCouncilStore, SANDBOX_STATION_POS } from '@/store/councilStore';

export const SandboxStation: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);
  const statusLightRef = useRef<THREE.PointLight>(null);

  const sandboxState = useCouncilStore((state) => state.sandboxState);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const selectedStation = useCouncilStore((state) => state.selectedStation);

  const isSelected = selectedStation === 'sandbox';

  const isRunning =
    sandboxState.status === 'running' ||
    workflowState === 'SANDBOX_INITIAL' ||
    workflowState === 'SANDBOX_RECHECK';

  const isPassed =
    sandboxState.status === 'passed' ||
    workflowState === 'CRITICS_REVIEWING' ||
    workflowState === 'PROOF_VERIFICATION' ||
    workflowState === 'COUNCIL_RECHECK' ||
    workflowState === 'VERIFIED' ||
    workflowState === 'PR_READY';

  const coreColor = isRunning ? '#F59E0B' : isPassed ? '#10B981' : '#94A3B8';

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (coreRef.current) {
      if (isRunning) {
        coreRef.current.rotation.y = time * 2;
        (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.8 + Math.sin(time * 8) * 0.4;
      } else {
        coreRef.current.rotation.y = time * 0.2;
        (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isPassed ? 0.8 : 0.2;
      }
    }
    if (statusLightRef.current) {
      statusLightRef.current.intensity = isRunning ? 1.4 + Math.sin(time * 8) * 0.4 : 0.6;
    }
  });

  return (
    <group
      position={SANDBOX_STATION_POS}
      onClick={(e) => {
        e.stopPropagation();
        selectStation('sandbox');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Floating 3D Station Badge (React 19-safe) */}
      <FloatingBadge3D
        position={[0, 2.05, 0]}
        title="Sandbox Kiln"
        subtitle={isRunning ? 'Running...' : isPassed ? '4/4 Green' : '0-Token Gate'}
        dotColor={coreColor}
        isSelected={isSelected}
        statusTagBg={
          isSelected
            ? 'rgba(255, 255, 255, 0.18)'
            : isPassed
            ? 'rgba(209, 250, 229, 0.9)'
            : isRunning
            ? 'rgba(254, 243, 199, 0.9)'
            : 'rgba(231, 229, 228, 0.85)'
        }
        statusTagText={
          isSelected
            ? '#FDE68A'
            : isPassed
            ? '#065F46'
            : isRunning
            ? '#92400E'
            : '#57534E'
        }
        onClick={() => selectStation('sandbox')}
      />

      {/* =========================================================================
          1. BLONDE OAK & STONE BASE PEDESTAL
      ========================================================================= */}
      {/* Stone Foundation */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.98, 0.16, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#D4C4A8' : '#EFECE6'}
          roughness={0.6}
        />
      </mesh>
      {/* Oak Pedestal Ring */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.82, 0.14, 32]} />
        <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
      </mesh>

      {/* =========================================================================
          2. FROSTED FLUTED GLASS VERIFICATION KILN / CHAMBER
      ========================================================================= */}
      {/* Outer Fluted Cylindrical Chamber */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 1.35, 32, 1, true]} />
        <meshStandardMaterial
          color="#FAF8F5"
          transparent
          opacity={0.35}
          roughness={0.15}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Rotating Ceramic Core */}
      <mesh ref={coreRef} position={[0, 0.95, 0]} castShadow>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isPassed ? 0.8 : isRunning ? 1.0 : 0.15}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Internal Status Warm Ambient Light */}
      <pointLight
        ref={statusLightRef}
        position={[0, 0.95, 0]}
        color={coreColor}
        distance={2.8}
        intensity={0.8}
      />

      {/* Top Brushed Brass Cap & Finial */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <cylinderGeometry args={[0.64, 0.64, 0.08, 32]} />
        <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.74, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* =========================================================================
          3. MINIATURE BRASS STATUS DIALS
      ========================================================================= */}
      <group position={[0, 0.45, 0.72]} rotation={[-0.2, 0, 0]}>
        {/* Dial Plate */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.22, 0.04]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* 4 Miniature Indicator Lights (Linter, Typecheck, Build, Tests) */}
        {[-0.14, -0.045, 0.045, 0.14].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0.025]}>
            <cylinderGeometry args={[0.024, 0.024, 0.02, 16]} />
            <meshStandardMaterial
              color={isPassed ? '#10B981' : isRunning ? '#F59E0B' : '#C4B5A5'}
              emissive={isPassed ? '#10B981' : isRunning ? '#F59E0B' : '#000000'}
              emissiveIntensity={isPassed || isRunning ? 0.8 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
