'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCouncilStore, ARBITER_POS, CODER_POS, SANDBOX_STATION_POS } from '@/store/councilStore';

export const SignalBeams: React.FC = () => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const critics = useCouncilStore((state) => state.critics);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.4 + Math.sin(time * 6) * 0.35;
    }
  });

  const activePoints = React.useMemo(() => {
    const pts: number[] = [];

    // During PROOF_VERIFICATION: Beams from Critics to Sandbox
    if (workflowState === 'PROOF_VERIFICATION' || workflowState === 'CRITICS_REVIEWING') {
      critics.forEach((critic) => {
        if (critic.status === 'submitting' || critic.status === 'found_issue') {
          pts.push(
            critic.targetPosition[0], critic.targetPosition[1] + 1.0, critic.targetPosition[2],
            SANDBOX_STATION_POS[0], SANDBOX_STATION_POS[1] + 1.5, SANDBOX_STATION_POS[2]
          );
        }
      });
    }

    // During MAIN_AGENT_ARBITRATION: Beams from Sandbox to Arbiter
    if (workflowState === 'MAIN_AGENT_ARBITRATION') {
      pts.push(
        SANDBOX_STATION_POS[0], SANDBOX_STATION_POS[1] + 1.5, SANDBOX_STATION_POS[2],
        ARBITER_POS[0], ARBITER_POS[1] + 1.1, ARBITER_POS[2] - 1.25
      );
    }

    // During REVISION_IN_PROGRESS: Beam from Arbiter to Coder
    if (workflowState === 'REVISION_IN_PROGRESS') {
      pts.push(
        ARBITER_POS[0], ARBITER_POS[1] + 1.1, ARBITER_POS[2] - 1.25,
        CODER_POS[0], CODER_POS[1] + 1.0, CODER_POS[2] + 0.34
      );
    }

    // During SANDBOX_RECHECK: Beam from Coder to Sandbox
    if (workflowState === 'SANDBOX_RECHECK') {
      pts.push(
        CODER_POS[0], CODER_POS[1] + 1.0, CODER_POS[2] + 0.34,
        SANDBOX_STATION_POS[0], SANDBOX_STATION_POS[1] + 1.5, SANDBOX_STATION_POS[2]
      );
    }

    return pts;
  }, [workflowState, critics]);

  if (activePoints.length === 0) return null;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(activePoints, 3));

  const beamColor =
    workflowState === 'MAIN_AGENT_ARBITRATION'
      ? '#D97706'
      : workflowState === 'PROOF_VERIFICATION'
      ? '#D97706'
      : workflowState === 'VERIFIED'
      ? '#10B981'
      : '#F59E0B';

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={beamColor} transparent opacity={0.7} linewidth={2} />
    </lineSegments>
  );
};
