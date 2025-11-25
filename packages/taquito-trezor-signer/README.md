# Taquito Trezor Signer

`@taquito/trezor-signer` is a package that provides a Tezos signer implementation for Trezor hardware wallets using the `@trezor/connect-web` library for browser environments.

## Prototype Status

This package is currently a **prototype** focused on:
- Connecting to Trezor devices
- Retrieving Tezos addresses (public key hash)
- Viewing account balances

Transaction signing is not yet implemented in this prototype.

## Installation

```bash
npm install @taquito/trezor-signer
```

## Requirements

- Trezor Model T or newer (Tezos support)
- Node.js 18 or higher

## Usage

### Basic Setup

```typescript
import { TezosToolkit } from '@taquito/taquito';
import { TrezorSigner, HDPathTemplate } from '@taquito/trezor-signer';

async function main() {
  // Initialize Trezor Connect (required once before creating signers)
  await TrezorSigner.init({
    appName: 'My Tezos App',
    appUrl: 'https://myapp.com'
  });

  // Create a signer for the first account
  const signer = new TrezorSigner(HDPathTemplate(0));

  // Connect to Tezos network
  const Tezos = new TezosToolkit('https://mainnet.ecadinfra.com');
  Tezos.setProvider({ signer });

  // Get the address
  const address = await signer.publicKeyHash();
  console.log('Tezos Address:', address);

  // Get balance
  const balance = await Tezos.tz.getBalance(address);
  console.log('Balance:', balance.toNumber() / 1_000_000, 'XTZ');

  // Clean up when done
  TrezorSigner.dispose();
}

main().catch(console.error);
```

### Multiple Accounts

```typescript
import { TrezorSigner, HDPathTemplate } from '@taquito/trezor-signer';

await TrezorSigner.init({ appName: 'My App' });

// Create signers for different accounts
const signer0 = new TrezorSigner(HDPathTemplate(0)); // m/44'/1729'/0'
const signer1 = new TrezorSigner(HDPathTemplate(1)); // m/44'/1729'/1'
const signer2 = new TrezorSigner(HDPathTemplate(2)); // m/44'/1729'/2'

// Get addresses
const address0 = await signer0.publicKeyHash();
const address1 = await signer1.publicKeyHash();
const address2 = await signer2.publicKeyHash();
```

### Without Device Confirmation

By default, the signer will prompt for address confirmation on the Trezor device. To skip this:

```typescript
// Pass false as second parameter to skip device confirmation
const signer = new TrezorSigner("m/44'/1729'/0'", false);
```

## API Reference

### TrezorSigner

#### Static Methods

##### `TrezorSigner.init(config?: TrezorSignerConfig): Promise<void>`

Initialize Trezor Connect. Must be called once before creating any TrezorSigner instances.

```typescript
interface TrezorSignerConfig {
  appName?: string;   // Application name shown on Trezor
  appUrl?: string;    // Application URL for Trezor Connect
}
```

##### `TrezorSigner.isInitialized(): boolean`

Check if Trezor Connect has been initialized.

##### `TrezorSigner.dispose(): void`

Dispose of Trezor Connect resources. Call when done using Trezor.

#### Constructor

##### `new TrezorSigner(path?: string, showOnTrezor?: boolean)`

- `path`: BIP44 derivation path (default: `"m/44'/1729'/0'"`)
- `showOnTrezor`: Whether to confirm address on device (default: `true`)

#### Instance Methods

##### `publicKeyHash(): Promise<string>`

Returns the Tezos address (tz1...) from the device.

##### `publicKey(): Promise<string>`

Returns the public key from the device.

##### `secretKey(): Promise<string>`

Always throws `ProhibitedActionError` - secret keys cannot be exported from hardware wallets.

##### `sign(op: string, magicByte?: Uint8Array): Promise<SignResult>`

Sign an operation. **Note: Not implemented in this prototype.**

### HDPathTemplate

Helper function to generate derivation paths:

```typescript
import { HDPathTemplate } from '@taquito/trezor-signer';

HDPathTemplate(0);  // Returns "m/44'/1729'/0'"
HDPathTemplate(5);  // Returns "m/44'/1729'/5'"
```

## Derivation Path

Tezos uses BIP44 derivation paths with coin type 1729:

```
m/44'/1729'/account'
```

- `44'` - BIP44 purpose
- `1729'` - Tezos coin type
- `account'` - Account index (0, 1, 2, ...)

## Error Handling

The package exports several error classes:

```typescript
import {
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorSigningError,
  TrezorInitializationError,
  TrezorActionRejectedError,
} from '@taquito/trezor-signer';

try {
  const address = await signer.publicKeyHash();
} catch (error) {
  if (error instanceof TrezorActionRejectedError) {
    console.log('User rejected the action on Trezor');
  } else if (error instanceof TrezorNotInitializedError) {
    console.log('Forgot to call TrezorSigner.init()');
  }
}
```

## Supported Trezor Models

- Trezor Model T
- Trezor Safe 3

Note: The original Trezor One does not support Tezos.

## Resources

- [Trezor Connect Documentation](https://docs.trezor.io/trezor-suite/packages/connect/index.html)
- [Trezor Connect Explorer](https://connect.trezor.io/9/)
- [Taquito Documentation](https://taquito.io/docs/quick_start)

## License

Apache-2.0
