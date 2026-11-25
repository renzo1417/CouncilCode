'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Copy } from 'lucide-react';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

export const LandingFooter: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText('npm i -g @councilcode/cli');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="bg-[#111114] text-[#F5F5F4] pt-24 sm:pt-32 pb-12">
      <div className="page-wrap">
        {/* Closing Call to Action */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-20 sm:pb-28"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: EXPO_EASE }}
        >
          <div className="lg:col-span-6">
            <h2
              className="font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
            >
              Ship proved code
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <p className="text-[22px] leading-[1.4] text-[#F5F5F4] max-w-[40ch] text-pretty">
              Launch the browser app right away, or install the free open-source CLI to run locally and offline.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/studio"
                className="h-12 px-7 rounded-full bg-[#F5F5F4] hover:bg-white text-[#09090B] text-[16px] font-medium inline-flex items-center justify-center shrink-0 whitespace-nowrap cc-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4]"
              >
                Open web app
              </Link>

              <button
                type="button"
                onClick={handleCopyInstall}
                className="h-12 px-5 rounded-full bg-[#1C1C22] hover:bg-[#27272F] text-[#F5F5F4] text-[16px] font-medium inline-flex items-center gap-2.5 shrink-0 whitespace-nowrap cc-press cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4]"
              >
                <span>npm i -g @councilcode/cli</span>
                {copied ? (
                  <Check className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4 opacity-75" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Designed Closing Wordmark & Colophon */}
        <div className="pt-8">
          <div
            aria-hidden="true"
            className="font-semibold tracking-[-0.045em] leading-[0.88] text-[#F5F5F4] select-none overflow-clip"
            style={{ fontSize: 'clamp(3.25rem, 13.5vw, 12.5rem)' }}
          >
            CouncilCode
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[16px] text-[#C4C4CC]">
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/studio" className="hover:text-[#F5F5F4] cc-link">
                Web app
              </Link>
              <a href="#proof-gate" className="hover:text-[#F5F5F4] cc-link">
                Proof gate
              </a>
              <a href="#how-it-works" className="hover:text-[#F5F5F4] cc-link">
                How it works
              </a>
              <a href="#teams" className="hover:text-[#F5F5F4] cc-link">
                Teams
              </a>
              <a href="#pricing" className="hover:text-[#F5F5F4] cc-link">
                Pricing
              </a>
            </nav>

            <p className="text-[16px] text-[#C4C4CC]">
              Browser app & free CLI · Any-model BYOK · Zero lock-in
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
