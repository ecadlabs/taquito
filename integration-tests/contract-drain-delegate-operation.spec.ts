import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  const signer = new InMemorySigner('edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4');
  Tezos.setSignerProvider(signer);
  const flextesanet = (rpc === 'http://0.0.0.0:20001') ? it : it.skip

  describe(`Test drain delegate with defaul consensus key through contract api using: ${rpc}`, () => {
    let delegate: TezosToolkit
    let delegatePkh: string
    let destinationPkh: string
    beforeAll(async (done) => {
      await setup(true)

      try {
        // delegate = await createAddress()
        // delegatePkh = await delegate.signer.publicKeyHash()
        // const fund = await Tezos.contract.transfer({ amount: 5, to: delegatePkh})
        // await fund.confirmation();
        // const register = await Tezos.contract.registerDelegate({})
        // await register.confirmation()
        
        const destination = await createAddress()
        destinationPkh = await destination.signer.publicKeyHash()
        const consensus = await delegate.contract.updateConsensusKey({pk: await destination.signer.publicKey()})
        await consensus.confirmation()
      } catch(e) {
        console.log(JSON.stringify(e))
      }
      done();
    })
    flextesanet('Verify that new Account can be created, registered as delegate and drained itself', async (done) => {

      expect((await Tezos.rpc.getBalance(await signer.publicKeyHash())).toNumber()).toBeGreaterThan(0)
      await Tezos.contract.drainDelegate({
        consensus_key: destinationPkh,
        delegate: await signer.publicKeyHash(),
        destination: destinationPkh,
      })
      expect((await delegate.tz.getBalance(await signer.publicKeyHash())).toNumber).toEqual(0)
      done();
    });
  });
})
