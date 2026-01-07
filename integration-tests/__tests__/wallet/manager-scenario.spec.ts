import { CONFIGS } from '../../config';
import { managerCode } from '../../data/manager_code';
import { DefaultWalletType, MANAGER_LAMBDA, OriginationWalletOperation } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownContract, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test

  let op: OriginationWalletOperation;
  let contract: DefaultWalletType;

  describe(`Test TZ Manager through wallet api: ${rpc}`, () => {
    beforeAll(async () => {
      await setup();

      op = await Tezos.wallet.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      }).send();

      contract = await op.contract();
    });

    it('should be able to transfer to originated account', async () => {
      // Transfer from implicit account (tz1) to contract (kt1_alice)
      // A regular transfer operation is made. No smart contract calls required for this scenario.
      const op = await Tezos.wallet.transfer({ to: contract.address, amount: 0.01 }).send();
      await op.confirmation();

      expect(op.opHash).toBeDefined();
    });

    it('should be able to transfer from contract to implicit account', async () => {
      // Transfer from contract (kt1_alice) to implicit account (tz1)
      // We pass a lambda function to the kt1_alice contracts `do` entrypoint. The lambda code causes the contract to transfer
      // the specified number (50) of mutez to the target address.
      const op = await contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 5)).send({ amount: 0 })
      await op.confirmation();

      expect(op.opHash).toBeDefined();
    });

    notTezlinknet('should be able to set delegate from contract', async () => {
      // Set delegate on contract kt1_alice by passing a lambda function to kt1_alice's `do` entrypoint
      const op = await contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)).send({ amount: 0 })
      await op.confirmation();

      expect(op.opHash).toBeDefined();
    });

    notTezlinknet('should be able to remove delegate from contract', async () => {
      // Remove delegate on contract kt1_alice by passing a lambda function to kt1_alice's `do` entrypoint
      const op = await contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()).send({ amount: 0 })
      await op.confirmation();

      const account = await Tezos.rpc.getDelegate(knownBaker)
      expect(account).toEqual(knownBaker)
    });

    it('should be able to transfer from contract to contract', async () => {
      // Transfer from contract (kt1_alice) to contract (kt1 bob)
      // Notice that we are instructing the kt1_alice contract to send 1 token to kt1_bob. The transfer value is passed to the
      // lambda helper function. The transfer amount in the actual transfer operation is 0. We are not transferring the token
      // in the transfer operation, we are instructing the contract to transfer the token using the `do` entrypoint of the kt1_alice
      // contract.
      const op = await contract.methodsObject.do(MANAGER_LAMBDA.transferToContract(knownContract, 1)).send({ amount: 0 })
      await op.confirmation();

      expect(op.opHash).toBeDefined();
    });

    it('should throw an error when trying to transfer amount higher than balance', async () => {
      try {
        const op = await contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 50 * 1000000)).send({ amount: 0 });
        await op.confirmation();
      } catch (ex: any) {
        expect(ex.message).toContain('tez.subtraction_underflow');
      }
    });
  });
});
