import React, { useState } from 'react';
import { Dataset, VerificationResult, ProofNumber } from '../types/analyst';
import { runSandboxedVerification } from '../utils/codeSandbox';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  FileText 
} from 'lucide-react';

interface CodeSandboxViewerProps {
  initialCode: string;
  dataset: Dataset;
  proofNumbers: ProofNumber[];
  verificationResult: VerificationResult;
  onCodeUpdated?: (newCode: string) => void;
  onExportAudit?: () => void;
}

export const CodeSandboxViewer: React.FC<CodeSandboxViewerProps> = ({
  initialCode,
  dataset,
  proofNumbers,
  verificationResult: initialVerification,
  onExportAudit
}) => {
  const [code, setCode] = useState(initialCode);
  const [activeVerification, setActiveVerification] = useState<VerificationResult>(initialVerification);
  const [isReRunning, setIsReRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'logs' | 'outputs'>('code');

  React.useEffect(() => {
    setCode(initialCode);
    setActiveVerification(initialVerification);
  }, [initialCode, initialVerification]);

  const handleReRun = () => {
    setIsReRunning(true);
    setTimeout(() => {
      const res = runSandboxedVerification(code, dataset, proofNumbers);
      setActiveVerification(res);
      setIsReRunning(false);
    }, 150);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0317] border border-purple-900/50 rounded-xl overflow-hidden shadow-sm flex flex-col space-y-0 purple-glow-sm">
      {/* Top Header */}
      <div className="p-4 bg-[#07020d] border-b border-purple-900/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-purple-400" />
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase font-display">
              Independent Sandbox Verifier
            </h2>
            <p className="text-[11px] text-purple-400/80">
              Evaluator Test Engine: Edit & re-run verification code to test math determinism
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs flex items-center gap-1.5 transition border border-purple-800/60 cursor-pointer"
            title="Copy script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleReRun}
            disabled={isReRunning}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isReRunning ? 'animate-spin' : ''}`} />
            <span>{isReRunning ? 'Re-Running...' : 'Re-Run Verifier Now'}</span>
          </button>
        </div>
      </div>

      {/* Proof Certificate & Verification Status Strip */}
      <div className="px-4 py-2.5 bg-[#05020a] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Proof Certificate:</span>
          <span className="font-mono text-emerald-300 font-semibold">{activeVerification.hash}</span>
        </div>

        <div className="flex items-center gap-4 text-purple-400 text-xs">
          <span>Runtime: <strong className="text-purple-200 font-mono tabular-nums">{activeVerification.runtimeMs}ms</strong></span>
          <span aria-hidden="true" className="text-purple-700">·</span>
          <span className={`font-semibold ${
            activeVerification.allNumbersMatch ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {activeVerification.allNumbersMatch ? '100% Deterministic Match' : 'Mismatch Flagged'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center px-4 pt-2 border-b border-purple-900/40 bg-[#07020d] gap-1">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'code'
              ? 'bg-[#0b0317] text-white border-t border-x border-purple-700'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Verification Code (Editable)</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#0b0317] text-white border-t border-x border-purple-700'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live stdout Logs ({activeVerification.stdout.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outputs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'outputs'
              ? 'bg-[#0b0317] text-white border-t border-x border-purple-700'
              : 'text-purple-400 hover:text-purple-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Computed Output Object</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 min-h-[220px]">
        {activeTab === 'code' && (
          <div className="space-y-2">
            <div className="text-[11px] text-purple-400/80 flex items-center justify-between">
              <span>Environment: Pure JavaScript sandbox with in-scope <code>dataset</code> and tables</span>
              <span className="text-purple-500">Edit any line to test math resilience</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              rows={11}
              className="w-full bg-[#05020a] border border-purple-900/60 rounded-lg p-3 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none focus:border-purple-500 resize-y selection:bg-purple-900/50"
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-[#05020a] border border-purple-900/60 rounded-lg p-3.5 font-mono text-xs text-purple-200 min-h-[200px] max-h-[300px] overflow-auto space-y-1">
            <div className="text-[10px] text-purple-500 pb-1 border-b border-purple-900/40 mb-2">
              Standard Output Stream (console.log traces from runtime)
            </div>
            {activeVerification.stdout.length === 0 ? (
              <div className="text-purple-500 italic py-2">No stdout printed during execution.</div>
            ) : (
              activeVerification.stdout.map((line, idx) => (
                <div key={idx} className="leading-relaxed hover:bg-purple-950/40 px-1 rounded flex gap-2">
                  <span className="text-purple-600 select-none text-[10px]">[{idx + 1}]</span>
                  <span>{line}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'outputs' && (
          <div className="bg-[#05020a] border border-purple-900/60 rounded-lg p-3.5 font-mono text-xs text-fuchsia-300 min-h-[200px] max-h-[300px] overflow-auto">
            <div className="text-[10px] text-purple-500 pb-1 border-b border-purple-900/40 mb-2">
              Returned JSON Object
            </div>
            <pre>{JSON.stringify(activeVerification.computedOutputs, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Claimed vs Verified Audit Table */}
      <div className="p-4 bg-[#07020d] border-t border-purple-900/50 space-y-3">
        <div className="text-xs font-semibold text-purple-200 flex items-center justify-between font-display">
          <span>Judge Audit: Claimed Numbers vs Sandbox Output</span>
          <span className="text-[11px] text-emerald-400 font-mono">Independent Re-run Verification</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-purple-900/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#05020a] text-purple-400 border-b border-purple-900/50">
              <tr>
                <th className="py-2 px-3">Metric Claim</th>
                <th className="py-2 px-3">Code Variable</th>
                <th className="py-2 px-3">Expected Claim</th>
                <th className="py-2 px-3">Re-Run Verified</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950 font-mono text-[11px] text-purple-200 tabular-nums">
              {activeVerification.proofNumbers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-purple-500 italic">
                    No individual numeric claims flagged for this answer
                  </td>
                </tr>
              ) : (
                activeVerification.proofNumbers.map((p, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3 font-sans text-xs text-white">{p.label}</td>
                    <td className="py-2 px-3 text-purple-400">{p.codeVariable}</td>
                    <td className="py-2 px-3">{String(p.value)} {p.unit || ''}</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">
                      {String(p.computedValue)} {p.unit || ''}
                    </td>
                    <td className="py-2 px-3">
                      {p.matchStatus === 'verified' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> EXACT MATCH
                        </span>
                      ) : p.matchStatus === 'refused' ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> REFUSED (0%)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> MISMATCH
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {onExportAudit && (
          <div className="flex justify-end pt-1">
            <button
              onClick={onExportAudit}
              className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Submission Packet (README.md & Proof Pack)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
