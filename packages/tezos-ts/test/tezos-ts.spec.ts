import { TezosToolkit } from '../src/tezos-ts';
import { RpcTzProvider } from '../src/tz/rpc-tz-provider';
import { RpcContractProvider } from '../src/contract/rpc-contract-provider';
import { InMemorySigner } from '@tezos-ts/signer';

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

  it('should use InMemorySigner when importKey is called', async done => {
    const toolkit = new TezosToolkit();

    expect(toolkit.signer).toEqual({});
    toolkit.importKey('p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
    expect(toolkit.signer).toBeInstanceOf(InMemorySigner);
    expect(await toolkit.signer.publicKeyHash()).toEqual('tz3Lfm6CyfSTZ7EgMckptZZGiPxzs9GK59At');

    done();
  });
});
