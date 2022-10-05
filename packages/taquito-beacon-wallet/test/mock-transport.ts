import { Transport } from '@airgap/beacon-core';

export class MockTransport extends Transport {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async listen() {}
}
