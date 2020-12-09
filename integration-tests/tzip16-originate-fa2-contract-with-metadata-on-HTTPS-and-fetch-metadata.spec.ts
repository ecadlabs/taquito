import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { MichelsonMap } from "@taquito/taquito";
import { fa2ContractTzip16 } from "./data/fa2_contract_with_metadata";
import { tzip16 } from '../packages/taquito-tzip16/src/composer';
import { Tzip16Module } from "../packages/taquito-tzip16/src/tzip16-extension";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());
    let contractAddress: string;
    describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('Deploy a Fa2 contract having metadata stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1WCcgKMtFwSpdBc9kJ7vsH7MEmuXphon8K
            // delphinet: KT1DNapRVdG9t74fzAvXLcKDcgxZd1i1TobV

            const LocalTez1 = await createAddress();
            const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
            const LocalTez2 = await createAddress();
            const localTez2Pkh = await LocalTez2.signer.publicKeyHash();


            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/fa2-metadata.json';
            const bytesUrl = char2Bytes(url);

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
                        pending_owner: null
                    },
                    token_metadata_registry: 'KT1JRrD7gte5ssFePBARMUN7XocKRvvwgXDR',
                    transferlist_contract: null
                },
            });
            await op.confirmation();
            contractAddress = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch metadata of the Fa2 contract', async (done) => {
            // carthagenet: KT1WCcgKMtFwSpdBc9kJ7vsH7MEmuXphon8K
            // delphinet: KT1DNapRVdG9t74fzAvXLcKDcgxZd1i1TobV

            const contract = await Tezos.contract.at(contractAddress, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/fa2-metadata.json');
            //expect(metadata.integrityCheckResult).toBeUndefined();
            //expect(metadata.sha256Hash).toBeUndefined();
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
                                "michelson-storage-view": {
                                    "annotations": [

                                    ],
                                    "return-type": {
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
                                "michelson-storage-view": {
                                    "annotations": [

                                    ],
                                    "return-type": {
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
            done();
        });
    });
})
