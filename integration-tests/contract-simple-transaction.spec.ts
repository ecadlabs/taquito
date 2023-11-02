import { CONFIGS } from './config';
import { InvalidAmountError } from '@taquito/core';
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test simple transaction to tezos public key hashes: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    _it('should be able to send to a tz4 address', async () => {
      const op = await Tezos.contract.transfer({
        amount: 1,
        to: 'tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u'
      });

      await op.confirmation();

      expect(op.status).toEqual('applied');
    });

    _it('should throw an error when trying to send negative amount', async () => {
      expect(async () => {
        const op = await Tezos.contract.transfer({
          amount: -1,
          to: 'tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u'
        });

        await op.confirmation();
      }).rejects.toThrowError(InvalidAmountError);

    })
  });
});
