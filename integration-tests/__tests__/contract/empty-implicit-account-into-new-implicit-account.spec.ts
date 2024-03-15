import { CONFIGS } from "../../config";
import { COST_PER_BYTE } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {

    const Tezos = lib;

    describe(`Test emptying a revealed implicit account into a new implicit account through contract api using: ${rpc}`, () => {

        beforeEach(async () => {
            await setup()
        })

        it('Verify that a new unrevealed implicit account can be created from the sender account and the sender account can be emptied into the created one.', async () => {
            const receiver = await createAddress();
            const receiver_pkh = await receiver.signer.publicKeyHash();

            // create and fund the account we want to empty
            const sender = await createAddress();
            const sender_pkh = await sender.signer.publicKeyHash();
            const op = await Tezos.contract.transfer({ to: sender_pkh, amount: 1 });
            await op.confirmation();

            // Sending 1 token from the account we want to empty
            // This will do the reveal operation automatically
            const op2 = await sender.contract.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.1 });
            await op2.confirmation();

            const balance = await Tezos.tz.getBalance(sender_pkh);

            const estimate = await sender.estimate.transfer({
                to: receiver_pkh,
                amount: 0.5,
            });

            // // Emptying the account
            const totalFees = estimate.suggestedFeeMutez + estimate.burnFeeMutez - (20 * COST_PER_BYTE); // 20 is storage buffer
            const maxAmount = balance.minus(totalFees).toNumber();

            const opTransfer = await sender.contract.transfer({
                to: receiver_pkh,
                mutez: true,
                amount: maxAmount,
                fee: estimate.suggestedFeeMutez,
                gasLimit: estimate.gasLimit,
                storageLimit: estimate.storageLimit
            });

            await opTransfer.confirmation();
            const finalBalance = await Tezos.tz.getBalance(sender_pkh);

            expect(finalBalance.toString()).toEqual("0")

        });
    });
})
