# CouncilCode — WildRoar Series 3 Video Script ("The People vs. AI-Generated Code")

> **Creative Concept:** A snappy, classroom-filmed **Courtroom Cross-Examination** dramatizing CouncilCode's exact hook (*"A jury of rival AIs for your AI-written code"*) while hitting **100% of the WildRoar Series 3 Rubric** and **every OpenLearning timing & storytelling rule**.  
> **Target Runtime:** **~3 minutes 50 seconds** *(Main deck rules enforced: Prototype Demo ≤ 30s, Team Capability ≤ 10s, Initial Investment omitted from main video per OpenLearning tip, Full-Circle Callback at the end).*

---

## 1. WildRoar Rubric & OpenLearning Compliance Matrix

| Scene | Timestamp | WildRoar Rubric & OpenLearning Rule Covered |
| :--- | :---: | :--- |
| **Scene 1: 2:00 AM "Hugot" Cold Open** | `0:00 – 0:45` | **Pains (20%)** + **Target Market (10%)** — Relatable 2 AM deadline *hugot* story ("Alex"), confirmation bias leak, bot spam, multi-dev drift |
| **Scene 2: "Order in the Repo!"** | `0:45 – 1:15` | **Product/Solution (25%)** — UVP + Zero-Token Sandbox Gate + Critic Council cross-examination |
| **Scene 3: Live Prototype Demo** *(STRICT ≤ 30s)* | `1:15 – 1:45` | **Product/Solution (25%)** — **30-second max** screen recording of 3D prototype focusing on benefits & impact (`>80%` noise cut, `3x` merge, `>90%` team merge) |
| **Scene 4: Why This Is Truly New** | `1:45 – 2:30` | **Novelty (25%)** — Proof Gate vs. text opinions, cross-vendor neutrality, zero-token gate, `councilcode eject`, 2×2 Competitive Matrix |
| **Scene 5: Market & Sustainable Economics** | `2:30 – 3:15` | **Target Market (10%)** + **Business Model (15%)** — TAM `28.5M` / SAM `4.8M` / SOM `24,000`, BYOK `$0` LLM risk, `~$0.015–$0.020`/run, `78%–95%` gross margins, `<60s` install + viral badges *(NO investment ask here!)* |
| **Scene 6: Team (≤ 10s) + Full-Circle Callback CTA** | `3:15 – 3:50` | **Overall Presentation (5%)** + **OpenLearning Tips** — `≤10s` team capability proof → return to Alex's 2 AM story solved → Call to Action |

---

## 2. Classroom Cast & Zero-Budget Props

### Cast (4–9 Teammates Flexible)
- **THE JUDGE / MAIN ARBITER:** At the teacher's desk with a whiteboard eraser gavel.
- **ALEX (Overworked Dev):** At a student desk with a laptop, tired at "2:00 AM".
- **SANDBOX BAILIFF:** Holds printed **`SANDBOX GATE (0 TOKENS)`** sign + stopwatch.
- **NOISY BOT / GPT STYLE (`CodeCraft Style`):** Holds bright sticky notes in Scene 1 & jury box in Scene 3.
- **CLAUDE SENTINEL (Security) & DEEPSEEK LOGIC:** Sit in the jury row with printed exploit/invariant test pages.
- **TEAMMATE B / WHITEBOARD PRESENTER:** Bursts in during Scene 1 merge conflict, then joins the whiteboard in Scenes 4–5.

### Classroom Props
- Teacher's desk + **whiteboard eraser** (gavel)
- **Sticky notes** (*"Rename variable?"*, *"Use FP pipes!"*, *"Unverified vibe!"*)
- Printed A4 labels taped to chests/desks: `SANDBOX GATE`, `GPT: STYLE`, `CLAUDE: SECURITY`, `DEEPSEEK: LOGIC`
- Red card (`REJECTED — NO PROOF`) & Green sheet (`PR #42 — VERIFIED GREEN`)
- Sheet labeled **`API CONTRACT (LOCKED)`**
- **Classroom Whiteboard** pre-drawn lightly with the **2×2 Matrix** and **TAM / SAM / SOM** circles
- **Screen recording (`25–30s` clip)** of `npm run dev` showing the 3D CouncilCode Studio Diorama solving `INVOICE_IDOR_SCENARIO`

---

## 3. Full Scene-by-Scene Script

### SCENE 1 — THE "HUGOT" COLD OPEN: 2:00 AM BEFORE DEMO DAY (`0:00 – 0:45`)
*(Covers: Pains 20%, Target Market 10%, OpenLearning "Hugot" Story)*

**[VISUAL]:** Dimmer classroom corner or tight close-up on **ALEX** rubbing tired eyes over a laptop. On-screen clock graphic: **`02:00 AM — DEMO DAY IN 6 HOURS`**.

**ALEX (relatable, stressed):**  
"Two AM before demo day. Just finished our billing endpoint with AI. Hey AI—double-check your own code for bugs?"

**[VISUAL]:** Teammate pops up behind Alex wearing a sticky note: `SAME AI`.

**SAME AI (cheerful thumbs-up):**  
"Looks great to me! Ship it!"

**[SFX / FLASH]:** *Record scratch.* Red alert graphic: **`CWE-639 DATA LEAK: ANY USER CAN READ ANY CUSTOMER INVOICE.`**

**[ACTION]:** Suddenly **NOISY BOT** slides into frame and rapidly slaps 10+ bright sticky notes all over Alex's laptop and desk.

**NOISY BOT:**  
"Wait! I reviewed your PR! Rename `invoice`! Use functional pipes! Also maybe a bug somewhere—no proof, just vibes!"

**ALEX (peeling sticky notes off):**  
"Forty bot comments wasting 45 minutes of my life—and NONE of them caught the security leak!"

**[ACTION]:** **TEAMMATE B** runs in from the back row holding a laptop.

**TEAMMATE B:**  
"Alex! Your AI changed the backend API schema! My frontend AI assumed the old types—our merge just blew up!"

**ALEX (looks straight to camera):**  
"Whether you're a solo dev, a hackathon squad, an open-source maintainer, or a startup team—why does verifying AI code hurt worse than writing it?"

---

### SCENE 2 — "ORDER IN THE REPO!" (`0:45 – 1:15`)
*(Covers: Product/Solution 25% — Architecture & Cross-Examination Setup)*

**[SFX / VISUAL]:** *SLAM!* Hard smash cut to the front of the classroom. **THE JUDGE** slams the whiteboard eraser gavel on the teacher's desk.  
**[TITLE CARD]:** **`COUNCILCODE`** — *A Jury of Rival AIs for Your AI-Written Code.*

**THE JUDGE:**  
"Order in the repo! Meet **CouncilCode**—a jury of rival AIs for your AI-written code. Instead of burying developers in threads of AI noise, we put competing models on trial *before* code reaches GitHub—delivering **one verified, green-tested Pull Request**."

**[VISUAL]:** Quick pan to **SANDBOX BAILIFF** holding a stopwatch and `0 TOKENS` sign.

**SANDBOX BAILIFF:**  
"First: our **Deterministic Sandbox Gate**. Linters, strict types, and baseline tests run in under **5 seconds**—at **zero LLM token cost**."

**[VISUAL]:** Quick pan to jury row (`GPT: STYLE`, `CLAUDE: SECURITY`, `DEEPSEEK: LOGIC`).

**GPT STYLE CRITIC (stands dramatically):**  
"Your Honor! Rename `invoice` to `billingDocumentRecord`!"

**THE JUDGE:**  
"Show me the failing executable test."

**GPT STYLE CRITIC (empty hands):**  
"Uh… no test. Just style?"

**[ACTION]:** Judge flashes the **RED CARD (`REJECTED — NO PROOF`)**.

**THE JUDGE:**  
"Overruled! Rejected by the Proof Gate. Security and Logic—show your evidence!"

---

### SCENE 3 — LIVE PROTOTYPE DEMO *(STRICTLY ≤ 30 SECONDS!)* (`1:15 – 1:45`)
*(Covers: Product/Solution 25% — OpenLearning Rule: Demo ≤ 30s, focus on benefits & impact)*

> **FILMING TIMER NOTE:** Keep this entire prototype screen-recording + voiceover between **25 and 30 seconds**!

**[VISUAL — FULL-SCREEN PROTOTYPE RECORDING (`0:25–0:30` clip from `npm run dev`)]:**  
Show the 3D CouncilCode Studio Diorama running `GET /api/v1/invoices/:id` (`CWE-639`):  
1. Sandbox clears 4/4 baseline gates at `$0` tokens.  
2. `CodeCraft Style` (OpenAI) gets rejected by Proof Gate.  
3. `Claude Sentinel` & `DeepSeek Logic` prove the IDOR exploit (`200 → 403`) & null-auth guard.  
4. `PRSummaryModal` turns **VERIFIED GREEN** with the `SHA256-ED25519` Proof Dossier.

**THE JUDGE (V.O. over demo):**  
"Watch our working prototype in action. Baseline tests pass, yet customer invoices still leak. Our Proof Gate blocks unproved style noise automatically—while Claude and DeepSeek prove the real security leak and logic flaw with failing tests. One arbitration loop later, CouncilCode delivers **one green PR** with a cryptographic Proof Dossier—cutting review noise by **over 80%** and merging **3x faster**."

**[ACTION — 5-SECOND MULTI-DEV BEAT]:** Back in classroom, ALEX and TEAMMATE B hold a paper **`API CONTRACT (LOCKED)`** and fist-bump.

**TEAMMATE B:**  
"And for teams, locked API contracts and parallel Pods deliver **over 90% first-pass merges**—zero interface drift."

---

### SCENE 4 — "WHY THIS IS TRULY NEW" (`1:45 – 2:30`)
*(Covers: Novelty 25% + Competitive Positioning)*

**[VISUAL]:** Smash cut to the **Classroom Whiteboard** showing the **2×2 Competitive Matrix**.

**PRESENTER A (energetic, tapping whiteboard):**  
"Judges—why is CouncilCode genuinely new and *not* just another AI wrapper? Four breakthroughs:
1. **Executable Proof Over Opinions:** Every review bot today writes text guesses. CouncilCode **mathematically rejects** any claim that can't compile into a failing test.
2. **Cross-Vendor Neutrality:** OpenAI, Anthropic, and Google won't host rival models to expose their own blind spots—we do.
3. **Zero-Token Pre-Critic Gate:** We kill syntax failures *before* spending a single review token.
4. **Zero Lock-In:** One command—`councilcode eject`—and every generated test stays in your repo as standard Jest or PyTest."

**[VISUAL]:** Points cleanly to the 4 quadrants on the whiteboard:  
- Bottom-Right: *Cursor / Copilot / Claude Code* (confirmation bias)  
- Bottom-Left: *CodeRabbit / Qodo / Devin* (unverified spam / costly closed loops)  
- Top-Left: *Manual Review + CI* (slow human bottleneck)  
- **Top-Right:** **CouncilCode** (Hallucination-Free + Proof-Gated Signal!)

---

### SCENE 5 — TARGET MARKET & SUSTAINABLE BUSINESS MODEL (`2:30 – 3:15`)
*(Covers: Target Market 10% + Business Model 15% — NO Initial Investment ask here per OpenLearning tip!)*

**[VISUAL]:** Camera pans slightly to the right half of the **Whiteboard** showing **TAM / SAM / SOM** circles and **BYOK Pricing**.

**PRESENTER B:**  
"Who buys this? Globally, **28.5 million** developers use Git (**TAM**), and **4.8 million** already author AI Pull Requests (**SAM**). Our beachhead **SOM** is just **0.5%**—**24,000** solo builders, hackathon squads, OSS maintainers, and 2-to-5 dev startups."

**THE JUDGE (stepping beside Presenter B):**  
"And our economics? **Bring-Your-Own-Key.** Customers plug in their own AI keys—so our LLM token cost is **zero**. Each ephemeral microVM run costs us just **1.5 to 2 cents**."

**PRESENTER B (pointing to pricing ladder on whiteboard):**  
"We hook devs in under **60 seconds** with a **Free tier** and **Verified OSS Grants**—then monetize via **$5 and $10 Solo plans** and **$15 per seat for Teams**, earning **78% to 95% gross margins**. Every green `CouncilCode PASSED` badge on a public PR turns one developer into five to twenty peers."

---

### SCENE 6 — ≤ 10s TEAM BEAT + FULL-CIRCLE CALLBACK & CTA (`3:15 – 3:50`)
*(Covers: Overall Presentation 5%, ≤10s Team Rule, Full-Circle Callback & Call to Action)*

**[VISUAL]:** Quick shot of the team standing together beside the whiteboard/projector.

**PRESENTER A *(STRICTLY 8–10 SECONDS)*:**  
"We're 3rd-year Computer Science builders who use AI coding agents every day—and we've already architected and built this interactive verification prototype from scratch."

**[VISUAL — FULL-CIRCLE CALLBACK TO SCENE 1]:** Smash cut back to **ALEX** at the exact same desk! Same `02:00 AM` clock graphic—except now the laptop screen shows **`PR #42: VERIFIED GREEN — 0 NOISE COMMENTS`**.

**ALEX (smiling, relaxed, clicks trackpad):**  
"Back to 2:00 AM before demo day—except with CouncilCode, that security leak was proved and patched in 15 seconds, the 40 spam bot comments never existed, and our team contract merged cleanly on the first try. I actually get to sleep."

**[VISUAL]:** Wide shot of the full team front-and-center. Judge raises the eraser-gavel one last time.

**THE JUDGE:**  
"If you write code with AI—or lead engineers who do—try our prototype, join our closed beta, and be part of the solution. **Don't merge AI guesses. Ship proved code.** We are **CouncilCode**."

**[END CARD (`3:43 – 3:50`):**  
- **CouncilCode** — *A Jury of Rival AIs for Your AI-Written Code*  
- WildRoar Series 3 | ES038 Technopreneurship | BSCS Team
