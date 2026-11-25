# CouncilCode — WildRoar Q&A Playbook (All 9 OpenLearning FAQs)

> **Purpose:** Prepare every teammate to crush live Q&A like champions using concise, data-backed answers aligned with your Google Sheet, [WildRoar_Pitch_Deck.md](file:///Users/gianne/Development/Web%20Development/CouncilCode/CouncilCode/WildRoar_Pitch_Deck.md), and OpenLearning tips.

---

## Champion Q&A Rules (from OpenLearning)
1. **Keep answers 20–30 seconds max**—headline first, then 1–2 numbers.
2. **Use Hidden Slides `A1–A3` ONLY when asked** about Initial Investment, Profitability/ROI, or Data Privacy.
3. **Never bluff an unvalidated metric:** If a judge asks something outside our current validation (e.g., exact 12-month churn or enterprise SLA pricing), say confidently:  
   > *"Great question—we haven't finalized that exact figure yet in our validation, so we will look into that and validate it further during our closed beta."*
4. **Pass the mic cleanly** to the teammate owning that domain (Economics/GTM, Architecture/Security, or Prototype).

---

## Answers to All 9 Official WildRoar FAQs

### 1. "Explain the economics of your idea."
> *"Our unit economics are built for software-grade margins from day one. Because CouncilCode uses a **Bring-Your-Own-Key (BYOK)** model, customers pay their LLM provider directly—meaning **our AI token cost is $0**. Our only variable compute cost is spinning up an ephemeral microVM (Firecracker / Fly.io / E2B) for 2–3 minutes at **`~$0.015–$0.020` per PR run**, and our deterministic sandbox rejects broken syntax in under 5 seconds at zero token cost. Even our Free tier costs only **`~$0.27–$0.45` per active user per month**, acting as ultra-cheap customer acquisition."*

---

### 2. "How do you make money?"
> *"We use a freemium **BYOK SaaS subscription model**: a **Free tier** (15 solo / 25 squad PRs) and **Verified OSS Grants** bring developers in bottom-up; **Solo Builder ($5/mo for 50 PRs)** and **Solo Pro ($10/mo for 250 PRs)** monetize active individual builders at **~78%–82% gross margin**; and **Team ($15/seat/mo, unlimited fair-use)** unlocks Two-Tier Contract Handshake Pods for multi-developer teams at **~95% gross margin**."*

---

### 3. "Explain how your business would be sustainable."
> *"Sustainability comes from three compounding loops: First, **zero LLM token margin risk**—as AI models get cheaper or pricier, our SaaS margins stay protected at 78%–95%. Second, **near-zero CAC via viral OSS PR badges**—every public green `CouncilCode: PASSED` PR markets us to 5–20 peer engineers automatically. Third, **compounding routing telemetry**—every verified run teaches us which model catches which bug class best, widening our accuracy moat over time."*

---

### 4. "How better are you compared to your competition?"
> *"Every existing tool forces a trade-off on our 2×2 matrix. In-IDE agents like **Cursor and Claude Code** suffer single-model confirmation bias—they miss their own blind spots. Post-PR bots like **CodeRabbit and Qodo** flood GitHub with unverified text comments and subjective nitpicks. Autonomous agents like **Devin** burn heavy tokens in closed single-model loops. **CouncilCode is the only solution that puts rival frontier models on trial and blocks any comment that cannot produce a failing executable test.**"*

---

### 5. "How do you plan to address the friction of solution adoption?"
> *"We designed CouncilCode for **zero-friction adoption in under 60 seconds**. Developers install via the VS Code Marketplace, GitHub App, or `npm i -g @councilcode/cli`. A zero-config handshake auto-detects their existing linters and test runners (`ESLint`, `tsc`, `Jest`, `PyTest`), stores BYOK keys securely in the local OS Keychain, and lets them start free with no procurement or credit card. Most importantly, we eliminate lock-in fear: running **`councilcode eject`** cleanly removes our hooks while leaving all generated regression tests as standard native tests in their repo."*

---

### 6. "Your idea requires so much capital investment. How do you plan to get investments?"
> *(Flip to **Hidden Slide A1: Initial Investment & Use of Funds**!)*  
> *"Actually, that's our biggest misconception advantage—because we don't train foundation models or subsidize LLM tokens (thanks to BYOK), **CouncilCode is extremely capital-lean**. We don't need millions in GPU clusters. Our 12-month pre-seed budget is just **`₱1.5M (~$25,000 USD)`**—focused 45% on core CLI/sandbox engineering, 20% on microVM hosting & beta free-tier CAC, 15% on hackathon/OSS GTM, 10% on security audits/legal, and 10% contingency. We plan to fund this through university TBI & DOST-PCIEERD innovation grants (like Wildcat Innovation Labs), startup pitch prizes, and lean pre-seed angels."*

---

### 7. "When are you going to be profitable?"
> *(Flip to **Hidden Slide A2: Path to Profitability, Breakeven & ROI**!)*  
> *"Because our gross margins are **78% to 95%** and our fixed cloud overhead is minimal, our breakeven point is remarkably low: roughly **350 to 450 paying seats** (for example, ~25 small 4-person startup teams plus ~250 solo builders)—which is **less than 2% of our 24,000-developer beachhead SOM**. With a 6-month closed beta and Team Tier rollout, we target reaching operational breakeven within **12 to 18 months** post-beta launch—and we'll validate our exact conversion and retention curves during our closed beta."*

---

### 8. "What's your Return-On-Investment?"
> *(Keep **Hidden Slide A2** open!)*  
> *"There are two ROIs here. First, **Customer ROI is immediate**: a senior engineer spends 30–45 minutes reviewing a noisy AI PR—saving even one PR per month already pays back a **`$15/seat/mo`** Team subscription multiple times over, while cutting review noise by **>80%**. Second, for **Investor ROI**: capturing just **15% to 25% paid conversion** of our 24,000 beachhead SOM at a ~$10 blended ARPU generates **`$432K–$720K` in high-margin ARR** off a lean ~$25K pre-seed base—before scaling into the broader 4.8M SAM."*

---

### 9. "Your application is gathering too much data from the end-users. How do you intend to protect them?"
> *(Flip to **Hidden Slide A3: End-User Data Privacy & Security Architecture**!)*  
> *"Developer code privacy is built into our architecture by design:  
> 1. **Zero persistent code storage:** CouncilCode never stores customer source repositories on intermediate servers.  
> 2. **Local OS Keychain BYOK:** API keys never leave the developer's control unencrypted.  
> 3. **Ephemeral, isolated microVMs:** Verification runs inside read-only containers (`2 vCPU / 2GB RAM`, `<15s` cap) with restricted network access and are **wiped immediately** after the run.  
> 4. **Diff-only scope isolation:** We scan changed diff files only and explicitly ignore `.env` files, secrets, and untracked credentials."*

---

## Bonus Tough Questions (Just in Case)
- **"What if two AI critics disagree?"**  
  *"The Proof Gate decides—not a popularity vote. If Critic A proves a failing exploit test and Critic B only offers an unproved style preference, Critic B is discarded and the Main Agent arbitrates strictly on proved failures within a hard cap of 2 loops."*
- **"Aren't multi-model runs too slow?"**  
  *"We keep latency tight in two ways: first, the deterministic sandbox fails broken code in `<5s` before calling any LLM; second, all rival critics inspect the diff **asynchronously in parallel**, keeping proof validation under ~15 seconds and total PR cycles around 2–3 minutes—far faster than a 45-minute human review."*
