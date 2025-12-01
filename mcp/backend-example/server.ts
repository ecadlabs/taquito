import express, { Request, Response } from 'express';

const app = express();
const PORT = 3001;

// Facilitator service URL (configurable via environment)
const FACILITATOR_URL = process.env.FACILITATOR_URL || 'http://localhost:3000';

// Payment configuration
const PAYMENT_RECIPIENT = process.env.PAYMENT_RECIPIENT || 'tz1Xt4oGfDt3QVbJvJFvECFbLHSuH34Mkkxw';
const PAYMENT_AMOUNT = process.env.PAYMENT_AMOUNT || '250000'; // 0.25 XTZ in mutez
const PAYMENT_NETWORK = process.env.PAYMENT_NETWORK || 'shadownet';

// x402 payment payload structure
interface X402Payload {
  x402Version: number;
  scheme: 'exact-tezos';
  network: string;
  asset: 'XTZ';
  payload: {
    operationBytes: string;
    signature: string;
    publicKey: string;
    source: string;
  };
}

app.use(express.json());

/**
 * Parse the X-PAYMENT header (base64-encoded JSON)
 */
function parsePaymentHeader(header: string): X402Payload {
  try {
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error('Invalid payment header format');
  }
}

/**
 * Call the facilitator's /verify endpoint
 */
async function verifyPayment(payload: X402Payload): Promise<{ valid: boolean; reason?: string }> {
  const verifyRequest = {
    payload: {
      scheme: payload.scheme,
      network: payload.network,
      asset: payload.asset,
      payload: payload.payload,
    },
    requirements: {
      scheme: 'exact-tezos',
      network: PAYMENT_NETWORK,
      asset: 'XTZ',
      amount: PAYMENT_AMOUNT,
      recipient: PAYMENT_RECIPIENT,
    },
  };

  const response = await fetch(`${FACILITATOR_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verifyRequest),
  });

  const result = await response.json();

  if (response.status === 200 && result.valid) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: result.reason || result.error || 'Verification failed',
  };
}

/**
 * Call the facilitator's /settle endpoint
 */
async function settlePayment(payload: X402Payload): Promise<{ success: boolean; operationHash?: string; error?: string }> {
  const settleRequest = {
    payload: {
      scheme: payload.scheme,
      network: payload.network,
      asset: payload.asset,
      payload: payload.payload,
    },
  };

  const response = await fetch(`${FACILITATOR_URL}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settleRequest),
  });

  const result = await response.json();

  if (response.status === 200 && result.success) {
    return { success: true, operationHash: result.operationHash };
  }

  return {
    success: false,
    error: result.error || 'Settlement failed',
  };
}

app.get('/weather', async (req: Request, res: Response) => {
  const paymentHeader = req.headers['x-payment'];

  // If no payment header, return 402 with payment requirements
  if (!paymentHeader || typeof paymentHeader !== 'string') {
    return res.status(402).json({
      x402Version: 1,
      paymentRequirements: [
        {
          scheme: 'exact-tezos',
          network: PAYMENT_NETWORK,
          asset: 'XTZ',
          amount: PAYMENT_AMOUNT,
          recipient: PAYMENT_RECIPIENT,
          extra: {
            name: 'XTZ',
            decimals: 6
          }
        }
      ]
    });
  }

  try {
    // Parse the payment header
    const payload = parsePaymentHeader(paymentHeader);

    // Verify the payment with the facilitator
    const verification = await verifyPayment(payload);

    if (!verification.valid) {
      return res.status(402).json({
        error: 'Payment verification failed',
        reason: verification.reason,
        x402Version: 1,
        paymentRequirements: [
          {
            scheme: 'exact-tezos',
            network: PAYMENT_NETWORK,
            asset: 'XTZ',
            amount: PAYMENT_AMOUNT,
            recipient: PAYMENT_RECIPIENT,
            extra: {
              name: 'XTZ',
              decimals: 6
            }
          }
        ]
      });
    }

    // Settle the payment on-chain
    const settlement = await settlePayment(payload);

    if (!settlement.success) {
      return res.status(500).json({
        error: 'Payment settlement failed',
        reason: settlement.error,
      });
    }

    // Payment verified and settled - return the protected resource
    console.log(`Payment settled: ${settlement.operationHash}`);

    res.json({
      location: 'Vancouver',
      temperature: 9,
      unit: 'C',
      conditions: 'Rainy',
      _payment: {
        settled: true,
        operationHash: settlement.operationHash,
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      error: 'Payment processing failed',
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log('Example x402 Weather service started')
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Facilitator: ${FACILITATOR_URL}`);
  console.log(`Network: ${PAYMENT_NETWORK}`);
  console.log(`Amount: ${PAYMENT_AMOUNT} mutez`);
  console.log(`Recipient: ${PAYMENT_RECIPIENT}`);
  console.log('> Endpoints:');
  console.log('GET /weather - Weather data (requires payment)');
});
