<<<<<<< HEAD
/**
 * This example of interaction with a permit contract is taken from https://github.com/tqtezos/lorentz-contract-permit.
 * It is also used in an integration test at integration-tests/contract-permits-set.spec.ts.
 */

import { ContractAbstraction, ContractProvider, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { Parser } from '@taquito/michel-codec';
import { buf2hex, hex2buf } from '@taquito/utils';

const blake = require('blakejs');
const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';
const Tezos = new TezosToolkit('https://api.tez.ie/rpc/florencenet');

const FAUCET_KEY = {
    mnemonic: [
        'cart',
        'will',
        'page',
        'bench',
        'notice',
        'leisure',
        'penalty',
        'medal',
        'define',
        'odor',
        'ride',
        'devote',
        'cannon',
        'setup',
        'rescue',
      ],
      // deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
      secret: '35f266fbf0fca752da1342fdfc745a9c608e7b20',
      amount: '4219352756',
      pkh: 'tz1YBMFg1nLAPxBE6djnCPbMRH5PLXQWt8Mg',
      password: 'Fa26j580dQ',
      email: 'jxmjvauo.guddusns@tezos.example.org',
    };
    
    importKey(
      Tezos,
      FAUCET_KEY.email,
      FAUCET_KEY.password,
      FAUCET_KEY.mnemonic.join(' '),
      FAUCET_KEY.secret
    );

    const errors_to_missigned_bytes = (errors: any[]) => {
      const errors_with = errors.map((x: { with: any; }) => x.with).filter((x: any) => x !== undefined);
=======
import { ContractAbstraction, ContractProvider, TezosToolkit } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/signer';
import { Parser } from '@taquito/michel-codec';
import { buf2hex, hex2buf } from '@taquito/utils';

    const blake = require('blakejs');
    const fs = require("fs");
    const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';
    const { email, password, mnemonic, secret } =
      JSON.parse(
        fs.readFileSync(require('os').homedir() + '/Downloads/' + bob_address + '.json').toString()
    );

    const Tezos = new TezosToolkit('https://api.tez.ie/rpc/florencenet');

    Tezos.setProvider({ signer: InMemorySigner.fromFundraiser(email, password, mnemonic.join(' ')) });

    importKey(
      Tezos,
      email,
      password,
      mnemonic.join(' '),
      secret
    ).catch((e) => console.error(e));

    const errors_to_missigned_bytes = errors => {
      const errors_with = errors.map(x => x.with).filter(x => x !== undefined);
>>>>>>> 292e1a8c9... finished the tests
      if (errors_with.length != 1){
        throw ['errors_to_missigned_bytes: expected one error to fail "with" michelson, but found:', errors_with]
      } else {
        const error_with = errors_with[0];
        const p = new Parser();
        const michelsonCode = p.parseJSON(error_with);
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

    async function permitParamHash(contract: ContractAbstraction<ContractProvider>,
                                  entrypoint: string,
                                  parameter: any): Promise<string> {
      const wrapped_param : any = contract.methods[entrypoint](parameter).toTransferParams().parameter?.value;
      const wrapped_param_type = contract.entrypoints.entrypoints[entrypoint];

      const raw_packed = await Tezos.rpc.packData({
        data: wrapped_param,
        type: wrapped_param_type,
      }).catch(e => console.error('error:', e));
<<<<<<< HEAD
      var packed_param: string;
=======
      var packed_param;
>>>>>>> 292e1a8c9... finished the tests
      if (raw_packed) {
        packed_param = raw_packed.packed
      } else {
        throw `packing ${wrapped_param} failed`
      };
        return buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));
      }

async function example() {
  try {
    //const permit_examples = async (done) => {
      console.log('inside: permit_examples');

      // Get the contract
      const permit_address = 'KT18iJy46FCwGDnPNHouVCR5iSacadNniTj8';
      const permit_contract = await Tezos.contract.at(permit_address);

      // Check whether bob is actually the admin
      const storage : any = await permit_contract.storage();
      console.log('bob is admin:', storage['2'] === bob_address);

      // Get the signer's public key and a dummy signature to trigger the error
      const signer_key = await Tezos.signer.publicKey().catch(e => console.error(e));
      const dummy_sig = "edsigu5scrvoY2AB7cnHzUd7x7ZvXEMYkArKeehN5ZXNkmfUSkyApHcW5vPcjbuTrnHUMt8mJkWmo8WScNgKL3vu9akFLAXvHxm";

      // Get the Blake2B hash of the packed parameter
      const param_hash = await permitParamHash(permit_contract, 'wrapped', 42);
      console.log('permitParamHash:', param_hash);

      const expected_param_hash = "0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c";
      if(param_hash === expected_param_hash) {
      } else {
<<<<<<< HEAD
        throw `unexpected param_hash: ${param_hash},\n
=======
        throw `unexpected param_hash: {param_hash},\n
>>>>>>> 292e1a8c9... finished the tests
        while {expected_param_hash} was expected`;
      }

      // Preapply a transfer with the dummy_sig to extract the bytes_to_sign
      const transfer_params = permit_contract.methods.permit(signer_key, dummy_sig, param_hash).toTransferParams();
      const bytes_to_sign = await Tezos.estimate.transfer(transfer_params).catch((e) => errors_to_missigned_bytes(e.errors));
      console.log('bytes_to_sign:', bytes_to_sign);

      // Sign the parameter
<<<<<<< HEAD
<<<<<<< HEAD
      const param_sig = await Tezos.signer.sign(bytes_to_sign)
                        .then(s => s.prefixSig)
                        .catch((error) => console.log(JSON.stringify(error)));
=======
      // file deepcode ignore PromiseNotCaughtGeneral: <please specify a reason of ignoring this>
      const param_sig = await Tezos.signer.sign(bytes_to_sign).then(s => s.prefixSig);
>>>>>>> 292e1a8c9... finished the tests
=======
      const param_sig = await Tezos.signer.sign(bytes_to_sign)
                        .then(s => s.prefixSig)
                        .catch((error) => console.log(JSON.stringify(error)));
>>>>>>> 3d91ae0ec... repair deep code complaints

      // This is what a relayer needs to submit the parameter on the signer's behalf
      console.log('permit package:', [signer_key, param_sig, param_hash]);

      // Submit the permit to the contract
      const permit_op = await permit_contract.methods.permit(signer_key, param_sig, param_hash).send();
<<<<<<< HEAD
<<<<<<< HEAD
      await permit_op.confirmation()
=======
      // file deepcode ignore PromiseNotCaughtGeneral: <please specify a reason of ignoring this>
      await permit_op.confirmation().then(() => console.log('permit_op hash:', permit_op.hash));
>>>>>>> 292e1a8c9... finished the tests
=======
      await permit_op.confirmation()
>>>>>>> 3d91ae0ec... repair deep code complaints

      console.log('ending: permit_examples');
    } catch (ex) {
      console.error(ex);
    }
  };

<<<<<<< HEAD
  example();
=======
  example();


>>>>>>> 292e1a8c9... finished the tests
