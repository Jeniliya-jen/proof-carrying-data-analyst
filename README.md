# Proof-Carrying Data Analyst (HNX26PSI08)
**Presented by Division of Computer Science and Engineering**  
**Karunya Institute of Technology and Sciences**  
*Internal Qualifier Round · Generative AI · Computer Vision · Agentic AI · Applied ML*

---

## 1. Project Overview & What It Does
In corporate and scientific data science, real-world data across multiple tables is filled with traps:
- **Unit mismatches** (e.g. mixing USD and EUR, or milligrams vs grams)
- **Ambiguous dates** (`04/05/2024` where month and day can be reversed)
- **Duplicate rows** (duplicate transaction IDs or double webhook syncs)
- **Table contradictions** (e.g. Sales Ledger showing 50 units ordered, while Warehouse Dispatch shows 35 units shipped)
- **Missing critical data** (null ratios exceeding statistical reliability thresholds)
- **Adversarial questions & false presuppositions** (e.g. asking "Why did Enterprise tier churn 50%?" when actual churn was 0%)

**The Proof-Carrying Data Analyst** is an Agentic GenAI system built with a single golden principle:
> **Every number must come with working, re-runnable code. If someone else runs the code and gets a different number, the system fails. Furthermore, wrong + confident explanations score worse than saying "I can't determine this from the data" with rigorous evidence.**

### Key Features
1. **Proof-Carrying Numerical Assertions**: Every number generated in an answer is bound to a verified variable in executable code, with match status confirmed in an isolated execution sandbox.
2. **Dual Execution & Live Re-Runner Engine**: Anyone (evaluators, judges, or auditors) can view the synthesized code, edit lines, and click **"Re-Run Verifier Now"** to test live execution in milliseconds.
3. **Automated Pre-Flight Trap Scanner**: Scans relational schemas and data distributions to catch mixed currencies, ambiguous dates, repeat keys, and cross-table variances before answering.
4. **Strict Refusal Protocol**: Detects false presuppositions and unanswerable out-of-schema queries, producing formal refusal certificates rather than hallucinating numbers.
5. **Cryptographic Proof Certificate**: Generates a tamper-evident execution signature hash (`0x...`) combining dataset state, code AST, and computed output.
6. **Built-in Benchmark Suite**: 7 pre-configured test scenarios mapping directly to the evaluation criteria of the Karunya Problem Statement booklet.

---

## 2. Technologies, Libraries & Models Used
- **Frontend Workbench**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Full-Stack Execution Backend**: Express 4, Node.js runtime, Vite 8 Middleware
- **Generative AI & Agentic Reasoning**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`) + Deterministic AST rule-based agentic pipeline
- **Sandbox VM Engine**: Pure isolated JavaScript execution runner with intercepted standard I/O streams and numeric tolerance verification

---

## 3. How to Install Dependencies
Ensure you have Node.js (version 18 or higher) and npm installed.

```bash
# Clone the repository
git clone <your-repository-url>
cd <repository-directory>

# Install required dependencies
npm install
```

---

## 4. How to Configure & Run the System
### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optional: If you want to enable dynamic Gemini API reasoning, supply `GEMINI_API_KEY="your_api_key_here"` in `.env`. The system also includes complete deterministic agentic reasoning and proof execution out of the box).*

### Launching the Development Server
```bash
npm run dev
```
Open your browser at: `http://localhost:3000`

---

## 5. How to Reproduce the Demonstrated Results
To verify the system against the 7 core judging rubric traps, open the web interface and click on any of the **Judge Evaluation Benchmark Suite** buttons:

| Test Case | Category | Input Question | Expected Outcome | Verification Logic |
| :--- | :--- | :--- | :--- | :--- |
| **Trap 1** | Unit Normalization | *"What was total gross volume in USD (deduping double records)?"* | **VERIFIED CALCULATION** ($17,230.60) | Deduplicates row TX-1003 and maps EUR (*1.08) and GBP (*1.26) to USD. |
| **Trap 2** | Trap Refusal | *"Why did Enterprise tier experience a 50% revenue crash in May 2024?"* | **STRICT REFUSAL** (0% Actual Churn) | Falsifies premise with proof code; refuses to invent explanations for events that never happened. |
| **Trap 3** | Contradiction Audit | *"Exactly how many units of NEO-DRIVE-2TB were delivered for order TX-1005?"* | **CONDITIONAL AUDIT** (50 vs 35 units) | Reconciles Sales (50 ordered) vs Warehouse (35 shipped), highlighting the 15-unit variance. |
| **Trap 4** | Date Disambiguation | *"Calculate total order value placed on April 5, 2024"* | **CONDITIONAL PROOF** ($1,800 vs $0) | Highlights `04/05/2024` ambiguity between US (MM/DD) and UK (DD/MM). |
| **Trap 5** | Missing Data | *"Average transaction value for Standard tier vs unassigned"* | **CONDITIONAL AUDIT** (40% Null Rate) | Flags missingness fragility and provides sample-filtered average ($753.33). |
| **Trap 6** | Unit Normalization | *"Total mass of Vancomycin HCl in stock measured in mg"* | **VERIFIED CALCULATION** (122,500 mg) | Normalizes 1.5 grams (g) to 1,500 milligrams (mg) to prevent 1,000x dosage error. |
| **Trap 7** | Trap Refusal | *"What is 30-day patient mortality rate for Vancomycin?"* | **STRICT REFUSAL** (Schema Absent) | Confirms zero clinical outcome columns exist in inventory dataset; refuses hallucination. |

### Live Re-Run Verification
1. Inspect the synthesized code under the **Independent Sandbox Verifier** panel.
2. Edit any line or alter a filter.
3. Click **"Re-Run Verifier Now"**.
4. Observe stdout traces, verified hash, and computed diff update in real time.

---

## 6. Scope Note (Deliverable #7)
- **Minimum Viable Product (Implemented)**: Full multi-table relational scanner, pre-flight trap detector (units, dates, duplicates, contradictions, nulls), adversarial refusal protocol, live in-browser code editor and sandbox re-runner, cell-level coordinate citations, and exportable markdown audit bundle.
- **Stretch Goals**: Bayesian imputation for missing categorical dimensions, cross-ledger fuzzy record deduplication with Levenshtein distance, and automated SQL-to-DataFrame compiler.

---

## 7. Submission Acknowledgement
*Submitted for the Internal Qualifier Round by the Division of Computer Science and Engineering, Karunya Institute of Technology and Sciences.*
