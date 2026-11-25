'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { HeroPrism3DView } from './Landing3DLoaders';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-label="Introduction"
      className="bg-[#060607] text-[#F5F5F4] pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-14"
    >
      <div className="page-wrap grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left: Monumental Masked Statement & Actions */}
        <div className="lg:col-span-7 space-y-8 sm:space-y-10">
          <h1
            className="font-semibold text-[#F5F5F4] leading-[0.96] tracking-[-0.04em] text-balance"
            style={{ fontSize: 'clamp(2.5rem, 6.4vw, 5.75rem)' }}
          >
            <span className="block overflow-clip pb-[0.08em] -mb-[0.08em]">
              <motion.span
                className="block"
                initial={prefersReduced ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, ease: EXPO_EASE, delay: 0.08 }}
              >
                Prove every bug
              </motion.span>
            </span>
            <span className="block overflow-clip pb-[0.08em] -mb-[0.08em]">
              <motion.span
                className="block"
                initial={prefersReduced ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, ease: EXPO_EASE, delay: 0.19 }}
              >
                before you merge
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="space-y-7"
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EXPO_EASE, delay: 0.36 }}
          >
            <p className="text-[22px] leading-[1.4] text-[#F5F5F4] max-w-[40ch] text-pretty">
              Use the browser app or free local CLI. Your own AI models cross-examine every diff and ship one verified, green pull request.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/studio"
                className="h-12 px-7 rounded-full bg-[#F5F5F4] hover:bg-white text-[#09090B] text-[16px] font-medium inline-flex items-center justify-center whitespace-nowrap cc-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4]"
              >
                Open web app
              </Link>

              <a
                href="#pricing"
                className="text-[16px] font-medium text-[#F5F5F4] underline underline-offset-4 decoration-[#F5F5F4]/40 hover:decoration-[#F5F5F4] transition-colors py-2 whitespace-nowrap"
              >
                Install free CLI
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right: Real-Time 3D Verification Prism Sculpture */}
        <motion.div
          data-ui
          className="lg:col-span-5"
          aria-label="Interactive 3D CouncilCode verification sculpture"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: EXPO_EASE, delay: 0.22 }}
        >
          <HeroPrism3DView />
        </motion.div>
      </div>
    </section>
  );
};
