import { CONFIGS } from "./config";
import { managerCode } from "./data/manager_code";
import { transferImplicit, setDelegate, removeDelegate, transferToContract } from "./manager-lambda";

CONFIGS.forEach(({ lib, rpc }) => {
    const Tezos = lib;
    describe(`Manager TZ: ${rpc}`, () => {
        it('test many manager transfers scenario', async (done) => {
            const op = await Tezos.contract.originate({
                balance: "1",
                code: managerCode,
                init: { "string": await Tezos.signer.publicKeyHash() },
            })
            const contract = await op.contract();
            expect(op.status).toEqual('applied')
            // Transfer from implicit account to contract
            const opTransferToContract = await Tezos.contract.transfer({ to: contract.address, amount: 1 })
            await opTransferToContract.confirmation();
            expect(op.status).toEqual('applied')
            // Transfer token from contract to implicit account
            const opTransfer = await contract.methods.do(transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)).send({ amount: 0 })
            await opTransfer.confirmation();
            expect(opTransfer.status).toEqual('applied')
            // Set delegate on contract
            const opSetDelegate = await contract.methods.do(setDelegate("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh")).send({ amount: 0 })
            await opSetDelegate.confirmation();
            expect(opSetDelegate.status).toEqual('applied')
            // Remove delegate op
            const removeDelegateOp = await contract.methods.do(removeDelegate()).send({ amount: 0 })
            await removeDelegateOp.confirmation();
            expect(removeDelegateOp.status).toEqual('applied')
            // Transfer from contract to contract 
            const transferToContractOp = await contract.methods.do(transferToContract("KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK", 1)).send({ amount: 0 })
            await transferToContractOp.confirmation();
            expect(transferToContractOp.status).toEqual('applied')
            done();
        })
    })
}