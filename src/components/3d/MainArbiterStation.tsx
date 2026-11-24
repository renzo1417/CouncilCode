'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCouncilStore, ARBITER_POS } from '@/store/councilStore';
import { AgentCharacter } from './AgentCharacter';
import { CriticAgent } from '@/types/council';

const MAIN_AGENT_DATA: CriticAgent = {
  id: 'agent-main-arbiter',
  name: 'Main Arbiter',
  role: 'logic',
  model: 'anthropic',
  deskIndex: -1,
  color: '#312E81', // Royal Deep Indigo
  accentColor: '#F59E0B', // Gold
  avatarSeed: 'arbiter',
  status: 'idle',
  currentThought: 'Governing verification pipeline, reconciling findings, and preparing verified PR...',
  position: [0, 0, -1.25],
  targetPosition: [0, 0, -1.25],
  rotationY: 0
};

export const MainArbiterStation: React.FC = () => {
  const brassRingRef = useRef<THREE.Mesh>(null);
  const statusGazeRef = useRef<THREE.PointLight>(null);
  const arbiterLaptopScreenRef = useRef<THREE.Mesh>(null);

  const workflowState = useCouncilStore((state) => state.workflowState);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const selectedStation = useCouncilStore((state) => state.selectedStation);

  const isSelected = selectedStation === 'arbiter';
  const isArbitrating = workflowState === 'MAIN_AGENT_ARBITRATION';
  const isVerified = workflowState === 'VERIFIED' || workflowState === 'PR_READY';

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (brassRingRef.current && isArbitrating) {
      brassRingRef.current.rotation.z = time * 0.3;
    }
    if (statusGazeRef.current) {
      statusGazeRef.current.intensity = isArbitrating ? 1.1 + Math.sin(time * 6) * 0.3 : 0.5;
    }
    if (arbiterLaptopScreenRef.current && isArbitrating) {
      const mat = arbiterLaptopScreenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.85 + Math.sin(time * 10) * 0.25;
    }
  });

  const screenColor = isVerified ? '#10B981' : isArbitrating ? '#F59E0B' : '#6366F1';

  return (
    <group
      position={ARBITER_POS}
      onClick={(e) => {
        e.stopPropagation();
        selectStation('arbiter');
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
          1. CIRCULAR BLONDE OAK ROUND TABLE
      ========================================================================= */}
      {/* Central Solid Oak Cylinder Base */}
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.46, 0.68, 32]} />
        <meshStandardMaterial color="#CBBBA4" roughness={0.45} />
      </mesh>

      {/* Main Circular Table Top (Calibrated radius 1.15) */}
      <mesh position={[0, 0.70, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.06, 48]} />
        <meshStandardMaterial
          color={isSelected ? '#D4C4A8' : '#E5D9C5'} // Warm Blonde Oak
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Inlaid Circular Brass Ring on Table Surface */}
      <mesh ref={brassRingRef} position={[0, 0.732, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.82, 0.88, 48]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.85}
          roughness={0.25}
          emissive={isArbitrating ? '#F59E0B' : '#000000'}
          emissiveIntensity={isArbitrating ? 0.6 : 0}
        />
      </mesh>

      {/* =========================================================================
          2. EXECUTIVE COMMAND LAPTOP FOR MAIN ARBITER (Facing North -Z toward Arbiter!)
      ========================================================================= */}
      <group position={[0, 0.735, -0.78]} rotation={[0, Math.PI, 0]}>
        {/* Keyboard Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.015, 0.30]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Keycap Detail */}
        <mesh position={[0, 0.009, -0.02]}>
          <boxGeometry args={[0.38, 0.004, 0.14]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        {/* Screen Lid angled back so active display faces the Arbiter */}
        <group position={[0, 0.008, -0.15]} rotation={[-0.3, 0, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.46, 0.28, 0.012]} />
            <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Brass Trim Accent on Back of Arbiter Laptop */}
          <mesh position={[0, 0.14, -0.007]}>
            <planeGeometry args={[0.14, 0.03]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Active Screen Glass Facing Arbiter */}
          <mesh ref={arbiterLaptopScreenRef} position={[0, 0.14, 0.008]}>
            <planeGeometry args={[0.42, 0.24]} />
            <meshStandardMaterial
              color={screenColor}
              emissive={screenColor}
              emissiveIntensity={0.75}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Central Ceramic Succulent Bowl */}
      <mesh position={[0, 0.76, 0.05]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.08, 24]} />
        <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.81, 0.05]} castShadow>
        <sphereGeometry args={[0.12, 14, 14]} />
        <meshStandardMaterial color="#4E7D63" roughness={0.7} />
      </mesh>

      {/* Architectural Paper Code Review Documents beside Arbiter Laptop */}
      <group position={[-0.52, 0.735, -0.58]} rotation={[0, 0.25, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.34, 0.005, 0.26]} />
          <meshStandardMaterial color="#FAF9F5" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.52, 0.735, -0.58]} rotation={[0, -0.25, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.34, 0.005, 0.26]} />
          <meshStandardMaterial color="#FAF9F5" roughness={0.9} />
        </mesh>
      </group>

      {/* Soft Task Warm Spotlight for Table */}
      <pointLight
        ref={statusGazeRef}
        position={[0, 1.8, 0]}
        color="#FEF3C7"
        intensity={0.6}
        distance={3.5}
      />

      {/* =========================================================================
          3. SCANDINAVIAN EXECUTIVE OAK & LINEN ARMCHAIR (At z = -1.25 facing South +Z)
      ========================================================================= */}
      <group position={[0, 0, -1.25]}>
        {/* Linen Fabric Cushion */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[0.52, 0.09, 0.48]} />
          <meshStandardMaterial color="#DDD5C8" roughness={0.8} />
        </mesh>
        {/* Curved High Oak Backrest (Behind Arbiter at -Z) */}
        <mesh position={[0, 0.78, -0.22]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.50, 0.62, 0.06]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.27, 0.60, 0]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.38]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        <mesh position={[0.27, 0.60, 0]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.38]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        {/* Headrest Pillow */}
        <mesh position={[0, 1.12, -0.24]} castShadow>
          <boxGeometry args={[0.32, 0.14, 0.05]} />
          <meshStandardMaterial color="#312E81" roughness={0.7} />
        </mesh>
        {/* Pedestal Base */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.36, 16]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.03, 16]} />
          <meshStandardMaterial color="#5C4D3C" roughness={0.5} />
        </mesh>
      </group>

      {/* =========================================================================
          4. MAIN ARBITER CHARACTER (Seated at Round Table Facing South +Z into Laptop!)
      ========================================================================= */}
      <AgentCharacter
        agent={{
          ...MAIN_AGENT_DATA,
          status:
            workflowState === 'MAIN_AGENT_ARBITRATION'
              ? 'reviewing'
              : workflowState === 'VERIFIED' || workflowState === 'PR_READY'
              ? 'celebrating'
              : 'idle'
        }}
        isMainAgent
      />
    </group>
  );
};
