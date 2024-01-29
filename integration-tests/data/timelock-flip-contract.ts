// https://gitlab.com/tezos/tezos/-/blob/master/src/proto_018_Proxford/lib_protocol/contracts/timelock_flip.tz

export const timelockStorage = {
  "prim": "Pair",
  "args": [
    {
      "int": "0"
    },
    {
      "prim": "Pair",
      "args": [
        {
          "bytes": "e0d984a0e19fd7e7a4ac90dc9bf7e59288e8d8b0a0ca8bf988cae8fa90dbc584c2ee91a1f5d1a1d8d695f58bd1c7b1e4c0b9f384918a89dfd4eff5c3fbaff7e5d68de19088c5fdc08286f18bc7d1c4f99590f3bfd881c68d97bf91d2d4d2ded688d993e59b8aac84b798eed496a1e2dff9cfc1e3c793a8eea1fbf3a8c6c895bb8d8dedded3ed80b4848cb9ddb0c2f1ea98b8a6c3b6c691f2e787afc9bc8dd386a4b08392bbb7c1b6cdbaa6ec98a1fc96ecb287d5f6e39892aea199f4bf91e89bb8e7b58dc4f5d5bfec88ba99d1efc7c98aabe6bebbeeb4b589a383a6f581e69edbe2a4e7db8cb7e4ab8390b6f7c4c6ba9ee7c1f8d7e0f2aba5bf97cdbb85ca8dd0f7dff8fd95a1a9a68dd3b283a5f9fc93a2e7acafc4cbbeb3b2f8fe8faf97c5d2fae681081fe2a28ce94b55c47fe6a2927dc36c403067a86e36a163000000001a7c31a45bcb9934e3089cbc023a0bebe815ee2f646a0d344469f7"
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "01"
            },
            {
              "bytes": "01"
            }
          ]
        }
      ]
    }
  ]
}

export const timelockCode = [
  {
    "prim": "storage",
    "args": [
      {
        "prim": "pair",
        "args": [
          {
            "prim": "nat",
            "annots": [
              "%level"
            ]
          },
          {
            "prim": "chest"
          },
          {
            "prim": "bytes",
            "annots": [
              "%guess"
            ]
          },
          {
            "prim": "bytes",
            "annots": [
              "%result"
            ]
          }
        ]
      }
    ]
  },
  {
    "prim": "parameter",
    "args": [
      {
        "prim": "or",
        "args": [
          {
            "prim": "chest",
            "annots": [
              "%initialize_game"
            ]
          },
          {
            "prim": "or",
            "args": [
              {
                "prim": "bytes",
                "annots": [
                  "%guess"
                ]
              },
              {
                "prim": "chest_key",
                "annots": [
                  "%finish_game"
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
          "prim": "UNPAIR",
          "args": [
            {
              "int": "5"
            }
          ]
        },
        {
          "prim": "IF_LEFT",
          "args": [
            [
              {
                "prim": "DIP",
                "args": [
                  [
                    {
                      "prim": "DROP",
                      "args": [
                        {
                          "int": "4"
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
                    "prim": "bytes"
                  },
                  {
                    "bytes": "A0"
                  }
                ]
              },
              {
                "prim": "DUP"
              },
              {
                "prim": "PAIR"
              },
              {
                "prim": "SWAP"
              },
              {
                "prim": "LEVEL"
              },
              {
                "prim": "PAIR",
                "args": [
                  {
                    "int": "3"
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
                      "prim": "ADD"
                    },
                    {
                      "prim": "LEVEL"
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
                          {
                            "prim": "DIP",
                            "args": [
                              {
                                "int": "2"
                              },
                              [
                                {
                                  "prim": "PUSH",
                                  "args": [
                                    {
                                      "prim": "bytes"
                                    },
                                    {
                                      "bytes": "B0"
                                    }
                                  ]
                                }
                              ]
                            ]
                          },
                          {
                            "prim": "DIP",
                            "args": [
                              [
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
                          },
                          {
                            "prim": "PAIR"
                          },
                          {
                            "prim": "DIP",
                            "args": [
                              [
                                {
                                  "prim": "DROP",
                                  "args": [
                                    {
                                      "int": "2"
                                    }
                                  ]
                                }
                              ]
                            ]
                          }
                        ],
                        [
                          {
                            "prim": "SWAP"
                          },
                          {
                            "prim": "DROP"
                          },
                          {
                            "prim": "PAIR",
                            "args": [
                              {
                                "int": "4"
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  ],
                  [
                    {
                      "prim": "DIP",
                      "args": [
                        {
                          "int": "4"
                        },
                        [
                          {
                            "prim": "DROP"
                          }
                        ]
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
                      "prim": "SWAP"
                    },
                    {
                      "prim": "DIP",
                      "args": [
                        {
                          "int": "2"
                        },
                        [
                          {
                            "prim": "PUSH",
                            "args": [
                              {
                                "prim": "nat"
                              },
                              {
                                "int": "1024"
                              }
                            ]
                          }
                        ]
                      ]
                    },
                    {
                      "prim": "OPEN_CHEST"
                    },
                    [
                      {
                        "prim": "IF_NONE",
                        "args": [
                          [
                            {
                              "prim": "PUSH",
                              "args": [
                                {
                                  "prim": "bytes"
                                },
                                {
                                  "bytes": "10"
                                }
                              ]
                            }
                          ],
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
                                        "bytes": "00"
                                      }
                                    ]
                                  }
                                ],
                                [
                                  {
                                    "prim": "PUSH",
                                    "args": [
                                      {
                                        "prim": "bytes"
                                      },
                                      {
                                        "bytes": "01"
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
                    {
                      "prim": "DIG",
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
                      "prim": "DIG",
                      "args": [
                        {
                          "int": "2"
                        }
                      ]
                    },
                    {
                      "prim": "PAIR"
                    },
                    {
                      "prim": "DIG",
                      "args": [
                        {
                          "int": "1"
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

// parse bytes will be lowercased ref https://github.com/ecadlabs/taquito/pull/1623
export const timelockExpected = [
  {
    "prim": "storage",
    "args": [
      {
        "prim": "pair",
        "args": [
          {
            "prim": "nat",
            "annots": [
              "%level"
            ]
          },
          {
            "prim": "chest"
          },
          {
            "prim": "bytes",
            "annots": [
              "%guess"
            ]
          },
          {
            "prim": "bytes",
            "annots": [
              "%result"
            ]
          }
        ]
      }
    ]
  },
  {
    "prim": "parameter",
    "args": [
      {
        "prim": "or",
        "args": [
          {
            "prim": "chest",
            "annots": [
              "%initialize_game"
            ]
          },
          {
            "prim": "or",
            "args": [
              {
                "prim": "bytes",
                "annots": [
                  "%guess"
                ]
              },
              {
                "prim": "chest_key",
                "annots": [
                  "%finish_game"
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
          "prim": "UNPAIR",
          "args": [
            {
              "int": "5"
            }
          ]
        },
        {
          "prim": "IF_LEFT",
          "args": [
            [
              {
                "prim": "DIP",
                "args": [
                  [
                    {
                      "prim": "DROP",
                      "args": [
                        {
                          "int": "4"
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
                    "prim": "bytes"
                  },
                  {
                    "bytes": "a0"
                  }
                ]
              },
              {
                "prim": "DUP"
              },
              {
                "prim": "PAIR"
              },
              {
                "prim": "SWAP"
              },
              {
                "prim": "LEVEL"
              },
              {
                "prim": "PAIR",
                "args": [
                  {
                    "int": "3"
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
                      "prim": "ADD"
                    },
                    {
                      "prim": "LEVEL"
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
                          {
                            "prim": "DIP",
                            "args": [
                              {
                                "int": "2"
                              },
                              [
                                {
                                  "prim": "PUSH",
                                  "args": [
                                    {
                                      "prim": "bytes"
                                    },
                                    {
                                      "bytes": "b0"
                                    }
                                  ]
                                }
                              ]
                            ]
                          },
                          {
                            "prim": "DIP",
                            "args": [
                              [
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
                          },
                          {
                            "prim": "PAIR"
                          },
                          {
                            "prim": "DIP",
                            "args": [
                              [
                                {
                                  "prim": "DROP",
                                  "args": [
                                    {
                                      "int": "2"
                                    }
                                  ]
                                }
                              ]
                            ]
                          }
                        ],
                        [
                          {
                            "prim": "SWAP"
                          },
                          {
                            "prim": "DROP"
                          },
                          {
                            "prim": "PAIR",
                            "args": [
                              {
                                "int": "4"
                              }
                            ]
                          }
                        ]
                      ]
                    }
                  ],
                  [
                    {
                      "prim": "DIP",
                      "args": [
                        {
                          "int": "4"
                        },
                        [
                          {
                            "prim": "DROP"
                          }
                        ]
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
                      "prim": "SWAP"
                    },
                    {
                      "prim": "DIP",
                      "args": [
                        {
                          "int": "2"
                        },
                        [
                          {
                            "prim": "PUSH",
                            "args": [
                              {
                                "prim": "nat"
                              },
                              {
                                "int": "1024"
                              }
                            ]
                          }
                        ]
                      ]
                    },
                    {
                      "prim": "OPEN_CHEST"
                    },
                    [
                      {
                        "prim": "IF_NONE",
                        "args": [
                          [
                            {
                              "prim": "PUSH",
                              "args": [
                                {
                                  "prim": "bytes"
                                },
                                {
                                  "bytes": "10"
                                }
                              ]
                            }
                          ],
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
                                        "bytes": "00"
                                      }
                                    ]
                                  }
                                ],
                                [
                                  {
                                    "prim": "PUSH",
                                    "args": [
                                      {
                                        "prim": "bytes"
                                      },
                                      {
                                        "bytes": "01"
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
                    {
                      "prim": "DIG",
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
                      "prim": "DIG",
                      "args": [
                        {
                          "int": "2"
                        }
                      ]
                    },
                    {
                      "prim": "PAIR"
                    },
                    {
                      "prim": "DIG",
                      "args": [
                        {
                          "int": "1"
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