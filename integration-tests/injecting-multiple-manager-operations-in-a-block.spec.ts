import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    describe(`Test injecting more than one manager operation in a block: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('Verify that doing transfers without awaiting the confirmation after each will fail', async (done) => {
            try {
                const op1Promise = Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 1 });
                const op2Promise = Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 });

                const [op1, op2] = await Promise.all([op1Promise, op2Promise])

                await op1.confirmation();
                await op2.confirmation();

            } catch (error: any) {
                expect(error.message).toContain('Only one manager operation per manager per block allowed');
            }
            done();
        })
    });
})
