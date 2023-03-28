import { LocalForger } from "@taquito/local-forging";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, setup, createAddress }) => {
  const Tezos = lib;
  const forger = new LocalForger();

  describe(`Test taquito common util functions in context`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    })

    it('Verify toPreaplyParams returns executable params for preapplyOperations', async (done) => {
      const reciever = await createAddress();
      const pkh = await reciever.signer.publicKeyHash();
      const preparedTransfer = await Tezos.prepare.transaction({ amount: 1, to: pkh });

      const preapplyParams = await Tezos.prepare.toPreapply(preparedTransfer)

      const preapply = await Tezos.rpc.preapplyOperations(preapplyParams);

      expect(preapplyParams[0].contents).toEqual(preparedTransfer.opOb.contents)
      expect(preapplyParams[0].branch).toEqual(preparedTransfer.opOb.branch)


      if (preapply[0].contents[0].kind === 'reveal') {
        expect(preapply[0].contents[0].kind).toEqual('reveal');
        expect(preapply[0].contents[1].kind).toEqual('transaction');
      } else {
        expect(preapply[0].contents[0].kind).toEqual('transaction');
      }

      done();
    });

    it('Verify that toForge is executable for both local forger and rpc.forgeOperations', async (done) => {
      const reciever = await createAddress();
      const pkh = await reciever.signer.publicKeyHash();
      const preparedTransfer = await Tezos.prepare.transaction({ amount: 1, to: pkh });

      const forged = await forger.forge(Tezos.prepare.toForge(preparedTransfer));
      const rpcForged = await Tezos.rpc.forgeOperations(Tezos.prepare.toForge(preparedTransfer));

      expect(forged).toEqual(rpcForged);

      done();
    })
  });
})
