'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { X, FileKey, Layers, GitMerge } from 'lucide-react';
import { ModalDialog } from './ModalDialog';

export const MultiDevModal: React.FC = () => {
  const isMultiDevModalOpen = useCouncilStore((state) => state.isMultiDevModalOpen);
  const setMultiDevModalOpen = useCouncilStore((state) => state.setMultiDevModalOpen);

  const steps = [
    {
      icon: FileKey,
      title: 'Contract handshake & locked schemas',
      description:
        'A System Architect agent locks OpenAPI specs and shared types before implementation starts so parallel branches stay aligned.'
    },
    {
      icon: Layers,
      title: 'Parallel frontend & backend pods',
      description:
        'Each pod runs its own Coding Agent, deterministic sandbox, and dedicated Critic Council independently.'
    },
    {
      icon: GitMerge,
      title: 'Higher council & integration sandbox',
      description:
        'Once pods pass local review, the Higher Council verifies cross-service contracts and runs end-to-end integration tests before opening linked PRs.'
    }
  ];

  return (
    <ModalDialog
      open={isMultiDevModalOpen}
      onClose={() => setMultiDevModalOpen(false)}
      titleId="multidev-modal-title"
      maxWidthClass="max-w-xl"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-start justify-between gap-3 shrink-0">
        <div>
          <span className="text-[12px] text-[#6B6862]">Team pods architecture</span>
          <h2 id="multidev-modal-title" className="text-[16px] font-semibold text-[#141413] mt-0.5">
            Two-tier consensus for multi-developer teams
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setMultiDevModalOpen(false)}
          aria-label="Close modal"
          className="h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 overflow-y-auto cc-scroll">
        <p className="text-[13px] text-[#575550] leading-relaxed">
          In multi-developer teams, AI-written code drifts apart and causes interface conflicts at integration time. CouncilCode coordinates pods with a shared contract:
        </p>

        <ol className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="p-4 bg-white flex items-start gap-3">
                <Icon className="w-4 h-4 text-[#575550] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <div className="text-[13.5px] font-semibold text-[#141413]">{step.title}</div>
                  <p className="text-[12.5px] text-[#575550] leading-relaxed">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="px-3.5 py-2.5 rounded-xl bg-[#F6F5F2] border border-[#E6E4DF] flex items-center justify-between text-[12.5px]">
          <span className="text-[#6B6862]">Current walkthrough</span>
          <span className="font-medium text-[#141413]">Single-developer proof-gated loop</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E6E4DF] flex justify-end shrink-0">
        <button
          type="button"
          onClick={() => setMultiDevModalOpen(false)}
          className="h-9 px-4 rounded-lg text-[13px] font-medium bg-[#141413] hover:bg-[#2A2A28] text-white cc-press cursor-pointer"
        >
          Done
        </button>
      </div>
    </ModalDialog>
  );
};
