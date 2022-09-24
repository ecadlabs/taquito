import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;
    const kathmandunetAndAlpha = (protocol === Protocols.PtKathman || protocol === Protocols.ProtoALpha) ? test : test.skip;
    describe(`Test injecting more than one manager operation in a block: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        kathmandunetAndAlpha('Verify that doing transfers without awaiting the confirmation after each will fail', async (done) => {
            try {
                const op1 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 1 });
                const op2 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 });

                await op1.confirmation();
                await op2.confirmation();

            } catch (error: any) {
                expect(error.message).toContain('Only one manager operation per manager per block allowed');
            }
            done();
        })
    });
})
