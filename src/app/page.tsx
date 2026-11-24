'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/ui/Header';
import { StudioRosterDock } from '@/components/ui/StudioRosterDock';
import { ContextualInspector } from '@/components/ui/ContextualInspector';
import { BottomTimeline } from '@/components/ui/BottomTimeline';
import { AddCriticModal } from '@/components/ui/AddCriticModal';
import { PRSummaryModal } from '@/components/ui/PRSummaryModal';
import { MultiDevModal } from '@/components/ui/MultiDevModal';
import { useCouncilStore } from '@/store/councilStore';
import { Loader2 } from 'lucide-react';

// Dynamically import 3D Canvas without SSR to prevent WebGL hydration mismatches
const OfficeCanvas = dynamic(
  () => import('@/components/3d/OfficeCanvas').then((mod) => mod.OfficeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-600 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-[#D97059]" />
        <p className="text-xs font-mono tracking-wider text-stone-500 uppercase">
          Sculpting Scandinavian Clay Studio Diorama...
        </p>
      </div>
    )
  }
);

export default function Home() {
  const stepForward = useCouncilStore((state) => state.stepForward);
  const stepBackward = useCouncilStore((state) => state.stepBackward);
  const togglePlayPause = useCouncilStore((state) => state.togglePlayPause);
  const resetWorkflow = useCouncilStore((state) => state.resetWorkflow);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        resetWorkflow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepForward, stepBackward, togglePlayPause, resetWorkflow]);

  return (
    <main className="w-screen h-screen flex flex-col overflow-hidden bg-[#FAF8F5] text-stone-800 select-none relative font-sans">
      {/* Top Editorial Navigation Bar */}
      <Header />

      {/* Hero 3D Diorama Viewport */}
      <div className="flex-1 h-full relative overflow-hidden bg-[#FAF8F5]">
        <OfficeCanvas />

        {/* Collapsible Left Studio Navigator & Workers Roster Dock */}
        <StudioRosterDock />

        {/* Slide-over Contextual Inspector Drawer */}
        <ContextualInspector />
      </div>

      {/* Floating Bottom Timeline Stepper & Controls */}
      <BottomTimeline />

      {/* Interactive Modals */}
      <AddCriticModal />
      <PRSummaryModal />
      <MultiDevModal />
    </main>
  );
}
