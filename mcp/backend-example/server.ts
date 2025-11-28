import express, { Request, Response } from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/weather', (req: Request, res: Response) => {
  const paymentHeader = req.headers['x-payment'];

  if (!paymentHeader) {
    return res.status(402).json({
      x402Version: 1,
      paymentRequirements: [
        {
          scheme: 'exact-tezos',
          network: 'shadownet',
          asset: 'XTZ',
          amount: '250000',
          recipient: 'tz1Xt4oGfDt3QVbJvJFvECFbLHSuH34Mkkxw',
          extra: {
            name: 'XTZ',
            decimals: 6
          }
        }
      ]
    });
  }

  // If payment header exists, return weather data
  res.json({
    location: 'San Francisco',
    temperature: 68,
    unit: 'F',
    conditions: 'Sunny'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
