'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { Network, X, Layers, GitMerge, FileKey } from 'lucide-react';

export const MultiDevModal: React.FC = () => {
  const isMultiDevModalOpen = useCouncilStore((state) => state.isMultiDevModalOpen);
  const setMultiDevModalOpen = useCouncilStore((state) => state.setMultiDevModalOpen);

  if (!isMultiDevModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-stone-800"
        style={{
          boxShadow: '0 20px 48px -8px rgba(45, 35, 25, 0.16)'
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-500">CouncilCode Architecture</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium bg-stone-100 text-stone-700 border border-stone-200">
                  team pods
                </span>
              </div>
              <h2 className="text-sm font-semibold text-stone-900 font-sans mt-0.5">
                Multi-Developer Mode: Pods &amp; Two-Tier Consensus
              </h2>
            </div>
          </div>
          <button
            onClick={() => setMultiDevModalOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-stone-600 leading-relaxed">
            In multi-developer teams, AI-written code drifts apart and causes interface conflicts.
            CouncilCode solves this with a two-tier consensus model:
          </p>

          {/* Step 1: Contract Handshake */}
          <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-900">
              <FileKey className="w-3.5 h-3.5 text-[#C85A3E]" />
              <span>1. Contract Handshake &amp; Locked Schemas</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              System Architect agent locks API schemas, OpenAPI specs, and shared types before coding starts.
              The contract is committed to prevent interface drift.
            </p>
          </div>

          {/* Step 2: Parallel Pods */}
          <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-900">
              <Layers className="w-3.5 h-3.5 text-stone-700" />
              <span>2. Parallel Frontend &amp; Backend Pods</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Each pod operates its own Pod Main Agent, Coding Agents, and dedicated Critic Council.
              Pods independently clear their local deterministic sandboxes.
            </p>
          </div>

          {/* Step 3: Higher Council Arbitration */}
          <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-900">
              <GitMerge className="w-3.5 h-3.5 text-[#0D5F3A]" />
              <span>3. Higher Council &amp; Integration Sandbox</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Once both pods pass local review, the Higher Council inspects contract conformance and cross-service security
              without re-judging what pods already approved. Integration sandbox runs end-to-end tests and coordinates linked PRs.
            </p>
          </div>

          {/* Status Note */}
          <div className="p-3 rounded-lg bg-stone-100/70 border border-stone-200/80 text-xs text-stone-600 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone-500">Current Demo Mode:</span>
            <span className="font-medium text-stone-900 text-xs">Single-Developer Proof-Gated Engine (Live)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-stone-200/80 bg-white/70 flex justify-end">
          <button
            onClick={() => setMultiDevModalOpen(false)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
