import { CONFIGS } from '../../config';
import { tokenCode } from '../../data/tokens';
import { tokenBigmapCode } from '../../data/token_bigmap';
import { MichelsonMap, BigMapAbstraction } from '@taquito/taquito';
import { Schema } from '@taquito/michelson-encoder';
import BigNumberJs from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;
const BigNumber = BigNumberJs;

interface TokenValue {
  0: BigNumber;
  1: MichelsonMap<string, BigNumber>;
}

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test finite big-map value reads through contract api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 });
    });

    it('reads two pages of a populated big map at one pinned block hash', async () => {
      const bigMapInit = new MichelsonMap();
      bigMapInit.set(await Tezos.signer.publicKeyHash(), { 0: '1', 1: new MichelsonMap() });
      bigMapInit.set('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', { 0: '2', 1: new MichelsonMap() });
      bigMapInit.set('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', { 0: '3', 1: new MichelsonMap() });
      const op = await Tezos.contract.originate({
        code: tokenCode,
        storage: { 0: bigMapInit, 1: await Tezos.signer.publicKeyHash(), 2: true, 3: '3' },
      });
      await op.confirmation();
      // Pin reads to the inclusion level so load-balanced nodes agree on the snapshot.
      const level = op.includedInBlock;
      const contract = await op.contract();
      const bigMap = (await contract.storage<{ 0: BigMapAbstraction }>())['0'];

      const first = await bigMap.getValuesPage<TokenValue>({ offset: 0, length: 2, block: level });
      const second = await bigMap.getValuesPage<TokenValue>({
        offset: 2,
        length: 2,
        block: first.blockHash,
      });
      expect(second.blockHash).toBe(first.blockHash);
      expect(first.values).toHaveLength(2);
      expect(second.values).toHaveLength(1);
      // Ordering is unspecified, so compare the union of both pages.
      const amounts = [...first.values, ...second.values].map((value) => value[0].toFixed());
      expect(amounts.sort()).toEqual(['1', '2', '3']);

      const values = await bigMap.listValues<TokenValue>({ length: 3, block: level });
      expect(values.map((value) => value[0].toFixed()).sort()).toEqual(['1', '2', '3']);

      expect(await bigMap.isEmpty(first.blockHash)).toBe(false);
    });

    it('reports an empty big map as empty', async () => {
      const op = await Tezos.contract.originate({
        code: tokenBigmapCode,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          accounts: new MichelsonMap(),
          totalSupply: '0',
        },
      });
      await op.confirmation();
      const contract = await op.contract();
      const { accounts } = await contract.storage<{ accounts: BigMapAbstraction }>();
      expect(await accounts.isEmpty(op.includedInBlock)).toBe(true);
    });
  });

  describe(`Test finite big-map value reads of a missing big map using: ${rpc}`, () => {
    it('keeps the node 404 visible for a big-map id that does not exist', async () => {
      // Assumes the test network has not allocated this many big maps.
      const missing = new BigMapAbstraction(
        new BigNumber('999999999'),
        new Schema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] }),
        Tezos.contract
      );
      await expect(missing.isEmpty()).rejects.toMatchObject({ status: 404 });
      await expect(missing.listValues()).rejects.toMatchObject({ status: 404 });
      await expect(missing.getValuesPage()).rejects.toMatchObject({ status: 404 });
    });
  });
});
