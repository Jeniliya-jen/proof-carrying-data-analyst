import { Dataset, VerificationResult, ProofNumber } from '../types/analyst';

export function runSandboxedVerification(
  code: string,
  dataset: Dataset,
  expectedProofNumbers: ProofNumber[] = []
): VerificationResult {
  const startTime = performance.now();
  const stdoutLogs: string[] = [];
  let computedOutputs: Record<string, any> = {};
  let errorMsg: string | undefined;

  // Build table map for sandbox
  const tableData: Record<string, any[]> = {};
  for (const table of dataset.tables) {
    tableData[table.id] = JSON.parse(JSON.stringify(table.rows));
  }

  // Intercept console.log
  const customConsole = {
    log: (...args: any[]) => {
      const line = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      stdoutLogs.push(line);
    },
    warn: (...args: any[]) => {
      stdoutLogs.push(`[WARN] ` + args.map(a => String(a)).join(' '));
    },
    error: (...args: any[]) => {
      stdoutLogs.push(`[ERROR] ` + args.map(a => String(a)).join(' '));
    }
  };

  try {
    // Construct isolated function execution
    // Exposes tables directly as variables and dataset object
    const tableKeys = Object.keys(tableData);
    const tableValues = Object.values(tableData);

    const wrappedCode = `
      "use strict";
      const results = {};
      const log = console.log;
      ${code}
      return typeof output !== 'undefined' ? output : (typeof results !== 'undefined' && Object.keys(results).length > 0 ? results : {});
    `;

    const runner = new Function(
      'dataset',
      'console',
      ...tableKeys,
      wrappedCode
    );

    const execResult = runner(
      tableData,
      customConsole,
      ...tableValues
    );

    if (execResult && typeof execResult === 'object') {
      computedOutputs = execResult;
    } else if (execResult !== undefined) {
      computedOutputs = { result: execResult };
    }
  } catch (err: any) {
    errorMsg = err?.message || String(err);
    stdoutLogs.push(`Execution Failed: ${errorMsg}`);
  }

  const runtimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  // Verify proof numbers against computed outputs or stdout
  let allNumbersMatch = true;
  const verifiedProofNumbers: ProofNumber[] = expectedProofNumbers.map((expected) => {
    let computedVal: any = undefined;

    // Check direct key in computedOutputs
    if (expected.codeVariable && computedOutputs[expected.codeVariable] !== undefined) {
      computedVal = computedOutputs[expected.codeVariable];
    } else if (computedOutputs[expected.label] !== undefined) {
      computedVal = computedOutputs[expected.label];
    } else if (computedOutputs.result !== undefined) {
      computedVal = computedOutputs.result;
    } else {
      // Look through computedOutputs values
      for (const key of Object.keys(computedOutputs)) {
        if (key.toLowerCase().includes(expected.codeVariable.toLowerCase())) {
          computedVal = computedOutputs[key];
          break;
        }
      }
    }

    // If still undefined, scan stdout for variable assignment or printed value
    if (computedVal === undefined) {
      const matchRegex = new RegExp(`${expected.codeVariable}\\s*[:=]\\s*([\\d\\.\\-]+)`, 'i');
      for (const line of stdoutLogs) {
        const match = line.match(matchRegex);
        if (match && match[1]) {
          computedVal = parseFloat(match[1]);
          break;
        }
      }
    }

    // Comparison logic
    let matchStatus: 'verified' | 'mismatch' | 'refused' = 'mismatch';
    if (computedVal !== undefined) {
      const expectedNum = typeof expected.value === 'number' ? expected.value : parseFloat(String(expected.value));
      const computedNum = typeof computedVal === 'number' ? computedVal : parseFloat(String(computedVal));

      if (!isNaN(expectedNum) && !isNaN(computedNum)) {
        const tolerance = expected.tolerance || 0.01;
        if (Math.abs(expectedNum - computedNum) <= tolerance) {
          matchStatus = 'verified';
        } else {
          matchStatus = 'mismatch';
          allNumbersMatch = false;
        }
      } else if (String(expected.value).trim().toLowerCase() === String(computedVal).trim().toLowerCase()) {
        matchStatus = 'verified';
      } else {
        matchStatus = 'mismatch';
        allNumbersMatch = false;
      }
    } else {
      matchStatus = 'mismatch';
      allNumbersMatch = false;
    }

    return {
      ...expected,
      computedValue: computedVal !== undefined ? computedVal : 'NOT_FOUND',
      matchStatus
    };
  });

  // Simple deterministic hash
  const signatureInput = `${dataset.id}:${code}:${JSON.stringify(computedOutputs)}:${allNumbersMatch}`;
  let hashNum = 0;
  for (let i = 0; i < signatureInput.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + signatureInput.charCodeAt(i);
    hashNum |= 0;
  }
  const hash = '0x' + Math.abs(hashNum).toString(16).padStart(8, '0') + Date.now().toString(16).slice(-4);

  return {
    ranSuccessfully: !errorMsg,
    runtimeMs,
    stdout: stdoutLogs,
    computedOutputs,
    proofNumbers: verifiedProofNumbers,
    allNumbersMatch: !errorMsg && (expectedProofNumbers.length === 0 || allNumbersMatch),
    hash,
    error: errorMsg
  };
}
