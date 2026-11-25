'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  Bot,
  Server,
  Terminal,
  Plus,
  X,
  Trash2
} from 'lucide-react';

const MODEL_LABELS: Record<string, string> = {
  anthropic: 'Claude',
  deepseek: 'DeepSeek',
  openai: 'GPT-4o',
  google: 'Gemini'
};

const ROLE_LABELS: Record<string, string> = {
  security: 'Security',
  logic: 'Logic',
  contract: 'Contract',
  performance: 'Performance',
  style: 'Style'
};

export const StudioRosterDock: React.FC = () => {
  const isRosterOpen = useCouncilStore((state) => state.isRosterOpen);
  const setRosterOpen = useCouncilStore((state) => state.setRosterOpen);

  const critics = useCouncilStore((state) => state.critics);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const selectedStation = useCouncilStore((state) => state.selectedStation);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const sandboxState = useCouncilStore((state) => state.sandboxState);

  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);
  const removeCritic = useCouncilStore((state) => state.removeCritic);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);

  const getWorkerStatus = (status: string, role: string) => {
    switch (status) {
      case 'found_issue':
        return { text: 'Bug found', cls: 'bg-[#FEF2F2] text-[#991B1B]' };
      case 'submitting':
        return { text: 'Proving', cls: 'bg-[#FFFBEB] text-[#92400E]' };
      case 'reviewing':
        return { text: 'Reviewing', cls: 'bg-[#FFFBEB] text-[#92400E]' };
      case 'approved':
      case 'celebrating':
        return { text: 'Approved', cls: 'bg-[#ECFDF3] text-[#166534]' };
      case 'waiting_sandbox':
        return { text: 'Waiting', cls: 'bg-[#F2F1EE] text-[#575550]' };
      case 'entering':
        return { text: 'Joining', cls: 'bg-[#F2F1EE] text-[#575550]' };
      default:
        if (
          role === 'style' &&
          (workflowState === 'PROOF_VERIFICATION' ||
            workflowState === 'MAIN_AGENT_ARBITRATION' ||
            workflowState === 'REVISION_IN_PROGRESS')
        ) {
          return { text: 'Filtered', cls: 'bg-[#FEF2F2] text-[#991B1B]' };
        }
        return null;
    }
  };

  const sandboxStatusLabel =
    sandboxState.status === 'passed'
      ? 'Passed'
      : sandboxState.status === 'running'
      ? 'Running'
      : null;

  const arbiterStatusLabel =
    workflowState === 'MAIN_AGENT_ARBITRATION' ? 'Arbitrating' : null;

  const coderStatusLabel =
    workflowState === 'REVISION_IN_PROGRESS' ? 'Patching' : null;

  return (
    <aside
      aria-label="Studio roster"
      inert={!isRosterOpen ? true : undefined}
      className={`fixed top-17 left-3 z-20 w-72 max-w-[calc(100vw-24px)] max-h-[calc(100dvh-176px)] flex flex-col rounded-xl bg-white border border-[#E6E4DF] text-[#141413] overflow-hidden transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-[opacity] ${
        isRosterOpen
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-2 pointer-events-none motion-reduce:translate-x-0'
      }`}
      style={{
        boxShadow: '0 2px 10px rgb(20 20 19 / 0.06)'
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E6E4DF] flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[#141413]">Studio roster</h2>
        <button
          type="button"
          onClick={() => setRosterOpen(false)}
          aria-label="Close roster"
          className="h-7 w-7 rounded-md text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable Directory */}
      <div className="flex-1 overflow-y-auto cc-scroll p-3 space-y-4">
        {/* Stations */}
        <section aria-label="Core stations" className="space-y-1.5">
          <div className="px-2 text-[12px] font-medium text-[#6B6862]">
            Stations
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => selectStation('arbiter', true)}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                selectedStation === 'arbiter'
                  ? 'bg-[#F2F1EE] text-[#141413]'
                  : 'hover:bg-[#F6F5F2] text-[#141413]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Bot className="w-4 h-4 text-[#575550] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className={`text-[13px] leading-tight truncate ${selectedStation === 'arbiter' ? 'font-semibold' : 'font-medium'}`}>
                    Main Arbiter
                  </div>
                  <div className="text-[12px] text-[#6B6862] truncate">
                    Reconciles verified proofs
                  </div>
                </div>
              </div>
              {arbiterStatusLabel && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#92400E] shrink-0">
                  {arbiterStatusLabel}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => selectStation('sandbox', true)}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                selectedStation === 'sandbox'
                  ? 'bg-[#F2F1EE] text-[#141413]'
                  : 'hover:bg-[#F6F5F2] text-[#141413]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Server className="w-4 h-4 text-[#575550] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className={`text-[13px] leading-tight truncate ${selectedStation === 'sandbox' ? 'font-semibold' : 'font-medium'}`}>
                    Sandbox Kiln
                  </div>
                  <div className="text-[12px] text-[#6B6862] truncate">
                    Fast-fail build &amp; test gate
                  </div>
                </div>
              </div>
              {sandboxStatusLabel && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                    sandboxState.status === 'passed'
                      ? 'bg-[#ECFDF3] text-[#166534]'
                      : 'bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {sandboxStatusLabel}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                selectStation('coder', true);
                setCodeViewMode('diff');
              }}
              className={`w-full px-2.5 py-2 rounded-lg text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                selectedStation === 'coder'
                  ? 'bg-[#F2F1EE] text-[#141413]'
                  : 'hover:bg-[#F6F5F2] text-[#141413]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Terminal className="w-4 h-4 text-[#575550] shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className={`text-[13px] leading-tight truncate ${selectedStation === 'coder' ? 'font-semibold' : 'font-medium'}`}>
                    Coding Agent
                  </div>
                  <div className="text-[12px] text-[#6B6862] truncate">
                    Applies verified patches
                  </div>
                </div>
              </div>
              {coderStatusLabel && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFFBEB] text-[#92400E] shrink-0">
                  {coderStatusLabel}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Reviewers */}
        <section aria-label="Critic council reviewers" className="space-y-1.5">
          <div className="px-2 flex items-center justify-between text-[12px] font-medium text-[#6B6862]">
            <span>Reviewers</span>
            <span className="tabular-nums">{critics.length} of 6</span>
          </div>

          <div className="space-y-1">
            {critics.map((critic) => {
              const isSelected = selectedAgentId === critic.id;
              const statusBadge = getWorkerStatus(critic.status, critic.role);

              return (
                <div
                  key={critic.id}
                  className={`rounded-lg flex items-center justify-between gap-1 transition-colors ${
                    isSelected ? 'bg-[#F2F1EE]' : 'hover:bg-[#F6F5F2]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectAgent(critic.id)}
                    className="flex-1 min-w-0 px-2.5 py-2 text-left flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: critic.accentColor }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <div className={`text-[13px] text-[#141413] leading-tight truncate ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                          {critic.name}
                        </div>
                        <div className="text-[12px] text-[#6B6862] truncate">
                          {ROLE_LABELS[critic.role] || critic.role} &middot; {MODEL_LABELS[critic.model] || critic.model}
                        </div>
                      </div>
                    </div>

                    {statusBadge && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge.cls}`}>
                        {statusBadge.text}
                      </span>
                    )}
                  </button>

                  {critic.isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCritic(critic.id)}
                      aria-label={`Remove ${critic.name}`}
                      title={`Remove ${critic.name}`}
                      className="mr-1.5 h-7 w-7 rounded-md text-[#6B6862] hover:text-[#991B1B] hover:bg-[#FEF2F2] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {critics.length < 6 && (
            <button
              type="button"
              onClick={() => setAddCriticOpen(true)}
              className="w-full h-9 mt-1.5 px-3 rounded-lg border border-dashed border-[#D4D1CA] hover:border-[#141413] hover:bg-[#F6F5F2] text-[#575550] hover:text-[#141413] text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add reviewer</span>
            </button>
          )}
        </section>
      </div>
    </aside>
  );
};
