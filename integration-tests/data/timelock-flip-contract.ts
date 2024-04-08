// https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/contracts/timelock_flip.tz

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
          // stub chest
          "bytes": "caa0f4fdc993f1c39f8e89d6e29df8d09685b6faeccd99ddc99cc9ad9381f3ca86c8a7b98590da80eeefec83f4ebf8e7fcfc92daeee5d5d8cfdedfdbcdd0849a9cf793e8fbc6c389e6f3e783caf7a3b7bea69c81acb9d3afc9b9a186f8f4fda4d0a8a9d0b6dbac88e3f4cef6d0fe81c8afde84bf99d0e48ec589e8f8b587fda9f8ee85ef89a5ddc9eccdf3fc8df8c894c8e7dfceff9bc7a482cb83f78caaa6989d9db1a68ff7b99aa490eca285ff87a1b3ecf8d7b7d0f992f0d4aad2b7e7a3ba9fc794d5d098cfa7b79fdefda19b84e78fd98dec8fb18aaee9cc92b8d49f90e5cab2ab86ad9f9c8ced94d1bdecb38cd5b7e59ca5e9ec9face6fcacc9cab3adad97e0df99d7f8b1b0f9fbeab892c8989091c3b1b7ec98aaa7918acfe081e9d6fd98f3d0c201ae8e0f0470e26cfd98d461a07d506a0ec5f45dcbaed3b43a000000113f7d9ccf48b510e34b2c32532e3874f354"
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "ff"
            },
            {
              "bytes": "ff"
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