import React from 'react';
import { X, CheckCircle2, ShieldCheck, Award, FileCode2, Terminal, Database, BookOpen } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0417] border border-purple-800/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-purple-100 purple-glow">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/50 bg-[#07020d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-300 border border-purple-700/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white font-display">
                Karunya CSE Internal Qualifier Guide & Rubric
              </h2>
              <p className="text-xs text-purple-400">Problem HNX26PSI08: Proof-Carrying Data Analyst (Agentic GenAI)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-950 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Core Mandate Banner */}
          <div className="p-4 rounded-xl border border-purple-700/40 bg-purple-950/40 text-purple-200">
            <h3 className="font-semibold text-purple-300 flex items-center gap-2 mb-1 font-display">
              <ShieldCheck className="w-5 h-5 text-purple-400" /> The Golden Rules of HNX26PSI08
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-purple-200/90 leading-relaxed font-sans">
              <li><strong>Every number must come with working, re-runnable code.</strong> An independent verifier runs your code; if it fails or produces a different number, score = 0.</li>
              <li><strong>Refusal is mandatory when unanswerable:</strong> A confident wrong explanation scores worse than saying <em>"I can't determine this from the data"</em> with rigorous reasoning.</li>
              <li><strong>Traps strictly guarded:</strong> Units mismatch ($/€, mg/g), ambiguous dates, duplicate rows, table contradictions, missing data, and adversarial questions.</li>
            </ul>
          </div>

          {/* 8 Required Deliverables Checklist */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 font-display">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Submission Requirements (Page 3 of Booklet)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 1. Working System
                </div>
                <p className="text-xs text-purple-300/80">
                  Full dual-sandbox architecture with live execution verifier, AST inspection, and tamper-evident proof certificate hashing.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 2. Source Code & README
                </div>
                <p className="text-xs text-purple-300/80">
                  Complete repository package containing server backend, verification sandbox, and reproducible Node.js runner scripts.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 3. Data Pipeline
                </div>
                <p className="text-xs text-purple-300/80">
                  Multi-table ingestion pipeline with pre-flight schema profiling, automated trap detection, and clean relational joins.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 4. Core Model / Reasoning
                </div>
                <p className="text-xs text-purple-300/80">
                  Agentic loop that pairs adversarial presupposition filtering with self-repairing executable code synthesis and verification matching.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 5. Evidence & Explanation
                </div>
                <p className="text-xs text-purple-300/80">
                  Exact cell coordinates (table, row index, column), runtime stdout traces, and tolerance-checked numerical proof badges.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 6. Sample Input & Output
                </div>
                <p className="text-xs text-purple-300/80">
                  7 built-in benchmark test cases covering each specific trap from the Karunya problem statement booklet with 1-click execution.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 7. Scope Note
                </div>
                <p className="text-xs text-purple-300/80">
                  Clear boundaries distinguishing MVP (in-browser sandbox, pre-flight scanner, refusal logic) from stretch goals.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <div className="flex items-center gap-2 font-medium text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 8. Live Demonstration
                </div>
                <p className="text-xs text-purple-300/80">
                  Interactive UI allowing judges to edit code live, trigger adversarial questions, or simulate What-If parameter variations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-purple-900/50 bg-[#07020d]">
          <span className="text-xs text-purple-400/80">Division of CSE · Karunya Institute of Technology and Sciences</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
