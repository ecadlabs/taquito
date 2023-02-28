import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mumbaiAndAlpha = protocol === Protocols.PtMumbaii || protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test simple transaction to tezos public key hashes: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    mumbaiAndAlpha('should be able to send to a tz4 address', async (done) => {
      const op = await Tezos.contract.transfer({
        amount: 1,
        to: 'tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u'
      });

      await op.confirmation();

      expect(op.status).toEqual('applied');
      done();
    });
  });
});
