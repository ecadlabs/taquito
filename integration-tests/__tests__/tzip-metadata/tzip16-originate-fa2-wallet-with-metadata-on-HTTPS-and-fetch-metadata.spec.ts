import { CONFIGS } from "../../config";
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';
import { MichelsonMap } from "@taquito/taquito";
import { fa2ContractTzip16 } from "../../data/fa2_contract_with_metadata";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
   const Tezos = lib;
   const test = require('jest-retries');
   Tezos.addExtension(new Tzip16Module());
   let contractAddress: string;
   describe(`Test contract origination of a fa2 contract having Tzip16 metadata and view through wallet api using: ${rpc}`, () => {

      beforeEach(async () => {
         await setup()
      })

      test('Verify contract.originate for a Fa2 contract having metadata on HTTPS', 2, async () => {

         const LocalTez1 = await createAddress();
         const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
         const LocalTez2 = await createAddress();
         const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

         // location of the contract metadata
         const url = 'https://storage.googleapis.com/tzip-16/fa2-metadata.json';
         const bytesUrl = stringToBytes(url);

         const metadataBigMAp = new MichelsonMap();
         metadataBigMAp.set("", bytesUrl);

         const ledger = new MichelsonMap();
         ledger.set(localTez1Pkh, '5');
         ledger.set(localTez2Pkh, '2');

         const operatorsMap = new MichelsonMap();
         operatorsMap.set({
            0: localTez1Pkh,
            1: localTez2Pkh
         },
            'None');
         // file deepcode ignore object-literal-shorthand: not sure how to fix
         const op = await Tezos.wallet.originate({
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
                  pending_owner: null
               },
               token_metadata_registry: 'KT1JRrD7gte5ssFePBARMUN7XocKRvvwgXDR',
               transferlist_contract: null
            },
         }).send();
         await op.confirmation();
         contractAddress = (await op.contract()).address;
         expect(op.opHash).toBeDefined();
      });

      test('Verify that metadata for a Fa2 contract can be fetched', 2, async () => {
         const contract = await Tezos.wallet.at(contractAddress, tzip16);
         const metadata = await contract.tzip16().getMetadata();

         expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/fa2-metadata.json');
         expect(metadata.integrityCheckResult).toBeUndefined();
         expect(metadata.sha256Hash).toBeUndefined();
         expect(metadata.metadata).toEqual({
            "name": "FA2 having metadata",
            "description": "This is a test for Taquito integration tests of a Fa2 contract having metadata stored on an HTTPS URL",
            "source": {
               "tools": [
                  "stablecoin 1.4.0"
               ],
               "location": "https://github.com/tqtezos/stablecoin/"
            },
            "interfaces": [
               "TZIP-12",
               "TZIP-17"
            ],
            "views": [
               {
                  "implementations": [
                     {
                        "michelsonStorageView": {
                           "annotations": [

                           ],
                           "returnType": {
                              "args": [

                              ],
                              "prim": "nat",
                              "annots": [

                              ]
                           },
                           "code": [
                              {
                                 "args": [

                                 ],
                                 "prim": "CDR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              }
                           ],
                           "parameter": {
                              "args": [

                              ],
                              "prim": "unit",
                              "annots": [

                              ]
                           }
                        }
                     }
                  ],
                  "name": "GetDefaultExpiry",
                  "pure": true,
                  "description": "Access the contract's default expiry in seconds"
               },
               {
                  "implementations": [
                     {
                        "michelsonStorageView": {
                           "annotations": [

                           ],
                           "returnType": {
                              "args": [

                              ],
                              "prim": "nat",
                              "annots": [

                              ]
                           },
                           "code": [
                              {
                                 "args": [

                                 ],
                                 "prim": "CDR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CDR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CDR",
                                 "annots": [

                                 ]
                              },
                              {
                                 "args": [

                                 ],
                                 "prim": "CAR",
                                 "annots": [

                                 ]
                              }
                           ],
                           "parameter": {
                              "args": [

                              ],
                              "prim": "unit",
                              "annots": [

                              ]
                           }
                        }
                     }
                  ],
                  "name": "GetCounter",
                  "pure": true,
                  "description": "Access the current permit counter"
               }
            ],
            "license": {
               "name": "MIT"
            },
            "errors": [
               {
                  "error": {
                     "string": "FA2_TOKEN_UNDEFINED"
                  },
                  "expansion": {
                     "string": "All `token_id`s must be 0"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "FA2_INSUFFICIENT_BALANCE"
                  },
                  "expansion": {
                     "string": "Cannot debit from a wallet because of insufficient amount of tokens"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "FA2_NOT_OPERATOR"
                  },
                  "expansion": {
                     "string": "You're neither the owner or a permitted operator of one or more wallets from which tokens will be transferred"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "XTZ_RECEIVED"
                  },
                  "expansion": {
                     "string": "Contract received a non-zero amount of tokens"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_CONTRACT_OWNER"
                  },
                  "expansion": {
                     "string": "Operation can only be performed by the contract's owner"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_PENDING_OWNER"
                  },
                  "expansion": {
                     "string": "Operation can only be performed by the current contract's pending owner"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NO_PENDING_OWNER_SET"
                  },
                  "expansion": {
                     "string": "There's no pending transfer of ownership"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_PAUSER"
                  },
                  "expansion": {
                     "string": "Operation can only be performed by the contract's pauser"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_MASTER_MINTER"
                  },
                  "expansion": {
                     "string": "Operation can only be performed by the contract's master minter"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_MINTER"
                  },
                  "expansion": {
                     "string": "Operation can only be performed by registered minters"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "CONTRACT_PAUSED"
                  },
                  "expansion": {
                     "string": "Operation cannot be performed while the contract is paused"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "CONTRACT_NOT_PAUSED"
                  },
                  "expansion": {
                     "string": "Operation cannot be performed while the contract is not paused"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "NOT_TOKEN_OWNER"
                  },
                  "expansion": {
                     "string": "You cannot configure another user's operators"
                  },
                  "languages": [
                     "en"
                  ]
               },
               {
                  "error": {
                     "string": "CURRENT_ALLOWANCE_REQUIRED"
                  },
                  "expansion": {
                     "string": "The given address is already a minter, you must specify its current minting allowance"
                  },
                  "languages": [
                     "en"
                  ]
               }
            ]
         });

         expect(await (await contract.tzip16()).metadataName()).toEqual('FA2 having metadata')
         expect(await (await contract.tzip16()).metadataDescription()).toEqual('This is a test for Taquito integration tests of a Fa2 contract having metadata stored on an HTTPS URL')
         expect(await (await contract.tzip16()).metadataVersion()).toBeUndefined()
         expect(await (await contract.tzip16()).metadataLicense()).toEqual({
            "name": "MIT"
         })
         expect(await (await contract.tzip16()).metadataAuthors()).toBeUndefined()
         expect(await (await contract.tzip16()).metadataHomepage()).toBeUndefined()
         expect(await (await contract.tzip16()).metadataSource()).toEqual({
            "tools": [
               "stablecoin 1.4.0"
            ],
            "location": "https://github.com/tqtezos/stablecoin/"
         })
         expect(await (await contract.tzip16()).metadataInterfaces()).toEqual([
            "TZIP-12",
            "TZIP-17"
         ])
         expect(await (await contract.tzip16()).metadataErrors()).toEqual([
            {
               "error": {
                  "string": "FA2_TOKEN_UNDEFINED"
               },
               "expansion": {
                  "string": "All `token_id`s must be 0"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "FA2_INSUFFICIENT_BALANCE"
               },
               "expansion": {
                  "string": "Cannot debit from a wallet because of insufficient amount of tokens"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "FA2_NOT_OPERATOR"
               },
               "expansion": {
                  "string": "You're neither the owner or a permitted operator of one or more wallets from which tokens will be transferred"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "XTZ_RECEIVED"
               },
               "expansion": {
                  "string": "Contract received a non-zero amount of tokens"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_CONTRACT_OWNER"
               },
               "expansion": {
                  "string": "Operation can only be performed by the contract's owner"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_PENDING_OWNER"
               },
               "expansion": {
                  "string": "Operation can only be performed by the current contract's pending owner"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NO_PENDING_OWNER_SET"
               },
               "expansion": {
                  "string": "There's no pending transfer of ownership"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_PAUSER"
               },
               "expansion": {
                  "string": "Operation can only be performed by the contract's pauser"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_MASTER_MINTER"
               },
               "expansion": {
                  "string": "Operation can only be performed by the contract's master minter"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_MINTER"
               },
               "expansion": {
                  "string": "Operation can only be performed by registered minters"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "CONTRACT_PAUSED"
               },
               "expansion": {
                  "string": "Operation cannot be performed while the contract is paused"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "CONTRACT_NOT_PAUSED"
               },
               "expansion": {
                  "string": "Operation cannot be performed while the contract is not paused"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "NOT_TOKEN_OWNER"
               },
               "expansion": {
                  "string": "You cannot configure another user's operators"
               },
               "languages": [
                  "en"
               ]
            },
            {
               "error": {
                  "string": "CURRENT_ALLOWANCE_REQUIRED"
               },
               "expansion": {
                  "string": "The given address is already a minter, you must specify its current minting allowance"
               },
               "languages": [
                  "en"
               ]
            }
         ])
      });

      test('Verify that Fa2 contract view can be executed', 2, async () => {
         // edonet: KT1XKs56Z8iXpYAD3pzfyXC3B4maJciob74X

         const contractAbstraction = await Tezos.wallet.at(contractAddress, tzip16);
         const metadataViews = await contractAbstraction.tzip16().metadataViews();

         const viewGetCounterResult = await metadataViews.GetCounter().executeView('Unit');
         expect(viewGetCounterResult.toString()).toEqual('0');

         const viewGetDefaultExpiryResult = await metadataViews.GetDefaultExpiry().executeView();
         expect(viewGetDefaultExpiryResult.toString()).toEqual('1000');

      });
   });
})
