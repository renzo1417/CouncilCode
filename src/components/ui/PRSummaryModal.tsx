'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { GitPullRequest, CheckCircle2, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '@/utils/sound';
import { ModalDialog } from './ModalDialog';

export const PRSummaryModal: React.FC = () => {
  const isPRSummaryOpen = useCouncilStore((state) => state.isPRSummaryOpen);
  const setPRSummaryOpen = useCouncilStore((state) => state.setPRSummaryOpen);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const soundEnabled = useCouncilStore((state) => state.soundEnabled);

  const [isMerged, setIsMerged] = useState(false);

  const handleMerge = () => {
    setIsMerged(true);
    if (soundEnabled) playSound('pr_success');
    confetti({
      particleCount: 100,
      spread: 65,
      origin: { y: 0.6 }
    });
  };

  const isVerified = workflowState === 'VERIFIED' || workflowState === 'PR_READY';

  const auditItems = [
    { label: 'Deterministic sandbox fast-fail gate', result: '4 of 4 passed', ok: true },
    { label: 'Cross-vendor critic council consensus', result: '1 proof verified', ok: true },
    { label: 'Executable exploit reproduction & patch', result: 'Reproduced & fixed', ok: true },
    { label: 'Unproved style claims filtered', result: '1 claim blocked', ok: false }
  ];

  return (
    <ModalDialog
      open={isPRSummaryOpen}
      onClose={() => setPRSummaryOpen(false)}
      titleId="pr-summary-title"
      maxWidthClass="max-w-xl"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px] text-[#575550]">
            <span>councilcode / billing-service</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                isMerged || isVerified
                  ? 'bg-[#ECFDF3] text-[#166534]'
                  : 'bg-[#F2F1EE] text-[#575550]'
              }`}
            >
              {isMerged ? 'Merged' : isVerified ? 'Verified green' : 'Preview'}
            </span>
          </div>
          <h2 id="pr-summary-title" className="text-[16px] font-semibold text-[#141413] mt-1 leading-snug">
            Pull Request #42: Enforce tenant isolation on invoice lookup
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setPRSummaryOpen(false)}
          aria-label="Close modal"
          className="h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5 overflow-y-auto cc-scroll">
        <div
          className={`p-3.5 rounded-xl border text-[13px] leading-relaxed ${
            isVerified
              ? 'bg-[#ECFDF3] border-[#BBF7D0] text-[#166534]'
              : 'bg-[#F6F5F2] border-[#E6E4DF] text-[#575550]'
          }`}
        >
          <div className="font-semibold text-[#141413]">
            {isVerified ? 'Proof-gated verification complete' : 'Verification in progress'}
          </div>
          <p className="mt-0.5">
            One clean, green-tested pull request ready for human sign-off. Only reproducible bugs backed by sandbox assertions reached this PR.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-[12px] font-medium text-[#6B6862]">
            Verification checklist
          </div>
          <div className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
            {auditItems.map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 bg-white flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="flex items-center gap-2.5 text-[#141413] min-w-0">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${item.ok ? 'text-[#15803D]' : 'text-[#6B6862]'}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span
                  className={`text-[12.5px] font-medium tabular-nums shrink-0 ${
                    item.ok ? 'text-[#166534]' : 'text-[#575550]'
                  }`}
                >
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F6F5F2] border border-[#E6E4DF] space-y-1">
          <div className="flex items-center justify-between text-[12px] text-[#6B6862]">
            <span>Audit digest</span>
            <span className="font-medium text-[#575550]">SHA256-ED25519</span>
          </div>
          <div className="text-[12.5px] text-[#575550] break-all">
            cc_proof_9f82d1c6e4a05b387921a94e823b1029c784e1f6a5b9c0d2e4f6
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#E6E4DF] flex items-center justify-between gap-3 shrink-0">
        <span className="text-[13px] text-[#575550]">
          Reviewer: <span className="font-medium text-[#141413]">Human Tech Lead</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPRSummaryOpen(false)}
            className="h-9 px-3.5 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[13px] font-medium text-[#575550] hover:text-[#141413] transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleMerge}
            disabled={isMerged}
            className={`h-9 px-4 rounded-lg text-[13px] font-medium flex items-center gap-1.5 cc-press ${
              isMerged
                ? 'bg-[#ECFDF3] text-[#166534] border border-[#BBF7D0] cursor-default'
                : 'bg-[#166534] hover:bg-[#14532D] text-white cursor-pointer'
            }`}
          >
            {isMerged ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <GitPullRequest className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{isMerged ? 'Pull request merged' : 'Merge pull request'}</span>
          </button>
        </div>
      </div>
    </ModalDialog>
  );
};
