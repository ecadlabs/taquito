import { 
  OpKind, 
  RPCOriginationOperation, 
  DEFAULT_FEE, 
  DEFAULT_GAS_LIMIT, 
  DEFAULT_STORAGE_LIMIT, 
  RPCBallotOperation,
  PreparedOperation
} from '@taquito/taquito';
import { CONFIGS } from './config';



CONFIGS().forEach(({ lib, setup }) => {
  const Tezos = lib;

  describe(`Test Preparation of operations using the PrepareProvider`, () => {
    beforeEach(async (done) => {
      await setup();
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
  });
}) 