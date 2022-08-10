import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress, protocol }) => {
    const Tezos = lib;
    const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;
    const kathmandunet = (protocol === Protocols.PtKathman) ? test : test.skip;

    describe(`Test emptying a revealed implicit account into a new implicit account using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        jakartanet('on J protocol, reveals the sender account, creates an unrevealed implicit account, empties the sender account into the created one', async (done) => {
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
            const totalFees = estimate.suggestedFeeMutez + estimate.burnFeeMutez;
            const maxAmount = balance.minus(totalFees).toNumber();
            // // Temporary fix, see https://gitlab.com/tezos/tezos/-/issues/1754
            // // we need to increase the gasLimit and fee returned by the estimation
            const gasBuffer = 500;
            const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;
            const increasedFee = (gasBuffer: number, opSize: number) => {
                 return (gasBuffer) * MINIMAL_FEE_PER_GAS_MUTEZ + opSize
             }

            const opTransfer = await sender.contract.transfer({
                 to: receiver_pkh,
                 mutez: true,
                 amount: maxAmount - increasedFee(gasBuffer, Number(estimate.opSize)),
                 fee: estimate.suggestedFeeMutez + increasedFee(gasBuffer, Number(estimate.opSize)), // baker fees
                 gasLimit: estimate.gasLimit + gasBuffer,
                 storageLimit: estimate.storageLimit 
             });

             await opTransfer.confirmation();
             const finalBalance = await Tezos.tz.getBalance(sender_pkh);

             expect(finalBalance.toString()).toEqual("0")

            done();
        });

        kathmandunet('on K protocol, reveals the sender account, creates an unrevealed implicit account, empties the sender account into the created one', async (done) => {
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
            const totalFees = estimate.suggestedFeeMutez + estimate.burnFeeMutez;
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

            done();
        });
    });
})