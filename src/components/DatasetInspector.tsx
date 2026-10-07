import React, { useState } from 'react';
import { Dataset, DataTable, DataTrap } from '../types/analyst';
import { 
  Database, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Layers 
} from 'lucide-react';

interface DatasetInspectorProps {
  datasets: Dataset[];
  selectedDataset: Dataset;
  onSelectDataset: (dataset: Dataset) => void;
  detectedTraps: DataTrap[];
  fullPageView?: boolean;
}

export const DatasetInspector: React.FC<DatasetInspectorProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  detectedTraps,
  fullPageView = false
}) => {
  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightTrapsOnly, setHighlightTrapsOnly] = useState(false);
  const [showTrapSummary, setShowTrapSummary] = useState(true);

  const currentTable: DataTable | undefined = selectedDataset.tables[activeTableIndex] || selectedDataset.tables[0];

  // Helper to determine cell trap flags
  const getCellTrapFlag = (tableId: string, rowIndex: number, columnKey: string, value: any) => {
    if (tableId === 'sales_orders' && rowIndex === 3 && columnKey === 'order_id') {
      return { type: 'duplicate', label: 'Duplicate Key' };
    }
    if (tableId === 'sales_orders' && columnKey === 'currency' && (value === 'EUR' || value === 'GBP')) {
      return { type: 'currency', label: `Foreign: ${value}` };
    }
    if (tableId === 'sales_orders' && columnKey === 'order_date' && (value === '04/05/2024' || value === '05/06/2024')) {
      return { type: 'date', label: 'Ambiguous Date' };
    }
    if (tableId === 'sales_orders' && rowIndex === 5 && columnKey === 'quantity') {
      return { type: 'conflict', label: '50 ordered (WMS: 35)' };
    }
    if (tableId === 'warehouse_dispatch' && rowIndex === 4 && columnKey === 'units_shipped') {
      return { type: 'conflict', label: '35 shipped (ERP: 50)' };
    }
    if (tableId === 'pharmacy_stock' && rowIndex === 2 && columnKey === 'unit_strength') {
      return { type: 'unit', label: '1.5g (needs 1000x to mg)' };
    }
    if (value === null || value === undefined || value === '') {
      return { type: 'missing', label: 'Null / Missing' };
    }
    return null;
  };

  const filteredRows = currentTable ? currentTable.rows.filter((row, idx) => {
    if (highlightTrapsOnly) {
      const hasTrap = currentTable.columns.some(col => 
        getCellTrapFlag(currentTable.id, idx, col.key, row[col.key]) !== null
      );
      if (!hasTrap) return false;
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some(val => 
      val !== null && val !== undefined && String(val).toLowerCase().includes(q)
    );
  }) : [];

  return (
    <div className={`flex flex-col bg-[#0b0317] border border-purple-900/50 rounded-xl overflow-hidden shadow-sm ${fullPageView ? 'h-full' : ''}`}>
      {/* Top Bar: Dataset Selection & Context */}
      <div className="p-4 bg-[#07020d] border-b border-purple-900/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white tracking-wide font-display">
              Relational Tables & Ground Truth
            </h2>
            <span className="text-purple-600 text-xs">/</span>
            <span className="text-xs text-purple-300 font-sans">{selectedDataset.domain}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {datasets.map((ds) => {
              const isSelected = ds.id === selectedDataset.id;
              return (
                <button
                  key={ds.id}
                  onClick={() => {
                    onSelectDataset(ds);
                    setActiveTableIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950 text-purple-200 border border-purple-600 shadow-sm'
                      : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/60'
                  }`}
                >
                  {ds.title.split('&')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-purple-300/80 leading-relaxed font-sans">
          {selectedDataset.description}
        </p>

        {/* Audit Traps Alert Strip */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span><strong>{detectedTraps.length} Ground-Truth Traps Active:</strong> Currency collisions, record contradictions, date ambiguities, and duplicate keys</span>
          </div>
          <button
            onClick={() => setShowTrapSummary(!showTrapSummary)}
            className="text-[11px] text-amber-400 hover:text-amber-200 underline font-medium cursor-pointer"
          >
            {showTrapSummary ? 'Hide Audit Log' : 'Show Audit Log'}
          </button>
        </div>

        {/* Expandable Trap Detail Cards */}
        {showTrapSummary && detectedTraps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto">
            {detectedTraps.map((trap) => (
              <div
                key={trap.id}
                className={`p-2.5 rounded-lg text-xs border ${
                  trap.severity === 'critical'
                    ? 'bg-[#140826] border-rose-900/50 text-purple-200'
                    : 'bg-[#140826] border-amber-900/50 text-purple-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-0.5">
                  <span className="text-white truncate font-display">{trap.title}</span>
                  <span className={`text-[10px] font-mono uppercase ${
                    trap.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {trap.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/70 line-clamp-2 leading-tight">
                  {trap.description}
                </p>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  Guard: {trap.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table Selection Tabs & Search Filter Toolbar */}
      <div className="px-4 py-2 border-b border-purple-900/40 bg-[#07020d] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {selectedDataset.tables.map((table, idx) => {
            const isActive = idx === activeTableIndex;
            return (
              <button
                key={table.id}
                onClick={() => setActiveTableIndex(idx)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-purple-950 text-purple-200 border border-purple-700 shadow-sm'
                    : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/40'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
                <span>{table.name}</span>
                <span className="text-[10px] text-purple-500 font-mono">({table.rows.length})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-purple-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in table..."
              className="bg-[#05020a] border border-purple-900/60 rounded-lg pl-8 pr-3 py-1 text-xs text-purple-200 placeholder-purple-600 focus:outline-none focus:border-purple-500 font-sans w-40 sm:w-52"
            />
          </div>

          <button
            onClick={() => setHighlightTrapsOnly(!highlightTrapsOnly)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition cursor-pointer ${
              highlightTrapsOnly
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-[#05020a] text-purple-400 border-purple-900/60 hover:text-purple-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{highlightTrapsOnly ? 'Traps Only (Active)' : 'Filter Traps'}</span>
          </button>
        </div>
      </div>

      {/* Main Spreadsheet Grid */}
      <div className={`p-4 overflow-auto ${fullPageView ? 'flex-1 min-h-[400px]' : 'max-h-[380px]'}`}>
        {currentTable ? (
          <div className="space-y-2">
            <div className="text-xs text-purple-400/80 flex items-center justify-between">
              <span>{currentTable.description}</span>
              <span className="font-mono text-purple-500 text-[11px]">
                Showing {filteredRows.length} of {currentTable.rows.length} records
              </span>
            </div>

            <div className="rounded-lg border border-purple-900/40 overflow-hidden shadow-inner">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#07020d] text-purple-400 border-b border-purple-900/50">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold text-purple-500 w-10 text-center font-mono text-[11px]">
                        #
                      </th>
                      {currentTable.columns.map((col) => (
                        <th key={col.key} className="py-2.5 px-3 font-semibold text-purple-200 whitespace-nowrap font-display">
                          <div className="flex items-center gap-1">
                            <span>{col.name}</span>
                            <span className="text-[10px] text-purple-500 font-mono font-normal">
                              ({col.type})
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950 text-purple-200">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={currentTable.columns.length + 1} className="py-6 text-center text-purple-500">
                          No matching records found.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-purple-950/30 transition-colors">
                          <td className="py-2 px-3 text-purple-500 text-center font-mono text-[11px]">
                            {rIdx + 1}
                          </td>
                          {currentTable.columns.map((col) => {
                            const val = row[col.key];
                            const trapFlag = getCellTrapFlag(currentTable.id, rIdx, col.key, val);

                            return (
                              <td key={col.key} className="py-2 px-3 font-mono tabular-nums whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={val === null || val === undefined ? 'text-purple-600 italic' : 'text-purple-100'}>
                                    {val === null || val === undefined ? 'null' : String(val)}
                                  </span>
                                  {trapFlag && (
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                                        trapFlag.type === 'duplicate'
                                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                          : trapFlag.type === 'currency'
                                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                          : trapFlag.type === 'conflict'
                                          ? 'bg-purple-900 text-purple-200 border border-purple-600'
                                          : trapFlag.type === 'date'
                                          ? 'bg-violet-950 text-violet-300 border border-violet-800'
                                          : trapFlag.type === 'unit'
                                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                          : 'bg-purple-950 text-purple-400'
                                      }`}
                                    >
                                      {trapFlag.label}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-purple-500 text-xs">No tables selected</div>
        )}
      </div>
    </div>
  );
};
