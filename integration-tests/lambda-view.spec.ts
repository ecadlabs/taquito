import { CONFIGS } from './config';
CONFIGS().forEach(({ lib, network, setup }) => {
  const Tezos = lib;
  const fa12Address = 'KT1LARUt9LMKjs7wc9Dh6oeDgvMMa4Rih8eA';

  describe('Lambda view', () => {
    beforeEach(async done => {
      await setup();
      done();
    });

    it('executes `getTotalSupply` on an FA1.2 contract', async done => {
      const result = await Tezos.contract
        .lambdaView(network, fa12Address, 'getTotalSupply')
        .then(view => view.execute());

      expect(result).toEqual({ int: '0' });
      done();
    });

    it('fails when given an unknown contract method', async done => {
      const viewPromise = Tezos.contract.lambdaView(network, fa12Address, 'unknownMethod');

      await expect(viewPromise).rejects.toThrow(/does not have entrypoint/);

      done();
    });
  });
});
