# CouncilCode — WildRoar Series 3 AI Editing & Production Guide

> **Purpose:** Complete, structured editing script for an AI video editor / motion graphics generator. Contains the **entire spoken script** from `WildRoar_Video_Script.md`, mapped to the exact **Voice-Over audio files** in Google Drive and explicitly tagged for **Live Action**, **Voice Over**, **Motion Graphics**, **Motion Graphics Overlays**, and **Screen Recordings**.
>
> **Google Drive Asset Folder:** `https://drive.google.com/drive/u/1/folders/1eWmvpCldeSipoLUZgwdrtBwF1nnOP4Kb`  
> **Target Runtime:** **~3 minutes 50 seconds**  
> **Hard Timing Rules (DO NOT VIOLATE):**
> - **Scene 3 (Live Prototype Demo):** Strictly **`≤ 30 seconds`** (target **`22–26s`**).
> - **Scene 6 (Team Beat):** Strictly **`≤ 10 seconds`** (target **`7–8s`**).
> - **No Initial Investment Ask:** Do not add investment/funding numbers anywhere in the main video.

---

## 1. Editing Tag Legend

Every scene and beat below uses these standardized tags so the editing AI knows the exact audio and visual pipeline required:

| Tag | Meaning | Action for Editing AI |
| :--- | :--- | :--- |
| **`[LIVE ACTION]`** | Filmed classroom footage (`IMG_6674.MOV` – `IMG_6752.MOV` in Drive root) | Cut and assemble from raw `.MOV` clips using on-camera audio. |
| **`[VOICE OVER]`** | Pre-recorded `.m4a` voice-over from `Audios/` folder | Use the exact `.m4a` file listed as the primary audio track (no on-camera talking head). |
| **`[MOTION GRAPHICS]`** | Full-screen animated graphic sequence | **Create a custom motion graphics video** synced beat-by-beat to the voice-over audio. |
| **`[MG OVERLAY]`** | Transparent graphic / HUD / title card / alert | Composite on top of `[LIVE ACTION]` or `[SCREEN RECORDING]` footage. |
| **`[SCREEN RECORDING]`** | Captured UI/CLI video of the CouncilCode prototype | Use real screen recording of the web app (`/` and `/studio`) or CLI, enhanced with clean zoom/highlights. |

---

## 2. Master Voice-Over & Asset Mapping (Google Drive)

### A. Pre-Recorded Voice-Over Files (`Audios/` subfolder)
The filename of each `.m4a` file matches the first few words spoken by the speaker. **All 6 voice-over files appear continuously across Scenes 3, 4A, 4B, and 5:**

| Order | Scene / Beat | Timestamp | Speaker | Exact Audio File (`Audios/`) | Required Visual Pipeline |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **1** | **Scene 3:** Live Prototype Demo *(≤ 30s)* | `1:20 – 1:45` | **Johanne** | `Watch our working prototype.m4a` | **`[SCREEN RECORDING]` + `[MOTION GRAPHICS]`** *(prototype capture of `/` → `/studio` with motion graphics callouts/overlays, or full motion-graphics demo recreation)* |
| **2** | **Scene 4A:** The 4 Breakthroughs | `1:52 – 2:14` | **Gianne** | `Why is councilcode genuinely new.m4a` | **`[MOTION GRAPHICS]`** *(full-screen animated sequence synced to all 4 points)* |
| **3** | **Scene 4B:** The 2×2 Competitive Matrix | `2:14 – 2:34` | **James (Samson)** | `On our matrix, code reliability.m4a` | **`[MOTION GRAPHICS]`** *(full-screen animated 2×2 Competitive Matrix synced to voice-over)* |
| **4** | **Scene 5 (Beat 1):** Target Market (TAM/SAM/SOM) | `2:34 – 2:47` | **Casidey** | `Out of 28.5 Million.m4a` | **`[MOTION GRAPHICS]`** *(animated TAM/SAM/SOM circles + beachhead persona visuals)* |
| **5** | **Scene 5 (Beat 2):** BYOK Unit Economics | `2:47 – 2:57` | **Johanne** | `Our economics.m4a` | **`[MOTION GRAPHICS]`** *(animated BYOK zero-COGS & microVM cost flow)* |
| **6** | **Scene 5 (Beat 3):** GTM, Pricing & Margins | `2:57 – 3:14` | **Casidey** | `Dev starts in under 60 seconds.m4a` | **`[MOTION GRAPHICS]` and/or `[SCREEN RECORDING]`** *(web app / CLI install recording + animated pricing ladder, margin bar & viral PR badge)* |

### B. Raw Live-Action Video Clips (Drive Root Folder)
- **Files:** 20 `.MOV` clips (`IMG_6674.MOV`, `IMG_6678.MOV`, `IMG_6679.MOV`, `IMG_6680.MOV`, `IMG_6681.MOV`, `IMG_6688.MOV`, `IMG_6689.MOV`, `IMG_6695.MOV`, `IMG_6709.MOV`, `IMG_6712.MOV`, `IMG_6713.MOV`, `IMG_6714.MOV`, `IMG_6715.MOV`, `IMG_6717.MOV`, `IMG_6722.MOV`, `IMG_6723.MOV`, `IMG_6737.MOV`, `IMG_6744.MOV`, `IMG_6750.MOV`, `IMG_6752.MOV`).
- **Used for:** **Scene 1**, **Scene 2**, **Scene 3B**, and **Scene 6**.

---

## 3. High-Level Timeline Overview

| Scene | Time | Audio Track | Visual Track | Hard Rule |
| :--- | :---: | :--- | :--- | :--- |
| **Scene 1:** 2:00 AM "Hugot" Cold Open | `0:00 – 0:45` | On-camera audio | `[LIVE ACTION]` + `[MG OVERLAY]` | Clock overlay + `CWE-639` red alert flash |
| **Scene 2:** "Order in the Repo!" | `0:45 – 1:20` | On-camera audio | `[LIVE ACTION]` + `[MG OVERLAY]` | Title card smash cut on gavel slam |
| **Scene 3:** Live Prototype Demo | `1:20 – 1:45` | **`[VOICE OVER]`** `Watch our working prototype.m4a` | **`[SCREEN RECORDING]` + `[MOTION GRAPHICS]`** | **STRICT `≤ 30s`** (target `22–26s`) |
| **Scene 3B:** Multi-Dev Bridge | `1:45 – 1:52` | On-camera audio | `[LIVE ACTION]` + optional `[MG OVERLAY]` | Outside 30s demo timer |
| **Scene 4A:** The 4 Breakthroughs | `1:52 – 2:14` | **`[VOICE OVER]`** `Why is councilcode genuinely new.m4a` | **`[MOTION GRAPHICS]`** | Full motion graphics synced to audio |
| **Scene 4B:** 2×2 Competitive Matrix | `2:14 – 2:34` | **`[VOICE OVER]`** `On our matrix, code reliability.m4a` | **`[MOTION GRAPHICS]`** | Full animated 2×2 matrix synced to audio |
| **Scene 5:** Market & Business Model | `2:34 – 3:14` | **`[VOICE OVER]`** 3 files (`Out of 28.5 Million.m4a` → `Our economics.m4a` → `Dev starts in under 60 seconds.m4a`) | **`[MOTION GRAPHICS]`** + **`[SCREEN RECORDING]`** | No initial investment ask |
| **Scene 6:** Team + Callback + CTA + End Card | `3:14 – 3:48` | On-camera audio | `[LIVE ACTION]` + `[MG OVERLAY]` + **`[MOTION GRAPHICS]`** (End Card) | **Team Beat STRICT `≤ 10s`** (target `7–8s`) |

---

## 4. Full Scene-by-Scene Script with AI Editing Directives

---

### SCENE 1 — THE "HUGOT" COLD OPEN: 2:00 AM BEFORE DEMO DAY (`0:00 – 0:45`)
- **Production Mode:** `[LIVE ACTION]` + `[MG OVERLAY]`
- **Audio Source:** On-camera audio from `.MOV` clips + SFX (*record scratch*)

#### Shot 1.1 — `[LIVE ACTION]` + `[MG OVERLAY]`
- **Visual:** Dimmer classroom corner. Tight close-up on **John Prince** rubbing tired eyes over a laptop.
- **`[MG OVERLAY]` Required:** Corner digital clock HUD: **`02:00 AM — DEMO DAY IN 6 HOURS`**.
- **Spoken Script — John Prince:**
  > "Two AM before demo day. Just finished our billing API with AI. Hey AI—double-check your own code for bugs?"

#### Shot 1.2 — `[LIVE ACTION]`
- **Visual:** **Ycany** pops up behind John Prince wearing a sticky note: **`SAME AI`**. Cheerful thumbs-up.
- **Spoken Script — Ycany:**
  > "Looks great to me! Ship it!"

#### Shot 1.3 — `[MG OVERLAY]` + `[SFX]`
- **Audio SFX:** Sharp *record scratch* + alarm chime.
- **`[MG OVERLAY]` Required:** Full-screen glitch / red alert banner flashing briefly across the frame:  
  **`CWE-639 DATA LEAK: ANY USER CAN READ ANY CUSTOMER INVOICE.`**

#### Shot 1.4 — `[LIVE ACTION]`
- **Visual:** **Renzo** slides into frame and rapidly slaps 10+ bright sticky notes all over John Prince's laptop and desk.
- **Spoken Script — Renzo:**
  > "Wait! I reviewed your PR! Rename `invoice`! Use functional pipes! Also maybe a bug somewhere—no proof, just vibes!"

#### Shot 1.5 — `[LIVE ACTION]`
- **Visual:** **John Prince** peeling sticky notes off his screen.
- **Spoken Script — John Prince:**
  > "Forty bot comments wasting forty-five minutes of my life—and none of them caught the security leak!"

#### Shot 1.6 — `[LIVE ACTION]`
- **Visual:** **Dexter (Benitez)** rushes in from the back row holding a laptop.
- **Spoken Script — Dexter (Benitez):**
  > "Prince! Your AI changed the backend API schema! Our merge just blew up!"

#### Shot 1.7 — `[LIVE ACTION]`
- **Visual:** **John Prince** looks straight into camera.
- **Spoken Script — John Prince:**
  > "Solo dev, hackathon squad, open-source maintainer, or startup team—why does verifying AI code hurt worse than writing it?"

---

### SCENE 2 — "ORDER IN THE REPO!" (`0:45 – 1:20`)
- **Production Mode:** `[LIVE ACTION]` + `[MG OVERLAY]`
- **Audio Source:** On-camera audio from `.MOV` clips + SFX (*gavel slam*)

#### Shot 2.1 — `[LIVE ACTION]` + `[MG OVERLAY]`
- **Visual:** Hard smash cut to bright front of classroom. **Johanne** slams whiteboard eraser gavel on teacher's desk (*SLAM!* SFX).
- **`[MG OVERLAY]` Required (Title Card):** Bold animated title card / lower-third bumper:  
  **`COUNCILCODE`** — *A Jury of Rival AIs for Your AI-Written Code.*
- **Spoken Script — Johanne:**
  > "Order in the repo! Meet **CouncilCode**—a jury of rival AIs for your AI-written code. Plug in **any models you want** with your own keys, put them on trial *before* GitHub, and ship **one verified, green-tested Pull Request**."

#### Shot 2.2 — `[LIVE ACTION]`
- **Visual:** Quick pan to **Lei** holding a stopwatch and **`SANDBOX GATE (0 TOKENS)`** sign.
- **Spoken Script — Lei:**
  > "First: our **Deterministic Sandbox Gate**—running locally in Docker or in a cloud microVM. Linters, strict types, and baseline tests run in under **five seconds** at **zero LLM token cost**."

#### Shot 2.3 — `[LIVE ACTION]`
- **Visual:** Pan across the 3-person jury row (`MODEL C: STYLE`, `MODEL A: SECURITY`, `MODEL B: LOGIC`). **Renzo** stands up dramatically.
- **Spoken Script — Renzo:**
  > "Your Honor! Rename `invoice` to `billingDocumentRecord`!"
- **Spoken Script — Johanne:**
  > "Show me the failing executable test."
- **Spoken Script — Renzo:** *(checks empty hands, sheepish)*
  > "Uh… no test. Just style?"

#### Shot 2.4 — `[LIVE ACTION]`
- **Visual:** **Johanne** flashes the **RED CARD (`REJECTED — NO PROOF`)**.
- **Spoken Script — Johanne:**
  > "Overruled! Blocked by the Proof Gate. Next witnesses!"

#### Shot 2.5 — `[LIVE ACTION]`
- **Visual:** **Gianne** and **James (Samson)** stand back-to-back and hold up their printed failing test pages.
- **Spoken Script — Gianne:**
  > "Objection! Cross-tenant invoice leak—here's my failing `403` exploit test."
- **Spoken Script — James (Samson):**
  > "Seconded! Missing null-auth guard crashes the route—here's my failing assertion."
- **Visual:** **Johanne** slams gavel.
- **Spoken Script — Johanne:**
  > "Both proved! Patching now."

---

### SCENE 3 — LIVE PROTOTYPE DEMO *(STRICTLY `≤ 30 SECONDS`!)* (`1:20 – 1:45`)
- **Production Mode:** **`[VOICE OVER]`** + **`[SCREEN RECORDING]`** + **`[MOTION GRAPHICS]`**
- **Audio File:** `Audios/Watch our working prototype.m4a` *(Speaker: Johanne)*
- **HARD CONSTRAINT:** Total scene duration MUST stay strictly under **30 seconds** (target **`22–26s`**). Match visual pacing tightly to `Watch our working prototype.m4a`.

#### Spoken Script — Johanne (`[VOICE OVER]` — `Watch our working prototype.m4a`)
> "Watch our working prototype on a real billing API. Baseline tests pass, yet customer invoices still leak. The Proof Gate blocks unproved style noise while rival models prove the security and logic flaws with failing tests—shipping **one green PR** with a Proof Dossier, cutting noise **over 80%** and merging **3x faster**."

#### Visual & Motion Graphics Direction (`[SCREEN RECORDING]` + `[MOTION GRAPHICS]`)
Combine the live prototype screen recording (`/` → `/studio`) with crisp motion-graphics callouts, zoom-ins, and metric badges (or animate the UI states cleanly as motion graphics synced to the voice-over):
1. **`0:00 – 0:04`** (*"Watch our working prototype on a real billing API."*):
   - **`[SCREEN RECORDING]`** of the CouncilCode landing page (`/`) Proof Gate preview transitioning into `/studio` (3D CouncilCode Studio Diorama).
   - **`[MG OVERLAY]`**: Subtle badge showing `GET /api/v1/invoices/:id` (`CWE-639`).
2. **`0:04 – 0:10`** (*"Baseline tests pass, yet customer invoices still leak."*):
   - **`[SCREEN RECORDING]`** / **`[MOTION GRAPHICS]`**: Sandbox clearing `4/4` baseline gates at `$0 tokens`, paired with a red security highlight showing cross-tenant invoice leak.
3. **`0:10 – 0:18`** (*"The Proof Gate blocks unproved style noise while rival models prove the security and logic flaws with failing tests..."*):
   - **`[SCREEN RECORDING]`** + **`[MOTION GRAPHICS]`**: Style nitpick stamped **`REJECTED — NO PROOF`**; Security & Logic critic cards lighting up with executable failing tests (`403 IDOR Exploit` + `Null-Auth Crash`).
4. **`0:18 – 0:24`** (*"...shipping one green PR with a Proof Dossier, cutting noise over 80% and merging 3x faster."*):
   - **`[SCREEN RECORDING]`** + **`[MOTION GRAPHICS]`**: `PRSummaryModal` flips **`VERIFIED GREEN`** with **`SHA256-ED25519` Proof Dossier** badge; punchy motion-graphic stat callouts pop in: **`>80% LESS NOISE`** and **`3× FASTER MERGES`**.

---

### SCENE 3B — MULTI-DEV BRIDGE (`1:45 – 1:52`)
- **Production Mode:** `[LIVE ACTION]` + optional `[MG OVERLAY]`
- **Audio Source:** On-camera audio from `.MOV` clips
- **Note:** This scene is **outside** the 30-second prototype demo timer.

#### Shot 3B.1 — `[LIVE ACTION]`
- **Visual:** Smash cut back to classroom. **John Prince** and **Dexter (Benitez)** hold up the **`API CONTRACT (LOCKED)`** sheet and fist-bump.
- **Optional `[MG OVERLAY]`:** Clean lower-third stat badge: **`>90% FIRST-PASS MERGES — ZERO INTERFACE DRIFT`**.
- **Spoken Script — Dexter (Benitez):**
  > "And for teams, locked API contracts and parallel Pods deliver **over 90% first-pass merges**—zero interface drift."

---

### SCENE 4 — "WHY THIS IS TRULY NEW" (`1:52 – 2:34`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`** *(ENTIRE Scene 4 is voice-over driven and must be created as Motion Graphics synced to the two audio files)*

---

#### Part 4A: The 4 Breakthroughs (`1:52 – 2:14`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`** *(Full-screen motion graphics video corresponding to the audio)*
- **Audio File:** `Audios/Why is councilcode genuinely new.m4a` *(Speaker: Gianne)*

##### Spoken Script — Gianne (`[VOICE OVER]` — `Why is councilcode genuinely new.m4a`)
> "Why is CouncilCode genuinely new—not just an AI wrapper? Four reasons.  
> First, **Executable Proof Over Opinions**: every claim must fail on old code and pass on patched code.  
> Second, **Vendor-Neutral BYOK**: big labs won't host rivals to expose their own blind spots—we let you combine any cloud or local models.  
> Third, **Zero-Token Fast-Fail**: broken syntax never burns a review token.  
> Fourth, **Zero Lock-In**: `councilcode eject` leaves standard Jest or PyTest files behind."

##### Motion Graphics Direction (`[MOTION GRAPHICS]`)
Create a kinetic, high-contrast 4-part motion graphics sequence synced to each numbered beat:
1. **Intro** (*"Why is CouncilCode genuinely new—not just an AI wrapper? Four reasons."*): Bold header `"NOT AN AI WRAPPER — 4 BREAKTHROUGHS"` animating into a 4-slot layout.
2. **Reason 1 — Executable Proof Over Opinions**: Red `FAIL (Old Code)` → Patch arrow → Green `PASS (Patched Code)` checkmark animation.
3. **Reason 2 — Vendor-Neutral BYOK**: Multi-vendor key/model plug-in diagram showing rival cloud + local models (e.g., Model A, Model B, Local LLM) plugging into one neutral CouncilCode hub via `YOUR KEYS`.
4. **Reason 3 — Zero-Token Fast-Fail**: Broken syntax icon hitting a shield (`SANDBOX GATE`) and bouncing back with **`$0 TOKENS SPENT`**.
5. **Reason 4 — Zero Lock-In**: Terminal command typing `$ councilcode eject` → cleanly outputting standard `*.test.ts` (Jest) and `test_*.py` (PyTest) files.

---

#### Part 4B: The 2×2 Competitive Matrix (`2:14 – 2:34`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`** *(Full-screen animated 2×2 matrix corresponding to the audio)*
- **Audio File:** `Audios/On our matrix, code reliability.m4a` *(Speaker: James Samson)*

##### Spoken Script — James (Samson) (`[VOICE OVER]` — `On our matrix, code reliability.m4a`)
> "On our matrix—Code Reliability versus PR Signal—every rival forces a trade-off.  
> In-IDE agents like **Cursor, Copilot, and Claude Code** suffer single-model bias.  
> Bots like **CodeRabbit, Qodo, and Devin** spam unverified comments or burn tokens in closed loops.  
> Manual review plus CI is slow.  
> **CouncilCode** stands alone in the top-right: hallucination-resistant reliability **and** proof-gated signal."

##### Motion Graphics Direction (`[MOTION GRAPHICS]`)
Create an animated 2×2 Competitive Matrix synced beat-by-beat:
1. **Axes Draw-In** (*"On our matrix—Code Reliability versus PR Signal..."*): Draw Y-axis (**Code Reliability**) and X-axis (**PR Review Signal**).
2. **Quadrant 1 — In-IDE Agents** (*"In-IDE agents like Cursor, Copilot, and Claude Code..."*): Plot cluster (**Cursor**, **Copilot**, **Claude Code**) with subtle warning tag: *Single-Model Bias*.
3. **Quadrant 2 — Review Bots / Autonomous Loops** (*"Bots like CodeRabbit, Qodo, and Devin..."*): Plot cluster (**CodeRabbit**, **Qodo**, **Devin**) with tag: *Unverified Noise / High Token Burn*.
4. **Quadrant 3 — Manual Review + CI** (*"Manual review plus CI is slow."*): Plot **Manual Review + CI** with clock icon: *Slow Bottleneck*.
5. **Hero Quadrant — Top-Right** (*"CouncilCode stands alone in the top-right..."*): Highlight top-right quadrant in glowing green/accent; **CouncilCode** logo locks in with two checkmarks: **`Hallucination-Resistant Reliability`** + **`Proof-Gated Signal`**.

---

### SCENE 5 — TARGET MARKET & SUSTAINABLE BUSINESS MODEL (`2:34 – 3:14`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`** (and optional **`[SCREEN RECORDING]`** of the web app / CLI for Beat 3)
- **Audio Files (3 sequential files):**
  1. `Audios/Out of 28.5 Million.m4a` *(Casidey)*
  2. `Audios/Our economics.m4a` *(Johanne)*
  3. `Audios/Dev starts in under 60 seconds.m4a` *(Casidey)*
- **HARD CONSTRAINT:** Do **NOT** mention or display any initial investment / funding ask here.

---

#### Beat 5.1: Target Market — TAM / SAM / SOM (`2:34 – 2:47`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`**
- **Audio File:** `Audios/Out of 28.5 Million.m4a` *(Speaker: Casidey)*

##### Spoken Script — Casidey (`[VOICE OVER]` — `Out of 28.5 Million.m4a`)
> "Out of **28.5 million** Git developers (**TAM**), **4.8 million** already ship AI Pull Requests (**SAM**). Our beachhead **SOM** is just **0.5%**—**24,000** solo builders, hackathon squads, open-source maintainers, and 2-to-5 dev startups."

##### Motion Graphics Direction (`[MOTION GRAPHICS]`)
- Concentric animated circles / funnel expanding or zooming inward in sync with numbers:
  - Outer ring: **`TAM — 28.5M`** *(Git Developers)*
  - Middle ring: **`SAM — 4.8M`** *(Shipping AI Pull Requests)*
  - Inner glowing core: **`SOM — 24,000 (0.5%)`** with 4 clean persona chips popping in: *Solo Builders*, *Hackathon Squads*, *OSS Maintainers*, *2–5 Dev Startups*.

---

#### Beat 5.2: BYOK Economics (`2:47 – 2:57`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`**
- **Audio File:** `Audios/Our economics.m4a` *(Speaker: Johanne)*

##### Spoken Script — Johanne (`[VOICE OVER]` — `Our economics.m4a`)
> "Our economics? **Bring-Your-Own-Key.** Customers supply their own API keys or local models—so our LLM token cost is **zero**, and cloud microVMs cost just **1.5 to 2 cents** per run."

##### Motion Graphics Direction (`[MOTION GRAPHICS]`)
- Clean unit-economics flow diagram:
  - Left: `Customer API Keys / Local Models` → Key icon plugging into `CouncilCode`
  - Center highlight card: **`$0 LLM TOKEN COGS`** (bold green callout)
  - Right highlight card: **`~$0.015 – $0.020 / Cloud MicroVM Run`** (tiny coin/server badge).

---

#### Beat 5.3: Onboarding, Pricing Ladder, Gross Margins & Viral Loop (`2:57 – 3:14`)
- **Production Mode:** **`[VOICE OVER]`** + **`[MOTION GRAPHICS]`** and/or **`[SCREEN RECORDING]`** *(web app / CLI screen capture paired with pricing & margin graphics)*
- **Audio File:** `Audios/Dev starts in under 60 seconds.m4a` *(Speaker: Casidey)*

##### Spoken Script — Casidey (`[VOICE OVER]` — `Dev starts in under 60 seconds.m4a`)
> "Devs start in under **60 seconds** with our **free local CLI** or **browser app**—even offline—plus a **Cloud Free tier** and **OSS Grants**. Active builders upgrade to **$5 or $10 Solo** and **$15 per seat for Team Pods**, hitting **78% to 95% gross margins**. Every green `CouncilCode PASSED` PR badge organically brings in five to twenty peers."

##### Visual Direction (`[SCREEN RECORDING]` + `[MOTION GRAPHICS]`)
1. **Onboarding (`<60s`)**: Quick **`[SCREEN RECORDING]`** of the CouncilCode web app or terminal running `npm i -g @councilcode/cli` with a `<60s` timer badge + `FREE LOCAL CLI • BROWSER APP • OFFLINE READY • CLOUD FREE & OSS GRANTS`.
2. **Pricing Ladder & Margins (`[MOTION GRAPHICS]`)**: Clean 4-column tier ladder animating left-to-right:
   - **`$0`** *(Local CLI / Cloud Free / OSS Grants)* → **`$5`** *(Solo)* → **`$10`** *(Solo Pro)* → **`$15/seat`** *(Team Pods)*
   - Gross margin meter animating up to **`78% – 95% GROSS MARGINS`**.
3. **Viral PR Badge Loop (`[MOTION GRAPHICS]`)**: A GitHub PR status check badge **`✓ CouncilCode PASSED`** glowing green, with branching lines multiplying outward to **`5–20 PEERS`**.

---

### SCENE 6 — `≤ 10s` TEAM BEAT + FULL-CIRCLE CALLBACK & CTA (`3:14 – 3:48`)
- **Production Mode:** `[LIVE ACTION]` + `[MG OVERLAY]` + **`[MOTION GRAPHICS]`** (End Card)
- **Audio Source:** On-camera audio from `.MOV` clips

#### Shot 6.1 — Team Beat *(STRICTLY `≤ 10 SECONDS`!)* — `[LIVE ACTION]`
- **HARD CONSTRAINT:** Keep this cut strictly **`7–8 seconds`** (MUST NOT exceed 10 seconds).
- **Visual:** Quick energetic shot of all 9 teammates standing together beside the whiteboard/projector.
- **Spoken Script — Ycany:** *(19 words)*
  > "We're nine third-year Computer Science builders who ship with AI daily—and we've already built this live verification prototype from scratch."

#### Shot 6.2 — Full-Circle Callback to Scene 1 — `[LIVE ACTION]` + `[MG OVERLAY]`
- **Visual:** Smash cut back to **John Prince** at the exact same desk from Scene 1. Smiling, relaxed, closes laptop lid at the end.
- **`[MG OVERLAY]` Required:** Matching `02:00 AM` clock HUD from Scene 1, plus a green status overlay / screen glow callout:  
  **`PR #42: VERIFIED GREEN — 0 NOISE COMMENTS`**
- **Spoken Script — John Prince:**
  > "Back to 2:00 AM before demo day—except with CouncilCode, that security leak was proved and patched in fifteen seconds, the forty spam bot comments never existed, and our team merged cleanly on the first try. I actually get to sleep."

#### Shot 6.3 — Final CTA & Group Sign-Off — `[LIVE ACTION]`
- **Visual:** Wide shot of all 9 teammates front-and-center. **Johanne** raises the whiteboard eraser gavel one last time.
- **Spoken Script — Johanne:**
  > "If you build with AI—or lead engineers who do—try our web app, install our free CLI, or join our closed beta. **Don't merge AI guesses. Ship proved code.** We are—"
- **Spoken Script — ALL 9 TEAMMATES (in unison):**
  > "**CouncilCode!**"

#### Shot 6.4 — End Card (`3:42 – 3:48`) — **`[MOTION GRAPHICS]`**
- **Visual (`[MOTION GRAPHICS]`):** Clean branded end card holding for ~5–6 seconds:
  - **CouncilCode** — *A Jury of Rival AIs for Your AI-Written Code*
  - Try the Web App & Free Open-Source CLI (`npm i -g @councilcode/cli`)
  - WildRoar Series 3 | ES038 Technopreneurship | BSCS Team *(Cando, Alonte, Benitez, Cruz, Densing, Pogoy, Quibuyen, Samson, Sanchez)*

---

## 5. Consolidated Deliverables Checklist for the Editing AI

### A. Full-Screen Motion Graphics Videos to Create (`[MOTION GRAPHICS]`)
1. **Scene 3** (`Watch our working prototype.m4a`) — Motion-graphics overlays/enhancements (or full animated prototype visualization) paired with the `/` → `/studio` prototype screen recording (`≤ 30s`).
2. **Scene 4A** (`Why is councilcode genuinely new.m4a`) — 4 Breakthroughs animated explainer (`~22s`).
3. **Scene 4B** (`On our matrix, code reliability.m4a`) — 2×2 Competitive Matrix animated chart (`~20s`).
4. **Scene 5.1** (`Out of 28.5 Million.m4a`) — TAM / SAM / SOM animated circles + beachhead personas (`~13s`).
5. **Scene 5.2** (`Our economics.m4a`) — BYOK `$0` LLM COGS & `$0.015–$0.020`/run microVM cost diagram (`~10s`).
6. **Scene 5.3** (`Dev starts in under 60 seconds.m4a`) — `<60s` onboarding, pricing ladder (`$0 / $5 / $10 / $15`), `78%–95%` gross margin meter, and viral `CouncilCode PASSED` badge loop (`~17s`).
7. **Scene 6.4** — Branded End Card (`~6s`).

### B. Screen Recordings Needed (`[SCREEN RECORDING]`)
1. **Scene 3 (`≤ 30s`):** Full-screen capture of `/` landing page → `/studio` 3D CouncilCode Studio running `GET /api/v1/invoices/:id` (`CWE-639`) → `PRSummaryModal` flipping **VERIFIED GREEN** with `SHA256-ED25519` Proof Dossier.
2. **Scene 5.3 (Optional / Recommended):** Quick web app or CLI install (`npm i -g @councilcode/cli`) screen recording under Beat 5.3's `<60s` onboarding line.

### C. Motion Graphics Overlays on Live Action (`[MG OVERLAY]`)
1. **Scene 1.1:** `02:00 AM — DEMO DAY IN 6 HOURS` clock HUD.
2. **Scene 1.3:** Red alert flash `CWE-639 DATA LEAK: ANY USER CAN READ ANY CUSTOMER INVOICE.` + record scratch SFX.
3. **Scene 2.1:** `COUNCILCODE — A Jury of Rival AIs for Your AI-Written Code` title card on gavel slam.
4. **Scene 3B (Optional):** `>90% FIRST-PASS MERGES — ZERO INTERFACE DRIFT` stat badge.
5. **Scene 6.2:** Matching `02:00 AM` clock HUD + green `PR #42: VERIFIED GREEN — 0 NOISE COMMENTS` overlay.
