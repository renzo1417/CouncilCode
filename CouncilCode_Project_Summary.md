# CouncilCode — Project & Workbook Summary

> **Source Basis:** Compiled from the Technopreneurship Google Workbook ([Google Sheet](https://docs.google.com/spreadsheets/d/1HNp44qLgkwQ8EKINA_m1bTVL4JWdJS_gFcVUuAjxiwM/edit?gid=256899961#gid=256899961)), [`CouncilCode_Lean_Canvas.pdf`](./CouncilCode_Lean_Canvas.pdf), and the working Next.js prototype in [`src/`](./src/app/page.tsx).

---

## 1. Project Overview & Workbook Context

- **Product Name:** **CouncilCode**
- **High-Level Concept:** *"A jury of rival AIs for your AI-written code: CI plus cross-examination, where every accusation needs evidence."*
- **Unique Value Proposition (UVP):** *"One verified, green-tested Pull Request instead of a thread of AI comments. Competing AI models must prove every bug with executable evidence before code ever reaches GitHub."*
- **Course Metadata (`Personal Details` tab):**
  - **Student:** Charlone Gianne Cruz (`24-0920-213`), BSCS Year 3, Section F2
  - **Mentor / Instructor:** Ralph Laviste
- **Team Roster (`Team Formation` tab, all BSCS):**
  1. Johanne Froilan Cando (Member ID 1 — Leader)
  2. John Prince Alonte (Member ID 2)
  3. Dexter James Benitez (Member ID 3)
  4. Charlone Gianne Cruz (Member ID 4)
  5. Lei Sheldon Densing (Member ID 5)
  6. Renzo Pogoy (Member ID 6)
  7. Casidey Kirzteen Quibuyen (Member ID 7)
  8. James Samson (Member ID 8)
  9. Ycany Ashra Sanchez (Member ID 9)

> **Workbook Continuity Note:** Earlier completed tabs in the same Google Sheet reflect prior concept iterations (*StrayPaws Relief* in `Technology Push`; *Padulong* in `Revised Elevator Pitch` and `Market Segmentation`). The **CouncilCode** pivot begins at **`Lean Canvas Part 1`** and continues through **`User Story Map`**, **`From User Priorities to Life Cy`**, **`Competitive Positioning`**, and **`Beachhead TAM SAM SOM`**.

---

## 2. Lean Canvas Part 1

### Core Problem, Solution & Value

| Block | Summary |
| :--- | :--- |
| **Top 3 Problems** | 1. **AI Hallucinations & Confirmation Bias:** AI-generated code ships hallucinations and blind spots; single-model self-review misses its own errors.<br>2. **Noisy Post-PR AI Review:** Subjective style comments and unverified bug claims waste reviewer time.<br>3. **Multi-Dev Integration Drift:** In multi-developer teams, AI-written code drifts apart (interface and merge conflicts) and is only caught late at integration. |
| **Existing Alternatives** | - **In-IDE & Workspace Agents:** Cursor, Claude Code, BridgeMind, Copilot *(single-model confirmation bias)*<br>- **Post-Commit Review Bots:** CodeRabbit, Qodo *(reactive GitHub comment spam; unverified claims)*<br>- **Autonomous Issue-to-PR Agents:** Devin, Factory.ai, Ellipsis *(closed single-model loops; costly token burns)*<br>- **DIY Multi-Agent Scripts:** MetaGPT, OpenHands *(ungrounded conversational debate; drifting contracts)*<br>- **Status Quo:** Manual human code reviews + CI pipelines *(bandwidth bottleneck; misses semantic bugs)* |
| **Top 3 Solutions** | 1. **Deterministic Sandbox Gate:** Runs linters, type checks, and tests *before* any AI critic runs — zero-token fast-fail.<br>2. **Cross-Vendor Critic Council + Proof Gate:** Competing models review code, and every bug claim requires an executable proof. The Main Agent acts as sole arbiter (max 2 revision loops).<br>3. **Two-Tier Consensus for Teams:** Contract Handshake, parallel Pods (frontend/backend), Higher Council arbitration, integration sandbox, and linked PRs. |
| **Unique Value Prop.** | **One verified, green-tested Pull Request instead of a thread of AI comments.** Competing AI models must prove every bug with executable evidence before code ever reaches GitHub. |
| **High-Level Concept** | A jury of rival AIs for your AI-written code: CI plus cross-examination, where every accusation needs evidence. |

### Market, Advantage & Operations

| Block | Summary |
| :--- | :--- |
| **Customer Segments** | **Target Customers:** Solo devs/freelancers/indie hackers; students & hackathon teams; open-source maintainers; startups/eng teams (5–50 devs).<br>**Target Users:** Developers using AI coding agents; tech leads/PMs who own specs; OSS contributors. |
| **Early Adopters** | - Full-stack and indie devs already using AI agents and burned by hallucinated code<br>- Hackathon and student teams (squads of up to 3)<br>- Active OSS maintainers facing AI-generated PRs<br>- Small startups (2–5 devs) hitting interface merge conflicts<br>- GitHub-centric developers comfortable with BYOK API keys |
| **Channels** | - GitHub / GitLab native (issue labels, `/agent run`, spec commits)<br>- VS Code extension and CLI<br>- Viral verification badges and audit summaries on OSS PRs<br>- Free tier and Verified OSS Grant (bottom-up, no procurement)<br>- Hackathon / student communities<br>- Team-plan upgrade triggered by interface merge conflicts |
| **Unfair Advantage** | - **Proof-gated arbitration:** Critique-to-executable-assertion pipeline and arbiter logic.<br>- **Vendor-neutral & BYOK:** Model vendors are unlikely to offer cross-vendor review of their own rivals.<br>- **Bug-class routing telemetry:** Audit-trail data on which model catches which bug class tunes role-to-model routing.<br>- **Viral distribution loop:** Verification badges on OSS PRs create organic adoption competitors cannot buy. |
| **Key Metrics** | PR runs/month • % of PRs passing sandbox within 2 loops • Critic false-positive rate (claims rejected by proof gate) • Merge rate of CouncilCode PRs • Human review time per PR • Free-to-paid conversion • Team seat expansion • Compute cost per run (target `~$0.015–$0.020`) |

### Financial Model (Cost Structure & Revenue Streams)

- **Cost Structure:**
  - **Ephemeral microVM compute** (Fly.io / Firecracker / E2B): ~2–3 min per run, `~$0.015–$0.020` per PR cycle
  - **Free-tier compute:** `~$0.27–$0.45` per active free user/month (acts as CAC)
  - **Orchestration hosting:** Stateful workflow engine (e.g., Temporal)
  - **People & Distribution:** Engineering, support, GitHub/GitLab app & VS Code marketplace (low CAC via bottom-up, badges, OSS)
  - **LLM Token Costs:** **`$0`** (customer pays directly via Bring-Your-Own-Key / BYOK)
- **Revenue Streams (BYOK SaaS + Free Local / Open-Source Core — no AI token margin risk):**
  - **Local CLI & Open-Source Core (`$0`):** Install via `npm i -g @councilcode/cli` or VS Code extension with local Docker/WASM sandbox and git pre-commit hooks — works free locally (including offline with local models) using your own API keys or local endpoints.
  - **Cloud Free:** `$0` (15 solo / 25 squad PRs on managed microVMs)
  - **Solo Builder:** `$5/mo` (50 PRs) — `~82%` gross margin
  - **Solo Pro:** `$10/mo` (250 PRs) — `~78%` gross margin (`~55%` at full use)
  - **Team:** `$15/seat/mo` (unlimited, fair-use + Two-Tier Pods) — `~95%` gross margin
  - **OSS Programs:** OSS Starter `$0` (50 PRs) | Verified OSS Grant `$0` (250 PRs)
  - *LTV and total revenue are to be validated with conversion and retention data.*

### Execution Flows (from `CouncilCode_Lean_Canvas.pdf`)

1. **Single-Dev Flow:** Human prompt → Main Agent creates plan → smaller agents code → Deterministic Sandbox (compile/build/lint/test; if fail, back to coder) → Critic Council critiques → Main Agent reconciles fix task → coder improves code → Deterministic Sandbox → Council approves → Main Agent approves/opens clean PR for human review.
2. **Multi-Dev Flow:** Tech lead requests feature → System Architect Agent locks API schemas/shared types contract → contract committed & split into parallel Pods (Backend & Frontend) → each Pod runs its own Main Agent, coders, deterministic sandbox, and Pod Council → Higher Council checks cross-service contract conformance, auth/security, and schemas (without re-judging Pod-approved code) → merged branch runs E2E Integration Sandbox → on failure, Higher Council routes fix strictly to the offending Pod → on pass, linked coordinated PRs opened for human review.

---

## 3. User Story Map

**End User:** Software Developer using AI coding assistants (solo devs, hackathon teams, and startup engineers).  
**User Story:** *"As a developer using AI coding agents, I want multi-model verification with executable bug proofs before submitting code, so that I can ship reliable, conflict-free pull requests without hallucinations or noisy PR review comments."*

| Phase | Present Goal | Present Steps & UX Score | Focused Pain Step | Proposed Innovation | Supporting Tech | Measurable Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Prompting & Code Generation** | Rapidly generate functional boilerplate and code from requirements | Specify prompt in IDE (Cursor/Claude Code) → AI generates diff → Accept code (**UX: 4/5**) | Manual configuration overhead | **Main Agent Code Scaffolder:** Native IDE/CLI orchestration aligned strictly to specs | VS Code Extension, GitHub CLI, BYOK LLM Gateway, Agent Protocol | `< 10s` prompt-to-sandbox with zero manual setup |
| **2. Local Verification & Self-Review** | Catch syntax, logic, and hallucinated errors locally before publishing | Eyeball diff → Run basic unit tests → Miss hallucinations via single-model bias (**UX: 1/5 — Lowest**) | Eyeballing diffs & single-model self-review missing hallucinations | **Deterministic Sandbox Gate:** Isolated sandbox running linters, typechecks, and tests before costly AI critics run | Docker/WASM sandboxes, ESLint/Ruff/Clippy, tsc/Pyright, Jest/PyTest | `100%` elimination of hallucinated syntax errors; zero-token fast-fail in `< 5s` |
| **3. PR Submission & AI Bot Review** | Obtain high-signal review and peer approval without reviewer fatigue | Open GitHub PR → Post-PR bots spam subjective/unverified claims → Reviewers filter noise (**UX: 2/5**) | Filtering noisy bot comments & unverified bug reports | **Cross-Vendor Critic Council:** Rival AI models review code; every bug claim requires executable proof (max 2 loops) | Multi-model routing (Claude, GPT, Gemini), assertion engine, GitHub Checks API | One verified, green PR; `>80%` noise reduction; `100%` proved bug claims |
| **4. Team Integration & Merge** | Seamlessly merge feature branches without breaking dependent interfaces | Merge into main → Parallel AI code reveals contract drift → Late CI failures/conflicts (**UX: 2/5**) | Uncovering interface contract drifts & merge conflicts late | **Two-Tier Consensus Engine:** Contract handshakes between parallel pods, Higher Council arbitration, integration sandboxes | Git merge-tree analysis, OpenAPI/Protobuf validators, ephemeral integration sandboxes | `> 90%` first-pass PR merge rate; zero downstream API contract regressions |

---

## 4. From User Priorities to System Architecture & Customer Lifecycle

### Top 2 End-User Priorities → Feature / Function / Benefit

1. **Reliable, Hallucination-Free Code Generation**
   - **Feature:** Deterministic Sandbox Gate (pre-critic containerized linters, strict typecheckers, unit test runners).
   - **Function:** Spins up an isolated execution environment (`2 vCPU`, `2GB RAM`, `15s` timeout) to run test suites and linters; fails fast (`< 5s`) with zero LLM token cost on errors.
   - **Benefit:** Guarantees syntactic correctness at source, eliminates single-model confirmation bias, and saves 100% of LLM token spend on broken code.
2. **High-Signal, Noise-Free Pull Request Reviews**
   - **Feature:** Cross-Vendor Critic Council & Proof-Gate Engine (multi-model panel requiring executable test proofs).
   - **Function:** Routes PR diffs asynchronously across competing frontier models; compiles claimed flaws into standalone test harnesses that must **fail on old code and pass on new code** before Main Agent arbitration (max 2 loops).
   - **Benefit:** Delivers a clean, single green-tested PR with a tamper-proof **Proof Dossier**; slashes reviewer noise by `>80%` so humans only review verified, reproducible bugs.

### 4-Stage End-to-End Verification Architecture

1. **Stage 1 — Developer Workspace (`Context & Client Engine`):** VS Code/JetBrains extension & CLI (`councilcode`) using LSP/Agent Protocol; local OS keychain BYOK encryption; scans changed files only.
2. **Stage 2 — Deterministic Sandbox (`Runtime Gate`):** Ephemeral Docker/WASI runtime with read-only mounts and restricted network; ESLint/Ruff/Clippy, `tsc`/Pyright, Jest/PyTest (`< 5s` fast-fail, `0` tokens).
3. **Stage 3 — Critic Council & Proof (`Proof-of-Bug Arbitration`):** Asynchronous routing to 3 rival models; Test Synthesizer turns bug claims into executable tests; unproved claims are discarded; Main Agent patches in max 2 loops.
4. **Stage 4 — GitHub & Audit Trail (`Workflow & Dossier`):** Automated branch/PR creation, GitHub Check badge (`CouncilCode: PASSED - 3/3 Models Verified`), zero spam thread comments, consolidated Markdown Proof Dossier.

### 7-Stage Full Customer Lifecycle

| Stage | Current Friction | CouncilCode Integrated Action | Key Milestone / Value |
| :--- | :--- | :--- | :--- |
| **1. Acquisition** | Devs frustrated by hallucinated code & spammy PR bots search GitHub/HN | Discovers on VS Code Marketplace / GitHub Actions or `npm i -g @councilcode/cli`; tries Free BYOK tier | `< 2 min` discovery & install; no credit card required |
| **2. Installation & Integration** | Multi-agent setups take hours of YAML, venv, and Docker proxy wiring | Zero-config handshake auto-detects package manager, linters, and tests; stores BYOK keys in OS keychain | 1-click setup ready in `< 60s` |
| **3. Daily Usage** | Blindly accepting AI diffs; single-model misses logic bugs; PR bot clutter | Intercepts diff → `<5s` sandbox gate → Critic Council + executable proofs → Main Agent patches (max 2 loops) | `100%` syntax error elimination; `<15s` bug proofs |
| **4. Value Determination** | Senior devs spend 30–45 min/PR checking hallucinations & edge cases | Team inspects single green PR + Proof Dossier (`3/3` model consensus & reproducer test results) | `>80%` review noise reduction; **`3x` faster PR merge turnaround** |
| **5. Support & Diagnostics** | Opaque agent errors and silent degradation | Built-in `Council Diagnostics` tab in VS Code shows raw debate transcripts, test traces, and token telemetry + Discord/GitHub | Self-service diagnosis within minutes |
| **6. Spread Awareness** | AI tools stay siloed; uneven quality across devs | Green PR badges & clean merges prompt team leads to adopt across pods; OSS stars & tech talks | Viral team expansion (1 dev brings 5–20 peers; Solo → Team Tier) |
| **7. End-of-Life / Offboarding** | Proprietary AI tools leave vendor lock-in & orphaned configs | Generated tests remain native Jest/PyTest files in repo; `councilcode eject` cleanly removes hooks & revokes keys | `100%` clean exit with zero lock-in |

---

## 5. Competitive Positioning

**Axes from Persona Priorities:**
- **Y-Axis (Priority 1 — Code Reliability):** Bad (Hallucination-Prone) $\rightarrow$ Good (Hallucination-Free)
- **X-Axis (Priority 2 — PR Review Signal):** Bad (Noisy / Unverified) $\rightarrow$ Good (High-Signal / Proof-Gated)

| Quadrant | Code Reliability (Y) | PR Review Signal (X) | Competitors / Position | Differentiation |
| :--- | :--- | :--- | :--- | :--- |
| **Top-Right (Target)** | **Good** (Hallucination-Free) | **Good** (High-Signal / Proof-Gated) | **CouncilCode** | Deterministic sandbox + cross-vendor Critic Council where every bug claim requires an executable test proof |
| **Top-Left** | **Good** (with human effort) | **Bad** (Slow / Bandwidth Bottleneck) | **Status Quo** (Manual Human Review + Standard CI) | Reliable only via heavy senior-engineer time (30–45 min/PR); misses semantic AI bugs at scale |
| **Bottom-Right** | **Bad** (Hallucination-Prone) | **Good / Low Noise** | **In-IDE Agents** (Cursor, Copilot, Claude Code) | Low PR comment noise, but single-model confirmation bias ships subtle logic/security flaws |
| **Bottom-Left** | **Bad** (Hallucination-Prone) | **Bad** (Noisy / Unverified) | **Post-Commit Review Bots** (CodeRabbit, Qodo) & **Autonomous PR Agents** (Devin, Factory.ai) | Bots spam subjective/unverified PR comments; autonomous agents burn tokens in closed single-model loops |

---

## 6. Beachhead Market Sizing (TAM / SAM / SOM)

### End-User Characteristics Used for Sizing
1. **Role & Occupation:** Software developers, full-stack engineers, indie hackers, and hackathon teams
2. **Environment:** Git-based source control (GitHub/GitLab) and IDEs (VS Code, JetBrains)
3. **AI Tooling:** Active users of AI coding agents (Copilot, Cursor, Claude Code) with BYOK access
4. **Core Pain Point:** Suffers from hallucinated code, noisy PR review bots, and interface contract drifts
5. **Scale:** Solo developers, 2–3 member hackathon squads, and early-stage startups (2–5 devs)

### Market Size Figures

| Tier | User Count | Basis & Source Cited in Sheet |
| :--- | :---: | :--- |
| **TAM** *(Total Addressable Market)* | **28,500,000** developers | GitHub Octoverse & Evans Data Global Developer Population (`~28.5M` active developers worldwide using Git version control) |
| **SAM** *(Serviceable Addressable Market)* | **4,800,000** developers | Stack Overflow Survey & GitHub AI reports (`~76%` AI adoption; `~4.8M` developers authoring PRs with AI assistance) |
| **SOM** *(Serviceable Obtainable Market — Beachhead)* | **24,000** developers | Early-adopter capture of **`0.5%` of SAM** across solo devs, hackathon squads, and micro-startups |

> **Illustrative Revenue Translation *(derived from Lean Canvas pricing — not explicitly listed in the TAM/SAM/SOM sheet)*:**  
> At a blended paid conversion across Solo (`$5–$10/mo`) and Team (`$15/seat/mo`), capturing 24,000 active beachhead developers with just `15%–25%` paid conversion (3,600–6,000 paying seats at ~$10/mo average) represents **`$432K–$720K` ARR** in the initial beachhead before expanding into 5–50 dev startups.

---

## 7. Working Prototype in This Repository

This workspace already contains a functional **Next.js + React Three Fiber (Three.js)** interactive 3D studio diorama demonstrating CouncilCode's verification workflow ([`src/app/page.tsx`](./src/app/page.tsx), [`src/data/scenarios.ts`](./src/data/scenarios.ts)):

- **Interactive 3D Office Diorama:** Visualizes the Coding Agent Station, Deterministic Sandbox Station, Rival Critic Council workstations, Main Arbiter Station, and Signal Beams, with timeline playback (`Space`, `←`, `→`, `R`) and Multi-Dev / PR Summary modals.
- **Concrete Code Demo (`INVOICE_IDOR_SCENARIO` — `src/api/routes/invoices.ts`):**
  - **The Bug:** `GET /api/v1/invoices/:id` passes baseline unit tests (`401`, `404`, `200`) but misses tenant ownership verification (`CWE-639 / OWASP API1:2023` IDOR vulnerability).
  - **The Council Verdict:**
    1. **Claude Sentinel (Security — Anthropic):** Flags missing `invoice.organizationId` check and supplies an executable `403 Forbidden` cross-tenant exploit test → **Proved & Patched**.
    2. **DeepSeek Logic (Logic — DeepSeek):** Flags missing null-coalescing check on `req.user?.organizationId` with an executable assertion → **Proved & Patched**.
    3. **CodeCraft Style (Style — OpenAI):** Suggests subjective FP pipes (`fp-ts`) and variable renaming with *no executable test* → **Rejected by Proof Gate** (*"No executable test provided or zero assertion delta"*).

---

## 8. Workbook Alignment & Product Notes

1. **Completed Workbook Tabs:** `Lean Canvas Part 1`, `User Story Map`, `From User Priorities to Life Cycle`, `Competitive Positioning`, `Beachhead TAM SAM SOM`, `Prototype`, `Lean Canvas Part 2`, and `Final Elevator Pitch` are all populated in the Google Sheet.
2. **Legacy Project References:** Earlier tabs (`Technology Push`, `Revised Elevator Pitch`, `Market Segmentation`) still contain *StrayPaws Relief* and *Padulong* text from prior iterations — only **CouncilCode** tabs should be referenced.
3. **Vendor-Neutral BYOK (Any Model, Any Key):** CouncilCode does **not** require any specific LLM provider. Users supply whichever API keys or local model endpoints they prefer (cloud APIs, OpenAI-compatible gateways, or local/offline models) stored encrypted in their local OS keychain with `$0` token markup. Specific model names (`Claude`, `DeepSeek`, `OpenAI`, `Gemini`) appear in the prototype only as example configurations.
4. **Free Local CLI / Open-Source Core vs. Hosted Cloud Plans:** Per the Customer Lifecycle (`From User Priorities to Life Cycle`) and Lean Canvas tabs, developers can run the open-source core locally for free via CLI (`npm i -g @councilcode/cli`), VS Code extension, and local Docker/WASM sandboxes (including offline with local models), while paid subscriptions (`$5 / $10 / $15 per seat`) fund managed ephemeral cloud microVMs (`~$0.015–$0.020`/run), GitHub App orchestration, and Two-Tier Team Pods.
