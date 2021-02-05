import { CONFIGS } from "./config";
import { ticketCode, ticketCode3, ticketCode4, ticketStorage, ticketStorage3, ticketStorage4 } from '../packages/taquito-local-forging/test/data/code_with_ticket';
import { BigMapAbstraction, MichelsonMap, Protocols } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { encodeExpr } from "@taquito/utils";
import { nftWallet } from "./data/nft_wallet_tq";
import { Schema } from "@taquito/michelson-encoder";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;

    const edonet = (protocol === Protocols.PtEdoTez) ? test : test.skip;

    describe(`Test origination of a token contract using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        test('Originates a contract having ticket', async (done) => {

    Tezos.setRpcProvider('https://api.tez.ie/rpc/edonet')
            await importKey(
                Tezos,
                'peqjckge.qkrrajzs@tezos.example.org',
                'y4BX7qS1UE',
                [
                    'skate',
                    'damp',
                    'faculty',
                    'morning',
                    'bring',
                    'ridge',
                    'traffic',
                    'initial',
                    'piece',
                    'annual',
                    'give',
                    'say',
                    'wrestle',
                    'rare',
                    'ability',
                ].join(' '),
                '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
            );

/*            const signer = await Tezos.signer.publicKeyHash();
            console.log(signer)
            // Alice nft-wallet: KT1TqRWsH2tb1pq6UkgMwKYKJrHvWhCMVrxU
            // Boob nft-wallet: KT1XcfNoVyzvQg1bkM1yFAWdUhjyHc9Hox4r
            const op = await Tezos.contract.originate({
                code: nftWallet,
                storage: {
                    admin: signer,
                    tickets: new MichelsonMap(),
                    current_id: 0,
                    token_metadata: new MichelsonMap()
                }            
                });

//init: {"prim":"Pair","args":[{"string": signer},{"prim": "Pair", "args": [{prim: 'Elt', args: []}]},{"prim": "Pair", args: [{"int":"0"},{prim: 'Elt', args: []}]}]}


            await op.confirmation();
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            console.log(op.contractAddress)

            //const contract = await op.contract();
            //console.log('contract', contract); */
        
 
const { packed } = await Tezos.rpc.packData({ data: {int:'0' }, type: { prim: "nat" } });
console.log(packed)
  
      const encodedExpr = encodeExpr(packed);
      console.log(encodedExpr)

            const bigMapValue = await Tezos.rpc.getBigMapExpr('142', encodedExpr);
            console.log(bigMapValue)

           const contract = await Tezos.contract.at('KT1QQukCBULzFu6samB5FpbLNBXmNzArSpTs');
            const sto: any = await contract.storage();
            const ticketbg: BigMapAbstraction = sto['tickets']
            console.log(await ticketbg.get('0'))
            console.log('storage:', sto)
            console.log('JSON.stringify(sto)',JSON.stringify(sto))
            const schema = new Schema(sto);
            console.log('schema', schema)

            done()

        });
    });
})
