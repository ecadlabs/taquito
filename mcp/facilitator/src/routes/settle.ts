/**
 * Settle Route
 *
 * POST /settle - Injects a previously verified payment to the Tezos network
 */

import { Router, Request, Response } from 'express';
import { tezosService } from '../services/tezos';
import {
  combineOperationWithSignature,
  getOperationHash,
} from '../services/validator';
import { seenOperations } from '../storage/seen';
import {
  SettleRequest,
  SettleResponse,
  ErrorResponse,
} from '../types/x402';

const router = Router();

/**
 * Validate the request body structure for settle
 */
function validateRequestBody(body: unknown): {
  valid: boolean;
  error?: string;
  request?: SettleRequest;
} {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const req = body as Record<string, unknown>;

  // Check payload exists
  if (!req.payload || typeof req.payload !== 'object') {
    return { valid: false, error: 'Missing or invalid payload' };
  }

  const payload = req.payload as Record<string, unknown>;

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

  return { valid: true, request: body as SettleRequest };
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

    const { payload } = validation.request;
    const { operationBytes, signature } = payload.payload;

    // Calculate operation hash to check if it was verified
    const operationHash = getOperationHash(operationBytes);

    // Check if this operation was previously verified
    if (!seenOperations.isVerified(operationHash)) {
      const errorResponse: ErrorResponse = {
        error: 'Operation was not previously verified. Call /verify first.',
      };
      res.status(422).json(errorResponse);
      return;
    }

    // Check if already settled
    if (seenOperations.isSettled(operationHash)) {
      const errorResponse: ErrorResponse = {
        error: 'Operation has already been settled',
      };
      res.status(422).json(errorResponse);
      return;
    }

    // Combine operation bytes with signature
    let signedOperation: string;
    try {
      signedOperation = combineOperationWithSignature(operationBytes, signature);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: `Failed to prepare operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      res.status(422).json(errorResponse);
      return;
    }

    // Inject the operation
    let injectedHash: string;
    try {
      injectedHash = await tezosService.injectOperation(signedOperation);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: `Failed to inject operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      res.status(500).json(errorResponse);
      return;
    }

    // Wait for confirmation (1 block)
    const confirmed = await tezosService.waitForConfirmation(injectedHash, 1);

    if (!confirmed) {
      // Operation was injected but not yet confirmed
      // Still mark as settled to prevent re-injection
      seenOperations.markSettled(operationHash);

      const response: SettleResponse = {
        success: true,
        operationHash: injectedHash,
      };
      res.json(response);
      return;
    }

    // Mark as settled
    seenOperations.markSettled(operationHash);

    const response: SettleResponse = {
      success: true,
      operationHash: injectedHash,
    };
    res.json(response);
  } catch (error) {
    console.error('Settle error:', error);
    const errorResponse: ErrorResponse = {
      error: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
