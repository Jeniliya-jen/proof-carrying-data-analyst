import React from 'react';
import { AnalysisResponse, Dataset, ProofNumber, Citation } from '../types/analyst';
import { DataVisualizer } from './DataVisualizer';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  BookOpen, 
  FileCode2, 
  ArrowRight, 
  ListChecks, 
  Layers, 
  Info 
} from 'lucide-react';

interface ProofAnswerCardProps {
  response: AnalysisResponse;
  dataset: Dataset;
}

export const ProofAnswerCard: React.FC<ProofAnswerCardProps> = ({ response, dataset }) => {
  const isProven = response.status === 'proven';
  const isRefused = response.status === 'refused';
  const isConditional = response.status === 'conditional_proof';

  return (
    <div className="bg-[#0b0317] border border-purple-900/50 rounded-xl overflow-hidden shadow-sm space-y-5 p-5 purple-glow-sm">
      {/* Top Banner Status */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          isProven
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            : isRefused
            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
        }`}
      >
        <div className="p-2 rounded-lg bg-black/50 flex-shrink-0 mt-0.5 border border-purple-900/30">
          {isProven ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : isRefused ? (
            <AlertOctagon className="w-5 h-5 text-rose-400" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider font-display">
              {isProven
                ? 'Mathematically Verified Proof'
                : isRefused
                ? 'Strict Refusal Protocol Triggered'
                : 'Conditional Discrepancy Audit'}
            </span>
            <span className="font-mono text-purple-400">
              Confidence: {Math.round(response.modelConfidenceScore * 100)}%
            </span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug font-display">
            {response.answerHeadline}
          </h3>
          <p className="text-xs text-purple-200/90 leading-relaxed pt-0.5 font-sans">
            {response.answerExplanation}
          </p>
        </div>
      </div>

      {/* Refusal Specific Reason (if applicable) */}
      {isRefused && response.refusalReason && (
        <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 space-y-1">
          <div className="font-semibold text-rose-300 flex items-center gap-1.5 font-display">
            <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>Formal Refusal Rationale (Booklet Rule: Know When to Say No)</span>
          </div>
          <p className="text-rose-200/90 leading-relaxed pl-5 font-sans">
            {response.refusalReason}
          </p>
          <div className="text-[11px] text-rose-400/80 italic pl-5 pt-0.5">
            "A confident wrong answer is penalized worse than saying 'I can't determine this from the data.' Know when to say no."
          </div>
        </div>
      )}

      {/* Certified Proof Numbers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200 tracking-wider uppercase font-display">
            <Hash className="w-4 h-4 text-purple-400" />
            <span>Certified Proof Numbers (Re-Run Matched)</span>
          </div>
          <span className="text-[11px] text-purple-400 font-mono">
            {response.proofNumbers.length} numerical assertions bound
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {response.proofNumbers.map((num, idx) => {
            const isMatch = num.matchStatus === 'verified';
            const isRefusedNum = num.matchStatus === 'refused';

            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#05020a] border border-purple-900/60 flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-[11px] text-purple-400/80 block truncate">
                    {num.label}
                  </span>
                  <div className="text-lg font-bold text-white font-mono tabular-nums flex items-baseline gap-1 mt-0.5">
                    <span>
                      {typeof num.value === 'number'
                        ? num.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                        : num.value}
                    </span>
                    {num.unit && <span className="text-xs text-purple-400 font-sans">{num.unit}</span>}
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-purple-400 text-[10px]">
                    var: {num.codeVariable}
                  </span>
                  <span
                    className={`font-semibold flex items-center gap-1 text-[11px] ${
                      isMatch
                        ? 'text-emerald-400'
                        : isRefusedNum
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {isMatch ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Code Verified</span>
                      </>
                    ) : isRefusedNum ? (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Refused Premise</span>
                      </>
                    ) : (
                      <span>Tolerance Check</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Functionality Visualizer Component */}
      <DataVisualizer response={response} dataset={dataset} />

      {/* Intermediate Agent Reasoning Trace */}
      {response.intermediateSteps && response.intermediateSteps.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-purple-900/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 tracking-wider uppercase font-display">
            <ListChecks className="w-4 h-4 text-purple-400" />
            <span>Agentic Execution Pipeline & Reasoning Trace</span>
          </div>

          <div className="space-y-2">
            {response.intermediateSteps.map((step) => (
              <div
                key={step.step}
                className="p-3 rounded-lg bg-[#05020a] border border-purple-900/50 flex items-start gap-3 text-xs"
              >
                <div className="w-5 h-5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 font-mono">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white font-display">{step.title}</div>
                  <div className="text-purple-300/80 text-xs mt-0.5 leading-relaxed font-sans">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Citations & Coordinates */}
      {response.citations && response.citations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-purple-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 tracking-wider uppercase font-display">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Evidence Coordinates & Data Citations</span>
            </div>
            <span className="text-[11px] text-purple-500 font-mono">Booklet Deliverable #5</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-purple-900/50">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#05020a] text-purple-400 border-b border-purple-900/50">
                <tr>
                  <th className="py-2.5 px-3">Table</th>
                  <th className="py-2.5 px-3">Row Index</th>
                  <th className="py-2.5 px-3">Column</th>
                  <th className="py-2.5 px-3">Raw Value</th>
                  <th className="py-2.5 px-3">Context Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950 font-mono text-[11px] text-purple-200 tabular-nums">
                {response.citations.map((cite, i) => (
                  <tr key={i} className="hover:bg-purple-950/40">
                    <td className="py-2 px-3 text-purple-300 font-semibold">{cite.tableName}</td>
                    <td className="py-2 px-3 text-purple-400">Row {cite.rowIndex + 1}</td>
                    <td className="py-2 px-3 text-purple-300">{cite.column}</td>
                    <td className="py-2 px-3 text-emerald-400">{String(cite.value)}</td>
                    <td className="py-2 px-3 text-purple-300/80 font-sans text-xs">{cite.context || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scope Note (Booklet Deliverable #7) */}
      <div className="p-3.5 rounded-lg bg-[#05020a] border border-purple-900/50 flex items-start gap-2.5 text-xs text-purple-300/80 font-sans">
        <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white font-display">
            Scope Note (Minimum Viable Solution vs Stretch Goals)
          </div>
          <div>
            <strong className="text-purple-300 font-normal">MVP Implemented: </strong>
            {response.scopeNote.mvpImplemented}
          </div>
          {response.scopeNote.stretchGoals && (
            <div>
              <strong className="text-purple-300 font-normal">Stretch Goals: </strong>
              {response.scopeNote.stretchGoals.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
