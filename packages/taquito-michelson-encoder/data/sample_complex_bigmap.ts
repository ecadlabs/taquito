export const storage = {
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
                    "%administrator"
                  ]
                },
                {
                  "prim": "big_map",
                  "annots": [
                    "%balances"
                  ],
                  "args": [
                    {
                      "prim": "address"
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "map",
                          "annots": [
                            "%approvals"
                          ],
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
                          "prim": "nat",
                          "annots": [
                            "%balance"
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
                  "prim": "nat",
                  "annots": [
                    "%counter"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%default_expiry"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%max_expiry"
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
                  "prim": "big_map",
                  "annots": [
                    "%metadata"
                  ],
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
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "bool",
                      "annots": [
                        "%paused"
                      ]
                    },
                    {
                      "prim": "big_map",
                      "annots": [
                        "%permit_expiries"
                      ],
                      "args": [
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "address"
                            },
                            {
                              "prim": "bytes"
                            }
                          ]
                        },
                        {
                          "prim": "option",
                          "args": [
                            {
                              "prim": "nat"
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
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "annots": [
                    "%permits"
                  ],
                  "args": [
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "address"
                        },
                        {
                          "prim": "bytes"
                        }
                      ]
                    },
                    {
                      "prim": "timestamp"
                    }
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%totalSupply"
                      ]
                    },
                    {
                      "prim": "big_map",
                      "annots": [
                        "%user_expiries"
                      ],
                      "args": [
                        {
                          "prim": "address"
                        },
                        {
                          "prim": "option",
                          "args": [
                            {
                              "prim": "nat"
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
        }
      ]
    };

export const complex_storage = {
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
                    "%administrator"
                  ]
                },
                {
                  "prim": "big_map",
                  "annots": [
                    "%balances"
                  ],
                  "args": [
                    {
                      "prim": "address"
                    },
                    {
                      "prim": "pair",
                      "args": [
                        {
                          "prim": "map",
                          "annots": [
                            "%approvals"
                          ],
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
                          "prim": "nat",
                          "annots": [
                            "%balance"
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
                  "prim": "nat",
                  "annots": [
                    "%counter"
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%default_expiry"
                      ]
                    },
                    {
                      "prim": "nat",
                      "annots": [
                        "%max_expiry"
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
                  "prim": "big_map",
                  "annots": [
                    "%metadata"
                  ],
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
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "bool",
                      "annots": [
                        "%paused"
                      ]
                    },
                    {
                      "prim": "big_map",
                      "annots": [
                        "%permit_expiries"
                      ],
                      "args": [
                        {
                          "prim": "big_map",
                          "args": [
                            {
                              "prim": "pair",
                              "args": [
                                {
                                  "prim": "address"
                                },
                                {
                                  "prim": "bytes"
                                }
                              ]
                            },
                            {
                              "prim": "bytes"
                            }
                          ]
                        },
                        {
                          "prim": "option",
                          "args": [
                            {
                              "prim": "nat"
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
              "prim": "pair",
              "args": [
                {
                  "prim": "big_map",
                  "annots": [
                    "%permits"
                  ],
                  "args": [
                    {
                      "prim": "big_map",
                      "args": [
                        {
                          "prim": "address"
                        },
                        {
                          "prim": "pair",
                          "args": [
                            {
                              "prim": "address"
                            },
                            {
                              "prim": "bytes"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "prim": "timestamp"
                    }
                  ]
                },
                {
                  "prim": "pair",
                  "args": [
                    {
                      "prim": "nat",
                      "annots": [
                        "%totalSupply"
                      ]
                    },
                    {
                      "prim": "big_map",
                      "annots": [
                        "%user_expiries"
                      ],
                      "args": [
                        {
                          "prim": "address"
                        },
                        {
                          "prim": "option",
                          "args": [
                            {
                              "prim": "nat"
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
        }
      ]
    };