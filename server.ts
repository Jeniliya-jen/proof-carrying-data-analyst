import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { runSandboxedVerification } from './src/utils/codeSandbox.ts';
import { scanDatasetForTraps } from './src/utils/trapDetector.ts';
import { processQueryWithAgent } from './src/utils/agentEngine.ts';
import { Dataset } from './src/types/analyst.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

// Initialize Gemini SDK if API key is set
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { query, dataset } = req.body;
    if (!query || !dataset) {
      return res.status(400).json({ error: 'Missing query or dataset in request body' });
    }

    // First attempt agent reasoning loop
    const agentResponse = await processQueryWithAgent(query, dataset, Boolean(ai));

    // If Gemini is available and query is an arbitrary open-ended custom query,
    // we can use Gemini to synthesize custom code & explanation if needed
    if (ai && !agentResponse.status.includes('refused')) {
      try {
        const prompt = `You are a Proof-Carrying Data Analyst agent for competition HNX26PSI08.
The user asked: "${query}".
The dataset tables are:
${JSON.stringify(dataset.tables.map((t: any) => ({ id: t.id, name: t.name, columns: t.columns.map((c: any) => c.key), sampleRow: t.rows[0] })))}

CRITICAL RULES:
1. Every number must have re-runnable JavaScript code that produces that exact number.
2. If the question makes a false assumption or is unanswerable, refuse it explicitly.
3. Watch for traps: currency mismatches ($/€), ambiguous dates, duplicate rows, cross-table contradictions, missing null data.
4. Output concise explanation and verified numbers.`;

        // Only do optional enhancement if needed
      } catch (geminiErr) {
        console.warn('Gemini optional enhancement skipped:', geminiErr);
      }
    }

    return res.json(agentResponse);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    return res.status(500).json({ error: err.message || 'Internal analysis error' });
  }
});

// 2. Independent Code Verification endpoint
app.post('/api/verify', (req, res) => {
  try {
    const { code, dataset, expectedProofNumbers } = req.body;
    if (!code || !dataset) {
      return res.status(400).json({ error: 'Missing code or dataset' });
    }

    const verificationResult = runSandboxedVerification(code, dataset, expectedProofNumbers || []);
    return res.json(verificationResult);
  } catch (err: any) {
    console.error('Error in /api/verify:', err);
    return res.status(500).json({ error: err.message || 'Verification execution failed' });
  }
});

// 3. Automated Trap Scan endpoint
app.post('/api/scan-traps', (req, res) => {
  try {
    const { dataset } = req.body;
    if (!dataset) {
      return res.status(400).json({ error: 'Missing dataset' });
    }

    const traps = scanDatasetForTraps(dataset);
    return res.json({ traps });
  } catch (err: any) {
    console.error('Error in /api/scan-traps:', err);
    return res.status(500).json({ error: err.message || 'Scan failed' });
  }
});

// 4. Submission Packager / Export endpoint
app.post('/api/export-audit', (req, res) => {
  try {
    const { analysisResult, dataset } = req.body;
    const markdownReport = `# Submission Pack: Proof-Carrying Data Analyst (HNX26PSI08)
Presented to: Division of Computer Science and Engineering, Karunya Institute of Technology and Sciences

## 1. Problem Statement & Scope
- Title: Proof-Carrying Data Analyst (Agentic GenAI)
- Challenge: Every number must come with working, re-runnable code. Verifier runs code, gets the same number, or score 0. Strict refusal protocols for unanswerable/adversarial questions.

## 2. Query Analyzed
"${analysisResult?.query || 'N/A'}"
Status: ${analysisResult?.status?.toUpperCase()}
Headline: ${analysisResult?.answerHeadline}

## 3. Detected Traps in Dataset (${analysisResult?.detectedTraps?.length || 0})
${analysisResult?.detectedTraps?.map((t: any, i: number) => `${i + 1}. [${t.severity.toUpperCase()}] ${t.title}: ${t.description}`).join('\n') || 'None'}

## 4. Re-Runnable Verification Code
\`\`\`javascript
${analysisResult?.executableCode || '// No code'}
\`\`\`

## 5. Verifier Execution Result
- Ran Successfully: ${analysisResult?.verification?.ranSuccessfully}
- Runtime: ${analysisResult?.verification?.runtimeMs} ms
- Proof Certificate Hash: ${analysisResult?.verification?.hash}
- All Numbers Matched: ${analysisResult?.verification?.allNumbersMatch}

## 6. How to Reproduce
1. Load dataset tables into standard Node.js/browser runtime.
2. Execute the verification script provided above.
3. Compare stdout and output object with the proof numbers certificate.
`;

    return res.json({ markdownReport });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mount Vite or serve static
const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proof-Carrying Analyst Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
