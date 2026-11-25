# CouncilCode — WildRoar Series 3 Pitch Deck

> **Designed for:** ES038 Technopreneurship **WildRoar Series 3 Demo Day** (Wildcat Innovation Labs)  
> **Structure Style:** Slidebean-inspired visual brevity — 11 crisp visible slides (~3.5–4.5 min) + **3 Hidden Q&A Appendix Slides** (`A1–A3`).

---

## WildRoar Series 3 Rubric & OpenLearning Compliance Map

| Criterion / OpenLearning Rule | Weight | Covered On |
| :--- | :---: | :--- |
| **Target Market** *(Specific customer segments clearly identified)* | **10%** | Slide 3 |
| **Pains** *(Customer pains + compelling "Hugot" story + full-circle callback)* | **20%** | Slide 2, Slide 10 |
| **Product / Solution** *(Prototype description + how it alleviates pains; Demo ≤ 30s)* | **25%** | Slide 4, Slide 5 (`≤30s`) |
| **Novelty** *(Why it is new and not "obviously" similar to existing ideas)* | **25%** | Slide 6, Slide 7 |
| **Business Model** *(Profitable & sustainable unit economics)* | **15%** | Slide 8 (+ Hidden A1, A2) |
| **Overall Presentation** *(Comprehensive, practiced, professional; Team ≤ 10s)* | **5%** | Slide 1, Slide 9 (`≤10s`), Slide 10, Slide 11 |
| **OpenLearning Rule: Initial Investment** *(DO NOT include in main pitch; show ONLY on hidden slide if asked)* | — | Hidden Slide A1 |
| **OpenLearning Rule: Data Privacy Defense** *(Ready if asked in Q&A)* | — | Hidden Slide A3 |

---

## VISIBLE MAIN DECK (Slides 1–11)

### Slide 1: Title & Hook `[Overall Presentation: 5%]`
- **Slide Goal:** Anchor the brand and one-line courtroom metaphor in `<10s`.
- **On-Slide Content:**
  - **CouncilCode**
  - *A jury of rival AIs for your AI-written code.*
  - **Tagline:** CI plus cross-examination — where every accusation needs executable evidence.
  - *WildRoar Series 3 | ES038 Technopreneurship*
- **Visual Direction:** Clean editorial hero screenshot of the **CouncilCode 3D Studio Diorama** (`npm run dev`) showing rival AI workstations linked to the Sandbox & Main Arbiter.
- **Speaker Talking Points:**
  > "AI writes code in seconds—and breaks production in seconds. We're **CouncilCode**: a jury of rival AIs for your AI-written code, where every accusation requires executable proof."

---

### Slide 2: The "Hugot" Story & Customer Pains `[Pains: 20%]`
- **Slide Goal:** Open with an authentic, relatable developer *"hugot"* story before quantifying the 3 validated pains.
- **On-Slide Content:**
  - **Headline:** *2:00 AM Before Demo Day. The AI Said "Looks Great!"*
  - **The Story ("Alex"):** Alex prompts an AI to ship a billing API before deadline, asks the same AI to review it (*"LGTM!"*) — and ships a silent data leak.
  - **3 Validated Developer Pains:**
    1. **Single-Model Confirmation Bias (`UX: 1/5`):** AI misses its own hallucinations and security leaks (like `CWE-639` IDOR passing unit tests).
    2. **Noisy Post-PR Review Bots (`UX: 2/5`):** Bots spam 40 subjective style comments and unverified claims—wasting `30–45 min` of senior review time per PR.
    3. **Multi-Dev Interface Drift (`UX: 2/5`):** Parallel AI-written branches break shared API contracts and explode late at merge.
- **Visual Direction:** Minimal 3-step UX friction drop (`4/5 Coding → 1/5 Verification → 2/5 PR & Merge`) next to a clean illustration of 40 noisy GitHub bot comments vs. 1 missed security bug.
- **Speaker Talking Points:**
  > "Every builder here knows this *hugot*: it's 2:00 AM before capstone or sprint deadline. Alex asks an AI to write a billing endpoint, asks that same AI to check for bugs—it says *'Looks great!'*—and ships a live data leak. Meanwhile, GitHub review bots drop 40 useless style comments that waste 45 minutes, and a teammate's AI-written frontend breaks the API contract at merge. In our workflow mapping, verification crashed to **1 out of 5**."

---

### Slide 3: Target Market `[Target Market: 10%]`
- **Slide Goal:** Show clearly defined customer segments and a disciplined bottom-up beachhead.
- **On-Slide Content:**
  - **Headline:** *Targeting 4.8M Developers Already Shipping AI Pull Requests*
  - **TAM — 28.5M Developers:** Global Git-active developers *(GitHub Octoverse & Evans Data)*
  - **SAM — 4.8M Developers:** Devs actively authoring AI-assisted PRs *(~76% AI adoption; Stack Overflow & GitHub)*
  - **SOM — 24,000 Developers (Beachhead: 0.5% of SAM):**
    1. **Solo & Indie Devs** already burned by hallucinated AI code
    2. **Student & Hackathon Squads** (2–3 devs) shipping under tight deadlines
    3. **Active Open-Source Maintainers** flooded by AI-generated PRs
    4. **Micro-Startups (2–5 devs)** hitting multi-dev API merge conflicts
- **Visual Direction:** Concentric TAM / SAM / SOM circles on left + 4 crisp persona cards on right *(all GitHub-centric & BYOK-ready)*.
- **Speaker Talking Points:**
  > "Out of 28.5 million Git developers globally, 4.8 million already author Pull Requests with AI. Our beachhead SOM targets just 0.5%—24,000 solo builders, student hackathon squads, open-source maintainers, and 2-to-5 person startups who feel this exact pain daily and already carry their own AI API keys."

---

### Slide 4: The Solution & UVP `[Product/Solution: 25%]`
- **Slide Goal:** Clearly explain how CouncilCode solves all 3 pains before code ever reaches GitHub.
- **On-Slide Content:**
  - **Headline:** *One Verified, Green-Tested PR Instead of a Thread of AI Comments*
  - **1. Deterministic Sandbox Gate (`< 5s`, `$0` Tokens):** Runs linters, typechecks, build, and baseline tests *before* any AI critic runs.
  - **2. Cross-Vendor Critic Council + Proof Gate:** Competing models (Claude, DeepSeek, OpenAI, Gemini) cross-examine the diff. **No failing executable test = claim rejected.** Sole Main Agent arbitrates in max 2 loops.
  - **3. Two-Tier Multi-Dev Pods:** System Architect locks shared API contracts first → parallel Frontend/Backend Pods verify locally → Higher Council & E2E sandbox emit linked green PRs.
- **Visual Direction:** Clean 4-stage horizontal pipeline (`Workspace Diff → Sandbox Gate (0 Tokens) → Critic Council + Proof Gate → Green PR + Proof Dossier`).
- **Speaker Talking Points:**
  > "CouncilCode stops bad AI code *before* it hits GitHub. First, a deterministic sandbox catches syntax and build errors in under 5 seconds for zero tokens. Next, rival models cross-examine the diff—and every bug claim must compile into an executable failing test. No proof, no comment. For teams, two-tier pods lock API contracts before anyone writes a line."

---

### Slide 5: Prototype Demo — Benefits & Impact `[Product/Solution: 25% | TIMER: ≤ 30 SEC]`
> **OPENLEARNING RULE:** *Solution demonstration must not take more than 30 seconds. Focus on benefits and impact!*
- **Slide Goal:** Deliver a tight `25–30s` live/video walkthrough of the working 3D diorama solving `GET /api/v1/invoices/:id` (`CWE-639` IDOR).
- **On-Slide Content:**
  - **Headline:** *Live Prototype: Catching What Single AIs & Basic Tests Miss*
  - **30-Second Proof Flow (`CWE-639` Invoice IDOR):**
    1. **Sandbox (`0` Tokens):** Baseline tests pass (`401/404/200`) — yet tenant data still leaks!
    2. **Cross-Examination:** `Claude` proves cross-tenant exploit (`200 → 403`) & `DeepSeek` proves null-auth crash → **Patched**. `OpenAI` subjective style nitpick has no failing test → **Rejected by Proof Gate**.
  - **Measured Impact:** **`>80%`** less PR noise • **`3x`** faster merges • **`>90%`** first-pass team merges • **`SHA256-ED25519`** Proof Dossier.
- **Visual Direction:** Full-bleed screen recording or high-res capture of the **CouncilCode 3D Studio Diorama** + `PRSummaryModal` turning **VERIFIED GREEN**.
- **Speaker Talking Points (`~25–30 seconds max`):**
  > "Watch our working prototype on a real billing API. Baseline tests pass—yet any user can steal another company's invoice. Our Sandbox clears in under 5 seconds at zero token cost. Then rival critics run: OpenAI's unproved style nitpick is thrown out by the Proof Gate, while Claude and DeepSeek prove the real security leak and null bug with failing tests. The Main Agent patches both and outputs one green PR with a cryptographic Proof Dossier—cutting review noise over 80% and speeding merges 3x."

---

### Slide 6: Why CouncilCode Is Fundamentally New `[Novelty: 25%]`
- **Slide Goal:** Nail the `25%` Novelty criterion—prove CouncilCode is architecturally distinct from AI wrappers and review bots.
- **On-Slide Content:**
  - **Headline:** *Not Another AI Review Bot. Mathematical Proof Over Opinions.*
  - **1. Critique-to-Executable-Proof Gate:** Existing AI reviewers emit natural-language guesses. CouncilCode requires every flagged bug to **fail on old code and pass on patched code** in an isolated sandbox.
  - **2. Structural Cross-Vendor Neutrality:** OpenAI, Anthropic, and Google will never build a native product that routes their users' code to rival labs to expose their own blind spots.
  - **3. Zero-Token Pre-Critic Fast-Fail:** Blocks 100% of syntax/type errors before burning frontier LLM tokens.
  - **4. Pre-Code Contract Handshakes + Clean Eject (`councilcode eject`):** Stops multi-dev AI drift *before* coding and leaves native Jest/PyTest regression tests in the repo with **zero vendor lock-in**.
- **Visual Direction:** Crisp "Old AI Review vs. CouncilCode Proof-Gated Jury" comparison diagram (Unverified Text Comments vs. Executable Reproducer Test + Multi-Vendor Verdict).
- **Speaker Talking Points:**
  > "Why isn't this just another AI wrapper? Four reasons. First, existing bots output text opinions; our Proof Gate mathematically rejects any claim without an executable failing test. Second, model giants like OpenAI or Anthropic won't cross-examine their own models with rivals—our vendor-neutral BYOK model does. Third, we kill broken builds at zero token cost *before* critics run. And fourth, `councilcode eject` leaves pure standard unit tests behind—zero lock-in."

---

### Slide 7: Competitive Positioning `[Novelty: 25%]`
- **Slide Goal:** Visually prove uncontested positioning in the top-right quadrant.
- **On-Slide Content:**
  - **Headline:** *Only CouncilCode Combines Cross-Model Reliability with Proof-Gated Signal*
  - **Y-Axis:** Code Reliability *(Hallucination-Prone → Hallucination-Free)*
  - **X-Axis:** PR Review Signal *(Noisy / Unverified → High-Signal / Proof-Gated)*
  - **Top-Right (Winner):** **CouncilCode** — Cross-vendor proof-gated verification
  - **Top-Left:** *Manual Review + CI* — Reliable only via slow human bottlenecks
  - **Bottom-Right:** *Cursor, Copilot, Claude Code* — Low PR noise, single-model confirmation bias
  - **Bottom-Left:** *CodeRabbit, Qodo, Devin, Factory.ai* — Unverified PR comment spam or costly single-model token loops
- **Visual Direction:** Clean 2×2 Positioning Matrix directly from the `Competitive Positioning` sheet.
- **Speaker Talking Points:**
  > "In-IDE agents like Cursor suffer single-model confirmation bias. Post-PR bots like CodeRabbit flood threads with unverified opinions. Autonomous agents like Devin burn tokens in closed single-model loops. CouncilCode sits alone in the top-right: hallucination-resistant reliability AND high-signal, proof-gated reviews."

---

### Slide 8: Business Model, Economics & Sustainability `[Business Model: 15%]`
- **Slide Goal:** Prove profitable SaaS margins, capital efficiency, and compounding sustainability.
- **On-Slide Content:**
  - **Headline:** *BYOK SaaS: 78%–95% Gross Margins with $0 AI Token Risk*

  | Plan | Price | Allowance | Est. Gross Margin |
  | :--- | :--- | :--- | :---: |
  | **Free / OSS Starter** | `$0` | 15 solo / 25 squad (50 OSS) | PLG CAC (`~$0.27–$0.45/mo`) |
  | **Solo Builder** | `$5 / mo` | 50 PRs | **~82%** |
  | **Solo Pro** | `$10 / mo` | 250 PRs | **~78%** *(55% at max cap)* |
  | **Team (Two-Tier Pods)** | `$15 / seat / mo` | Unlimited (fair-use) | **~95%** |
  | **Verified OSS Grant** | `$0` | 250 PRs | Viral Badge Growth |

  - **Unit Economics:** Customers supply their own API keys (**`$0` LLM token COGS**). Our only variable cost is ephemeral microVM compute at **`~$0.015–$0.020` per PR run**.
  - **Sustainability Loop:** `<60s` VS Code/CLI install → green `CouncilCode PASSED` OSS PR badges drive free peer sign-ups → multi-dev merge conflicts trigger `$15/seat` Team upgrades → audit logs build a **bug-class routing data moat**.
- **Visual Direction:** Clean pricing table + bold callout pill (`$0 LLM COGS | ~$0.015–$0.020 / PR Run`) + mini viral PLG flywheel.
- **Speaker Talking Points:**
  > "Most AI dev tools bleed cash on token costs. Because CouncilCode is Bring-Your-Own-Key, our LLM token cost is **zero**. Our only variable cost is ephemeral microVM compute at 1.5 to 2 cents per run—delivering **78% to 95% SaaS gross margins** across $5, $10, and $15/seat plans. Free OSS verification badges drive organic adoption while every run enriches our bug-class routing telemetry."

---

### Slide 9: Team Capability `[Overall Presentation: 5% | TIMER: ≤ 10 SEC]`
> **OPENLEARNING RULE:** *Give the audience an idea of how capable your team is in actualizing the idea—strictly no more than 10 seconds!*
- **Slide Goal:** Flash proof of execution capability in 10 seconds flat.
- **On-Slide Content:**
  - **Headline:** *Built by CS Engineers Who Ship with AI Daily*
  - **Execution Proof:** 3rd-Year BSCS Team *(Cando, Alonte, Benitez, Cruz, Densing, Pogoy, Quibuyen, Samson, Sanchez)* — architected full system specs & built the live interactive Next.js + Three.js verification prototype.
- **Visual Direction:** Clean team name grid with 4 capability badges (`Architecture`, `Sandboxes`, `AI Routing`, `Full-Stack UI`).
- **Speaker Talking Points (`≤ 10 seconds`):**
  > "We're Computer Science builders who use AI agents every day—and we've already architected and built the interactive 3D verification prototype you just saw."

---

### Slide 10: Full-Circle Callback & Call to Action `[Pains: 20% + Overall Presentation: 5%]`
> **OPENLEARNING RULE:** *Go back to where you started. Remind the audience of your opening story, state how your solution addresses them, and encourage the audience to take action.*
- **Slide Goal:** Close emotionally and decisively by resolving Alex's 2:00 AM story and inviting action.
- **On-Slide Content:**
  - **Headline:** *Back to 2:00 AM—Except Now, Alex Sleeps.*
  - **Full Circle:**
    - `CWE-639` data leak? **Proved & patched in `<15s`** before GitHub.
    - 40 noisy bot comments? **Blocked by the Proof Gate.**
    - Parallel frontend/backend explosion? **Prevented by Contract Handshake.**
  - **Take Action:** Test our live prototype, join the closed CLI/sandbox beta, or sponsor an OSS Verified Grant.
  - **Closing Line:** *"Don't merge AI guesses. Ship proved code."*
- **Visual Direction:** Split Before/After card (Red `2:00 AM Leak & Bot Chaos` → Green `1 Verified PR #42 Merged`) + QR code / Beta signup CTA.
- **Speaker Talking Points:**
  > "Remember Alex at 2:00 AM before demo day? With CouncilCode, that leak was caught and proved in 15 seconds, the 40 spam bot comments never existed, and both developer pods merged cleanly on the first pass. If you build with AI—or lead engineers who do—try our prototype today, join our closed beta, and be part of a future where we never merge AI guesses, only proved code. Thank you!"

---

### Slide 11: Thank You & Q&A
- **On-Slide Content:**
  - **CouncilCode** — *A Jury of Rival AIs for Your AI-Written Code*
  - Questions & Discussion
  *(STOP CLICKING HERE during the main pitch. Only advance to Hidden Slides A1–A3 if a judge asks!)*

---

## HIDDEN APPENDIX SLIDES *(Place AFTER Slide 11 — Show ONLY If Asked in Q&A)*

> **OPENLEARNING RULE:** *Be ready with the amount of your initial investment and what resources, activities, and initiatives you will spend it on. However, DO NOT include this in your pitch. Prepare a hidden slide after the end of your pitch deck and show if asked.*

### Hidden Slide A1: Initial Investment & Use of Funds *(Show for FAQ #6: Capital Investment)*
- **Headline:** *Capital-Lean Pre-Seed Budget: ₱1,500,000 (~$25,000 USD) for 12 Months*
- **Why So Lean?** Zero GPU cluster purchases and `$0` LLM token subsidies thanks to **BYOK**.
- **Allocation Breakdown:**
  - **45% — Product & Core Engineering (`₱675,000`):** CLI (`councilcode`), VS Code extension, Firecracker/E2B microVM runner, GitHub Checks App.
  - **20% — Cloud Compute & Free-Tier CAC (`₱300,000`):** Temporal orchestration hosting + `~$0.27–$0.45/mo` free-tier sandbox runway for first 5,000+ trial devs.
  - **15% — Bottom-Up GTM & Developer Pilots (`₱225,000`):** Hackathon sponsorships, Verified OSS Grants, university & startup pilot onboarding.
  - **10% — Security, Legal & IP (`₱150,000`):** Sandbox isolation audit, DTI/SEC & trademark registration, terms/privacy compliance.
  - **10% — Validation & Contingency Reserve (`₱150,000`):** Buffer for conversion testing & infra scaling.
- **Funding Sources:** University TBI/DOST-PCIEERD innovation grants (Wildcat Innovation Labs), startup competitions, and angel pre-seed — *not* heavy VC burn.

### Hidden Slide A2: Path to Profitability, Breakeven & ROI *(Show for FAQs #7 & #8)*
- **Headline:** *Breakeven at < 2% of Beachhead SOM (12–18 Months Post-Beta)*
- **Unit Margin Engine:**
  - Solo Builder (`$5/mo` @ `82%` GM = `~$4.10` contribution)
  - Solo Pro (`$10/mo` @ `78%` GM = `~$7.80` contribution)
  - Team (`$15/seat/mo` @ `95%` GM = `~$14.25` contribution)
- **Breakeven Point:** **~350–450 paying seats** (e.g., ~25 small 4-person teams + ~250 solo devs) covers lean monthly infra & founder stipends — requiring **< 2% of our 24,000 SOM**.
- **Investor & Customer ROI:**
  - **Customer ROI:** Saving 30–45 min on *just one* PR pays back a `$15/seat/mo` Team subscription immediately.
  - **Beachhead Revenue Potential:** `15%–25%` paid conversion of our `24,000` SOM (`~$10/mo` blended ARPU) = **`$432K–$720K` ARR** at `~85%+` blended gross margin on a `$25K` pre-seed base. *(Exact conversion & LTV to be validated during closed beta.)*

### Hidden Slide A3: End-User Data Privacy & Security Architecture *(Show for FAQ #9)*
- **Headline:** *Zero Code Retention. Ephemeral Sandboxes. Local BYOK Keys.*
- **How We Protect Developer & Company Code:**
  1. **Zero Server Code Storage:** Source files are never stored persistently on CouncilCode servers.
  2. **Local OS Keychain BYOK:** Customer API keys stay encrypted in the local OS Keychain and route directly to chosen model providers.
  3. **Ephemeral Read-Only MicroVMs:** `2 vCPU / 2GB RAM` containers (`<15s` cap) with restricted network access are **destroyed immediately** after verification.
  4. **Diff-Only Scope Isolation:** Scans changed files only—explicitly ignoring `.env`, secrets, and untracked credentials.
  5. **Clean Eject (`councilcode eject`):** Revokes keys, prunes containers, and leaves only native Jest/PyTest files in the user's repo.
