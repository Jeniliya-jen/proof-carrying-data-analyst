export interface ColumnMeta {
  key: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  sampleValues?: string[];
  unit?: string;
}

export type TrapType =
  | 'unit_mismatch'
  | 'ambiguous_date'
  | 'duplicate_row'
  | 'table_contradiction'
  | 'missing_data'
  | 'false_presupposition'
  | 'unanswerable_question';

export interface DataTrap {
  id: string;
  type: TrapType;
  severity: 'critical' | 'warning' | 'info';
  tableName?: string;
  tableNames?: string[];
  rowIndices?: number[];
  columns?: string[];
  title: string;
  description: string;
  recommendation: string;
  sampleEvidence?: any;
}

export interface DataTable {
  id: string;
  name: string;
  description: string;
  columns: ColumnMeta[];
  rows: Record<string, any>[];
  sourceNotes?: string;
}

export interface Dataset {
  id: string;
  title: string;
  domain: string;
  description: string;
  tables: DataTable[];
  trapsInjected: DataTrap[];
}

export interface ProofNumber {
  label: string;
  value: number | string;
  unit?: string;
  codeVariable: string;
  computedValue?: number | string;
  matchStatus: 'verified' | 'mismatch' | 'refused';
  tolerance?: number;
}

export interface Citation {
  tableName: string;
  rowIndex: number;
  column: string;
  value: any;
  context?: string;
}

export interface VerificationResult {
  ranSuccessfully: boolean;
  runtimeMs: number;
  stdout: string[];
  computedOutputs: Record<string, any>;
  proofNumbers: ProofNumber[];
  allNumbersMatch: boolean;
  hash: string;
  error?: string;
}

export interface AnalysisResponse {
  query: string;
  status: 'proven' | 'refused' | 'conditional_proof';
  answerHeadline: string;
  answerExplanation: string;
  refusalReason?: string;
  detectedTraps: DataTrap[];
  proofNumbers: ProofNumber[];
  executableCode: string;
  citations: Citation[];
  verification: VerificationResult;
  modelConfidenceScore: number;
  intermediateSteps: Array<{
    step: number;
    title: string;
    description: string;
    dataSnapshot?: any;
  }>;
  scopeNote: {
    mvpImplemented: string;
    stretchGoals: string[];
  };
}

export interface BenchmarkTestCase {
  id: string;
  title: string;
  category: 'Trap Refusal' | 'Unit Normalization' | 'De-duplication' | 'Date Disambiguation' | 'Contradiction Audit' | 'Complex Math Proof';
  datasetId: string;
  question: string;
  expectedOutcome: 'REFUSAL' | 'VERIFIED_CALCULATION' | 'CONDITIONAL_ANALYSIS';
  trapTypeTargeted: TrapType;
  explanation: string;
  rubricHint: string;
}
