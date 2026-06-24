import { OpKind, TezosToolkit, UnitValue } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { ligoSample } from '../../data/ligo-simple-contract';

const gasBurnerMichelson = `
{ parameter nat ;
  storage unit ;
  code {
    UNPAIR ;
    DUP ;
    PUSH nat 0 ;
    COMPARE ;
    LT ;
    LOOP {
      PUSH nat 1 ;
      SWAP ;
      SUB ;
      ISNAT ;
      IF_NONE { PUSH nat 0 } {} ;
      DUP ;
      PUSH nat 0 ;
      COMPARE ;
      LT
    } ;
    DROP ;
    NIL operation ;
    PAIR
  } }
`;

const hasEqualManagerGasLimits = async (Tezos: TezosToolkit) => {
  const constants = await Tezos.rpc.getConstants();
  return constants.hard_gas_limit_per_operation.isEqualTo(constants.hard_gas_limit_per_block);
};

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;

  describe(`Focused estimation gas allocation scenarios using: ${rpc}`, () => {
    it('estimates a simple transfer for an unrevealed signer when manager gas limits are equal', async () => {
      if (!(await hasEqualManagerGasLimits(Tezos))) {
        return;
      }

      await setup({
        preferFreshKey: true,
        requireUnrevealed: true,
        minBalanceMutez: 2_000_000,
        maxAttempts: 8,
      });

      const pkh = await Tezos.signer.publicKeyHash();
      expect(await Tezos.rpc.getManagerKey(pkh)).toBeNull();

      const estimate = await Tezos.estimate.transfer({
        to: knownBaker,
        amount: 0.01,
      });

      expect(estimate.gasLimit).toBeGreaterThan(0);
      expect(estimate.storageLimit).toBeGreaterThanOrEqual(0);
    });

    it('estimates a simple origination for an unrevealed signer when manager gas limits are equal', async () => {
      if (!(await hasEqualManagerGasLimits(Tezos))) {
        return;
      }

      await setup({
        preferFreshKey: true,
        requireUnrevealed: true,
        minBalanceMutez: 3_000_000,
        maxAttempts: 8,
      });

      const pkh = await Tezos.signer.publicKeyHash();
      expect(await Tezos.rpc.getManagerKey(pkh)).toBeNull();

      const estimate = await Tezos.estimate.originate({
        balance: '0',
        code: ligoSample,
        storage: 0,
      });

      expect(estimate.gasLimit).toBeGreaterThan(0);
      expect(estimate.storageLimit).toBeGreaterThanOrEqual(0);
    });

    it('estimates a mixed batch when one operation already has an explicit gas limit', async () => {
      await setup({
        preferFreshKey: true,
        minBalanceMutez: 2_000_000,
        maxAttempts: 8,
      });

      const pkh = await Tezos.signer.publicKeyHash();
      if (!(await Tezos.rpc.getManagerKey(pkh))) {
        const revealOp = await Tezos.contract.reveal({});
        await revealOp.confirmation();
      }

      const explicitTransferEstimate = await Tezos.estimate.transfer({
        to: knownBaker,
        amount: 0.01,
      });
      const explicitGasLimit = Math.max(explicitTransferEstimate.gasLimit, 10_000);

      const estimates = await Tezos.estimate.batch([
        {
          kind: OpKind.TRANSACTION,
          to: knownBaker,
          amount: 0.01,
          gasLimit: explicitGasLimit,
        },
        { kind: OpKind.TRANSACTION, to: knownBaker, amount: 0.01 },
      ]);

      expect(estimates.length).toBe(2);
      expect(estimates[0].gasLimit).toBeGreaterThan(0);
      expect(estimates[1].gasLimit).toBeGreaterThan(0);
    });

    it('estimates a mixed batch with reveal reservation when one operation already has an explicit gas limit', async () => {
      if (!(await hasEqualManagerGasLimits(Tezos))) {
        return;
      }

      await setup({
        preferFreshKey: true,
        requireUnrevealed: true,
        minBalanceMutez: 2_000_000,
        maxAttempts: 8,
      });

      const pkh = await Tezos.signer.publicKeyHash();
      expect(await Tezos.rpc.getManagerKey(pkh)).toBeNull();

      const explicitTransferEstimate = await Tezos.estimate.transfer({
        to: knownBaker,
        amount: 0.01,
      });

      const estimates = await Tezos.estimate.batch([
        {
          kind: OpKind.TRANSACTION,
          to: knownBaker,
          amount: 0.01,
          gasLimit: explicitTransferEstimate.gasLimit,
        },
        { kind: OpKind.TRANSACTION, to: knownBaker, amount: 0.01 },
      ]);

      expect(estimates.length).toBe(3);
      expect(estimates[0].gasLimit).toBeGreaterThan(0);
      expect(estimates[1].gasLimit).toBeGreaterThan(0);
      expect(estimates[2].gasLimit).toBeGreaterThan(0);
    });

    it('estimates a heavy-first mixed batch whose heavy operation needs more than the equal split', async () => {
      await setup({
        preferFreshKey: true,
        minBalanceMutez: 5_000_000,
        maxAttempts: 8,
      });

      const pkh = await Tezos.signer.publicKeyHash();
      if (!(await Tezos.rpc.getManagerKey(pkh))) {
        const revealOp = await Tezos.contract.reveal({});
        await revealOp.confirmation();
      }

      const originateOp = await Tezos.contract.originate({
        balance: '0',
        code: gasBurnerMichelson,
        storage: UnitValue,
      });
      await originateOp.confirmation();
      const contract = await originateOp.contract();

      const constants = await Tezos.rpc.getConstants();
      const operationCount = 7;
      const equalSplit = constants.hard_gas_limit_per_block
        .div(operationCount)
        .integerValue()
        .toNumber();

      const makeHeavy = (parameter: number) => ({
        kind: OpKind.TRANSACTION,
        ...contract.methodsObject.default(parameter).toTransferParams(),
      });

      let heavyParameter = 800_000;
      let heavy = makeHeavy(heavyParameter);
      let heavyEstimate = await Tezos.estimate.batch([heavy]);

      for (let attempt = 0; heavyEstimate[0].gasLimit <= equalSplit && attempt < 5; attempt++) {
        heavyParameter = Math.ceil(heavyParameter * 1.5);
        heavy = makeHeavy(heavyParameter);
        heavyEstimate = await Tezos.estimate.batch([heavy]);
      }

      expect(heavyEstimate[0].gasLimit).toBeGreaterThan(equalSplit);
      expect(heavyEstimate[0].gasLimit).toBeLessThan(constants.hard_gas_limit_per_block.toNumber());

      const light = { kind: OpKind.TRANSACTION, to: pkh, amount: 1, mutez: true };
      const estimates = await Tezos.estimate.batch([
        heavy,
        light,
        light,
        light,
        light,
        light,
        light,
      ]);

      expect(estimates).toHaveLength(operationCount);
      expect(estimates[0].gasLimit).toBeGreaterThan(equalSplit);
      for (const estimate of estimates.slice(1)) {
        expect(estimate.gasLimit).toBeGreaterThan(0);
      }
    });
  });
});
