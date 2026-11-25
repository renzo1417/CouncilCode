'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { FloatingBadge3D } from './FloatingBadge3D';
import * as THREE from 'three';
import { CriticAgent } from '@/types/council';
import { useCouncilStore } from '@/store/councilStore';

interface AgentCharacterProps {
  agent: CriticAgent;
  isMainAgent?: boolean;
  isCodingAgent?: boolean;
}

export const AgentCharacter: React.FC<AgentCharacterProps> = ({
  agent,
  isMainAgent = false,
  isCodingAgent = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const alertBubbleRef = useRef<THREE.Group>(null);

  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const selectedStation = useCouncilStore((state) => state.selectedStation);
  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);
  const workflowState = useCouncilStore((state) => state.workflowState);

  const isSelected =
    (isMainAgent && selectedStation === 'arbiter') ||
    (isCodingAgent && selectedStation === 'coder') ||
    (!isMainAgent && !isCodingAgent && selectedAgentId === agent.id);

  // Track position for smooth walking interpolation
  const currentPos = useRef(new THREE.Vector3(...agent.position));
  const targetPos = useMemo(() => new THREE.Vector3(...agent.targetPosition), [agent.targetPosition]);

  // Role-specific knit sweater color
  const sweaterColor = useMemo(() => {
    if (isMainAgent) return '#312E81'; // Royal Deep Indigo
    if (isCodingAgent) return '#2563EB'; // Electric Slate Blue
    if (agent.role === 'security') return '#D97706'; // Warm Amber / Mustard
    if (agent.role === 'logic') return '#059669'; // Sage Green
    if (agent.role === 'contract') return '#7C3AED'; // Lavender
    if (agent.role === 'style') return '#E11D48'; // Terracotta Rose
    return agent.color || '#4B5563';
  }, [isMainAgent, isCodingAgent, agent.role, agent.color]);

  // Hair color based on seed
  const hairColor = useMemo(() => {
    if (isMainAgent) return '#1E293B';
    if (isCodingAgent) return '#3F2E23';
    if (agent.role === 'security') return '#78350F';
    if (agent.role === 'style') return '#4C1D95';
    return '#27272A';
  }, [isMainAgent, isCodingAgent, agent.role]);

  const handleSelectCharacter = (e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    if (isMainAgent) {
      selectStation('arbiter');
    } else if (isCodingAgent) {
      selectStation('coder');
      setCodeViewMode('diff');
    } else {
      selectAgent(agent.id);
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const distanceToTarget = currentPos.current.distanceTo(targetPos);
    const isWalking = distanceToTarget > 0.08;

    if (isWalking) {
      // Smoothly walk toward target waypoint / desk position
      currentPos.current.lerp(targetPos, delta * 3.8);
      groupRef.current.position.copy(currentPos.current);

      // Natural rhythmic walk cycle
      const walkFreq = 10;
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * walkFreq) * 0.55;
        rightLegRef.current.rotation.x = -Math.sin(time * walkFreq) * 0.55;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -Math.sin(time * walkFreq) * 0.45;
        rightArmRef.current.rotation.x = Math.sin(time * walkFreq) * 0.45;
      }

      // Vertical bounce while walking
      groupRef.current.position.y = currentPos.current.y + Math.abs(Math.sin(time * walkFreq)) * 0.06;

      // Face direction of movement (Character face is at local +Z)
      const direction = new THREE.Vector3().subVectors(targetPos, currentPos.current).normalize();
      if (direction.lengthSq() > 0.001) {
        const targetAngle = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetAngle, delta * 8);
      }
    } else {
      // Seated at workstation chair (elevated to chair cushion height)
      const seatedY = isMainAgent ? targetPos.y + 0.24 : targetPos.y + 0.23;
      groupRef.current.position.set(targetPos.x, seatedY, targetPos.z);

      // IMPORTANT: Character local face is +Z.
      // Main Arbiter sits North of the round table and faces South (+Z -> rotation.y = 0) toward his command laptop.
      // Coding Agent and Critics sit South of their desks and face North (-Z -> rotation.y = Math.PI) directly into their laptops!
      const deskFacingAngle = isMainAgent ? 0 : Math.PI;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, deskFacingAngle, delta * 6);

      // Seated legs angled forward over chair cushion
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2.2;
        rightLegRef.current.rotation.x = -Math.PI / 2.2;
      }

      // Action determination
      const isTyping =
        agent.status === 'reviewing' ||
        agent.status === 'submitting' ||
        (isCodingAgent && workflowState === 'REVISION_IN_PROGRESS') ||
        (isMainAgent && workflowState === 'MAIN_AGENT_ARBITRATION');

      if (isTyping) {
        // Typing flutter over laptop keyboard
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI / 2.05 + Math.sin(time * 16) * 0.08;
          rightArmRef.current.rotation.x = -Math.PI / 2.05 + Math.cos(time * 18) * 0.08;
        }
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = 0.14 + Math.sin(time * 4) * 0.03;
          headGroupRef.current.rotation.y = Math.sin(time * 2) * 0.04;
        }
      } else {
        // Gentle seated breathing posture with hands resting near laptop palmrest
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI / 2.35;
          rightArmRef.current.rotation.x = -Math.PI / 2.35;
        }
        if (headGroupRef.current) {
          headGroupRef.current.rotation.x = 0.08 + Math.sin(time * 1.5) * 0.025;
          headGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.04;
        }
      }

      // Eureka alert bobbing when discovering an issue
      if (agent.status === 'found_issue' && alertBubbleRef.current) {
        alertBubbleRef.current.position.y = 1.35 + Math.sin(time * 6) * 0.06;
      }

      // Joyful victory celebration bounce
      if (agent.status === 'celebrating') {
        groupRef.current.position.y = seatedY + Math.abs(Math.sin(time * 8)) * 0.16;
        if (leftArmRef.current && rightArmRef.current) {
          leftArmRef.current.rotation.x = -Math.PI * 0.85 + Math.sin(time * 10) * 0.2;
          rightArmRef.current.rotation.x = -Math.PI * 0.85 + Math.cos(time * 10) * 0.2;
        }
      }

      // Blink animation
      const blink = Math.sin(time * 2.5) > 0.96;
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.scale.y = blink ? 0.1 : 1.0;
        rightEyeRef.current.scale.y = blink ? 0.1 : 1.0;
      }
    }
  });

  // Status badge label & color for floating 3D pill
  const statusInfo = useMemo(() => {
    if (isMainAgent) {
      if (workflowState === 'MAIN_AGENT_ARBITRATION') return { label: 'Arbitrating', dot: '#F59E0B' };
      if (workflowState === 'VERIFIED' || workflowState === 'PR_READY') return { label: 'PR Signed Off', dot: '#10B981' };
      return { label: 'Council Lead', dot: '#6366F1' };
    }
    if (isCodingAgent) {
      if (workflowState === 'REVISION_IN_PROGRESS') return { label: 'Patching Code', dot: '#F59E0B' };
      return { label: 'Builder', dot: '#3B82F6' };
    }
    switch (agent.status) {
      case 'entering':
        return { label: 'Entering...', dot: '#F59E0B' };
      case 'waiting_sandbox':
        return { label: 'Wait Sandbox', dot: '#94A3B8' };
      case 'reviewing':
        return { label: 'Reviewing...', dot: '#F59E0B' };
      case 'found_issue':
        return { label: 'Bug Found!', dot: '#EF4444' };
      case 'submitting':
        return { label: 'Proving Bug', dot: '#D97706' };
      case 'approved':
        return { label: 'Approved', dot: '#10B981' };
      case 'celebrating':
        return { label: 'Verified', dot: '#10B981' };
      default:
        return { label: agent.role, dot: agent.accentColor };
    }
  }, [isMainAgent, isCodingAgent, workflowState, agent.status, agent.role, agent.accentColor]);

  return (
    <group
      ref={groupRef}
      position={agent.position}
      rotation={[0, isMainAgent ? 0 : Math.PI, 0]}
      onClick={handleSelectCharacter}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* =========================================================================
          0. FLOATING 3D WORKER NAMEPLATE & LIVE STATUS PILL (React 19-safe)
      ========================================================================= */}
      <FloatingBadge3D
        position={[0, isMainAgent ? 1.55 : 1.38, 0]}
        title={agent.name}
        subtitle={statusInfo.label}
        dotColor={statusInfo.dot}
        isSelected={isSelected}
        isAlert={agent.status === 'found_issue'}
        onClick={handleSelectCharacter}
      />

      {/* =========================================================================
          1. WARM GOLD / AMBER SELECTION RING ON FLOOR
      ========================================================================= */}
      {isSelected && (
        <mesh position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.52, 32]} />
          <meshBasicMaterial color="#D97706" transparent opacity={0.85} />
        </mesh>
      )}

      {/* =========================================================================
          2. MAIN ARBITER BRASS HALO RING
      ========================================================================= */}
      {isMainAgent && (
        <group position={[0, 1.22, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.02, 16, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.9}
              roughness={0.2}
              emissive="#D97706"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}

      {/* =========================================================================
          3. EUREKA ALERT EXCLAMATION MARK (Proof Gate Trigger)
      ========================================================================= */}
      {agent.status === 'found_issue' && (
        <group ref={alertBubbleRef} position={[0, 1.35, 0]}>
          {/* Subtle Glow Bubble */}
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#FEF3C7" transparent opacity={0.85} />
          </mesh>
          {/* Exclamation stem */}
          <mesh position={[0, 0.12, 0.05]}>
            <capsuleGeometry args={[0.03, 0.1, 8, 16]} />
            <meshBasicMaterial color="#D97706" />
          </mesh>
          {/* Exclamation dot */}
          <mesh position={[0, -0.02, 0.05]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color="#D97706" />
          </mesh>
        </group>
      )}

      {/* =========================================================================
          4. SCULPTED CHIBI HEAD & FACIAL FEATURES (Facing local +Z)
      ========================================================================= */}
      <group ref={headGroupRef} position={[0, 0.82, 0]}>
        {/* Soft Porcelain Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#FBF7F0" // Warm Porcelain
            roughness={0.55}
            metalness={0.02}
          />
        </mesh>

        {/* Sculpted Hair Cap */}
        <mesh position={[0, 0.04, -0.02]} castShadow>
          <sphereGeometry args={[0.208, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial
            color={hairColor}
            roughness={0.7}
          />
        </mesh>

        {/* Minimalist Dot Eyes */}
        <mesh ref={leftEyeRef} position={[-0.065, 0.01, 0.185]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#1E2024" roughness={0.3} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.065, 0.01, 0.185]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#1E2024" roughness={0.3} />
        </mesh>

        {/* Subtle Pastel Rosy Cheeks */}
        <mesh position={[-0.11, -0.04, 0.16]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#FCA5A5" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.11, -0.04, 0.16]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#FCA5A5" transparent opacity={0.45} />
        </mesh>

        {/* Role Accessory: Logic Critic Acoustic Headphones */}
        {agent.role === 'logic' && !isMainAgent && !isCodingAgent && (
          <group position={[0, 0.02, 0]}>
            <mesh position={[-0.21, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
              <meshStandardMaterial color="#3E444D" roughness={0.4} />
            </mesh>
            <mesh position={[0.21, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
              <meshStandardMaterial color="#3E444D" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* Role Accessory: Coding Agent Reading Glasses */}
        {isCodingAgent && (
          <group position={[0, 0.015, 0.18]}>
            <mesh position={[-0.065, 0, 0]}>
              <torusGeometry args={[0.038, 0.006, 8, 20]} />
              <meshStandardMaterial color="#D97706" metalness={0.8} />
            </mesh>
            <mesh position={[0.065, 0, 0]}>
              <torusGeometry args={[0.038, 0.006, 8, 20]} />
              <meshStandardMaterial color="#D97706" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.03, 0.006, 0.006]} />
              <meshStandardMaterial color="#D97706" metalness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* =========================================================================
          5. SCULPTED CHIBI TORSO (Knit Sweater)
      ========================================================================= */}
      <group position={[0, 0.46, 0]}>
        {/* Main Body Cushion / Sweater */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.42, 24]} />
          <meshStandardMaterial
            color={sweaterColor}
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Ribbed Sweater Collar */}
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.13, 0.025, 12, 24]} />
          <meshStandardMaterial color={sweaterColor} roughness={0.7} />
        </mesh>
      </group>

      {/* =========================================================================
          6. ARTICULATED ARMS & HANDS
      ========================================================================= */}
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.22, 0.54, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.18, 8, 16]} />
          <meshStandardMaterial color={sweaterColor} roughness={0.65} />
        </mesh>
        {/* Porcelain Hand */}
        <mesh position={[0, -0.27, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color="#FBF7F0" roughness={0.6} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.22, 0.54, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.18, 8, 16]} />
          <meshStandardMaterial color={sweaterColor} roughness={0.65} />
        </mesh>
        {/* Porcelain Hand */}
        <mesh position={[0, -0.27, 0]} castShadow>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color="#FBF7F0" roughness={0.6} />
        </mesh>
      </group>

      {/* =========================================================================
          7. LEGS & SHOES
      ========================================================================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.09, 0.22, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.16, 8, 16]} />
          <meshStandardMaterial color="#3E3832" roughness={0.7} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.2, 0.03]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial color="#221C16" roughness={0.5} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.09, 0.22, 0]}>
        <mesh position={[0, -0.12, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.16, 8, 16]} />
          <meshStandardMaterial color="#3E3832" roughness={0.7} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.2, 0.03]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial color="#221C16" roughness={0.5} />
        </mesh>
      </group>

    </group>
  );
};
