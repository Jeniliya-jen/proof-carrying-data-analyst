import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  AlertTriangle, 
  Play, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Database, 
  Cpu, 
  Lock,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';

interface IntroPageProps {
  onEnterWorkbench: (initialTab?: 'studio' | 'explorer' | 'benchmarks' | 'sandbox', benchmarkId?: string) => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnterWorkbench }) => {
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);
  const [activeTrapTab, setActiveTrapTab] = useState<number>(0);

  const terminalLogs = [
    { text: "INITIALIZING ZERO-TRUST AGENTIC DATA ANALYST...", tag: "SYS", color: "text-purple-400" },
    { text: "Ingesting relational tables: sales_orders (10 rows), warehouse_dispatch (8 rows), forex_rates (3 rows)...", tag: "IO", color: "text-purple-300" },
    { text: "AUDIT ALERT: Row 2 contains 450 EUR & Row 8 contains 1450 GBP. Naive sum invalid!", tag: "TRAP", color: "text-amber-400" },
    { text: "AUDIT ALERT: Duplicate primary key TX-1003 detected at row index 3. Webhook collision.", tag: "TRAP", color: "text-rose-400" },
    { text: "AUDIT ALERT: Order TX-1005 shows 50 units ordered, but Warehouse Dispatch shows 35 shipped.", tag: "TRAP", color: "text-rose-400" },
    { text: "ADVERSARIAL QUERY DETECTED: 'Why did Enterprise churn 50% in May?'", tag: "PROMPT", color: "text-fuchsia-300" },
    { text: "DEFENSE PROTOCOL: CRM scan reveals 0.0% Enterprise churn. Hallucination blocked! Refusal issued.", tag: "REFUSAL", color: "text-rose-400" },
    { text: "SYNTHESIZING VERIFICATION CODE IN PURE JAVASCRIPT SANDBOX...", tag: "EXEC", color: "text-purple-300" },
    { text: "PROOF CERTIFICATE EMITTED: 0x9f4a182c · ALL NUMBERS 100% MATCHED INDEPENDENTLY", tag: "VERIFIED", color: "text-emerald-400" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalLineIndex(prev => (prev < terminalLogs.length - 1 ? prev + 1 : 0));
    }, 1800);
    return () => clearInterval(timer);
  }, [terminalLogs.length]);

  const trapShowcases = [
    {
      title: "Currency & Duplicate Trap",
      subtitle: "Multi-Currency Mixing + Webhook Duplicates",
      problem: "Transactions in USD, EUR, GBP summed directly without conversion; order TX-1003 duplicated.",
      solution: "Agent extracts forex_rates, deduplicates by order_id, and proves exact sum = $17,230.60 USD.",
      badge: "Verified Proof",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-700",
      targetBenchmark: "bench-1-currency-trap"
    },
    {
      title: "Adversarial False Presupposition",
      subtitle: "The Trick Question Test",
      problem: "'Why did Enterprise tier suffer a 50% revenue crash in May 2024?'",
      solution: "Ground truth shows 0.0% churn. Confident wrong answer is penalized. Agent issues formal refusal with audit code.",
      badge: "Strict Refusal",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-700",
      targetBenchmark: "bench-2-false-presupposition"
    },
    {
      title: "Cross-Table Contradiction",
      subtitle: "Sales Ledger vs Warehouse Fulfillment",
      problem: "Sales records 50 units ordered for TX-1005; Warehouse records 35 shipped (Short-shipped 15).",
      solution: "Refuses single-source answer; outputs variance audit showing both perspectives.",
      badge: "Conditional Audit",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-700",
      targetBenchmark: "bench-3-cross-table-contradiction"
    },
    {
      title: "Clinical Dosage Scale Trap",
      subtitle: "Milligrams (mg) vs Grams (g)",
      problem: "Batch B-7703 logged in grams (1.5g) while others in mg (500mg). Naive sum = 55,067.5 (fatal 1000x error).",
      solution: "SI unit standardization converts 1.5g to 1,500mg, computing true verified mass of 122,500 mg.",
      badge: "Clinical Normalization",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-700",
      targetBenchmark: "bench-6-pharma-unit-mg-g"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030107] text-purple-100 flex flex-col justify-between selection:bg-purple-900/60 overflow-x-hidden relative font-sans">
      {/* Dynamic Animated Ambient Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-fuchsia-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-800/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Academic Qualifier Header */}
      <header className="relative z-10 border-b border-purple-900/40 bg-[#06020c]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-600/60 flex items-center justify-center purple-glow-sm">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-wider text-purple-400 font-semibold uppercase">
                Karunya Institute of Technology and Sciences
              </div>
              <div className="text-xs text-purple-300/80">
                Division of Computer Science and Engineering · Qualifier HNX26PSI08
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/70 border border-purple-800/60 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Zero-Trust Guard: ACTIVE</span>
            </div>

            <button
              onClick={() => onEnterWorkbench('studio')}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-2 purple-glow shadow-lg"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center space-y-12">
        {/* Animated Badge & Hero Titles */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-600/60 text-purple-200 text-xs font-mono font-medium shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Agentic GenAI · Data Analytics · Code Verification</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-display leading-[1.08]">
            Proof-Carrying <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-200 bg-clip-text text-transparent">
              Data Analyst
            </span>
          </h1>

          <p className="text-base sm:text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed font-sans">
            An AI agent engineered for messy real-world data across multiple tables. 
            <strong className="text-white"> Every number comes with re-runnable verification code</strong>, and adversarial questions are met with a strict refusal protocol.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onEnterWorkbench('studio')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm tracking-wide transition-all cursor-pointer flex items-center gap-3 purple-glow shadow-2xl hover:scale-105 transform"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>ENTER ANALYST WORKBENCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterWorkbench('benchmarks')}
              className="px-6 py-3.5 rounded-2xl bg-[#140826] hover:bg-[#1f0c3a] text-purple-200 font-semibold text-sm border border-purple-700/60 transition cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-fuchsia-400" />
              <span>Judge Benchmark Suite (7 Traps)</span>
            </button>

            <button
              onClick={() => onEnterWorkbench('explorer')}
              className="px-6 py-3.5 rounded-2xl bg-[#140826] hover:bg-[#1f0c3a] text-purple-200 font-semibold text-sm border border-purple-700/60 transition cursor-pointer flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-purple-400" />
              <span>Explore Messy Tables</span>
            </button>
          </div>
        </div>

        {/* Live Animated Agent Scanner Console */}
        <div className="max-w-4xl mx-auto w-full bg-[#07020e] border border-purple-800/60 rounded-2xl overflow-hidden shadow-2xl purple-glow">
          <div className="px-4 py-3 bg-[#0d041c] border-b border-purple-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-purple-300 font-mono font-medium ml-2">agent_audit_runtime.ts</span>
            </div>

            <span className="text-purple-400 font-mono text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Execution Loop
            </span>
          </div>

          <div className="p-5 font-mono text-xs space-y-2 min-h-[170px] bg-[#05010b]">
            {terminalLogs.slice(0, terminalLineIndex + 1).map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-purple-600 select-none text-[10px] w-5">{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="px-1.5 py-0.2 rounded bg-purple-950 text-[9px] font-bold border border-purple-800 text-purple-300">
                  {log.tag}
                </span>
                <span className={log.color}>{log.text}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 text-purple-500 pt-1">
              <span className="animate-pulse">▍</span>
            </div>
          </div>
        </div>

        {/* Interactive Trap Matrix Showcase */}
        <div className="space-y-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between text-xs text-purple-300 border-b border-purple-900/40 pb-2">
            <span className="font-bold uppercase tracking-wider font-display">
              The 4 Core Evaluation Challenges from Booklet
            </span>
            <span className="font-mono text-purple-400">Click a card to test directly in Workbench</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {trapShowcases.map((trap, idx) => {
              const isHovered = activeTrapTab === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveTrapTab(idx)}
                  onClick={() => onEnterWorkbench('studio', trap.targetBenchmark)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                    isHovered
                      ? 'bg-[#180933] border-purple-500 purple-glow-sm scale-[1.02]'
                      : 'bg-[#0f041e] border-purple-900/60 hover:border-purple-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${trap.badgeColor}`}>
                        {trap.badge}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-purple-200 font-display">
                      {trap.title}
                    </h3>
                    <p className="text-[11px] text-rose-300/90 font-mono">
                      Trap: {trap.problem}
                    </p>
                    <p className="text-[11px] text-purple-300/80 leading-relaxed font-sans">
                      {trap.solution}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-900/40 text-[10px] text-purple-400 font-mono flex items-center justify-between">
                    <span>1-Click Test</span>
                    <span className="font-bold text-fuchsia-400">&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-900/40 bg-[#06020c] py-4 text-xs text-purple-400/80 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Division of Computer Science and Engineering · Karunya Institute of Technology and Sciences</span>
          <span>Internal Qualifier Problem Statement HNX26PSI08 · Generative AI & Agentic ML</span>
        </div>
      </footer>
    </div>
  );
};
