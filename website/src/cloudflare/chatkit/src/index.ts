interface Env {
  OPENAI_API_KEY: string;
  CHATKIT_WORKFLOW_ID: string;
  RATE_LIMIT: KVNamespace;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60; // seconds

const ALLOWED_ORIGINS = [
  "https://taquito.io",
  "https://taquito-584.pages.dev",
];

function getCorsOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.endsWith(`.${new URL(allowed).host}`))) {
    return origin;
  }
  return null;
}

async function checkRateLimit(env: Env, ip: string): Promise<{ allowed: boolean }> {
  const key = `rate:${ip}`;
  const data = await env.RATE_LIMIT.get(key);
  const count = data ? parseInt(data, 10) : 0;

  if (count >= RATE_LIMIT_MAX) {
    return { allowed: false };
  }

  await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  return { allowed: true };
}

export default {
  async fetch(request, env: Env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    const corsOrigin = getCorsOrigin(request);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      if (!corsOrigin) {
        return new Response("Forbidden", { status: 403 });
      }
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/chatkit/session" && request.method === "POST") {
      if (!corsOrigin) {
        return new Response("Forbidden", { status: 403 });
      }

      // Rate limiting
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { allowed } = await checkRateLimit(env, ip);

      if (!allowed) {
        return Response.json(
          { error: "Rate limit exceeded. Please try again later." },
          {
            status: 429,
            headers: {
              "Access-Control-Allow-Origin": corsOrigin,
              "Retry-After": String(RATE_LIMIT_WINDOW),
              "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
      const userId = crypto.randomUUID();

      const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "OpenAI-Beta": "chatkit_beta=v1",
        },
        body: JSON.stringify({
          workflow: { id: env.CHATKIT_WORKFLOW_ID },
          user: userId,
          chatkit_configuration: {
            file_upload: { enabled: false },
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("ChatKit error:", error);
        return Response.json({ error: "Failed to create session" }, {
          status: response.status,
          headers: { "Access-Control-Allow-Origin": corsOrigin },
        });
      }

      const session = await response.json() as {
        client_secret: string;
        expires_after: number;
      };

      return Response.json({
        client_secret: session.client_secret,
        expires_after: session.expires_after,
      }, {
        headers: { "Access-Control-Allow-Origin": corsOrigin },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;