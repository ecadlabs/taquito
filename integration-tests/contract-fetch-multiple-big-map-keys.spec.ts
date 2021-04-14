import { CONFIGS } from './config';
import { tokenCode } from './data/tokens';
import { MichelsonMap, BigMapAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test accessing big map abstraction by index using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });
        it('originates a contract with empty bigmap and fetches the storage/bigmap', async (done) => {
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
                    3: '3'
                }
            });
            const contract = await op.contract();

            interface StorageType {
                0: BigMapAbstraction,
                1: string,
                2: boolean,
                3: BigNumber
            }
            interface BigMapVal {
                0: BigNumber,
                1: MichelsonMap<string, BigNumber>
            }

            // Fetch the storage of the newly deployed contract
            const storage = await contract.storage<StorageType>();

            // First property is the big map abstraction (This contract does not have annotations so we access by index)
            const bigMap = storage['0'];

            // Fetch multiples keys
            const bigMapValues = await bigMap.getMultipleValues<BigMapVal>(['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', 'tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2']);
            expect(bigMapValues['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1']!['0'].toString()).toEqual('2');
            expect(bigMapValues['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1']!['1']).toEqual(expect.objectContaining(new MichelsonMap()));

            expect(bigMapValues['tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD']!['0'].toString()).toEqual('3');
            expect(bigMapValues['tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD']!['1']).toEqual(expect.objectContaining(new MichelsonMap()));

            expect(bigMapValues['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn']).toBeUndefined();

            expect(bigMapValues['tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2']!['0'].toString()).toEqual('4');
            expect(bigMapValues['tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2']!['1']).toEqual(expect.objectContaining(new MichelsonMap()));


            // Specify a level
            const { header } = await Tezos.rpc.getBlock();

            // Fetch multiples keys
            const bigMapValuesWithLevel = await bigMap.getMultipleValues<BigMapVal>(['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD'], header.level);
            expect(bigMapValuesWithLevel['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1']!['0'].toString()).toEqual('2');
            expect(bigMapValuesWithLevel['tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1']!['1']).toEqual(expect.objectContaining(new MichelsonMap()));

            expect(bigMapValuesWithLevel['tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD']!['0'].toString()).toEqual('3');
            expect(bigMapValuesWithLevel['tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD']!['1']).toEqual(expect.objectContaining(new MichelsonMap()));

            done();
        });
    });
});
