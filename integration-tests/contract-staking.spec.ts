import { Protocols, TezosToolkit } from "@taquito/taquito";
import { CONFIGS, defaultSecretKey, isSandbox } from "./config";
import { InMemorySigner } from "@taquito/signer";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test staking through contract API using: ${rpc}`, () => {
    const flextesaOxford = isSandbox({ rpc }) && protocol === Protocols.ProxfordS ? test : test.skip;
    beforeEach(async (done) => {
      await setup(true)
      done()
    });
    flextesaOxford('Should be able to stake', async (done) => {
      const op = await Tezos.contract.stake({
        amount: 100000,
      });
      await op.confirmation()
      expect(op.hash).toBeDefined();
      done();
    });
    flextesaOxford('Should be able to unstake', async (done) => {
      const op = await Tezos.contract.unstake({
        amount: 100000,
      });
      await op.confirmation()
      expect(op.hash).toBeDefined();
      done();
    });
    flextesaOxford('Should be able to finalizeUnstake', async (done) => {
      const op = await Tezos.contract.finalizeUnstake({});
      await op.confirmation()
      expect(op.hash).toBeDefined();
      done();
    });
    describe('Should fail with proper errors', () => {
      it.skip('Should fail with unstake amount too large, could not produce: gets proto.018-Proxford.tez.subtraction_underflow when the amount is too high', async (done) => {
        // TODO: Workaround for counter calculation bug, remove when issue #2680 is fixed
        const tezos = new TezosToolkit(rpc);
        tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));
        expect(async () => {
          const op = await tezos.contract.stake({
            amount: 1000000000000,
          });
          await op.confirmation()
        }).rejects.toThrowError(/Invalid unstake request amount/);
        done();
      });
      flextesaOxford('Should fail with invalid_nonzero_transaction_amount', async (done) => {
        expect(async () => {
          // TODO: Workaround for counter calculation bug, remove when issue #2680 is fixed
          const tezos = new TezosToolkit(rpc);
          tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));
          const address = await tezos.signer.publicKeyHash();
          const op = await tezos.contract.transfer({
            to: address,
            amount: 10000,
            parameter: {
              entrypoint: "unstake",
              value: {
                int: "10000",
              },
            },
          });
          await op.confirmation()
        }).rejects.toThrowError(/\(permanent\) proto.\d{3}-\w+\.operations\.invalid_nonzero_transaction_amount/);
        done();
      });
      flextesaOxford('Should fail with invalid_unstake_request_amount', async (done) => {
        expect(async () => {
          // TODO: Workaround for counter calculation bug, remove when issue #2680 is fixed
          const tezos = new TezosToolkit(rpc);
          tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));
          const address = await tezos.signer.publicKeyHash();
          const op = await tezos.contract.transfer({
            to: address,
            amount: 0,
            parameter: {
              entrypoint: "unstake",
              value: {
                int: "-10000",
              },
            },
          });
          await op.confirmation();
        }).rejects.toThrowError(/\(permanent\) proto.\d{3}-\w+\.operations\.invalid_unstake_request_amount/);
        done();
      });
      flextesaOxford('Should fail with invalid_self_transaction_destination', async (done) => {
        expect(async () => {
          // TODO: Workaround for counter calculation bug, remove when issue #2680 is fixed
          const tezos = new TezosToolkit(rpc);
          tezos.setSignerProvider(new InMemorySigner(defaultSecretKey.secret_key));
          const op = await tezos.contract.transfer({
            to: 'tz1Yju7jmmsaUiG9qQLoYv35v5pHgnWoLWbt',
            amount: 0,
            parameter: {
              entrypoint: "unstake",
              value: {
                int: "10000",
              },
            },
          });
          await op.confirmation()
        }).rejects.toThrowError(/\(permanent\) proto.\d{3}-\w+\.operations\.invalid_self_transaction_destination/);
        done();
      });
    });
  });
});
