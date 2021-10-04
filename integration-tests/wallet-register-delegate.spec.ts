import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;
    describe(`Test  register delegate: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup(true);
            done();
        });
        it('registers the current address as delegate', async (done) => {
            try {
                const pkh = await Tezos.wallet.pkh();
                const op = await Tezos.wallet.registerDelegate().send();

                const conf1 = await op.confirmation();
                const currentConf1 = await op.getCurrentConfirmation();
                expect(currentConf1).toEqual(1);
                expect(conf1).toEqual(
                    expect.objectContaining({
                        expectedConfirmation: 1,
                        currentConfirmation: 1,
                        completed: true
                    })
                );
                expect(op.opHash).toBeDefined();

                const account = await Tezos.rpc.getDelegate(pkh);
                expect(account).toEqual(pkh);
            } catch (ex: any) {
                if (protocol === Protocols.PsFLorena) {
                    expect(ex.message).toMatch('delegate.unchanged')
                } else {
                    // When running tests more than one time with the same faucet key, the account is already delegated to the given delegate
                    expect(ex.message).toMatch('delegate.already_active')
                }
            }
            done();
        });
    });
});
