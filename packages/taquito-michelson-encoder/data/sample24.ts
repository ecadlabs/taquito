export const script24 = {
    "script": {
        "code": [
          {
            "prim": "parameter",
            "args": [
              {
                "prim": "or",
                "args": [
                  {
                    "prim": "or",
                    "args": [
                      {
                        "prim": "or",
                        "args": [
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "string",
                                "annots": [
                                  "%artist"
                                ]
                              },
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "address",
                                            "annots": [
                                              "%address"
                                            ]
                                          },
                                          {
                                            "prim": "nat",
                                            "annots": [
                                              "%tier1_index"
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "bytes",
                                            "annots": [
                                              "%tier1_metadata_path"
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier1_total_supply"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier2_index"
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "bytes",
                                            "annots": [
                                              "%tier2_metadata_path"
                                            ]
                                          },
                                          {
                                            "prim": "nat",
                                            "annots": [
                                              "%tier2_total_supply"
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "nat",
                                            "annots": [
                                              "%tier3_index"
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier3_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "int",
                                                "annots": [
                                                  "%tier3_total_supply"
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%artist_record"
                                ]
                              }
                            ],
                            "annots": [
                              "%add_artist_map"
                            ]
                          },
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "int",
                                    "annots": [
                                      "%amount_tokens"
                                    ]
                                  },
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%artist"
                                        ]
                                      },
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%pixel_artist"
                                        ]
                                      }
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%mint_JOKO_tier1"
                                ]
                              },
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "int",
                                    "annots": [
                                      "%amount_tokens"
                                    ]
                                  },
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%artist"
                                        ]
                                      },
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%pixel_artist"
                                        ]
                                      }
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%mint_JOKO_tier2"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "or",
                        "args": [
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "int",
                                    "annots": [
                                      "%amount_tokens"
                                    ]
                                  },
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%artist"
                                        ]
                                      },
                                      {
                                        "prim": "string",
                                        "annots": [
                                          "%pixel_artist"
                                        ]
                                      }
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%mint_JOKO_tier3"
                                ]
                              },
                              {
                                "prim": "address",
                                "annots": [
                                  "%register_fa2"
                                ]
                              }
                            ]
                          },
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "string",
                                "annots": [
                                  "%remove_artist_map"
                                ]
                              },
                              {
                                "prim": "unit",
                                "annots": [
                                  "%toggle_active"
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "prim": "or",
                    "args": [
                      {
                        "prim": "or",
                        "args": [
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "address",
                                "annots": [
                                  "%update_manager"
                                ]
                              },
                              {
                                "prim": "int",
                                "annots": [
                                  "%update_max_mint"
                                ]
                              }
                            ]
                          },
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "string",
                                    "annots": [
                                      "%artist"
                                    ]
                                  },
                                  {
                                    "prim": "address",
                                    "annots": [
                                      "%artist_address"
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%update_pixel_artist_map"
                                ]
                              },
                              {
                                "prim": "mutez",
                                "annots": [
                                  "%update_price"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "or",
                        "args": [
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "nat",
                                    "annots": [
                                      "%tier"
                                    ]
                                  },
                                  {
                                    "prim": "nat",
                                    "annots": [
                                      "%token_id"
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%update_tier"
                                ]
                              },
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "address",
                                                "annots": [
                                                  "%address"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier1_index"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier1_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier1_total_supply"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier2_index"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier2_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier2_total_supply"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier3_index"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "bytes",
                                                    "annots": [
                                                      "%tier3_metadata_path"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "int",
                                                    "annots": [
                                                      "%tier3_total_supply"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ],
                                    "annots": [
                                      "%royalties"
                                    ]
                                  },
                                  {
                                    "prim": "string",
                                    "annots": [
                                      "%subject"
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%update_tier2_royalties"
                                ]
                              }
                            ]
                          },
                          {
                            "prim": "or",
                            "args": [
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "address",
                                                "annots": [
                                                  "%address"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier1_index"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier1_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier1_total_supply"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier2_index"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier2_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier2_total_supply"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier3_index"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "bytes",
                                                    "annots": [
                                                      "%tier3_metadata_path"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "int",
                                                    "annots": [
                                                      "%tier3_total_supply"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ],
                                    "annots": [
                                      "%royalties"
                                    ]
                                  },
                                  {
                                    "prim": "string",
                                    "annots": [
                                      "%subject"
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%update_tier3_royalties"
                                ]
                              },
                              {
                                "prim": "pair",
                                "args": [
                                  {
                                    "prim": "nat",
                                    "annots": [
                                      "%token_id"
                                    ]
                                  },
                                  {
                                    "prim": "bytes",
                                    "annots": [
                                      "%token_info"
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%update_token_info"
                                ]
                              }
                            ]
                          }
                        ]
                      }
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
                    "prim": "pair",
                    "args": [
                      {
                        "prim": "pair",
                        "args": [
                          {
                            "prim": "bool",
                            "annots": [
                              "%active"
                            ]
                          },
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "pair",
                                    "args": [
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "address",
                                                "annots": [
                                                  "%address"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier1_index"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier1_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier1_total_supply"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "nat",
                                                    "annots": [
                                                      "%tier2_index"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      },
                                      {
                                        "prim": "pair",
                                        "args": [
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "bytes",
                                                "annots": [
                                                  "%tier2_metadata_path"
                                                ]
                                              },
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier2_total_supply"
                                                ]
                                              }
                                            ]
                                          },
                                          {
                                            "prim": "pair",
                                            "args": [
                                              {
                                                "prim": "nat",
                                                "annots": [
                                                  "%tier3_index"
                                                ]
                                              },
                                              {
                                                "prim": "pair",
                                                "args": [
                                                  {
                                                    "prim": "bytes",
                                                    "annots": [
                                                      "%tier3_metadata_path"
                                                    ]
                                                  },
                                                  {
                                                    "prim": "int",
                                                    "annots": [
                                                      "%tier3_total_supply"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ],
                                "annots": [
                                  "%artist_map"
                                ]
                              },
                              {
                                "prim": "address",
                                "annots": [
                                  "%fa2"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "pair",
                        "args": [
                          {
                            "prim": "nat",
                            "annots": [
                              "%joko_id"
                            ]
                          },
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "address",
                                "annots": [
                                  "%manager"
                                ]
                              },
                              {
                                "prim": "int",
                                "annots": [
                                  "%max_mint"
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "prim": "pair",
                    "args": [
                      {
                        "prim": "pair",
                        "args": [
                          {
                            "prim": "map",
                            "args": [
                              {
                                "prim": "string"
                              },
                              {
                                "prim": "map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "big_map",
                                    "args": [
                                      {
                                        "prim": "address"
                                      },
                                      {
                                        "prim": "int"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ],
                            "annots": [
                              "%max_per_address"
                            ]
                          },
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "big_map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "bytes"
                                  }
                                ],
                                "annots": [
                                  "%metadata"
                                ]
                              },
                              {
                                "prim": "map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "address"
                                  }
                                ],
                                "annots": [
                                  "%pixel_artist_map"
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "pair",
                        "args": [
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "mutez",
                                "annots": [
                                  "%price"
                                ]
                              },
                              {
                                "prim": "map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "nat"
                                  }
                                ],
                                "annots": [
                                  "%tier2_royalties"
                                ]
                              }
                            ]
                          },
                          {
                            "prim": "pair",
                            "args": [
                              {
                                "prim": "map",
                                "args": [
                                  {
                                    "prim": "string"
                                  },
                                  {
                                    "prim": "nat"
                                  }
                                ],
                                "annots": [
                                  "%tier3_royalties"
                                ]
                              },
                              {
                                "prim": "big_map",
                                "args": [
                                  {
                                    "prim": "nat"
                                  },
                                  {
                                    "prim": "nat"
                                  }
                                ],
                                "annots": [
                                  "%tier_map"
                                ]
                              }
                            ]
                          }
                        ]
                      }
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
                {
                  "prim": "UNPAIR"
                },
                {
                  "prim": "IF_LEFT",
                  "args": [
                    [
                      {
                        "prim": "IF_LEFT",
                        "args": [
                          [
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
                                    "prim": "CAR"
                                  },
                                  {
                                    "prim": "GET",
                                    "args": [
                                      {
                                        "int": "5"
                                      }
                                    ]
                                  },
                                  {
                                    "prim": "SENDER"
                                  },
                                  {
                                    "prim": "COMPARE"
                                  },
                                  {
                                    "prim": "EQ"
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
                                              "string": "WrongCondition: sp.sender == self.data.manager"
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
                                    "prim": "CAR"
                                  },
                                  {
                                    "prim": "CAR"
                                  },
                                  {
                                    "prim": "GET",
                                    "args": [
                                      {
                                        "int": "3"
                                      }
                                    ]
                                  },
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
                                    "prim": "CAR"
                                  },
                                  {
                                    "prim": "MEM"
                                  },
                                  {
                                    "prim": "IF",
                                    "args": [
                                      [
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "Already having this artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "FAILWITH"
                                        }
                                      ],
                                      [
                                        
                                      ]
                                    ]
                                  },
                                  {
                                    "prim": "SWAP"
                                  },
                                  {
                                    "prim": "UNPAIR"
                                  },
                                  {
                                    "prim": "UNPAIR"
                                  },
                                  {
                                    "prim": "UNPAIR"
                                  },
                                  {
                                    "prim": "SWAP"
                                  },
                                  {
                                    "prim": "UNPAIR"
                                  },
                                  {
                                    "prim": "DUP",
                                    "args": [
                                      {
                                        "int": "6"
                                      }
                                    ]
                                  },
                                  {
                                    "prim": "CDR"
                                  },
                                  {
                                    "prim": "SOME"
                                  },
                                  {
                                    "prim": "DIG",
                                    "args": [
                                      {
                                        "int": "6"
                                      }
                                    ]
                                  },
                                  {
                                    "prim": "CAR"
                                  },
                                  {
                                    "prim": "UPDATE"
                                  },
                                  {
                                    "prim": "PAIR"
                                  },
                                  {
                                    "prim": "SWAP"
                                  },
                                  {
                                    "prim": "PAIR"
                                  },
                                  {
                                    "prim": "PAIR"
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
                                  }
                                ],
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
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
                                                    "string": "WrongCondition: self.data.active"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
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
                                                    "string": "Not having this artist"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
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
                                                    "string": "Not having this pixel artist"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "IF",
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "265"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "265"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SUB"
                                              },
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LE"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
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
                                                    "string": "FA2_NOT_ENOUGH_SUPPLY"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LE"
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
                                                    "string": "WrongCondition: params.amount_tokens <= self.data.max_mint"
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
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
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
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "LOOP",
                                          "args": [
                                            [
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "154"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "NIL",
                                                "args": [
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              },
                                              {
                                                "prim": "IF",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "bytes"
                                                        },
                                                        {
                                                          "bytes": "30"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GT"
                                              },
                                              {
                                                "prim": "LOOP",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "map",
                                                          "args": [
                                                            {
                                                              "prim": "nat"
                                                            },
                                                            {
                                                              "prim": "bytes"
                                                            }
                                                          ]
                                                        },
                                                        [
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "0"
                                                              },
                                                              {
                                                                "bytes": "30"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "1"
                                                              },
                                                              {
                                                                "bytes": "31"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "2"
                                                              },
                                                              {
                                                                "bytes": "32"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "3"
                                                              },
                                                              {
                                                                "bytes": "33"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "4"
                                                              },
                                                              {
                                                                "bytes": "34"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "5"
                                                              },
                                                              {
                                                                "bytes": "35"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "6"
                                                              },
                                                              {
                                                                "bytes": "36"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "7"
                                                              },
                                                              {
                                                                "bytes": "37"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "8"
                                                              },
                                                              {
                                                                "bytes": "38"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "9"
                                                              },
                                                              {
                                                                "bytes": "39"
                                                              }
                                                            ]
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "4"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CDR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "GET"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
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
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "24"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CAR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "SWAP"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "0"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "3"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "COMPARE"
                                                    },
                                                    {
                                                      "prim": "GT"
                                                    }
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DROP"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONTRACT",
                                                "args": [
                                                  {
                                                    "prim": "pair",
                                                    "args": [
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "address",
                                                            "annots": [
                                                              "%address"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%amount"
                                                            ]
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%token_id"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "map",
                                                            "args": [
                                                              {
                                                                "prim": "string"
                                                              },
                                                              {
                                                                "prim": "bytes"
                                                              }
                                                            ],
                                                            "annots": [
                                                              "%token_info"
                                                            ]
                                                          }
                                                        ]
                                                      }
                                                    ]
                                                  }
                                                ],
                                                "annots": [
                                                  "%mint"
                                                ]
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "157"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_MAP",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "154"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": ""
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "TRANSFER_TOKENS"
                                              },
                                              {
                                                "prim": "CONS"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
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
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "option",
                                                    "args": [
                                                      {
                                                        "prim": "nat"
                                                      }
                                                    ]
                                                  },
                                                  {
                                                    "prim": "Some",
                                                    "args": [
                                                      {
                                                        "int": "1"
                                                      }
                                                    ]
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "UPDATE",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "9"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "181"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "DUG",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DROP"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DROP"
                                        }
                                      ],
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
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
                                                    "string": "WrongCondition: self.data.active"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
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
                                                    "string": "Not having this artist"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
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
                                                    "string": "Not having this pixel artist"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "IF",
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "279"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "279"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "SUB"
                                              },
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LE"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
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
                                                    "string": "FA2_NOT_ENOUGH_SUPPLY"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LE"
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
                                                    "string": "WrongCondition: params.amount_tokens <= self.data.max_mint"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "MEM"
                                        },
                                        {
                                          "prim": "IF",
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "MEM"
                                              },
                                              {
                                                "prim": "NOT"
                                              }
                                            ],
                                            [
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
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "MEM"
                                              },
                                              {
                                                "prim": "NOT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "MEM"
                                              },
                                              {
                                                "prim": "NOT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "288"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GE"
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: ((((~ (self.data.max_per_address.contains(params.artist))) | (~ (self.data.max_per_address[params.artist]['tier2'].contains(sp.sender)))) | (~ (self.data.max_per_address[params.artist].contains('tier2')))) | (~ (self.data.max_per_address[params.artist]['tier2'].contains(sp.sender)))) | (self.data.max_per_address[params.artist]['tier2'][sp.sender] >= params.amount_tokens)"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "291"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "INT"
                                        },
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "EDIV"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "292"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "EDIV"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "291"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "MUL"
                                              },
                                              {
                                                "prim": "MUL"
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GT"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: ((params.amount_tokens == sp.to_int(sp.fst(sp.ediv(sp.amount, self.data.price).open_some()))) & (sp.amount == sp.mul(sp.fst(sp.ediv(sp.amount, self.data.price).open_some()) * sp.fst(sp.ediv(self.data.price, sp.mutez(1)).open_some()), sp.mutez(1)))) & (sp.amount > sp.tez(0))"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "EMPTY_MAP",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "prim": "big_map",
                                                    "args": [
                                                      {
                                                        "prim": "address"
                                                      },
                                                      {
                                                        "prim": "int"
                                                      }
                                                    ]
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_BIG_MAP",
                                                "args": [
                                                  {
                                                    "prim": "address"
                                                  },
                                                  {
                                                    "prim": "int"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "297"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "tier2"
                                            }
                                          ]
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "298"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_BIG_MAP",
                                                "args": [
                                                  {
                                                    "prim": "address"
                                                  },
                                                  {
                                                    "prim": "int"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "299"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "tier2"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "299"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "300"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "300"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "9"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
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
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "LOOP",
                                          "args": [
                                            [
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "184"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "NIL",
                                                "args": [
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              },
                                              {
                                                "prim": "IF",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "bytes"
                                                        },
                                                        {
                                                          "bytes": "30"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GT"
                                              },
                                              {
                                                "prim": "LOOP",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "map",
                                                          "args": [
                                                            {
                                                              "prim": "nat"
                                                            },
                                                            {
                                                              "prim": "bytes"
                                                            }
                                                          ]
                                                        },
                                                        [
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "0"
                                                              },
                                                              {
                                                                "bytes": "30"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "1"
                                                              },
                                                              {
                                                                "bytes": "31"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "2"
                                                              },
                                                              {
                                                                "bytes": "32"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "3"
                                                              },
                                                              {
                                                                "bytes": "33"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "4"
                                                              },
                                                              {
                                                                "bytes": "34"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "5"
                                                              },
                                                              {
                                                                "bytes": "35"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "6"
                                                              },
                                                              {
                                                                "bytes": "36"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "7"
                                                              },
                                                              {
                                                                "bytes": "37"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "8"
                                                              },
                                                              {
                                                                "bytes": "38"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "9"
                                                              },
                                                              {
                                                                "bytes": "39"
                                                              }
                                                            ]
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "4"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CDR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "GET"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
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
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "24"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CAR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "SWAP"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "0"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "3"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "COMPARE"
                                                    },
                                                    {
                                                      "prim": "GT"
                                                    }
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DROP"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONTRACT",
                                                "args": [
                                                  {
                                                    "prim": "pair",
                                                    "args": [
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "address",
                                                            "annots": [
                                                              "%address"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%amount"
                                                            ]
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%token_id"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "map",
                                                            "args": [
                                                              {
                                                                "prim": "string"
                                                              },
                                                              {
                                                                "prim": "bytes"
                                                              }
                                                            ],
                                                            "annots": [
                                                              "%token_info"
                                                            ]
                                                          }
                                                        ]
                                                      }
                                                    ]
                                                  }
                                                ],
                                                "annots": [
                                                  "%mint"
                                                ]
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "187"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_MAP",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "184"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": ""
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "TRANSFER_TOKENS"
                                              },
                                              {
                                                "prim": "CONS"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
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
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "option",
                                                    "args": [
                                                      {
                                                        "prim": "nat"
                                                      }
                                                    ]
                                                  },
                                                  {
                                                    "prim": "Some",
                                                    "args": [
                                                      {
                                                        "int": "2"
                                                      }
                                                    ]
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "UPDATE",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "9"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "211"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "212"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier2"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "212"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "SENDER"
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "212"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "SUB"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "DUG",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DROP"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "219"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "pixel_artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "217"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "215"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "217"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "216"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "215"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "216"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "SUB_MUTEZ"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "218"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SUB_MUTEZ"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "218"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "184"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "220"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "216"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "215"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "216"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "301"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "221"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "pixel_artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "217"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "215"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "217"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            }
                          ],
                          [
                            {
                              "prim": "IF_LEFT",
                              "args": [
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
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
                                                    "string": "WrongCondition: self.data.active"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
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
                                                    "string": "Not having this artist"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
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
                                                    "string": "Not having this pixel artist"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "IF",
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "305"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "305"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "SUB"
                                              },
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
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LE"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
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
                                                    "string": "FA2_NOT_ENOUGH_SUPPLY"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LE"
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
                                                    "string": "WrongCondition: params.amount_tokens <= self.data.max_mint"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "MEM"
                                        },
                                        {
                                          "prim": "IF",
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "MEM"
                                              },
                                              {
                                                "prim": "NOT"
                                              }
                                            ],
                                            [
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
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
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
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "MEM"
                                              },
                                              {
                                                "prim": "NOT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "314"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GE"
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: (((~ (self.data.max_per_address.contains(params.artist))) | (~ (self.data.max_per_address[params.artist].contains('tier3')))) | (~ (self.data.max_per_address[params.artist]['tier3'].contains(sp.sender)))) | (self.data.max_per_address[params.artist]['tier3'][sp.sender] >= params.amount_tokens)"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "317"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "INT"
                                        },
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "EDIV"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "318"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "EDIV"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "317"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "MUL"
                                              },
                                              {
                                                "prim": "MUL"
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "AMOUNT"
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GT"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "bool"
                                                  },
                                                  {
                                                    "prim": "False"
                                                  }
                                                ]
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: ((params.amount_tokens == sp.to_int(sp.fst(sp.ediv(sp.amount, self.data.price).open_some()))) & (sp.amount == sp.mul(sp.fst(sp.ediv(sp.amount, self.data.price).open_some()) * sp.fst(sp.ediv(self.data.price, sp.mutez(1)).open_some()), sp.mutez(1)))) & (sp.amount > sp.tez(0))"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "EMPTY_MAP",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "prim": "big_map",
                                                    "args": [
                                                      {
                                                        "prim": "address"
                                                      },
                                                      {
                                                        "prim": "int"
                                                      }
                                                    ]
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_BIG_MAP",
                                                "args": [
                                                  {
                                                    "prim": "address"
                                                  },
                                                  {
                                                    "prim": "int"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "323"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "tier3"
                                            }
                                          ]
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "324"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_BIG_MAP",
                                                "args": [
                                                  {
                                                    "prim": "address"
                                                  },
                                                  {
                                                    "prim": "int"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "325"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "tier3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "325"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
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
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "326"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "326"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "9"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "int"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
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
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "LT"
                                        },
                                        {
                                          "prim": "LOOP",
                                          "args": [
                                            [
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "224"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "NIL",
                                                "args": [
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              },
                                              {
                                                "prim": "IF",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "bytes"
                                                        },
                                                        {
                                                          "bytes": "30"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "GT"
                                              },
                                              {
                                                "prim": "LOOP",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "map",
                                                          "args": [
                                                            {
                                                              "prim": "nat"
                                                            },
                                                            {
                                                              "prim": "bytes"
                                                            }
                                                          ]
                                                        },
                                                        [
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "0"
                                                              },
                                                              {
                                                                "bytes": "30"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "1"
                                                              },
                                                              {
                                                                "bytes": "31"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "2"
                                                              },
                                                              {
                                                                "bytes": "32"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "3"
                                                              },
                                                              {
                                                                "bytes": "33"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "4"
                                                              },
                                                              {
                                                                "bytes": "34"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "5"
                                                              },
                                                              {
                                                                "bytes": "35"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "6"
                                                              },
                                                              {
                                                                "bytes": "36"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "7"
                                                              },
                                                              {
                                                                "bytes": "37"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "8"
                                                              },
                                                              {
                                                                "bytes": "38"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "Elt",
                                                            "args": [
                                                              {
                                                                "int": "9"
                                                              },
                                                              {
                                                                "bytes": "39"
                                                              }
                                                            ]
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "4"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CDR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "GET"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "23"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "CONS"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "10"
                                                        }
                                                      ]
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
                                                      "prim": "EDIV"
                                                    },
                                                    {
                                                      "prim": "IF_NONE",
                                                      "args": [
                                                        [
                                                          {
                                                            "prim": "PUSH",
                                                            "args": [
                                                              {
                                                                "prim": "int"
                                                              },
                                                              {
                                                                "int": "24"
                                                              }
                                                            ]
                                                          },
                                                          {
                                                            "prim": "FAILWITH"
                                                          }
                                                        ],
                                                        [
                                                          {
                                                            "prim": "CAR"
                                                          }
                                                        ]
                                                      ]
                                                    },
                                                    {
                                                      "prim": "SWAP"
                                                    },
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "int": "0"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "DUP",
                                                      "args": [
                                                        {
                                                          "int": "3"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "COMPARE"
                                                    },
                                                    {
                                                      "prim": "GT"
                                                    }
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DROP"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONTRACT",
                                                "args": [
                                                  {
                                                    "prim": "pair",
                                                    "args": [
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "address",
                                                            "annots": [
                                                              "%address"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%amount"
                                                            ]
                                                          }
                                                        ]
                                                      },
                                                      {
                                                        "prim": "pair",
                                                        "args": [
                                                          {
                                                            "prim": "nat",
                                                            "annots": [
                                                              "%token_id"
                                                            ]
                                                          },
                                                          {
                                                            "prim": "map",
                                                            "args": [
                                                              {
                                                                "prim": "string"
                                                              },
                                                              {
                                                                "prim": "bytes"
                                                              }
                                                            ],
                                                            "annots": [
                                                              "%token_info"
                                                            ]
                                                          }
                                                        ]
                                                      }
                                                    ]
                                                  }
                                                ],
                                                "annots": [
                                                  "%mint"
                                                ]
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "227"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "mutez"
                                                  },
                                                  {
                                                    "int": "0"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "EMPTY_MAP",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "prim": "bytes"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "224"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CONCAT"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": ""
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "7"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SENDER"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "TRANSFER_TOKENS"
                                              },
                                              {
                                                "prim": "CONS"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
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
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "4"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "option",
                                                    "args": [
                                                      {
                                                        "prim": "nat"
                                                      }
                                                    ]
                                                  },
                                                  {
                                                    "prim": "Some",
                                                    "args": [
                                                      {
                                                        "int": "3"
                                                      }
                                                    ]
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DIG",
                                                "args": [
                                                  {
                                                    "int": "6"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "UPDATE",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "9"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "251"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "nat"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "ADD"
                                              },
                                              {
                                                "prim": "UPDATE",
                                                "args": [
                                                  {
                                                    "int": "5"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "UNPAIR"
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "8"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "GET",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "252"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "tier3"
                                                  }
                                                ]
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "252"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "SENDER"
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
                                                "prim": "GET"
                                              },
                                              {
                                                "prim": "IF_NONE",
                                                "args": [
                                                  [
                                                    {
                                                      "prim": "PUSH",
                                                      "args": [
                                                        {
                                                          "prim": "int"
                                                        },
                                                        {
                                                          "int": "252"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "FAILWITH"
                                                    }
                                                  ],
                                                  [
                                                    
                                                  ]
                                                ]
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "1"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "SUB"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "UPDATE"
                                              },
                                              {
                                                "prim": "SOME"
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
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "SWAP"
                                              },
                                              {
                                                "prim": "PAIR"
                                              },
                                              {
                                                "prim": "DUG",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "CAR"
                                              },
                                              {
                                                "prim": "DUP",
                                                "args": [
                                                  {
                                                    "int": "3"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "LT"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DROP"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "259"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "pixel_artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "257"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "255"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "257"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "256"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "255"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "256"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "SUB_MUTEZ"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "258"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "SUB_MUTEZ"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "258"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "224"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "260"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "256"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "255"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "256"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "327"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "unit"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "261"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "nat"
                                            },
                                            {
                                              "int": "100"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "7"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "pixel_artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "GET"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "257"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "1"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "AMOUNT"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "255"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "EDIV"
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "257"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "CAR"
                                              }
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "MUL"
                                        },
                                        {
                                          "prim": "UNIT"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        }
                                      ],
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
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
                                        }
                                      ]
                                    ]
                                  }
                                ],
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
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
                                                    "string": "Not having this artist"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "NONE",
                                          "args": [
                                            {
                                              "prim": "pair",
                                              "args": [
                                                {
                                                  "prim": "pair",
                                                  "args": [
                                                    {
                                                      "prim": "pair",
                                                      "args": [
                                                        {
                                                          "prim": "address"
                                                        },
                                                        {
                                                          "prim": "nat"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "pair",
                                                      "args": [
                                                        {
                                                          "prim": "bytes"
                                                        },
                                                        {
                                                          "prim": "pair",
                                                          "args": [
                                                            {
                                                              "prim": "nat"
                                                            },
                                                            {
                                                              "prim": "nat"
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                },
                                                {
                                                  "prim": "pair",
                                                  "args": [
                                                    {
                                                      "prim": "pair",
                                                      "args": [
                                                        {
                                                          "prim": "bytes"
                                                        },
                                                        {
                                                          "prim": "nat"
                                                        }
                                                      ]
                                                    },
                                                    {
                                                      "prim": "pair",
                                                      "args": [
                                                        {
                                                          "prim": "nat"
                                                        },
                                                        {
                                                          "prim": "pair",
                                                          "args": [
                                                            {
                                                              "prim": "bytes"
                                                            },
                                                            {
                                                              "prim": "int"
                                                            }
                                                          ]
                                                        }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ]
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        }
                                      ],
                                      [
                                        {
                                          "prim": "DROP"
                                        },
                                        {
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "NOT"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        }
                                      ]
                                    ]
                                  },
                                  {
                                    "prim": "NIL",
                                    "args": [
                                      {
                                        "prim": "operation"
                                      }
                                    ]
                                  }
                                ]
                              ]
                            }
                          ]
                        ]
                      }
                    ],
                    [
                      {
                        "prim": "IF_LEFT",
                        "args": [
                          [
                            {
                              "prim": "IF_LEFT",
                              "args": [
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "FA2_NOT_MANAGER"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        }
                                      ]
                                    ]
                                  }
                                ],
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "SOME"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            },
                            {
                              "prim": "NIL",
                              "args": [
                                {
                                  "prim": "operation"
                                }
                              ]
                            }
                          ],
                          [
                            {
                              "prim": "IF_LEFT",
                              "args": [
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "8"
                                            }
                                          ]
                                        },
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
                                                    "string": "Not having this token id"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "8"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "SOME"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "UPDATE",
                                          "args": [
                                            {
                                              "int": "8"
                                            }
                                          ]
                                        }
                                      ],
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "pixel_artist"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: (params.subject == 'artist') | (params.subject == 'pixel_artist')"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "SOME"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        }
                                      ]
                                    ]
                                  },
                                  {
                                    "prim": "NIL",
                                    "args": [
                                      {
                                        "prim": "operation"
                                      }
                                    ]
                                  }
                                ],
                                [
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "DUP"
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": "artist"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
                                        },
                                        {
                                          "prim": "IF",
                                          "args": [
                                            [
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
                                              }
                                            ],
                                            [
                                              {
                                                "prim": "DUP"
                                              },
                                              {
                                                "prim": "CDR"
                                              },
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "string"
                                                  },
                                                  {
                                                    "string": "pixel_artist"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "COMPARE"
                                              },
                                              {
                                                "prim": "EQ"
                                              }
                                            ]
                                          ]
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
                                                    "string": "WrongCondition: (params.subject == 'artist') | (params.subject == 'pixel_artist')"
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
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "UNPAIR"
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "SOME"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "6"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "SWAP"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "PAIR"
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
                                        }
                                      ],
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
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "SENDER"
                                        },
                                        {
                                          "prim": "COMPARE"
                                        },
                                        {
                                          "prim": "EQ"
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
                                                    "string": "WrongCondition: sp.sender == self.data.manager"
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
                                          "prim": "NIL",
                                          "args": [
                                            {
                                              "prim": "operation"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "3"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "GET",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CONTRACT",
                                          "args": [
                                            {
                                              "prim": "pair",
                                              "args": [
                                                {
                                                  "prim": "nat",
                                                  "annots": [
                                                    "%token_id"
                                                  ]
                                                },
                                                {
                                                  "prim": "map",
                                                  "args": [
                                                    {
                                                      "prim": "string"
                                                    },
                                                    {
                                                      "prim": "bytes"
                                                    }
                                                  ],
                                                  "annots": [
                                                    "%token_info"
                                                  ]
                                                }
                                              ]
                                            }
                                          ],
                                          "annots": [
                                            "%update_token_metadata"
                                          ]
                                        },
                                        {
                                          "prim": "IF_NONE",
                                          "args": [
                                            [
                                              {
                                                "prim": "PUSH",
                                                "args": [
                                                  {
                                                    "prim": "int"
                                                  },
                                                  {
                                                    "int": "138"
                                                  }
                                                ]
                                              },
                                              {
                                                "prim": "FAILWITH"
                                              }
                                            ],
                                            [
                                              
                                            ]
                                          ]
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "mutez"
                                            },
                                            {
                                              "int": "0"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "EMPTY_MAP",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "prim": "bytes"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "DUP",
                                          "args": [
                                            {
                                              "int": "5"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CDR"
                                        },
                                        {
                                          "prim": "SOME"
                                        },
                                        {
                                          "prim": "PUSH",
                                          "args": [
                                            {
                                              "prim": "string"
                                            },
                                            {
                                              "string": ""
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "UPDATE"
                                        },
                                        {
                                          "prim": "DIG",
                                          "args": [
                                            {
                                              "int": "4"
                                            }
                                          ]
                                        },
                                        {
                                          "prim": "CAR"
                                        },
                                        {
                                          "prim": "PAIR"
                                        },
                                        {
                                          "prim": "TRANSFER_TOKENS"
                                        },
                                        {
                                          "prim": "CONS"
                                        }
                                      ]
                                    ]
                                  }
                                ]
                              ]
                            }
                          ]
                        ]
                      }
                    ]
                  ]
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
                  "prim": "SWAP"
                },
                {
                  "prim": "ITER",
                  "args": [
                    [
                      {
                        "prim": "CONS"
                      }
                    ]
                  ]
                },
                {
                  "prim": "PAIR"
                }
              ]
            ]
          }
        ],
        "storage": {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "Pair",
                  "args": [
                    {
                      "prim": "True"
                    },
                    [
                      {
                        "prim": "Elt",
                        "args": [
                          {
                            "string": "Arria"
                          },
                          {
                            "prim": "Pair",
                            "args": [
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "prim": "Pair",
                                    "args": [
                                      {
                                        "string": "tz1NcYGUWUrcriX5nWmHN6daCDKHQdMUSUDp"
                                      },
                                      {
                                        "int": "0"
                                      }
                                    ]
                                  },
                                  {
                                    "bytes": "68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f"
                                  },
                                  {
                                    "int": "1"
                                  },
                                  {
                                    "int": "0"
                                  }
                                ]
                              },
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "bytes": "68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f"
                                  },
                                  {
                                    "int": "50"
                                  }
                                ]
                              },
                              {
                                "int": "8"
                              },
                              {
                                "bytes": "68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f"
                              },
                              {
                                "int": "100"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "Elt",
                        "args": [
                          {
                            "string": "Arria Stark"
                          },
                          {
                            "prim": "Pair",
                            "args": [
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "prim": "Pair",
                                    "args": [
                                      {
                                        "string": "tz1NcYGUWUrcriX5nWmHN6daCDKHQdMUSUDp"
                                      },
                                      {
                                        "int": "1"
                                      }
                                    ]
                                  },
                                  {
                                    "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                                  },
                                  {
                                    "int": "1"
                                  },
                                  {
                                    "int": "0"
                                  }
                                ]
                              },
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                                  },
                                  {
                                    "int": "50"
                                  }
                                ]
                              },
                              {
                                "int": "0"
                              },
                              {
                                "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                              },
                              {
                                "int": "100"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "prim": "Elt",
                        "args": [
                          {
                            "string": "Lojay"
                          },
                          {
                            "prim": "Pair",
                            "args": [
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "prim": "Pair",
                                    "args": [
                                      {
                                        "string": "tz1cVm8jzr5MN6oH21p54HuWCi69qYzjo7MN"
                                      },
                                      {
                                        "int": "1"
                                      }
                                    ]
                                  },
                                  {
                                    "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                                  },
                                  {
                                    "int": "1"
                                  },
                                  {
                                    "int": "5"
                                  }
                                ]
                              },
                              {
                                "prim": "Pair",
                                "args": [
                                  {
                                    "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                                  },
                                  {
                                    "int": "50"
                                  }
                                ]
                              },
                              {
                                "int": "0"
                              },
                              {
                                "bytes": "697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f"
                              },
                              {
                                "int": "100"
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    {
                      "string": "KT18hLaKKTfizp7BEiQLH32uroU68mCcX6Ru"
                    }
                  ]
                },
                {
                  "int": "15"
                },
                {
                  "string": "tz1bnmFGgKfrRfHLNABQpWh14CjsTKmrFNog"
                },
                {
                  "int": "5"
                }
              ]
            },
            {
              "prim": "Pair",
              "args": [
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Arria"
                      },
                      [
                        {
                          "prim": "Elt",
                          "args": [
                            {
                              "string": "tier3"
                            },
                            {
                              "int": "104919"
                            }
                          ]
                        }
                      ]
                    ]
                  },
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Lojay"
                      },
                      [
                        {
                          "prim": "Elt",
                          "args": [
                            {
                              "string": "tier2"
                            },
                            {
                              "int": "104774"
                            }
                          ]
                        }
                      ]
                    ]
                  }
                ],
                {
                  "int": "104761"
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Charlie"
                      },
                      {
                        "string": "tz1bnmFGgKfrRfHLNABQpWh14CjsTKmrFNog"
                      }
                    ]
                  },
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Sutu"
                      },
                      {
                        "string": "tz1hWvP1HXRAmBWQU4ewYUeNNrEdz2sUKDNJ"
                      }
                    ]
                  }
                ]
              ]
            },
            {
              "prim": "Pair",
              "args": [
                {
                  "int": "10000000"
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "artist"
                      },
                      {
                        "int": "40"
                      }
                    ]
                  },
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "pixel_artist"
                      },
                      {
                        "int": "30"
                      }
                    ]
                  }
                ]
              ]
            },
            [
              {
                "prim": "Elt",
                "args": [
                  {
                    "string": "artist"
                  },
                  {
                    "int": "30"
                  }
                ]
              },
              {
                "prim": "Elt",
                "args": [
                  {
                    "string": "pixel_artist"
                  },
                  {
                    "int": "40"
                  }
                ]
              }
            ],
            {
              "int": "104762"
            }
          ]
        }
      }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const storage24 = script24.script.code.find(
    x => x.prim === 'storage'
  )!.args[0] as any;