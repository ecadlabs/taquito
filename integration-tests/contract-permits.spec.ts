import { CONFIGS } from "./config";
import { MichelsonMap, MichelCodecPacker } from "@taquito/taquito";
import { importKey } from '@taquito/signer';
import { permit_admin_42} from "./data/permit_admin_42";
import { permit_admin_42_expiry} from "./data/permit_admin_42_expiry";
import { permit_admin_42_set} from "./data/permit_admin_42_set";

CONFIGS().forEach(({ lib, rpc, setup }) => {
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
    // file deepcode ignore HardcodedNonCryptoSecret/test: <please specify a reason of ignoring this>
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

  test('Permit can be submitted and used', async (done) => {

      const op = await Tezos.contract.originate({
        code: permit_admin_42,
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

        const permit_parameter = 'Pair "edpkuPTVBFtbYd6gZWryXypSYYq6g7FvyucwphoU78T1vmGkbhj6qb" (Pair "edsigtfkWys7vyeQy1PnHcBuac1dgj2aJ8Jv3fvoDE5XRtxTMRgJBwVgMTzvhAzBQyjH48ux9KE8jRZBSk4Rv2bfphsfpKP3ggM" 0x0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c)'

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
        done();
      });

  test('Deploy a contract having a permit with expiry', async (done) => {

    const op = await Tezos.contract.originate({
      code: permit_admin_42_expiry,
      storage:
        {
        0: 300,
        1: new MichelsonMap(),
        2: 0,
        3: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH',
        4: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH'
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();
      expect(op.status).toEqual('applied')

      const expiry = 300;

      //submit the expiry to the contract
       Tezos.contract
       .at(contract.address)
       .then((c) => {
         return c.methods.setExpiry(expiry).send();
       })
       .then(async (op) => {
         await op.confirmation(3);
         return op.hash;
       })
       .catch(Error) ;
       done();
    });

    test('Deploy a contract having a permit that can be set', async (done) => {
      const op = await Tezos.contract.originate({
        code: permit_admin_42_set,
        storage:
        {
        0: new MichelsonMap(),
        1: 300,
        2: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH'
        },
        });
        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(op.status).toEqual('applied')

        //anyone can submit 42 to the contract in place of bob
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
      });
    });
  })