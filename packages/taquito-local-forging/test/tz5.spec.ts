import { OperationContentsReveal, OperationContentsTransaction, OpKind } from '@taquito/rpc';
import { tz5 } from '../../../test-fixtures/tz5';
import { ForgeParams, localForger, Uint8ArrayConsumer } from '../src/taquito-local-forging';
import { publicKeyDecoder, publicKeyHashDecoder } from '../src/codec';

const reveal: OperationContentsReveal = {
  kind: OpKind.REVEAL,
  source: tz5.publicKeyHash,
  fee: '6000',
  counter: '1',
  gas_limit: '2000',
  storage_limit: '0',
  public_key: tz5.publicKey,
};
const transaction: OperationContentsTransaction = {
  kind: OpKind.TRANSACTION,
  source: tz5.publicKeyHash,
  fee: '6000',
  counter: '2',
  gas_limit: '3000',
  storage_limit: '0',
  amount: '1000',
  destination: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
};
const cases: { name: string; params: ForgeParams; unsigned: string }[] = [
  {
    name: 'reveal without a proof',
    params: { branch: tz5.operations.reveal.branch, contents: [reveal] },
    unsigned: tz5.operations.reveal.unsigned,
  },
  {
    name: 'transfer',
    params: { branch: tz5.operations.transfer.branch, contents: [transaction] },
    unsigned: tz5.operations.transfer.unsigned,
  },
  {
    name: 'reveal and two transfers',
    params: {
      branch: tz5.operations.batch.branch,
      contents: [reveal, transaction, { ...transaction, counter: '3', amount: '2000' }],
    },
    unsigned: tz5.operations.batch.unsigned,
  },
];

describe.each(cases)('tz5 $name', ({ params, unsigned }) => {
  it('forges exactly the bytes produced by Octez', async () => {
    expect(await localForger.forge(params)).toBe(unsigned);
  });

  it('parses the Octez bytes into the original operation', async () => {
    expect(await localForger.parse(unsigned)).toEqual(params);
  });
});

describe('tz5 binary decoding boundaries', () => {
  it('consumes a full public key without consuming the next field', () => {
    const input = Uint8ArrayConsumer.fromHexString(tz5.packed.publicKey.slice(12) + 'ff');
    expect(publicKeyDecoder(input)).toBe(tz5.publicKey);
    expect(input.consume(1)).toEqual(new Uint8Array([255]));
    expect(input.length()).toBe(0);
  });

  it('rejects a truncated public key', () => {
    expect(() =>
      publicKeyDecoder(Uint8ArrayConsumer.fromHexString(tz5.packed.publicKey.slice(12, -2)))
    ).toThrow();
  });

  it('rejects a truncated public key hash', () => {
    expect(() =>
      publicKeyHashDecoder(Uint8ArrayConsumer.fromHexString(tz5.packed.keyHash.slice(12, -2)))
    ).toThrow();
  });
});
