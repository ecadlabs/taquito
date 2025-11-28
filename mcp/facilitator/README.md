# Tezos x402 Facilitator

A standalone HTTP server that verifies and settles x402 payments on behalf of resource servers using the `exact-tezos` scheme for native XTZ payments.

## Overview

The x402 protocol enables HTTP-based payments using the 402 Payment Required status code. This facilitator service acts as a trusted intermediary that:

1. **Verifies** payment payloads by validating signatures, checking balances, and preventing double-spends
2. **Settles** payments by injecting signed operations to the Tezos network

## Installation

```bash
npm install
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `PORT` | HTTP server port | `3000` |
| `TEZOS_RPC_URL` | Tezos RPC endpoint URL | `https://ghostnet.tezos.ecadinfra.com` |

## API Endpoints

### GET /health

Returns service status and connected network.

**Response:**
```json
{
  "status": "ok",
  "network": "ghostnet",
  "rpcUrl": "https://ghostnet.tezos.ecadinfra.com",
  "connectedBlock": "BL..."
}
```

### POST /verify

Validates an x402 payment payload against requirements.

**Request:**
```json
{
  "payload": {
    "scheme": "exact-tezos",
    "network": "ghostnet",
    "asset": "XTZ",
    "payload": {
      "operationBytes": "...",
      "signature": "edsig...",
      "publicKey": "edpk...",
      "source": "tz1..."
    }
  },
  "requirements": {
    "scheme": "exact-tezos",
    "network": "ghostnet",
    "asset": "XTZ",
    "amount": "250000",
    "recipient": "tz1..."
  }
}
```

**Success Response (200):**
```json
{
  "valid": true
}
```

**Verification Failed Response (422):**
```json
{
  "valid": false,
  "reason": "Insufficient balance..."
}
```

### POST /settle

Injects a previously verified payment to the Tezos network.

**Request:**
```json
{
  "payload": {
    "scheme": "exact-tezos",
    "network": "ghostnet",
    "asset": "XTZ",
    "payload": {
      "operationBytes": "...",
      "signature": "edsig...",
      "publicKey": "edpk...",
      "source": "tz1..."
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "operationHash": "oo..."
}
```

**Error Response (422):**
```json
{
  "error": "Operation was not previously verified..."
}
```

## Validation Logic

The `/verify` endpoint performs the following checks:

1. **Public Key Validation**: Verifies the public key hashes to the source address
2. **Operation Decoding**: Decodes operation bytes to verify they represent a valid Tezos transfer
3. **Signature Verification**: Validates the signature against the operation bytes
4. **Requirements Matching**: Checks that recipient and amount match the requirements
5. **Double-Spend Protection**: Ensures the operation hash hasn't been seen before
6. **Balance Check**: Queries the Tezos RPC to verify sufficient balance (amount + fees)

## Settlement Logic

The `/settle` endpoint:

1. Verifies the operation was previously verified
2. Combines operation bytes with signature
3. Injects the signed operation via Tezos RPC
4. Waits for confirmation (1 block)
5. Returns the operation hash

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Malformed request |
| 422 | Valid request but verification/settlement failed |
| 500 | Internal/network error |

## Notes

- Double-spend protection uses in-memory storage and resets on server restart
- The service supports only the `exact-tezos` scheme with `XTZ` asset
- Operations must be verified before settlement
- Settled operations cannot be re-settled

## Project Structure

```
facilitator/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts              # Express app setup
    ├── routes/
    │   ├── health.ts         # GET /health
    │   ├── verify.ts         # POST /verify
    │   └── settle.ts         # POST /settle
    ├── services/
    │   ├── tezos.ts          # Taquito wrapper
    │   └── validator.ts      # Signature validation
    ├── storage/
    │   └── seen.ts           # In-memory tracking
    └── types/
        └── x402.ts           # TypeScript types
```
