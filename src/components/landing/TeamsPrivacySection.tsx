'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { VerificationCanvasModel } from './VerificationCanvasModel';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

const GUARANTEES = [
  {
    title: 'Browser app & free local CLI',
    body: 'Use the browser app with managed cloud sandboxes, or install the free open-source CLI and VS Code extension to run Docker/WASM checks right on your machine and offline with local models.'
  },
  {
    title: 'Any model, your own API keys',
    body: 'CouncilCode never locks you into one AI vendor. Plug in whichever cloud API keys, OpenAI-compatible gateways, or local endpoints you prefer, encrypted in your local OS keychain with zero token markup.'
  },
  {
    title: 'Zero retention & clean eject',
    body: 'Managed cloud microVMs (2 vCPU, 2 GB) inspect changed files only (ignoring .env and secrets) and destroy immediately after checks. Running councilcode eject revokes keys and leaves standard Jest or PyTest files in your repo.'
  }
];

export const TeamsPrivacySection: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="teams"
      aria-labelledby="teams-heading"
      className="bg-[#111114] text-[#F5F5F4] py-24 sm:py-36"
    >
      <div className="page-wrap grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
        {/* Left: Two-Tier Team Pods Narrative */}
        <motion.div
          className="lg:col-span-5 space-y-6"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 'some' }}
          transition={{ duration: 0.7, ease: EXPO_EASE }}
        >
          <h2
            id="teams-heading"
            className="font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
          >
            Built for teams, zero lock-in
          </h2>

          <p className="text-[22px] leading-[1.4] text-[#F5F5F4] max-w-[38ch] text-pretty">
            Parallel AI branches drift apart before merge. CouncilCode locks shared contracts before anyone writes a line.
          </p>

          <p className="text-[16px] leading-[1.6] text-[#D6D4CE] max-w-[44ch] text-pretty">
            A System Architect locks shared OpenAPI schemas and TypeScript contracts upfront. Frontend and backend pods verify independently in their own sandboxes, then a Higher Council runs end-to-end integration tests and opens coordinated pull requests.
          </p>

          <div className="pt-2">
            <Link
              href="/studio"
              className="text-[16px] font-medium text-[#F5F5F4] underline underline-offset-4 decoration-[#F5F5F4]/40 hover:decoration-[#F5F5F4] transition-colors"
            >
              Open team pods in web app
            </Link>
          </div>

          {/* Animated Two-Tier Pod Contract Diagram */}
          <div data-ui className="mt-2 rounded-xl overflow-clip">
            <VerificationCanvasModel variant="pods" />
          </div>
        </motion.div>

        {/* Right: Flat Tone-Stepped Security & Ownership Blocks */}
        <div className="lg:col-span-7 space-y-4">
          {GUARANTEES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={prefersReduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.65, ease: EXPO_EASE, delay: idx * 0.08 }}
              className="bg-[#18181D] p-7 sm:p-9"
            >
              <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F5F5F4]">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[16px] leading-[1.6] text-[#C4C4CC] max-w-[54ch] text-pretty">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
