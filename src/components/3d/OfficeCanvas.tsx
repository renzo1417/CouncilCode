'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OfficeScene } from './OfficeScene';
import { Loader2 } from 'lucide-react';
import { FallbackView } from '../ui/FallbackView';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    return !!gl;
  } catch {
    return false;
  }
}

export const OfficeCanvas: React.FC = () => {
  const [hasWebGL] = useState<boolean>(checkWebGLSupport);

  if (!hasWebGL) {
    return <FallbackView />;
  }

  return (
    <div className="w-full h-full relative bg-[#F3F3F1] select-none">
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F5F4] text-[#575550] gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#141413]" />
            <p className="text-[13px] font-medium text-[#575550]">
              Preparing studio scene...
            </p>
          </div>
        }
      >
        <Canvas
          shadows={false}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
          camera={{
            position: [10.5, 11.2, 11.5],
            fov: 34,
            near: 0.1,
            far: 100
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance'
          }}
          className="w-full h-full"
        >
          <OfficeScene />
        </Canvas>
      </Suspense>
    </div>
  );
};
