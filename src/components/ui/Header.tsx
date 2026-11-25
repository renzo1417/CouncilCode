'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  Volume2,
  VolumeX,
  GitPullRequest,
  Network,
  Users,
  PanelRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const cameraFocus = useCouncilStore((state) => state.cameraFocus);
  const setCameraFocus = useCouncilStore((state) => state.setCameraFocus);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);
  const setInspectorTab = useCouncilStore((state) => state.setInspectorTab);
  const soundEnabled = useCouncilStore((state) => state.soundEnabled);
  const toggleSound = useCouncilStore((state) => state.toggleSound);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const setMultiDevModalOpen = useCouncilStore((state) => state.setMultiDevModalOpen);
  const setPRSummaryOpen = useCouncilStore((state) => state.setPRSummaryOpen);
  const isInspectorOpen = useCouncilStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useCouncilStore((state) => state.setInspectorOpen);
  const isRosterOpen = useCouncilStore((state) => state.isRosterOpen);
  const setRosterOpen = useCouncilStore((state) => state.setRosterOpen);
  const critics = useCouncilStore((state) => state.critics);
  const findings = useCouncilStore((state) => state.findings);

  const hasVerifiedFinding = findings.some((f) => f.proofStatus === 'verified_reproduced');
  const isPRReady = workflowState === 'PR_READY' || workflowState === 'VERIFIED';

  return (
    <header className="h-14 border-b border-[#E6E4DF] bg-white px-4 flex items-center justify-between gap-3 z-30 shrink-0 select-none">
      {/* Left: Brand Mark, Screen Title & Quiet File Context */}
      <div className="flex items-center gap-2.5 shrink-0">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-[#141413]"
        >
          <circle cx="9.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="14.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.75" />
        </svg>

        <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-[#141413] whitespace-nowrap">
          CouncilCode
        </h1>

        <span className="hidden xl:inline text-[#D4D1CA]" aria-hidden="true">
          /
        </span>

        <button
          type="button"
          onClick={() => {
            selectStation('coder', true);
            setInspectorTab('code');
            setCodeViewMode('diff');
          }}
          className="hidden xl:inline-flex items-center px-1.5 py-1 rounded-md text-[13px] text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] transition-colors cursor-pointer whitespace-nowrap"
          title="Inspect invoices.ts diff"
        >
          invoices.ts
        </button>
      </div>

      {/* Center: Calm Segmented Camera Switcher */}
      <nav
        aria-label="Studio camera views"
        className="hidden lg:flex items-center bg-[#F2F1EE] p-0.5 rounded-lg"
      >
        {[
          { id: 'overview', label: 'Overview', onClick: () => { selectStation(null); setCameraFocus('overview'); } },
          { id: 'arbiter', label: 'Arbiter', onClick: () => selectStation('arbiter', isInspectorOpen) },
          { id: 'sandbox', label: 'Sandbox', onClick: () => selectStation('sandbox', isInspectorOpen) },
          {
            id: 'coder',
            label: 'Coder',
            onClick: () => {
              selectStation('coder', isInspectorOpen);
              setCodeViewMode('diff');
            }
          }
        ].map((view) => {
          const active = cameraFocus === view.id;
          return (
            <button
              key={view.id}
              type="button"
              onClick={view.onClick}
              className={`px-3 py-1 rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                active
                  ? 'bg-white text-[#141413] border border-[#E6E4DF]'
                  : 'text-[#575550] hover:text-[#141413] border border-transparent'
              }`}
            >
              {view.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Disciplined Workspace Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setRosterOpen(!isRosterOpen)}
          aria-expanded={isRosterOpen}
          className={`h-8 px-2.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 border cc-press cursor-pointer ${
            isRosterOpen
              ? 'bg-[#F2F1EE] border-[#D4D1CA] text-[#141413]'
              : 'bg-white border-[#E6E4DF] text-[#575550] hover:text-[#141413] hover:bg-[#F6F5F2]'
          }`}
          title="Toggle studio roster"
        >
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Council</span>
          <span className="tabular-nums text-[12px] text-[#6B6862]">{critics.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setInspectorOpen(!isInspectorOpen)}
          aria-expanded={isInspectorOpen}
          className={`h-8 px-2.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 border cc-press cursor-pointer ${
            isInspectorOpen
              ? 'bg-[#F2F1EE] border-[#D4D1CA] text-[#141413]'
              : 'bg-white border-[#E6E4DF] text-[#575550] hover:text-[#141413] hover:bg-[#F6F5F2]'
          }`}
          title="Toggle verification inspector"
        >
          <PanelRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Inspect</span>
          {hasVerifiedFinding && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#15803D]"
              aria-label="Verified proof available"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setPRSummaryOpen(true)}
          className={`h-8 px-2.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 border cc-press cursor-pointer ${
            isPRReady
              ? 'bg-[#166534] hover:bg-[#14532D] text-white border-[#166534]'
              : 'bg-white border-[#E6E4DF] text-[#575550] hover:text-[#141413] hover:bg-[#F6F5F2]'
          }`}
          title="Open pull request summary"
        >
          <GitPullRequest className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tabular-nums">PR #42</span>
        </button>

        <div className="hidden sm:block h-4 w-px bg-[#E6E4DF] mx-0.5" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setMultiDevModalOpen(true)}
          aria-label="View multi-developer pods architecture"
          title="Team pods architecture"
          className="hidden sm:flex h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] items-center justify-center cc-press cursor-pointer"
        >
          <Network className="w-4 h-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center cc-press cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#6B6862]" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
};
