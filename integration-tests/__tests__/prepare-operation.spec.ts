import { OperationContentsBallot, OperationContentsTransaction, OperationContentsProposals } from '@taquito/rpc';
import { OpKind } from '@taquito/taquito';
import { CONFIGS } from '../config';
import { LocalForger } from '@taquito/local-forging';

CONFIGS().forEach(({ lib, setup, protocol, createAddress }) => {
  const Tezos = lib;
  let contractAddress: string;

  describe(`Test Preparation of operations using the PrepareProvider`, () => {
    beforeAll(async () => {
      await setup();

      try {
        const op = await Tezos.contract.originate({
          code: `{ parameter (or (or (int %decrement) (int %increment)) (unit %reset)) ;
            storage int ;
            code { UNPAIR ;
                   IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { DROP 2 ; PUSH int 0 } ;
                   NIL operation ;
                   PAIR } }`,
          storage: 1
        });
        await op.confirmation();

        contractAddress = op.contractAddress!;

      } catch (e: any) {
        console.log('Unable to originate contract: ', JSON.stringify(e));
      }

    })

    beforeEach(async () => {
    });

    it('should be able to prepare a transaction operation', async () => {
      const prepared = await Tezos.prepare.transaction({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 5
      });

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();

      const content = prepared.opOb.contents[0] as OperationContentsTransaction;

      expect(content.kind).toEqual('transaction');
      expect(content.destination).toEqual('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')
      expect(content.amount).toEqual('5000000');

    });

    it('should be able to prepare a batch operation', async () => {
      const prepared = await Tezos.prepare.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: 2,
        },
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: 2,
        },
      ]);

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.contents.length).toEqual(2);
      expect(prepared.opOb.contents[0].kind).toEqual('transaction');
      expect(prepared.opOb.contents[1].kind).toEqual('transaction');

    });

    it('should be able to prepare a proposals operation', async () => {
      const prepared = await Tezos.prepare.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg']
      });

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();

      const content = prepared.opOb.contents[0] as OperationContentsProposals;

      expect(prepared.opOb.contents[0].kind).toEqual('proposals');
      expect(content.proposals).toEqual(['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg']);
      expect(prepared.opOb.protocol).toEqual(protocol);
    });

    it('should be able to prepare a ballot operation', async () => {
      const prepared = await Tezos.prepare.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay'
      });

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();

      const content = prepared.opOb.contents[0] as OperationContentsBallot;

      expect(prepared.opOb.contents[0].kind).toEqual('ballot');
      expect(content.proposal).toEqual('PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg');
      expect(content.ballot).toEqual('yay');
      expect(prepared.opOb.protocol).toEqual(protocol);
    });

    it('should be able to prepare a contractCall', async () => {
      const contractAbs = await Tezos.contract.at(contractAddress);
      const method = await contractAbs.methodsObject.increment(1);
      const prepared = await Tezos.prepare.contractCall(method);

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.protocol).toBeDefined();

    });
  });

  describe('toPreapply conversion method', () => {
    it('Verify toPreaplyParams returns executable params for preapplyOperations', async () => {
      const receiver = await createAddress();

      const pkh = await receiver.signer.publicKeyHash();
      const estimates = await Tezos.estimate.transfer({ to: pkh, amount: 1 });
      const preparedTransfer = await Tezos.prepare.transaction({
        amount: 1,
        to: pkh,
        fee: estimates.suggestedFeeMutez,
        storageLimit: estimates.storageLimit,
        gasLimit: estimates.gasLimit
      });

      const preapplyParams = await Tezos.prepare.toPreapply(preparedTransfer)
      const preapply = await Tezos.rpc.preapplyOperations(preapplyParams);

      expect(preapplyParams[0].contents).toEqual(preparedTransfer.opOb.contents)
      expect(preapplyParams[0].branch).toEqual(preparedTransfer.opOb.branch)

      if (preapply[0].contents[0].kind === 'reveal') {
        expect(preapply[0].contents[0].kind).toEqual('reveal');
        expect(preapply[0].contents[1].kind).toEqual('transaction');
      } else {
        expect(preapply[0].contents[0].kind).toEqual('transaction');
      }

    });

    it('Verify ballot and proposals operations have source parameter in prepared structure', async () => {
      const preparedBallot = await Tezos.prepare.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay'
      });

      expect(preparedBallot.opOb.contents[0].kind).toEqual('ballot');
      expect(preparedBallot.opOb.contents[0]).toHaveProperty('source');
      expect(preparedBallot.opOb.contents[0]).toHaveProperty('period');
      expect(preparedBallot.opOb.contents[0]).toHaveProperty('proposal');
      expect(preparedBallot.opOb.contents[0]).toHaveProperty('ballot');

      // Verify source is not undefined
      expect((preparedBallot.opOb.contents[0] as OperationContentsBallot).source).toBeDefined();

      const preparedProposals = await Tezos.prepare.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg']
      });

      expect(preparedProposals.opOb.contents[0].kind).toEqual('proposals');
      expect(preparedProposals.opOb.contents[0]).toHaveProperty('source');
      expect(preparedProposals.opOb.contents[0]).toHaveProperty('period');
      expect(preparedProposals.opOb.contents[0]).toHaveProperty('proposals');
      
      // Verify source is not undefined
      expect((preparedProposals.opOb.contents[0] as OperationContentsProposals).source).toBeDefined();
    });
  });

  describe('toForge conversion method', () => {

    it('Verify that toForge is executable for both local forger and rpc.forgeOperations', async () => {
      const receiver = await createAddress();
      const pkh = await receiver.signer.publicKeyHash();
      const preparedTransfer = await Tezos.prepare.transaction({ amount: 1, to: pkh });
      const forger = new LocalForger();

      const forged = await forger.forge(Tezos.prepare.toForge(preparedTransfer));
      const rpcForged = await Tezos.rpc.forgeOperations(Tezos.prepare.toForge(preparedTransfer));

      expect(forged).toEqual(rpcForged);

    });
  });

})
