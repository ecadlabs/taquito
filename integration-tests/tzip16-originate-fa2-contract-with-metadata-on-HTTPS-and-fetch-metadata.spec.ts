import { CONFIGS } from './config';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { MichelsonMap } from '@taquito/taquito';
import { fa2ContractTzip16 } from './data/fa2_contract_with_metadata';
import { RpcClient } from '@taquito/rpc';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());
  let contractAddress: string;

  describe(`Tzip16 metadata and view on a fa2 contract: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });

    it('Should deploy a Fa2 contract having metadata on HTTPS', async (done) => {
      const LocalTez1 = await createAddress();
      const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
      const LocalTez2 = await createAddress();
      const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/fa2-metadata.json';
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      const ledger = new MichelsonMap();
      ledger.set(localTez1Pkh, '5');
      ledger.set(localTez2Pkh, '2');

      const operatorsMap = new MichelsonMap();
      operatorsMap.set(
        {
          0: localTez1Pkh,
          1: localTez2Pkh,
        },
        'None'
      );

      const op = await Tezos.contract.originate({
        code: fa2ContractTzip16,
        storage: {
          default_expiry: 1000,
          ledger: ledger,
          metadata: metadataBigMAp,
          minting_allowances: new MichelsonMap(),
          operators: operatorsMap,
          paused: false,
          permit_counter: '0',
          permits: new MichelsonMap(),
          totalSupply: '100',
          roles: {
            master_minter: await Tezos.signer.publicKeyHash(),
            owner: localTez1Pkh,
            pauser: localTez2Pkh,
            pending_owner: null,
          },
          token_metadata_registry: 'KT1JRrD7gte5ssFePBARMUN7XocKRvvwgXDR',
          transferlist_contract: null,
        },
      });
      await op.confirmation();
      contractAddress = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(2);//?
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(4);//?
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(3);//?
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);//?
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);//?
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);//?
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );//?
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(4);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      done();
    });

    it('Should fetch metadata of the Fa2 contract', async (done) => {
      const contract = await Tezos.contract.at(contractAddress, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/fa2-metadata.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'FA2 having metadata',
        description:
          'This is a test for Taquito integration tests of a Fa2 contract having metadata stored on an HTTPS URL',
        source: {
          tools: ['stablecoin 1.4.0'],
          location: 'https://github.com/tqtezos/stablecoin/',
        },
        interfaces: ['TZIP-12', 'TZIP-17'],
        views: [
          {
            implementations: [
              {
                michelsonStorageView: {
                  annotations: [],
                  returnType: {
                    args: [],
                    prim: 'nat',
                    annots: [],
                  },
                  code: [
                    {
                      args: [],
                      prim: 'CDR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                  ],
                  parameter: {
                    args: [],
                    prim: 'unit',
                    annots: [],
                  },
                },
              },
            ],
            name: 'GetDefaultExpiry',
            pure: true,
            description: "Access the contract's default expiry in seconds",
          },
          {
            implementations: [
              {
                michelsonStorageView: {
                  annotations: [],
                  returnType: {
                    args: [],
                    prim: 'nat',
                    annots: [],
                  },
                  code: [
                    {
                      args: [],
                      prim: 'CDR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CDR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CDR',
                      annots: [],
                    },
                    {
                      args: [],
                      prim: 'CAR',
                      annots: [],
                    },
                  ],
                  parameter: {
                    args: [],
                    prim: 'unit',
                    annots: [],
                  },
                },
              },
            ],
            name: 'GetCounter',
            pure: true,
            description: 'Access the current permit counter',
          },
        ],
        license: {
          name: 'MIT',
        },
        errors: [
          {
            error: {
              string: 'FA2_TOKEN_UNDEFINED',
            },
            expansion: {
              string: 'All `token_id`s must be 0',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'FA2_INSUFFICIENT_BALANCE',
            },
            expansion: {
              string: 'Cannot debit from a wallet because of insufficient amount of tokens',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'FA2_NOT_OPERATOR',
            },
            expansion: {
              string:
                "You're neither the owner or a permitted operator of one or more wallets from which tokens will be transferred",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'XTZ_RECEIVED',
            },
            expansion: {
              string: 'Contract received a non-zero amount of tokens',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_CONTRACT_OWNER',
            },
            expansion: {
              string: "Operation can only be performed by the contract's owner",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_PENDING_OWNER',
            },
            expansion: {
              string: "Operation can only be performed by the current contract's pending owner",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NO_PENDING_OWNER_SET',
            },
            expansion: {
              string: "There's no pending transfer of ownership",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_PAUSER',
            },
            expansion: {
              string: "Operation can only be performed by the contract's pauser",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_MASTER_MINTER',
            },
            expansion: {
              string: "Operation can only be performed by the contract's master minter",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_MINTER',
            },
            expansion: {
              string: 'Operation can only be performed by registered minters',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'CONTRACT_PAUSED',
            },
            expansion: {
              string: 'Operation cannot be performed while the contract is paused',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'CONTRACT_NOT_PAUSED',
            },
            expansion: {
              string: 'Operation cannot be performed while the contract is not paused',
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'NOT_TOKEN_OWNER',
            },
            expansion: {
              string: "You cannot configure another user's operators",
            },
            languages: ['en'],
          },
          {
            error: {
              string: 'CURRENT_ALLOWANCE_REQUIRED',
            },
            expansion: {
              string:
                'The given address is already a minter, you must specify its current minting allowance',
            },
            languages: ['en'],
          },
        ],
      });
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(5);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/73598/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });

    it('Should execute views', async (done) => {
      const contractAbstraction = await Tezos.contract.at(contractAddress, tzip16);
      const metadataViews = await contractAbstraction.tzip16().metadataViews();

      const viewGetCounterResult = await metadataViews.GetCounter().executeView('Unit');
      expect(viewGetCounterResult.toString()).toEqual('0');

      const viewGetDefaultExpiryResult = await metadataViews.GetDefaultExpiry().executeView();
      expect(viewGetDefaultExpiryResult.toString()).toEqual('1000');
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(9);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/73607/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/balance`)
      ).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_code`)).toEqual(2);
      done();
    });
  });
});
