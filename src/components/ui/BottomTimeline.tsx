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
  GitPullRequest
} from 'lucide-react';

interface StageConfig {
  id: WorkflowState;
  label: string;
  headline: string;
  summary: string;
}

const STAGES: StageConfig[] = [
  {
    id: 'SANDBOX_INITIAL',
    label: 'Sandbox',
    headline: 'Fast-fail sandbox gate',
    summary: 'Running lint, typecheck, build, and baseline tests with zero token spend.'
  },
  {
    id: 'CRITICS_REVIEWING',
    label: 'Council',
    headline: 'Cross-vendor review',
    summary: 'Rival models inspect the endpoint diff for security, logic, and style issues.'
  },
  {
    id: 'PROOF_VERIFICATION',
    label: 'Proof gate',
    headline: 'Executable proof check',
    summary: 'Security exploit reproduced (200 instead of 403); unproved style claim filtered.'
  },
  {
    id: 'MAIN_AGENT_ARBITRATION',
    label: 'Arbiter',
    headline: 'Main Arbiter decision',
    summary: 'Reconciling verified findings into one patch assignment.'
  },
  {
    id: 'REVISION_IN_PROGRESS',
    label: 'Revision',
    headline: 'Patch & regression check',
    summary: 'Applying tenant isolation guard and verifying against the new regression test.'
  },
  {
    id: 'VERIFIED',
    label: 'Verified',
    headline: 'PR #42 verified',
    summary: 'Exploit proven, patched, and cleared by all deterministic checks.'
  }
];

function getStageIndex(state: WorkflowState): number {
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
}

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
  const setPRSummaryOpen = useCouncilStore((state) => state.setPRSummaryOpen);

  useEffect(() => {
    if (!isPlaying) return;
    if (workflowState === 'PR_READY') return;

    const intervalTime = Math.max(1400 / playbackSpeed, 650);
    const timer = setInterval(() => {
      stepForward();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, workflowState, playbackSpeed, stepForward]);

  const currentStageIdx = getStageIndex(workflowState);
  const isIdle = workflowState === 'IDLE';
  const isComplete = workflowState === 'VERIFIED' || workflowState === 'PR_READY';
  const activeStage = currentStageIdx >= 0 ? STAGES[currentStageIdx] : null;

  const displayHeadline = isIdle
    ? 'Ready to verify'
    : workflowState === 'SANDBOX_RECHECK'
    ? 'Sandbox recheck'
    : workflowState === 'COUNCIL_RECHECK'
    ? 'Council sign-off'
    : activeStage?.headline || 'Ready';

  const displaySummary = isIdle
    ? 'Watch rival AI models prove and patch a security bug.'
    : workflowState === 'SANDBOX_RECHECK'
    ? 'Re-running baseline suite plus the new regression test.'
    : workflowState === 'COUNCIL_RECHECK'
    ? 'Critics confirmed 403 Forbidden on cross-tenant access.'
    : activeStage?.summary || '';

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-24px)] max-w-[660px] rounded-2xl bg-white border border-[#E6E4DF] text-[#141413] pointer-events-auto"
      style={{
        boxShadow: '0 2px 10px rgb(20 20 19 / 0.06)'
      }}
    >
      {/* 6-Step Progress Bar */}
      <div className="px-4 pt-3 pb-2 grid grid-cols-6 gap-1.5" role="group" aria-label="Verification stages">
        {STAGES.map((stage, idx) => {
          const isCompleted = currentStageIdx > idx || isComplete;
          const isCurrent = currentStageIdx === idx && !isComplete;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => jumpToStage(stage.id)}
              aria-label={`Jump to stage ${idx + 1}: ${stage.label}`}
              title={`Jump to ${stage.label}`}
              className="group text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413] rounded"
            >
              <div
                className={`h-1 rounded-full transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-[#15803D]'
                    : isCurrent
                    ? 'bg-[#141413]'
                    : 'bg-[#E6E4DF] group-hover:bg-[#D4D1CA]'
                }`}
              />
              <span
                className={`hidden sm:block mt-1.5 text-[11.5px] leading-none truncate transition-colors ${
                  isCurrent
                    ? 'font-semibold text-[#141413]'
                    : isCompleted
                    ? 'font-medium text-[#166534]'
                    : 'text-[#6B6862] group-hover:text-[#141413]'
                }`}
              >
                {stage.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Focal Guidance & Controls */}
      <div className="px-4 pb-3 pt-1 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            {isComplete && (
              <span className="w-2 h-2 rounded-full bg-[#15803D] shrink-0" aria-hidden="true" />
            )}
            <span className="text-[14px] font-semibold text-[#141413] truncate">
              {displayHeadline}
            </span>
            {!isIdle && !isComplete && (
              <span className="hidden sm:inline text-[12px] text-[#6B6862] tabular-nums shrink-0">
                Step {currentStageIdx + 1} of 6
                {revisionLoop > 0 ? ` · Loop ${revisionLoop}/${maxRevisionLoops}` : ''}
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-[#575550] truncate mt-0.5">
            {displaySummary}
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isIdle ? (
            <>
              <button
                type="button"
                onClick={stepForward}
                aria-label="Step forward"
                title="Step forward (ArrowRight)"
                className="h-9 px-3 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[#141413] text-[13px] font-medium flex items-center gap-1.5 cc-press cursor-pointer"
              >
                <StepForward className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Step</span>
              </button>
              <button
                type="button"
                onClick={togglePlayPause}
                title="Start walkthrough (Space)"
                className="h-9 px-4 rounded-lg bg-[#141413] hover:bg-[#2A2A28] text-white text-[13px] font-medium flex items-center gap-1.5 cc-press cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Start demo</span>
              </button>
            </>
          ) : isComplete ? (
            <>
              <button
                type="button"
                onClick={resetWorkflow}
                title="Reset and replay (R)"
                className="h-9 px-3 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[#575550] hover:text-[#141413] text-[13px] font-medium flex items-center gap-1.5 cc-press cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Replay</span>
              </button>
              <button
                type="button"
                onClick={() => setPRSummaryOpen(true)}
                className="h-9 px-4 rounded-lg bg-[#166534] hover:bg-[#14532D] text-white text-[13px] font-medium flex items-center gap-1.5 cc-press cursor-pointer"
              >
                <GitPullRequest className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Review PR #42</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={stepBackward}
                aria-label="Previous step"
                title="Previous step (ArrowLeft)"
                className="h-8 w-8 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[#575550] hover:text-[#141413] flex items-center justify-center cc-press cursor-pointer"
              >
                <StepBack className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={togglePlayPause}
                title={isPlaying ? 'Pause walkthrough (Space)' : 'Resume walkthrough (Space)'}
                className="h-8 px-3.5 rounded-lg bg-[#141413] hover:bg-[#2A2A28] text-white text-[13px] font-medium flex items-center gap-1.5 cc-press cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={stepForward}
                aria-label="Next step"
                title="Next step (ArrowRight)"
                className="h-8 w-8 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[#575550] hover:text-[#141413] flex items-center justify-center cc-press cursor-pointer"
              >
                <StepForward className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
                aria-label={`Playback speed ${playbackSpeed}x. Click to switch.`}
                title="Toggle playback speed"
                className="hidden sm:flex h-8 px-2 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[#575550] hover:text-[#141413] text-[12px] font-medium tabular-nums items-center justify-center cc-press cursor-pointer"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={resetWorkflow}
                aria-label="Reset walkthrough"
                title="Reset walkthrough (R)"
                className="h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center cc-press cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
