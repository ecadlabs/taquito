import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
    const Tezos = lib;
    const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;

    describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        florencenet('Deploy a contract having a permit', async (done) => {
         
         const op = await Tezos.contract.originate({
            code: `{ parameter (or (pair %permit key (pair signature bytes)) (nat %wrapped)) ;
            storage (pair (big_map (pair bytes address) unit) (pair nat address)) ;
            code { DUP ;
                     CAR ;
                     IF_LEFT
                     { DUP ;
                        CAR ;
                        DUP ;
                        DIP { SWAP ;
                              CDR ;
                              DUP ;
                              CAR ;
                              DIP { CDR ;
                                    DUP ;
                                    DIP { DIP { HASH_KEY ; IMPLICIT_ACCOUNT ; ADDRESS } ; PAIR ; SWAP } ;
                                    SWAP ;
                                    CDR ;
                                    DUP ;
                                    CDR ;
                                    CAR ;
                                    DIP { SWAP } ;
                                    PAIR ;
                                    SELF ;
                                    ADDRESS ;
                                    CHAIN_ID ;
                                    PAIR ;
                                    PAIR ;
                                    PACK } } ;
                        DIP { DIP { DUP } } ;
                        CHECK_SIGNATURE ;
                        IF { DROP } { PUSH string "missigned" ; PAIR ; FAILWITH } ;
                        SWAP ;
                        DIP { DUP ;
                              CDR ;
                              DUP ;
                              CAR ;
                              PUSH nat 1 ;
                              ADD ;
                              DIP { CDR } ;
                              PAIR ;
                              SWAP ;
                              CAR ;
                              UNIT ;
                              SOME } ;
                        UPDATE ;
                        PAIR ;
                        NIL operation ;
                        PAIR }
                     { DUP ;
                        PUSH nat 42 ;
                        COMPARE ;
                        EQ ;
                        IF {} { PUSH string "not 42" ; FAILWITH } ;
                        PACK ;
                        BLAKE2B ;
                        DIP { CDR ; DUP ; CAR ; DIP { CDR ; DUP ; CDR } } ;
                        SWAP ;
                        DIP { PAIR } ;
                        SWAP ;
                        PAIR ;
                        DUP ;
                        DUP ;
                        CAR ;
                        DIP { CDR } ;
                        MEM ;
                        IF { DUP ; CAR ; DIP { CDR ; NONE unit } ; UPDATE }
                           { PUSH string "no permit" ; FAILWITH } ;
                        PAIR ;
                        NIL operation ;
                        PAIR } } }`,
            storage: 
            {
            0: new MichelsonMap(),
            1: 0,
            2: 'tz1bDCu64RmcpWahdn9bWrDMi6cu7mXZynHm'
            },
            });
            await op.confirmation();
            const contractAddress = (await op.contract()).address;
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
