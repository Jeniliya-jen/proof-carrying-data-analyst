import { Dataset, DataTable, DataTrap } from '../types/analyst';

export function scanDatasetForTraps(dataset: Dataset): DataTrap[] {
  const detected: DataTrap[] = [];

  // 1. Scan for mixed currencies or unit issues in each table
  for (const table of dataset.tables) {
    const currencyCols = table.columns.filter(
      col => col.type === 'currency' || col.key.toLowerCase().includes('curr') || col.name.toLowerCase().includes('curr')
    );
    
    // Check if there is an amount column and distinct currency symbols/codes
    const amountCols = table.columns.filter(col =>
      ['amount', 'price', 'total', 'revenue', 'cost', 'val'].some(k => col.key.toLowerCase().includes(k))
    );

    if (currencyCols.length > 0) {
      for (const cCol of currencyCols) {
        const uniqueCurrencies = new Set<string>();
        table.rows.forEach(r => {
          if (r[cCol.key]) uniqueCurrencies.add(String(r[cCol.key]).toUpperCase());
        });

        if (uniqueCurrencies.size > 1) {
          detected.push({
            id: `trap-unit-${table.id}-${cCol.key}`,
            type: 'unit_mismatch',
            severity: 'critical',
            tableName: table.id,
            columns: [cCol.key, ...(amountCols.map(c => c.key))],
            title: `Multi-Currency Unit Collision in ${table.name}`,
            description: `Table '${table.name}' contains ${uniqueCurrencies.size} distinct currencies (${Array.from(uniqueCurrencies).join(', ')}). Naive summation without exchange rate conversion will yield invalid monetary figures.`,
            recommendation: 'Must normalize all currencies to a common base using foreign exchange tables before aggregation.',
            sampleEvidence: { detectedCurrencies: Array.from(uniqueCurrencies) }
          });
        }
      }
    }

    // Check for unit mismatch in medicine / pharma / physical strength
    const unitCols = table.columns.filter(col => ['unit', 'dosage', 'weight', 'dimension'].some(k => col.key.toLowerCase().includes(k)));
    if (unitCols.length > 0) {
      for (const uCol of unitCols) {
        const distinctUnits = new Set(table.rows.map(r => r[uCol.key]).filter(Boolean));
        if (distinctUnits.size > 1) {
          detected.push({
            id: `trap-unit-dim-${table.id}-${uCol.key}`,
            type: 'unit_mismatch',
            severity: 'critical',
            tableName: table.id,
            columns: [uCol.key],
            title: `Physical Unit Inconsistency in ${table.name}`,
            description: `Found varying measurement units (${Array.from(distinctUnits).join(', ')}). Values cannot be directly summed or compared without scale standardization.`,
            recommendation: 'Normalize all values to standard SI units (e.g. convert grams to milligrams).',
            sampleEvidence: { detectedUnits: Array.from(distinctUnits) }
          });
        }
      }
    }

    // 2. Scan for exact or primary key duplicate rows
    const idCol = table.columns.find(c => c.key.toLowerCase().endsWith('_id') || c.key.toLowerCase() === 'id');
    if (idCol) {
      const seenIds = new Map<string, number[]>();
      table.rows.forEach((row, idx) => {
        const val = String(row[idCol.key]);
        if (val) {
          if (!seenIds.has(val)) seenIds.set(val, []);
          seenIds.get(val)!.push(idx);
        }
      });

      const duplicates = Array.from(seenIds.entries()).filter(([_, indices]) => indices.length > 1);
      if (duplicates.length > 0) {
        detected.push({
          id: `trap-dupe-${table.id}`,
          type: 'duplicate_row',
          severity: 'critical',
          tableName: table.id,
          columns: [idCol.key],
          rowIndices: duplicates.flatMap(([_, indices]) => indices),
          title: `Duplicate Key Entries Detected in ${table.name}`,
          description: `Key '${idCol.key}' has repeat entries: ${duplicates.map(([k, ids]) => `${k} (Rows ${ids.map(i => i + 1).join(', ')})`).join('; ')}. If unhandled, aggregations will double-count metrics.`,
          recommendation: 'Deduplicate records by timestamp/revision or explicit grouping before computing sums.',
          sampleEvidence: duplicates.slice(0, 3)
        });
      }
    }

    // 3. Scan for ambiguous dates
    const dateCols = table.columns.filter(c => c.type === 'date' || c.key.toLowerCase().includes('date'));
    for (const dCol of dateCols) {
      const ambiguousRows: number[] = [];
      table.rows.forEach((row, idx) => {
        const val = String(row[dCol.key] || '');
        // Slash format DD/MM/YYYY vs MM/DD/YYYY where both <= 12
        const slashMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (slashMatch) {
          const num1 = parseInt(slashMatch[1], 10);
          const num2 = parseInt(slashMatch[2], 10);
          if (num1 <= 12 && num2 <= 12 && num1 !== num2) {
            ambiguousRows.push(idx);
          }
        }
      });

      if (ambiguousRows.length > 0) {
        detected.push({
          id: `trap-date-${table.id}-${dCol.key}`,
          type: 'ambiguous_date',
          severity: 'warning',
          tableName: table.id,
          columns: [dCol.key],
          rowIndices: ambiguousRows,
          title: `Ambiguous Date Format in ${table.name} (${dCol.name})`,
          description: `Found ambiguous dates (e.g. Row ${ambiguousRows[0] + 1}: '${table.rows[ambiguousRows[0]][dCol.key]}') where day and month can be interpreted reciprocally (MM/DD vs DD/MM).`,
          recommendation: 'Flag temporal ambiguity or provide conditional interpretations for affected months.'
        });
      }
    }

    // 4. Scan for heavy missing/null data
    for (const col of table.columns) {
      let nullCount = 0;
      table.rows.forEach(r => {
        const val = r[col.key];
        if (val === null || val === undefined || val === '' || String(val).toLowerCase() === 'nan' || String(val).toLowerCase() === 'null') {
          nullCount++;
        }
      });

      const nullRate = nullCount / (table.rows.length || 1);
      if (nullRate >= 0.25) {
        detected.push({
          id: `trap-missing-${table.id}-${col.key}`,
          type: 'missing_data',
          severity: nullRate > 0.5 ? 'critical' : 'warning',
          tableName: table.id,
          columns: [col.key],
          title: `High Missing Data Rate (${Math.round(nullRate * 100)}%) on '${col.name}'`,
          description: `${nullCount} out of ${table.rows.length} rows have missing or null values in column '${col.name}'. Conclusions depending on this dimension carry high statistical fragility.`,
          recommendation: 'Refuse confident claims or report filtered sample count and disclaimer.'
        });
      }
    }
  }

  // 5. Cross-table contradiction scan
  if (dataset.tables.length >= 2) {
    const tableA = dataset.tables[0];
    const tableB = dataset.tables[1];

    // Look for matching references (e.g. order_id and order_ref)
    const refColA = tableA.columns.find(c => c.key.includes('order_id') || c.key.includes('account_id'));
    const refColB = tableB.columns.find(c => c.key.includes('order_ref') || c.key.includes('account_id'));

    if (refColA && refColB) {
      const contradictions: Array<{ key: string; note: string }> = [];
      const mapB = new Map<string, any>();
      tableB.rows.forEach(r => {
        if (r[refColB.key]) mapB.set(String(r[refColB.key]), r);
      });

      tableA.rows.forEach(rowA => {
        const keyVal = String(rowA[refColA.key]);
        const matchB = mapB.get(keyVal);
        if (matchB) {
          // Check quantity vs units_shipped
          const qtyA = rowA['quantity'] || rowA['contract_value'];
          const qtyB = matchB['units_shipped'] || matchB['amount_usd'];
          if (qtyA !== undefined && qtyB !== undefined && qtyA !== qtyB) {
            contradictions.push({
              key: keyVal,
              note: `${tableA.name} records ${qtyA}, but ${tableB.name} records ${qtyB}`
            });
          }
        }
      });

      if (contradictions.length > 0) {
        detected.push({
          id: `trap-contra-${tableA.id}-${tableB.id}`,
          type: 'table_contradiction',
          severity: 'critical',
          tableNames: [tableA.id, tableB.id],
          title: `Cross-Table Record Contradictions Detected`,
          description: `Discrepancies found across '${tableA.name}' and '${tableB.name}': ${contradictions.map(c => `Ref ${c.key} (${c.note})`).join('; ')}. Neither source can be presumed unilaterally correct without reconciliation.`,
          recommendation: 'Do not output a single unqualified answer. Provide audit variance analysis showing both sides.'
        });
      }
    }
  }

  return detected;
}
