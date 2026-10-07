import React from 'react';
import { BenchmarkTestCase } from '../types/analyst';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  Terminal, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';

interface QueryWorkspaceProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
  benchmarkCases: BenchmarkTestCase[];
  onSelectBenchmark: (benchCase: BenchmarkTestCase) => void;
  activeBenchmarkId?: string;
  currentQuery: string;
  setCurrentQuery: (q: string) => void;
}

export const QueryWorkspace: React.FC<QueryWorkspaceProps> = ({
  onAnalyze,
  isLoading,
  benchmarkCases,
  onSelectBenchmark,
  activeBenchmarkId,
  currentQuery,
  setCurrentQuery
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;
    onAnalyze(currentQuery);
  };

  return (
    <div className="bg-[#0b0317] border border-purple-900/50 rounded-xl p-5 space-y-4 shadow-sm purple-glow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-purple-200 tracking-wider uppercase font-display">
            Proof-Carrying Analytical Query
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <span>Dual Sandbox Engine</span>
          <span aria-hidden="true" className="text-purple-600">·</span>
          <span className="text-emerald-400 font-medium font-mono text-[11px]">Re-Run Guard Active</span>
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <textarea
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            placeholder="Type any analytical question about the loaded tables, or select a judge trap scenario below..."
            rows={3}
            className="w-full bg-[#05020a] border border-purple-900/60 rounded-xl p-3 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-purple-500 font-sans resize-none transition-colors selection:bg-purple-900/60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-purple-400/80 leading-normal">
            Every claimed number will be backed by re-runnable JavaScript. Unanswerable prompts will be refused.
          </div>

          <button
            type="submit"
            disabled={isLoading || !currentQuery.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition cursor-pointer shadow-md purple-glow-sm"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Sandbox Engine...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Agent & Prove Math</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Judge Presets */}
      <div className="pt-2 border-t border-purple-900/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-purple-300">
          <span className="font-semibold font-display">Quick Test Scenarios:</span>
          <span className="text-purple-400/70 text-[11px] font-mono">Click to load & execute</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {benchmarkCases.slice(0, 4).map((bench) => {
            const isSelected = activeBenchmarkId === bench.id;
            return (
              <button
                key={bench.id}
                onClick={() => onSelectBenchmark(bench)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-950 text-purple-200 border border-purple-600 shadow-sm'
                    : 'bg-[#06020c] text-purple-400 border border-purple-900/60 hover:text-purple-200 hover:bg-purple-950/60'
                }`}
              >
                <span>{bench.title.split(':')[1]?.trim() || bench.title}</span>
                <span className="text-[10px] text-purple-500 font-mono">({bench.expectedOutcome.split('_')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
