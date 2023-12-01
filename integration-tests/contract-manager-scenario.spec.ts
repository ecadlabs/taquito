import { CONFIGS } from './config';
import { managerCode } from './data/manager_code';
import { DefaultContractType, MANAGER_LAMBDA, OriginationOperation } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownContract }) => {
  const Tezos = lib;

  let op: OriginationOperation;
  let contract: DefaultContractType;
  describe(`Test TZ Manager through contract api: ${rpc}`, () => {
    beforeAll(async () => {
      await setup();

      op = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      });

      contract = await op.contract();
    });

    it('Verify contract.transfer scenarios: implicit transfer to and from contracts, set and remove delegate, and transfer from a contract to a contract', async () => {
      const opTransferToContract = await Tezos.contract.transfer({ to: contract.address, amount: 1 });
      await opTransferToContract.confirmation();
      expect(op.status).toEqual('applied')
      // Transfer from contract (kt1_alice) to implicit account (tz1)
      // We pass a lambda function to the kt1_alice contracts `do` entrypoint. The lambda code causes the contract to transfer
      // the specified number (50) of mutez to the target address.
      const opTransfer = await contract.methods.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)).send({ amount: 0 });
      await opTransfer.confirmation();
      expect(opTransfer.status).toEqual('applied')
      // Set delegate on contract kt1_alice by passing a lambda function to kt1_alice's `do` entrypoint
      const opSetDelegate = await contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)).send({ amount: 0 });
      await opSetDelegate.confirmation();
      expect(opSetDelegate.status).toEqual('applied')
      // Remove delegate on contract kt1_alice by passing a lambda function to kt1_alice's `do` entrypoint
      const removeDelegateOp = await contract.methods.do(MANAGER_LAMBDA.removeDelegate()).send({ amount: 0 });
      await removeDelegateOp.confirmation();
      expect(removeDelegateOp.status).toEqual('applied')
      // Transfer from contract (kt1_alice) to contract (kt1 bob)
      // Notice that we are instructing the kt1_alice contract to send 1 token to kt1_bob. The transfer value is passed to the
      // lambda helper function. The transfer amount in the actual transfer operation is 0. We are not transferring the token
      // in the transfer operation, we are instructing the contract to transfer the token using the `do` entrypoint of the kt1_alice
      // contract.
      const transferToContractOp = await contract.methods.do(MANAGER_LAMBDA.transferToContract(knownContract, 1)).send({ amount: 0 });
      await transferToContractOp.confirmation();
      expect(transferToContractOp.status).toEqual('applied')

      try {
        await contract.methods.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50 * 1000000)).send({ amount: 0 });
        fail('Should throw during transfer with amount higher than balance')
      } catch (ex: any) {
        expect(ex.message).toContain('tez.subtraction_underflow')
      }
    });
  });
});
