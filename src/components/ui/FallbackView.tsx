'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { Shield, Server, Bot, Terminal } from 'lucide-react';

export const FallbackView: React.FC = () => {
  const critics = useCouncilStore((state) => state.critics);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const sandboxState = useCouncilStore((state) => state.sandboxState);
  const selectAgent = useCouncilStore((state) => state.selectAgent);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);

  return (
    <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">CouncilCode 2D Interactive Office Matrix</h2>
              <p className="text-xs text-slate-400">Standard 2D WebGL Fallback View</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
            {workflowState}
          </span>
        </div>

        {/* Central Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Arbiter */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-amber-400" /> Main Arbiter Station
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                Sole Arbiter
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Enforcing proof gate and maximum 2 revision loops. Reconciling verified findings.
            </p>
            <div className="text-xs font-mono text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-900/50">
              Status: {workflowState === 'MAIN_AGENT_ARBITRATION' ? 'Arbitrating Findings' : 'Monitoring'}
            </div>
          </div>

          {/* Deterministic Sandbox */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-sky-400" /> Deterministic Sandbox
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                Zero-Token Gate
              </span>
            </div>
            <div className="space-y-1 my-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Linter / Biome:</span>
                <span className="text-emerald-400 font-mono">Passed</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>TypeScript tsc:</span>
                <span className="text-emerald-400 font-mono">Passed</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Unit Suite:</span>
                <span className="text-emerald-400 font-mono">{sandboxState.baselineTests}</span>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
              {sandboxState.status === 'passed' ? '✅ Sandbox Gate Cleared' : 'Running Checks...'}
            </div>
          </div>

          {/* Coding Agent */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-blue-400" /> Coding Agent
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                Builder
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Maintains repository. Applies P0 patches assigned by Main Arbiter.
            </p>
            <div className="text-xs font-mono text-blue-400 bg-blue-950/40 p-2 rounded border border-blue-900/50">
              Target: src/api/routes/invoices.ts
            </div>
          </div>
        </div>

        {/* Critic Council Workstations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Critic Council Workstations ({critics.length}/6)
            </h3>
            <button
              onClick={() => setAddCriticOpen(true)}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              + Add Critic
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {critics.map((critic) => (
              <div
                key={critic.id}
                onClick={() => selectAgent(critic.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedAgentId === critic.id
                    ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: critic.accentColor }}
                    />
                    <span className="text-xs font-bold text-white">{critic.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {critic.model}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 capitalize mb-2">{critic.role} Reviewer</div>
                <div className="text-[11px] text-slate-300 font-mono bg-slate-950 p-2 rounded line-clamp-2">
                  {critic.currentThought}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
