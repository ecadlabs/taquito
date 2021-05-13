import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { Protocols } from "@taquito/taquito";
import { fa2Contract_with_permits} from "./data/fa2_contract_with_permits";
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { MichelCodecPacker } from '../packages/taquito/src/packer/michel-codec-packer';
import { InMemorySigner } from "@taquito/signer";
import { packDataBytes } from '../packages/taquito-michel-codec/src/binary';

CONFIGS().forEach(({ lib, rpc, protocol, setup, createAddress }) => {
    const Tezos = lib;
    const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;
    let contractAddress: string;

    describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

      //   florencenet('Deploy a contract having a permit', async (done) => {
         
      //    const op = await Tezos.contract.originate({
      //       code: `{ parameter (or (pair %permit key (pair signature bytes)) (nat %wrapped)) ;
      //       storage (pair (big_map (pair bytes address) unit) (pair nat address)) ;
      //       code { DUP ;
      //                CAR ;
      //                IF_LEFT
      //                { DUP ;
      //                   CAR ;
      //                   DUP ;
      //                   DIP { SWAP ;
      //                         CDR ;
      //                         DUP ;
      //                         CAR ;
      //                         DIP { CDR ;
      //                               DUP ;
      //                               DIP { DIP { HASH_KEY ; IMPLICIT_ACCOUNT ; ADDRESS } ; PAIR ; SWAP } ;
      //                               SWAP ;
      //                               CDR ;
      //                               DUP ;
      //                               CDR ;
      //                               CAR ;
      //                               DIP { SWAP } ;
      //                               PAIR ;
      //                               SELF ;
      //                               ADDRESS ;
      //                               CHAIN_ID ;
      //                               PAIR ;
      //                               PAIR ;
      //                               PACK } } ;
      //                   DIP { DIP { DUP } } ;
      //                   CHECK_SIGNATURE ;
      //                   IF { DROP } { PUSH string "missigned" ; PAIR ; FAILWITH } ;
      //                   SWAP ;
      //                   DIP { DUP ;
      //                         CDR ;
      //                         DUP ;
      //                         CAR ;
      //                         PUSH nat 1 ;
      //                         ADD ;
      //                         DIP { CDR } ;
      //                         PAIR ;
      //                         SWAP ;
      //                         CAR ;
      //                         UNIT ;
      //                         SOME } ;
      //                   UPDATE ;
      //                   PAIR ;
      //                   NIL operation ;
      //                   PAIR }
      //                { DUP ;
      //                   PUSH nat 42 ;
      //                   COMPARE ;
      //                   EQ ;
      //                   IF {} { PUSH string "not 42" ; FAILWITH } ;
      //                   PACK ;
      //                   BLAKE2B ;
      //                   DIP { CDR ; DUP ; CAR ; DIP { CDR ; DUP ; CDR } } ;
      //                   SWAP ;
      //                   DIP { PAIR } ;
      //                   SWAP ;
      //                   PAIR ;
      //                   DUP ;
      //                   DUP ;
      //                   CAR ;
      //                   DIP { CDR } ;
      //                   MEM ;
      //                   IF { DUP ; CAR ; DIP { CDR ; NONE unit } ; UPDATE }
      //                      { PUSH string "no permit" ; FAILWITH } ;
      //                   PAIR ;
      //                   NIL operation ;
      //                   PAIR } } }`,
      //       storage: 
      //       {
      //       0: new MichelsonMap(),
      //       1: 0,
      //       2: 'tz1bDCu64RmcpWahdn9bWrDMi6cu7mXZynHm'
      //       },
      //       });
      //       await op.confirmation();
      //       const contractAddress = (await op.contract()).address;
      //       expect(op.hash).toBeDefined();
      //       expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);           
      //       done();
      //   });        
      // });

      florencenet('Deploy an fa2 contract having a permit', async (done) => {
      
      Tezos.addExtension(new Tzip16Module());

      const account1 = await createAddress();
      const key1 = await account1.signer.publicKey()
      const account2 = await createAddress();
      const key2 = await account2.signer.publicKey()

      const signer = new InMemorySigner(
         'edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV'
       );

       
      //  const pair = ({ data, type }: any, key: any) => {
      //   return {
      //     data: {
      //       prim: 'Pair',
      //       args: [{ "string": key }, data]
      //     },
      //     type: {
      //       prim: 'pair',
      //       args: [{ prim: "key" }, type]
      //     }
      //   }
      // }
       
       const key = await account1.signer.publicKey()

        const signature = await signer.sign(key, new Uint8Array([3]))
      //  //const permitMap = new MichelsonMap({ prim: "Pair", args: [{ prim: "string" }, { prim: "bytes" }] });
      //  const permitMap = new MichelsonMap(pair)
      //  permitMap.set('key', key);
      //  permitMap.set('signer', signer);
      //  permitMap.set('bytes', signature);
      
      
      
      //`Pair "edpkuPTVBFtbYd6gZWryXypSYYq6g7FvyucwphoU78T1vmGkbhj6qb" (Pair "edsigtfkWys7vyeQy1PnHcBuac1dgj2aJ8Jv3fvoDE5XRtxTMRgJBwVgMTzvhAzBQyjH48ux9KE8jRZBSk4Rv2bfphsfpKP3ggM" 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c)`

       const op = await Tezos.contract.originate({
          code: fa2Contract_with_permits,
          storage: 
          {
          0: new MichelsonMap(),
          1: new MichelsonMap(),
          2: 'tz1bDCu64RmcpWahdn9bWrDMi6cu7mXZynHm',
          4: 0,
          5: 0,
          },
          });
          await op.confirmation();
          const contractAddress = (await op.contract()).address;
          console.log("Contract Address : "+contractAddress)
          expect(op.hash).toBeDefined();
          expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);  
       
         const contract = await op.contract();
         expect(op.status).toEqual('applied')

        const counter = await contract.storage();
        console.log("Counter is : "+ counter)

         // const localPacker = new MichelCodecPacker();
         // const result = await localPacker.packData(pair{
         //    data: { string: key },
         //    type: { prim: "key" }
         // }, contractAddress))

         //    );
         // console.log(result.packed)
      

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
    })
  })
});
          
   // test('Permit can be submitted and used', async (done) => {
   //    const contractAbstraction = await Tezos.wallet.at(contractAddress, tzip16);
   //    const metadataViews = await contractAbstraction.tzip16().metadataViews();

   //    const viewGetCounterResult = await metadataViews.GetCounter().executeView('Unit');
   //    expect(viewGetCounterResult.toString()).toEqual('0');

   //    const viewGetDefaultExpiryResult = await metadataViews.GetDefaultExpiry().executeView();
   //    expect(viewGetDefaultExpiryResult.toString()).toEqual('1000');
   //    done();
   // });        
   
   // test('Permit expiration can be set', async (done) => {

   //    done();
   // });

   // test('Required off-chain views can be executed', async (done) => {

   //    done();
   // });

   // test('Storage tables are accessible: permits, user_expiries, permit_expiries.', async (done) => {

   //    done();
   // });

   // test('Permit Failure scenarios: Expiry, not enough funds, etc.', async (done) => {

   //    done();
   // });


