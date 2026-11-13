# Taquito Beacon Wallet package

_Documentation can be found [here](https://taquito.io/docs/wallet_API)_
_TypeDoc style documentation is available [here](https://taquito.io/typedoc/modules/_taquito_beacon_wallet.html)_

## General Information

`@taquito/taquito-beacon-wallet` is an npm package implementing the TZIP-10 standard that describes the communication between decentralized applications and wallets. The package provides developers a way to connect a dapp built with Taquito to a wallet giving the freedom to the users of the dapp to choose the wallet they want.

## Install

Install the package as follows

```
npm install @taquito/beacon-wallet
```

## Usage

Create a wallet instance with defined option parameters and set the wallet provider using `setWalletProvider` to the `TezosToolkit` instance

```ts
import { TezosToolkit } from '@taquito/taquito';
import { BeaconEvent, BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@taquito/beacon-wallet/types';

const wallet = new BeaconWallet({
  name: 'MyAwesomeDapp',
  iconUrl: 'https://taquito.io/img/favicon.svg',
  network: { type: NetworkType.SHADOWNET },
});

const unsubscribeAccount = await wallet.subscribeToEvent(
  BeaconEvent.ACTIVE_ACCOUNT_SET,
  async (account) => {
    // An active account has been set or cleared; update the dApp UI
    console.log(`${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered:`, account);
  },
);
await wallet.requestPermissions();

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setWalletProvider(wallet);
```

## Active Wallet Metadata (`getWalletInfo()`)

```ts
import type { WalletInfo } from '@taquito/beacon-wallet';

const info: WalletInfo | undefined = await wallet.getWalletInfo();
if (info) {
  console.log(info.name, info.type, info.icon, info.deeplink);
}
```

`getWalletInfo()` delegates to Beacon's `DAppClient.getActiveWalletInfo()`. It returns the active wallet's resolved `name`, optional `icon` (data URI or extension URL), `deeplink`, and `type` (`'extension' | 'mobile' | 'web' | 'desktop'`), or `undefined` when disconnected. It does not initialize a transport or prompt for permissions.

## Transport & Connection Observability

Query the current transport status and health without blocking on transport initialization, or subscribe to live transitions:

```ts
import {
  BeaconEvent,
  type ConnectionInfo,
  type TransportStatusChangedInfo,
} from '@taquito/beacon-wallet';

const connection: ConnectionInfo = await wallet.getConnectionInfo();
// { transport?: 'postmessage' | 'p2p' | 'walletconnect', status: TransportStatus, health: 'ok' | 'degraded', relayServer?, senderId? }

const unsubscribeStatus = await wallet.subscribeToEvent(
  BeaconEvent.TRANSPORT_STATUS_CHANGED,
  (change: TransportStatusChangedInfo) => {
    if (change.health === 'degraded') {
      console.warn(`Relay degraded (${change.reason}):`, change.relayServer);
    }
  },
);
```

## Request Lifecycle, Acknowledgements & Custom UI

When building a custom request progress UI, you can suppress Beacon's built-in Shadow DOM progress toasts via `uiOptions: { enableToasts: false }` (while keeping the built-in pairing modal and error alerts), track in-flight requests with `wallet.getPendingRequests()`, and correlate lifecycle events by `requestId`:

```ts
import {
  BeaconEvent,
  BeaconWallet,
  isBeaconError,
  TransactionInvalidBeaconError,
  toBeaconError,
} from '@taquito/beacon-wallet';

const wallet = new BeaconWallet({
  name: 'MyAwesomeDapp',
  ackTimeoutMs: 5_000,
  uiOptions: { enableToasts: false },
});

await wallet.subscribeToEvent(BeaconEvent.OPERATION_REQUEST_SENT, (sent) => {
  // sent.dispatchStage is 'transport' (with sent.sentAt) or 'forwarded' (with sent.forwardedAt)
  console.log('Sent request', sent.requestId, 'to', sent.walletInfo.name);
});

await wallet.subscribeToEvent(BeaconEvent.ACKNOWLEDGE_RECEIVED, (ack) => {
  if (ack.correlated) {
    console.log('Wallet acknowledged request', ack.requestId);
  }
});

await wallet.subscribeToEvent(BeaconEvent.WAITING_FOR_WALLET_ACK, (waiting) => {
  console.warn(`Still waiting for wallet ACK (${waiting.elapsedMs}ms) on ${waiting.requestId}`);
});

await wallet.subscribeToEvent(BeaconEvent.LATE_RESPONSE_RECEIVED, (late) => {
  if (late.kind === 'success') {
    console.warn('Wallet responded after local timeout:', late.transactionHash);
  }
});

// Inspect currently open requests synchronously at any point:
const pending = wallet.getPendingRequests();
```

## Typed `BeaconError` Handling & Protocol Message Stream

Request methods (`requestPermissions`, `sendOperations`, `sign`) reject with typed `BeaconError` subclasses (`AbortedBeaconError`, `TransactionInvalidBeaconError`, `PeerUnreachableBeaconError`, etc.):

```ts
try {
  await wallet.sendOperations(operations);
} catch (err) {
  if (isBeaconError(err)) {
    // err.errorOrigin is 'wallet' | 'local'
    console.error(err.errorType, err.errorOrigin, err.title, err.description);
    if (err instanceof TransactionInvalidBeaconError) {
      console.error('RPC errors:', err.rpcErrors);
    }
  }
}

// Note: *_REQUEST_ERROR events emit a plain RequestErrorResponse in data.errorResponse;
// pass it to toBeaconError(data.errorResponse) if you want a BeaconError instance.
```

For debugging or telemetry, observe immutable plaintext protocol messages across all transports:

```ts
const stopMessages = wallet.subscribeToMessages((record) => {
  console.debug(record.direction, record.transport, record.message.type, record);
});
```

## Side-Effect-Free Types (`@taquito/beacon-wallet/types`)

To import Beacon enums, error classes, error guards, or TypeScript types without pulling in `@ecadlabs/beacon-dapp` runtime side effects:

```ts
import {
  BeaconErrorType,
  isBeaconError,
  NetworkType,
  PermissionScope,
  SigningType,
  TransportStatus,
  TransportType,
  type ConnectionInfo,
  type PendingRequestInfo,
  type WalletInfo,
} from '@taquito/beacon-wallet/types';
```

## WalletConnect Project ID

Under the covers, Beacon selects a transport per wallet: browser extensions (such as Temple) communicate locally via `postMessage`, TZIP-10 P2P wallets (such as Kukai web) use Matrix relay nodes (curated by Taquito by default), and WalletConnect-enabled wallets (such as Kukai iOS) use WalletConnect v2. `walletConnectOptions` does not replace Matrix or extension transports.

If your dApp supports WalletConnect connections, register your own `projectId` at [Reown Cloud](https://dashboard.reown.com/), configure your allowed origins list, and pass it in `BeaconWallet` options (in web dApps, typically via a build-time environment variable such as `VITE_*` or `NEXT_PUBLIC_*`):

```ts
const wallet = new BeaconWallet({
  name: 'MyAwesomeDapp',
  walletConnectOptions: {
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  },
});
```

A `projectId` is a public client identifier (not a secret), with access control enforced through your Reown Cloud domain allowlist. Any built-in fallback `projectId` in the underlying Beacon SDK is for demo/testing purposes only; using it in production may put your project in breach of the WalletConnect/Reown Terms of Service, and it will be removed in the next minor release (after which omitting `projectId` will only disable WalletConnect pairings, while extension and Matrix wallets continue to work).
