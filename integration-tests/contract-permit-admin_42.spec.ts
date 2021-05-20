import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";
import { RpcClient, MichelsonV1Expression } from '../packages/taquito-rpc/src/taquito-rpc';
import { importKey } from '@taquito/signer';
import { MichelCodecPacker } from "@taquito/taquito";
import { MichelsonType, MichelsonData, ProtocolID, packDataBytes, Parser, sourceReference } from '@taquito/michel-codec';
import path from "path";
import fs from "fs";
import { fa2Contract_with_permits } from './data/fa2_contract_with_permits';
import { PackDataResponse } from '../packages/taquito-rpc/dist/types/types';
import { char2Bytes } from "@taquito/utils";

interface TypedTestData {
   type?: MichelsonType;
   data: MichelsonData;
   expect?: MichelsonData;
   packed: string;
   proto?: ProtocolID;
}

CONFIGS().forEach(({ lib, rpc, protocol, setup, createAddress }) => {
   const Tezos = lib;
   const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;
   const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;
   Tezos.setPackerProvider(new MichelCodecPacker());
   
   const FAUCET_KEY = {
         "mnemonic": [
           "flag",
           "true",
           "creek",
           "raccoon",
           "crystal",
           "radar",
           "remove",
           "enforce",
           "risk",
           "busy",
           "pencil",
           "knock",
           "sausage",
           "unhappy",
           "tourist"
         ],
         "secret": "687c78d95bad97d17ec511f13569f5329a36eedd",
         "amount": "3523002290",
         "pkh": "tz1YaTapLDcDRUEEEurwFawGxUgXcFVCsA1w",
         "password": "ri0GHypi1p",
         "email": "dzaberld.ffuddwbt@tezos.example.org"
       }

    importKey(
      Tezos,
      FAUCET_KEY.email,
      FAUCET_KEY.password,
      FAUCET_KEY.mnemonic.join(' '),
      FAUCET_KEY.secret
    );

   describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

      beforeEach(async (done) => {
         await setup()
         done()
      })
        
      test('Deploy a contract for admin without permits', async (done) => {
         
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
          const contract = await op.contract();
          expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           

         //submit the parameter to the contract
         Tezos.contract
         .at(contract.address)
         .then((c) => {
         return c.methods.permit("42").send();
         })
         .then(async (op) => {
            await op.confirmation(3);
            return op.hash;
         })
         .catch(Error) ;
         done();
         console.log(op.hash)
        });        
      });

      edonet('Deploy a contract having a permit', async (done) => {
         
         //Originate the contract
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
  
            //generate a permit parameter using an signature
            const permit_parameter = 'Pair "edpkuPTVBFtbYd6gZWryXypSYYq6g7FvyucwphoU78T1vmGkbhj6qb" (Pair "edsigtfkWys7vyeQy1PnHcBuac1dgj2aJ8Jv3fvoDE5XRtxTMRgJBwVgMTzvhAzBQyjH48ux9KE8jRZBSk4Rv2bfphsfpKP3ggM" 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c)'

            //submit the parameter to the contract
            Tezos.contract
            .at(contract.address)
            .then((c) => {
              return c.methods.permit(permit_parameter).send();
            })
            .then(async (op) => {
               await op.confirmation(3);
               return op.hash;
             })
            .catch(Error) ;

            //submit 42 to the wrapped entrypoint
            Tezos.contract
            .at(contract.address)
            .then((c) => {
              return c.methods.wrapped("42").send();
            })
            .then(async (op) => {
               await op.confirmation(3);
               return op.hash;
             })
            .catch(Error) ;

            const packed_permit_hash = char2Bytes(op.hash);
            
             const source = await Tezos.signer.publicKeyHash();
             const { counter } = await Tezos.rpc.getContract(source);
        
            const code = `{(pair
                   (pair
                      (address %contract_address)
                     (chain_id %chain_id))
                   (pair
                     (nat %counter)
                     (bytes %permit_hash))
                  )}`;

               const parser = new Parser;
            const data = `(Pair (Pair "`+contract.address+`" "NetXfpUfwJdBox9") (Pair `+counter+` "`+packed_permit_hash+`"))`        
            console.log(data)
            const type = `(pair(pair(address %contract_address)(chain_id %chain_id))(pair(nat %counter)(bytes %permit_hash)))`;
            const dataJSON  = parser.parseMichelineExpression(data)
            console.log(dataJSON)
            const typeJSON = parser.parseMichelineExpression(type)
            console.log(typeJSON)
            const pack = await Tezos.rpc.packData({ data: dataJSON as MichelsonV1Expression, type: typeJSON as MichelsonV1Expression });
            console.log(pack)
           
            // const signature = await Tezos.signer.sign(pack.packed);

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
