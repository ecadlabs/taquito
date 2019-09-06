import { TezosToolkit } from '../src/tezos-ts';
import { RpcTzProvider } from '../src/tz/rpc-tz-provider';
import { RpcContractProvider } from '../src/contract/rpc-contract-provider';

describe('TezosToolkit test', () => {
  it('is instantiable', () => {
    expect(new TezosToolkit()).toBeInstanceOf(TezosToolkit);
  });

  it('setProvider with string should create rpc provider', () => {
    const toolkit = new TezosToolkit();

    toolkit.setProvider({ rpc: 'test' });
    expect(toolkit.tz).toBeInstanceOf(RpcTzProvider);
    expect(toolkit.contract).toBeInstanceOf(RpcContractProvider);
  });
});
