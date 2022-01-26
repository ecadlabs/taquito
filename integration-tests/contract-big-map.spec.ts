import { CONFIGS } from './config';
import { storageContract } from './data/storage-contract';
import { MichelsonMap, BigMapAbstraction, MichelCodecPacker } from '@taquito/taquito';
import { tokenBigmapCode } from './data/token_bigmap';
import { tokenCode, tokenInit } from './data/tokens';
import BigNumber from 'bignumber.js';

CONFIGS().forEach(({ lib, rpc, setup, knownBigMapContract }) => {
  const Tezos = lib;
  describe(`Test contract with multiple bigmap variations using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    it('originates a contract and initializes bigmaps with variants of data', async (done) => {
      const op = await Tezos.contract.originate({
        balance: '1',
        code: storageContract,
        storage: {
          map1: MichelsonMap.fromLiteral({
            tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD: 1,
            KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv: 2,
            tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2: 2,
            tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS: 3,
          }),
          map2: MichelsonMap.fromLiteral({
            '12': 3,
            '2': 1,
            '3': 2,
            '1': 2,
            '4': 3,
          }),
          map3: MichelsonMap.fromLiteral({
            '2': 1,
            '3': 2,
            '12': 3,
            '1': 2,
            '4': 3,
          }),
          map4: MichelsonMap.fromLiteral({
            zz: 1,
            aa: 2,
            ab: 2,
            cc: 3,
          }),
          map5: MichelsonMap.fromLiteral({
            aaaa: 1,
            aa: 1,
            ab: 2,
            '01': 2,
            '22': 3,
          }),
          map6: MichelsonMap.fromLiteral({
            '2': 1,
            '3': 2,
            '12': 3,
            '1': 2,
            '4': 3,
          }),
          map7: MichelsonMap.fromLiteral({
            '2018-04-23T10:26:00.996Z': 1,
            '2017-04-23T10:26:00.996Z': 2,
            '2019-04-23T10:26:00.996Z': 2,
            '2015-04-23T10:26:00.996Z': 3,
          }),
        },
      });

      await op.contract();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });

    test(
      'originates a contract with empty bigmap and fetches the storage/bigmap',
      async (done: () => void) => {
        const signer = await Tezos.signer.publicKeyHash();

        const bigMapInit = new MichelsonMap();
        bigMapInit.set(signer, { 0: '1', 1: new MichelsonMap() });
        bigMapInit.set('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', { 0: '2', 1: new MichelsonMap() });
        bigMapInit.set('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', { 0: '3', 1: new MichelsonMap() });
        bigMapInit.set('tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2', { 0: '4', 1: new MichelsonMap() });
        // Deploy a contract with a big map
        const op = await Tezos.contract.originate({
          code: tokenCode,
          storage: {
            0: bigMapInit,
            1: signer,
            2: true,
            3: '3',
          },
        });
        const contract = await op.contract();

        interface StorageType {
          0: BigMapAbstraction;
          1: string;
          2: boolean;
          3: BigNumber;
        }
        interface BigMapVal {
          0: BigNumber;
          1: MichelsonMap<string, BigNumber>;
        }

        // Fetch the storage of the newly deployed contract
        const storage = await contract.storage<StorageType>();

        // First property is the big map abstraction (This contract does not have annotations so we access by index)
        const bigMap = storage['0'];

        // Fetch multiples keys
        const bigMapValues = await bigMap.getMultipleValues<BigMapVal>([
          'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1',
          'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
          'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          'tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2',
        ]);
        expect(bigMapValues.get('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')!['0'].toString()).toEqual(
          '2'
        );
        expect(bigMapValues.get('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')!['1']).toEqual(
          expect.objectContaining(new MichelsonMap())
        );

        expect(bigMapValues.get('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD')!['0'].toString()).toEqual(
          '3'
        );
        expect(bigMapValues.get('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD')!['1']).toEqual(
          expect.objectContaining(new MichelsonMap())
        );

        expect(bigMapValues.has('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toBeTruthy();
        expect(bigMapValues.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toBeUndefined();

        expect(bigMapValues.get('tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2')!['0'].toString()).toEqual(
          '4'
        );
        expect(bigMapValues.get('tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2')!['1']).toEqual(
          expect.objectContaining(new MichelsonMap())
        );

        // Specify a level
        const { header } = await Tezos.rpc.getBlock();

        // Fetch multiples keys
        const bigMapValuesWithLevel = await bigMap.getMultipleValues<BigMapVal>(
          ['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD'],
          header.level
        );
        expect(
          bigMapValuesWithLevel.get('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')!['0'].toString()
        ).toEqual('2');
        expect(bigMapValuesWithLevel.get('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')!['1']).toEqual(
          expect.objectContaining(new MichelsonMap())
        );

        expect(
          bigMapValuesWithLevel.get('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD')!['0'].toString()
        ).toEqual('3');
        expect(bigMapValuesWithLevel.get('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD')!['1']).toEqual(
          expect.objectContaining(new MichelsonMap())
        );

        done();
      }
    );
    it('Originate contract and init bigmap to empty map', async (done) => {
      const op = await Tezos.contract.originate({
        balance: '1',
        code: tokenBigmapCode,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          accounts: new MichelsonMap(),
          totalSupply: '0',
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });
    it('originates a contract with empty bigmap and fetches the storage/bigmap', async (done) => {
      // Deploy a contract with a big map
      const op = await Tezos.contract.originate({
        balance: '1',
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      });
      const contract = await op.contract();

      // Fetch the storage of the newly deployed contract
      const storage: any = await contract.storage();

      // First property is the big map abstraction (This contract does not have annotations so we access by index)
      const bigMap = storage['0'];

      // Fetch the key (current pkh that is running the test)
      const bigMapValue = await bigMap.get(await Tezos.signer.publicKeyHash());
      expect(bigMapValue['0'].toString()).toEqual('2');
      expect(bigMapValue['1']).toEqual(expect.objectContaining(new MichelsonMap()));
      done();
    });

    it('Return undefined when BigMap key is not found', async (done) => {
      const myContract = await Tezos.contract.at(knownBigMapContract);
      const contractStorage: any = await myContract.storage();
      const value = await contractStorage.ledger.get('tz1NortRftucvAkD1J58L32EhSVrQEWJCEnB');
      expect(value).toBeUndefined();
      done();
    });

    it('originates a contract with empty bigmap and fetches value in the bigMap using local packing', async (done) => {
      // Configure the Tezostoolkit to use the MichelCodecPacker (the data will be packed locally instead of using the rpc)
      Tezos.setPackerProvider(new MichelCodecPacker());

      // Deploy a contract with a big map
      const op = await Tezos.contract.originate({
        balance: '1',
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      });
      const contract = await op.contract();

      // Fetch the storage of the newly deployed contract
      const storage: any = await contract.storage();

      // First property is the big map abstraction (This contract does not have annotations so we access by index)
      const bigMap = storage['0'];

      // Fetch the key (current pkh that is running the test)
      const bigMapValue = await bigMap.get(await Tezos.signer.publicKeyHash());
      expect(bigMapValue['0'].toString()).toEqual('2');
      expect(bigMapValue['1']).toEqual(expect.objectContaining(new MichelsonMap()));
      done();
    });
  });
});
