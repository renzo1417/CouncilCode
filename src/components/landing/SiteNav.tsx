'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#proof-gate', label: 'Proof gate' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#teams', label: 'Teams' },
  { href: '#pricing', label: 'Pricing' }
];

export const SiteNav: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (CSS.supports?.('container-type', 'scroll-state')) return;

    const bar = navRef.current;
    if (!bar) return;

    let lastY = window.scrollY;
    const onScroll = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxScroll));
      if (y === lastY) return;
      const shouldHide = y > lastY && y > bar.offsetHeight && !menuOpen;
      bar.classList.toggle('is-hidden', shouldHide);
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header ref={navRef} className="cc-site-nav bg-[#060607] text-[#F5F5F4]">
      <div className="page-wrap h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.02em] text-[#F5F5F4] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F4]"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="9.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.75" />
            <circle cx="14.5" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.75" />
          </svg>
          <span>CouncilCode</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[16px] font-medium text-[#C4C4CC] hover:text-[#F5F5F4] cc-link py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F5F4]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/studio"
            className="h-10 px-4 sm:px-5 rounded-full bg-[#F5F5F4] hover:bg-white text-[#09090B] text-[16px] font-medium inline-flex items-center justify-center whitespace-nowrap cc-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F4]"
          >
            Open web app
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden h-10 w-10 rounded-full bg-[#18181D] text-[#F5F5F4] inline-flex items-center justify-center cc-press cursor-pointer"
          >
            {menuOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile navigation"
          className="md:hidden page-wrap pb-6 pt-2 bg-[#060607] flex flex-col gap-2"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-[16px] font-medium text-[#F5F5F4]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};
