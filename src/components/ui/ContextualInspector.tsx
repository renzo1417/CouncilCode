'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  X,
  FileCode2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MODEL_NAMES: Record<string, string> = {
  anthropic: 'Claude 3.7 Sonnet',
  deepseek: 'DeepSeek R1',
  openai: 'GPT-4o',
  google: 'Gemini 2.5'
};

const ROLE_NAMES: Record<string, string> = {
  security: 'Security reviewer',
  logic: 'Logic reviewer',
  contract: 'Contract reviewer',
  performance: 'Performance reviewer',
  style: 'Style reviewer'
};

const DIFF_LINES: { type: 'meta' | 'context' | 'add' | 'remove'; text: string }[] = [
  { type: 'meta', text: '@@ -18,10 +18,18 @@' },
  { type: 'context', text: "  invoiceRouter.get('/:id', requireAuth, async (req, res) => {" },
  { type: 'add', text: '+   const userOrgId = req.user?.organizationId;' },
  { type: 'add', text: "+   if (!userOrgId) throw new ForbiddenError('Missing org context');" },
  { type: 'context', text: '    const invoice = await db.invoices.findUnique({ where: { id } });' },
  { type: 'remove', text: '-   // Missing tenant ownership verification!' },
  { type: 'add', text: '+   // CouncilCode verified guard:' },
  { type: 'add', text: '+   if (invoice.organizationId !== userOrgId) {' },
  { type: 'add', text: "+     return res.status(403).json({ error: 'Forbidden' });" },
  { type: 'add', text: '+   }' },
  { type: 'context', text: '    return res.status(200).json({ invoice });' },
  { type: 'context', text: '  });' }
];

export const ContextualInspector: React.FC = () => {
  const isInspectorOpen = useCouncilStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useCouncilStore((state) => state.setInspectorOpen);
  const activeTab = useCouncilStore((state) => state.inspectorTab);
  const setActiveTab = useCouncilStore((state) => state.setInspectorTab);

  const critics = useCouncilStore((state) => state.critics);
  const findings = useCouncilStore((state) => state.findings);
  const selectedAgentId = useCouncilStore((state) => state.selectedAgentId);
  const selectedFindingId = useCouncilStore((state) => state.selectedFindingId);
  const selectedStation = useCouncilStore((state) => state.selectedStation);
  const selectFinding = useCouncilStore((state) => state.selectFinding);
  const selectAgent = useCouncilStore((state) => state.selectAgent);

  const sandboxState = useCouncilStore((state) => state.sandboxState);
  const scenario = useCouncilStore((state) => state.scenario);
  const codeViewMode = useCouncilStore((state) => state.codeViewMode);
  const setCodeViewMode = useCouncilStore((state) => state.setCodeViewMode);
  const revisionLoop = useCouncilStore((state) => state.revisionLoop);
  const auditLog = useCouncilStore((state) => state.auditLog);

  const selectedAgent = critics.find((c) => c.id === selectedAgentId);
  const activeFinding =
    findings.find((f) => f.id === selectedFindingId) ||
    findings.find((f) => f.criticId === selectedAgentId) ||
    findings[0];

  const currentCriticIdx = critics.findIndex((c) => c.id === selectedAgentId);
  const handleCycleCritic = (dir: -1 | 1) => {
    if (critics.length === 0) return;
    const nextIdx =
      currentCriticIdx === -1
        ? 0
        : (currentCriticIdx + dir + critics.length) % critics.length;
    selectAgent(critics[nextIdx].id);
  };

  const title = selectedAgent
    ? selectedAgent.name
    : selectedStation === 'arbiter'
    ? 'Main Arbiter'
    : selectedStation === 'sandbox'
    ? 'Sandbox Kiln'
    : selectedStation === 'coder'
    ? 'Coding Agent'
    : activeFinding?.title || 'Verification Inspector';

  const subtitle = selectedAgent
    ? `${ROLE_NAMES[selectedAgent.role] || selectedAgent.role} · ${MODEL_NAMES[selectedAgent.model] || selectedAgent.model}`
    : selectedStation === 'arbiter'
    ? 'Sole arbiter reconciling verified proofs'
    : selectedStation === 'sandbox'
    ? 'Zero-token deterministic fast-fail gate'
    : selectedStation === 'coder'
    ? 'TypeScript patch builder'
    : 'Proof-gated verification details';

  const sandboxChecks = [
    { label: 'ESLint & Biome', status: sandboxState.linter },
    { label: 'TypeScript typecheck', status: sandboxState.typecheck },
    { label: 'Production build', status: sandboxState.compiler },
    { label: 'Baseline unit tests (3/3)', status: sandboxState.baselineTests }
  ];

  return (
    <aside
      aria-label="Verification inspector"
      inert={!isInspectorOpen ? true : undefined}
      className={`fixed top-14 right-0 bottom-0 w-[400px] max-w-full bg-white border-l border-[#E6E4DF] z-40 flex flex-col overflow-hidden text-[#141413] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-[opacity] ${
        isInspectorOpen
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full opacity-0 pointer-events-none motion-reduce:translate-x-0'
      }`}
      style={{
        boxShadow: '-4px 0 12px rgb(20 20 19 / 0.05)'
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E6E4DF] flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-[#141413] truncate">
            {title}
          </h2>
          <p className="text-[12.5px] text-[#575550] mt-0.5 truncate">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedAgent && (
            <>
              <button
                type="button"
                onClick={() => handleCycleCritic(-1)}
                aria-label="Previous reviewer"
                title="Previous reviewer"
                className="h-7 w-7 rounded-md text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleCycleCritic(1)}
                aria-label="Next reviewer"
                title="Next reviewer"
                className="h-7 w-7 rounded-md text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setInspectorOpen(false)}
            aria-label="Close inspector"
            title="Close inspector (Esc)"
            className="h-7 w-7 rounded-md text-[#575550] hover:text-[#141413] hover:bg-[#F2F1EE] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Live Thought Note */}
      {selectedAgent && (
        <div className="px-5 py-3 bg-[#F6F5F2] border-b border-[#E6E4DF] shrink-0">
          <p className="text-[13px] text-[#141413] leading-relaxed">
            {selectedAgent.currentThought}
          </p>
        </div>
      )}

      {/* Underline Tabs */}
      <div className="border-b border-[#E6E4DF] px-5 flex items-center gap-5 shrink-0" role="tablist" aria-label="Inspector sections">
        {[
          { id: 'claim' as const, label: 'Proofs' },
          { id: 'code' as const, label: 'Code' },
          { id: 'sandbox' as const, label: 'Sandbox' },
          { id: 'history' as const, label: `Activity (${auditLog.length})` }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'border-[#141413] text-[#141413]'
                  : 'border-transparent text-[#575550] hover:text-[#141413]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Proofs */}
      {activeTab === 'claim' && activeFinding && (
        <div className="flex-1 overflow-y-auto cc-scroll p-5 space-y-5">
          {/* Findings List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] font-medium text-[#6B6862]">
              <span>Council findings</span>
              <span className="tabular-nums">{findings.length}</span>
            </div>

            <div className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
              {findings.map((f) => {
                const isSelectedFinding = f.id === activeFinding.id;
                const isVerified = f.proofStatus === 'verified_reproduced';
                const isRejected = f.proofStatus === 'rejected_no_proof';

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => selectFinding(f.id)}
                    className={`w-full px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                      isSelectedFinding ? 'bg-[#F6F5F2]' : 'bg-white hover:bg-[#FAF9F7]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-medium text-[#141413] truncate">
                        {f.criticName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                          isVerified
                            ? 'bg-[#ECFDF3] text-[#166534]'
                            : isRejected
                            ? 'bg-[#FEF2F2] text-[#991B1B]'
                            : 'bg-[#F2F1EE] text-[#575550]'
                        }`}
                      >
                        {isVerified ? 'Verified' : isRejected ? 'Filtered' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#575550] truncate mt-0.5">{f.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Finding Details */}
          <div className="space-y-4">
            <div>
              <div className="text-[12px] font-medium text-[#6B6862]">
                {activeFinding.cweCode || 'Finding details'}
              </div>
              <h3 className="text-[14px] font-semibold text-[#141413] mt-1 leading-snug">
                {activeFinding.title}
              </h3>
              <p className="text-[13px] text-[#575550] mt-1.5 leading-relaxed">
                {activeFinding.description}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-[12px] font-medium text-[#6B6862]">
                Executable assertion
              </div>
              <pre className="p-3.5 rounded-xl bg-[#F6F5F2] border border-[#E6E4DF] text-[#141413] text-[12.5px] leading-relaxed overflow-x-auto cc-scroll whitespace-pre-wrap">
                {activeFinding.proposedAssertion}
              </pre>
            </div>

            <div className="space-y-1.5">
              <div className="text-[12px] font-medium text-[#6B6862]">
                Proof gate result
              </div>
              <div
                className={`p-3 rounded-xl border text-[12.5px] leading-relaxed flex items-start gap-2.5 ${
                  activeFinding.proofStatus === 'verified_reproduced'
                    ? 'bg-[#ECFDF3] border-[#BBF7D0] text-[#166534]'
                    : activeFinding.proofStatus === 'rejected_no_proof'
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                    : 'bg-[#F6F5F2] border-[#E6E4DF] text-[#575550]'
                }`}
              >
                {activeFinding.proofStatus === 'verified_reproduced' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                ) : activeFinding.proofStatus === 'rejected_no_proof' ? (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Clock className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span>
                  {activeFinding.proofStatus === 'untested'
                    ? 'Advance to Proof gate to run this assertion in the sandbox.'
                    : activeFinding.sandboxOutput}
                </span>
              </div>
            </div>

            {activeFinding.arbitrationOutcome !== 'pending' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[12px] font-medium text-[#6B6862]">
                  <span>Main Arbiter decision</span>
                  <span className="tabular-nums">Loop {Math.max(1, revisionLoop)} of 2</span>
                </div>
                <p className="p-3 rounded-xl bg-[#F6F5F2] border border-[#E6E4DF] text-[13px] text-[#141413] leading-relaxed">
                  {activeFinding.arbitrationReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Code */}
      {activeTab === 'code' && (
        <div className="flex-1 overflow-y-auto cc-scroll p-5 space-y-4">
          <div className="flex bg-[#F2F1EE] p-0.5 rounded-lg text-[12.5px]">
            {[
              { id: 'diff' as const, label: 'Diff' },
              { id: 'initial' as const, label: 'Before' },
              { id: 'patched' as const, label: 'After' },
              { id: 'exploit_test' as const, label: 'Test' }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setCodeViewMode(mode.id)}
                className={`flex-1 py-1.5 rounded-[6px] font-medium transition-colors cursor-pointer ${
                  codeViewMode === mode.id
                    ? 'bg-white text-[#141413] border border-[#E6E4DF]'
                    : 'text-[#575550] hover:text-[#141413] border border-transparent'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[12.5px] text-[#575550]">
            <FileCode2 className="w-3.5 h-3.5 text-[#6B6862] shrink-0" aria-hidden="true" />
            <span className="truncate">{scenario.filePath}</span>
          </div>

          <div className="rounded-xl border border-[#E6E4DF] bg-[#FAF9F7] overflow-hidden">
            {codeViewMode === 'diff' ? (
              <div className="py-2 overflow-x-auto cc-scroll text-[12.5px] leading-[1.6]">
                {DIFF_LINES.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-3.5 py-0.5 whitespace-pre ${
                      line.type === 'add'
                        ? 'bg-[#ECFDF3] text-[#14532D]'
                        : line.type === 'remove'
                        ? 'bg-[#FEF2F2] text-[#991B1B]'
                        : line.type === 'meta'
                        ? 'text-[#6B6862]'
                        : 'text-[#575550]'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            ) : (
              <pre className="p-3.5 text-[12.5px] leading-[1.6] text-[#141413] overflow-x-auto cc-scroll whitespace-pre">
                {codeViewMode === 'initial'
                  ? scenario.initialCode
                  : codeViewMode === 'patched'
                  ? scenario.patchedCode
                  : scenario.exploitTestCode}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="flex-1 overflow-y-auto cc-scroll p-5 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[14px] font-semibold text-[#141413]">
                Fast-fail sandbox gate
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                  sandboxState.status === 'passed'
                    ? 'bg-[#ECFDF3] text-[#166534]'
                    : sandboxState.status === 'running'
                    ? 'bg-[#FFFBEB] text-[#92400E]'
                    : 'bg-[#F2F1EE] text-[#575550]'
                }`}
              >
                {sandboxState.status}
              </span>
            </div>
            <p className="text-[13px] text-[#575550] leading-relaxed">
              Runs deterministic linter, typecheck, build, and unit tests before any AI reviewer spends tokens.
            </p>
          </div>

          <div className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
            {sandboxChecks.map((check) => (
              <div
                key={check.label}
                className="px-3.5 py-2.5 bg-white flex items-center justify-between gap-2 text-[13px]"
              >
                <span className="text-[#141413]">{check.label}</span>
                <span
                  className={`text-[12px] font-medium capitalize ${
                    check.status === 'passed'
                      ? 'text-[#166534]'
                      : check.status === 'running'
                      ? 'text-[#92400E]'
                      : 'text-[#6B6862]'
                  }`}
                >
                  {check.status}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="text-[12px] font-medium text-[#6B6862]">Output log</div>
            <div className="p-3.5 rounded-xl bg-[#F6F5F2] border border-[#E6E4DF] text-[12.5px] space-y-1.5 overflow-x-auto cc-scroll">
              {sandboxState.details.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.includes('Clean') || line.includes('PASS') || line.includes('green') || line.includes('cleared')
                      ? 'text-[#166534] font-medium'
                      : 'text-[#575550]'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Activity */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto cc-scroll p-5 space-y-3">
          <div className="flex items-center justify-between text-[12px] font-medium text-[#6B6862]">
            <span>Verification activity</span>
            <span>Latest first</span>
          </div>

          <div className="border border-[#E6E4DF] rounded-xl divide-y divide-[#EFECE6] overflow-hidden">
            {auditLog.map((evt) => (
              <div key={evt.id} className="p-3.5 bg-white space-y-1">
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span
                    className={`font-medium ${
                      evt.type === 'success'
                        ? 'text-[#166534]'
                        : evt.type === 'warning'
                        ? 'text-[#92400E]'
                        : 'text-[#6B6862]'
                    }`}
                  >
                    {evt.source.replace('_', ' ')}
                  </span>
                  <span className="text-[#6B6862] tabular-nums">{evt.timestamp}</span>
                </div>
                <div className="text-[13px] font-semibold text-[#141413]">{evt.title}</div>
                <p className="text-[12.5px] text-[#575550] leading-relaxed">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
