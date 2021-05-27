import { CONFIGS } from "./config";
import { MichelsonMap, MichelCodecPacker } from "@taquito/taquito";
import { importKey } from '@taquito/signer';
import { Tzip16Module } from '@taquito/tzip16';
import { Schema } from '../packages/taquito-michelson-encoder/src/schema/storage';
import { fa2Contract_with_permits} from "./data/fa2_contract_with_permits";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  Tezos.setPackerProvider(new MichelCodecPacker());

  const FAUCET_KEY = {
    "mnemonic": [
      "swear",
      "involve",
      "mixture",
      "pyramid",
      "typical",
      "swift",
      "arch",
      "mention",
      "decline",
      "mind",
      "federal",
      "lamp",
      "coffee",
      "weather",
      "quote"
    ],
    "secret": "782ff5c78fc58df062670fdc27d5a8a8003ecf16",
    "amount": "32252493855",
    "pkh": "tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh",
    "password": "zXuYCjc8aq",
    "email": "fnctuxjz.erhkqxca@tezos.example.org"
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

    test('Deploy an fa2 contract having a permit', async (done) => {

      Tezos.addExtension(new Tzip16Module());

        const op = await Tezos.contract.originate({
        code: fa2Contract_with_permits,
        storage:
        {
        0: new MichelsonMap(),
        1: new MichelsonMap(),
        2: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH',
        3: false,
        4: 0,
        5: 0,
        },
        });
        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(op.status).toEqual('applied')

        const permit_parameter = 'Pair "edpkuPTVBFtbYd6gZWryXypSYYq6g7FvyucwphoU78T1vmGkbhj6qb" (Pair "edsigtfkWys7vyeQy1PnHcBuac1dgj2aJ8Jv3fvoDE5XRtxTMRgJBwVgMTzvhAzBQyjH48ux9KE8jRZBSk4Rv2bfphsfpKP3ggM" 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c)'
          
        const balanced_4_tuple =  `
         {pair
           (pair
             (address %contract_address)
             (chain_id %chain_id))
           (pair
             (nat %counter)
             (bytes %permit_hash))
           }`

           //const p = new Parser();
           //const parsed_storage = JSON.stringify(p.parseMichelineExpression(balanced_4_tuple));
           //console.log(JSON.stringify(parsed_storage));

           const schema = new Schema({"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%contract_address"]},{"prim":"chain_id","annots":["%chain_id"]}]},{"prim":"pair","args":[{"prim":"nat","annots":["%counter"]},{"prim":"bytes","annots":["%permit_hash"]}]}]});
          
           console.log(JSON.stringify(schema.ExtractSchema(), null, 2))

        //    {
        //     "contract_address": "address",
        //     "chain_id": "chain_id",
        //     "counter": "nat",
        //     "permit_hash": "bytes"
        //   }

        //submit the permit_parameter to the contract
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
         expect(op.hash).toBeDefined();
         expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        
        //  const account = await createAddress();
        //  const key = await account.signer.publicKey(); 
        //  const signature = await account.signer.sign(permit_parameter, new Uint8Array())
        //  const bytes = 0x3865bc582f4140e94fafb65fab8025f0616dd3038def17d50123014b39121568;

        const op2 = await contract.methods.mint("tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH", 10).send()
        expect(op2.amount).toEqual(10)
        await op2.confirmation();

        const op3 = await contract.methods.permit(permit_parameter).send()
        expect(op3.amount).toEqual(300)
        await op3.confirmation();

        done();
    })

  })



