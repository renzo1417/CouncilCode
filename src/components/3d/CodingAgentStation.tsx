'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCouncilStore, CODER_POS } from '@/store/councilStore';
import { AgentCharacter } from './AgentCharacter';
import { CriticAgent } from '@/types/council';

const CODER_AGENT_DATA: CriticAgent = {
  id: 'agent-coder-builder',
  name: 'Coding Agent',
  role: 'logic',
  model: 'anthropic',
  deskIndex: -2,
  color: '#2563EB', // Electric Blue
  accentColor: '#60A5FA',
  avatarSeed: 'coder',
  status: 'idle',
  currentThought: 'Standing by for initial task plan and revision assignments...',
  position: [0, 0, 0.34],
  targetPosition: [0, 0, 0.34],
  rotationY: Math.PI
};

export const CodingAgentStation: React.FC = () => {
  const laptopScreenRef = useRef<THREE.Mesh>(null);
  const lampLightRef = useRef<THREE.PointLight>(null);

  const workflowState = useCouncilStore((state) => state.workflowState);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const selectedStation = useCouncilStore((state) => state.selectedStation);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);

  const isSelected = selectedStation === 'coder';
  const isPatching = workflowState === 'REVISION_IN_PROGRESS';

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (laptopScreenRef.current && isPatching) {
      const mat = laptopScreenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.85 + Math.sin(time * 14) * 0.3;
    }
    if (lampLightRef.current) {
      lampLightRef.current.intensity = isPatching ? 1.2 + Math.sin(time * 8) * 0.2 : 0.7;
    }
  });

  return (
    <group
      position={CODER_POS}
      onClick={(e) => {
        e.stopPropagation();
        selectStation('coder');
        setCodeViewMode('diff');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* =========================================================================
          1. BLONDE OAK DRAFTING DESK
      ========================================================================= */}
      {/* Tilted Drafting Surface */}
      <mesh position={[0, 0.72, 0]} rotation={[0.04, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.65, 0.05, 0.9]} />
        <meshStandardMaterial
          color={isSelected ? '#D4C4A8' : '#E5D9C5'} // Warm Blonde Oak
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Trestle Desk Legs */}
      <mesh position={[-0.72, 0.35, 0]} castShadow>
        <boxGeometry args={[0.06, 0.7, 0.75]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>
      <mesh position={[0.72, 0.35, 0]} castShadow>
        <boxGeometry args={[0.06, 0.7, 0.75]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>

      {/* =========================================================================
          2. LOW-PROFILE DEVELOPER LAPTOP (Facing Coding Agent at +Z)
      ========================================================================= */}
      <group position={[0, 0.75, -0.02]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.014, 0.28]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Keycap Matrix Detail */}
        <mesh position={[0, 0.008, -0.02]}>
          <boxGeometry args={[0.38, 0.004, 0.14]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
        <group position={[0, 0.007, -0.14]} rotation={[-0.28, 0, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.44, 0.28, 0.012]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh ref={laptopScreenRef} position={[0, 0.14, 0.008]}>
            <planeGeometry args={[0.41, 0.25]} />
            <meshStandardMaterial
              color={isPatching ? '#F59E0B' : '#2563EB'}
              emissive={isPatching ? '#F59E0B' : '#2563EB'}
              emissiveIntensity={isPatching ? 0.95 : 0.55}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          3. ARCHITECTURAL DRAFTING LAMP & PAPERS
      ========================================================================= */}
      <group position={[-0.6, 0.74, -0.25]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.06, 0.25, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 12]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} />
        </mesh>
        <mesh position={[0.16, 0.38, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.03, 0.08, 0.12, 16]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} />
        </mesh>
        <pointLight
          ref={lampLightRef}
          position={[0.2, 0.32, 0]}
          color="#FEF3C7"
          intensity={0.8}
          distance={2.0}
        />
      </group>

      {/* Paper Sketchpad & Pencil */}
      <group position={[0.52, 0.75, 0.05]} rotation={[0, -0.15, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.3, 0.01, 0.38]} />
          <meshStandardMaterial color="#FAF9F5" roughness={0.85} />
        </mesh>
        {/* Pencil */}
        <mesh position={[0.18, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.22, 8]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>
      </group>

      {/* Glazed Ceramic Espresso Mug */}
      <mesh position={[0.55, 0.77, -0.22]} castShadow>
        <cylinderGeometry args={[0.045, 0.038, 0.09, 16]} />
        <meshStandardMaterial color="#2563EB" roughness={0.3} />
      </mesh>

      {/* =========================================================================
          4. SCANDINAVIAN SWIVEL CHAIR (Tucked at z = +0.34)
      ========================================================================= */}
      <group position={[0, 0, 0.34]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.44, 0.08, 0.42]} />
          <meshStandardMaterial color="#DDD5C8" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.68, 0.19]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.44, 0.05]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.36, 16]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.03, 16]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.5} />
        </mesh>
      </group>

      {/* =========================================================================
          5. SEATED CODING AGENT CHARACTER (Facing North -Z into Laptop!)
      ========================================================================= */}
      <AgentCharacter
        agent={{
          ...CODER_AGENT_DATA,
          status: isPatching ? 'reviewing' : 'idle',
          currentThought: isPatching
            ? 'Applying verified security fix: Enforcing tenant validation and adding IDOR regression test...'
            : 'Maintaining codebase and awaiting verified revision tasks from Main Arbiter...'
        }}
        isCodingAgent
      />
    </group>
  );
};
