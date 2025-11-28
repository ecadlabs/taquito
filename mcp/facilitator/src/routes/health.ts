/**
 * Health Check Route
 *
 * GET /health - Returns service status and connected network
 */

import { Router, Request, Response } from 'express';
import { tezosService } from '../services/tezos';
import { HealthResponse } from '../types/x402';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const blockHash = await tezosService.getCurrentBlockHash();

    const response: HealthResponse = {
      status: 'ok',
      network: tezosService.getNetworkName(),
      rpcUrl: tezosService.getRpcUrl(),
      connectedBlock: blockHash,
    };

    res.json(response);
  } catch (error) {
    const response: HealthResponse = {
      status: 'error',
      network: tezosService.getNetworkName(),
      rpcUrl: tezosService.getRpcUrl(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    res.status(500).json(response);
  }
});

export default router;
