import { ContractAbstraction, ContractProvider, MichelsonMap } from '@taquito/taquito';
import { CONFIGS } from './config';
import { tzip7Contract } from './data/tzip_7_contract';
import { testContract } from './data/test_lambda_view'

CONFIGS().forEach(({ lib, network, rpc, setup }) => {
  const Tezos = lib;
  let contract: ContractAbstraction<ContractProvider>;
  //const contract = await Tezos.contract.at('KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto');
console.log(network)
  describe(`Lambda view using: ${rpc}`, () => {
    beforeEach(async done => {
      await setup();
      done()
  });

  it('Originate FA1.2 contract and get view entrypoints', async done => { 
      const mapAccount1 = new MichelsonMap();
      mapAccount1.set('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', '25');
      mapAccount1.set('tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE', '25');

      const mapAccount2 = new MichelsonMap();
      mapAccount2.set('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', '25');
      mapAccount2.set('tz1bmyy6QX9HVf7EnBJ6avmWZJbPYGAgXhbH', '25');

      const bigMapLedger = new MichelsonMap();
      bigMapLedger.set('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', {
        balance: '50',
        allowances: mapAccount1
      });
      bigMapLedger.set('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', {
        balance: '50',
        allowances: mapAccount2
      });

      const op = await Tezos.contract.originate({
        balance: "1",
        code: tzip7Contract,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          totalSupply: '100',
          ledger: bigMapLedger
        },
      })

      await op.confirmation()
      console.log('hash',op.hash)
      contract = await op.contract(); 
  
      const getTotalSupply = await Tezos.contract
      .lambdaView(network, contract.address, 'getTotalSupply')
      .then(view => view.execute())
      .catch(e => done(e));

    expect(getTotalSupply).toEqual({ int: '100' });

      const getBalance = await Tezos.contract
        .lambdaView(network, contract.address, 'getBalance', { string: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1' })
        .then(view => view.execute())
        .catch(e => done(e));

      expect(getBalance).toEqual({ int: '50' });

      const getAllowance = await Tezos.contract
        .lambdaView(network, contract.address, 'getAllowance', {
          prim: 'Pair',
          args: [
          {
            string: 'tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq'
          },
          {
            string: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
          }]})
        .then(view => view.execute())
        .catch(e => done(e));

      expect(getAllowance).toEqual({ int: '25' });


      const viewPromise = Tezos.contract.lambdaView(network, contract.address, 'unknownMethod');
      await expect(viewPromise).rejects.toThrow(/does not have entrypoint/);

      done();
    })
     

    it('executes `getBalance` on KT1R8uNCSm6pYHo2vNBzUHnvb9JQhY1ojeRy', async done => {

      const mapAccount2 = new MichelsonMap();
      mapAccount2.set('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', '25');
      mapAccount2.set('tz1bmyy6QX9HVf7EnBJ6avmWZJbPYGAgXhbH', '25');

      const mapAccount1 = new MichelsonMap();
      mapAccount1.set('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', {
        approvals: mapAccount2,
        balance: '50',
        whitelisted: true
      });
      mapAccount1.set('tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE', {
        approvals: mapAccount2,
        balance: '50',
        whitelisted: true
      });

      const op = await Tezos.contract.originate({
        balance: "1",
        code: testContract,
        storage: {
          administrator: await Tezos.signer.publicKeyHash(),
          balances: mapAccount1,
          pause: false,
          totalSupply: '50'
        },
      })

      await op.confirmation()
      console.log('hash',op.hash)
      contract = await op.contract(); 

      const result = await Tezos.contract
        .lambdaView(network, contract, 'getBalance', { string: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY' })
        .then(view => view.execute())
        .catch(e => done(e));

      expect(result).toEqual(
        { prim: 'Pair',
          args:
            [ { int: '50' },
              { bytes: '0000eadc0855adb415fa69a76fc10397dc2fb37039a0' } ] }
      );
      done();
    });


  }); 
});
