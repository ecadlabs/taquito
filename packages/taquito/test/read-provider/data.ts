import BigNumber from 'bignumber.js';

/* sample responses from the RPC */

export const constantsRpc = {
    "proof_of_work_nonce_size": 8,
    "nonce_length": 32,
    "max_anon_ops_per_block": 132,
    "max_operation_data_length": 32768,
    "max_proposals_per_delegate": 20,
    "max_micheline_node_count": 50000,
    "max_micheline_bytes_limit": 50000,
    "max_allowed_global_constants_depth": 10000,
    "cache_layout": [
        new BigNumber("100000000")
    ],
    "michelson_maximum_type_size": 2001,
    "preserved_cycles": 5,
    "blocks_per_cycle": 8192,
    "blocks_per_commitment": 64,
    "blocks_per_roll_snapshot": 512,
    "blocks_per_voting_period": 40960,
    "time_between_blocks": [
        new BigNumber("60"),
        new BigNumber("40")
    ],
    "endorsers_per_block": 256,
    "hard_gas_limit_per_operation": new BigNumber("1040000"),
    "hard_gas_limit_per_block": new BigNumber("5200000"),
    "proof_of_work_threshold": new BigNumber("70368744177663"),
    "tokens_per_roll": new BigNumber("8000000000"),
    "seed_nonce_revelation_tip": new BigNumber("125000"),
    "origination_size": 257,
    "block_security_deposit": new BigNumber("640000000"),
    "endorsement_security_deposit": new BigNumber("2500000"),
    "baking_reward_per_endorsement": [
        new BigNumber("78125"),
        new BigNumber("11719")
    ],
    "endorsement_reward": [
        new BigNumber("78125"),
        new BigNumber("52083")
    ],
    "cost_per_byte": new BigNumber("250"),
    "hard_storage_limit_per_operation": new BigNumber("60000"),
    "quorum_min": 2000,
    "quorum_max": 7000,
    "min_proposal_quorum": 500,
    "initial_endorsers": 192,
    "delay_per_missing_endorsement": new BigNumber("4"),
    "minimal_block_delay": new BigNumber("30"),
    "liquidity_baking_subsidy": new BigNumber("2500000"),
    "liquidity_baking_sunset_level": 2244609,
    "liquidity_baking_escape_ema_threshold": 1000000
}

export const contractCodeSample = [
    {
        "prim": "parameter",
        "args": [
            {
                "prim": "or",
                "args": [
                    {
                        "prim": "address",
                        "annots": [
                            "%addOwner"
                        ]
                    },
                    {
                        "prim": "string",
                        "annots": [
                            "%storeValue"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "prim": "storage",
        "args": [
            {
                "prim": "pair",
                "args": [
                    {
                        "prim": "set",
                        "args": [
                            {
                                "prim": "address"
                            }
                        ],
                        "annots": [
                            "%owners"
                        ]
                    },
                    {
                        "prim": "string",
                        "annots": [
                            "%storedValue"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "prim": "code",
        "args": [
            [
                [
                    [
                        {
                            "prim": "DUP"
                        },
                        {
                            "prim": "CAR"
                        },
                        {
                            "prim": "DIP",
                            "args": [
                                [
                                    {
                                        "prim": "CDR"
                                    }
                                ]
                            ]
                        }
                    ]
                ],
                {
                    "prim": "SWAP"
                },
                {
                    "prim": "DUP"
                },
                {
                    "prim": "DUG",
                    "args": [
                        {
                            "int": "2"
                        }
                    ]
                },
                {
                    "prim": "SENDER"
                },
                {
                    "prim": "SWAP"
                },
                {
                    "prim": "CAR"
                },
                {
                    "prim": "SWAP"
                },
                {
                    "prim": "MEM"
                },
                {
                    "prim": "IF",
                    "args": [
                        [

                        ],
                        [
                            {
                                "prim": "PUSH",
                                "args": [
                                    {
                                        "prim": "string"
                                    },
                                    {
                                        "string": "failed assertion"
                                    }
                                ]
                            },
                            {
                                "prim": "FAILWITH"
                            }
                        ]
                    ]
                },
                {
                    "prim": "IF_LEFT",
                    "args": [
                        [
                            {
                                "prim": "SWAP"
                            },
                            {
                                "prim": "DUP"
                            },
                            {
                                "prim": "DUG",
                                "args": [
                                    {
                                        "int": "2"
                                    }
                                ]
                            },
                            {
                                "prim": "CDR"
                            },
                            {
                                "prim": "DIG",
                                "args": [
                                    {
                                        "int": "2"
                                    }
                                ]
                            },
                            {
                                "prim": "CAR"
                            },
                            {
                                "prim": "DIG",
                                "args": [
                                    {
                                        "int": "2"
                                    }
                                ]
                            },
                            {
                                "prim": "PUSH",
                                "args": [
                                    {
                                        "prim": "bool"
                                    },
                                    {
                                        "prim": "True"
                                    }
                                ]
                            },
                            {
                                "prim": "SWAP"
                            },
                            {
                                "prim": "UPDATE"
                            },
                            {
                                "prim": "PAIR"
                            },
                            {
                                "prim": "NIL",
                                "args": [
                                    {
                                        "prim": "operation"
                                    }
                                ]
                            },
                            {
                                "prim": "PAIR"
                            }
                        ],
                        [
                            {
                                "prim": "SWAP"
                            },
                            {
                                "prim": "CAR"
                            },
                            {
                                "prim": "PAIR"
                            },
                            {
                                "prim": "NIL",
                                "args": [
                                    {
                                        "prim": "operation"
                                    }
                                ]
                            },
                            {
                                "prim": "PAIR"
                            }
                        ]
                    ]
                }
            ]
        ]
    }
]

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const storageType = contractCodeSample.find(
    x => x.prim === 'storage'
)!.args[0] as any;

export const contractStorage = {
    "prim": "Pair",
    "args": [
        [
            {
                "bytes": "00000e5b9b05c6a04a01254bc879eb50bb1bed651aff"
            }
        ],
        {
            "string": "1feb23303c012f0c1b56b2b9fe2c85c9fd725662aec3c35ea835c0588deb8f2e"
        }
    ]
}

export const blockHeader = {
    "protocol": "PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx",
    "chain_id": "NetXdQprcVkpaWU",
    "hash": "BMLSgpbkkpjwPcz4V73DBehuyUiusANELHKPMiQhsb9psm5gTWD",
    "level": 2100696,
    "proto": 11,
    "predecessor": "BKqt4gUvfccTEKLwo4j75aepBbgh27h8q7RfrULHu5Cmuv2GMr2",
    "timestamp": "2022-02-08T16:49:34Z",
    "validation_pass": 4,
    "operations_hash": "LLoap4wCgvDCFEN3hmqkhzYCbT4Cce3FzWFiiM9GGgeEEvonk2Emo",
    "fitness": [
        "01",
        "0000000000160dd8"
    ],
    "context": "CoUokoYDnP28w2dQrhjAeiYhK8KHppdXPbdb4J2hoftVTGbNJ72U",
    "priority": 0,
    "proof_of_work_nonce": "0e7a0e9ae2da0300",
    "liquidity_baking_escape_vote": false,
    "signature": "sigoCZ1nQJuzMTCpB18tWFhdNRvFH9EvbhCdWJqNzxeFsSWsKn5Rw3Ha3upgTWEctzcAPHwK22jNtNhBMao3DapmeACDS6k6"
}

export const contractResponse = {
    "balance": "51348935600",
    "counter": "161327"
}

export const bigmapValue = {
    "prim": "Pair",
    "args": [
        [

        ],
        {
            "int": "100"
        }
    ]
}

export const saplingState = {
    "root": "fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e",
    "commitments_and_ciphertexts": [

    ],
    "nullifiers": [

    ]
}

export const contractEntrypoints = {
    "entrypoints": {
        "increment": {
            "prim": "int"
        },
        "decrement": {
            "prim": "int"
        }
    }
}