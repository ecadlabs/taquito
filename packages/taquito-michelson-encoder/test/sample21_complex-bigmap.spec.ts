import { storage, complex_storage } from '../data/sample_complex_bigmap';
import { Schema } from '../src/schema/storage';

describe('Complex big_map storage', () => {
  it('Should extract correct bigmap schema', () => {
    const schema = new Schema(storage);

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
    const schema = new Schema(complex_storage);

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
