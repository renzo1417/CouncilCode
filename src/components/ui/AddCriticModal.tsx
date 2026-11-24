'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { ModelProvider, ReviewerRole } from '@/types/council';
import { X, Bot, Shield, Cpu, Zap, Sparkles, Check } from 'lucide-react';

const MODEL_OPTIONS: { id: ModelProvider; name: string; tag: string; color: string }[] = [
  { id: 'anthropic', name: 'Claude 3.7 Sonnet', tag: 'Anthropic', color: '#D97706' },
  { id: 'openai', name: 'GPT-4o', tag: 'OpenAI', color: '#10B981' },
  { id: 'deepseek', name: 'DeepSeek R1', tag: 'DeepSeek', color: '#06B6D4' },
  { id: 'google', name: 'Gemini 2.0 Flash', tag: 'Google', color: '#6366F1' },
];

const ROLE_OPTIONS: { id: ReviewerRole; name: string; description: string; icon: React.ElementType }[] = [
  {
    id: 'security',
    name: 'Security & Auth Reviewer',
    description: 'Finds IDOR, Auth bypass, injection, and privilege escalation vulnerabilities with executable exploit assertions.',
    icon: Shield
  },
  {
    id: 'logic',
    name: 'Logic & Invariants Reviewer',
    description: 'Verifies state machines, boundary conditions, race conditions, and numeric edge cases.',
    icon: Cpu
  },
  {
    id: 'contract',
    name: 'API & Contract Reviewer',
    description: 'Verifies OpenAPI schemas, backward compatibility, and response status contracts.',
    icon: Bot
  },
  {
    id: 'performance',
    name: 'Performance & DB Reviewer',
    description: 'Detects N+1 query patterns, algorithmic complexity traps, and memory leak vectors.',
    icon: Zap
  },
  {
    id: 'style',
    name: 'Code Idioms & Architecture',
    description: 'Checks codebase consistency, naming idioms, and architectural conformance.',
    icon: Sparkles
  }
];

export const AddCriticModal: React.FC = () => {
  const isAddCriticOpen = useCouncilStore((state) => state.isAddCriticOpen);
  const setAddCriticOpen = useCouncilStore((state) => state.setAddCriticOpen);
  const addCritic = useCouncilStore((state) => state.addCritic);
  const critics = useCouncilStore((state) => state.critics);

  const [name, setName] = useState('DeepSec Vanguard');
  const [role, setRole] = useState<ReviewerRole>('security');
  const [model, setModel] = useState<ModelProvider>('deepseek');
  const [color, setColor] = useState('#06B6D4');

  if (!isAddCriticOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addCritic({
      id: `critic-${Date.now()}`,
      name: name.trim() || 'AI Reviewer',
      role,
      model,
      deskIndex: 0, // determined dynamically in store
      color,
      accentColor: color,
      avatarSeed: name.toLowerCase().replace(/\s+/g, '-'),
      isCustom: true
    });

    if (success) {
      setAddCriticOpen(false);
    } else {
      alert('All 6 critic desks in the office are currently occupied!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-stone-800"
        style={{
          boxShadow: '0 20px 48px -8px rgba(45, 35, 25, 0.16)'
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#C85A3E]/10 border border-[#C85A3E]/20 flex items-center justify-center text-[#C85A3E]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Configure Critic Reviewer</h2>
              <p className="text-[11px] text-stone-500">
                Vendor-neutral AI reviewer entering the studio diorama
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddCriticOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Agent Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700">Reviewer Persona / Identity</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#C85A3E] focus:ring-1 focus:ring-[#C85A3E]/30 transition-all font-sans"
              placeholder="e.g. Claude Security Sentinel"
              required
            />
          </div>

          {/* Model Provider (Vendor-Neutral BYOK Philosophy) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700 flex items-center justify-between">
              <span>Model Provider</span>
              <span className="text-[10px] text-stone-500 font-mono">Cross-Vendor BYOK</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODEL_OPTIONS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    setModel(m.id);
                    setColor(m.color);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    model === m.id
                      ? 'bg-white border-[#C85A3E] shadow-2xs ring-1 ring-[#C85A3E]/20'
                      : 'bg-white/60 border-stone-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">{m.name}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{m.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700">Specialization Role</label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {ROLE_OPTIONS.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#C85A3E] shadow-2xs ring-1 ring-[#C85A3E]/20'
                        : 'bg-white/60 border-stone-200/80 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#C85A3E] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-900">{r.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C85A3E]" />}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
            <div className="text-[11px] font-mono text-stone-500">
              Desks Occupied: <span className="font-semibold text-stone-900">{critics.length}/6</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddCriticOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#C85A3E] hover:bg-[#B34B31] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Assign to Desk</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
