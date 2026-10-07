import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  AlertTriangle, 
  Play, 
  ArrowRight, 
  Zap, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';

interface IntroHeroProps {
  onQuickStart: (benchmarkId: string) => void;
  onExploreData: () => void;
}

export const IntroHero: React.FC<IntroHeroProps> = ({ onQuickStart, onExploreData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#130624] via-[#0b0314] to-[#05020a] border border-purple-900/40 purple-glow p-6 md:p-8 transition-all">
      {/* Background ambient radial gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="relative z-10 flex items-center justify-between border-b border-purple-900/40 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-600/50 flex items-center justify-center purple-glow-sm">
            <ShieldCheck className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-purple-400 font-semibold flex items-center gap-2">
              <span>Karunya Institute of Technology and Sciences</span>
              <span className="text-purple-600">/</span>
              <span className="text-purple-300">Division of CSE</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight font-display">
              Proof-Carrying Data Analyst <span className="text-purple-400 font-mono text-sm font-normal">(HNX26PSI08)</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-purple-400 hover:text-purple-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/60 transition cursor-pointer"
        >
          <span>{isCollapsed ? 'Expand Introduction' : 'Minimize'}</span>
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="relative z-10 space-y-6">
          {/* Main Elevator Pitch */}
          <div className="max-w-3xl space-y-2">
            <h2 className="text-lg md:text-xl font-bold text-purple-100 font-display">
              Zero-Trust Agentic Intelligence for Messy Relational Data
            </h2>
            <p className="text-sm text-purple-200/80 leading-relaxed font-sans">
              Unlike typical AI that hallucinates confident answers, this agent operates on a mathematical verification contract: 
              <strong className="text-white"> every number comes with working, re-runnable JavaScript</strong> validated inside an isolated execution sandbox. If a question is unanswerable or based on a false premise, the agent triggers an explicit <strong className="text-purple-300">Refusal Protocol</strong>.
            </p>
          </div>

          {/* 3 Core Interactive Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#140826]/80 border border-purple-800/40 space-y-2 hover:border-purple-600/60 transition group">
              <div className="flex items-center gap-2 text-purple-400">
                <Terminal className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-purple-200 font-display">
                  1. Re-Runnable Math Proofs
                </h3>
              </div>
              <p className="text-xs text-purple-300/70 leading-relaxed">
                Every calculation produces pure, standalone code. An independent verifier runs the script to guarantee exact numerical reproduction.
              </p>
              <button
                onClick={() => onQuickStart('bench-1-currency-trap')}
                className="text-[11px] text-purple-400 hover:text-purple-200 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Test Currency & Deduping</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#140826]/80 border border-purple-800/40 space-y-2 hover:border-purple-600/60 transition group">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-300 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-rose-200 font-display">
                  2. Strict Refusal Protocol
                </h3>
              </div>
              <p className="text-xs text-purple-300/70 leading-relaxed">
                When faced with false presuppositions ("Why did tier X churn 50%?") or missing data, the agent rejects false premises with evidence.
              </p>
              <button
                onClick={() => onQuickStart('bench-2-false-presupposition')}
                className="text-[11px] text-rose-400 hover:text-rose-200 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Test Adversarial False Premise</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#140826]/80 border border-purple-800/40 space-y-2 hover:border-purple-600/60 transition group">
              <div className="flex items-center gap-2 text-amber-400">
                <Layers className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-200 font-display">
                  3. Ground-Truth Trap Radar
                </h3>
              </div>
              <p className="text-xs text-purple-300/70 leading-relaxed">
                Continuous pre-flight scanner guards against mixed units ($/€, mg/g), ambiguous dates, duplicate rows, and table contradictions.
              </p>
              <button
                onClick={onExploreData}
                className="text-[11px] text-amber-400 hover:text-amber-200 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Inspect Messy Data Tables</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
