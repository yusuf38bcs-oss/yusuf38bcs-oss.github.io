export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
  EXTRA_ALLOWED_ORIGINS?: string;
  ENVIRONMENT?: string;
}

type SocraticPayload = {
  type: "socratic_reflex";
  anomaly_question: string;
  student_hypothesis: string;
  page_context: string;
  attempt_count: number;
};

type SocraticResult = {
  mastery_achieved: boolean;
  feedback_text: string;
  next_vector: string;
  strike_count: number;
};

type JsonRecord = Record<string, unknown>;

const WORKER_VERSION = "omega-2026-06-18.1";
const SERVICE_NAME = "LBFL Synaptic AI Edge Worker";
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_BODY_BYTES = 12_000;
const DEFAULT_ALLOWED_ORIGIN = "https://learningbiologyforlife.org";
const FALLBACK_VECTOR = "/biology/";

function splitOrigins(value?: string): string[] {
  return (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function allowedOrigins(env: Env): string[] {
  const configured = splitOrigins(env.ALLOWED_ORIGIN);
  const extra = splitOrigins(env.EXTRA_ALLOWED_ORIGINS);
  const defaults = [
    DEFAULT_ALLOWED_ORIGIN,
    "https://www.learningbiologyforlife.org",
    "https://api.learningbiologyforlife.org"
  ];

  return Array.from(new Set([...defaults, ...configured, ...extra]));
}

function resolveCorsOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get("Origin");
  const origins = allowedOrigins(env);

  if (requestOrigin && origins.includes(requestOrigin)) {
    return requestOrigin;
  }

  if (!requestOrigin) {
    return env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  }

  return env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
}

function baseHeaders(request: Request, env: Env, contentType: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": resolveCorsOrigin(request, env),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Content-Type": contentType,
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY"
  };
}

function json(request: Request, env: Env, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: baseHeaders(request, env, "application/json; charset=utf-8")
  });
}

function html(request: Request, env: Env, body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: baseHeaders(request, env, "text/html; charset=utf-8")
  });
}

function clampAttempt(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(3, Math.trunc(value)));
}

function cleanText(value: unknown, limit: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function validatePayload(input: unknown): SocraticPayload | null {
  const payload = input as Partial<SocraticPayload> | null;

  if (!payload || payload.type !== "socratic_reflex") return null;

  const anomalyQuestion = cleanText(payload.anomaly_question, 1_200);
  const studentHypothesis = cleanText(payload.student_hypothesis, 2_400);
  const pageContext = cleanText(payload.page_context, 600) || "/biology/";
  const attemptCount = clampAttempt(Number(payload.attempt_count));

  if (anomalyQuestion.length < 8) return null;
  if (studentHypothesis.length < 3) return null;

  return {
    type: "socratic_reflex",
    anomaly_question: anomalyQuestion,
    student_hypothesis: studentHypothesis,
    page_context: pageContext,
    attempt_count: attemptCount
  };
}

function safeFallback(attemptCount: number, reason = "safe_fallback"): SocraticResult {
  const strikeCount = clampAttempt(attemptCount);

  return {
    mastery_achieved: false,
    feedback_text:
      strikeCount >= 3
        ? "The third attempt threshold has been reached. Review the core biological mechanism, identify the causal pathway, then retry from the Biology Matrix."
        : "Your answer could not be evaluated safely. Refine your explanation by naming the biological structure, causal mechanism, and expected outcome.",
    next_vector: `${FALLBACK_VECTOR}?reason=${encodeURIComponent(reason)}`,
    strike_count: strikeCount
  };
}

function normalizeResult(parsed: Partial<SocraticResult>, attemptCount: number): SocraticResult {
  const feedback = cleanText(parsed.feedback_text, 1_500);
  const nextVector = cleanText(parsed.next_vector, 500) || FALLBACK_VECTOR;

  return {
    mastery_achieved: Boolean(parsed.mastery_achieved),
    feedback_text: feedback || safeFallback(attemptCount).feedback_text,
    next_vector: nextVector.startsWith("/") ? nextVector : FALLBACK_VECTOR,
    strike_count: clampAttempt(Number(parsed.strike_count || attemptCount))
  };
}

function stripJsonFence(value: string): string {
  return value
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function parseGeminiJson(text: string, attemptCount: number): SocraticResult {
  const normalized = stripJsonFence(text);
  const parsed = JSON.parse(normalized) as Partial<SocraticResult>;
  return normalizeResult(parsed, attemptCount);
}

function healthPayload(env: Env): JsonRecord {
  return {
    ok: true,
    service: SERVICE_NAME,
    version: WORKER_VERSION,
    environment: env.ENVIRONMENT || "production",
    model: env.GEMINI_MODEL || DEFAULT_MODEL,
    gemini_key_configured: Boolean(env.GEMINI_API_KEY),
    allowed_origins: allowedOrigins(env),
    routes: {
      health: ["GET /", "GET /health", "GET /api/health"],
      socratic: ["POST /", "POST /api/socratic", "POST /api/gemini", "POST /socratic"]
    },
    contract: {
      request_type: "socratic_reflex",
      response_shape: ["mastery_achieved", "feedback_text", "next_vector", "strike_count"]
    }
  };
}

function statusPage(env: Env): string {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  const keyStatus = env.GEMINI_API_KEY ? "Configured" : "Missing";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${SERVICE_NAME}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 antialiased">
  <main class="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
    <section class="w-full overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-900/80 shadow-2xl shadow-cyan-950/40">
      <div class="bg-gradient-to-br from-cyan-400/15 via-slate-900 to-blue-500/10 p-8 sm:p-12">
        <p class="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Omega Edge Runtime</p>
        <h1 class="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">${SERVICE_NAME}</h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Production API bridge for Socratic Biology evaluation, Gemini structured JSON, UTF-8/Bangla-safe responses, and stable Cloudflare edge delivery.</p>
      </div>
      <div class="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
        <article class="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Status</p>
          <p class="mt-3 text-2xl font-black text-emerald-300">Online</p>
        </article>
        <article class="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Gemini Key</p>
          <p class="mt-3 text-2xl font-black ${env.GEMINI_API_KEY ? "text-emerald-300" : "text-amber-300"}">${keyStatus}</p>
        </article>
        <article class="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Model</p>
          <p class="mt-3 break-words text-2xl font-black text-cyan-200">${model}</p>
        </article>
      </div>
      <div class="border-t border-slate-800 p-6 sm:p-8">
        <p class="text-sm leading-7 text-slate-400">Use <code class="rounded bg-slate-800 px-2 py-1 text-cyan-200">POST /api/socratic</code> with a <code class="rounded bg-slate-800 px-2 py-1 text-cyan-200">socratic_reflex</code> JSON payload. Health check: <code class="rounded bg-slate-800 px-2 py-1 text-cyan-200">GET /api/health</code>.</p>
      </div>
    </section>
  </main>
</body>
</html>`;
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }
  return request.json();
}

async function callGemini(payload: SocraticPayload, env: Env): Promise<SocraticResult> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  const systemInstruction = `
You are the Socratic AI evaluator for Learning Biology For Life.
Return only valid JSON matching this schema:
{
  "mastery_achieved": boolean,
  "feedback_text": string,
  "next_vector": string,
  "strike_count": integer
}

Rules:
1. Preserve academic accuracy in biology, physiology, ecology, genetics, and zoology.
2. Support English and Bangla learner input without corrupting Unicode text.
3. If attempt_count is 1 or 2, guide with a Socratic hint and do not reveal the complete answer.
4. If attempt_count is 3, explain the core biological mechanism directly and provide a remedial next_vector.
5. Set mastery_achieved true only when the learner demonstrates causal biological understanding.
6. Keep feedback_text concise, respectful, and classroom-safe.
`;

  const body = {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: JSON.stringify({
              anomaly_question: payload.anomaly_question,
              student_hypothesis: payload.student_hypothesis,
              page_context: payload.page_context,
              attempt_count: payload.attempt_count
            })
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          mastery_achieved: { type: "boolean" },
          feedback_text: { type: "string" },
          next_vector: { type: "string" },
          strike_count: { type: "integer" }
        },
        required: ["mastery_achieved", "feedback_text", "next_vector", "strike_count"]
      }
    }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini API failed with status ${response.status}: ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== "string") {
    throw new Error("Gemini returned empty structured output.");
  }

  return parseGeminiJson(text, payload.attempt_count);
}

function isSocraticRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/api/socratic" || pathname === "/api/gemini" || pathname === "/socratic";
}

function isHealthRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/health" || pathname === "/api/health";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "") || "/";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: baseHeaders(request, env, "text/plain; charset=utf-8") });
    }

    if (request.method === "GET" && isHealthRoute(pathname)) {
      if (pathname === "/") {
        return html(request, env, statusPage(env));
      }
      return json(request, env, healthPayload(env));
    }

    if (request.method !== "POST") {
      return json(request, env, {
        error: "Method not allowed.",
        allowed_methods: ["GET", "POST", "OPTIONS"],
        routes: healthPayload(env).routes
      }, 405);
    }

    if (!isSocraticRoute(pathname)) {
      return json(request, env, {
        error: "Not found.",
        valid_post_routes: ["/", "/api/socratic", "/api/gemini", "/socratic"]
      }, 404);
    }

    let rawPayload: unknown;

    try {
      rawPayload = await readJsonBody(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON payload.";
      return json(request, env, {
        error: message === "REQUEST_TOO_LARGE" ? "Request body too large." : "Invalid JSON payload."
      }, message === "REQUEST_TOO_LARGE" ? 413 : 400);
    }

    const payload = validatePayload(rawPayload);

    if (!payload) {
      return json(request, env, {
        error: "Invalid Socratic payload contract.",
        required: {
          type: "socratic_reflex",
          anomaly_question: "string, min 8 characters",
          student_hypothesis: "string, min 3 characters",
          page_context: "string",
          attempt_count: "number between 1 and 3"
        }
      }, 400);
    }

    try {
      const result = await callGemini(payload, env);
      return json(request, env, result);
    } catch (error) {
      console.error("[LBFL Worker Error]", error);
      return json(request, env, safeFallback(payload.attempt_count, "gemini_or_schema_failure"));
    }
  }
};
