/**
 * Tezos x402 Facilitator Service
 *
 * A standalone HTTP server that verifies and settles x402 payments
 * on behalf of resource servers using the exact-tezos scheme.
 */

import express, { Request, Response, NextFunction } from 'express';
import healthRouter from './routes/health';
import verifyRouter from './routes/verify';
import settleRouter from './routes/settle';

const app = express();

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Mount routes
app.use('/health', healthRouter);
app.use('/verify', verifyRouter);
app.use('/settle', settleRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Tezos x402 Facilitator',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Service health check',
      'POST /verify': 'Verify a payment payload',
      'POST /settle': 'Settle a verified payment',
    },
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = parseInt(process.env.PORT || '3000', 10);
const RPC_URL = process.env.TEZOS_RPC_URL || 'https://shadownet.tezos.ecadinfra.com';

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('   Tezos x402 Facilitator Service');
  console.log('========================================');
  console.log('');
  console.log(`  Server:  http://localhost:${PORT}`);
  console.log(`  RPC URL: ${RPC_URL}`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`    GET  /health - Health check`);
  console.log(`    POST /verify - Verify payment`);
  console.log(`    POST /settle - Settle payment`);
  console.log('');
  console.log('========================================');
  console.log('');
});

export default app;
