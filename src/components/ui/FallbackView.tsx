'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { Server, Bot, Terminal, Plus } from 'lucide-react';

export const FallbackView: React.FC = () => {
  const critics = useCouncilStore((state) => state.critics);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const sandboxState = useCouncilStore((state) => state.sandboxState);
  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectStation = useCouncilStore((state) => state.selectStation);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);

  return (
    <div className="w-full h-full bg-[#F6F5F2] p-6 pb-36 overflow-y-auto cc-scroll text-[#141413]">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E4DF] pb-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#141413]">
              CouncilCode Studio Overview
            </h2>
            <p className="text-[13px] text-[#575550] mt-0.5">
              2D workspace view (WebGL unavailable in this browser)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-white border border-[#E6E4DF] text-[#575550]">
            {workflowState.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>

        {/* Core Stations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => selectStation('arbiter', true)}
            className="p-4 rounded-xl bg-white border border-[#E6E4DF] hover:border-[#D4D1CA] text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#141413] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#575550]" aria-hidden="true" />
                Main Arbiter
              </span>
              <span className="text-[12px] text-[#6B6862]">Sole arbiter</span>
            </div>
            <p className="text-[13px] text-[#575550] leading-relaxed">
              Enforces proof gate and reconciles verified findings within two revision loops.
            </p>
            <div className="text-[12.5px] font-medium text-[#141413]">
              {workflowState === 'MAIN_AGENT_ARBITRATION' ? 'Arbitrating findings' : 'Monitoring'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectStation('sandbox', true)}
            className="p-4 rounded-xl bg-white border border-[#E6E4DF] hover:border-[#D4D1CA] text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#141413] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#575550]" aria-hidden="true" />
                Sandbox Kiln
              </span>
              <span className="text-[12px] text-[#6B6862]">Zero-token gate</span>
            </div>
            <div className="space-y-1 text-[13px] text-[#575550]">
              <div className="flex justify-between">
                <span>Linter / Biome</span>
                <span className="font-medium text-[#141413] capitalize">{sandboxState.linter}</span>
              </div>
              <div className="flex justify-between">
                <span>TypeScript</span>
                <span className="font-medium text-[#141413] capitalize">{sandboxState.typecheck}</span>
              </div>
              <div className="flex justify-between">
                <span>Baseline tests</span>
                <span className="font-medium text-[#141413] capitalize">{sandboxState.baselineTests}</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectStation('coder', true)}
            className="p-4 rounded-xl bg-white border border-[#E6E4DF] hover:border-[#D4D1CA] text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#141413] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#575550]" aria-hidden="true" />
                Coding Agent
              </span>
              <span className="text-[12px] text-[#6B6862]">Builder</span>
            </div>
            <p className="text-[13px] text-[#575550] leading-relaxed">
              Applies verified security patches assigned by the Main Arbiter.
            </p>
            <div className="text-[12.5px] font-medium text-[#141413] truncate">
              src/api/routes/invoices.ts
            </div>
          </button>
        </div>

        {/* Critic Council */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#141413]">
              Critic Council ({critics.length} of 6)
            </h3>
            {critics.length < 6 && (
              <button
                type="button"
                onClick={() => setAddCriticOpen(true)}
                className="h-8 px-3 rounded-lg bg-white border border-[#E6E4DF] hover:bg-[#F2F1EE] text-[13px] font-medium text-[#141413] flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add reviewer</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {critics.map((critic) => (
              <button
                key={critic.id}
                type="button"
                onClick={() => selectAgent(critic.id)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  selectedAgentId === critic.id
                    ? 'bg-[#F2F1EE] border-[#141413]'
                    : 'bg-white border-[#E6E4DF] hover:border-[#D4D1CA]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: critic.accentColor }}
                      aria-hidden="true"
                    />
                    <span className="text-[13.5px] font-semibold text-[#141413] truncate">{critic.name}</span>
                  </div>
                  <span className="text-[12px] text-[#6B6862] capitalize shrink-0">
                    {critic.model}
                  </span>
                </div>
                <div className="text-[12px] text-[#6B6862] capitalize mb-2">{critic.role} reviewer</div>
                <p className="text-[12.5px] text-[#575550] line-clamp-2 leading-relaxed">
                  {critic.currentThought}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
