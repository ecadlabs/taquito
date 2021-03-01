export const ligoSample = [{ "prim": "parameter", "args": [{ "prim": "int" }] },
{ "prim": "storage", "args": [{ "prim": "int" }] },
{
    "prim": "code",
    "args":
        [[[],
        [[[[{ "prim": "DUP" }], { "prim": "CAR" }],
        [[[[{
            "prim": "DIP",
            "args": [[{ "prim": "DUP" }]]
        },
        { "prim": "SWAP" }]],
        { "prim": "CDR" }],
        [{
            "prim": "PUSH",
            "args":
                [{ "prim": "unit" },
                { "prim": "Unit" }]
        },
        [[[[[{
            "prim": "DIP",
            "args":
                [[[{
                    "prim": "DIP",
                    "args":
                        [[{
                            "prim":
                                "DUP"
                        }]]
                },
                { "prim": "SWAP" }]]]
        },
        { "prim": "SWAP" }],
        [{
            "prim": "DIP",
            "args":
                [[[{
                    "prim": "DIP",
                    "args":
                        [[{
                            "prim":
                                "DUP"
                        }]]
                },
                { "prim": "SWAP" }]]]
        },
        { "prim": "SWAP" }]],
        { "prim": "ADD" }],
        {
            "prim": "NIL",
            "args": [{ "prim": "operation" }]
        }],
        { "prim": "PAIR" }]], [],
        {
            "prim": "DIP",
            "args":
                [[[{
                    "prim": "DIP",
                    "args":
                        [[[{
                            "prim": "DIP",
                            "args":
                                [[{
                                    "prim": "DIP",
                                    "args":
                                        [[{
                                            "prim":
                                                "DIP",
                                            "args":
                                                [[[]]]
                                        }]]
                                }]]
                        },
                        { "prim": "DROP" }]]]
                },
                { "prim": "DROP" }]]]
        }], [],
        {
            "prim": "DIP",
            "args":
                [[[{
                    "prim": "DIP",
                    "args":
                        [[{
                            "prim": "DIP",
                            "args": [[[]]]
                        }]]
                },
                { "prim": "DROP" }]]]
        }],
        {
            "prim": "DIP",
            "args":
                [[[{ "prim": "DIP", "args": [[[]]] },
                { "prim": "DROP" }]]]
        }]]]
}]

export const ligoSampleMichelson = `parameter
int ;
storage
int ;
code
{
  {} ;
  {
    {
      {
        {
          DUP
        } ;
        CAR
      } ;
      {
        {
          {
            {
              DIP {
                DUP
              } ;
              SWAP
            }
          } ;
          CDR
        } ;
        {
          PUSH unit Unit ;
          {
            {
              {
                {
                  {
                    DIP {
                      {
                        DIP {
                          DUP
                        } ;
                        SWAP
                      }
                    } ;
                    SWAP
                  } ;
                  {
                    DIP {
                      {
                        DIP {
                          DUP
                        } ;
                        SWAP
                      }
                    } ;
                    SWAP
                  }
                } ;
                ADD
              } ;
              NIL operation
            } ;
            PAIR
          }
        } ;
        {} ;
        DIP {
          {
            DIP {
              {
                DIP {
                  DIP {
                    DIP {
                      {}
                    }
                  }
                } ;
                DROP
              }
            } ;
            DROP
          }
        }
      } ;
      {} ;
      DIP {
        {
          DIP {
            DIP {
              {}
            }
          } ;
          DROP
        }
      }
    } ;
    DIP {
      {
        DIP {
          {}
        } ;
        DROP
      }
    }
  }
}`
