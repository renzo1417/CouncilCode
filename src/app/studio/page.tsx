'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/ui/Header';
import { StudioRosterDock } from '@/components/ui/StudioRosterDock';
import { ContextualInspector } from '@/components/ui/ContextualInspector';
import { BottomTimeline } from '@/components/ui/BottomTimeline';
import { AddCriticModal } from '@/components/ui/AddCriticModal';
import { PRSummaryModal } from '@/components/ui/PRSummaryModal';
import { MultiDevModal } from '@/components/ui/MultiDevModal';
import { useCouncilStore } from '@/store/councilStore';
import { WorkflowState } from '@/types/council';
import { Loader2 } from 'lucide-react';

const OfficeCanvas = dynamic(
  () => import('@/components/3d/OfficeCanvas').then((mod) => mod.OfficeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F5F5F4] text-[#575550] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#141413]" />
        <p className="text-[13px] font-medium text-[#575550]">
          Loading studio...
        </p>
      </div>
    )
  }
);

const VALID_STAGES: WorkflowState[] = [
  'IDLE',
  'SANDBOX_INITIAL',
  'CRITICS_REVIEWING',
  'PROOF_VERIFICATION',
  'MAIN_AGENT_ARBITRATION',
  'REVISION_IN_PROGRESS',
  'SANDBOX_RECHECK',
  'COUNCIL_RECHECK',
  'VERIFIED',
  'PR_READY'
];

const emptySubscribe = () => () => {};
const getCleanCaptureSnapshot = () =>
  new URLSearchParams(window.location.search).get('clean') === '1';
const getCleanCaptureServerSnapshot = () => false;

export default function StudioPage() {
  const isCleanCapture = useSyncExternalStore(
    emptySubscribe,
    getCleanCaptureSnapshot,
    getCleanCaptureServerSnapshot
  );

  const stepForward = useCouncilStore((state) => state.stepForward);
  const stepBackward = useCouncilStore((state) => state.stepBackward);
  const togglePlayPause = useCouncilStore((state) => state.togglePlayPause);
  const resetWorkflow = useCouncilStore((state) => state.resetWorkflow);
  const jumpToStage = useCouncilStore((state) => state.jumpToStage);
  const setCameraFocus = useCouncilStore((state) => state.setCameraFocus);
  const isAddCriticOpen = useCouncilStore((state) => state.isAddCriticOpen);
  const isPRSummaryOpen = useCouncilStore((state) => state.isPRSummaryOpen);
  const isMultiDevModalOpen = useCouncilStore((state) => state.isMultiDevModalOpen);
  const isInspectorOpen = useCouncilStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useCouncilStore((state) => state.setInspectorOpen);
  const isRosterOpen = useCouncilStore((state) => state.isRosterOpen);
  const setRosterOpen = useCouncilStore((state) => state.setRosterOpen);

  // Optional stage / camera focus query params for studio previews
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stageParam = params.get('stage') as WorkflowState | null;
    if (stageParam && VALID_STAGES.includes(stageParam)) {
      jumpToStage(stageParam);
    }
    const focusParam = params.get('focus');
    if (
      focusParam === 'overview' ||
      focusParam === 'arbiter' ||
      focusParam === 'sandbox' ||
      focusParam === 'coder'
    ) {
      setCameraFocus(focusParam);
    }
  }, [jumpToStage, setCameraFocus]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) {
        return;
      }

      if (isAddCriticOpen || isPRSummaryOpen || isMultiDevModalOpen) {
        return;
      }

      if (e.key === 'Escape') {
        if (isInspectorOpen) {
          setInspectorOpen(false);
          return;
        }
        if (isRosterOpen) {
          setRosterOpen(false);
          return;
        }
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
  }, [
    stepForward,
    stepBackward,
    togglePlayPause,
    resetWorkflow,
    isAddCriticOpen,
    isPRSummaryOpen,
    isMultiDevModalOpen,
    isInspectorOpen,
    setInspectorOpen,
    isRosterOpen,
    setRosterOpen
  ]);

  return (
    <main className="w-screen h-dvh flex flex-col overflow-hidden bg-[#F5F5F4] text-[#141413] select-none relative font-sans">
      {!isCleanCapture && <Header />}

      <div className="flex-1 h-full relative overflow-hidden bg-[#F3F3F1]">
        <OfficeCanvas />
        {!isCleanCapture && <StudioRosterDock />}
        {!isCleanCapture && <ContextualInspector />}
      </div>

      {!isCleanCapture && <BottomTimeline />}

      {!isCleanCapture && (
        <>
          <AddCriticModal />
          <PRSummaryModal />
          <MultiDevModal />
        </>
      )}
    </main>
  );
}
