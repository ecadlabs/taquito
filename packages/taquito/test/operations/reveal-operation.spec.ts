import { defaultConfigConfirmation } from '../../src/context';
import { ForgedBytes, RevealOperation } from '../../src/operations';
import { RevealOperationBuilder } from '../helpers';

describe('RevealOperation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'oo51jb7sEvPkf7BaTSUW49QztcxgxufLVEj2PUfQ2uw6m61CKLc' }], [], [], []],
      header: {
        level: 185827,
      },
    });
  });
  it('should successfully retrieve all members of RevealOperation', () => {
    const txBuilder = new RevealOperationBuilder();

    const op = new RevealOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {
        fee: 2991,
        gas_limit: 26260,
        storage_limit: 257,
        public_key: 'p2pk',
      } as any,
      'source',
      fakeForgedBytes,
      [txBuilder.withResult({ status: 'applied' }).build()],
      fakeContext
    );

    expect(op.status).toEqual('applied');
    expect(op.consumedGas).toEqual('15953');
    expect(op.consumedMilliGas).toEqual('15952999');
    expect(op.errors).toEqual([]);
    expect(op.fee).toEqual(2991);
    expect(op.gasLimit).toEqual(26260);
    expect(op.hash).toEqual('ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj');
    expect(op.source).toEqual('source');
    expect(op.storageLimit).toEqual(257);
    expect(op.publicKey).toEqual('p2pk');
    expect(op.storageDiff).toEqual('0');
    expect(op.storageSize).toEqual('0');
  });
});
