'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  GitPullRequest,
  CheckCircle2,
  ShieldCheck,
  X,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '@/utils/sound';

export const PRSummaryModal: React.FC = () => {
  const isPRSummaryOpen = useCouncilStore((state) => state.isPRSummaryOpen);
  const setPRSummaryOpen = useCouncilStore((state) => state.setPRSummaryOpen);
  const workflowState = useCouncilStore((state) => state.workflowState);
  const soundEnabled = useCouncilStore((state) => state.soundEnabled);

  const [isMerged, setIsMerged] = useState(false);

  if (!isPRSummaryOpen) return null;

  const handleMerge = () => {
    setIsMerged(true);
    if (soundEnabled) playSound('pr_success');
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const isVerified = workflowState === 'VERIFIED' || workflowState === 'PR_READY';

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
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#0D5F3A]">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-500">councilcode / billing-service</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium bg-emerald-100 text-[#0D5F3A] border border-emerald-200">
                  {isMerged ? 'MERGED' : isVerified ? 'VERIFIED GREEN' : 'INSPECTION'}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-stone-900 mt-0.5 font-sans">
                Pull Request #42: fix(api): enforce tenant isolation on invoice lookup
              </h2>
            </div>
          </div>
          <button
            onClick={() => setPRSummaryOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Box */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isVerified
                ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                : 'bg-stone-100/70 border-stone-200 text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#0D5F3A]" />
            <div>
              <h3 className="text-xs font-semibold text-stone-900">
                CouncilCode Proof-Gated Verification Complete
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                One clean, green-tested PR ready for human sign-off. AI critics proved vulnerabilities with executable test evidence in the deterministic sandbox kiln.
              </p>
            </div>
          </div>

          {/* Verification Audit Checklist */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-medium text-stone-500 uppercase tracking-wider">
              Verification Audit Checklist
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5F3A]" />
                  <span>Deterministic Sandbox (Zero-Token Fast Fail)</span>
                </span>
                <span className="font-mono text-[#0D5F3A] text-[11px] font-medium">4/4 Passed</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5F3A]" />
                  <span>Cross-Vendor Critic Council Consensus</span>
                </span>
                <span className="font-mono text-[#0D5F3A] text-[11px] font-medium">1 Proof Verified</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5F3A]" />
                  <span>Proof Gate Executable Assertion</span>
                </span>
                <span className="font-mono text-[#0D5F3A] text-[11px] font-medium">Exploit Reproduced &amp; Patched</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-between">
                <span className="flex items-center gap-2 text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Unverified Noise &amp; Hallucinations Filtered Out</span>
                </span>
                <span className="font-mono text-stone-500 text-[11px]">1 Noise Claim Blocked</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Proof Audit Trail */}
          <div className="p-3 rounded-lg bg-white border border-stone-200/80 text-[11px] font-mono space-y-1">
            <div className="text-stone-500 flex items-center justify-between">
              <span>Cryptographic Audit Digest:</span>
              <span className="text-stone-700 font-semibold">SHA256-ED25519</span>
            </div>
            <div className="text-stone-600 text-[10px] break-all bg-stone-50 p-1.5 rounded border border-stone-200/60">
              cc_proof_9f82d1c6e4a05b387921a94e823b1029c784e1f6a5b9c0d2e4f6
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-stone-200/80 bg-white/70 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Reviewer: <span className="text-stone-900 font-medium">Human Tech Lead</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPRSummaryOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleMerge}
              disabled={isMerged}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98] ${
                isMerged
                  ? 'bg-stone-100 text-[#0D5F3A] border border-emerald-300 cursor-default'
                  : 'bg-[#0D5F3A] hover:bg-[#0A4B2E] text-white'
              }`}
            >
              {isMerged ? <Check className="w-3.5 h-3.5" /> : <GitPullRequest className="w-3.5 h-3.5" />}
              <span>{isMerged ? 'Pull Request Merged' : '1-Click Merge (Verified PR)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
