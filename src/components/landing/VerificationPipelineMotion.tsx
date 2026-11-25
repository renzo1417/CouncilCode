'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Pause, Play, Check, X } from 'lucide-react';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

type PipelineMode = 'solo' | 'teams';

interface PipelineStep {
  id: string;
  label: string;
  sublabel: string;
  headline: string;
  detail: string;
  metric: string;
  checks: { label: string; status: 'pass' | 'blocked' | 'active' }[];
}

const SOLO_STEPS: PipelineStep[] = [
  {
    id: 'diff',
    label: 'Your diff',
    sublabel: 'Web app, CLI or IDE',
    headline: 'Intercepts AI-written changes before you push',
    detail: 'Works in the browser app, the free local CLI, VS Code extension, or git pre-commit hook alongside any coding assistant.',
    metric: 'Changed files only · .env ignored',
    checks: [
      { label: 'Candidate diff staged from workspace or PR', status: 'pass' },
      { label: 'Secrets & untracked env files excluded', status: 'pass' },
      { label: 'Dispatched to isolated sandbox', status: 'active' }
    ]
  },
  {
    id: 'sandbox',
    label: 'Sandbox gate',
    sublabel: '< 5s · $0 tokens',
    headline: 'Deterministic checks catch broken code first',
    detail: 'Runs your linter, type checker, build, and test suite inside a local Docker/WASM container or cloud microVM before spending a token.',
    metric: '1.8s elapsed · 0 tokens spent',
    checks: [
      { label: 'Linter & formatter passed', status: 'pass' },
      { label: 'Static typecheck & build passed', status: 'pass' },
      { label: 'Baseline unit tests green', status: 'pass' }
    ]
  },
  {
    id: 'council',
    label: 'Model jury',
    sublabel: 'Any model · BYOK',
    headline: 'Competing models cross-examine with executable proof',
    detail: 'Routes the diff to whatever models you configure via your own API keys or local offline endpoints. Claims without a failing test are dropped.',
    metric: '2 bugs proved · 1 opinion dropped',
    checks: [
      { label: 'Model A proved auth bypass with failing test', status: 'pass' },
      { label: 'Model B proved null-guard crash with failing test', status: 'pass' },
      { label: 'Model C style opinion had no failing test: dropped', status: 'blocked' }
    ]
  },
  {
    id: 'pr',
    label: 'One green PR',
    sublabel: 'Verified dossier',
    headline: 'Auto-patched, re-tested, and ready to merge',
    detail: 'One sole arbiter reconciles verified fixes within a 2-loop cap, saves permanent regression tests in your repo, and opens one clean pull request.',
    metric: 'All tests green · 0 bot comment spam',
    checks: [
      { label: 'Proved bugs patched & regression tests added', status: 'pass' },
      { label: 'Full sandbox suite re-verified green', status: 'pass' },
      { label: 'Signed Proof Dossier attached to PR', status: 'pass' }
    ]
  }
];

const TEAM_STEPS: PipelineStep[] = [
  {
    id: 'contract',
    label: 'Contract lock',
    sublabel: 'Upfront schema',
    headline: 'Shared API schemas lock before anyone codes',
    detail: 'A System Architect commits OpenAPI specs and shared TypeScript types upfront so parallel AI branches cannot drift apart.',
    metric: 'Shared contract committed',
    checks: [
      { label: 'OpenAPI endpoints & payload schemas frozen', status: 'pass' },
      { label: 'Shared types exported to both pods', status: 'pass' },
      { label: 'Work split into parallel pods', status: 'active' }
    ]
  },
  {
    id: 'pods',
    label: 'Parallel pods',
    sublabel: 'Frontend & backend',
    headline: 'Each pod verifies inside its own sandbox & jury',
    detail: 'Frontend and backend pods build, lint, test, and prove bugs independently using each team’s chosen BYOK models.',
    metric: '2 pods running in parallel',
    checks: [
      { label: 'Backend pod passed local sandbox & council', status: 'pass' },
      { label: 'Frontend pod passed local sandbox & council', status: 'pass' },
      { label: 'Ready for cross-service integration', status: 'active' }
    ]
  },
  {
    id: 'higher',
    label: 'Higher council',
    sublabel: 'E2E integration',
    headline: 'Checks cross-service fit without re-litigating pods',
    detail: 'Runs end-to-end integration tests across the merged branches. If an interface breaks, fixes route strictly to the offending pod.',
    metric: 'Zero contract drift detected',
    checks: [
      { label: 'Cross-service auth & schema checks passed', status: 'pass' },
      { label: 'E2E integration sandbox green', status: 'pass' },
      { label: 'Zero breaking changes across pods', status: 'pass' }
    ]
  },
  {
    id: 'linked',
    label: 'Linked PRs',
    sublabel: 'First-pass merge',
    headline: 'Coordinated pull requests land cleanly together',
    detail: 'Human reviewers inspect linked, green-verified pull requests with one consolidated audit dossier instead of untangling merge conflicts.',
    metric: '>90% first-pass merge target',
    checks: [
      { label: 'Frontend & backend PRs linked automatically', status: 'pass' },
      { label: 'Contract & E2E proof dossier attached', status: 'pass' },
      { label: 'Ready for single-pass human approval', status: 'pass' }
    ]
  }
];

export const VerificationPipelineMotion: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [mode, setMode] = useState<PipelineMode>('solo');
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = mode === 'solo' ? SOLO_STEPS : TEAM_STEPS;
  const activeStep = steps[stepIdx] || steps[0];

  useEffect(() => {
    if (!isPlaying || prefersReduced) return;
    const timer = window.setInterval(() => {
      setStepIdx((prev) => (prev + 1) % 4);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [isPlaying, prefersReduced, mode]);

  const handleModeChange = (nextMode: PipelineMode) => {
    setMode(nextMode);
    setStepIdx(0);
  };

  const handleSelectStep = (idx: number) => {
    setStepIdx(idx);
    setIsPlaying(false);
  };

  return (
    <section
      aria-label="Interactive CouncilCode verification pipeline"
      className="bg-[#060607] text-[#F5F5F4] pb-20 sm:pb-28"
    >
      <div className="page-wrap">
        <motion.div
          data-ui
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: EXPO_EASE }}
          className="bg-[#111114] text-[#F5F5F4] rounded-2xl p-5 sm:p-8 lg:p-10 overflow-clip"
        >
          {/* Stage Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8">
            <div
              role="tablist"
              aria-label="Verification workflow mode"
              className="inline-flex items-center bg-[#1E1E1C] p-1 rounded-full gap-1"
            >
              {(
                [
                  { id: 'solo', label: 'Solo & Local CLI' },
                  { id: 'teams', label: 'Two-Tier Team Pods' }
                ] as const
              ).map((tab) => {
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleModeChange(tab.id)}
                    className={`px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer transition-colors ${active
                      ? 'bg-[#F5F5F4] text-[#141413]'
                      : 'bg-transparent text-[#D6D4CE] hover:text-[#F5F5F4]'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[14px] text-[#D6D4CE] tabular-nums">
                Step {stepIdx + 1} of {steps.length}
              </span>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause pipeline animation' : 'Play pipeline animation'}
                className="h-9 px-3.5 rounded-full bg-[#1E1E1C] hover:bg-[#2A2A27] text-[#F5F5F4] text-[14px] font-medium inline-flex items-center gap-2 cursor-pointer cc-press"
              >
                {isPlaying && !prefersReduced ? (
                  <>
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>Auto-play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4 Connected Stage Boxes with Horizontal Line & Gliding Green Dot */}
          <div className="relative py-2 sm:py-4">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-1/2 -translate-y-1/2 h-[2px] bg-[#2C2C29]"
            >
              <motion.div
                className="h-full bg-[#4ADE80] origin-left"
                animate={{ scaleX: stepIdx / 3 }}
                transition={{ type: 'spring', duration: 0.55, bounce: 0 }}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 relative z-10">
              {steps.map((step, idx) => {
                const isActive = idx === stepIdx;
                const isPassed = idx < stepIdx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleSelectStep(idx)}
                    className={`relative text-left p-4 sm:p-5 rounded-xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4] ${isActive
                      ? 'bg-[#262623]'
                      : 'bg-[#1B1B19] hover:bg-[#22221F]'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[14px] font-medium tabular-nums ${isActive
                          ? 'text-[#F5F5F4]'
                          : isPassed
                            ? 'text-[#4ADE80]'
                            : 'text-[#B5B3AD]'
                          }`}
                      >
                        {isPassed ? 'Passed' : isActive ? 'Active' : 'Queued'}
                      </span>

                      <span className="w-5 h-5 inline-flex items-center justify-center shrink-0">
                        {isActive ? (
                          <motion.span
                            layoutId="pipeline-active-dot"
                            transition={{ type: 'spring', duration: 0.42, bounce: 0 }}
                            className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"
                            aria-hidden="true"
                          />
                        ) : isPassed ? (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-[#166534] ring-2 ring-[#4ADE80]/60"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="w-2 h-2 rounded-full bg-[#3A3A36]"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </div>

                    <div className="text-[16px] font-semibold text-[#F5F5F4] leading-snug">
                      {step.label}
                    </div>
                    <div className="mt-1 text-[14px] text-[#D6D4CE] leading-snug">
                      {step.sublabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Synchronized Verification Stage Output */}
          <div className="mt-4 bg-[#1B1B19] rounded-xl p-5 sm:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${activeStep.id}`}
                initial={prefersReduced ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={prefersReduced ? undefined : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.32, ease: EXPO_EASE }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
              >
                <div className="lg:col-span-6 space-y-3">
                  <div className="text-[22px] font-semibold tracking-[-0.02em] text-[#F5F5F4] leading-[1.25]">
                    {activeStep.headline}
                  </div>
                  <p className="text-[16px] leading-[1.6] text-[#D6D4CE] max-w-[46ch] text-pretty">
                    {activeStep.detail}
                  </p>
                  <div className="pt-1 text-[14px] font-medium text-[#4ADE80] tabular-nums">
                    {activeStep.metric}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-2.5">
                  {activeStep.checks.map((item, cIdx) => (
                    <motion.div
                      key={item.label}
                      initial={prefersReduced ? false : { opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: EXPO_EASE, delay: cIdx * 0.06 }}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg bg-[#141413]"
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full inline-flex items-center justify-center shrink-0 ${item.status === 'pass'
                          ? 'bg-[#166534] text-[#ECFDF3]'
                          : item.status === 'blocked'
                            ? 'bg-[#7F1D1D] text-[#FEF2F2]'
                            : 'bg-[#2C2C29] text-[#F5F5F4]'
                          }`}
                      >
                        {item.status === 'blocked' ? (
                          <X className="w-3 h-3" aria-hidden="true" />
                        ) : (
                          <Check className="w-3 h-3" aria-hidden="true" />
                        )}
                      </span>
                      <span
                        className={`text-[14px] leading-snug ${item.status === 'blocked' ? 'text-[#D6D4CE] line-through' : 'text-[#F5F5F4]'
                          }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quiet Caption Bar Below Model */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
          <p className="md:col-span-5 text-[16px] font-semibold text-[#F5F5F4]">
            Browser app, free local CLI & IDE extension
          </p>
          <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <p className="text-[16px] text-[#C4C4CC] max-w-[48ch] text-pretty">
              Run in your browser with managed cloud sandboxes, or install the free CLI to run locally and offline with Docker and your own model keys.
            </p>
            <Link
              href="/studio"
              className="text-[16px] font-medium text-[#F5F5F4] underline underline-offset-4 decoration-[#F5F5F4]/40 hover:decoration-[#F5F5F4] transition-colors shrink-0 whitespace-nowrap"
            >
              Open browser app
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
