'use client';

import React from 'react';
import { OfficeEnvironment } from './OfficeEnvironment';
import { Workstation } from './Workstation';
import { MainArbiterStation } from './MainArbiterStation';
import { SandboxStation } from './SandboxStation';
import { CodingAgentStation } from './CodingAgentStation';
import { AgentCharacter } from './AgentCharacter';
import { SignalBeams } from './SignalBeams';
import { CameraRig } from './CameraRig';
import { useCouncilStore, CRITIC_DESK_POSITIONS } from '@/store/councilStore';

export const OfficeScene: React.FC = () => {
  const critics = useCouncilStore((state) => state.critics);

  return (
    <>
      {/* Studio Lighting Setup: Warm Natural Sunlight & Soft Contact Shadows */}
      <ambientLight intensity={0.55} color="#FAF7F2" />
      <hemisphereLight args={['#FFFDF8', '#E8DEC8', 0.5]} />

      {/* Main Warm Architectural Key Light (Conservatory Sunlight) */}
      <directionalLight
        position={[12, 16, 12]}
        intensity={1.5}
        color="#FFF6E8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />

      {/* Soft Warm Room Fill Light (No harsh neon blue!) */}
      <directionalLight
        position={[-10, 9, -10]}
        intensity={0.45}
        color="#F0E8DD"
      />

      {/* Office Environment Diorama */}
      <OfficeEnvironment />

      {/* Stations */}
      <MainArbiterStation />
      <SandboxStation />
      <CodingAgentStation />

      {/* 6 Workstations */}
      {CRITIC_DESK_POSITIONS.map((pos, idx) => {
        const assigned = critics.find((c) => c.deskIndex === idx);
        return (
          <Workstation
            key={idx}
            deskIndex={idx}
            position={pos}
            assignedAgent={assigned}
          />
        );
      })}

      {/* Animated Critic Characters */}
      {critics.map((critic) => (
        <AgentCharacter key={critic.id} agent={critic} />
      ))}

      {/* Interactive Communication Signal Beams */}
      <SignalBeams />

      {/* Cinematic Camera Rig */}
      <CameraRig />
    </>
  );
};
