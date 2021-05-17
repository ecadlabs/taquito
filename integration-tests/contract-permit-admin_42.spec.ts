import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";
import { MichelCodecPacker } from '../packages/taquito/src/packer/michel-codec-packer';
import { Parser } from '@taquito/michel-codec';
import { encodeExpr } from "@taquito/utils";
import { MichelsonV1Expression, RpcClient } from '@taquito/rpc';
import { validateSignature } from '../packages/taquito-utils/src/validators';


CONFIGS().forEach(({ lib, rpc, protocol, setup, createAddress }) => {
   const Tezos = lib;
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

        edonet('Deploy a contract having a permit', async (done) => {
         
         const account = await createAddress();
         const key = await account.signer.publicKey()
         
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
            console.log(contractAddress)
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           

            const contract = await op.contract();
            expect(op.status).toEqual('applied')
   
            const source = await Tezos.signer.publicKeyHash();
            const { counter } = await Tezos.rpc.getContract(source);
            console.log("Counter is : "+ counter)
         
            const code = `{(pair
                   (pair
                     (address %contract_address)
                     (chain_id %chain_id))
                   (pair
                     (nat %counter)
                     (bytes %permit_hash))
                  )}`;

               const parser = new Parser()

               const parsed = parser.parseMichelineExpression(code)
               console.log(JSON.stringify(parsed))

            // parsed is: '[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%contract_address"]},{"prim":"chain_id","annots":["%chain_id"]}]},{"prim":"pair","args":[{"prim":"nat","annots":["%counter"]},{"prim":"bytes","annots":["%permit_hash"]}]}]}]'
             
            //  const localPacker = new MichelCodecPacker();
            //  const result = await localPacker.packData({
            //      data: { string: "pair(pair(address %contract_address)(chain_id %chain_id))(pair(nat %counter)(bytes %permit_hash))"},
            //      type: { prim: "pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%contract_address"]},{"prim":"chain_id","annots":["%chain_id"]}]},{"prim":"pair","args":[{"prim":"nat","annots":["%counter"]},{"prim":"bytes","annots":["%permit_hash"]}]}] }
            //  });

            
            const data = `(pair (pair (KT1NvV3w3FYUQ5MZgedtfWLkETRfcPcJeti1)(NetXfpUfwJdBox9))(pair (870261)(tz3ZHAGEeas3vQNtD4XcEuERLKUHKY97bbCY)))`
            const type = `(pair(pair(address %contract_address)(chain_id %chain_id))(pair(nat %counter)(bytes %permit_hash)))`;
            const dataJSON  = parser.parseMichelineExpression(data)
            const typeJSON = parser.parseMichelineExpression(type)
            const pack = await Tezos.rpc.packData({ data: dataJSON as MichelsonV1Expression, type: typeJSON as MichelsonV1Expression });
            const signature = await Tezos.signer.sign(pack.packed);

            console.log("Signature : "+signature)
            
            const validation = validateSignature(signature)
            console.log("Signature Validation : "+validation)             

            const op2 = await contract.methods.permit(
               // key
               key,
               // signature
               signature,
               //  bytes
               0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c
            ).send()
            console.log(op2)
            await op2.confirmation();
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
