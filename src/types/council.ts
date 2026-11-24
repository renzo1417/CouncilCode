export type ModelProvider = 'anthropic' | 'openai' | 'deepseek' | 'google';

export type ReviewerRole = 'security' | 'logic' | 'contract' | 'performance' | 'style';

export type AgentStatus =
  | 'entering'
  | 'idle'
  | 'waiting_sandbox'
  | 'reviewing'
  | 'found_issue'
  | 'submitting'
  | 'approved'
  | 'celebrating';

export interface CriticAgent {
  id: string;
  name: string;
  role: ReviewerRole;
  model: ModelProvider;
  deskIndex: number; // 0 to 5
  color: string;
  accentColor: string;
  avatarSeed: string;
  status: AgentStatus;
  currentThought: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  rotationY: number;
  isCustom?: boolean;
}

export type ProofStatus = 'untested' | 'verified_reproduced' | 'rejected_no_proof';

export type ArbitrationOutcome = 'pending' | 'accepted_for_fix' | 'discarded_unsupported';

export interface CodeFinding {
  id: string;
  criticId: string;
  criticName: string;
  criticRole: ReviewerRole;
  model: ModelProvider;
  title: string;
  cweCode?: string;
  description: string;
  affectedFile: string;
  affectedLineRange: string;
  affectedCode: string;
  proposedAssertion: string;
  proofStatus: ProofStatus;
  sandboxOutput: string;
  arbitrationOutcome: ArbitrationOutcome;
  arbitrationReason: string;
}

export interface DeterministicSandboxState {
  status: 'idle' | 'running' | 'passed' | 'failed';
  linter: 'pending' | 'running' | 'passed' | 'failed';
  typecheck: 'pending' | 'running' | 'passed' | 'failed';
  compiler: 'pending' | 'running' | 'passed' | 'failed';
  baselineTests: 'pending' | 'running' | 'passed' | 'failed';
  regressionTests: 'pending' | 'running' | 'passed' | 'failed';
  details: string[];
  durationMs: number;
}

export type WorkflowState =
  | 'IDLE'
  | 'SANDBOX_INITIAL'
  | 'CRITICS_REVIEWING'
  | 'PROOF_VERIFICATION'
  | 'MAIN_AGENT_ARBITRATION'
  | 'REVISION_IN_PROGRESS'
  | 'SANDBOX_RECHECK'
  | 'COUNCIL_RECHECK'
  | 'VERIFIED'
  | 'PR_READY';

export interface AuditEvent {
  id: string;
  timestamp: string;
  stage: WorkflowState;
  source: 'SANDBOX' | 'CRITIC' | 'PROOF_GATE' | 'MAIN_AGENT' | 'CODER' | 'SYSTEM';
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface CodeScenario {
  id: string;
  title: string;
  summary: string;
  vulnerabilityType: string;
  initialCode: string;
  patchedCode: string;
  baselineTestCode: string;
  exploitTestCode: string;
  filePath: string;
}
