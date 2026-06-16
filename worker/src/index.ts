export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
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

const DEFAULT_MODEL = "gemini-2.5-flash";

function corsHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}

function json(data: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(env)
  });
}

function safeFallback(attemptCount: number): SocraticResult {
  return {
    mastery_achieved: false,
    feedback_text:
      attemptCount >= 3
        ? "The third attempt threshold has been reached. Review the core biological mechanism before continuing."
        : "Your answer could not be evaluated safely. Try again with a clearer biological explanation.",
    next_vector: "/biology/remedial-pathway/",
    strike_count: attemptCount
  };
}

function validatePayload(payload: any): payload is SocraticPayload {
  return (
    payload &&
    payload.type === "socratic_reflex" &&
    typeof payload.anomaly_question === "string" &&
    typeof payload.student_hypothesis === "string" &&
    typeof payload.page_context === "string" &&
    typeof payload.attempt_count === "number" &&
    payload.attempt_count >= 1 &&
    payload.attempt_count <= 3
  );
}

async function callGemini(payload: SocraticPayload, env: Env): Promise<SocraticResult> {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  const systemInstruction = `
You are the Socratic AI evaluator for Learning Biology For Life.
Return only valid JSON matching the required schema.

Rules:
1. If attempt_count is 1 or 2, guide the learner with a Socratic hint.
2. Do not directly reveal the full answer before attempt 3.
3. If attempt_count is 3, explain the biological mechanism directly and provide a remedial next_vector.
4. Set mastery_achieved true only when the learner demonstrates causal biological understanding.
5. Keep feedback_text concise, precise, and academically responsible.
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
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API failed with status ${response.status}`);
  }

  const data: any = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned empty structured output.");
  }

  const parsed = JSON.parse(text);

  return {
    mastery_achieved: Boolean(parsed.mastery_achieved),
    feedback_text: String(parsed.feedback_text || ""),
    next_vector: String(parsed.next_vector || ""),
    strike_count: Number(parsed.strike_count || payload.attempt_count)
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405, env);
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON payload." }, 400, env);
    }

    if (!validatePayload(payload)) {
      return json({ error: "Invalid Socratic payload contract." }, 400, env);
    }

    try {
      const result = await callGemini(payload, env);
      return json(result, 200, env);
    } catch (error) {
      console.error("[LBFL Worker Error]", error);
      return json(safeFallback(payload.attempt_count), 200, env);
    }
  }
};
