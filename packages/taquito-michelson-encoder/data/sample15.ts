export const setChildRecordParam = {
  "prim": "pair",
  "args": [
    {
      "prim": "pair",
      "args": [
        {
          "prim": "pair",
          "args": [
            {
              "prim": "option",
              "args": [
                {
                  "prim": "address"
                }
              ],
              "annots": [
                "%address"
              ]
            },
            {
              "prim": "map",
              "args": [
                {
                  "prim": "string"
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
                              "prim": "or",
                              "args": [
                                {
                                  "prim": "address",
                                  "annots": [
                                    "%address"
                                  ]
                                },
                                {
                                  "prim": "bool",
                                  "annots": [
                                    "%bool"
                                  ]
                                }
                              ]
                            },
                            {
                              "prim": "or",
                              "args": [
                                {
                                  "prim": "bytes",
                                  "annots": [
                                    "%bytes"
                                  ]
                                },
                                {
                                  "prim": "int",
                                  "annots": [
                                    "%int"
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
                                  "prim": "key",
                                  "annots": [
                                    "%key"
                                  ]
                                },
                                {
                                  "prim": "key_hash",
                                  "annots": [
                                    "%key_hash"
                                  ]
                                }
                              ]
                            },
                            {
                              "prim": "or",
                              "args": [
                                {
                                  "prim": "nat",
                                  "annots": [
                                    "%nat"
                                  ]
                                },
                                {
                                  "prim": "signature",
                                  "annots": [
                                    "%signature"
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
                              "prim": "string",
                              "annots": [
                                "%string"
                              ]
                            },
                            {
                              "prim": "mutez",
                              "annots": [
                                "%tez"
                              ]
                            }
                          ]
                        },
                        {
                          "prim": "timestamp",
                          "annots": [
                            "%timestamp"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              "annots": [
                "%data"
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
                "%label"
              ]
            },
            {
              "prim": "address",
              "annots": [
                "%owner"
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
          "prim": "bytes",
          "annots": [
            "%parent"
          ]
        },
        {
          "prim": "option",
          "args": [
            {
              "prim": "nat"
            }
          ],
          "annots": [
            "%ttl"
          ]
        }
      ]
    }
  ],
  "annots": [
    "%set_child_record"
  ]
}

export const updateDetailsParam =  { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "int", "annots": [ "%id" ] },{ "prim": "option","args": [ { "prim": "address" } ],"annots": [ "%new_controller" ] } ] },{ "prim": "option","args": [ { "prim": "bytes" } ],"annots": [ "%new_profile" ] } ],"annots": [ "%update_details" ] }