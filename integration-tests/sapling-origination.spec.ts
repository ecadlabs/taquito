const codeContract = {
    balance: '0',
    script: {
        code: [
            {
                prim: 'parameter',
                args: [
                    {
                        prim: 'pair',
                        args: [
                            { prim: 'sapling_transaction', args: [{ int: '8' }] },
                            { prim: 'sapling_state', args: [{ int: '8' }] }
                        ]
                    }
                ]
            },
            { prim: 'storage', args: [{ prim: 'sapling_state', args: [{ int: '8' }] }] },
            {
                prim: 'code',
                args: [
                    [
                        { prim: 'UNPAIR' },
                        { prim: 'UNPAIR' },
                        { prim: 'DIP', args: [{ int: '2' }, [{ prim: 'DROP' }]] },
                        { prim: 'SAPLING_VERIFY_UPDATE' },
                        [{ prim: 'IF_NONE', args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []] }],
                        { prim: 'UNPAIR' },
                        { prim: 'DROP' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' }
                    ]
                ]
            }
        ],
        storage: { int: '56' }
    }
}

import { CONFIGS } from "./config";
import { Protocols } from "@taquito/taquito";
import { importKey } from "@taquito/signer";


CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;

    const edonet = (protocol === Protocols.PtEdoTez) ? test : test.skip;

    describe(`Test origination of a token contract using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        test('Originates a contract having ticket', async (done) => {
try{
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

            const signer = await Tezos.signer.publicKeyHash();
            console.log(signer)
            const op = await Tezos.contract.originate({
                code: codeContract.script.code,
                storage: 'test'
            });
            //init: `{}`

            await op.confirmation();
            console.log(op.contractAddress)
        } catch(e) {console.log(e)}
            done()

        });
    });
})
