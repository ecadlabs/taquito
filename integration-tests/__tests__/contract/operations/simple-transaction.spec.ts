import { CONFIGS } from '../../../config';
import { InvalidAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test

  describe(`Test simple transaction to tezos public key hashes: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    it('should be able to send to a tz3 address', async () => {
      const op = await Tezos.contract.transfer({
        amount: 1,
        to: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5'
      });
      await op.confirmation();
      expect(op.status).toEqual('applied');
    });

    notTezlinknet('should be able to send to a tz4 address', async () => {
      const op = await Tezos.contract.transfer({
        amount: 1,
        to: 'tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u'
      });
      await op.confirmation();
      expect(op.status).toEqual('applied');
    });

    it('should throw an error when trying to send negative amount', async () => {
      expect(async () => {
        const op = await Tezos.contract.transfer({
          amount: -1,
          to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'
        });
        await op.confirmation();
      }).rejects.toThrow(InvalidAmountError);

    })
  });
});
