'use client';

import React, { useEffect } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { WorkflowState } from '@/types/council';
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
  CheckCircle2,
  Clock,
  Server,
  Users,
  ShieldCheck,
  Bot,
  Terminal,
  GitPullRequest
} from 'lucide-react';

interface StageConfig {
  id: WorkflowState;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
}

const STAGES: StageConfig[] = [
  { id: 'SANDBOX_INITIAL', name: '1. Sandbox Gate', shortDesc: 'Click to jump: Zero-token fast fail', icon: Server },
  { id: 'CRITICS_REVIEWING', name: '2. Critic Council', shortDesc: 'Click to jump: Cross-vendor review', icon: Users },
  { id: 'PROOF_VERIFICATION', name: '3. Proof Gate', shortDesc: 'Click to jump: Executable proof harness', icon: ShieldCheck },
  { id: 'MAIN_AGENT_ARBITRATION', name: '4. Main Arbiter', shortDesc: 'Click to jump: Reconcile & max 2 loops', icon: Bot },
  { id: 'REVISION_IN_PROGRESS', name: '5. Revision', shortDesc: 'Click to jump: Patch & regression check', icon: Terminal },
  { id: 'VERIFIED', name: '6. Verified PR', shortDesc: 'Click to jump: Green-tested sign-off', icon: GitPullRequest }
];

export const BottomTimeline: React.FC = () => {
  const workflowState = useCouncilStore((state) => state.workflowState);
  const stepForward = useCouncilStore((state) => state.stepForward);
  const stepBackward = useCouncilStore((state) => state.stepBackward);
  const jumpToStage = useCouncilStore((state) => state.jumpToStage);
  const togglePlayPause = useCouncilStore((state) => state.togglePlayPause);
  const isPlaying = useCouncilStore((state) => state.isPlaying);
  const playbackSpeed = useCouncilStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useCouncilStore((state) => state.setPlaybackSpeed);
  const resetWorkflow = useCouncilStore((state) => state.resetWorkflow);
  const revisionLoop = useCouncilStore((state) => state.revisionLoop);
  const maxRevisionLoops = useCouncilStore((state) => state.maxRevisionLoops);
  const auditLog = useCouncilStore((state) => state.auditLog);

  // Autoplay progression timer
  useEffect(() => {
    if (!isPlaying) return;
    if (workflowState === 'PR_READY') return;

    const intervalTime = Math.max(1400 / playbackSpeed, 650);
    const timer = setInterval(() => {
      stepForward();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, workflowState, playbackSpeed, stepForward]);

  // Determine stage progression index (0 to 5)
  const getStageIndex = (state: string): number => {
    switch (state) {
      case 'IDLE':
        return -1;
      case 'SANDBOX_INITIAL':
        return 0;
      case 'CRITICS_REVIEWING':
        return 1;
      case 'PROOF_VERIFICATION':
        return 2;
      case 'MAIN_AGENT_ARBITRATION':
        return 3;
      case 'REVISION_IN_PROGRESS':
      case 'SANDBOX_RECHECK':
      case 'COUNCIL_RECHECK':
        return 4;
      case 'VERIFIED':
      case 'PR_READY':
        return 5;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(workflowState);

  return (
    <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-auto max-w-[96vw]">
      {/* Precision Orchestration Console Dock */}
      <div
        className="flex items-center gap-2 sm:gap-2.5 px-3 py-2 rounded-2xl bg-[#FAF8F5]/95 backdrop-blur-xl border border-stone-200/90 shadow-xl transition-all"
        style={{
          boxShadow: '0 12px 32px -4px rgba(45, 35, 25, 0.14), 0 2px 6px rgba(45, 35, 25, 0.05)'
        }}
      >
        {/* Interactive Clickable Stages Stepper Rail */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = currentStageIdx > idx;
            const isCurrent = currentStageIdx === idx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => jumpToStage(stage.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all shrink-0 text-xs cursor-pointer ${
                  isCurrent
                    ? 'bg-stone-900 text-white font-medium shadow-xs scale-[1.02]'
                    : isCompleted
                    ? 'bg-emerald-50/90 hover:bg-emerald-100/90 text-[#0D5F3A] border border-emerald-200/80 font-medium'
                    : 'bg-stone-100/80 text-stone-600 border border-stone-200/60 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
                title={stage.shortDesc}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-[#0D5F3A] text-white'
                      : 'bg-stone-200/80 text-stone-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-2.5 h-2.5" />}
                </div>

                <span className="text-[11px] font-sans whitespace-nowrap">
                  {stage.name}
                </span>

                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C85A3E] animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-stone-200/80 mx-0.5 shrink-0" />

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Loop Counter */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100/80 border border-stone-200/70 text-[11px] font-mono"
            title="Maximum 2 revision loops enforced by Main Arbiter"
          >
            <span className="text-stone-400">loop</span>
            <span className="font-semibold text-stone-800">
              {revisionLoop}/{maxRevisionLoops}
            </span>
          </div>

          {/* Speed Toggle */}
          <div className="hidden sm:flex bg-stone-100/80 p-0.5 rounded-md border border-stone-200/70 text-[10px] font-mono">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Step Backward */}
          <button
            onClick={stepBackward}
            disabled={workflowState === 'IDLE'}
            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center ${
              workflowState === 'IDLE'
                ? 'bg-stone-100/50 border-stone-200/50 text-stone-300 cursor-not-allowed'
                : 'bg-white/80 hover:bg-stone-100 border-stone-200/80 text-stone-700 cursor-pointer'
            }`}
            title="Step Backward (ArrowLeft)"
          >
            <StepBack className="w-3.5 h-3.5" />
          </button>

          {/* Step Forward */}
          <button
            onClick={stepForward}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/80 hover:bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
            title="Step to Next Pipeline State (ArrowRight)"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[10px] font-mono text-stone-500">Step</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-[0.98] ${
              isPlaying
                ? 'bg-stone-800 hover:bg-stone-900 text-white'
                : workflowState === 'IDLE'
                ? 'bg-[#C85A3E] hover:bg-[#B34B31] text-white ring-2 ring-[#C85A3E]/30'
                : 'bg-[#C85A3E] hover:bg-[#B34B31] text-white'
            }`}
            title={isPlaying ? 'Pause Autoplay (Space)' : 'Run Demo Autoplay (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">
                  {workflowState === 'IDLE' ? 'Run Demo' : 'Play'}
                </span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={resetWorkflow}
            className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            title="Reset Workflow (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Integrated Live Event Whisper */}
      {auditLog[0] && (
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600 bg-[#FAF8F5]/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-stone-200/70 shadow-xs max-w-[85vw] truncate">
          <Clock className="w-3 h-3 text-[#C85A3E] shrink-0" />
          <span className="text-[#C85A3E] font-semibold shrink-0">
            [{auditLog[0]?.source || 'AUDIT'}]
          </span>
          <span className="text-stone-800 font-medium truncate shrink-0">
            {auditLog[0]?.title}:
          </span>
          <span className="text-stone-500 truncate">
            {auditLog[0]?.description}
          </span>
        </div>
      )}
    </div>
  );
};
