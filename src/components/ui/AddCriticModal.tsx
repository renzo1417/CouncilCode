'use client';

import React, { useState } from 'react';
import { useCouncilStore } from '@/store/councilStore';
import { ModelProvider, ReviewerRole } from '@/types/council';
import { X, Check } from 'lucide-react';
import { ModalDialog } from './ModalDialog';

const MODEL_OPTIONS: { id: ModelProvider; name: string; tag: string; color: string }[] = [
  { id: 'anthropic', name: 'Claude 3.7 Sonnet', tag: 'Anthropic', color: '#D97706' },
  { id: 'openai', name: 'GPT-4o', tag: 'OpenAI', color: '#10B981' },
  { id: 'deepseek', name: 'DeepSeek R1', tag: 'DeepSeek', color: '#06B6D4' },
  { id: 'google', name: 'Gemini 2.5', tag: 'Google', color: '#3B82F6' }
];

const ROLE_OPTIONS: { id: ReviewerRole; name: string; description: string }[] = [
  {
    id: 'security',
    name: 'Security & auth',
    description: 'Finds IDOR, auth bypass, and privilege escalation with executable exploit assertions.'
  },
  {
    id: 'logic',
    name: 'Logic & invariants',
    description: 'Verifies state machines, boundary conditions, and null-safety edge cases.'
  },
  {
    id: 'contract',
    name: 'API & contract',
    description: 'Verifies OpenAPI schemas, backward compatibility, and status code contracts.'
  },
  {
    id: 'performance',
    name: 'Performance & database',
    description: 'Detects N+1 queries, algorithmic complexity traps, and memory leak vectors.'
  },
  {
    id: 'style',
    name: 'Code idioms',
    description: 'Checks naming conventions and style consistency (filtered if unproved).'
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

  const isFull = critics.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) return;

    const success = addCritic({
      id: `critic-${Date.now()}`,
      name: name.trim() || 'AI Reviewer',
      role,
      model,
      deskIndex: 0,
      color,
      accentColor: color,
      avatarSeed: name.toLowerCase().replace(/\s+/g, '-'),
      isCustom: true
    });

    if (success) {
      setAddCriticOpen(false);
    }
  };

  return (
    <ModalDialog
      open={isAddCriticOpen}
      onClose={() => setAddCriticOpen(false)}
      titleId="add-critic-title"
      maxWidthClass="max-w-lg"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E6E4DF] flex items-start justify-between gap-3 shrink-0">
        <div>
          <h2 id="add-critic-title" className="text-[16px] font-semibold text-[#141413]">
            Add reviewer to council
          </h2>
          <p className="text-[13px] text-[#575550] mt-0.5">
            Assign a model provider and specialty to an open studio desk.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddCriticOpen(false)}
          aria-label="Close modal"
          className="h-8 w-8 rounded-lg text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto cc-scroll">
        {isFull && (
          <div
            role="status"
            className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[13px] text-[#92400E]"
          >
            All 6 studio desks are occupied. Remove a custom reviewer in the Council roster to add another.
          </div>
        )}

        {/* Reviewer Name */}
        <div className="space-y-2">
          <label htmlFor="reviewer-name-input" className="block text-[13px] font-medium text-[#141413]">
            Reviewer name
          </label>
          <input
            id="reviewer-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full h-10 px-3 rounded-lg bg-white border border-[#D4D1CA] text-[14px] text-[#141413] placeholder:text-[#6B6862] focus:outline-none focus:border-[#141413] transition-colors"
            placeholder="e.g. Claude Security Sentinel"
            required
          />
        </div>

        {/* Model Provider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#141413]">Model provider</span>
            <span className="text-[12px] text-[#6B6862]">Cross-vendor BYOK</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MODEL_OPTIONS.map((m) => {
              const selected = model === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => {
                    setModel(m.id);
                    setColor(m.color);
                  }}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#F6F5F2] border-[#141413]'
                      : 'bg-white border-[#E6E4DF] hover:bg-[#FAF9F7]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-[#141413]">{m.name}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="block text-[12px] text-[#6B6862] mt-0.5">{m.tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specialty */}
        <div className="space-y-2">
          <span className="block text-[13px] font-medium text-[#141413]">Review focus</span>
          <div className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
            {ROLE_OPTIONS.map((r) => {
              const isSelected = role === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#F6F5F2]' : 'bg-white hover:bg-[#FAF9F7]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[#141413]">{r.name}</div>
                    <p className="text-[12px] text-[#575550] truncate mt-0.5">{r.description}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#141413] shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E6E4DF] flex items-center justify-between gap-3">
          <span className="text-[12.5px] text-[#6B6862] tabular-nums">
            {critics.length} of 6 desks occupied
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAddCriticOpen(false)}
              className="h-9 px-3.5 rounded-lg border border-[#E6E4DF] bg-white hover:bg-[#F6F5F2] text-[13px] font-medium text-[#575550] hover:text-[#141413] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFull}
              className="h-9 px-4 rounded-lg text-[13px] font-medium bg-[#141413] hover:bg-[#2A2A28] disabled:opacity-40 disabled:cursor-not-allowed text-white cc-press cursor-pointer"
            >
              Add to studio
            </button>
          </div>
        </div>
      </form>
    </ModalDialog>
  );
};
