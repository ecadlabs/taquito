// Exercise the package root and emitted CommonJS file, not TypeScript interop.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default async function ({ assert, load }) {
  const sapling = await load('@taquito/sapling');
  const {
    SaplingTransactionBuilder: CommonJsBuilder,
  } = require('@taquito/sapling/dist/lib/sapling-tx-builder/sapling-transactions-builder');
  const { SaplingForger } = sapling;
  const { default: BigNumber } = await import('bignumber.js');
  const contractAddress = 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC';
  const chainId = 'NetXdQprcVkpaWU';
  // PACK(address) fixture checked with Octez; includes the complete entrypoint.
  const boundData = Buffer.from(
    '050a000000220167ea84b1082efb9619d6ce04e033633906636e1d00726563656976652570617274',
    'hex'
  );
  // Independent keyed BLAKE2b-256 vectors from Python hashlib.
  const expectedHashes = [
    'c7554e2613871fe5c7812f27fcc31daf2e142ea87cbe201f331d49f1a8fd984c',
    '13e0489fca89771698bd82b21a9ced20d49d8c5faa49cadd3c26e8778d05d6a2',
  ];
  for (const Builder of [sapling.SaplingTransactionBuilder, CommonJsBuilder]) {
    assert.equal(typeof Builder, 'function');
    const signedHashes = [];
    let expectedBalance = '1';
    const builder = new Builder(
      { saplingSigner: {} },
      new SaplingForger(),
      { contractAddress, memoSize: 8 },
      { getChainId: async () => chainId },
      {
        randR: async () => Buffer.alloc(32),
        withProvingContext: async (callback) => callback(1),
        createBindingSignature: async (context, balance, hash) => {
          assert.equal(context, 1);
          assert.equal(balance, expectedBalance);
          signedHashes.push(Buffer.from(hash));
          return Buffer.alloc(64, 1);
        },
      }
    );
    for (const data of [boundData, Buffer.alloc(0)]) {
      const signature = await builder.createBindingSignature({
        saplingContext: 1,
        inputs: [],
        outputs: [],
        balance: new BigNumber(1),
        boundData: data,
      });
      assert.deepEqual(signature, Buffer.alloc(64, 1));
      assert.deepEqual(
        signedHashes.at(-1),
        Buffer.from(expectedHashes[signedHashes.length - 1], 'hex')
      );
    }
    assert.notDeepEqual(signedHashes[0], signedHashes[1]);
    expectedBalance = '-1';
    const description = await builder.createShieldedTx([], new BigNumber(1), boundData);
    assert.equal(description.balance.toFixed(), '-1');
    assert.deepEqual(signedHashes[2], Buffer.from(expectedHashes[0], 'hex'));
    const forged = new SaplingForger().forgeSaplingTransaction({
      ...description,
      root: '00'.repeat(32),
      boundData,
    });
    assert.deepEqual(
      Buffer.from(forged.subarray(-boundData.length - 4)),
      Buffer.concat([Buffer.from('00000028', 'hex'), boundData])
    );
  }
}
