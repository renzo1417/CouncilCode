'use client';

import React from 'react';
import { useCouncilStore } from '@/store/councilStore';
import {
  X,
  ShieldAlert,
  Server,
  FileCode2,
  CheckCircle2,
  Terminal,
  GitCompare,
  Sparkles,
  Bot,
  Cpu,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

  if (!isInspectorOpen) return null;

  // Resolve what is currently focused
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
    ? `${selectedAgent.name} (Desk #${selectedAgent.deskIndex + 1})`
    : selectedStation === 'arbiter'
    ? 'Main Arbiter Command'
    : selectedStation === 'sandbox'
    ? 'Deterministic Sandbox Kiln'
    : selectedStation === 'coder'
    ? 'Coding Agent Station'
    : activeFinding?.title || 'Inspection Panel';

  const roleBadge = selectedAgent
    ? `${selectedAgent.role.toUpperCase()} CRITIC`
    : selectedStation === 'arbiter'
    ? 'CHIEF ARBITER'
    : selectedStation === 'coder'
    ? 'CODEBASE OWNER'
    : selectedStation === 'sandbox'
    ? 'FAST-FAIL GATE'
    : 'VERIFICATION';

  const modelBadge = selectedAgent
    ? selectedAgent.model === 'anthropic'
      ? 'Claude 3.7 Sonnet'
      : selectedAgent.model === 'deepseek'
      ? 'DeepSeek R1'
      : selectedAgent.model === 'openai'
      ? 'GPT-4o'
      : 'Gemini 2.5'
    : selectedStation === 'arbiter'
    ? 'Sole Arbiter Engine'
    : selectedStation === 'coder'
    ? 'TypeScript Builder'
    : 'Zero-Token Sandbox';

  return (
    <aside
      className="fixed top-13 right-0 bottom-18 w-[430px] max-w-[95vw] bg-[#FAF8F5]/95 backdrop-blur-xl border-l border-stone-200/90 shadow-2xl z-40 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 text-stone-800 rounded-bl-2xl"
      style={{
        boxShadow: '-8px 0 32px rgba(45, 35, 25, 0.08)'
      }}
    >
      {/* =========================================================================
          1. INSPECTOR HEADER WITH WORKER QUICK-SWITCHER
      ========================================================================= */}
      <div className="p-3.5 border-b border-stone-200/80 bg-white/70 flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-stone-100 text-stone-700 border border-stone-200/70 font-medium">
              {roleBadge}
            </span>
            <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-stone-400" />
              {modelBadge}
            </span>
          </div>
          <h2 className="text-sm font-semibold text-stone-900 truncate leading-snug font-sans">{title}</h2>
        </div>

        {/* Cycle Workers + Close Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleCycleCritic(-1)}
            className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200/70 transition-colors cursor-pointer"
            title="Previous Critic Worker"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleCycleCritic(1)}
            className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200/70 transition-colors cursor-pointer"
            title="Next Critic Worker"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setInspectorOpen(false)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer ml-1"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. LIVE THOUGHT / STATUS CALLOUT
      ========================================================================= */}
      {selectedAgent && (
        <div className="px-3.5 py-2.5 bg-stone-100/60 border-b border-stone-200/70 flex items-start gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C85A3E] shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-medium">
              Worker Live Thought
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-sans italic">
              &ldquo;{selectedAgent.currentThought}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. TABS NAVIGATION (Proof Claim | Code & Diff | Sandbox | Audit Log)
      ========================================================================= */}
      <div className="flex border-b border-stone-200/80 bg-stone-100/50 p-1 gap-1">
        <button
          onClick={() => setActiveTab('claim')}
          className={`flex-1 py-1.5 px-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'claim'
              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShieldAlert className="w-3 h-3 text-[#C85A3E] shrink-0" />
          <span>Proofs</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 px-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'code'
              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <GitCompare className="w-3 h-3 text-stone-600 shrink-0" />
          <span>Code Diff</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex-1 py-1.5 px-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Server className="w-3 h-3 text-stone-600 shrink-0" />
          <span>Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 px-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <History className="w-3 h-3 text-stone-600 shrink-0" />
          <span>Audit ({auditLog.length})</span>
        </button>
      </div>

      {/* =========================================================================
          4. TAB 1: PROOF CLAIM & EXECUTABLE ASSERTION
      ========================================================================= */}
      {activeTab === 'claim' && activeFinding && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Finding Selector Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Council Findings ({findings.length}) &mdash; Click to Inspect
            </span>
            <div className="flex flex-col gap-1.5">
              {findings.map((f) => {
                const isSelectedFinding = f.id === activeFinding.id;
                const isVerified = f.proofStatus === 'verified_reproduced';
                const isRejected = f.proofStatus === 'rejected_no_proof';

                return (
                  <div
                    key={f.id}
                    onClick={() => selectFinding(f.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelectedFinding
                        ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                        : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-stone-900 truncate">
                        {f.criticName} <span className="font-normal text-stone-400">({f.criticRole})</span>
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isVerified ? '✓ Proof Verified' : isRejected ? '✕ Rejected (No Proof)' : 'Untested'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-1">{f.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Finding Detail Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {activeFinding.cweCode || 'Vulnerability Detail'}
              </span>
              <h3 className="text-xs font-bold text-stone-900 mt-0.5 leading-snug">
                {activeFinding.title}
              </h3>
              <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                {activeFinding.description}
              </p>
            </div>

            {/* Proposed Executable Assertion */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-amber-600" />
                Proposed Executable Proof Assertion
              </span>
              <pre className="p-2.5 rounded-lg bg-stone-900 text-stone-100 text-[11px] font-mono overflow-x-auto leading-relaxed border border-stone-800">
                {activeFinding.proposedAssertion}
              </pre>
            </div>

            {/* Proof Gate Outcome */}
            <div className="space-y-1 pt-1 border-t border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Proof Gate Verification Result
              </span>
              <div
                className={`p-2.5 rounded-lg text-[11px] font-mono leading-relaxed border ${
                  activeFinding.proofStatus === 'verified_reproduced'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : activeFinding.proofStatus === 'rejected_no_proof'
                    ? 'bg-rose-50 text-rose-900 border-rose-300'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {activeFinding.proofStatus === 'verified_reproduced'
                  ? `✅ ${activeFinding.sandboxOutput}`
                  : activeFinding.proofStatus === 'rejected_no_proof'
                  ? `❌ ${activeFinding.sandboxOutput}`
                  : '⏳ Step to "Proof Gate" stage to execute assertion against isolated sandbox...'}
              </div>
            </div>

            {/* Main Agent Arbitration */}
            {activeFinding.arbitrationOutcome !== 'pending' && (
              <div className="space-y-1 pt-1 border-t border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                  <Bot className="w-3 h-3 text-indigo-600" />
                  Main Arbiter Verdict (Loop {Math.max(1, revisionLoop)}/2)
                </span>
                <p className="text-[11px] font-sans text-stone-800 bg-indigo-50/70 p-2 rounded-lg border border-indigo-200 leading-relaxed">
                  {activeFinding.arbitrationReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. TAB 2: CODE & SYNTAX DIFF
      ========================================================================= */}
      {activeTab === 'code' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {/* Sub-mode selector */}
          <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px]">
            <button
              onClick={() => setCodeViewMode('diff')}
              className={`flex-1 py-1 rounded font-medium transition-all cursor-pointer ${
                codeViewMode === 'diff' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Unified Diff
            </button>
            <button
              onClick={() => setCodeViewMode('initial')}
              className={`flex-1 py-1 rounded font-medium transition-all cursor-pointer ${
                codeViewMode === 'initial' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Vulnerable
            </button>
            <button
              onClick={() => setCodeViewMode('patched')}
              className={`flex-1 py-1 rounded font-medium transition-all cursor-pointer ${
                codeViewMode === 'patched' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Patched
            </button>
            <button
              onClick={() => setCodeViewMode('exploit_test')}
              className={`flex-1 py-1 rounded font-medium transition-all cursor-pointer ${
                codeViewMode === 'exploit_test' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Proof Test
            </button>
          </div>

          <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
            <FileCode2 className="w-3.5 h-3.5 text-stone-400" />
            <span>{scenario.filePath}</span>
          </div>

          {/* Syntax Display Box */}
          <div className="rounded-xl overflow-hidden border border-stone-800 bg-[#14161C] text-stone-200">
            <div className="px-3 py-1.5 bg-[#1C1F26] border-b border-stone-800 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>TypeScript Express Endpoint</span>
              <span>{codeViewMode.toUpperCase()}</span>
            </div>
            <pre className="p-3 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[460px]">
              {codeViewMode === 'diff' ? (
                <>
                  <span className="text-stone-500">@@ -18,10 +18,18 @@</span>
                  {'\n'}
                  <span className="text-stone-400">
                    {' '}invoiceRouter.get(&apos;/:id&apos;, requireAuth, async (req, res) =&gt; &#123;
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">
                    + const userOrgId = req.user?.organizationId;
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">
                    + if (!userOrgId) throw new ForbiddenError(&apos;Missing org context&apos;);
                  </span>
                  {'\n'}
                  <span className="text-stone-400">
                    {' '} const invoice = await db.invoices.findUnique(&#123; where: &#123; id &#125; &#125;);
                  </span>
                  {'\n'}
                  <span className="text-rose-400">
                    - // Missing tenant ownership verification!
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">
                    + // ✅ CouncilCode Verified Guard:
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">
                    + if (invoice.organizationId !== userOrgId) &#123;
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">
                    + return res.status(403).json(&#123; error: &apos;Forbidden&apos; &#125;);
                  </span>
                  {'\n'}
                  <span className="text-emerald-400">+ &#125;</span>
                  {'\n'}
                  <span className="text-stone-400">
                    {' '} return res.status(200).json(&#123; invoice &#125;);
                  </span>
                  {'\n'}
                  <span className="text-stone-400">&#125;);</span>
                </>
              ) : codeViewMode === 'initial' ? (
                scenario.initialCode
              ) : codeViewMode === 'patched' ? (
                scenario.patchedCode
              ) : (
                scenario.exploitTestCode
              )}
            </pre>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. TAB 3: DETERMINISTIC SANDBOX STATUS
      ========================================================================= */}
      {activeTab === 'sandbox' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">Zero-Token Fast-Fail Gate</span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  sandboxState.status === 'passed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : sandboxState.status === 'running'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {sandboxState.status}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              CouncilCode executes deterministic compiler, linter, and baseline test checks first.
              AI token spend is blocked if code fails basic syntax or compilation.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    sandboxState.linter === 'passed' ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <span className="text-stone-700">ESLint / Biome</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    sandboxState.typecheck === 'passed' ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <span className="text-stone-700">TypeScript tsc</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    sandboxState.compiler === 'passed' ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <span className="text-stone-700">Build Clean</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-stone-200">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    sandboxState.baselineTests === 'passed' ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <span className="text-stone-700">Unit Tests (3/3)</span>
              </div>
            </div>
          </div>

          {/* Sandbox Terminal Stream */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Live Sandbox Output Stream
            </span>
            <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-mono text-[11px] space-y-1 overflow-x-auto max-h-[300px]">
              {sandboxState.details.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-stone-500 select-none">&gt;</span>
                  <span className={line.includes('✅') || line.includes('PASS') ? 'text-emerald-400' : 'text-stone-300'}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. TAB 4: CHRONOLOGICAL AUDIT LOG
      ========================================================================= */}
      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Verification Event Log ({auditLog.length})
            </span>
            <span className="text-[10px] font-mono text-stone-400">Latest first</span>
          </div>

          <div className="space-y-2">
            {auditLog.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-xl bg-white border border-stone-200/80 space-y-1 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      evt.type === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : evt.type === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {evt.source}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">{evt.timestamp}</span>
                </div>
                <div className="font-semibold text-stone-900 text-xs">{evt.title}</div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          8. INSPECTOR FOOTER
      ========================================================================= */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between text-xs">
        <span className="text-[11px] text-stone-500 font-mono">
          CouncilCode Proof Harness v2.5
        </span>
        <button
          onClick={() => setInspectorOpen(false)}
          className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </aside>
  );
};
