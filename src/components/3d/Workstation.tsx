'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FloatingBadge3D } from './FloatingBadge3D';
import * as THREE from 'three';
import { CriticAgent } from '@/types/council';
import { useCouncilStore } from '@/store/councilStore';

interface WorkstationProps {
  deskIndex: number;
  position: [number, number, number];
  assignedAgent?: CriticAgent;
}

export const Workstation: React.FC<WorkstationProps> = ({
  deskIndex,
  position,
  assignedAgent
}) => {
  const laptopScreenRef = useRef<THREE.Mesh>(null);
  const lampLightRef = useRef<THREE.PointLight>(null);

  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);
  const critics = useCouncilStore((state) => state.critics);

  const occupiedDesks = new Set(critics.map((c) => c.deskIndex));
  const nextVacantDesk = [0, 1, 2, 3, 4, 5].find((idx) => !occupiedDesks.has(idx));

  const isSelected = assignedAgent && selectedAgentId === assignedAgent.id;

  // Screen glow color based on agent and status
  const screenColor = assignedAgent
    ? assignedAgent.status === 'found_issue'
      ? '#EF4444'
      : assignedAgent.status === 'reviewing' || assignedAgent.status === 'submitting'
      ? assignedAgent.accentColor
      : assignedAgent.status === 'approved' || assignedAgent.status === 'celebrating'
      ? '#10B981'
      : '#F59E0B'
    : '#E2E8F0';

  const isReviewing = assignedAgent?.status === 'reviewing' || assignedAgent?.status === 'submitting';

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isReviewing && laptopScreenRef.current) {
      const flicker = 0.75 + Math.sin(time * 8 + deskIndex) * 0.25;
      (laptopScreenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (assignedAgent) {
          selectAgent(assignedAgent.id);
        } else {
          setAddCriticOpen(true);
        }
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
          1. CURVED BLONDE OAK WORKSTATION DESK
      ========================================================================= */}
      {/* Curved Oak Desktop */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.85]} />
        <meshStandardMaterial
          color={isSelected ? '#D4C4A8' : '#E5D9C5'} // Warm Blonde Oak
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Rounded Wooden Legs */}
      <mesh position={[-0.66, 0.34, -0.32]} castShadow>
        <cylinderGeometry args={[0.03, 0.024, 0.68, 16]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>
      <mesh position={[0.66, 0.34, -0.32]} castShadow>
        <cylinderGeometry args={[0.03, 0.024, 0.68, 16]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>
      <mesh position={[-0.66, 0.34, 0.32]} castShadow>
        <cylinderGeometry args={[0.03, 0.024, 0.68, 16]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>
      <mesh position={[0.66, 0.34, 0.32]} castShadow>
        <cylinderGeometry args={[0.03, 0.024, 0.68, 16]} />
        <meshStandardMaterial color="#BDB09B" roughness={0.5} />
      </mesh>

      {/* Wool Desk Blotter / Felt Mat */}
      <mesh position={[0, 0.706, 0.02]} receiveShadow>
        <boxGeometry args={[0.9, 0.005, 0.52]} />
        <meshStandardMaterial color="#DDD5C8" roughness={0.9} />
      </mesh>

      {/* =========================================================================
          2. LOW-PROFILE TACTILE LAPTOP (Positioned so seated worker faces screen!)
      ========================================================================= */}
      <group position={[0, 0.71, -0.02]}>
        {/* Laptop Keyboard Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.014, 0.28]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Keycap Matrix Detail */}
        <mesh position={[0, 0.008, -0.02]}>
          <boxGeometry args={[0.36, 0.004, 0.14]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.008, 0.09]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 0.07]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.2} />
        </mesh>

        {/* Laptop Screen Lid angled back 20° facing the seated worker (+Z) */}
        <group position={[0, 0.007, -0.14]} rotation={[-0.28, 0, 0]}>
          {/* Back Lid */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.42, 0.28, 0.012]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.4} />
          </mesh>
          {/* Active Screen Glass (Facing +Z toward worker's eyes) */}
          <mesh ref={laptopScreenRef} position={[0, 0.14, 0.008]}>
            <planeGeometry args={[0.39, 0.25]} />
            <meshStandardMaterial
              color={screenColor}
              emissive={screenColor}
              emissiveIntensity={assignedAgent ? 0.85 : 0.08}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          3. BRASS TASK DESK LAMP
      ========================================================================= */}
      <group position={[-0.52, 0.71, -0.22]}>
        {/* Brass Base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Lamp Shade Dome */}
        <mesh position={[0.08, 0.32, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.03, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Soft Task Light */}
        <pointLight
          ref={lampLightRef}
          position={[0.12, 0.28, 0]}
          color="#FEF3C7"
          intensity={assignedAgent ? 0.9 : 0.2}
          distance={1.8}
        />
      </group>

      {/* =========================================================================
          4. CERAMIC COFFEE MUG & SUCCULENT POT
      ========================================================================= */}
      {/* Glazed Ceramic Mug */}
      <mesh position={[0.52, 0.76, 0.12]} castShadow>
        <cylinderGeometry args={[0.045, 0.038, 0.09, 16]} />
        <meshStandardMaterial
          color={assignedAgent ? assignedAgent.accentColor : '#C4B5A5'}
          roughness={0.3}
        />
      </mesh>

      {/* Miniature Succulent in Terracotta Pot */}
      <group position={[0.54, 0.71, -0.24]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.035, 0.09, 16]} />
          <meshStandardMaterial color="#D97059" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#4E7D63" roughness={0.6} />
        </mesh>
      </group>

      {/* =========================================================================
          5. SCANDINAVIAN SWIVEL CHAIR (Ergonomically tucked at z = +0.34)
      ========================================================================= */}
      <group position={[0, 0, 0.34]}>
        {/* Linen Fabric Cushion */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.44, 0.08, 0.42]} />
          <meshStandardMaterial color="#DDD5C8" roughness={0.8} />
        </mesh>
        {/* Curved Oak Backrest */}
        <mesh position={[0, 0.68, 0.19]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.44, 0.05]} />
          <meshStandardMaterial color="#CBBBA4" roughness={0.4} />
        </mesh>
        {/* Central Wooden Stem & Pedestal */}
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
          6. VACANT WORKSTATION DESK BELL & INTERACTIVE + ADD CRITIC PILL
      ========================================================================= */}
      {!assignedAgent && (
        <group position={[0, 0.72, 0.22]}>
          {/* Miniature Brass Reception Bell */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.055, 0.04, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial color="#D97706" metalness={0.9} />
          </mesh>

          {/* Pure 3D Golden Invite Halo & Floating Pill on Next Vacant Desk */}
          {deskIndex === nextVacantDesk && (
            <>
              <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.07, 0.095, 24]} />
                <meshBasicMaterial color="#F59E0B" transparent opacity={0.7} />
              </mesh>
              <FloatingBadge3D
                position={[0, 0.32, -0.15]}
                title={`+ Desk #${deskIndex + 1}`}
                variant="action"
                width={0.72}
                height={0.2}
                onClick={() => setAddCriticOpen(true)}
              />
            </>
          )}
        </group>
      )}
    </group>
  );
};
