'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const HeroPrism3DDynamic = dynamic(() => import('./HeroPrism3D'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full h-[340px] sm:h-[420px] lg:h-[480px]"
    />
  )
});

const Stages3DSceneDynamic = dynamic(() => import('./Stages3DScene'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="w-full h-[340px] sm:h-[400px] lg:h-[490px]"
    />
  )
});

class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export const HeroPrism3DView: React.FC = () => (
  <WebGLErrorBoundary
    fallback={
      <div className="w-full h-[320px] sm:h-[380px] lg:h-[440px] flex items-center justify-center text-[14px] text-[#A1A1AA]">
        3D verification model
      </div>
    }
  >
    <HeroPrism3DDynamic />
  </WebGLErrorBoundary>
);

export const Stages3DSceneView: React.FC<{ activeIdx: number }> = ({ activeIdx }) => (
  <WebGLErrorBoundary
    fallback={
      <div className="w-full h-[320px] sm:h-[380px] lg:h-[470px] flex items-center justify-center text-[14px] text-[#A1A1AA]">
        3D verification pipeline
      </div>
    }
  >
    <Stages3DSceneDynamic activeIdx={activeIdx} />
  </WebGLErrorBoundary>
);
