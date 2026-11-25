'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check, X, SlidersHorizontal } from 'lucide-react';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

type KeySetup = 'cloud' | 'hybrid' | 'offline';

const KEY_SETUPS: Record<
  KeySetup,
  { label: string; note: string; models: [string, string, string] }
> = {
  cloud: {
    label: 'Any cloud API keys',
    note: 'Mix rival providers from your local OS keychain with zero token markup.',
    models: ['Model A (Security)', 'Model B (Logic)', 'Model C (Style)']
  },
  hybrid: {
    label: 'Cloud + local models',
    note: 'Pair a frontier cloud API with a local open-weights reviewer.',
    models: ['Cloud Model A', 'Local Ollama Reviewer', 'OpenAI-Compatible Gateway']
  },
  offline: {
    label: '100% offline CLI',
    note: 'Run locally with Docker/WASM sandboxes and local models, completely free.',
    models: ['Local Security Model', 'Local Reasoning Model', 'Local Fast Reviewer']
  }
};

interface ReviewItem {
  id: string;
  slotIndex: 0 | 1 | 2;
  summary: string;
  evidence: string;
  proved: boolean;
  outcome: string;
}

const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 'auth',
    slotIndex: 0,
    summary: 'Any signed-in user can view another team’s private billing data.',
    evidence: 'Failing test reproduced: expected 403 Blocked, received 200 OK.',
    proved: true,
    outcome: 'Kept & auto-patched'
  },
  {
    id: 'null',
    slotIndex: 1,
    summary: 'Missing account context crashes the request instead of handling it safely.',
    evidence: 'Failing test reproduced: unhandled null exception on missing user.',
    proved: true,
    outcome: 'Kept & auto-patched'
  },
  {
    id: 'style',
    slotIndex: 2,
    summary: 'Rewrite this helper using chained functional pipes and shorter variable names.',
    evidence: 'No failing test supplied: subjective style preference only.',
    proved: false,
    outcome: 'Dropped before GitHub'
  }
];

const METRICS = [
  { value: '>80%', label: 'Less PR review noise' },
  { value: '$0', label: 'AI token markup' },
  { value: 'Max 2', label: 'Auto-fix loops' }
];

export const ProofGateExplainerSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [proofGateOn, setProofGateOn] = useState(true);
  const [keySetup, setKeySetup] = useState<KeySetup>('cloud');

  const currentSetup = KEY_SETUPS[keySetup];
  const visibleItems = proofGateOn
    ? REVIEW_ITEMS.filter((item) => item.proved)
    : REVIEW_ITEMS;
  const droppedCount = REVIEW_ITEMS.filter((item) => !item.proved).length;

  return (
    <section
      id="proof-gate"
      aria-labelledby="proof-gate-heading"
      className="bg-[#111114] text-[#F5F5F4] py-24 sm:py-32"
    >
      <div className="page-wrap grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
        {/* Left: Plain-English Value & Metrics */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: EXPO_EASE }}
          >
            <h2
              id="proof-gate-heading"
              className="font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
            >
              Opinions get dropped. Proven bugs get fixed.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-[#F5F5F4] max-w-[46ch] text-pretty">
              Asking one AI to review its own code misses its blind spots, while normal review bots flood pull requests with guesses. CouncilCode enforces one simple rule across any models you connect: no failing test, no comment.
            </p>
          </motion.div>

          <dl className="grid grid-cols-3 gap-4 sm:gap-6 pt-2">
            {METRICS.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.6, ease: EXPO_EASE, delay: idx * 0.08 }}
                className="flex flex-col"
              >
                <dt className="order-2 text-[16px] leading-[1.35] text-[#C4C4CC] mt-1.5">
                  {metric.label}
                </dt>
                <dd className="order-1 text-[22px] font-semibold tracking-[-0.025em] text-[#F5F5F4] tabular-nums leading-none">
                  {metric.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Right: Crystal-Clear Interactive Proof Gate & BYOK Switcher */}
        <motion.div
          className="lg:col-span-7"
          initial={prefersReduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.75, ease: EXPO_EASE, delay: 0.1 }}
        >
          <div data-ui className="bg-[#16161B] rounded-2xl p-5 sm:p-7 space-y-6">
            {/* Step 1: Bring Any Model / Key Switcher */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#F5F5F4]">
                  <SlidersHorizontal className="w-4 h-4 text-[#C4C4CC]" aria-hidden="true" />
                  <span>Bring any models you want</span>
                </div>
                <span className="text-[14px] text-[#C4C4CC]">
                  No fixed AI vendor
                </span>
              </div>

              <div
                role="tablist"
                aria-label="BYOK model setup"
                className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-[#0D0D10] p-1 rounded-xl"
              >
                {(['cloud', 'hybrid', 'offline'] as const).map((setupId) => {
                  const active = keySetup === setupId;
                  return (
                    <button
                      key={setupId}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setKeySetup(setupId)}
                      className={`px-3 py-2 rounded-lg text-[14px] font-medium cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#F5F5F4] text-[#09090B]'
                          : 'bg-transparent text-[#C4C4CC] hover:text-[#F5F5F4]'
                      }`}
                    >
                      {KEY_SETUPS[setupId].label}
                    </button>
                  );
                })}
              </div>

              <p className="text-[14px] text-[#C4C4CC] max-w-[58ch]">
                {currentSetup.note}
              </p>
            </div>

            {/* Step 2: Before vs After Proof Gate Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[16px] font-semibold text-[#F5F5F4]">
                What reaches your pull request
              </div>

              <div
                role="group"
                aria-label="Toggle proof gate filter"
                className="inline-flex items-center bg-[#0D0D10] p-1 rounded-full gap-1"
              >
                <button
                  type="button"
                  onClick={() => setProofGateOn(false)}
                  aria-pressed={!proofGateOn}
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium cursor-pointer transition-colors ${
                    !proofGateOn
                      ? 'bg-[#F5F5F4] text-[#09090B]'
                      : 'bg-transparent text-[#C4C4CC] hover:text-[#F5F5F4]'
                  }`}
                >
                  Raw AI review (3)
                </button>
                <button
                  type="button"
                  onClick={() => setProofGateOn(true)}
                  aria-pressed={proofGateOn}
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium cursor-pointer transition-colors ${
                    proofGateOn
                      ? 'bg-[#F5F5F4] text-[#09090B]'
                      : 'bg-transparent text-[#C4C4CC] hover:text-[#F5F5F4]'
                  }`}
                >
                  With Proof Gate (2)
                </button>
              </div>
            </div>

            {/* Animated Claims List */}
            <div className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {visibleItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout={!prefersReduced}
                    initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', duration: 0.38, bounce: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-3.5 ${
                      item.proved ? 'bg-[#0D0D10]' : 'bg-[#221518]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-6 h-6 rounded-full inline-flex items-center justify-center shrink-0 ${
                        item.proved
                          ? 'bg-[#166534] text-[#ECFDF3]'
                          : 'bg-[#7F1D1D] text-[#FEF2F2]'
                      }`}
                    >
                      {item.proved ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[14px] font-semibold text-[#F5F5F4]">
                          {currentSetup.models[item.slotIndex]}
                        </span>
                        <span
                          className={`text-[14px] font-medium ${
                            item.proved ? 'text-[#4ADE80]' : 'text-[#FCA5A5]'
                          }`}
                        >
                          {item.outcome}
                        </span>
                      </div>
                      <p className="text-[16px] text-[#F5F5F4] leading-snug max-w-[54ch]">
                        {item.summary}
                      </p>
                      <p className="text-[14px] text-[#C4C4CC] leading-snug max-w-[56ch]">
                        {item.evidence}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {proofGateOn && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="px-4 py-3 rounded-xl bg-[#11261A] text-[#86EFAC] text-[14px] font-medium flex flex-wrap items-center justify-between gap-2"
                >
                  <span>
                    {droppedCount} unproved style opinion silently blocked before reaching GitHub.
                  </span>
                  <button
                    type="button"
                    onClick={() => setProofGateOn(false)}
                    className="underline underline-offset-4 cursor-pointer text-[#F5F5F4]"
                  >
                    See blocked comment
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
