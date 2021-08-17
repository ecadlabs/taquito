import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from "@taquito/taquito";

const provider = 'https://api.tez.ie/rpc/granadanet';
const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
const Tezos = new TezosToolkit(provider);
Tezos.setSignerProvider( signer );

CONFIGS().forEach(({ rpc, setup }) => {
  const test = require('jest-retries');
  
  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })

    test('originates a token contract and mints some tokens', 2, async (done: () => void) => {
      // TODO: Fails when using ephemeral keys
      try{
        const op = await Tezos.contract.originate({
          balance: "1",
          code: tokenCode,
          init: tokenInit(await signer.publicKeyHash()),
          fee: 150000,
          storageLimit: 10000,
          gasLimit: 400000,
        })
        await op.confirmation()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        const contract = await op.contract();
        const opMethod = await contract.methods.mint(await signer.publicKeyHash(), 100).send();

        await opMethod.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        done();
    } catch (ex) {
      console.log(JSON.stringify(ex))
    }
    });
  });
})
