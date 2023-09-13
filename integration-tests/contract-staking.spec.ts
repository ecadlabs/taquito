import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
    const Tezos = lib;
    describe(`Test staking through contract API using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup(true)
            done()
          });
          it('Should be able to stake', async (done) => {
            const delegate = knownBaker
            const pkh = await Tezos.signer.publicKeyHash();
            const op = await Tezos.contract.stake({
                baker: delegate,
                amount: 0.1,
                parameter: {
                    entrypoint: "stake",
                    value: { "prim": "Unit" }
                }
            });
            await op.confirmation()
            expect(op.hash).toBeDefined();
            console.log(op);
            done();
          });
    });
});