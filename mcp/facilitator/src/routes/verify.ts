/**
 * Verify Route
 *
 * POST /verify - Validates an x402 payment payload against requirements
 */

import { Router, Request, Response } from 'express';
import { validatePayment } from '../services/validator';
import {
  VerifyRequest,
  VerifyResponse,
  ErrorResponse,
} from '../types/x402';

const router = Router();

/**
 * Validate the request body structure
 */
function validateRequestBody(body: unknown): {
  valid: boolean;
  error?: string;
  request?: VerifyRequest;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const req = body as Record<string, unknown>;

  // Check payload exists
  if (!req.payload || typeof req.payload !== 'object') {
    return { valid: false, error: 'Missing or invalid payload' };
  }

  // Check requirements exists
  if (!req.requirements || typeof req.requirements !== 'object') {
    return { valid: false, error: 'Missing or invalid requirements' };
  }

  const payload = req.payload as Record<string, unknown>;
  const requirements = req.requirements as Record<string, unknown>;

  // Validate payload structure
  if (payload.scheme !== 'exact-tezos') {
    return {
      valid: false,
      error: `Unsupported scheme: ${payload.scheme}. Only 'exact-tezos' is supported`,
    };
  }

  if (payload.asset !== 'XTZ') {
    return {
      valid: false,
      error: `Unsupported asset: ${payload.asset}. Only 'XTZ' is supported`,
    };
  }

  if (!payload.network || typeof payload.network !== 'string') {
    return { valid: false, error: 'Missing or invalid network in payload' };
  }

  if (!payload.payload || typeof payload.payload !== 'object') {
    return { valid: false, error: 'Missing or invalid payload.payload' };
  }

  const innerPayload = payload.payload as Record<string, unknown>;

  if (!innerPayload.operationBytes || typeof innerPayload.operationBytes !== 'string') {
    return { valid: false, error: 'Missing or invalid operationBytes' };
  }

  if (!innerPayload.signature || typeof innerPayload.signature !== 'string') {
    return { valid: false, error: 'Missing or invalid signature' };
  }

  if (!innerPayload.publicKey || typeof innerPayload.publicKey !== 'string') {
    return { valid: false, error: 'Missing or invalid publicKey' };
  }

  if (!innerPayload.source || typeof innerPayload.source !== 'string') {
    return { valid: false, error: 'Missing or invalid source' };
  }

  // Validate requirements structure
  if (requirements.scheme !== 'exact-tezos') {
    return {
      valid: false,
      error: `Unsupported requirements scheme: ${requirements.scheme}`,
    };
  }

  if (requirements.asset !== 'XTZ') {
    return {
      valid: false,
      error: `Unsupported requirements asset: ${requirements.asset}`,
    };
  }

  if (!requirements.network || typeof requirements.network !== 'string') {
    return { valid: false, error: 'Missing or invalid network in requirements' };
  }

  if (!requirements.amount || typeof requirements.amount !== 'string') {
    return { valid: false, error: 'Missing or invalid amount in requirements' };
  }

  if (!requirements.recipient || typeof requirements.recipient !== 'string') {
    return { valid: false, error: 'Missing or invalid recipient in requirements' };
  }

  // Check networks match
  if (payload.network !== requirements.network) {
    return {
      valid: false,
      error: `Network mismatch: payload network '${payload.network}' != requirements network '${requirements.network}'`,
    };
  }

  return { valid: true, request: body as VerifyRequest };
}

router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body structure
    const validation = validateRequestBody(req.body);
    if (!validation.valid || !validation.request) {
      const errorResponse: ErrorResponse = { error: validation.error || 'Invalid request' };
      res.status(400).json(errorResponse);
      return;
    }

    const { payload, requirements } = validation.request;

    // Perform payment validation
    const result = await validatePayment(payload.payload, requirements);

    if (result.valid) {
      const response: VerifyResponse = { valid: true };
      res.json(response);
    } else {
      // Return 422 for valid request but verification failed
      const response: VerifyResponse = {
        valid: false,
        reason: result.reason || 'Verification failed',
      };
      res.status(422).json(response);
    }
  } catch (error) {
    console.error('Verify error:', error);
    const errorResponse: ErrorResponse = {
      error: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
