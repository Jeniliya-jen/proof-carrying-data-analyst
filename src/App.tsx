import React, { useState, useEffect } from 'react';
import { SAMPLE_DATASETS, BENCHMARK_TEST_CASES } from './data/sampleDatasets';
import { Dataset, AnalysisResponse, BenchmarkTestCase, DataTrap } from './types/analyst';
import { scanDatasetForTraps } from './utils/trapDetector';
import { processQueryWithAgent } from './utils/agentEngine';
import { IntroPage } from './components/IntroPage';
import { RubricModal } from './components/RubricModal';
import { DatasetInspector } from './components/DatasetInspector';
import { QueryWorkspace } from './components/QueryWorkspace';
import { ProofAnswerCard } from './components/ProofAnswerCard';
import { CodeSandboxViewer } from './components/CodeSandboxViewer';
import { BenchmarkLab } from './components/BenchmarkLab';
import { 
  ShieldCheck, 
  BookOpen, 
  Download, 
  Terminal, 
  Database, 
  Cpu, 
  Layers, 
  Flame, 
  FileSpreadsheet, 
  ArrowLeft,
  Activity, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'workbench'>('intro');
  const [selectedDataset, setSelectedDataset] = useState<Dataset>(SAMPLE_DATASETS[0]);
  const [detectedTraps, setDetectedTraps] = useState<DataTrap[]>([]);
  const [currentQuery, setCurrentQuery] = useState(
    'What was the total gross transaction volume in sales_orders converted to USD (including de-duplicating any double records)?'
  );
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string>('bench-1-currency-trap');
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'explorer' | 'benchmarks' | 'sandbox'>('studio');

  // Re-scan traps when dataset changes
  useEffect(() => {
    const traps = scanDatasetForTraps(selectedDataset);
    setDetectedTraps(traps);
  }, [selectedDataset]);

  // Initial analysis run
  useEffect(() => {
    handleRunQuery(currentQuery, selectedDataset);
  }, []);

  const handleRunQuery = async (queryToRun: string, datasetToUse: Dataset = selectedDataset) => {
    setIsLoading(true);
    try {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryToRun, dataset: datasetToUse })
        });
        if (response.ok) {
          const data = await response.json();
          setAnalysisResult(data);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        // Fall back directly to client agent engine
      }

      const result = await processQueryWithAgent(queryToRun, datasetToUse);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Failed to process query:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBenchmark = (bench: BenchmarkTestCase) => {
    setActiveBenchmarkId(bench.id);
    setCurrentQuery(bench.question);

    const targetDataset = SAMPLE_DATASETS.find(d => d.id === bench.datasetId) || selectedDataset;
    if (targetDataset.id !== selectedDataset.id) {
      setSelectedDataset(targetDataset);
    }

    handleRunQuery(bench.question, targetDataset);
    setActiveTab('studio');
    setCurrentView('workbench');
  };

  const handleEnterWorkbench = (
    tab: 'studio' | 'explorer' | 'benchmarks' | 'sandbox' = 'studio',
    benchmarkId?: string
  ) => {
    if (benchmarkId) {
      const bench = BENCHMARK_TEST_CASES.find(b => b.id === benchmarkId);
      if (bench) {
        handleSelectBenchmark(bench);
        return;
      }
    }
    setActiveTab(tab);
    setCurrentView('workbench');
  };

  const handleExportAudit = () => {
    if (!analysisResult) return;
    
    const content = `# Proof-Carrying Data Analyst (HNX26PSI08)
Presented by Division of Computer Science and Engineering
Karunya Institute of Technology and Sciences

## 1. Project Overview & Working System
- Problem: HNX26PSI08: Proof-Carrying Data Analyst (Agentic GenAI)
- Golden Rule: Every numeric claim is backed by executable, re-runnable verification code.
- Verification Hash: ${analysisResult.verification.hash}
- Verifier Runtime: ${analysisResult.verification.runtimeMs} ms
- All Numbers Match: ${analysisResult.verification.allNumbersMatch}

## 2. Query Analyzed
"${analysisResult.query}"

### Status: ${analysisResult.status.toUpperCase()}
**Headline:** ${analysisResult.answerHeadline}

**Explanation:**
${analysisResult.answerExplanation}

${analysisResult.refusalReason ? `### Refusal Rationale:\n${analysisResult.refusalReason}\n` : ''}

## 3. Certified Numerical Claims
${analysisResult.proofNumbers.map(n => `- **${n.label}**: ${n.value} ${n.unit || ''} (Variable: \`${n.codeVariable}\`, Match: ${n.matchStatus})`).join('\n')}

## 4. Re-runnable Verification Code (JavaScript Sandbox)
\`\`\`javascript
${analysisResult.executableCode}
\`\`\`

## 5. Verified Execution Output
\`\`\`json
${JSON.stringify(analysisResult.verification.computedOutputs, null, 2)}
\`\`\`

## 6. How to Reproduce
1. In a Node.js or browser sandbox, load the tables for dataset "${selectedDataset.title}".
2. Execute the script above.
3. Observe stdout and the return value matching certified figures.
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HNX26PSI08-Proof-Audit-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // If in Intro View, show the creative full-screen intro
  if (currentView === 'intro') {
    return <IntroPage onEnterWorkbench={handleEnterWorkbench} />;
  }

  return (
    <div className="min-h-screen bg-[#030107] text-purple-100 flex flex-col font-sans selection:bg-purple-900/60">
      {/* Top Bar: Brand, Navigation Tabs, Actions */}
      <header className="border-b border-purple-900/40 bg-[#080210]/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          {/* Zone 1: Wordmark & Back to Intro button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('intro')}
              className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800/60 transition cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Return to Introduction"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Intro</span>
            </button>

            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <span>Proof-Carrying Data Analyst</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  HNX26PSI08
                </span>
              </div>
              <p className="text-[11px] text-purple-400 font-sans">
                Division of CSE · Karunya Institute of Technology and Sciences
              </p>
            </div>
          </div>

          {/* Zone 2: Clean Text Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#05020a] p-1 rounded-xl border border-purple-900/60">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-purple-950 text-white border border-purple-700/70 shadow-sm'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              Analyst Studio
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-purple-950 text-white border border-purple-700/70 shadow-sm'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
              <span>Data Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'benchmarks'
                  ? 'bg-purple-950 text-white border border-purple-700/70 shadow-sm'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Benchmark Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sandbox'
                  ? 'bg-purple-950 text-white border border-purple-700/70 shadow-sm'
                  : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sandbox Verifier</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsRubricOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition border border-purple-800/60 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-300" />
              <span>Rubric Guide</span>
            </button>

            <button
              onClick={handleExportAudit}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-600 hover:to-fuchsia-600 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md purple-glow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Proof Packet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Context Ticker Bar */}
      <div className="border-b border-purple-900/40 bg-[#06020c] px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-purple-300/80">
          <div className="flex items-center gap-2">
            <span className="text-purple-500">Active Dataset:</span>
            <span className="text-white font-medium">{selectedDataset.title}</span>
            <span aria-hidden="true" className="text-purple-800">/</span>
            <span>{selectedDataset.tables.length} Tables In-Memory</span>
            <span aria-hidden="true" className="text-purple-800">/</span>
            <span className="text-amber-400">{detectedTraps.length} Ground-Truth Traps Guarded</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Dual Sandbox: <strong className="text-emerald-400">Active</strong></span>
            <span aria-hidden="true" className="text-purple-800">·</span>
            <span>Math Strictness: <strong className="text-fuchsia-400">100%</strong></span>
            {analysisResult && (
              <>
                <span aria-hidden="true" className="text-purple-800">·</span>
                <span>Hash: <strong className="text-purple-300">{analysisResult.verification.hash}</strong></span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* TAB 1: STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <QueryWorkspace
              onAnalyze={(q) => handleRunQuery(q)}
              isLoading={isLoading}
              benchmarkCases={BENCHMARK_TEST_CASES}
              onSelectBenchmark={handleSelectBenchmark}
              activeBenchmarkId={activeBenchmarkId}
              currentQuery={currentQuery}
              setCurrentQuery={setCurrentQuery}
            />

            {analysisResult && (
              <ProofAnswerCard response={analysisResult} dataset={selectedDataset} />
            )}

            {analysisResult && (
              <CodeSandboxViewer
                initialCode={analysisResult.executableCode}
                dataset={selectedDataset}
                proofNumbers={analysisResult.proofNumbers}
                verificationResult={analysisResult.verification}
                onExportAudit={handleExportAudit}
              />
            )}
          </div>
        )}

        {/* TAB 2: DATA EXPLORER */}
        {activeTab === 'explorer' && (
          <div className="space-y-4">
            <DatasetInspector
              datasets={SAMPLE_DATASETS}
              selectedDataset={selectedDataset}
              onSelectDataset={(ds) => {
                setSelectedDataset(ds);
                const matchedBench = BENCHMARK_TEST_CASES.find(b => b.datasetId === ds.id);
                if (matchedBench) {
                  setActiveBenchmarkId(matchedBench.id);
                  setCurrentQuery(matchedBench.question);
                  handleRunQuery(matchedBench.question, ds);
                }
              }}
              detectedTraps={detectedTraps}
              fullPageView={true}
            />
          </div>
        )}

        {/* TAB 3: BENCHMARK LAB */}
        {activeTab === 'benchmarks' && (
          <BenchmarkLab
            benchmarks={BENCHMARK_TEST_CASES}
            onSelectBenchmark={handleSelectBenchmark}
            activeBenchmarkId={activeBenchmarkId}
          />
        )}

        {/* TAB 4: SANDBOX VERIFIER */}
        {activeTab === 'sandbox' && (
          <div className="space-y-4">
            {analysisResult ? (
              <CodeSandboxViewer
                initialCode={analysisResult.executableCode}
                dataset={selectedDataset}
                proofNumbers={analysisResult.proofNumbers}
                verificationResult={analysisResult.verification}
                onExportAudit={handleExportAudit}
              />
            ) : (
              <div className="p-8 text-center text-purple-400 bg-[#0b0317] border border-purple-900/50 rounded-xl">
                Run a query in the Analyst Studio first to synthesize verification code.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/40 bg-[#06020c] py-4 text-xs text-purple-400/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Karunya Institute of Technology and Sciences · Division of Computer Science and Engineering</span>
          <span>Internal Qualifier Round · Problem Statement HNX26PSI08</span>
        </div>
      </footer>

      {/* Rubric Guide Modal */}
      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
      />
    </div>
  );
}
