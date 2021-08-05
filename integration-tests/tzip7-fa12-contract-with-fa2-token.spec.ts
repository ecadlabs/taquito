import { compose, MichelsonMap } from '@taquito/taquito';
import { CONFIGS } from './config';
import { fa12WithFa2Token } from './data/fa12WithFa2Token';
import { tzip12 } from '../packages/taquito-tzip12/src/composer';
import { tzip16, Tzip16Module } from '@taquito/tzip16';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  describe(`Originate the contracts for the Fa12 Contract with Token Metadata: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    test('Originate FA1.2 contract and fetch data from view entrypoints', async (done: () => void) => {
      const admin_address = await Tezos.signer.publicKeyHash();
      const funding_op = await Tezos.contract.transfer({
        to: admin_address,
        amount: 1,
      });
      await funding_op.confirmation();

      const LocalTez2 = await createAddress();
      const signer_address = await LocalTez2.signer.publicKeyHash();
      const funding_op2 = await Tezos.contract.transfer({
        to: signer_address,
        amount: 0.5,
      });
      await funding_op2.confirmation();

      const tokens = new MichelsonMap();
      const token_details = new MichelsonMap();

      token_details.set(admin_address, 1000);
      tokens.set(admin_address, { 0: 1000, 1: token_details });

      const fa12_contract_with_fa2_token_op = await Tezos.contract.originate({
        code: fa12WithFa2Token,
        storage: {
          0: tokens,
          1: admin_address,
          2: false,
          3: 0,
        },
      });

      await fa12_contract_with_fa2_token_op.confirmation();
      const fa12_contract_with_fa2_token = await fa12_contract_with_fa2_token_op.contract();
      const contract_address = await fa12_contract_with_fa2_token.address;
      console.log('fa12_contract_with_fa2_token : ' + fa12_contract_with_fa2_token.address);

      //Mint 10 tokens to signer
      const mint_contract = await Tezos.contract.at(fa12_contract_with_fa2_token.address);
      const mint_op = await mint_contract.methods.mint(admin_address, 1).send();
      expect(mint_op.hash).toBeDefined();
      expect(mint_op.status).toEqual('applied');
      await mint_op.confirmation();

      //Transfer 10 tokens to signer
      const transfer_contract = await Tezos.contract.at(fa12_contract_with_fa2_token.address);
      const transfer_op = await transfer_contract.methods
        .transfer(admin_address, signer_address, 0)
        .send();
      expect(transfer_op.hash).toBeDefined();
      expect(transfer_op.status).toEqual('applied');
      await transfer_op.confirmation();

     
			// Fetch token
      const storage = await fa12_contract_with_fa2_token.storage;
      console.log("storage :" + JSON.stringify(storage));

      // const tokens_contract = await Tezos.contract.at(fa12_contract_with_fa2_token.address);
      // const getMetadata_contract = `KT1TS8gncRVzT3RsZYbXXht6nxxvUXYd66cP`
      // const tokenMetadata = await tokens_contract.methods.getMetadata([0],getMetadata_contract).send();
			//    expect(tokenMetadata).toEqual({
			//    	token_id: 0,
			//    	name: 'Token',
			//    	symbol: 'TO'
			//   });

      const getTotalSupply = await fa12_contract_with_fa2_token.views.getTotalSupply([['Unit']]).read();
      expect(getTotalSupply.toString()).toEqual('1');

      const getBalance = await fa12_contract_with_fa2_token.views.getBalance(admin_address).read();
      expect(getBalance.toString()).toEqual('1001');

      const getAllowance = await fa12_contract_with_fa2_token.views.getAllowance(admin_address, signer_address).read();
      expect(getAllowance.toString()).toEqual('0');

      done();
    });
  });
});
