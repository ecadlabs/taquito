import { OperationContentsBallot, OperationContentsTransaction } from '@taquito/rpc';
import {
  OpKind,
} from '@taquito/taquito';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, setup, protocol }) => {
  const Tezos = lib;
  let contractAddress: string;

  describe(`Test Preparation of operations using the PrepareProvider`, () => {
    beforeAll(async (done) => {
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

      } catch(e: any) {
        console.log('Unable to originate contract: ', JSON.stringify(e));
      }

      done();
    })

    beforeEach(async (done) => {
      done();
    });

    it('should be able to prepare a transaction operation', async (done) => {
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

      done();
    });

    it('should be able to prepare a batch operation', async (done) => {
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

      done();
    });

    it('should be able to prepare a ballot operation', async (done) => {
      const prepared = await Tezos.prepare.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay'
      });

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();

      const content = prepared.opOb.contents[0] as OperationContentsBallot

      expect(prepared.opOb.contents[0].kind).toEqual('ballot');
      expect(content.proposal).toEqual('PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg');
      expect(content.ballot).toEqual('yay');
      expect(prepared.opOb.protocol).toEqual(protocol);
      done();
    });

    it('should be able to prepare a contractCall', async (done) => {
      const contractAbs = await Tezos.contract.at(contractAddress);
      const method = await contractAbs.methods.increment(1);
      const prepared = await Tezos.prepare.contractCall(method);

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.protocol).toBeDefined();

      done();
    });
  });

})
