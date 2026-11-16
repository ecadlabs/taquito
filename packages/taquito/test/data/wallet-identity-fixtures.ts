import BigNumber from 'bignumber.js';
import { RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '../../src/taquito';
import { vi } from 'vitest';
import { TezosToolkit, type WalletProvider } from '../../src/taquito';

// Fixed public identities from the existing signer tests. No keys or transactions are used.
const first = {
  pkh: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  pk: 'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
};
const second = {
  pkh: 'tz1b9kV41KV9N3sp69ycLdSoZ2Ak8jXwtNPv',
  pk: 'edpkuhmrbunxumoiVdQuxBZUPMmwkPt7yLtY5Qnua3VJVTLWr3vXXa',
};
const forward = async <T>(params: () => Promise<T>) => params();
function wallet(identity = first) {
  return {
    getPKH: vi.fn(async () => identity.pkh),
    getPK: vi.fn(async () => identity.pk),
    mapTransferParamsToWalletParams: forward,
    mapTransferTicketParamsToWalletParams: forward,
    mapRegisterGlobalConstantParamsToWalletParams: forward,
    mapStakeParamsToWalletParams: forward,
    mapUnstakeParamsToWalletParams: forward,
    mapFinalizeUnstakeParamsToWalletParams: forward,
    mapOriginateParamsToWalletParams: forward,
    mapDelegateParamsToWalletParams: forward,
    mapIncreasePaidStorageWalletParams: forward,
    sendOperations: async () => {
      throw new Error('Unexpected transaction');
    },
    sign: async () => {
      throw new Error('Unexpected signing');
    },
  } satisfies WalletProvider;
}
class ReadFixture extends RpcReadAdapter {
  constructor() {
    super(new RpcClient('http://127.0.0.1:1'));
  }
  override async getProtocolConstants() {
    return {
      hard_gas_limit_per_operation: new BigNumber(1000000),
      hard_gas_limit_per_block: new BigNumber(5000000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      cost_per_byte: new BigNumber(250),
      smart_rollup_origination_size: 6314,
    };
  }
  override async getBlockHash() {
    return 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX';
  }
  override async getNextProtocol() {
    return 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK';
  }
  override async getCounter() {
    return '0';
  }
}
const prepareIdentity = (toolkit: TezosToolkit) =>
  toolkit.prepare.reveal({ fee: 100, gasLimit: 1000, storageLimit: 0 });
function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

export { first, second, wallet, ReadFixture, prepareIdentity, deferred };
