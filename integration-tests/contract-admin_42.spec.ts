import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";
import { Address } from '../packages/taquito-michel-codec/dist/types/binary';

CONFIGS().forEach(({ lib, rpc, protocol, setup, createAddress }) => {
    const Tezos = lib;
    const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;

    describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        florencenet('Deploy a contract for admin without permits', async (done) => {
         
         const LocalTez1 = await createAddress();
         const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
         console.log(localTez1Pkh)

         const op = await Tezos.contract.originate({
            code: `{ parameter nat;
               storage address;
               code { DUP;
                      CAR;
                      DIP { CDR };
                      PUSH nat 42;
                      COMPARE;
                      EQ;
                      IF {  }
                         { PUSH string "not 42";
                           FAILWITH };
                      DUP;
                      SENDER;
                      COMPARE;
                      EQ;
                      IF {  }
                         { PUSH string "not admin";
                           FAILWITH };
                      NIL operation;
                      PAIR }; }`,
            storage: localTez1Pkh       
         });
         
         await op.confirmation();
         const contractAddress = (await op.contract()).address;
         console.log("Contract address is : "+contractAddress)
         expect(op.hash).toBeDefined();
         expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           
         done();
        });        
      });

   test('Permit can be submitted and used', async (done) => {

      done();
   });        
   
   test('Permit expiration can be set', async (done) => {

      done();
   });

   test('Required off-chain views can be executed', async (done) => {

      done();
   });

   test('Storage tables are accessible: permits, user_expiries, permit_expiries.', async (done) => {

      done();
   });

   test('Permit Failure scenarios: Expiry, not enough funds, etc.', async (done) => {

      done();
   });

})
