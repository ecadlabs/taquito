import { Parser } from '@taquito/michel-codec'
import { Schema } from '../src/schema/storage';

describe('Complex big_map storage', () => {
  it('Should extract correct bigmap schema', () => {
    const example_storage_in_michelson = `(pair
    (pair
    (pair (address %administrator)
    (big_map %balances address
    (pair (map %approvals address nat) (nat %balance))))
    (pair (nat %counter) (pair (nat %default_expiry) (nat %max_expiry))))
    (pair
    (pair (big_map %metadata string bytes)
    (pair (bool %paused)
    (big_map %permit_expiries (pair address bytes) (option nat))))
    (pair (big_map %permits (pair address bytes) timestamp)
    (pair (nat %totalSupply) (big_map %user_expiries address (option nat))))))`
    
    const p = new Parser();
    const parsed_storage: any = p.parseMichelineExpression(example_storage_in_michelson);
    const schema = new Schema(parsed_storage);

    expect(schema.ExtractSchema()).toEqual({
                                "administrator": "address",
                                "balances": {
                                    "big_map": {
                                    "key": "address",
                                    "value": {
                                        "approvals": {
                                        "map": {
                                            "key": "address",
                                            "value": "nat"
                                        }
                                        },
                                        "balance": "nat"
                                    }
                                    }
                                },
                                "counter": "nat",
                                "default_expiry": "nat",
                                "max_expiry": "nat",
                                "metadata": {
                                    "big_map": {
                                    "key": "string",
                                    "value": "bytes"
                                    }
                                },
                                "paused": "bool",
                                "permit_expiries": {
                                    "big_map": {
                                    "key": {
                                        "0": "address",
                                        "1": "bytes"
                                    },
                                    "value": "nat"
                                    }
                                },
                                "permits": {
                                    "big_map": {
                                    "key": {
                                        "0": "address",
                                        "1": "bytes"
                                    },
                                    "value": "timestamp"
                                    }
                                },
                                "totalSupply": "nat",
                                "user_expiries": {
                                    "big_map": {
                                    "key": "address",
                                    "value": "nat"
                                    }
                                }
    });
  });

  it('Should extract correct bigmap schema for complex key-value pairs', () => {
    const example_storage_in_michelson = `(pair
    (pair
    (pair (address %administrator)
    (big_map %balances address
    (pair (map %approvals address nat) (nat %balance))))
    (pair (nat %counter) (pair (nat %default_expiry) (nat %max_expiry))))
    (pair
    (pair (big_map %metadata string bytes)
    (pair (bool %paused)
    (big_map %permit_expiries (big_map (pair address bytes) bytes) (option nat))))
    (pair (big_map %permits (big_map address (pair address bytes)) timestamp)
    (pair (nat %totalSupply) (big_map %user_expiries address (option nat))))))`
    
    const p = new Parser();
    const parsed_storage: any = p.parseMichelineExpression(example_storage_in_michelson);
    const schema = new Schema(parsed_storage);

    expect(schema.ExtractSchema()).toEqual({
                            "administrator": "address",
                            "balances": {
                                "big_map": {
                                "key": "address",
                                "value": {
                                    "approvals": {
                                    "map": {
                                        "key": "address",
                                        "value": "nat"
                                    }
                                    },
                                    "balance": "nat"
                                }
                                }
                            },
                            "counter": "nat",
                            "default_expiry": "nat",
                            "max_expiry": "nat",
                            "metadata": {
                                "big_map": {
                                "key": "string",
                                "value": "bytes"
                                }
                            },
                            "paused": "bool",
                            "permit_expiries": {
                                "big_map": {
                                "key": {
                                    "big_map": {
                                    "key": {
                                        "0": "address",
                                        "1": "bytes"
                                    },
                                    "value": "bytes"
                                    }
                                },
                                "value": "nat"
                                }
                            },
                            "permits": {
                                "big_map": {
                                "key": {
                                    "big_map": {
                                    "key": "address",
                                    "value": {
                                        "0": "address",
                                        "1": "bytes"
                                    }
                                    }
                                },
                                "value": "timestamp"
                                }
                            },
                            "totalSupply": "nat",
                            "user_expiries": {
                                "big_map": {
                                "key": "address",
                                "value": "nat"
                                }
                            }
    });
  });
});
