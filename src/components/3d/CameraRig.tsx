'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useCouncilStore } from '@/store/councilStore';

export const CameraRig: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const cameraFocus = useCouncilStore((state) => state.cameraFocus);
  const focusTarget = useCouncilStore((state) => state.focusTarget);

  // Target camera look-at position and eye position
  const targetLookAt = useRef(new THREE.Vector3(0, 0.8, 0));
  const targetCamPos = useRef(new THREE.Vector3(10.5, 11.2, 11.5));
  const isTransitioning = useRef<boolean>(true);
  const transitionTimer = useRef<number>(0);

  useEffect(() => {
    isTransitioning.current = true;
    transitionTimer.current = 0;

    switch (cameraFocus) {
      case 'overview': {
        targetLookAt.current.set(0, 0.75, 0.2);
        targetCamPos.current.set(10.5, 11.2, 11.5);
        break;
      }
      case 'arbiter': {
        targetLookAt.current.set(0, 1.05, 2.3);
        targetCamPos.current.set(3.4, 3.8, 6.8);
        break;
      }
      case 'sandbox': {
        targetLookAt.current.set(4.8, 1.15, 0.4);
        targetCamPos.current.set(8.6, 4.2, 4.2);
        break;
      }
      case 'coder': {
        // Three-quarter view showing both the Coding Agent and their glowing laptop screen
        targetLookAt.current.set(-4.6, 1.0, -0.05);
        targetCamPos.current.set(-2.2, 3.2, 2.8);
        break;
      }
      case 'agent': {
        if (focusTarget) {
          targetLookAt.current.set(focusTarget[0], 0.95, focusTarget[2] - 0.15);
          targetCamPos.current.set(focusTarget[0] + 2.2, 3.1, focusTarget[2] + 3.0);
        }
        break;
      }
    }
  }, [cameraFocus, focusTarget]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      transitionTimer.current += delta;
      state.camera.position.lerp(targetCamPos.current, delta * 4.2);
      controlsRef.current.target.lerp(targetLookAt.current, delta * 4.8);

      const camDist = state.camera.position.distanceTo(targetCamPos.current);
      const targetDist = controlsRef.current.target.distanceTo(targetLookAt.current);

      // Stop overriding camera once arrived or after 1.35s so user can freely orbit/zoom
      if ((camDist < 0.08 && targetDist < 0.05) || transitionTimer.current > 1.35) {
        isTransitioning.current = false;
      }
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.12} // Prevent camera from going below floor
      minPolarAngle={Math.PI / 7}
      minDistance={3.2}
      maxDistance={24}
      target={[0, 0.75, 0.2]}
      onStart={() => {
        // Immediately yield camera control when user drags or zooms with mouse/trackpad
        isTransitioning.current = false;
      }}
    />
  );
};
