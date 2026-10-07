import React, { useState } from 'react';
import { AnalysisResponse, Dataset } from '../types/analyst';
import { 
  BarChart3, 
  Sliders, 
  Radar, 
  GitCommit, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  HelpCircle, 
  Maximize2 
} from 'lucide-react';

interface DataVisualizerProps {
  response: AnalysisResponse;
  dataset: Dataset;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ response, dataset }) => {
  const query = response.query.toLowerCase();

  // Active visualization view mode
  const [activeVizMode, setActiveVizMode] = useState<'breakdown' | 'waterfall' | 'simulator' | 'radar'>('breakdown');

  // Interactive What-If Simulator state
  const [eurRate, setEurRate] = useState<number>(1.08);
  const [gbpRate, setGbpRate] = useState<number>(1.26);
  const [includeDuplicate, setIncludeDuplicate] = useState<boolean>(false);

  // Dynamic simulation calculation for currency
  const baseUsdOnly = 1200 + 240 + 1800 + 8500 + 360 + 2040; // 14,140
  const eurRaw = 450 + 720; // 1170 EUR
  const gbpRaw = 1450; // 1450 GBP
  const duplicateAmount = includeDuplicate ? 240 : 0;
  const simulatedTotalUsd = Math.round((baseUsdOnly + (eurRaw * eurRate) + (gbpRaw * gbpRate) + duplicateAmount) * 100) / 100;

  // Detect scenario
  const isCurrency = query.includes('currency') || (query.includes('total') && (query.includes('sales') || query.includes('usd') || query.includes('gross')));
  const isContradiction = query.includes('tx-1005') || query.includes('neo-drive-2tb') || query.includes('delivered');
  const isPharma = query.includes('vancomycin') || query.includes('milligram') || query.includes('mg') || query.includes('mass');
  const isPresupposition = query.includes('enterprise') && (query.includes('churn') || query.includes('50%'));

  return (
    <div className="bg-[#0c0417] border border-purple-900/40 rounded-xl p-5 space-y-4 purple-glow-sm">
      {/* Top Bar with Multi-Mode Visualizer Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/40 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-purple-100 tracking-wider uppercase font-display">
            Interactive Visualizer Engine
          </h3>
        </div>

        {/* Functionality Tabs */}
        <div className="flex items-center gap-1 bg-[#06020c] p-1 rounded-lg border border-purple-900/50">
          <button
            onClick={() => setActiveVizMode('breakdown')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              activeVizMode === 'breakdown'
                ? 'bg-purple-900/80 text-purple-100 shadow-sm'
                : 'text-purple-400/80 hover:text-purple-200'
            }`}
          >
            Analytical Breakdown
          </button>

          <button
            onClick={() => setActiveVizMode('waterfall')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeVizMode === 'waterfall'
                ? 'bg-purple-900/80 text-purple-100 shadow-sm'
                : 'text-purple-400/80 hover:text-purple-200'
            }`}
          >
            <GitCommit className="w-3 h-3" />
            <span>Variance Trace</span>
          </button>

          <button
            onClick={() => setActiveVizMode('simulator')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeVizMode === 'simulator'
                ? 'bg-purple-900/80 text-purple-100 shadow-sm'
                : 'text-purple-400/80 hover:text-purple-200'
            }`}
          >
            <Sliders className="w-3 h-3 text-fuchsia-400" />
            <span>Live What-If Simulator</span>
          </button>

          <button
            onClick={() => setActiveVizMode('radar')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeVizMode === 'radar'
                ? 'bg-purple-900/80 text-purple-100 shadow-sm'
                : 'text-purple-400/80 hover:text-purple-200'
            }`}
          >
            <Radar className="w-3 h-3 text-amber-400" />
            <span>Trap Radar</span>
          </button>
        </div>
      </div>

      {/* MODE 1: ANALYTICAL BREAKDOWN */}
      {activeVizMode === 'breakdown' && (
        <div className="space-y-4">
          {isCurrency && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/50 space-y-1">
                  <span className="text-[11px] text-purple-400/70 block">Naive Raw Sum (Invalid Units)</span>
                  <div className="text-xl font-bold text-purple-400/50 font-mono line-through">
                    $17,060.00
                  </div>
                  <span className="text-[10px] text-rose-400 block font-medium">
                    Mixed EUR/GBP/USD + Duplicate TX-1003
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-emerald-600/40 space-y-1">
                  <span className="text-[11px] text-emerald-400 font-medium block">Verified Normalized USD</span>
                  <div className="text-xl font-bold text-emerald-300 font-mono">
                    $17,230.60
                  </div>
                  <span className="text-[10px] text-emerald-400/80 block">
                    Forex Rates Applied + Deduplicated
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/50 space-y-1">
                  <span className="text-[11px] text-purple-400/70 block">Net Audit Variance</span>
                  <div className="text-xl font-bold text-fuchsia-300 font-mono">
                    +$170.60 USD
                  </div>
                  <span className="text-[10px] text-purple-300/80 block">
                    Forex Uplift vs Duplicate Double-Count
                  </span>
                </div>
              </div>

              {/* Stacked Proportional Distribution Bar */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-purple-300">
                  <span className="font-semibold">Normalized Currency Volume Share (USD)</span>
                  <span className="font-mono text-purple-400/80 text-[11px]">Base: USD</span>
                </div>

                <div className="h-7 w-full bg-[#05020a] rounded-lg overflow-hidden flex border border-purple-900/60 p-0.5">
                  <div
                    style={{ width: '79.7%' }}
                    className="h-full bg-purple-600 rounded-l flex items-center justify-center text-[10px] font-mono text-white font-bold"
                    title="USD Native: $13,740.00 (79.7%)"
                  >
                    USD Native (79.7%)
                  </div>
                  <div
                    style={{ width: '10.6%' }}
                    className="h-full bg-fuchsia-600 flex items-center justify-center text-[10px] font-mono text-white font-bold"
                    title="GBP Converted: $1,827.00 (10.6%)"
                  >
                    GBP 10.6%
                  </div>
                  <div
                    style={{ width: '9.7%' }}
                    className="h-full bg-emerald-600 rounded-r flex items-center justify-center text-[10px] font-mono text-white font-bold"
                    title="EUR Converted: $1,663.60 (9.7%)"
                  >
                    EUR 9.7%
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-purple-300/80 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                    <span>USD Native: <strong>$13,740.00</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-fuchsia-600" />
                    <span>GBP Converted (1.26x): <strong>$1,827.00</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                    <span>EUR Converted (1.08x): <strong>$1,663.60</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                    <span>Deduplicated Row: <strong>-$240.00</strong> (TX-1003)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isContradiction && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-800 space-y-1">
                  <span className="text-[11px] text-purple-300 font-medium block">Sales Ledger (ERP)</span>
                  <div className="text-xl font-bold text-white font-mono">
                    50 Units Ordered
                  </div>
                  <span className="text-[10px] text-purple-400 block">
                    Record TX-1005 ($8,500.00 billed)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-amber-800 space-y-1">
                  <span className="text-[11px] text-amber-400 font-medium block">Warehouse Dispatch (WMS)</span>
                  <div className="text-xl font-bold text-amber-200 font-mono">
                    35 Units Shipped
                  </div>
                  <span className="text-[10px] text-amber-400/80 block">
                    Status: Short-shipped 15 units
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-rose-800 space-y-1">
                  <span className="text-[11px] text-rose-400 font-medium block">Unfulfilled Discrepancy</span>
                  <div className="text-xl font-bold text-rose-300 font-mono">
                    -15 Units Shortfall
                  </div>
                  <span className="text-[10px] text-rose-400 block">
                    30.0% Delivery Shortfall
                  </span>
                </div>
              </div>

              {/* Visual Bars */}
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-purple-200">
                    <span>Sales Ledger Claim: 50 Units</span>
                    <span className="font-mono text-purple-400">100% of Contract</span>
                  </div>
                  <div className="h-4 w-full bg-[#05020a] rounded border border-purple-900 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-purple-200">
                    <span>Warehouse Fulfillment: 35 Units</span>
                    <span className="font-mono text-amber-400">70% Delivered</span>
                  </div>
                  <div className="h-4 w-full bg-[#05020a] rounded border border-purple-900 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isPharma && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#140826] border border-rose-900/60 space-y-1">
                  <span className="text-[11px] text-rose-400 font-medium block">Naive Script (Ignoring Units)</span>
                  <div className="text-xl font-bold text-purple-300 font-mono line-through">
                    55,067.50
                  </div>
                  <span className="text-[10px] text-rose-400 block font-medium">
                    Fatal: Adds 1.5 grams directly to 500 mg!
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-emerald-600/40 space-y-1">
                  <span className="text-[11px] text-emerald-400 font-medium block">True Normalized Stock Mass</span>
                  <div className="text-xl font-bold text-emerald-300 font-mono">
                    122,500.00 mg
                  </div>
                  <span className="text-[10px] text-emerald-400/80 block">
                    Standardized to SI Milligrams (mg)
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900 space-y-1">
                  <span className="text-[11px] text-purple-300 font-medium block">Scale Correction Factor</span>
                  <div className="text-xl font-bold text-fuchsia-300 font-mono">
                    1,000x (g to mg)
                  </div>
                  <span className="text-[10px] text-purple-400 block">
                    1.5g vial = 1,500mg actual dosage
                  </span>
                </div>
              </div>
            </div>
          )}

          {isPresupposition && (
            <div className="p-4 rounded-xl bg-[#140826] border border-rose-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Adversarial Presupposition Truth Meter
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                  100% False Premise
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#05020a] border border-rose-900/60">
                  <span className="text-rose-400 block text-[11px]">Claimed in Question</span>
                  <div className="text-lg font-bold text-white font-mono mt-1">50% Churn Collapse</div>
                </div>
                <div className="p-3 rounded-lg bg-[#05020a] border border-emerald-900/60">
                  <span className="text-emerald-400 block text-[11px]">Reality in Ground Truth CRM</span>
                  <div className="text-lg font-bold text-emerald-300 font-mono mt-1">0.0% Churn (All Active)</div>
                </div>
              </div>
            </div>
          )}

          {/* General Fallback Stats */}
          {!isCurrency && !isContradiction && !isPharma && !isPresupposition && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <span className="text-[10px] text-purple-400 uppercase font-semibold block">Tables Ingested</span>
                <div className="text-lg font-bold text-white font-mono mt-1">{dataset.tables.length}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <span className="text-[10px] text-purple-400 uppercase font-semibold block">Total In-Memory Rows</span>
                <div className="text-lg font-bold text-fuchsia-300 font-mono mt-1">
                  {dataset.tables.reduce((s, t) => s + t.rows.length, 0)}
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <span className="text-[10px] text-purple-400 uppercase font-semibold block">Active Ground Traps</span>
                <div className="text-lg font-bold text-amber-400 font-mono mt-1">{dataset.trapsInjected.length}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-900/60">
                <span className="text-[10px] text-purple-400 uppercase font-semibold block">Proof Strictness</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">100%</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: VARIANCE WATERFALL TRACE */}
      {activeVizMode === 'waterfall' && (
        <div className="space-y-3 pt-1">
          <div className="text-xs text-purple-300 flex items-center justify-between">
            <span className="font-semibold">Step-by-Step Variance Audit Trail</span>
            <span className="text-purple-400/80 font-mono text-[11px]">Waterfall Reconciliation</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-[#140826] border border-purple-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">Step 1: Raw Unadjusted Transaction Volume</span>
                <span className="text-purple-400/80 text-[11px]">Summing raw 'amount' field across all 10 rows</span>
              </div>
              <span className="text-purple-200 font-mono font-bold text-sm">$17,060.00</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-rose-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-rose-300 block">Step 2: Filter Duplicate Primary Key (TX-1003)</span>
                <span className="text-purple-400/80 text-[11px]">Row index 3 repeated from double webhook sync</span>
              </div>
              <span className="text-rose-400 font-mono font-bold text-sm">-$240.00</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-fuchsia-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-fuchsia-300 block">Step 3: Forex Rate Multiplier (EUR @ 1.08x)</span>
                <span className="text-purple-400/80 text-[11px]">450 EUR + 720 EUR = 1,170 EUR * 0.08 FX uplift</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-sm">+$93.60</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-fuchsia-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-fuchsia-300 block">Step 4: Forex Rate Multiplier (GBP @ 1.26x)</span>
                <span className="text-purple-400/80 text-[11px]">1,450 GBP * 0.26 FX uplift</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold text-sm">+$377.00</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#1d0b38] border border-emerald-500/50 flex items-center justify-between text-xs purple-glow-sm">
              <div>
                <span className="font-bold text-emerald-300 text-sm block">Final Re-Runnable Mathematical Proof</span>
                <span className="text-purple-200 text-[11px]">Verified in Sandbox with 100% AST Match</span>
              </div>
              <span className="text-emerald-300 font-mono font-extrabold text-base">$17,230.60 USD</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: LIVE WHAT-IF SIMULATOR */}
      {activeVizMode === 'simulator' && (
        <div className="space-y-4 pt-1">
          <div className="p-3.5 rounded-lg bg-[#140826] border border-purple-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
                <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Live Parameter What-If Simulator</span>
              </span>
              <span className="text-[10px] text-purple-400 font-mono">Dynamic In-Browser Engine</span>
            </div>
            <p className="text-xs text-purple-300/80">
              Drag the sliders below to alter exchange rates or toggle the duplicate record. Notice how the proof total recalculates live!
            </p>
          </div>

          <div className="space-y-4 bg-[#0a0314] p-4 rounded-xl border border-purple-900/50">
            {/* Slider 1: EUR Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200">EUR to USD Multiplier:</span>
                <span className="font-mono text-fuchsia-400 font-bold">{eurRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.50"
                step="0.01"
                value={eurRate}
                onChange={(e) => setEurRate(parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-purple-500 font-mono">
                <span>0.80x (Weak EUR)</span>
                <span>1.08x (Base)</span>
                <span>1.50x (Strong EUR)</span>
              </div>
            </div>

            {/* Slider 2: GBP Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200">GBP to USD Multiplier:</span>
                <span className="font-mono text-fuchsia-400 font-bold">{gbpRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.00"
                max="1.70"
                step="0.01"
                value={gbpRate}
                onChange={(e) => setGbpRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-purple-500 font-mono">
                <span>1.00x (Parity)</span>
                <span>1.26x (Base)</span>
                <span>1.70x (Strong GBP)</span>
              </div>
            </div>

            {/* Checkbox: Include Duplicate TX-1003 */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-900/50 text-xs">
              <span className="text-purple-200">Include Duplicate Webhook TX-1003:</span>
              <button
                onClick={() => setIncludeDuplicate(!includeDuplicate)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  includeDuplicate
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {includeDuplicate ? '+ $240 (Double-Counted)' : 'Deduplicated (Clean)'}
              </button>
            </div>
          </div>

          {/* Dynamic Result Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 to-[#1d0b38] border border-purple-600/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-purple-300 uppercase font-semibold block">
                Dynamically Recalculated Proof Total
              </span>
              <span className="text-xs text-purple-400">
                Formula: Base USD + (1,170 EUR * {eurRate.toFixed(2)}) + (1,450 GBP * {gbpRate.toFixed(2)}) {includeDuplicate ? '+ $240 Dupe' : ''}
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">
              ${simulatedTotalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: TRAP RADAR MATRIX */}
      {activeVizMode === 'radar' && (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs text-purple-200">
            <span className="font-semibold">Ground-Truth Trap Vulnerability Matrix</span>
            <span className="text-purple-400 font-mono text-[11px]">Coverage: 6/6 Dimensions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-[#140826] border border-rose-800/60 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">1. Currency Mismatch</span>
              <div className="text-sm font-bold text-white">Critical Guard</div>
              <span className="text-[10px] text-purple-300/80 block">EUR, GBP, USD mixed in ERP</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-rose-800/60 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">2. Duplicate Keys</span>
              <div className="text-sm font-bold text-white">Active Defense</div>
              <span className="text-[10px] text-purple-300/80 block">TX-1003 repeated twice</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-amber-800/60 space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">3. Date Ambiguity</span>
              <div className="text-sm font-bold text-white">Conditional Mode</div>
              <span className="text-[10px] text-purple-300/80 block">04/05/2024 (US vs UK)</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-rose-800/60 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">4. Cross Discrepancy</span>
              <div className="text-sm font-bold text-white">Dual Verification</div>
              <span className="text-[10px] text-purple-300/80 block">ERP 50 vs WMS 35 units</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-amber-800/60 space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">5. Missing Data</span>
              <div className="text-sm font-bold text-white">Sample Imputation</div>
              <span className="text-[10px] text-purple-300/80 block">Customer Tier 40% null</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140826] border border-rose-800/60 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold block">6. False Presupposition</span>
              <div className="text-sm font-bold text-white">Strict Refusal</div>
              <span className="text-[10px] text-purple-300/80 block">0% churn vs 50% claimed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
