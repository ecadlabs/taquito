import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup, protocol, networkName }) => {
    const Tezos = lib;
    const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test
    describe(`Test delegate registration through wallet api: ${rpc}`, () => {
        beforeEach(async () => {
            await setup(true);
        });
        notTezlinknet('Verify that the current address can be registered as a delegate using wallet.registerDelegate', async () => {
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
                    // When running tests more than one time with the same key, the account is already delegated to the given delegate
                    expect(ex.message).toMatch('delegate.already_active')
                }
            }
        });
    });
});
