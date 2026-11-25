'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Copy } from 'lucide-react';

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

interface PlanRow {
  name: string;
  price: string;
  unit: string;
  allowance: string;
  summary: string;
  inverted?: boolean;
  isCliCopy?: boolean;
}

const PLANS: PlanRow[] = [
  {
    name: 'Local CLI & OSS Core',
    price: '$0',
    unit: 'forever',
    allowance: 'Unlimited local runs · Offline ready',
    summary: 'Open-source CLI, VS Code extension, git pre-commit hooks, and local Docker/WASM sandboxes. Bring any cloud API keys or run offline with local models.',
    isCliCopy: true
  },
  {
    name: 'Web App & Cloud Free',
    price: '$0',
    unit: '/ month',
    allowance: '15 solo · 25 squad · 50 OSS PRs',
    summary: 'Browser app and GitHub App backed by managed cloud microVMs, plus Verified OSS Grants up to 250 PRs per month.'
  },
  {
    name: 'Solo Builder',
    price: '$5',
    unit: '/ month',
    allowance: '50 cloud PRs / month',
    summary: 'Browser app, CLI sync, and managed sandboxes for indie developers shipping daily with any coding assistant and their own model keys.'
  },
  {
    name: 'Solo Pro',
    price: '$10',
    unit: '/ month',
    allowance: '250 cloud PRs / month',
    summary: 'Priority microVM compute pool, multi-repo verification badges, and full cryptographic proof dossiers across web and CLI.'
  },
  {
    name: 'Team',
    price: '$15',
    unit: '/ seat / month',
    allowance: 'Unlimited fair-use PRs',
    summary: 'Full web workspace and CLI for teams: two-tier frontend & backend pods, upfront contract handshakes, Higher Council arbitration, and E2E sandboxes.',
    inverted: true
  }
];

const FAQS = [
  {
    q: 'Can I use CouncilCode locally or offline for free?',
    a: 'Yes. The open-source CLI (npm i -g @councilcode/cli) and VS Code extension run the deterministic sandbox locally inside Docker or WASM for free. Pair it with local models (such as Ollama or any OpenAI-compatible local server) to work completely offline, or plug in your own cloud API keys.'
  },
  {
    q: 'Which AI models and API keys are supported?',
    a: 'CouncilCode is vendor-neutral. Connect whatever API keys or model endpoints you already use, including frontier cloud APIs, OpenAI-compatible gateways, or local models. Your keys stay encrypted in your local OS keychain with zero token markup.'
  },
  {
    q: 'How does the Proof Gate stop noisy or hallucinated comments?',
    a: 'Every bug claim must compile into an executable test that fails on the current code and passes after patching. Any subjective style comment or claim without a reproducible failing test is dropped automatically before reaching your pull request.'
  },
  {
    q: 'Does CouncilCode store my code or lock us in?',
    a: 'No. Managed cloud sandboxes mount changed files read-only inside ephemeral microVMs and destroy them immediately after checks finish. Generated regression tests stay as standard Jest or PyTest files in your repo, and councilcode eject cleans up hooks and keys anytime.'
  }
];

export const PricingFaqSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [copiedCli, setCopiedCli] = useState(false);

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText('npm i -g @councilcode/cli');
      setCopiedCli(true);
      window.setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      setCopiedCli(true);
      window.setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-[#060607] text-[#F5F5F4] py-24 sm:py-32"
    >
      <div className="page-wrap space-y-24 sm:space-y-32">
        {/* Pricing Block — Architectural Plan Table */}
        <div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-12 sm:mb-16"
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.7, ease: EXPO_EASE }}
          >
            <h2
              id="pricing-heading"
              className="lg:col-span-7 font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
            >
              Free locally, lean in the cloud
            </h2>
            <p className="lg:col-span-5 text-[16px] leading-[1.6] text-[#F5F5F4] max-w-[44ch] text-pretty">
              Run locally for free with your own machine, or use managed cloud microVMs with zero AI token markup.
            </p>
          </motion.div>

          <div role="list" aria-label="CouncilCode local and cloud BYOK plans" className="bg-[#111114]">
            {PLANS.map((plan, idx) => (
              <motion.div
                key={plan.name}
                role="listitem"
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.55, ease: EXPO_EASE, delay: idx * 0.05 }}
                className={`px-6 sm:px-9 py-7 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-baseline ${
                  plan.inverted
                    ? 'bg-[#F5F5F4] text-[#09090B]'
                    : idx % 2 === 1
                    ? 'bg-[#16161B] text-[#F5F5F4]'
                    : 'bg-[#111114] text-[#F5F5F4]'
                }`}
              >
                <div className="lg:col-span-3">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em] leading-[1.2]">
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1.5 text-[16px] font-medium ${
                      plan.inverted ? 'text-[#45433F]' : 'text-[#C4C4CC]'
                    }`}
                  >
                    {plan.allowance}
                  </p>
                </div>

                <p
                  className={`lg:col-span-5 text-[16px] leading-[1.6] max-w-[50ch] text-pretty ${
                    plan.inverted ? 'text-[#09090B]' : 'text-[#F5F5F4]'
                  }`}
                >
                  {plan.summary}
                </p>

                <div className="lg:col-span-2 flex items-baseline lg:justify-end gap-1 tabular-nums">
                  <span className="text-[22px] font-semibold tracking-[-0.02em] leading-none">
                    {plan.price}
                  </span>
                  <span
                    className={`text-[14px] ${
                      plan.inverted ? 'text-[#45433F]' : 'text-[#C4C4CC]'
                    }`}
                  >
                    {plan.unit}
                  </span>
                </div>

                <div className="lg:col-span-2 flex lg:justify-end">
                  {plan.isCliCopy ? (
                    <button
                      type="button"
                      onClick={handleCopyCli}
                      className="inline-flex items-center gap-1.5 text-[16px] font-medium text-[#F5F5F4] underline underline-offset-4 decoration-[#F5F5F4]/40 hover:decoration-[#F5F5F4] transition-colors py-1 cursor-pointer whitespace-nowrap"
                    >
                      {copiedCli ? (
                        <>
                          <Check className="w-4 h-4 text-[#4ADE80]" aria-hidden="true" />
                          <span>Copied CLI</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" aria-hidden="true" />
                          <span>Copy CLI</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/studio"
                      className={`text-[16px] font-medium underline underline-offset-4 transition-colors py-1 whitespace-nowrap ${
                        plan.inverted
                          ? 'text-[#09090B] decoration-[#09090B]/40 hover:decoration-[#09090B]'
                          : 'text-[#F5F5F4] decoration-[#F5F5F4]/40 hover:decoration-[#F5F5F4]'
                      }`}
                    >
                      Open web app
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Block (Native Accessible <details> Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            className="lg:col-span-5"
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.65, ease: EXPO_EASE }}
          >
            <h2
              id="faq-heading"
              className="font-semibold text-[#F5F5F4] leading-[1.02] tracking-[-0.03em] text-balance"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)' }}
            >
              Common questions
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#F5F5F4] max-w-[38ch] text-pretty">
              Straight answers on local offline use, bringing any model keys, and leaving with your test suite intact.
            </p>
          </motion.div>

          <div
            className="lg:col-span-7 cc-accordion space-y-3"
            aria-labelledby="faq-heading"
          >
            {FAQS.map((item) => (
              <details key={item.q} className="bg-[#141418]">
                <summary className="px-6 py-5 text-[16px] font-medium text-[#F5F5F4] select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4]">
                  <span>{item.q}</span>
                </summary>
                <div className="px-6 pb-6 pl-[3.25rem] text-[16px] leading-[1.6] text-[#D4D4D8] text-pretty">
                  <p className="max-w-[58ch]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
