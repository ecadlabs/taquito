import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";
import { MichelCodecPacker } from '../packages/taquito/src/packer/michel-codec-packer';
import { packDataBytes, Parser } from '@taquito/michel-codec';
import { MichelsonV1Expression, RpcClient } from '@taquito/rpc';
import { InMemorySigner, importKey } from '@taquito/signer';

CONFIGS().forEach(({ lib, rpc, protocol, setup, createAddress }) => {
   const Tezos = lib;
   const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
   Tezos.setSignerProvider(signer)
   const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;
   const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;
   
   describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

      beforeEach(async (done) => {
         await setup()
         done()
      })
        
      edonet('Deploy a contract for admin without permits', async (done) => {
         
         const LocalTez1 = await createAddress();
         const localTez1Pkh = await LocalTez1.signer.publicKeyHash();

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
         expect(op.hash).toBeDefined();
         expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           
         done();
        });        
      });

      edonet('Deploy a contract having a permit', async (done) => {
         
         const LocalTez2 = await createAddress();
         const localTez2Pkh = await LocalTez2.signer.publicKeyHash();
         
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
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           
            const contract = await op.contract();
            expect(op.status).toEqual('applied')

            //create the permit hash 
             const parser = new Parser()
             const permit_hash_data = `Pair "edpkuPTVBFtbYd6gZWryXypSYYq6g7FvyucwphoU78T1vmGkbhj6qb" (Pair "edsigu5hhPSqYUbfgdZFXvpjMnArH1GS9BqQfM3ddhFyBEG2rQSKozQ85yt16X63e8KRrWNFYpCTwRZuQUUaL59B1C5Y1pJAbr6" 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c)`
             const permit_hash_type = `(pair %permit key (pair signature bytes))`;
             const permit_hash_dataJSON  = parser.parseMichelineExpression(permit_hash_data)
             const permit_hash_typeJSON = parser.parseMichelineExpression(permit_hash_type)
             const permit_hash_pack = await Tezos.rpc.packData({ data: permit_hash_dataJSON as MichelsonV1Expression, type: permit_hash_typeJSON as MichelsonV1Expression }, { block: "head" })
             console.log(permit_hash_pack)


            // const source = await Tezos.signer.publicKeyHash();
            // const { counter } = await Tezos.rpc.getContract(source);
         
            // const code = `{(pair
            //        (pair
            //          (address %contract_address)
            //          (chain_id %chain_id))
            //        (pair
            //          (nat %counter)
            //          (bytes %permit_hash))
            //       )}`;

            // const data = `(Pair (Pair "`+contract.address+`" "NetXfpUfwJdBox9") (Pair `+counter+` "`+permit_hash_pack+`"))`        
            // console.log(data)
            // const type = `(pair(pair(address %contract_address)(chain_id %chain_id))(pair(nat %counter)(bytes %permit_hash)))`;
            // const dataJSON  = parser.parseMichelineExpression(data)
            // console.log(dataJSON)
            // const typeJSON = parser.parseMichelineExpression(type)
            // console.log(typeJSON)
            // const pack = await Tezos.rpc.packData({ data: dataJSON as MichelsonV1Expression, type: typeJSON as MichelsonV1Expression });
            // console.log(pack)
            
            // const signature = await signer.sign(pack.packed);

            // const bytes = 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c

            // const theContract = await Tezos.wallet.at("KT1NvV3w3FYUQ5MZgedtfWLkETRfcPcJeti1");
            // const theOp = 
            //    await theContract
            //             .methods
            //             .check_signature(permit_hash_pack, signature, bytes)
            //             .send();
            // await theOp.confirmation();

            // const op2 = await contract.methods.permit(
            //    // key
            //    permit_hash_pack,
            //    // signature
            //    signature,
            //    //  bytes
            //    bytes
            // ).send()
            // console.log(op2)
            // await op2.confirmation();
         done();
        });        
 
        edonet('Check the pack and sign example in #588', async (done) => {
            const data = `(Pair (Pair { Elt 1 (Pair (Pair "tz1bDCu64RmcpWahdn9bWrDMi6cu7mXZynHm" "tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu") 0x0501000000026869) } 10000000)(Pair 2 333))`;
            const type = `(pair (pair (map int (pair (pair address address) bytes)) int) (pair int int))`;
            const p = new Parser();
            const dataJSON  = p.parseMichelineExpression(data)
            const typeJSON = p.parseMichelineExpression(type)
            const pack = await Tezos.rpc.packData({ data: dataJSON as MichelsonV1Expression, type: typeJSON as MichelsonV1Expression });
            const sign = await Tezos.signer.sign(pack.packed);
            console.log(sign)
            done();
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
