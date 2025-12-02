# ChatKit Integration

This directory contains a Cloudflare Worker that handles session creation for OpenAI's ChatKit widget on the Taquito documentation site.

## How It Works

1. **User clicks the chat button** on the website
2. **ChatKitWidget.astro** initializes the `<openai-chatkit>` web component
3. The widget calls `getClientSecret()` which POSTs to the Cloudflare Worker
4. **The Worker** proxies the request to OpenAI's ChatKit API with:
   - The secret `OPENAI_API_KEY`
   - The `CHATKIT_WORKFLOW_ID` (configured in OpenAI's ChatKit dashboard)
5. **OpenAI returns** a short-lived `client_secret` token
6. **The Worker** returns this token to the client
7. **The widget** uses the token to establish a direct connection with OpenAI

## Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Cloudflare Worker that proxies session creation |
| `wrangler.jsonc` | Worker configuration |
| `../../../components/ChatKitWidget.astro` | Frontend widget component |

## Setup

### 1. Create KV Namespace (for rate limiting)

```bash
wrangler kv namespace create RATE_LIMIT
```

Copy the output ID and update `wrangler.jsonc`:
```json
"kv_namespaces": [
  { "binding": "RATE_LIMIT", "id": "YOUR_KV_ID_HERE" }
]
```

### 2. Set Secrets

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put CHATKIT_WORKFLOW_ID
```

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `CHATKIT_WORKFLOW_ID` | The workflow ID from OpenAI's ChatKit dashboard |

## Rate Limiting

The worker enforces rate limiting of **5 requests per minute** per IP address using Cloudflare KV. When exceeded, returns `429 Too Many Requests`.

## Development

```bash
cd website/src/cloudflare/chatkit

# Install dependencies
npm install

# Run locally
npm run dev

# Deploy
npm run deploy
```

When developing locally, update `apiEndpoint` in `ChatKitWidget.astro` to `http://localhost:8787/api/chatkit/session` and run the worker with `npx wrangler run dev`.

## API

### POST /api/chatkit/session

Creates a new ChatKit session.

**Request:** No body required

**Response:**
```json
{
  "client_secret": "ck_live_...",
  "expires_after": 3600
}
```

## Vector Store / Updating Docs

ChatKit uses a vector store to read from the docs for model context. This needs to be updated when major changes are made to the docs.

This can be done by following these steps:

1. Copy all the current version `.mdx` files to a new folder outside the project
2. Run `for f in *.mdx; do mv "$f" "${f%.mdx}.md"; done` (MacOS) to rename them all to `.md` markdown files
3. Navigate to the [Taquito vector store](https://platform.openai.com/storage/vector_stores/vs_692f5af6b27081919266544ea9b37237)
4. Remove all existing files (or only the ones you want to update)
5. Upload new docs files

## Security Notes

- The `OPENAI_API_KEY` is never exposed to the client
- The `client_secret` is short-lived and scoped to a single session
- CORS is restricted to allowed origins only:
  - `https://taquito.io`
  - `https://taquito-584.pages.dev`
- Requests from other origins receive `403 Forbidden`
