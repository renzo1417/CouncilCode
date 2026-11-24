'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  GitPullRequest,
  Network,
  Eye,
  Server,
  Bot,
  Terminal,
  UserPlus,
  PanelRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const cameraFocus = useCouncilStore((state) => state.cameraFocus);
  const setCameraFocus = useCouncilStore((state) => state.setCameraFocus);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);
  const soundEnabled = useCouncilStore((state) => state.soundEnabled);
  const toggleSound = useCouncilStore((state) => state.toggleSound);
  const resetWorkflow = useCouncilStore((state) => state.resetWorkflow);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const setMultiDevModalOpen = useCouncilStore((state) => state.setMultiDevModalOpen);
  const setPRSummaryOpen = useCouncilStore((state) => state.setPRSummaryOpen);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);
  const isInspectorOpen = useCouncilStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useCouncilStore((state) => state.setInspectorOpen);
  const findings = useCouncilStore((state) => state.findings);

  return (
    <header className="h-13 border-b border-stone-200/80 bg-[#FAF8F5]/95 backdrop-blur-xl px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Task Brief */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C85A3E]/10 border border-[#C85A3E]/20 flex items-center justify-center text-[#C85A3E]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-tight text-stone-900 font-sans">
              Council<span className="text-[#C85A3E]">Code</span>
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 bg-stone-100/90 px-1.5 py-0.5 rounded border border-stone-200/60 font-medium">
              proof-gated
            </span>
          </div>
        </div>

        {/* Active Scenario Trigger */}
        <button
          onClick={() => {
            selectStation('coder');
            setCodeViewMode('diff');
          }}
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-100/70 hover:bg-stone-200/60 border border-stone-200/70 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          title="Inspect scenario code and vulnerability diff"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C85A3E]" />
          <span className="font-mono text-[11px] font-medium text-stone-700">CWE-639 IDOR</span>
          <span className="text-stone-300 font-mono">/</span>
          <span className="font-mono text-[11px] text-stone-500 truncate max-w-[160px]">invoices.ts</span>
        </button>
      </div>

      {/* Center: Precision Segmented Camera & Station Switch */}
      <div className="hidden md:flex items-center bg-stone-200/60 p-0.5 rounded-lg border border-stone-200 text-xs">
        <button
          onClick={() => {
            selectStation(null);
            setCameraFocus('overview');
          }}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
            cameraFocus === 'overview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Full Studio Diorama View"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => selectStation('arbiter')}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
            cameraFocus === 'arbiter'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Focus Arbiter Round Table & Inspect Arbitration"
        >
          <Bot className="w-3.5 h-3.5 text-stone-500" />
          <span>Arbiter</span>
        </button>

        <button
          onClick={() => selectStation('sandbox')}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
            cameraFocus === 'sandbox'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Focus Verification Kiln & Inspect Sandbox Logs"
        >
          <Server className="w-3.5 h-3.5 text-stone-500" />
          <span>Sandbox</span>
        </button>

        <button
          onClick={() => {
            selectStation('coder');
            setCodeViewMode('diff');
          }}
          className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer ${
            cameraFocus === 'coder'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          title="Focus Coding Agent Desk & Inspect Code Diff"
        >
          <Terminal className="w-3.5 h-3.5 text-stone-500" />
          <span>Coder</span>
        </button>
      </div>

      {/* Right: Actions Hierarchy */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Primary Action: Add Reviewer */}
        <button
          onClick={() => setAddCriticOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-[#C85A3E] hover:bg-[#B34B31] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
          title="Add a new specialized Critic Agent to the council"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Reviewer</span>
        </button>

        {/* Slide-Over Drawer Toggle */}
        <button
          onClick={() => setInspectorOpen(!isInspectorOpen)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            isInspectorOpen
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white/80 border-stone-200/90 text-stone-700 hover:bg-stone-100/80'
          }`}
          title="Toggle Inspection Drawer"
        >
          <PanelRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspector</span>
          <span
            className={`text-[10px] font-mono px-1 rounded ${
              isInspectorOpen ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-600'
            }`}
          >
            {findings.length}
          </span>
        </button>

        {/* Pods Architecture */}
        <button
          onClick={() => setMultiDevModalOpen(true)}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/80 border border-stone-200/90 hover:bg-stone-100/80 text-stone-600 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="View Multi-Dev Pods Architecture"
        >
          <Network className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden md:inline">Pods</span>
        </button>

        {/* PR Preview Button */}
        <button
          onClick={() => setPRSummaryOpen(true)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            workflowState === 'PR_READY' || workflowState === 'VERIFIED'
              ? 'bg-[#0D5F3A] hover:bg-[#0A4B2E] text-white border-[#0D5F3A] shadow-xs'
              : 'bg-white/80 border-stone-200/90 text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
          }`}
          title="Open Verified Pull Request Modal"
        >
          <GitPullRequest className={`w-3.5 h-3.5 ${workflowState === 'PR_READY' || workflowState === 'VERIFIED' ? 'text-white' : 'text-stone-500'}`} />
          <span>PR #{workflowState === 'PR_READY' || workflowState === 'VERIFIED' ? '42 (Verified)' : 'Preview'}</span>
        </button>

        <div className="h-4 w-px bg-stone-200/80 mx-0.5" />

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title={soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
        </button>

        {/* Reset Workflow */}
        <button
          onClick={resetWorkflow}
          className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title="Reset Demo Workflow (R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
