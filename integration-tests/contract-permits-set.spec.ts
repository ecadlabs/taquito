import { CONFIGS } from "./config";
import { MichelsonMap, MichelCodecPacker } from "@taquito/taquito";
import { permit_admin_42_set} from "./data/permit_admin_42_set";
import { Parser } from '@taquito/michel-codec'
import { importKey } from '@taquito/signer';
import { buf2hex, hex2buf } from "@taquito/utils";

const blake = require('blakejs');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib; 
  Tezos.setPackerProvider(new MichelCodecPacker());
  const bob_address = 'tz1Xk7HkSwHv6dTEgR7E2WC2yFj4cyyuj2Gh';
 
  const errors_to_missigned_bytes = (errors: any[]) => {
    const errors_with = errors.map(x => x.with).filter(x => x !== undefined);
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

  describe(`Tests of contracts having a permit for tzip-17: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      await importKey(
        Tezos,
        'peqjckge.qkrrajzs@tezos.example.org',
        'y4BX7qS1UE',
        [
          'skate',
          'damp',
          'faculty',
          'morning',
          'bring',
          'ridge',
          'traffic',
          'initial',
          'piece',
          'annual',
          'give',
          'say',
          'wrestle',
          'rare',
          'ability',
        ].join(' '),
        '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
      );
        done()
    })

    test('Create permit hash for an fa2 contract', async (done) => {

      const op = await Tezos.contract.originate({
        code: permit_admin_42_set,
        storage:
        {
        0: new MichelsonMap(),
        1: 300,
        2: bob_address,
        3: bob_address
        },
        });
        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(op.status).toEqual('applied')
        const permit_address = (await op.contract()).address

        // Get the contract
        const permit_contract = await Tezos.contract.at(permit_address);
       
        // Check whether bob is actually the admin
        const storage : any = await permit_contract.storage();

        // Get the signer's public key and a dummy signature to trigger the error
        const signer_key = await Tezos.signer.publicKey().catch(e => console.error(e));
        const dummy_sig = "edsigu5scrvoY2AB7cnHzUd7x7ZvXEMYkArKeehN5ZXNkmfUSkyApHcW5vPcjbuTrnHUMt8mJkWmo8WScNgKL3vu9akFLAXvHxm";
       
        // Get the Blake2B hash of the packed parameter
        const wrapped_param : any = permit_contract.methods['wrapped'](42).toTransferParams().parameter?.value;
        const wrapped_param_type = contract.entrypoints.entrypoints['wrapped'];       
        const raw_packed = await Tezos.rpc.packData({
          data: wrapped_param,
          type: wrapped_param_type,
        }).catch(e => console.error('error:', e));
        var packed_param;
        if (raw_packed) {
          packed_param = raw_packed.packed
        } else {
          throw `packing ${wrapped_param} failed`
        };
          
        const param_hash =  buf2hex(blake.blake2b(hex2buf(packed_param), null, 32));

        const expected_param_hash = "0f0db0ce6f057a8835adb6a2c617fd8a136b8028fac90aab7b4766def688ea0c";
        if(param_hash === expected_param_hash) {
        } else {
          throw `unexpected param_hash: {param_hash},\n
          while {expected_param_hash} was expected`;
        }
        
        // Preapply a transfer with the dummy_sig to extract the bytes_to_sign
        const transfer_params = permit_contract.methods.permit(signer_key, dummy_sig, param_hash).toTransferParams();
        const bytes_to_sign = await Tezos.estimate.transfer(transfer_params).catch((e) => errors_to_missigned_bytes(e.errors));
        
        // Sign the parameter
        const param_sig = await Tezos.signer.sign(bytes_to_sign)
            .then(s => s.prefixSig)
            .catch((error) => console.log(JSON.stringify(error)));

        // Submit the permit to the contract
        const permit_op = await permit_contract.methods.permit(signer_key, param_sig, param_hash).send();
        await permit_op.confirmation()
      done();
    })
  })
})
