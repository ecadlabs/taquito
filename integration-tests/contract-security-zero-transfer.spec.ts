import { CONFIGS } from './config';
import { RpcClient } from '@taquito/rpc';

const client = new RpcClient(' https://jakartanet.ecadinfra.com');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const amount = 0;
  const address = 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys';

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();

      done();
    });

    it('Verify that Transactions of 0ꜩ towards a contract without code are forbidden', async () => {
      try {
        const op = await Tezos.contract.originate({
          code: `{ parameter address ;
                      storage unit ;
                      code { UNPAIR ;
                             CONTRACT unit ;
                             IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                             PUSH mutez 0 ;
                             UNIT ;
                             TRANSFER_TOKENS ;
                             SWAP ;
                             NIL operation ;
                             DIG 2 ;
                             CONS ;
                             PAIR } }
                          `,
          init: { prim: 'Unit' },
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        Tezos.contract
          .at(contract.address)
          .then((contract) => {
            const i = 0;

            console.log(`Transferring ${i}...`);
            return contract.methods.Transfer(i).send();
          })
          .then((op) => {
            console.log(`Waiting for ${op.hash} to be confirmed...`);
            return op.confirmation().then(() => op.hash);
          })
          .then((hash) => console.log(`Operation injected: https://jakarta.tzstats.com/${hash}`))
          .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));

        // const sender = await createAddress();
        // const sender_pkh = await sender.signer.publicKeyHash();
        // // Fund the new address
        // const opTransfer = await Tezos.contract.transfer({ to: sender_pkh, amount: 1 });
        // await opTransfer.confirmation();

        // const op2 = await contract.methods.default(3).send();
        // await op2.confirmation();
      } catch (error: any) {
        console.log(error.message);
        expect(error.message).toContain('proto.013-PtJakart.contract.empty_transaction');
      }
    });
  });
});
