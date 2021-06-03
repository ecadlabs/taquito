import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originate contract and set bool prop on init and via call using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a contract with bool storage init to true then sets to false', async (done) => {
      const op = await Tezos.contract.originate({
        code: `parameter (pair bls12_381_fr bls12_381_fr);
        storage (option (bls12_381_fr));
        code {CAR; UNPAIR; ADD; SOME; NIL operation; PAIR}
        `,
        storage: '0a00000000000000000000000000000000000000000000000000000000000000',
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();
      console.log(await contract.storage())
      console.log(op.contractAddress)

      done();
    });
  });
})
