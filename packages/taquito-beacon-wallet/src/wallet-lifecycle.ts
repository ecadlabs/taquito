import type { DAppClient } from '@tezos-x/octez.connect-dapp';
import { BeaconWalletBusyError, BeaconWalletRequestInterruptedError } from './errors';

type Lease = { teardown: boolean };
const owners = new WeakMap<DAppClient, Lease>();

/** Coordinate wrapper calls sharing one SDK singleton. SDK events remain SDK-owned. */
export async function withWalletLease<T>(
  client: DAppClient,
  teardown: boolean,
  run: (assertCurrent: () => void) => Promise<T>
): Promise<T> {
  const previous = owners.get(client);
  if (previous && (!teardown || previous.teardown)) throw new BeaconWalletBusyError();
  const lease: Lease = { teardown };
  owners.set(client, lease);
  const assertCurrent = () => {
    if (owners.get(client) !== lease) throw new BeaconWalletRequestInterruptedError();
  };
  try {
    return await run(assertCurrent);
  } finally {
    if (owners.get(client) === lease) owners.delete(client);
  }
}
