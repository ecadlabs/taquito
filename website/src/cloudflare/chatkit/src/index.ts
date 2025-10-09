/**
 * Environment variables for the Cloudflare Worker
 */
interface Env {
    OPENAI_API_KEY: string;
    OPENAI_WORKFLOW_ID: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                status: 204,
                headers: corsHeaders(request.headers.get('Origin')),
            });
        }

		if (url.pathname === '/api/chatkit/session' && request.method === 'POST') {
            const res = await handleCreateChatkitSession(env);
            return withCors(res, request.headers.get('Origin'));
		}

		return new Response('Not Found', { status: 404 });
	},
};

async function handleCreateChatkitSession(env: Env): Promise<Response> {
	try {
		const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json',
				"OpenAI-Beta": "chatkit_beta=v1",
			},
			body: JSON.stringify({
				workflow: { id: env.OPENAI_WORKFLOW_ID },
				user: 'anon',
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
		}

		const session = await response.json();

		return new Response(
			JSON.stringify({
				client_secret: session.client_secret,
			}),
			{
				headers: {
                    'Content-Type': 'application/json',
				},
			},
		);
	} catch (error) {
		console.error('Error creating Chatkit session:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to create session',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: {
                    'Content-Type': 'application/json',
				},
			},
		);
	}
}

function corsHeaders(origin: string | null): HeadersInit {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

function withCors(res: Response, origin: string | null): Response {
    const headers = new Headers(res.headers);
    const cors = corsHeaders(origin);
    for (const [k, v] of Object.entries(cors)) {
        headers.set(k, v as string);
    }
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
