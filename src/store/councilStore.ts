import { create } from 'zustand';
import {
  CriticAgent,
  CodeFinding,
  DeterministicSandboxState,
  WorkflowState,
  AuditEvent
} from '@/types/council';
import { INVOICE_IDOR_SCENARIO, INITIAL_FINDINGS } from '@/data/scenarios';
import { playSound } from '@/utils/sound';

// Office desk layout coordinates in 3D scene (x, y, z)
export const CRITIC_DESK_POSITIONS: [number, number, number][] = [
  [-3.2, 0, -1.8], // Desk 0 (Front left)
  [-1.1, 0, -1.8], // Desk 1 (Front mid-left)
  [1.1, 0, -1.8],  // Desk 2 (Front mid-right)
  [3.2, 0, -1.8],  // Desk 3 (Front right - open for + Add Critic)
  [-2.2, 0, 1.8],  // Desk 4 (Back left - open for + Add Critic)
  [2.2, 0, 1.8],   // Desk 5 (Back right - open for + Add Critic)
];

// Calculate exact chair seat position for a given critic desk (ergonomically tucked 0.34m South of desk center)
export const getCriticSeatPosition = (deskIndex: number): [number, number, number] => {
  const desk = CRITIC_DESK_POSITIONS[deskIndex] || [0, 0, 0];
  return [desk[0], 0, desk[2] + 0.34];
};

export const ENTRANCE_DOOR_POS: [number, number, number] = [-6.2, 0, 3.8];
export const ARBITER_POS: [number, number, number] = [0, 0, 3.2];
export const CODER_POS: [number, number, number] = [-4.6, 0, -0.2];
export const SANDBOX_STATION_POS: [number, number, number] = [4.8, 0, 0.4];

export const INITIAL_AGENTS: CriticAgent[] = [
  {
    id: 'critic-claude',
    name: 'Claude Sentinel',
    role: 'security',
    model: 'anthropic',
    deskIndex: 0,
    color: '#D97706',      // Warm Amber
    accentColor: '#F59E0B',
    avatarSeed: 'claude',
    status: 'idle',
    currentThought: 'Standing by for deterministic sandbox gate before scanning tenant boundaries...',
    position: getCriticSeatPosition(0),
    targetPosition: getCriticSeatPosition(0),
    rotationY: Math.PI
  },
  {
    id: 'critic-deepseek',
    name: 'DeepSeek Logic',
    role: 'logic',
    model: 'deepseek',
    deskIndex: 1,
    color: '#059669',      // Sage Green
    accentColor: '#10B981',
    avatarSeed: 'deepseek',
    status: 'idle',
    currentThought: 'Analyzing state invariants and null-coalescing boundaries...',
    position: getCriticSeatPosition(1),
    targetPosition: getCriticSeatPosition(1),
    rotationY: Math.PI
  },
  {
    id: 'critic-gpt',
    name: 'CodeCraft Style',
    role: 'style',
    model: 'openai',
    deskIndex: 2,
    color: '#E11D48',      // Terracotta Rose
    accentColor: '#F43F5E',
    avatarSeed: 'gpt',
    status: 'idle',
    currentThought: 'Checking functional idioms and variable naming conventions...',
    position: getCriticSeatPosition(2),
    targetPosition: getCriticSeatPosition(2),
    rotationY: Math.PI
  }
];

const WORKFLOW_ORDER: WorkflowState[] = [
  'IDLE',
  'SANDBOX_INITIAL',
  'CRITICS_REVIEWING',
  'PROOF_VERIFICATION',
  'MAIN_AGENT_ARBITRATION',
  'REVISION_IN_PROGRESS',
  'SANDBOX_RECHECK',
  'COUNCIL_RECHECK',
  'VERIFIED',
  'PR_READY'
];

interface CouncilStore {
  // Workflow State
  workflowState: WorkflowState;
  revisionLoop: number;
  maxRevisionLoops: number;
  scenario: typeof INVOICE_IDOR_SCENARIO;

  // Components
  critics: CriticAgent[];
  findings: CodeFinding[];
  sandboxState: DeterministicSandboxState;
  auditLog: AuditEvent[];

  // Selection & UI
  selectedAgentId: string | null;
  selectedFindingId: string | null;
  selectedStation: string | null;
  cameraFocus: 'overview' | 'arbiter' | 'sandbox' | 'coder' | 'agent';
  focusTarget: [number, number, number] | null;

  // Controls & Playback
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 2
  soundEnabled: boolean;
  codeViewMode: 'diff' | 'initial' | 'patched' | 'exploit_test';
  isAddCriticOpen: boolean;
  isMultiDevModalOpen: boolean;
  isPRSummaryOpen: boolean;
  isInspectorOpen: boolean;
  isRosterOpen: boolean;
  inspectorTab: 'claim' | 'code' | 'sandbox' | 'history';

  // Actions
  setWorkflowState: (state: WorkflowState) => void;
  startWorkflow: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToStage: (targetState: WorkflowState) => void;
  resetWorkflow: () => void;
  togglePlayPause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleSound: () => void;
  setCodeViewMode: (mode: 'diff' | 'initial' | 'patched' | 'exploit_test') => void;

  // Critic Management
  addCritic: (critic: Omit<CriticAgent, 'position' | 'targetPosition' | 'rotationY' | 'status' | 'currentThought'>) => boolean;
  removeCritic: (id: string) => void;

  // Selection
  selectAgent: (id: string | null) => void;
  selectFinding: (id: string | null) => void;
  selectStation: (station: string | null, openInspector?: boolean) => void;
  setCameraFocus: (focus: 'overview' | 'arbiter' | 'sandbox' | 'coder' | 'agent', target?: [number, number, number]) => void;

  // Modals & Panels
  setAddCriticOpen: (open: boolean) => void;
  setMultiDevModalOpen: (open: boolean) => void;
  setPRSummaryOpen: (open: boolean) => void;
  setInspectorOpen: (open: boolean) => void;
  setRosterOpen: (open: boolean) => void;
  setInspectorTab: (tab: 'claim' | 'code' | 'sandbox' | 'history') => void;
}

const INITIAL_SANDBOX: DeterministicSandboxState = {
  status: 'idle',
  linter: 'pending',
  typecheck: 'pending',
  compiler: 'pending',
  baselineTests: 'pending',
  regressionTests: 'pending',
  details: ['Ready to execute deterministic verification'],
  durationMs: 0
};

export const useCouncilStore = create<CouncilStore>((set, get) => ({
  workflowState: 'IDLE',
  revisionLoop: 0,
  maxRevisionLoops: 2,
  scenario: INVOICE_IDOR_SCENARIO,

  critics: INITIAL_AGENTS,
  findings: JSON.parse(JSON.stringify(INITIAL_FINDINGS)),
  sandboxState: INITIAL_SANDBOX,
  auditLog: [
    {
      id: 'log-0',
      timestamp: '00:00.00',
      stage: 'IDLE',
      source: 'SYSTEM',
      title: 'CouncilCode Initialized',
      description: 'System loaded with 3 cross-vendor critics (Claude Sentinel, DeepSeek Logic & CodeCraft Style). Deterministic sandbox standing by.',
      type: 'info'
    }
  ],

  selectedAgentId: null,
  selectedFindingId: 'finding-sec-01',
  selectedStation: null,
  cameraFocus: 'overview',
  focusTarget: null,

  isPlaying: false,
  playbackSpeed: 1,
  soundEnabled: true,
  codeViewMode: 'diff',
  isAddCriticOpen: false,
  isMultiDevModalOpen: false,
  isPRSummaryOpen: false,
  isInspectorOpen: false,
  isRosterOpen: false,
  inspectorTab: 'claim',

  setWorkflowState: (state) => set({ workflowState: state }),

  togglePlayPause: () => {
    const isPlaying = !get().isPlaying;
    set({ isPlaying });
    if (isPlaying && get().workflowState === 'IDLE') {
      get().startWorkflow();
    }
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setCodeViewMode: (mode) => set({ codeViewMode: mode }),

  setAddCriticOpen: (open) => set({ isAddCriticOpen: open }),
  setMultiDevModalOpen: (open) => set({ isMultiDevModalOpen: open }),
  setPRSummaryOpen: (open) => set({ isPRSummaryOpen: open }),
  setInspectorOpen: (open) => set((state) => ({
    isInspectorOpen: open,
    isRosterOpen: open && typeof window !== 'undefined' && window.innerWidth < 1024 ? false : state.isRosterOpen
  })),
  setRosterOpen: (open) => set((state) => ({
    isRosterOpen: open,
    isInspectorOpen: open && typeof window !== 'undefined' && window.innerWidth < 1024 ? false : state.isInspectorOpen
  })),
  setInspectorTab: (tab) => set({ inspectorTab: tab }),

  selectAgent: (id) => {
    if (get().soundEnabled) playSound('click');
    if (!id) {
      set({ selectedAgentId: null, isInspectorOpen: false });
      return;
    }
    const agent = get().critics.find((c) => c.id === id);
    if (agent) {
      const relatedFinding = get().findings.find((f) => f.criticId === id);
      const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1024;
      set({
        selectedAgentId: id,
        selectedStation: null,
        cameraFocus: 'agent',
        focusTarget: agent.targetPosition,
        isInspectorOpen: true,
        isRosterOpen: isNarrow ? false : get().isRosterOpen,
        inspectorTab: 'claim',
        ...(relatedFinding ? { selectedFindingId: relatedFinding.id } : {})
      });
    }
  },

  selectFinding: (id) => {
    if (get().soundEnabled) playSound('click');
    set({ selectedFindingId: id, isInspectorOpen: true, inspectorTab: 'claim' });
    const finding = get().findings.find((f) => f.id === id);
    if (finding) {
      const critic = get().critics.find((c) => c.id === finding.criticId);
      if (critic) {
        set({
          selectedAgentId: critic.id,
          selectedStation: null,
          cameraFocus: 'agent',
          focusTarget: critic.targetPosition
        });
      }
    }
  },

  selectStation: (station, openInspector = true) => {
    if (get().soundEnabled) playSound('click');
    if (!station) {
      set({ selectedStation: null, selectedAgentId: null });
      get().setCameraFocus('overview');
      return;
    }
    const nextTab =
      station === 'sandbox' ? 'sandbox' : station === 'coder' ? 'code' : 'claim';
    const shouldOpenInspector = openInspector || get().isInspectorOpen;
    const isNarrow = typeof window !== 'undefined' && window.innerWidth < 1024;
    set({
      selectedStation: station,
      selectedAgentId: null,
      isInspectorOpen: shouldOpenInspector,
      isRosterOpen: shouldOpenInspector && isNarrow ? false : get().isRosterOpen,
      inspectorTab: nextTab
    });
    if (station === 'arbiter') {
      get().setCameraFocus('arbiter', ARBITER_POS);
    } else if (station === 'sandbox') {
      get().setCameraFocus('sandbox', SANDBOX_STATION_POS);
    } else if (station === 'coder') {
      get().setCameraFocus('coder', CODER_POS);
    } else {
      get().setCameraFocus('overview');
    }
  },

  setCameraFocus: (focus, target) => {
    set({
      cameraFocus: focus,
      focusTarget: target || null
    });
  },

  addCritic: (config) => {
    const { critics, soundEnabled } = get();
    // Find first vacant desk
    const occupiedDesks = new Set(critics.map((c) => c.deskIndex));
    let availableDesk = -1;
    for (let i = 0; i < CRITIC_DESK_POSITIONS.length; i++) {
      if (!occupiedDesks.has(i)) {
        availableDesk = i;
        break;
      }
    }

    if (availableDesk === -1) {
      return false; // No vacant desk available (max 6)
    }

    const hallwayPos: [number, number, number] = [-4.0, 0, 1.8];
    const newCritic: CriticAgent = {
      ...config,
      deskIndex: availableDesk,
      status: 'entering',
      currentThought: 'Entering CouncilCode studio diorama and walking along corridor...',
      position: [...ENTRANCE_DOOR_POS],
      targetPosition: hallwayPos, // First waypoint avoiding furniture
      rotationY: Math.PI,
      isCustom: true
    };

    const customFindingId = `finding-custom-${newCritic.id}`;
    const isStyleRole = config.role === 'style';
    const customFinding: CodeFinding = {
      id: customFindingId,
      criticId: newCritic.id,
      criticName: config.name,
      criticRole: config.role,
      model: config.model,
      title: isStyleRole
        ? `Style Suggestion: Refactor async handler formatting (${config.name})`
        : config.role === 'security'
        ? `Cross-Tenant Authorization Boundary Check (${config.name})`
        : config.role === 'performance'
        ? `Query Index Check on db.invoices.findUnique (${config.name})`
        : `Contract & Invariant Verification on /invoices/:id (${config.name})`,
      cweCode: config.role === 'security' ? 'CWE-639: Tenant Isolation' : `Domain: ${config.role.toUpperCase()}`,
      description: isStyleRole
        ? 'Subjective stylistic suggestion without an executable failing test assertion.'
        : `${config.name} (${config.model.toUpperCase()}) verified endpoint behavior against ${config.role} invariants in isolated sandbox.`,
      affectedFile: 'src/api/routes/invoices.ts',
      affectedLineRange: 'L18-L33',
      affectedCode: 'const invoice = await db.invoices.findUnique({ where: { id } });',
      proposedAssertion: isStyleRole
        ? '// No executable test failure provided\n// Subjective preference only'
        : `it('verifies ${config.role} invariant on GET /api/v1/invoices/:id', async () => {\n  const res = await request(app).get('/api/v1/invoices/inv_alpha').auth(crossTenantToken);\n  expect(res.status).toBe(403);\n});`,
      proofStatus: 'untested',
      sandboxOutput: '',
      arbitrationOutcome: 'pending',
      arbitrationReason: ''
    };

    if (soundEnabled) playSound('step');

    set((state) => ({
      critics: [...state.critics, newCritic],
      findings: [...state.findings, customFinding],
      selectedAgentId: newCritic.id,
      selectedFindingId: customFindingId,
      selectedStation: null,
      isInspectorOpen: true,
      auditLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Live',
          stage: state.workflowState,
          source: 'CRITIC',
          title: `New Reviewer Assigned: ${config.name}`,
          description: `Configured as ${config.role} reviewer running ${config.model.toUpperCase()} at Workstation #${availableDesk + 1}.`,
          type: 'info'
        },
        ...state.auditLog
      ]
    }));

    // Step 2: After hallway waypoint (700ms), turn towards desk chair
    const seatPos = getCriticSeatPosition(availableDesk);
    setTimeout(() => {
      set((state) => ({
        critics: state.critics.map((c) =>
          c.id === newCritic.id
            ? {
                ...c,
                targetPosition: seatPos,
                currentThought: 'Approaching workstation chair...'
              }
            : c
        )
      }));
    }, 700);

    // Step 3: Once arrived at desk chair (~1600ms), sit down and face laptop
    setTimeout(() => {
      set((state) => ({
        cameraFocus: state.selectedAgentId === newCritic.id ? 'agent' : state.cameraFocus,
        focusTarget: state.selectedAgentId === newCritic.id ? seatPos : state.focusTarget,
        critics: state.critics.map((c) =>
          c.id === newCritic.id
            ? {
                ...c,
                position: seatPos,
                targetPosition: seatPos,
                rotationY: Math.PI,
                status: state.workflowState === 'CRITICS_REVIEWING' ? 'reviewing' : 'idle',
                currentThought: 'Seated at workstation facing terminal. Ready for code inspection.'
              }
            : c
        )
      }));
    }, 1600);

    return true;
  },

  removeCritic: (id) => {
    const { critics, findings, soundEnabled } = get();
    if (soundEnabled) playSound('click');
    const remainingFindings = findings.filter((f) => f.criticId !== id);
    set({
      critics: critics.filter((c) => c.id !== id),
      findings: remainingFindings,
      selectedAgentId: get().selectedAgentId === id ? null : get().selectedAgentId,
      selectedFindingId:
        remainingFindings.some((f) => f.id === get().selectedFindingId)
          ? get().selectedFindingId
          : remainingFindings[0]?.id || null
    });
  },

  startWorkflow: () => {
    const { soundEnabled } = get();
    if (soundEnabled) playSound('step');

    // Transition to SANDBOX_INITIAL
    set((state) => ({
      workflowState: 'SANDBOX_INITIAL',
      selectedStation: 'sandbox',
      selectedAgentId: null,
      cameraFocus: 'sandbox',
      focusTarget: SANDBOX_STATION_POS,
      sandboxState: {
        status: 'running',
        linter: 'running',
        typecheck: 'running',
        compiler: 'running',
        baselineTests: 'running',
        regressionTests: 'pending',
        details: [
          'Deterministic Sandbox: Invoking fast-fail lint & typecheck checks...',
          'ESLint & Biome: 0 errors',
          'TypeScript v5.8 tsc: 0 type errors',
          'Compiling server package: build clean (142ms)',
          'Executing baseline unit suite: 3/3 passed'
        ],
        durationMs: 420
      },
      critics: state.critics.map((c) => ({
        ...c,
        status: 'waiting_sandbox',
        currentThought: 'Waiting for deterministic sandbox pass before consuming model tokens...'
      })),
      auditLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: '00:01.40',
          stage: 'SANDBOX_INITIAL',
          source: 'SANDBOX',
          title: 'Deterministic Gate Running',
          description: 'Zero-token fast-fail verification executing linter, typecheck, build, and unit tests.',
          type: 'info'
        },
        ...state.auditLog
      ]
    }));
  },

  stepForward: () => {
    const { workflowState, soundEnabled } = get();
    if (soundEnabled) playSound('step');

    switch (workflowState) {
      case 'IDLE': {
        get().startWorkflow();
        break;
      }

      case 'SANDBOX_INITIAL': {
        // Sandbox passed! Now release critics
        if (soundEnabled) playSound('pass');
        set((state) => ({
          workflowState: 'CRITICS_REVIEWING',
          selectedStation: null,
          cameraFocus: 'overview',
          sandboxState: {
            ...state.sandboxState,
            status: 'passed',
            linter: 'passed',
            typecheck: 'passed',
            compiler: 'passed',
            baselineTests: 'passed',
            details: [
              'Linter: Clean (0 errors)',
              'TypeScript: Clean (0 type errors)',
              'Build: Clean (0 errors)',
              'Baseline Tests: 3/3 passing',
              'Deterministic gate cleared. Critic Council review authorized.'
            ]
          },
          critics: state.critics.map((c) => ({
            ...c,
            status: c.role === 'security' ? 'found_issue' : 'reviewing',
            currentThought:
              c.role === 'security'
                ? 'Detected missing tenant constraint on GET /api/v1/invoices/:id. Drafting exploit assertion...'
                : c.role === 'style'
                ? 'Suggesting functional pipe refactor (no executable bug assertion)...'
                : 'Inspecting auth context null-coalescing and OpenAPI contract...'
          })),
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:03.20',
              stage: 'CRITICS_REVIEWING',
              source: 'SANDBOX',
              title: 'Deterministic Sandbox Passed (Zero Token Waste)',
              description: 'All 4 baseline gates green. Main Agent authorizes Cross-Vendor Critic Council inspection.',
              type: 'success'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'CRITICS_REVIEWING': {
        // Move to PROOF_VERIFICATION
        if (soundEnabled) playSound('eureka');
        const claudeSeat = getCriticSeatPosition(0);
        set((state) => ({
          workflowState: 'PROOF_VERIFICATION',
          cameraFocus: 'agent',
          focusTarget: claudeSeat,
          selectedAgentId: 'critic-claude',
          selectedStation: null,
          selectedFindingId: 'finding-sec-01',
          critics: state.critics.map((c) => ({
            ...c,
            status:
              c.role === 'security'
                ? 'submitting'
                : c.role === 'style'
                ? 'idle'
                : 'approved',
            currentThought:
              c.role === 'security'
                ? 'Submitted exploit assertion to Proof Gate: Expecting 403 Forbidden for cross-tenant request.'
                : c.role === 'style'
                ? 'Proof Gate rejected my stylistic comment: No executable test failure provided.'
                : 'Invariant assertion validated in sandbox.'
          })),
          findings: state.findings.map((f) => {
            if (f.id === 'finding-sec-01' || f.criticRole === 'security') {
              return {
                ...f,
                proofStatus: 'verified_reproduced',
                sandboxOutput:
                  'FAIL REPRODUCED: Expected status 403 Forbidden, received 200 OK with full invoice body. Exploit verified in sandbox!'
              };
            }
            if (f.id === 'finding-style-03' || f.criticRole === 'style') {
              return {
                ...f,
                proofStatus: 'rejected_no_proof',
                sandboxOutput:
                  'REJECTED BY PROOF GATE: Finding provides no executable reproducible assertion or test failure. Filtered out from PR.'
              };
            }
            return {
              ...f,
              proofStatus: 'verified_reproduced',
              sandboxOutput: 'Guard invariant validated against contract harness. Reproducible check confirmed.'
            };
          }),
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:06.10',
              stage: 'PROOF_VERIFICATION',
              source: 'PROOF_GATE',
              title: 'Proof Gate Verification Completed',
              description:
                'Claude Sentinel exploit assertion reproduced vulnerability in sandbox (200 != 403). CodeCraft Style rejected (no executable proof).',
              type: 'warning'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'PROOF_VERIFICATION': {
        // Move to MAIN_AGENT_ARBITRATION
        if (soundEnabled) playSound('click');
        set((state) => ({
          workflowState: 'MAIN_AGENT_ARBITRATION',
          selectedStation: 'arbiter',
          selectedAgentId: null,
          cameraFocus: 'arbiter',
          focusTarget: ARBITER_POS,
          findings: state.findings.map((f) => {
            if (f.id === 'finding-sec-01' || f.criticRole === 'security') {
              return {
                ...f,
                arbitrationOutcome: 'accepted_for_fix',
                arbitrationReason:
                  'Accepted: Reproducible IDOR exploit confirmed by Proof Gate. Assigned P0 patch task to Coding Agent.'
              };
            }
            if (f.id === 'finding-style-03' || f.criticRole === 'style') {
              return {
                ...f,
                arbitrationOutcome: 'discarded_unsupported',
                arbitrationReason:
                  'Discarded by Arbiter: Subjective preference with zero executable test delta. Banned from PR noise.'
              };
            }
            return {
              ...f,
              arbitrationOutcome: 'accepted_for_fix',
              arbitrationReason: 'Accepted: Null-coalescing org guard bundled into P0 tenant isolation patch.'
            };
          }),
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:08.40',
              stage: 'MAIN_AGENT_ARBITRATION',
              source: 'MAIN_AGENT',
              title: 'Main Agent Arbitrates Findings',
              description:
                'Sole arbiter reconciles claims: Verified security & guard fixes assigned to Coder. 1 subjective style comment discarded. Loop 1/2.',
              type: 'info'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'MAIN_AGENT_ARBITRATION': {
        // Move to REVISION_IN_PROGRESS
        if (soundEnabled) playSound('type');
        set((state) => ({
          workflowState: 'REVISION_IN_PROGRESS',
          revisionLoop: Math.max(1, state.revisionLoop),
          selectedStation: 'coder',
          selectedAgentId: null,
          cameraFocus: 'coder',
          focusTarget: CODER_POS,
          codeViewMode: 'diff',
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:10.90',
              stage: 'REVISION_IN_PROGRESS',
              source: 'CODER',
              title: 'Coding Agent Applying Security Patch',
              description:
                'Injecting organization tenant verification check and adding regression test suite.',
              type: 'info'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'REVISION_IN_PROGRESS': {
        // Move to SANDBOX_RECHECK
        if (soundEnabled) playSound('step');
        set((state) => ({
          workflowState: 'SANDBOX_RECHECK',
          selectedStation: 'sandbox',
          selectedAgentId: null,
          cameraFocus: 'sandbox',
          focusTarget: SANDBOX_STATION_POS,
          sandboxState: {
            status: 'running',
            linter: 'running',
            typecheck: 'running',
            compiler: 'running',
            baselineTests: 'running',
            regressionTests: 'running',
            details: [
              'Deterministic Sandbox (Loop 1 Recheck):',
              'Running baseline tests + newly added Security Regression Test...',
              'Compiling patched code...',
              'Running Supertest IDOR regression suite...'
            ],
            durationMs: 310
          },
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:12.70',
              stage: 'SANDBOX_RECHECK',
              source: 'SANDBOX',
              title: 'Sandbox Rerunning on Patched Code',
              description: 'Compiling patched code with regression test suite included.',
              type: 'info'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'SANDBOX_RECHECK': {
        // Sandbox recheck passed! Move to COUNCIL_RECHECK
        if (soundEnabled) playSound('pass');
        set((state) => ({
          workflowState: 'COUNCIL_RECHECK',
          selectedStation: null,
          cameraFocus: 'overview',
          sandboxState: {
            ...state.sandboxState,
            status: 'passed',
            linter: 'passed',
            typecheck: 'passed',
            compiler: 'passed',
            baselineTests: 'passed',
            regressionTests: 'passed',
            details: [
              'Linter: 0 errors',
              'Typecheck: Clean',
              'Baseline Tests: 3/3 passed',
              'Security Regression Test: PASS (403 Forbidden verified on cross-tenant access)',
              'All checks green.'
            ]
          },
          critics: state.critics.map((c) => ({
            ...c,
            status: 'approved',
            currentThought: 'Patched code verified. All security boundary checks pass.'
          })),
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:14.50',
              stage: 'COUNCIL_RECHECK',
              source: 'CRITIC',
              title: 'Critic Council Recheck: Unanimous Approval',
              description:
                'Claude Sentinel confirms exploit assertion now passes (403 returned). Zero remaining defects.',
              type: 'success'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'COUNCIL_RECHECK': {
        // Verified!
        if (soundEnabled) playSound('pass');
        set((state) => ({
          workflowState: 'VERIFIED',
          selectedStation: 'arbiter',
          selectedAgentId: null,
          cameraFocus: 'arbiter',
          focusTarget: ARBITER_POS,
          critics: state.critics.map((c) => ({
            ...c,
            status: 'celebrating',
            currentThought: 'Code verification completed! Ready for verified pull request.'
          })),
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:16.10',
              stage: 'VERIFIED',
              source: 'MAIN_AGENT',
              title: 'CouncilCode Verification Complete',
              description: 'All deterministic gates passed. Critic consensus achieved with zero unresolved claims.',
              type: 'success'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'VERIFIED': {
        // Open PR Ready
        if (soundEnabled) playSound('pr_success');
        set((state) => ({
          workflowState: 'PR_READY',
          isPlaying: false,
          isPRSummaryOpen: true,
          auditLog: [
            {
              id: `log-${Date.now()}`,
              timestamp: '00:18.00',
              stage: 'PR_READY',
              source: 'SYSTEM',
              title: 'Verified Green Pull Request Ready',
              description:
                'Single verified PR #42 prepared with cryptographic audit trail. Ready for 1-click human merge.',
              type: 'success'
            },
            ...state.auditLog
          ]
        }));
        break;
      }

      case 'PR_READY': {
        set({ isPRSummaryOpen: true });
        break;
      }
    }
  },

  stepBackward: () => {
    const { workflowState } = get();
    const currentIdx = WORKFLOW_ORDER.indexOf(workflowState);
    if (currentIdx <= 0) return;
    const prevTarget = WORKFLOW_ORDER[currentIdx - 1];
    get().jumpToStage(prevTarget);
  },

  jumpToStage: (targetState) => {
    const targetIdx = WORKFLOW_ORDER.indexOf(targetState);
    if (targetIdx === -1) return;

    // Reset cleanly to IDLE while preserving custom critics, then fast-forward to targetState
    const currentCritics = get().critics;
    const customCritics = currentCritics.filter((c) => c.isCustom);
    const currentFindings = get().findings.filter((f) => f.id.startsWith('finding-custom-'));
    const wasInspectorOpen = get().isInspectorOpen;
    const prevSound = get().soundEnabled;

    // Temporarily mute sound while replaying intermediate steps
    set({
      soundEnabled: false,
      workflowState: 'IDLE',
      revisionLoop: 0,
      isPlaying: false,
      isPRSummaryOpen: false,
      sandboxState: INITIAL_SANDBOX,
      findings: [
        ...JSON.parse(JSON.stringify(INITIAL_FINDINGS)),
        ...currentFindings.map((f) => ({
          ...f,
          proofStatus: 'untested' as const,
          sandboxOutput: '',
          arbitrationOutcome: 'pending' as const,
          arbitrationReason: ''
        }))
      ],
      critics: [
        ...INITIAL_AGENTS.map((c) => ({
          ...c,
          position: getCriticSeatPosition(c.deskIndex),
          targetPosition: getCriticSeatPosition(c.deskIndex),
          rotationY: Math.PI
        })),
        ...customCritics.map((c) => ({
          ...c,
          status: 'idle' as const,
          currentThought: 'Standing by for deterministic sandbox gate...',
          position: getCriticSeatPosition(c.deskIndex),
          targetPosition: getCriticSeatPosition(c.deskIndex),
          rotationY: Math.PI
        }))
      ],
      auditLog: [
        {
          id: 'log-0',
          timestamp: '00:00.00',
          stage: 'IDLE',
          source: 'SYSTEM',
          title: 'CouncilCode Initialized',
          description: 'System loaded with cross-vendor critics. Deterministic sandbox standing by.',
          type: 'info'
        }
      ]
    });

    for (let i = 0; i < targetIdx; i++) {
      get().stepForward();
    }

    set({
      soundEnabled: prevSound,
      isInspectorOpen: wasInspectorOpen,
      isPRSummaryOpen: targetState === 'PR_READY'
    });
    if (prevSound) playSound('step');
  },

  resetWorkflow: () => {
    const { soundEnabled } = get();
    if (soundEnabled) playSound('click');
    set({
      workflowState: 'IDLE',
      revisionLoop: 0,
      isPlaying: false,
      selectedAgentId: null,
      selectedStation: null,
      isInspectorOpen: false,
      cameraFocus: 'overview',
      focusTarget: null,
      codeViewMode: 'diff',
      isPRSummaryOpen: false,
      sandboxState: INITIAL_SANDBOX,
      findings: JSON.parse(JSON.stringify(INITIAL_FINDINGS)),
      critics: get().critics.map((c) => ({
        ...c,
        status: 'idle',
        currentThought: 'Standing by for deterministic sandbox gate...',
        position: getCriticSeatPosition(c.deskIndex),
        targetPosition: getCriticSeatPosition(c.deskIndex),
        rotationY: Math.PI
      })),
      auditLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: '00:00.00',
          stage: 'IDLE',
          source: 'SYSTEM',
          title: 'Workflow Reset',
          description: 'Ready for new review run.',
          type: 'info'
        }
      ]
    });
  }
}));
