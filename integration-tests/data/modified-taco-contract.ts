export const tacoContractTzip16 = [ { "prim": "parameter", "args": [ { "prim": "nat" } ] },
{ "prim": "storage",
  "args":
    [ { "prim": "pair",
        "args":
          [ { "prim": "big_map",
              "args": [ { "prim": "string" }, { "prim": "bytes" } ],
              "annots": [ "%metadata" ] },
            { "prim": "map",
              "args":
                [ { "prim": "nat" },
                  { "prim": "pair",
                    "args":
                      [ { "prim": "nat", "annots": [ "%current_stock" ] },
                        { "prim": "mutez", "annots": [ "%max_price" ] } ] } ],
              "annots": [ "%taco_shop_storage" ] } ] } ] },
{ "prim": "code",
  "args":
    [ [ { "prim": "DUP" }, { "prim": "CAR" }, { "prim": "SWAP" },
        { "prim": "CDR" }, { "prim": "DUP" }, { "prim": "CDR" },
        { "prim": "DIG", "args": [ { "int": "2" } ] }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "3" } ] }, { "prim": "GET" },
        { "prim": "IF_NONE",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" },
                      { "string": "Unknown kind of taco." } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "DUP" },
        { "prim": "CAR" }, { "prim": "SWAP" }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "CDR" },
        { "prim": "EDIV" },
        { "prim": "IF_NONE",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" }, { "string": "DIV by 0" } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "CAR" },
        { "prim": "AMOUNT" }, { "prim": "COMPARE" }, { "prim": "NEQ" },
        { "prim": "IF",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" },
                      { "string":
                          "Sorry, the taco you are trying to purchase has a different price" } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "DUP" },
        { "prim": "PUSH", "args": [ { "prim": "nat" }, { "int": "1" } ] },
        { "prim": "DIG", "args": [ { "int": "2" } ] }, { "prim": "CAR" },
        { "prim": "SUB" }, { "prim": "ABS" }, { "prim": "SWAP" },
        { "prim": "CDR" }, { "prim": "SWAP" }, { "prim": "PAIR" },
        { "prim": "SWAP" }, { "prim": "DUP" }, { "prim": "CDR" },
        { "prim": "DIG", "args": [ { "int": "2" } ] },
        { "prim": "DIG", "args": [ { "int": "3" } ] }, { "prim": "SWAP" },
        { "prim": "SOME" }, { "prim": "SWAP" }, { "prim": "UPDATE" },
        { "prim": "SWAP" }, { "prim": "CAR" }, { "prim": "PAIR" },
        { "prim": "NIL", "args": [ { "prim": "operation" } ] },
        { "prim": "PAIR" } ] ] } ]

export const tacoContractTzip12 = [ { "prim": "parameter", "args": [ { "prim": "nat" } ] },
{ "prim": "storage",
  "args":
    [ { "prim": "pair",
        "args":
          [ { "prim": "map",
              "args":
                [ { "prim": "nat" },
                  { "prim": "pair",
                    "args":
                      [ { "prim": "nat", "annots": [ "%current_stock" ] },
                        { "prim": "mutez", "annots": [ "%max_price" ] } ] } ],
              "annots": [ "%taco_shop_storage" ] },
            { "prim": "big_map",
              "args":
                [ { "prim": "nat" },
                  { "prim": "pair",
                    "args":
                      [ { "prim": "nat" },
                        { "prim": "map",
                          "args":
                            [ { "prim": "string" }, { "prim": "bytes" } ] } ] } ],
              "annots": [ "%token_metadata" ] } ] } ] },
{ "prim": "code",
  "args":
    [ [ { "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" },
        { "prim": "CAR" }, { "prim": "SWAP" }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "CAR" },
        { "prim": "SWAP" }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "GET" },
        { "prim": "IF_NONE",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" },
                      { "string": "Unknown kind of taco." } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "DUP" },
        { "prim": "CAR" }, { "prim": "SWAP" }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "CDR" },
        { "prim": "EDIV" },
        { "prim": "IF_NONE",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" }, { "string": "DIV by 0" } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "CAR" },
        { "prim": "AMOUNT" }, { "prim": "COMPARE" }, { "prim": "NEQ" },
        { "prim": "IF",
          "args":
            [ [ { "prim": "PUSH",
                  "args":
                    [ { "prim": "string" },
                      { "string":
                          "Sorry, the taco you are trying to purchase has a different price" } ] },
                { "prim": "FAILWITH" } ], [] ] }, { "prim": "DUP" },
        { "prim": "CDR" },
        { "prim": "PUSH", "args": [ { "prim": "nat" }, { "int": "1" } ] },
        { "prim": "DIG", "args": [ { "int": "2" } ] }, { "prim": "CAR" },
        { "prim": "SUB" }, { "prim": "ABS" }, { "prim": "PAIR" },
        { "prim": "DIG", "args": [ { "int": "2" } ] }, { "prim": "DUP" },
        { "prim": "DUG", "args": [ { "int": "3" } ] }, { "prim": "CDR" },
        { "prim": "DIG", "args": [ { "int": "3" } ] }, { "prim": "CAR" },
        { "prim": "DIG", "args": [ { "int": "2" } ] },
        { "prim": "DIG", "args": [ { "int": "3" } ] }, { "prim": "SWAP" },
        { "prim": "SOME" }, { "prim": "SWAP" }, { "prim": "UPDATE" },
        { "prim": "PAIR" },
        { "prim": "NIL", "args": [ { "prim": "operation" } ] },
        { "prim": "PAIR" } ] ] } ]
