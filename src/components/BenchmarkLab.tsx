import React from 'react';
import { BenchmarkTestCase } from '../types/analyst';
import { 
  Flame, 
  Play, 
  ShieldCheck, 
  AlertOctagon, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen 
} from 'lucide-react';

interface BenchmarkLabProps {
  benchmarks: BenchmarkTestCase[];
  onSelectBenchmark: (bench: BenchmarkTestCase) => void;
  activeBenchmarkId?: string;
}

export const BenchmarkLab: React.FC<BenchmarkLabProps> = ({
  benchmarks,
  onSelectBenchmark,
  activeBenchmarkId
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#140826] to-[#0a0314] border border-purple-800/50 space-y-2 purple-glow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-950 text-fuchsia-400 border border-purple-700/60">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight font-display">
                Evaluation Benchmark Suite & Adversarial Test Harness
              </h2>
              <p className="text-xs text-purple-400 font-sans">
                Karunya CSE Problem Statement HNX26PSI08 — Automated Trap Verification Matrix
              </p>
            </div>
          </div>
          <span className="text-xs text-purple-300 font-mono bg-purple-950 px-2.5 py-1 rounded-md border border-purple-800">
            {benchmarks.length} Standardized Scenarios
          </span>
        </div>

        <p className="text-xs text-purple-200/80 leading-relaxed pt-1 font-sans">
          Each benchmark below tests a specific trap described in the competition booklet. Evaluators can run any scenario to inspect the agentic reasoning trace, verified re-runnable code, or formal refusal protocol.
        </p>
      </div>

      {/* Grid of Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benchmarks.map((bench) => {
          const isSelected = bench.id === activeBenchmarkId;
          const isRefusal = bench.expectedOutcome === 'REFUSAL';
          const isConditional = bench.expectedOutcome === 'CONDITIONAL_ANALYSIS';

          return (
            <div
              key={bench.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#150829] border-purple-500 shadow-lg purple-glow-sm'
                  : 'bg-[#0d041a] border-purple-900/50 hover:border-purple-700/80 hover:bg-[#120624]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-fuchsia-400 font-semibold uppercase block">
                      {bench.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5 font-display">
                      {bench.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider flex-shrink-0 ${
                      isRefusal
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isConditional
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {bench.expectedOutcome.replace('_', ' ')}
                  </span>
                </div>

                {/* Prompt Question */}
                <div className="p-3.5 rounded-xl bg-[#05020a] border border-purple-900/60 text-xs text-purple-100 font-medium italic">
                  "{bench.question}"
                </div>

                {/* Trap Breakdown */}
                <div className="space-y-1.5 text-xs text-purple-300/80 font-sans">
                  <div>
                    <strong className="text-white font-semibold">Trap Mechanics: </strong>
                    {bench.explanation}
                  </div>
                  <div>
                    <strong className="text-emerald-400 font-semibold">Judging Rubric Rule: </strong>
                    <span className="text-purple-200">{bench.rubricHint}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between">
                <span className="text-[11px] text-purple-500 font-mono">
                  Target: {bench.datasetId}
                </span>

                <button
                  onClick={() => onSelectBenchmark(bench)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm purple-glow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Benchmark</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
