'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  Users,
  Bot,
  Server,
  Terminal,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  FileCode2
} from 'lucide-react';

export const StudioRosterDock: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const critics = useCouncilStore((state) => state.critics);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const selectedStation = useCouncilStore((state) => state.selectedStation);
  const cameraFocus = useCouncilStore((state) => state.cameraFocus);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const sandboxState = useCouncilStore((state) => state.sandboxState);

  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const setCameraFocus = useCouncilStore((state) => state.setCameraFocus);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);
  const removeCritic = useCouncilStore((state) => state.removeCritic);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);

  const getWorkerStatusBadge = (status: string, role: string) => {
    switch (status) {
      case 'found_issue':
        return { text: 'Bug Found!', cls: 'bg-red-100 text-red-800 border-red-300' };
      case 'submitting':
        return { text: 'Proving', cls: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'reviewing':
        return { text: 'Reviewing', cls: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'approved':
      case 'celebrating':
        return { text: 'Approved', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'waiting_sandbox':
        return { text: 'Wait Gate', cls: 'bg-stone-100 text-stone-500 border-stone-200' };
      case 'entering':
        return { text: 'Walking...', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        if (
          role === 'style' &&
          (workflowState === 'PROOF_VERIFICATION' ||
            workflowState === 'MAIN_AGENT_ARBITRATION' ||
            workflowState === 'REVISION_IN_PROGRESS')
        ) {
          return { text: 'Filtered', cls: 'bg-rose-50 text-rose-700 border-rose-200' };
        }
        return { text: 'Seated', cls: 'bg-stone-100 text-stone-600 border-stone-200/80' };
    }
  };

  if (isCollapsed) {
    return (
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => setIsCollapsed(false)}
          className="px-3 py-2 rounded-xl bg-[#FAF8F5]/95 hover:bg-white border border-stone-200/90 backdrop-blur-xl shadow-lg text-xs font-medium text-stone-800 flex items-center gap-2 transition-all cursor-pointer group"
          title="Expand Office Directory & Worker Navigation"
        >
          <Users className="w-3.5 h-3.5 text-[#C85A3E]" />
          <span>Office Roster ({critics.length + 3})</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className="absolute top-3 left-3 z-20 w-68 max-h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-[#FAF8F5]/92 backdrop-blur-xl border border-stone-200/90 shadow-xl overflow-hidden text-stone-800 transition-all"
      style={{
        boxShadow: '0 12px 32px -6px rgba(45, 35, 25, 0.12)'
      }}
    >
      {/* Header Bar */}
      <div className="px-3.5 py-2.5 border-b border-stone-200/80 bg-white/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C85A3E]" />
          <span className="text-xs font-semibold text-stone-900 tracking-tight">
            Studio Navigator
          </span>
        </div>
        <div className="flex items-center gap-1">
          {cameraFocus !== 'overview' && (
            <button
              onClick={() => {
                selectStation(null);
                setCameraFocus('overview');
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset 3D camera to full studio overview"
            >
              <Eye className="w-2.5 h-2.5" />
              <span>Overview</span>
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Collapse Roster Dock"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Directory Body */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3 no-scrollbar">
        {/* 1. Core Stations Section */}
        <div className="space-y-1">
          <div className="px-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Core Stations (3)
            </span>
            <span className="text-[9.5px] font-mono text-stone-400">Click to focus</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {/* Main Arbiter */}
            <button
              onClick={() => selectStation('arbiter')}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedStation === 'arbiter'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white/75 hover:bg-white border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    selectedStation === 'arbiter'
                      ? 'bg-indigo-500/30 text-amber-300'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  }`}
                >
                  <Bot className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-semibold leading-tight truncate">Main Arbiter</div>
                  <div
                    className={`text-[9.5px] font-mono truncate ${
                      selectedStation === 'arbiter' ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    Round Table &bull; Facing South
                  </div>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  workflowState === 'MAIN_AGENT_ARBITRATION'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : selectedStation === 'arbiter'
                    ? 'bg-white/10 text-stone-200 border-white/15'
                    : 'bg-stone-100 text-stone-600 border-stone-200/80'
                }`}
              >
                {workflowState === 'MAIN_AGENT_ARBITRATION' ? 'Arbitrating' : 'Lead'}
              </span>
            </button>

            {/* Deterministic Sandbox */}
            <button
              onClick={() => selectStation('sandbox')}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedStation === 'sandbox'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white/75 hover:bg-white border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    selectedStation === 'sandbox'
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : 'bg-emerald-50 text-[#0D5F3A] border border-emerald-200/60'
                  }`}
                >
                  <Server className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-semibold leading-tight truncate">Sandbox Kiln</div>
                  <div
                    className={`text-[9.5px] font-mono truncate ${
                      selectedStation === 'sandbox' ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    Zero-Token Fast-Fail Gate
                  </div>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  sandboxState.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : sandboxState.status === 'running'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : selectedStation === 'sandbox'
                    ? 'bg-white/10 text-stone-200 border-white/15'
                    : 'bg-stone-100 text-stone-600 border-stone-200/80'
                }`}
              >
                {sandboxState.status === 'passed'
                  ? '4/4 Green'
                  : sandboxState.status === 'running'
                  ? 'Running'
                  : 'Standby'}
              </span>
            </button>

            {/* Coding Agent */}
            <button
              onClick={() => {
                selectStation('coder');
                setCodeViewMode('diff');
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedStation === 'coder'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white/75 hover:bg-white border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    selectedStation === 'coder'
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-semibold leading-tight truncate">Coding Agent</div>
                  <div
                    className={`text-[9.5px] font-mono truncate ${
                      selectedStation === 'coder' ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    Drafting Desk &bull; Patcher
                  </div>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  workflowState === 'REVISION_IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    : selectedStation === 'coder'
                    ? 'bg-white/10 text-stone-200 border-white/15'
                    : 'bg-stone-100 text-stone-600 border-stone-200/80'
                }`}
              >
                {workflowState === 'REVISION_IN_PROGRESS' ? 'Patching' : 'Builder'}
              </span>
            </button>
          </div>
        </div>

        {/* 2. Critic Council Workers Section */}
        <div className="space-y-1.5">
          <div className="px-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold">
              Critic Workers ({critics.length}/6 Desks)
            </span>
            {critics.length < 6 && (
              <button
                onClick={() => setAddCriticOpen(true)}
                className="text-[10px] font-mono font-semibold text-[#C85A3E] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>Add</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            {critics.map((critic) => {
              const isSelected = selectedAgentId === critic.id;
              const badge = getWorkerStatusBadge(critic.status, critic.role);

              return (
                <div
                  key={critic.id}
                  onClick={() => selectAgent(critic.id)}
                  className={`px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white/75 hover:bg-white border-stone-200/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-black/5"
                        style={{ backgroundColor: critic.accentColor }}
                      />
                      <div className="truncate">
                        <div className="text-[11px] font-semibold leading-tight truncate">
                          {critic.name}
                        </div>
                        <div
                          className={`text-[9.5px] font-mono truncate ${
                            isSelected ? 'text-stone-300' : 'text-stone-400'
                          }`}
                        >
                          Desk #{critic.deskIndex + 1} &bull; {critic.role} &bull; {critic.model}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-white/15 text-amber-200 border-white/20'
                            : badge.cls
                        }`}
                      >
                        {badge.text}
                      </span>
                      {critic.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCritic(critic.id);
                          }}
                          className={`p-0.5 rounded transition-colors cursor-pointer ${
                            isSelected
                              ? 'text-stone-400 hover:text-rose-300'
                              : 'text-stone-400 hover:text-rose-600'
                          }`}
                          title="Remove custom reviewer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Vacant Desk Invite Button */}
            {critics.length < 6 && (
              <button
                onClick={() => setAddCriticOpen(true)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-dashed border-stone-300 hover:border-[#C85A3E] bg-stone-100/40 hover:bg-[#C85A3E]/5 text-stone-500 hover:text-[#C85A3E] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Reviewer to Desk #{critics.length + 1}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="px-3 py-2 border-t border-stone-200/80 bg-stone-100/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
        <span>Drag to Orbit &bull; Scroll to Zoom</span>
        <button
          onClick={() => {
            selectStation('coder');
            setCodeViewMode('diff');
          }}
          className="text-[#C85A3E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <FileCode2 className="w-3 h-3" />
          <span>View Diff</span>
        </button>
      </div>
    </aside>
  );
};
