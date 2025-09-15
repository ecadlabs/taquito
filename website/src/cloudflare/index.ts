import { DurableObjectNamespace, DurableObjectState, ExecutionContext } from '@cloudflare/workers-types';

/**
 * Environment variables for the Cloudflare Worker
 */
export interface Env {
	/** Comma-separated list of allowed CORS origins */
	ALLOWED_ORIGINS: string;
	/** Base64-encoded secret key for CSRF token signing */
	CSRF_SECRET: string;
	/** Optional Slack bot token for posting feedback */
	SLACK_BOT_TOKEN?: string;
	/** Optional Slack channel ID for posting feedback */
	SLACK_CHANNEL_ID?: string;
	/** Durable Object namespace for rate limiting */
	RATE_LIMITER: DurableObjectNamespace;
}

/**
 * Request body for vote submissions
 */
interface VoteBody {
	/** URL of the page being rated */
	url: string;
	/** Title of the page being rated */
	title: string;
	/** Vote value: 0=bad, 1=neutral, 2=good */
	vote?: 0 | 1 | 2;
	/** Category for feedback submissions */
	category?: string;
	/** Free-text feedback */
	feedback?: string;
}

/**
 * Slack API response interface
 */
interface SlackResponse {
	ok: boolean;
	status?: number;
	error?: string;
}

/**
 * Rate limiter response interface
 */
interface RateLimitResponse {
	allowed: boolean;
	retryAfterMs: number;
}

// Constants
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' } as const;
const CSRF_EXPIRY_SECONDS = 7200; // 2 hours
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_EVENTS = 5;
const RATE_LIMIT_COOLDOWN_MS = 30 * 1000; // 30 seconds

/**
 * Main Cloudflare Worker handler
 * Routes requests to appropriate handlers based on method and path
 */
export default {
	/**
	 * Handles incoming requests and routes them to appropriate handlers
	 * @param req - The incoming request
	 * @param env - Environment variables and bindings
	 * @param ctx - Execution context
	 * @returns Response for the request
	 */
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(req.url);
		
		// Route requests based on method and path
		if (req.method === 'OPTIONS') {
			return handleOptions(req, env);
		}
		if (req.method === 'GET' && url.pathname === '/api/vote/csrf') {
			return issueCsrf(req, env);
		}
		if (req.method === 'POST' && url.pathname === '/api/vote') {
			return handleVote(req, env, ctx);
		}
		
		return new Response('Not found', { status: 404 });
	},
};

/**
 * Generates CORS headers for the given origin
 * @param origin - The origin to allow, empty string for wildcard
 * @returns Object containing CORS headers
 */
function corsHeaders(origin: string): Record<string, string> {
	const headers: Record<string, string> = {
		'Access-Control-Allow-Origin': origin === '' ? '*' : origin,
		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, X-CSRF, X-Session-ID',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};

	// Set credentials for non-wildcard origins
	if (origin !== '*') {
		headers['Access-Control-Allow-Credentials'] = 'true';
	}

	return headers;
}

/**
 * Parses the ALLOWED_ORIGINS environment variable into a Set
 * @param env - Environment variables
 * @returns Set of allowed origins
 */
function parseAllowedOrigins(env: Env): Set<string> {
	return new Set(
		(env.ALLOWED_ORIGINS || '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
	);
}

/**
 * Checks if the request origin is allowed
 * @param req - The incoming request
 * @param env - Environment variables
 * @returns The allowed origin string, null if not allowed, empty string for same-origin
 */
function originAllowed(req: Request, env: Env): string | null {
	const allowed = parseAllowedOrigins(env);
	const origin = req.headers.get('Origin');
	
	if (origin && allowed.has(origin)) {
		return origin;
	}
	
	// Allow same-origin requests (no Origin header)
	return origin ? null : '';
}

/**
 * Handles CORS preflight requests
 * @param req - The incoming OPTIONS request
 * @param env - Environment variables
 * @returns CORS response or 403 if origin not allowed
 */
async function handleOptions(req: Request, env: Env): Promise<Response> {
	const origin = originAllowed(req, env);
	
	if (origin === null) {
		return new Response('CORS origin not allowed', { status: 403 });
	}
	
	return new Response(null, { 
		status: 204, 
		headers: corsHeaders(origin === '' ? '*' : origin) 
	});
}

/**
 * Issues a new CSRF token and session ID
 * @param req - The incoming request
 * @param env - Environment variables
 * @returns Response containing CSRF token and session ID
 */
async function issueCsrf(req: Request, env: Env): Promise<Response> {
	const origin = originAllowed(req, env);
	if (origin === null) {
		return new Response('CORS origin not allowed', { status: 403 });
	}

	// Generate session ID and CSRF token
	const sid = crypto.getRandomValues(new Uint8Array(16));
	const sidB64 = b64url(sid);
	const token = await signCsrf(sidB64, env.CSRF_SECRET);

	// Prepare response headers
	const headers = new Headers({ ...JSON_HEADERS });
	const corsHeadersObj = corsHeaders(origin);
	Object.entries(corsHeadersObj).forEach(([k, v]) => headers.set(k, v));

	// Return both CSRF token and session ID for client-side storage
	return new Response(JSON.stringify({ csrf: token, sid: sidB64 }), { headers });
}

/**
 * Validates vote payload
 * @param vote - Vote value to validate
 * @param url - URL to validate
 * @returns True if valid, false otherwise
 */
function validateVotePayload(vote: unknown, url: unknown): boolean {
	return (
		[0, 1, 2].includes(vote as number) &&
		typeof url === 'string' &&
		url.length <= 512
	);
}

/**
 * Gets the rating label for a vote value
 * @param vote - Vote value (0, 1, or 2)
 * @returns Rating label string
 */
function getRatingLabel(vote: number): string {
	switch (vote) {
		case 0: return 'bad';
		case 1: return 'neutral';
		case 2: return 'good';
		default: return 'unknown';
	}
}

/**
 * Formats Slack message text based on vote or feedback
 * @param vote - Vote value (optional)
 * @param url - Page URL
 * @param title - Page title
 * @param category - Feedback category (optional)
 * @param feedback - Feedback text (optional)
 * @returns Formatted Slack message
 */
function formatSlackMessage(
	vote: number | undefined,
	url: string,
	title: string,
	category?: string,
	feedback?: string
): string {
	if (vote !== undefined) {
		const ratingLabel = getRatingLabel(vote);
		return `New Taquito documentation rating for <${url}|${title}> page. Rating: ${ratingLabel}`;
	} else {
		return `New Taquito documentation feedback for <${url}|${title}> page. Category: ${category}. Feedback: ${feedback}`;
	}
}

/**
 * Handles vote submissions and feedback
 * @param req - The incoming POST request
 * @param env - Environment variables
 * @param ctx - Execution context
 * @returns Response indicating success or failure
 */
async function handleVote(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const origin = originAllowed(req, env);
	if (origin === null) {
		return withCors(
			new Response(JSON.stringify({ error: 'CORS origin not allowed' }), { 
				status: 403, 
				headers: JSON_HEADERS 
			}), 
			origin || ''
		);
	}

	// Parse request body
	const { vote, url, title, category, feedback } = await safeJson<VoteBody>(req);

	// Validate vote payload if vote is provided
	if (vote !== undefined && !validateVotePayload(vote, url)) {
		return withCors(
			new Response(JSON.stringify({ error: 'Bad payload' }), { 
				status: 400, 
				headers: JSON_HEADERS 
			}), 
			origin
		);
	}

	// CSRF validation
	const sid = req.headers.get('X-Session-ID') || '';
	const token = req.headers.get('X-CSRF') || '';
	if (!sid || !(await verifyCsrf(token, sid, env.CSRF_SECRET))) {
		return withCors(
			new Response(JSON.stringify({ error: 'CSRF failed' }), { 
				status: 403, 
				headers: JSON_HEADERS 
			}), 
			origin
		);
	}

	// Rate limiting
	const ip = req.headers.get('CF-Connecting-IP') || '0.0.0.0';
	const id = env.RATE_LIMITER.idFromName(ip);
	const stub = env.RATE_LIMITER.get(id);
	const limitRes = await stub.fetch('https://limiter/check', {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify({ key: url, now: Date.now() }),
	});
	const { allowed, retryAfterMs } = await limitRes.json() as RateLimitResponse;
	if (!allowed) {
		return withCors(
			new Response(JSON.stringify({ error: 'Rate limited', retryAfterMs }), { 
				status: 429, 
				headers: JSON_HEADERS 
			}), 
			origin
		);
	}

	// Post to Slack
	const text = formatSlackMessage(vote, url || '', title || '', category, feedback);
	const posted = await postToSlack(env, text);
	if (!posted.ok) {
		const status = posted.status || 502;
		return withCors(
			new Response(JSON.stringify({ error: 'Slack error', details: posted.error }), { 
				status, 
				headers: JSON_HEADERS 
			}),
			origin || ''
		);
	}

	return withCors(new Response(null, { status: 204 }), origin || '');
}

/**
 * Adds CORS headers to a response
 * @param res - The response to add CORS headers to
 * @param origin - The origin to allow
 * @returns Response with CORS headers
 */
function withCors(res: Response, origin: string): Response {
	const h = new Headers(res.headers);
	Object.entries(corsHeaders(origin === '' ? '*' : origin)).forEach(([k, v]) => h.set(k, v));
	return new Response(res.body, { status: res.status, headers: h });
}

/**
 * Safely parses JSON from a request body
 * @param req - The request to parse
 * @returns Parsed JSON object or empty object on error
 */
async function safeJson<T>(req: Request): Promise<Partial<T>> {
	try {
		return await req.json();
	} catch {
		return {};
	}
}

/**
 * Posts a message to Slack using the Web API
 * @param env - Environment variables containing Slack configuration
 * @param text - The message text to post
 * @returns Promise resolving to Slack response
 */
async function postToSlack(env: Env, text: string): Promise<SlackResponse> {
	if (!env.SLACK_BOT_TOKEN || !env.SLACK_CHANNEL_ID) {
		return { ok: false, error: 'no_slack_config' };
	}

	const payload = {
		channel: env.SLACK_CHANNEL_ID,
		text,
	};

	const headers = {
		Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
		'Content-Type': 'application/json; charset=utf-8',
	};

	try {
		const response = await fetch('https://slack.com/api/chat.postMessage', {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
		});

		// Handle rate limiting
		if (response.status === 429) {
			const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10) * 1000;
			await sleep(retryAfter);
			
			const retryResponse = await fetch('https://slack.com/api/chat.postMessage', {
				method: 'POST',
				headers,
				body: JSON.stringify(payload),
			});
			
			const result = await retryResponse.json().catch(() => ({ ok: false, error: 'parse_error' })) as SlackResponse;
			return { ok: result.ok === true, status: retryResponse.status, error: result.error };
		}

		const result = await response.json().catch(() => ({ ok: false, error: 'parse_error' })) as SlackResponse;
		return { ok: result.ok === true, status: response.status, error: result.error };
	} catch (error) {
		return { ok: false, error: 'network_error' };
	}
}

/**
 * Signs a CSRF token using HMAC-SHA256
 * @param sid - Session ID to sign
 * @param secretB64 - Base64-encoded secret key
 * @returns Signed CSRF token
 */
async function signCsrf(sid: string, secretB64: string): Promise<string> {
	const key = await importHmacKey(secretB64);
	const timestamp = Math.floor(Date.now() / 1000);
	const message = new TextEncoder().encode(`${sid}.${timestamp}`);
	const signature = await crypto.subtle.sign('HMAC', key, message);
	return `${b64url(new Uint8Array(signature))}.${timestamp}`;
}

/**
 * Verifies a CSRF token against a session ID
 * @param token - The CSRF token to verify
 * @param sid - The session ID to verify against
 * @param secretB64 - Base64-encoded secret key
 * @returns True if token is valid, false otherwise
 */
async function verifyCsrf(token: string, sid: string, secretB64: string): Promise<boolean> {
	const [sigB64, tsStr] = token.split('.');
	if (!sigB64 || !tsStr) {
		return false;
	}

	const timestamp = parseInt(tsStr, 10);
	if (!Number.isFinite(timestamp) || Math.floor(Date.now() / 1000) - timestamp > CSRF_EXPIRY_SECONDS) {
		return false;
	}

	const expected = await signCsrf(sid, secretB64);
	return expected.split('.')[0] === sigB64;
}

/**
 * Imports an HMAC key from a base64-encoded secret
 * @param secretB64 - Base64-encoded secret
 * @returns CryptoKey for HMAC operations
 */
async function importHmacKey(secretB64: string): Promise<CryptoKey> {
	const raw = Uint8Array.from(atob(secretB64), (c) => c.charCodeAt(0));
	return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

/**
 * Converts bytes to base64url encoding
 * @param bytes - Uint8Array to encode
 * @returns Base64url encoded string
 */
function b64url(bytes: Uint8Array): string {
	let str = '';
	bytes.forEach((b) => (str += String.fromCharCode(b)));
	return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Sleeps for the specified number of milliseconds
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Durable Object for rate limiting requests
 * Implements sliding window rate limiting with per-page cooldowns
 */
export class RateLimiter {
	state: DurableObjectState;

	constructor(state: DurableObjectState) {
		this.state = state;
	}

	// Rate limiting configuration
	private readonly WINDOW_MS = RATE_LIMIT_WINDOW_MS;
	private readonly MAX_EVENTS = RATE_LIMIT_MAX_EVENTS;
	private readonly COOLDOWN_MS = RATE_LIMIT_COOLDOWN_MS;

	/**
	 * Handles rate limit check requests
	 * @param req - Request containing key and timestamp
	 * @returns Response with rate limit status
	 */
	async fetch(req: Request): Promise<Response> {
		const body = await req.json().catch(() => ({ key: 'default', now: Date.now() })) as { key: string; now: number };
		const key = body.key;
		const now = body.now;

		const ipTotalsKey = 'totals'; // aggregate across all pages
		const pageKey = `page:${key}`;

		// Get current state
		const [totals, lastPerPage] = await Promise.all([
			this.state.storage.get<{ t: number[] }>(ipTotalsKey),
			this.state.storage.get<{ last: number }>(pageKey),
		]);

		// Clean up old timestamps outside the window
		const timestamps = (totals?.t || []).filter((t) => now - t < this.WINDOW_MS);
		timestamps.push(now);

		// Check if request is allowed
		const allowed = 
			timestamps.length <= this.MAX_EVENTS && 
			(!lastPerPage?.last || now - lastPerPage.last >= this.COOLDOWN_MS);

		// Update state if allowed
		if (allowed) {
			await Promise.all([
				this.state.storage.put(ipTotalsKey, { t: timestamps }),
				this.state.storage.put(pageKey, { last: now }, { 
					expirationTtl: Math.ceil(this.WINDOW_MS / 1000) 
				} as any),
			]);
		}

		// Calculate retry delay
		const retryAfterMs = allowed 
			? 0 
			: Math.max(1000, this.WINDOW_MS - (now - (timestamps[0] || now)));

		return new Response(JSON.stringify({ allowed, retryAfterMs }), { 
			headers: JSON_HEADERS 
		});
	}
}
