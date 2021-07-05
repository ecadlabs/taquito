import { CONFIGS } from "./config";
<<<<<<< HEAD
<<<<<<< HEAD
import { MichelsonMap, MichelCodecPacker, TezosOperationError } from "@taquito/taquito";
import { permit_admin_42_expiry} from "./data/permit_admin_42_expiry";
import { permit_admin_42_set} from "./data/permit_admin_42_set";
import { permit_fa12_smartpy} from "./data/permit_fa12_smartpy";
import { buf2hex, char2Bytes, hex2buf } from "@taquito/utils";
import { tzip16, Tzip16Module } from "@taquito/tzip16";

const blake = require('blakejs');
const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';

const errors_to_missigned_bytes = (errors: any[]) => {
  const errors_with = errors.map(x => x.with).filter(x => x !== undefined);
  if (errors_with.length != 1){
    throw ['errors_to_missigned_bytes: expected one error to fail "with" michelson, but found:', errors_with]
  } else {
    const error_with = errors_with[0];
    if (error_with.prim !== 'Pair'){
      throw ['errors_to_missigned_bytes: expected a "Pair", but found:', error_with.prim]
    } else {
      const error_with_args = error_with.args;
      if (error_with_args.length !== 2){
        throw ['errors_to_missigned_bytes: expected two arguments to "Pair", but found:', error_with_args]
      } else {
        if (error_with_args[0].string !== 'missigned'){
          throw ['errors_to_missigned_bytes: expected a "missigned" annotation, but found:', error_with_args[0]]
        } else {
          if (typeof error_with_args[1].bytes !== 'string'){
            throw ['errors_to_missigned_bytes: expected bytes, but found:', error_with_args[1].bytes]
          } else {
            return error_with_args[1].bytes
          }
        }
      }
    }
  }
} 

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.setPackerProvider(new MichelCodecPacker());

  describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
        done()
    })

    test('Permit can be submitted and set', async (done) => {
      const op = await Tezos.contract.originate({
        code: permit_admin_42_set,
        storage:
        {
        0: new MichelsonMap(),
        1: 300,
        2: bob_address
        },
        });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const permit_contract = await op.contract();
      expect(op.status).toEqual('applied')

      const signer_key = await Tezos.signer.publicKey()
      const dummy_sig = "edsigu5scrvoY2AB7cnHzUd7x7ZvXEMYkArKeehN5ZXNkmfUSkyApHcW5vPcjbuTrnHUMt8mJkWmo8WScNgKL3vu9akFLAXvHxm";
      
      const wrapped_param : any = permit_contract.methods['wrapped'](42).toTransferParams().parameter?.value;
      const wrapped_param_type = permit_contract.entrypoints.entrypoints['wrapped'];       
      const raw_packed = await Tezos.rpc.packData({
        data: wrapped_param,
        type: wrapped_param_type,
      })
      const packed_param = raw_packed.packed
      const param_hash =  buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));
      //const transfer_params = permit_contract.methods.permit(signer_key, dummy_sig, param_hash).toTransferParams();
      //const bytes_to_sign = await Tezos.estimate.transfer(transfer_params).catch((e) => errors_to_missigned_bytes(e.errors));
      
      const bytes_to_sign = await permit_contract.methods.permit(signer_key, dummy_sig, param_hash).send().catch((e) => errors_to_missigned_bytes(e.errors));
      
      const param_sig = await Tezos.signer.sign(bytes_to_sign)
      .then(s => s.prefixSig)
      .catch((error) => console.log(JSON.stringify(error)));

      const permitMethodCall = await permit_contract.methods.permit(signer_key, param_sig, param_hash).send();
      await permitMethodCall.confirmation();
      
      expect(permitMethodCall.hash).toBeDefined();
      expect(permitMethodCall.status).toEqual('applied');
      done();
    });

    test('Originate a permit contract and set expiry', async (done) => {

      const op = await Tezos.contract.originate({
        code: permit_admin_42_expiry,
        storage:
          {
          0: 300,
          1: new MichelsonMap(),
          2: 0,
          3: bob_address,
          4: bob_address
          },
        });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const expiry_contract = await op.contract();
      expect(op.status).toEqual('applied')

      const setExpiryMethodCall = await expiry_contract.methods.setExpiry(
          null, //bytes
          await Tezos.signer.publicKeyHash(), //address of current signer
          42 // nat
          ).send();
      await setExpiryMethodCall.confirmation();

      expect(setExpiryMethodCall.hash).toBeDefined();
      expect(setExpiryMethodCall.status).toEqual('applied');
      done();
    }); 

  test('Originate a permit contract and set defaultExpiry', async (done) => {
=======
import { MichelsonMap, MichelCodecPacker } from "@taquito/taquito";
import { importKey } from '@taquito/signer';
import { permit_admin_42} from "./data/permit_admin_42";
=======
import { MichelsonMap, MichelCodecPacker, TezosOperationError } from "@taquito/taquito";
>>>>>>> 56019594f... added tests for views
import { permit_admin_42_expiry} from "./data/permit_admin_42_expiry";
import { permit_admin_42_set} from "./data/permit_admin_42_set";
import { permit_fa12_smartpy} from "./data/permit_fa12_smartpy";
import { buf2hex, char2Bytes, hex2buf } from "@taquito/utils";
import { tzip16, Tzip16Module } from "@taquito/tzip16";

const blake = require('blakejs');
const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';

const errors_to_missigned_bytes = (errors: any[]) => {
  const errors_with = errors.map(x => x.with).filter(x => x !== undefined);
  if (errors_with.length != 1){
    throw ['errors_to_missigned_bytes: expected one error to fail "with" michelson, but found:', errors_with]
  } else {
    const error_with = errors_with[0];
    if (error_with.prim !== 'Pair'){
      throw ['errors_to_missigned_bytes: expected a "Pair", but found:', error_with.prim]
    } else {
      const error_with_args = error_with.args;
      if (error_with_args.length !== 2){
        throw ['errors_to_missigned_bytes: expected two arguments to "Pair", but found:', error_with_args]
      } else {
        if (error_with_args[0].string !== 'missigned'){
          throw ['errors_to_missigned_bytes: expected a "missigned" annotation, but found:', error_with_args[0]]
        } else {
          if (typeof error_with_args[1].bytes !== 'string'){
            throw ['errors_to_missigned_bytes: expected bytes, but found:', error_with_args[1].bytes]
          } else {
            return error_with_args[1].bytes
          }
        }
      }
    }
  }
} 

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.setPackerProvider(new MichelCodecPacker());

  describe(`Test of contracts having a permit for tzip-17: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
        done()
    })

    test('Permit can be submitted and set', async (done) => {

      const op = await Tezos.contract.originate({
        code: permit_admin_42_set,
        storage:
        {
        0: new MichelsonMap(),
        1: 300,
        2: bob_address
        },
        });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const permit_contract = await op.contract();
      expect(op.status).toEqual('applied')

      const signer_key = await Tezos.signer.publicKey()
      const dummy_sig = "edsigu5scrvoY2AB7cnHzUd7x7ZvXEMYkArKeehN5ZXNkmfUSkyApHcW5vPcjbuTrnHUMt8mJkWmo8WScNgKL3vu9akFLAXvHxm";
      
      const wrapped_param : any = permit_contract.methods['wrapped'](42).toTransferParams().parameter?.value;
      const wrapped_param_type = permit_contract.entrypoints.entrypoints['wrapped'];       
      const raw_packed = await Tezos.rpc.packData({
        data: wrapped_param,
        type: wrapped_param_type,
      })
      const packed_param = raw_packed.packed
      const param_hash =  buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));
      const transfer_params = permit_contract.methods.permit(signer_key, dummy_sig, param_hash).toTransferParams();
      const bytes_to_sign = await Tezos.estimate.transfer(transfer_params).catch((e) => errors_to_missigned_bytes(e.errors));
      
      const param_sig = await Tezos.signer.sign(bytes_to_sign)
      .then(s => s.prefixSig)
      .catch((error) => console.log(JSON.stringify(error)));

      const permitMethodCall = await permit_contract.methods.permit(signer_key, param_sig, param_hash).send();
      await permitMethodCall.confirmation();
      
      expect(permitMethodCall.hash).toBeDefined();
      expect(permitMethodCall.status).toEqual('applied');
      done();
    });

<<<<<<< HEAD
  test('Deploy a contract having a permit with expiry', async (done) => {
>>>>>>> 2964f7fb2... working draft
=======
    test('Originate a permit contract and set expiry', async (done) => {

      const op = await Tezos.contract.originate({
        code: permit_admin_42_expiry,
        storage:
          {
          0: 300,
          1: new MichelsonMap(),
          2: 0,
          3: bob_address,
          4: bob_address
          },
        });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const expiry_contract = await op.contract();
      expect(op.status).toEqual('applied')

      const setExpiryMethodCall = await expiry_contract.methods.setExpiry(
          null, //bytes
          await Tezos.signer.publicKeyHash(), //address of current signer
          42 // nat
          ).send();
      await setExpiryMethodCall.confirmation();

      expect(setExpiryMethodCall.hash).toBeDefined();
      expect(setExpiryMethodCall.status).toEqual('applied');
      done();
    }); 

  test('Originate a permit contract and set defaultExpiry', async (done) => {
>>>>>>> 56019594f... added tests for views

    const op = await Tezos.contract.originate({
      code: permit_admin_42_expiry,
      storage:
        {
        0: 300,
        1: new MichelsonMap(),
        2: 0,
<<<<<<< HEAD
<<<<<<< HEAD
        3: await Tezos.signer.publicKeyHash(),
        4: await Tezos.signer.publicKeyHash()
        },
      });
    await op.confirmation();
    expect(op.hash).toBeDefined();
    expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    const defaultExpiry_contract = await op.contract();
    expect(op.status).toEqual('applied')
 
    const defaultExpiryMethodCall = await defaultExpiry_contract.methods.defaultExpiry(
       100, // nat
      ).send();
    await defaultExpiryMethodCall.confirmation();

    expect(defaultExpiryMethodCall.hash).toBeDefined();
    expect(defaultExpiryMethodCall.status).toEqual('applied');
    done();
    }); 
  
  test('Originate a permit fa1.2 contract with metadata views', async (done) => {
  
    const url = 'https://storage.googleapis.com/tzip-16/permit_metadata.json';
    const bytesUrl = char2Bytes(url);
    const metadata = new MichelsonMap();
    metadata.set('', bytesUrl);
    
    const op = await Tezos.contract.originate({
      code: permit_fa12_smartpy,
      storage:
        {
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
        }
      });

   await op.confirmation();
   expect(op.hash).toBeDefined();
   expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
   const fa12_contract = await op.contract();
   const contractAddress = fa12_contract.address;
   expect(op.status).toEqual('applied')

   const mint_amount = 42

   const setMintMethodCall = await fa12_contract.methods.mint(
     await Tezos.signer.publicKeyHash(), //address :to
      mint_amount // nat :value
      ).send();
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

    done();
    }); 

    
  });
})
=======
        3: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH',
        4: 'tz1h1LzP7U8bNNhow8Mt1TNMxb91AjG3p6KH'
=======
        3: await Tezos.signer.publicKeyHash(),
        4: await Tezos.signer.publicKeyHash()
>>>>>>> 56019594f... added tests for views
        },
      });
    await op.confirmation();
    expect(op.hash).toBeDefined();
    expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    const defaultExpiry_contract = await op.contract();
    expect(op.status).toEqual('applied')
 
    const defaultExpiryMethodCall = await defaultExpiry_contract.methods.defaultExpiry(
       100, // nat
      ).send();
    await defaultExpiryMethodCall.confirmation();

    expect(defaultExpiryMethodCall.hash).toBeDefined();
    expect(defaultExpiryMethodCall.status).toEqual('applied');
    done();
    }); 
  
  test('Originate a permit fa1.2 contract with metadata views', async (done) => {
  
    const url = 'https://storage.googleapis.com/tzip-16/permit_metadata.json';
    const bytesUrl = char2Bytes(url);
    const metadata = new MichelsonMap();
    metadata.set('', bytesUrl);
    
    const op = await Tezos.contract.originate({
      code: permit_fa12_smartpy,
      storage:
        {
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
        }
      });
<<<<<<< HEAD
<<<<<<< HEAD
  })



>>>>>>> 2964f7fb2... working draft
=======
    });
  })
>>>>>>> 32175b6f1... fixes per review
=======

   await op.confirmation();
   expect(op.hash).toBeDefined();
   expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
   const fa12_contract = await op.contract();
   const contractAddress = fa12_contract.address;
   expect(op.status).toEqual('applied')

   const mint_amount = 42

   const setMintMethodCall = await fa12_contract.methods.mint(
     await Tezos.signer.publicKeyHash(), //address :to
      mint_amount // nat :value
      ).send();
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

    done();
    }); 

    
  });
})
>>>>>>> 56019594f... added tests for views
