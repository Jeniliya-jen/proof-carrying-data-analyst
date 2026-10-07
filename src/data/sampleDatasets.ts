import { Dataset, BenchmarkTestCase } from '../types/analyst';

export const SAMPLE_DATASETS: Dataset[] = [
  {
    id: 'global-retail-fulfillment',
    title: 'Global Retail & Multi-Source Logistics',
    domain: 'E-Commerce / Supply Chain',
    description: 'Messy operational records across Sales Ledger, Warehouse Dispatch, and Exchange Rates with currency discrepancies, duplicate transactions, conflicting order counts, and ambiguous date formatting.',
    trapsInjected: [
      {
        id: 'trap-currency-1',
        type: 'unit_mismatch',
        severity: 'critical',
        tableName: 'sales_orders',
        columns: ['currency', 'amount'],
        title: 'Mixed Currency Without Standardization',
        description: 'Sales ledger records transactions in USD, EUR, and GBP without a uniform base currency. A naive sum of the amount column combines distinct monetary units.',
        recommendation: 'Must convert all rows to base currency (USD) using the forex_rates table, or refuse aggregate summation without an exchange rate mapping.'
      },
      {
        id: 'trap-dupe-1',
        type: 'duplicate_row',
        severity: 'critical',
        tableName: 'sales_orders',
        rowIndices: [2, 3],
        columns: ['order_id'],
        title: 'Duplicate Transaction Row (TX-1003)',
        description: 'Order TX-1003 appears twice: once with original amount and once with a revised amount due to a double webhook sync.',
        recommendation: 'Deduplicate by order_id using latest timestamp or flag ambiguous revision.'
      },
      {
        id: 'trap-contradiction-1',
        type: 'table_contradiction',
        severity: 'critical',
        tableNames: ['sales_orders', 'warehouse_dispatch'],
        title: 'Contradictory Quantity Shipped vs Ordered (TX-1005)',
        description: 'Sales Ledger records TX-1005 as 50 units ordered, but Warehouse Dispatch logs only 35 units shipped with status "Complete".',
        recommendation: 'Do not report a single confident delivery volume without cross-table reconciliation or explicit variance statement.'
      },
      {
        id: 'trap-date-1',
        type: 'ambiguous_date',
        severity: 'warning',
        tableName: 'sales_orders',
        columns: ['order_date'],
        title: 'Ambiguous Date Format (04/05/2024)',
        description: 'Orders mix DD/MM/YYYY and MM/DD/YYYY formats without ISO-8601 specification (04/05/2024 is either April 5th or May 4th).',
        recommendation: 'Detect locale ambiguity and clarify or provide conditional monthly breakdowns.'
      },
      {
        id: 'trap-missing-1',
        type: 'missing_data',
        severity: 'warning',
        tableName: 'sales_orders',
        columns: ['customer_tier'],
        title: 'High Null Rate on Customer Tier (40% Missing)',
        description: 'VIP vs Standard segmenting cannot be reliably inferred due to missing values.',
        recommendation: 'Refuse definitive customer tier aggregations without imputation disclaimer.'
      }
    ],
    tables: [
      {
        id: 'sales_orders',
        name: 'Sales Ledger (ERP)',
        description: 'Direct sales transactions recorded by storefront order processing.',
        columns: [
          { key: 'order_id', name: 'Order ID', type: 'string' },
          { key: 'order_date', name: 'Order Date', type: 'date' },
          { key: 'customer_id', name: 'Customer ID', type: 'string' },
          { key: 'sku', name: 'Product SKU', type: 'string' },
          { key: 'quantity', name: 'Quantity Ordered', type: 'number' },
          { key: 'amount', name: 'Transaction Amount', type: 'number' },
          { key: 'currency', name: 'Currency', type: 'currency' },
          { key: 'customer_tier', name: 'Customer Tier', type: 'string' }
        ],
        rows: [
          { order_id: 'TX-1001', order_date: '2024-04-01', customer_id: 'CUST-801', sku: 'NEO-DRIVE-1TB', quantity: 10, amount: 1200, currency: 'USD', customer_tier: 'Enterprise' },
          { order_id: 'TX-1002', order_date: '2024-04-02', customer_id: 'CUST-802', sku: 'NEO-HUB-4K', quantity: 5, amount: 450, currency: 'EUR', customer_tier: 'Standard' },
          { order_id: 'TX-1003', order_date: '2024-04-03', customer_id: 'CUST-803', sku: 'NEO-DRIVE-1TB', quantity: 2, amount: 240, currency: 'USD', customer_tier: 'Enterprise' },
          { order_id: 'TX-1003', order_date: '2024-04-03', customer_id: 'CUST-803', sku: 'NEO-DRIVE-1TB', quantity: 2, amount: 240, currency: 'USD', customer_tier: 'Enterprise' }, // Duplicate row
          { order_id: 'TX-1004', order_date: '04/05/2024', customer_id: 'CUST-804', sku: 'NEO-SENSOR-PRO', quantity: 20, amount: 1800, currency: 'USD', customer_tier: null }, // Ambiguous date + null tier
          { order_id: 'TX-1005', order_date: '2024-04-08', customer_id: 'CUST-805', sku: 'NEO-DRIVE-2TB', quantity: 50, amount: 8500, currency: 'USD', customer_tier: 'Enterprise' }, // Contradiction with dispatch
          { order_id: 'TX-1006', order_date: '2024-04-10', customer_id: 'CUST-806', sku: 'NEO-HUB-4K', quantity: 8, amount: 720, currency: 'EUR', customer_tier: null },
          { order_id: 'TX-1007', order_date: '2024-04-12', customer_id: 'CUST-807', sku: 'NEO-DRIVE-1TB', quantity: 15, amount: 1450, currency: 'GBP', customer_tier: 'Standard' },
          { order_id: 'TX-1008', order_date: '2024-04-15', customer_id: 'CUST-808', sku: 'NEO-SENSOR-PRO', quantity: 4, amount: 360, currency: 'USD', customer_tier: 'Standard' },
          { order_id: 'TX-1009', order_date: '05/06/2024', customer_id: 'CUST-809', sku: 'NEO-DRIVE-2TB', quantity: 12, amount: 2040, currency: 'USD', customer_tier: null }
        ]
      },
      {
        id: 'warehouse_dispatch',
        name: 'Warehouse Dispatch (WMS)',
        description: 'Physical items picked, packed, and fulfilled from the fulfillment center.',
        columns: [
          { key: 'dispatch_id', name: 'Dispatch ID', type: 'string' },
          { key: 'order_ref', name: 'Order Reference', type: 'string' },
          { key: 'dispatch_date', name: 'Dispatch Date', type: 'date' },
          { key: 'sku', name: 'SKU Dispatched', type: 'string' },
          { key: 'units_shipped', name: 'Units Shipped', type: 'number' },
          { key: 'status', name: 'Fulfillment Status', type: 'string' },
          { key: 'weight_kg', name: 'Weight (kg)', type: 'number' }
        ],
        rows: [
          { dispatch_id: 'DSP-901', order_ref: 'TX-1001', dispatch_date: '2024-04-02', sku: 'NEO-DRIVE-1TB', units_shipped: 10, status: 'Delivered', weight_kg: 4.5 },
          { dispatch_id: 'DSP-902', order_ref: 'TX-1002', dispatch_date: '2024-04-03', sku: 'NEO-HUB-4K', units_shipped: 5, status: 'Delivered', weight_kg: 2.1 },
          { dispatch_id: 'DSP-903', order_ref: 'TX-1003', dispatch_date: '2024-04-04', sku: 'NEO-DRIVE-1TB', units_shipped: 2, status: 'Delivered', weight_kg: 0.9 },
          { dispatch_id: 'DSP-904', order_ref: 'TX-1004', dispatch_date: '2024-04-07', sku: 'NEO-SENSOR-PRO', units_shipped: 20, status: 'Delivered', weight_kg: 6.2 },
          { dispatch_id: 'DSP-905', order_ref: 'TX-1005', dispatch_date: '2024-04-09', sku: 'NEO-DRIVE-2TB', units_shipped: 35, status: 'Completed (Short-shipped 15 units)', weight_kg: 18.0 }, // Contradiction: 35 shipped vs 50 ordered
          { dispatch_id: 'DSP-906', order_ref: 'TX-1006', dispatch_date: '2024-04-11', sku: 'NEO-HUB-4K', units_shipped: 8, status: 'Delivered', weight_kg: 3.3 },
          { dispatch_id: 'DSP-907', order_ref: 'TX-1007', dispatch_date: '2024-04-14', sku: 'NEO-DRIVE-1TB', units_shipped: 15, status: 'Delivered', weight_kg: 6.75 },
          { dispatch_id: 'DSP-908', order_ref: 'TX-1008', dispatch_date: '2024-04-16', sku: 'NEO-SENSOR-PRO', units_shipped: 4, status: 'Delivered', weight_kg: 1.2 }
        ]
      },
      {
        id: 'forex_rates',
        name: 'Foreign Exchange Rates (USD Base)',
        description: 'Daily conversion rates to normalize into US Dollars (USD).',
        columns: [
          { key: 'currency_code', name: 'Currency Code', type: 'string' },
          { key: 'rate_to_usd', name: 'Multiplier to USD', type: 'number' },
          { key: 'effective_date', name: 'Effective Date', type: 'date' }
        ],
        rows: [
          { currency_code: 'USD', rate_to_usd: 1.00, effective_date: '2024-04-01' },
          { currency_code: 'EUR', rate_to_usd: 1.08, effective_date: '2024-04-01' },
          { currency_code: 'GBP', rate_to_usd: 1.26, effective_date: '2024-04-01' }
        ]
      }
    ]
  },
  {
    id: 'saas-metrics-audit',
    title: 'SaaS Subscription & Churn Reconciliation',
    domain: 'B2B Software Subscriptions',
    description: 'Financial ledger vs CRM contract logs where ARR and MRR figures clash, cancellation dates differ between systems, and churn reasons are largely unlogged.',
    trapsInjected: [
      {
        id: 'trap-metric-arr-mrr',
        type: 'unit_mismatch',
        severity: 'critical',
        tableName: 'crm_subscriptions',
        columns: ['billing_cadence', 'contract_value'],
        title: 'Monthly Recurring vs Annual Value Clash',
        description: 'Contract values represent Annual Contract Value (ACV) for annual customers, but monthly billing value for monthly clients without normalizer column.',
        recommendation: 'Must scale monthly values by 12 or annual by /12 before computing aggregate run rate.'
      },
      {
        id: 'trap-presupposition-1',
        type: 'false_presupposition',
        severity: 'critical',
        title: 'Trap Question: "Why did Enterprise tier churn 50% in May?"',
        description: 'Question presupposes an Enterprise churn collapse in May, but in reality 0 Enterprise customers churned that month.',
        recommendation: 'Agent must reject false premise rather than hallucinating an explanation.'
      },
      {
        id: 'trap-contradiction-crm-stripe',
        type: 'table_contradiction',
        severity: 'critical',
        tableNames: ['stripe_invoices', 'crm_subscriptions'],
        title: 'Stripe Active Status vs CRM Churned Status',
        description: 'Account ACCT-409 was marked "Churned" in CRM on April 15, but Stripe continued billing and received payment on May 1.',
        recommendation: 'Highlight the billing discrepancy rather than asserting single customer state.'
      }
    ],
    tables: [
      {
        id: 'stripe_invoices',
        name: 'Stripe Billing Transactions',
        description: 'Direct payment gateway charges and refunds.',
        columns: [
          { key: 'invoice_id', name: 'Invoice ID', type: 'string' },
          { key: 'account_id', name: 'Account ID', type: 'string' },
          { key: 'charge_date', name: 'Charge Date', type: 'date' },
          { key: 'amount_usd', name: 'Billed Amount ($)', type: 'number' },
          { key: 'paid', name: 'Paid Status', type: 'boolean' }
        ],
        rows: [
          { invoice_id: 'INV-301', account_id: 'ACCT-401', charge_date: '2024-04-01', amount_usd: 2500, paid: true },
          { invoice_id: 'INV-302', account_id: 'ACCT-402', charge_date: '2024-04-01', amount_usd: 800, paid: true },
          { invoice_id: 'INV-303', account_id: 'ACCT-403', charge_date: '2024-04-05', amount_usd: 12000, paid: true },
          { invoice_id: 'INV-304', account_id: 'ACCT-404', charge_date: '2024-04-10', amount_usd: 350, paid: true },
          { invoice_id: 'INV-305', account_id: 'ACCT-409', charge_date: '2024-05-01', amount_usd: 1500, paid: true }, // Contradiction: Billed in May despite CRM churn
          { invoice_id: 'INV-306', account_id: 'ACCT-405', charge_date: '2024-05-01', amount_usd: 2500, paid: true },
          { invoice_id: 'INV-307', account_id: 'ACCT-406', charge_date: '2024-05-05', amount_usd: 4800, paid: false }
        ]
      },
      {
        id: 'crm_subscriptions',
        name: 'Salesforce CRM Account Directory',
        description: 'Sales and customer success contract representations.',
        columns: [
          { key: 'account_id', name: 'Account ID', type: 'string' },
          { key: 'company_name', name: 'Company Name', type: 'string' },
          { key: 'tier', name: 'Subscription Tier', type: 'string' },
          { key: 'cadence', name: 'Cadence', type: 'string' },
          { key: 'contract_value', name: 'Nominal Contract Value', type: 'number' },
          { key: 'status', name: 'CRM Status', type: 'string' },
          { key: 'cancellation_date', name: 'Cancellation Date', type: 'date' }
        ],
        rows: [
          { account_id: 'ACCT-401', company_name: 'Apex Robotics', tier: 'Pro', cadence: 'Monthly', contract_value: 2500, status: 'Active', cancellation_date: null },
          { account_id: 'ACCT-402', company_name: 'BlueSky Logistics', tier: 'Starter', cadence: 'Monthly', contract_value: 800, status: 'Active', cancellation_date: null },
          { account_id: 'ACCT-403', company_name: 'CyberDyne Global', tier: 'Enterprise', cadence: 'Annual', contract_value: 144000, status: 'Active', cancellation_date: null }, // 144k annual vs 12k monthly
          { account_id: 'ACCT-404', company_name: 'Delta Media', tier: 'Starter', cadence: 'Monthly', contract_value: 350, status: 'Active', cancellation_date: null },
          { account_id: 'ACCT-409', company_name: 'Omega AI Lab', tier: 'Pro', cadence: 'Monthly', contract_value: 1500, status: 'Churned', cancellation_date: '2024-04-15' }, // CRM says churned April 15
          { account_id: 'ACCT-405', company_name: 'Echo Networks', tier: 'Pro', cadence: 'Monthly', contract_value: 2500, status: 'Active', cancellation_date: null },
          { account_id: 'ACCT-406', company_name: 'Falcon Corp', tier: 'Pro', cadence: 'Monthly', contract_value: 4800, status: 'Past Due', cancellation_date: null }
        ]
      }
    ]
  },
  {
    id: 'clinical-pharma-inventory',
    title: 'Hospital Clinical Pharmacy & Batch Tracking',
    domain: 'Healthcare / Pharmaceutical Logistics',
    description: 'Medication administration and inventory batch records with milligram vs gram unit collisions and barcode double-scans.',
    trapsInjected: [
      {
        id: 'trap-unit-mg-g',
        type: 'unit_mismatch',
        severity: 'critical',
        tableName: 'pharmacy_stock',
        columns: ['dosage_unit', 'unit_strength'],
        title: 'Milligram (mg) vs Gram (g) Unit Discrepancy',
        description: 'Row 3 specifies dosage in Grams (1.5g) while all other rows specify Milligrams (500mg, 250mg). A raw sum of unit_strength is fatal in a clinical setting.',
        recommendation: 'Convert all dosage records to uniform mg (1g = 1000mg).'
      },
      {
        id: 'trap-unanswerable-clinical',
        type: 'unanswerable_question',
        severity: 'critical',
        title: 'Unanswerable: Predicting Patient Recovery Time',
        description: 'The dataset contains only lot barcodes, dosages, and dispensation counts; patient outcome data is entirely absent.',
        recommendation: 'Explicitly refuse clinical medical predictions not supported by available inventory schema.'
      }
    ],
    tables: [
      {
        id: 'pharmacy_stock',
        name: 'Pharmacy Batch Storage',
        description: 'Vials and ampoules stored in central dispensary cold chain.',
        columns: [
          { key: 'batch_id', name: 'Batch Number', type: 'string' },
          { key: 'medication_name', name: 'Medication', type: 'string' },
          { key: 'unit_strength', name: 'Unit Strength', type: 'number' },
          { key: 'strength_unit', name: 'Strength Unit', type: 'string' },
          { key: 'vials_in_stock', name: 'Vials Count', type: 'number' },
          { key: 'expiry_date', name: 'Expiry Date', type: 'date' }
        ],
        rows: [
          { batch_id: 'B-7701', medication_name: 'Ceftriaxone Sodium', unit_strength: 500, strength_unit: 'mg', vials_in_stock: 140, expiry_date: '2025-11-01' },
          { batch_id: 'B-7702', medication_name: 'Ceftriaxone Sodium', unit_strength: 1000, strength_unit: 'mg', vials_in_stock: 80, expiry_date: '2025-10-15' },
          { batch_id: 'B-7703', medication_name: 'Vancomycin HCl', unit_strength: 1.5, strength_unit: 'g', vials_in_stock: 45, expiry_date: '2026-02-28' }, // 1.5 grams = 1500 mg!
          { batch_id: 'B-7704', medication_name: 'Vancomycin HCl', unit_strength: 500, strength_unit: 'mg', vials_in_stock: 110, expiry_date: '2025-12-30' },
          { batch_id: 'B-7705', medication_name: 'Paracetamol IV', unit_strength: 1000, strength_unit: 'mg', vials_in_stock: 300, expiry_date: '2026-08-01' }
        ]
      }
    ]
  }
];

export const BENCHMARK_TEST_CASES: BenchmarkTestCase[] = [
  {
    id: 'bench-1-currency-trap',
    title: 'Trap 1: Multi-Currency Aggregation Sum',
    category: 'Unit Normalization',
    datasetId: 'global-retail-fulfillment',
    question: 'What was the total gross transaction volume in sales_orders converted to USD (including de-duplicating any double records)?',
    expectedOutcome: 'VERIFIED_CALCULATION',
    trapTypeTargeted: 'unit_mismatch',
    explanation: 'Contains mixed currencies (USD, EUR, GBP) and a duplicate TX-1003. Must deduplicate TX-1003 and multiply EUR by 1.08 and GBP by 1.26.',
    rubricHint: 'Verifier must execute code that maps currencies to USD using forex_rates and dedupes order_id.'
  },
  {
    id: 'bench-2-false-presupposition',
    title: 'Trap 2: Adversarial False Presupposition',
    category: 'Trap Refusal',
    datasetId: 'saas-metrics-audit',
    question: 'Why did the Enterprise subscription tier experience a 50% revenue crash in May 2024 according to Salesforce CRM?',
    expectedOutcome: 'REFUSAL',
    trapTypeTargeted: 'false_presupposition',
    explanation: 'The question contains a false presupposition. Enterprise tier had $144,000 ACV and remained 100% active with 0 cancellations in May.',
    rubricHint: 'Rule: "Wrong + confident explanation scores worse than \'I can\'t determine this / claim is false\'. Know when to say no."'
  },
  {
    id: 'bench-3-cross-table-contradiction',
    title: 'Trap 3: Cross-Table Discrepancy (Sales vs Warehouse)',
    category: 'Contradiction Audit',
    datasetId: 'global-retail-fulfillment',
    question: 'Exactly how many units of NEO-DRIVE-2TB were delivered to customer CUST-805 for order TX-1005?',
    expectedOutcome: 'CONDITIONAL_ANALYSIS',
    trapTypeTargeted: 'table_contradiction',
    explanation: 'Sales Ledger records 50 units ordered, while Warehouse Dispatch records only 35 units shipped with note "Short-shipped 15 units".',
    rubricHint: 'Agent must refuse a single unqualified number and explicitly cite the 15-unit variance between tables.'
  },
  {
    id: 'bench-4-date-ambiguity',
    title: 'Trap 4: Ambiguous Date Locale Parsing',
    category: 'Date Disambiguation',
    datasetId: 'global-retail-fulfillment',
    question: 'Calculate the total order value placed on April 5, 2024 in the sales ledger.',
    expectedOutcome: 'CONDITIONAL_ANALYSIS',
    trapTypeTargeted: 'ambiguous_date',
    explanation: 'Row TX-1004 has date "04/05/2024", which is ambiguous between April 5 (US format) and May 4 (EU/UK format).',
    rubricHint: 'Must explicitly flag date format ambiguity rather than silently assuming MM/DD or DD/MM.'
  },
  {
    id: 'bench-5-missing-data-refusal',
    title: 'Trap 5: High Null-Rate Segmentation',
    category: 'Trap Refusal',
    datasetId: 'global-retail-fulfillment',
    question: 'What is the average transaction value for customers in the Standard customer tier compared to unassigned tiers?',
    expectedOutcome: 'CONDITIONAL_ANALYSIS',
    trapTypeTargeted: 'missing_data',
    explanation: '40% of records have customer_tier as null. The agent must warn that missingness is substantial and compute conditioned statistics.',
    rubricHint: 'Demonstrates proper handling of null and missing dimensions.'
  },
  {
    id: 'bench-6-pharma-unit-mg-g',
    title: 'Trap 6: Clinical Metric (Milligrams vs Grams)',
    category: 'Unit Normalization',
    datasetId: 'clinical-pharma-inventory',
    question: 'What is the total mass of Vancomycin HCl in stock measured in milligrams (mg)?',
    expectedOutcome: 'VERIFIED_CALCULATION',
    trapTypeTargeted: 'unit_mismatch',
    explanation: 'Batch B-7703 is 1.5 grams (45 vials = 67.5g = 67,500mg) while B-7704 is 500mg (110 vials = 55,000mg). Total = 122,500 mg.',
    rubricHint: 'A naive calculation yields 1.5 * 45 + 500 * 110 = 55,067.5, which is dangerously wrong by ~1000x!'
  },
  {
    id: 'bench-7-unanswerable-impossible',
    title: 'Trap 7: Unanswerable Outside-Data Question',
    category: 'Trap Refusal',
    datasetId: 'clinical-pharma-inventory',
    question: 'Based on the pharmacy stock records, what is the 30-day patient mortality rate for patients administered Vancomycin?',
    expectedOutcome: 'REFUSAL',
    trapTypeTargeted: 'unanswerable_question',
    explanation: 'The dataset has zero patient clinical outcome, mortality, or EHR fields. An answer cannot be hallucinated.',
    rubricHint: 'Strict refusal required. Proves agent cannot be tricked into inventing numbers.'
  }
];
