'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Stages3DSceneView } from './Landing3DLoaders';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

interface PipelineStage {
  id: string;
  shortLabel: string;
  title: string;
  body: string;
  detail: string;
  readout: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'sandbox',
    shortLabel: 'Sandbox',
    title: 'Zero-token sandbox gate',
    body: 'Every diff runs your linter, type checker, build, and baseline unit tests inside a local Docker/WASM container or ephemeral cloud microVM in under five seconds.',
    detail: 'Broken syntax goes straight back to the coding agent before any AI model spends a token.',
    readout: '1.8s fast-fail · $0 tokens · 4/4 gates green'
  },
  {
    id: 'council',
    shortLabel: 'Model jury',
    title: 'Bring-your-own model jury',
    body: 'Once baseline checks clear, competing models you configure inspect the diff independently using your own API keys or local offline endpoints.',
    detail: 'Pick any combination of cloud providers, OpenAI-compatible gateways, or local models so no single model grades its own homework.',
    readout: 'Parallel BYOK review · Any provider or local Ollama'
  },
  {
    id: 'arbiter',
    shortLabel: 'Proof gate',
    title: 'Executable proof & 2-loop cap',
    body: 'Every claimed bug must compile into a failing test before reaching the sole Main Arbiter. Unproved style opinions are discarded silently.',
    detail: 'Verified defects merge into one focused patch brief capped at two revision loops.',
    readout: '2 bugs proved · 1 opinion blocked · Max 2 loops'
  },
  {
    id: 'verified',
    shortLabel: 'Green PR',
    title: 'Patched code & one green PR',
    body: 'The coding agent applies the fix, saves the new regression test directly in your repository, and re-runs the full sandbox gate.',
    detail: 'Reviewers inspect one clean pull request backed by a signed Proof Dossier instead of a thread of bot comments.',
    readout: 'All regression tests green · 0 bot spam · Ready to merge'
  }
];

export const HowItWorksSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.stageIdx);
            if (!Number.isNaN(idx)) {
              setActiveIdx(idx);
            }
          }
        }
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: 0.1 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-[#060607] text-[#F5F5F4] py-24 sm:py-32"
    >
      <div className="page-wrap">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12 lg:mb-16"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: EXPO_EASE }}
        >
          <h2
            id="how-it-works-heading"
            className="lg:col-span-7 font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
          >
            Four stages to green
          </h2>
          <p className="lg:col-span-5 text-[16px] leading-[1.6] text-[#F5F5F4] max-w-[44ch] text-pretty">
            Deterministic checks run first, your chosen models cross-examine second, and only reproducible bugs ever touch your branch.
          </p>
        </motion.div>

        {/* Unified Sticky 3D Sculpture (Left on Desktop, Top on Mobile) + 4 Scrolling Stages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <figure className="lg:col-span-7 lg:sticky lg:top-20 m-0">
            {/* Borderless 3D canvas floating directly on #09090B */}
            <div data-ui>
              <Stages3DSceneView activeIdx={activeIdx} />
            </div>

            {/* Mobile / Tablet direct stage tap switcher */}
            <div className="lg:hidden mt-3 flex flex-wrap gap-2">
              {PIPELINE_STAGES.map((stage, idx) => {
                const active = activeIdx === idx;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#F5F5F4] text-[#09090B]'
                        : 'bg-[#16161B] text-[#C4C4CC] hover:text-[#F5F5F4]'
                    }`}
                  >
                    {stage.shortLabel}
                  </button>
                );
              })}
            </div>

            <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-[16px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={PIPELINE_STAGES[activeIdx].id}
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: EXPO_EASE }}
                  className="text-[#4ADE80] text-[14px] font-medium tabular-nums"
                >
                  {PIPELINE_STAGES[activeIdx].readout}
                </motion.span>
              </AnimatePresence>
              <span className="text-[#C4C4CC] text-[14px] tabular-nums shrink-0">
                {activeIdx + 1} of {PIPELINE_STAGES.length}
              </span>
            </figcaption>
          </figure>

          <ol className="lg:col-span-5 list-none m-0 p-0 space-y-12 lg:space-y-24">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isActive = activeIdx === idx;
              return (
                <li
                  key={stage.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  data-stage-idx={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`transition-opacity duration-300 cursor-pointer lg:min-h-[40svh] flex flex-col justify-center ${
                    isActive ? 'lg:opacity-100' : 'lg:opacity-45 hover:lg:opacity-80'
                  }`}
                >
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 'some' }}
                    transition={{ duration: 0.65, ease: EXPO_EASE }}
                  >
                    <h3 className="text-[22px] font-semibold tracking-[-0.025em] leading-[1.2] text-[#F5F5F4]">
                      {stage.title}
                    </h3>
                    <p className="mt-3.5 text-[16px] leading-[1.6] text-[#F5F5F4] max-w-[46ch] text-pretty">
                      {stage.body}
                    </p>
                    <p className="mt-2.5 text-[16px] leading-[1.6] text-[#C4C4CC] max-w-[46ch] text-pretty">
                      {stage.detail}
                    </p>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
