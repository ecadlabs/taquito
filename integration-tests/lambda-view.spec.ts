import { MichelsonMap } from '@taquito/taquito';
import { CONFIGS } from './config';
import { tzip7Contract } from './data/tzip_7_contract';
import { testContract } from './data/test_lambda_view';
import { fa2Contract } from './data/fa2_contract';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const toJSON = (x: any) => JSON.parse(JSON.stringify(x));

  const test = require('jest-retries');

  describe(`Lambda view using: ${rpc}`, () => {
    beforeEach(async done => {
      await setup();
      done()
    });

    test('Originate FA1.2 contract and fetch data from view entrypoints', 2, async (done: () => void) => {
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
      const contract = await op.contract();

      const getTotalSupply = await contract.views.getTotalSupply([['Unit']]).read();
      expect(getTotalSupply.toString()).toEqual('100');

      const getBalance = await contract.views.getBalance('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1').read();
      expect(getBalance.toString()).toEqual('50');

      const getAllowance = await contract.views.getAllowance('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM').read();
      expect(getAllowance.toString()).toEqual('25');

      done();
    })


    test('Originate a contract and fetch data from view entrypoints', 2, async (done: () => void) => {

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
      const contract = await op.contract();

      const getBalance = await contract.views.getBalance('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY').read();
      expect(toJSON(getBalance)).toEqual({
        balance: '50',
        owner: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'
      });

      done();
    });


    test('Originate FA2 contract and fetch data from view entrypoints', 2, async (done: () => void) => {

      const bigMapLedger = new MichelsonMap();
      bigMapLedger.set('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', {
        allowances: ['tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'],
        balance: '50'
      });
      bigMapLedger.set('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', {
        allowances: ['tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE'],
        balance: '50',
      });

      const tokenMetadataBigMap = new MichelsonMap();
      tokenMetadataBigMap.set('0', {
        token_id: '0',
        symbol: 'hello',
        name: 'test',
        decimals: '0',
        extras: new MichelsonMap()
      });
      tokenMetadataBigMap.set('1', {
        token_id: '1',
        symbol: 'world',
        name: 'test2',
        decimals: '0',
        extras: new MichelsonMap()
      });

      const op = await Tezos.contract.originate({
        balance: "1",
        code: fa2Contract,
        storage: {
          ledger: bigMapLedger,
          token_metadata: tokenMetadataBigMap,
          total_supply: '100'
        },
      })

      await op.confirmation()
      const contract = await op.contract();

      const balance_of = await contract.views.balance_of([{ owner: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', token_id: '0' }]).read();
      expect(toJSON(balance_of)).toEqual([{
        "balance": "50",
        "request": {
          "owner": "tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1",
          "token_id": "0"
        }
      }]);

      done();
    });
  });
});
