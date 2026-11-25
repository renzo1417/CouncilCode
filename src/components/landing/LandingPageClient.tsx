'use client';

import React from 'react';
import { MotionConfig } from 'motion/react';
import { SiteNav } from './SiteNav';
import { HeroSection } from './HeroSection';
import { VerificationPipelineMotion } from './VerificationPipelineMotion';
import { ProofGateExplainerSection } from './ProofGateExplainerSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TeamsPrivacySection } from './TeamsPrivacySection';
import { PricingFaqSection } from './PricingFaqSection';
import { LandingFooter } from './LandingFooter';

export const LandingPageClient: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-[#060607] text-[#F5F5F4]">
        <SiteNav />
        <main>
          <HeroSection />
          <VerificationPipelineMotion />
          <ProofGateExplainerSection />
          <HowItWorksSection />
          <TeamsPrivacySection />
          <PricingFaqSection />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
};
