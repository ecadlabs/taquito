import { 
  OpKind, 
  RPCBallotOperation,
} from '@taquito/taquito';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, setup }) => {
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

    it('should be able to prepare a ballot operation', async (done) => {
      const prepared = await Tezos.prepare.ballot({ operation: 
        {
          kind: OpKind.BALLOT,
          proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
          ballot: 'yay', 
        } as RPCBallotOperation 
      });

      expect(prepared).toBeDefined();
      expect(prepared.counter).toBeDefined();
      expect(prepared.opOb).toBeDefined();
      expect(prepared.opOb.branch).toBeDefined();
      expect(prepared.opOb.contents).toBeDefined();
      expect(prepared.opOb.protocol).toBeDefined();

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
    })
  });

}) 