import { CONFIGS } from '../../config';
import { MichelsonMap, MichelCodecPacker, TezosToolkit } from '@taquito/taquito';
import { permit_admin_42_expiry } from '../../data/permit_admin_42_expiry';
import { permit_admin_42_set } from '../../data/permit_admin_42_set';
import { permit_fa12_smartpy } from '../../data/permit_fa12_smartpy';
import { buf2hex, stringToBytes, hex2buf } from '@taquito/utils';
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { packDataBytes } from "@taquito/michel-codec"

const blake = require('blakejs');
const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';

const create_bytes_to_sign = async (Tezos: TezosToolkit, contractAddress: string, methodHash: string) => {
  const chainId = await Tezos.rpc.getChainId();

  const contract = await Tezos.contract.at(contractAddress)
  const contractStorage: any = await contract.storage();
  let counter = 0;
  if (contractStorage.hasOwnProperty("counter")) {
    counter = contractStorage.counter.toNumber();
  } else {
    counter = contractStorage["1"].toNumber();
  }
  const sigParamData: any = {
    prim: "Pair",
    args: [
      {
        prim: "Pair",
        args: [
          {
            string: chainId
          },
          {
            string: contractAddress
          }
        ]
      },
      {
        prim: "Pair",
        args: [
          {
            int: counter
          },
          {
            bytes: methodHash
          }
        ]
      }
    ]
  };
  const sigParamType: any = {
    prim: "pair",
    args: [
      {
        prim: "pair",
        args: [
          {
            prim: "chain_id"
          },
          { prim: "address" }
        ]
      },
      {
        prim: "pair",
        args: [{ prim: "nat" }, { prim: "bytes" }]
      }
    ]
  };

  const sigParamPacked = packDataBytes(sigParamData, sigParamType);
  // signs the hash
  const signature = await Tezos.signer.sign(sigParamPacked.bytes);

  return signature.sig
}

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  Tezos.setPackerProvider(new MichelCodecPacker());

  describe(`Verify contract origination, transfer, and minting with a permit for tzip-17 through contract api: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    test('Verify a Permit can be submitted and set', async () => {
      const op = await Tezos.contract.originate({
        code: permit_admin_42_set,
        storage: {
          0: new MichelsonMap(),
          1: 300,
          2: bob_address,
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const permit_contract = await op.contract();

      expect(op.status).toEqual('applied');

      const signer_key = await Tezos.signer.publicKey();
      const wrapped_param: any =
        permit_contract.methodsObject['wrapped'](42).toTransferParams().parameter?.value;
      const wrapped_param_type = permit_contract.entrypoints.entrypoints['wrapped'];
      const raw_packed = await Tezos.rpc.packData({
        data: wrapped_param,
        type: wrapped_param_type,
      });
      const packed_param = raw_packed.packed;
      const param_hash = buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));

      const param_sig = await create_bytes_to_sign(Tezos, permit_contract.address, param_hash)

      const permitMethodCall = await permit_contract.methodsObject
        .permit([{ 0: signer_key, 1: { 0: param_sig, 1: param_hash } }])
        .send();
      await permitMethodCall.confirmation();

      expect(permitMethodCall.hash).toBeDefined();
      expect(permitMethodCall.status).toEqual('applied');
    });

    test('Verify contract.originate for a permit contract and expiry can be set', async () => {
      const op = await Tezos.contract.originate({
        code: permit_admin_42_expiry,
        storage: {
          0: 300,
          1: new MichelsonMap(),
          2: 0,
          3: bob_address,
          4: bob_address,
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const expiry_contract = await op.contract();
      expect(op.status).toEqual('applied');

      const setExpiryMethodCall = await expiry_contract.methodsObject
        .setExpiry({ 0: await Tezos.signer.publicKeyHash(), 1: { 0: null, 1: 42 } })
        .send();
      await setExpiryMethodCall.confirmation();

      expect(setExpiryMethodCall.hash).toBeDefined();
      expect(setExpiryMethodCall.status).toEqual('applied');
    });

    test('Verify contract.originate for a permit contract and defaultExpiry can be set', async () => {
      const op = await Tezos.contract.originate({
        code: permit_admin_42_expiry,
        storage: {
          0: 300,
          1: new MichelsonMap(),
          2: 0,
          3: await Tezos.signer.publicKeyHash(),
          4: await Tezos.signer.publicKeyHash(),
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const defaultExpiry_contract = await op.contract();
      expect(op.status).toEqual('applied');

      const defaultExpiryMethodCall = await defaultExpiry_contract.methodsObject
        .defaultExpiry(
          100 // nat
        )
        .send();
      await defaultExpiryMethodCall.confirmation();

      expect(defaultExpiryMethodCall.hash).toBeDefined();
      expect(defaultExpiryMethodCall.status).toEqual('applied');
    });

    test('Verify contract.originate for a permit fa1.2 contract with metadata views', async () => {
      const url = 'https://storage.googleapis.com/tzip-16/permit_metadata.json';
      const bytesUrl = stringToBytes(url);
      const metadata = new MichelsonMap();
      metadata.set('', bytesUrl);

      const op = await Tezos.contract.originate({
        code: permit_fa12_smartpy,
        storage: {
          administrator: await Tezos.signer.publicKeyHash(),
          balances: new MichelsonMap(),
          counter: '0',
          default_expiry: '50000',
          max_expiry: '2628000',
          metadata: metadata,
          paused: false,
          permit_expiries: new MichelsonMap(),
          permits: new MichelsonMap(),
          totalSupply: '0',
          user_expiries: new MichelsonMap(),
        },
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const fa12_contract = await op.contract();
      const contractAddress = fa12_contract.address;
      expect(op.status).toEqual('applied');

      const mint_amount = 42;

      const setMintMethodCall = await fa12_contract.methodsObject
        .mint({
          address: await Tezos.signer.publicKeyHash(),
          value: mint_amount
        })
        .send();
      await setMintMethodCall.confirmation();
      expect(setMintMethodCall.hash).toBeDefined();
      expect(setMintMethodCall.status).toEqual('applied');
      const storage: any = await fa12_contract.storage();
      expect(storage['totalSupply'].toString()).toEqual('42');

      Tezos.addExtension(new Tzip16Module());

      const contract = await Tezos.contract.at(contractAddress, tzip16);
      const contract_metadata = await contract.tzip16().getMetadata();

      expect(contract_metadata.uri).toEqual(url);
      expect(contract_metadata.integrityCheckResult).toBeUndefined();
      expect(contract_metadata.sha256Hash).toBeUndefined();

      const views = await contract.tzip16().metadataViews();

      const viewGetCounterResult = await views.GetCounter().executeView('Unit');
      expect(viewGetCounterResult.toString()).toEqual('0');

      const viewGetDefaultExpiryResult = await views.GetDefaultExpiry().executeView('Unit');
      expect(viewGetDefaultExpiryResult.toString()).toEqual('50000');

    });

    describe(`Verify contract having a permit for tzip-17: ${rpc}`, () => {
      beforeEach(async () => {
        await setup(true);
      });

      test('Verify that the permit hash can be submitted to an entrypoint', async () => {
        //following https://github.com/EGuenz/smartpy-permits

        const LocalTez1 = await createAddress();
        const bootstrap1_address = await LocalTez1.signer.publicKeyHash();
        const funding_op1 = await Tezos.contract.transfer({
          to: bootstrap1_address,
          amount: 0.1,
        });
        await funding_op1.confirmation();

        const LocalTez2 = await createAddress();
        const bootstrap2_address = await LocalTez2.signer.publicKeyHash();
        const funding_op2 = await Tezos.contract.transfer({
          to: bootstrap2_address,
          amount: 0.1,
        });
        await funding_op2.confirmation();

        const LocalTez3 = await createAddress();
        const bootstrap3_address = await LocalTez3.signer.publicKeyHash();
        const funding_op3 = await Tezos.contract.transfer({
          to: bootstrap3_address,
          amount: 0.1,
        });
        await funding_op3.confirmation();

        const LocalTez4 = await createAddress();
        const bootstrap4_address = await LocalTez4.signer.publicKeyHash();
        const funding_op4 = await Tezos.contract.transfer({
          to: bootstrap4_address,
          amount: 0.1,
        });
        await funding_op4.confirmation();

        //Originate permit-fa1.2 contract with bootstrap1_address as administrator
        const url = 'https://storage.googleapis.com/tzip-16/permit_metadata.json';
        const bytesUrl = stringToBytes(url);
        const metadata = new MichelsonMap();
        metadata.set('', bytesUrl);

        const op = await Tezos.contract.originate({
          code: permit_fa12_smartpy,
          storage: {
            administrator: await LocalTez1.signer.publicKeyHash(),
            balances: new MichelsonMap(),
            counter: '0',
            default_expiry: '50000',
            max_expiry: '2628000',
            metadata: metadata,
            paused: false,
            permit_expiries: new MichelsonMap(),
            permits: new MichelsonMap(),
            totalSupply: '100',
            user_expiries: new MichelsonMap(),
          },
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const fa12_contract = await op.contract();
        expect(op.status).toEqual('applied');

        //Mint 10 tokens to bootstrap 2
        const mint_contract = await LocalTez1.contract.at(fa12_contract.address);
        const mint = await mint_contract.methodsObject.mint({ address: bootstrap2_address, value: 10 }).send();
        await mint.confirmation();
        expect(mint.hash).toBeDefined();
        expect(mint.status).toEqual('applied');
        await mint.confirmation();

        //Observe transfer by non bootstrap2 sender fails
        const fail_contract = await LocalTez4.contract.at(fa12_contract.address);
        try {
          await fail_contract.methodsObject.transfer({ from_: bootstrap3_address, to_: bootstrap4_address, value: 1 }).send();
        } catch (errors) {
          let jsonStr: string = JSON.stringify(errors);
          let jsonObj = JSON.parse(jsonStr);
          let error_code = JSON.stringify(jsonObj?.errors?.[0]?.with?.int || jsonObj?.errors?.[1]?.with?.int);
          expect((error_code = '26'));
        }

        //Define a fake permit parameter to get the expected unsigned bytes
        const transfer_param: any = fa12_contract.methodsObject['transfer']({
          from_: bootstrap2_address,
          to_: bootstrap3_address,
          value: 1
        }).toTransferParams().parameter?.value;
        const type = fa12_contract.entrypoints.entrypoints['transfer'];
        const TRANSFER_PARAM_PACKED = await Tezos.rpc.packData({
          data: transfer_param,
          type: type,
        });

        //Get the BLAKE2B of TRANSFER_PARAM_PACKED
        const packed_param = TRANSFER_PARAM_PACKED.packed;
        const TRANSFER_PARAM_HASHED = buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));

        //Get Bootstrap2's public_key and capture it
        const PUB_KEY = await LocalTez2.signer.publicKey();
        const SIGNATURE = await create_bytes_to_sign(LocalTez2, fa12_contract.address, TRANSFER_PARAM_HASHED)

        //Anyone can submit permit start
        const signed_permit_contract = await LocalTez4.contract.at(fa12_contract.address);
        const permit_contract = await signed_permit_contract.methodsObject
          .permit([{ 0: PUB_KEY, 1: { 0: SIGNATURE, 1: TRANSFER_PARAM_HASHED } }])
          .send();
        await permit_contract.confirmation();
        expect(permit_contract.hash).toBeDefined();
        expect(permit_contract.status).toEqual('applied');

        //Successfully execute transfer away from bootstrap2  by calling transfer endpoint from any account
        const successful_transfer = await signed_permit_contract.methodsObject
          .transfer({ from_: bootstrap2_address, to_: bootstrap3_address, value: 1 })
          .send();
        await successful_transfer.confirmation();
        expect(successful_transfer.hash).toBeDefined();
        expect(successful_transfer.status).toEqual('applied');

      });
    });
  });
});
