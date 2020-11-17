export const tzip7Contract = [ { "prim": "parameter",
    "args":
      [ { "prim": "or",
          "args":
            [ { "prim": "or",
                "args":
                  [ { "prim": "or",
                      "args":
                        [ { "prim": "pair",
                            "args":
                              [ { "prim": "address" }, { "prim": "nat" } ],
                            "annots": [ "%approve" ] },
                          { "prim": "pair",
                            "args":
                              [ { "prim": "pair",
                                  "args":
                                    [ { "prim": "address" },
                                      { "prim": "address" } ] },
                                { "prim": "contract",
                                  "args": [ { "prim": "nat" } ] } ],
                            "annots": [ "%getAllowance" ] } ] },
                    { "prim": "or",
                      "args":
                        [ { "prim": "pair",
                            "args":
                              [ { "prim": "address" },
                                { "prim": "contract",
                                  "args": [ { "prim": "nat" } ] } ],
                            "annots": [ "%getBalance" ] },
                          { "prim": "pair",
                            "args":
                              [ { "prim": "unit" },
                                { "prim": "contract",
                                  "args": [ { "prim": "nat" } ] } ],
                            "annots": [ "%getTotalSupply" ] } ] } ] },
              { "prim": "or",
                "args":
                  [ { "prim": "nat", "annots": [ "%mint" ] },
                    { "prim": "pair",
                      "args":
                        [ { "prim": "pair",
                            "args":
                              [ { "prim": "address" },
                                { "prim": "address" } ] },
                          { "prim": "nat" } ], "annots": [ "%transfer" ] } ] } ] } ] },
  { "prim": "storage",
    "args":
      [ { "prim": "pair",
          "args":
            [ { "prim": "pair",
                "args":
                  [ { "prim": "big_map",
                      "args":
                        [ { "prim": "address" },
                          { "prim": "pair",
                            "args":
                              [ { "prim": "map",
                                  "args":
                                    [ { "prim": "address" },
                                      { "prim": "nat" } ],
                                  "annots": [ "%allowances" ] },
                                { "prim": "nat", "annots": [ "%balance" ] } ] } ],
                      "annots": [ "%ledger" ] },
                    { "prim": "address", "annots": [ "%owner" ] } ] },
              { "prim": "nat", "annots": [ "%totalSupply" ] } ] } ] },
  { "prim": "code",
    "args":
      [ [ { "prim": "DUP" }, { "prim": "CDR" },
          { "prim": "PUSH", "args": [ { "prim": "mutez" }, { "int": "0" } ] },
          { "prim": "AMOUNT" }, { "prim": "COMPARE" }, { "prim": "NEQ" },
          { "prim": "IF",
            "args":
              [ [ { "prim": "DROP", "args": [ { "int": "2" } ] },
                  { "prim": "PUSH",
                    "args":
                      [ { "prim": "string" },
                        { "string": "This contract do not accept token" } ] },
                  { "prim": "FAILWITH" } ],
                [ { "prim": "SWAP" }, { "prim": "CAR" },
                  { "prim": "IF_LEFT",
                    "args":
                      [ [ { "prim": "IF_LEFT",
                            "args":
                              [ [ { "prim": "IF_LEFT",
                                    "args":
                                      [ [ { "prim": "PAIR" },
                                          { "prim": "DUP" },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "SENDER" },
                                          { "prim": "COMPARE" },
                                          { "prim": "EQ" },
                                          { "prim": "IF",
                                            "args":
                                              [ [ { "prim": "DROP",
                                                    "args":
                                                      [ { "int": "3" } ] },
                                                  { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "string" },
                                                        { "string":
                                                            "SameOwnerAndSpender" } ] },
                                                  { "prim": "FAILWITH" } ],
                                                [ { "prim": "DUP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "CAR" },
                                                  { "prim": "SENDER" },
                                                  { "prim": "GET" },
                                                  { "prim": "IF_NONE",
                                                    "args":
                                                      [ [ { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "string" },
                                                                { "string":
                                                                    "NoAccount" } ] },
                                                          { "prim":
                                                              "FAILWITH" } ],
                                                        [] ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "4" } ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "5" } ] },
                                                  { "prim": "GET" },
                                                  { "prim": "IF_NONE",
                                                    "args":
                                                      [ [ { "prim": "DUP" },
                                                          { "prim": "CAR" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "3" } ] },
                                                          { "prim": "SOME" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "4" } ] },
                                                          { "prim": "UPDATE" } ],
                                                        [ { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "nat" },
                                                                { "int": "0" } ] },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "4" } ] },
                                                          { "prim": "DUP" },
                                                          { "prim": "DUG",
                                                            "args":
                                                              [ { "int": "5" } ] },
                                                          { "prim": "COMPARE" },
                                                          { "prim": "GT" },
                                                          { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "nat" },
                                                                { "int": "0" } ] },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "2" } ] },
                                                          { "prim": "COMPARE" },
                                                          { "prim": "GT" },
                                                          { "prim": "AND" },
                                                          { "prim": "IF",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "DROP" },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "DROP" },
                                                                  { "prim":
                                                                    "PUSH",
                                                                    "args":
                                                                    [ { "prim":
                                                                    "string" },
                                                                    { "string":
                                                                    "UnsafeAllowanceChange" } ] },
                                                                  { "prim":
                                                                    "FAILWITH" } ],
                                                                [ { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "3" } ] },
                                                                  { "prim":
                                                                    "SOME" },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "4" } ] },
                                                                  { "prim":
                                                                    "UPDATE" } ] ] } ] ] },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "2" } ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "CAR" },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "3" } ] },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "3" } ] },
                                                  { "prim": "SWAP" },
                                                  { "prim": "CDR" },
                                                  { "prim": "SWAP" },
                                                  { "prim": "PAIR" },
                                                  { "prim": "SOME" },
                                                  { "prim": "SENDER" },
                                                  { "prim": "UPDATE" },
                                                  { "prim": "DIP",
                                                    "args":
                                                      [ [ { "prim": "DUP" },
                                                          { "prim": "CDR" },
                                                          { "prim": "SWAP" },
                                                          { "prim": "CAR" },
                                                          { "prim": "CDR" } ] ] },
                                                  { "prim": "PAIR" },
                                                  { "prim": "PAIR" } ] ] },
                                          { "prim": "NIL",
                                            "args":
                                              [ { "prim": "operation" } ] },
                                          { "prim": "PAIR" } ],
                                        [ { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "PAIR" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "PAIR" },
                                          { "prim": "PAIR" },
                                          { "prim": "DUP" },
                                          { "prim": "CDR" },
                                          { "prim": "CDR" },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "GET" },
                                          { "prim": "IF_NONE",
                                            "args":
                                              [ [ { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "string" },
                                                        { "string":
                                                            "NoAccount" } ] },
                                                  { "prim": "FAILWITH" } ],
                                                [] ] }, { "prim": "CAR" },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "GET" },
                                          { "prim": "IF_NONE",
                                            "args":
                                              [ [ { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "string" },
                                                        { "string":
                                                            "NoAccount" } ] },
                                                  { "prim": "FAILWITH" } ],
                                                [] ] },
                                          { "prim": "NIL",
                                            "args":
                                              [ { "prim": "operation" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "CAR" },
                                          { "prim": "PUSH",
                                            "args":
                                              [ { "prim": "mutez" },
                                                { "int": "0" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "TRANSFER_TOKENS" },
                                          { "prim": "CONS" },
                                          { "prim": "PAIR" } ] ] } ],
                                [ { "prim": "IF_LEFT",
                                    "args":
                                      [ [ { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "PAIR" },
                                          { "prim": "DUP" },
                                          { "prim": "CDR" },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "GET" },
                                          { "prim": "IF_NONE",
                                            "args":
                                              [ [ { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "string" },
                                                        { "string":
                                                            "NoAccount" } ] },
                                                  { "prim": "FAILWITH" } ],
                                                [] ] },
                                          { "prim": "NIL",
                                            "args":
                                              [ { "prim": "operation" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "PUSH",
                                            "args":
                                              [ { "prim": "mutez" },
                                                { "int": "0" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "TRANSFER_TOKENS" },
                                          { "prim": "CONS" },
                                          { "prim": "PAIR" } ],
                                        [ { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "PAIR" },
                                          { "prim": "NIL",
                                            "args":
                                              [ { "prim": "operation" } ] },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "PUSH",
                                            "args":
                                              [ { "prim": "mutez" },
                                                { "int": "0" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "CDR" },
                                          { "prim": "TRANSFER_TOKENS" },
                                          { "prim": "CONS" },
                                          { "prim": "PAIR" } ] ] } ] ] } ],
                        [ { "prim": "IF_LEFT",
                            "args":
                              [ [ { "prim": "SWAP" }, { "prim": "DUP" },
                                  { "prim": "CAR" }, { "prim": "CDR" },
                                  { "prim": "SENDER" },
                                  { "prim": "COMPARE" }, { "prim": "NEQ" },
                                  { "prim": "IF",
                                    "args":
                                      [ [ { "prim": "DROP",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "PUSH",
                                            "args":
                                              [ { "prim": "string" },
                                                { "string":
                                                    "UnauthorizedAccess" } ] },
                                          { "prim": "FAILWITH" } ],
                                        [ { "prim": "DUP" },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "GET" },
                                          { "prim": "IF_NONE",
                                            "args":
                                              [ [ { "prim": "SWAP" },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "2" } ] },
                                                  { "prim": "EMPTY_MAP",
                                                    "args":
                                                      [ { "prim": "address" },
                                                        { "prim": "nat" } ] },
                                                  { "prim": "PAIR" } ],
                                                [ { "prim": "DUP" },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "3" } ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "4" } ] },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "2" } ] },
                                                  { "prim": "CDR" },
                                                  { "prim": "ADD" },
                                                  { "prim": "SWAP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "PAIR" } ] ] },
                                          { "prim": "SWAP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "SOME" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "4" } ] },
                                          { "prim": "CAR" },
                                          { "prim": "CDR" },
                                          { "prim": "UPDATE" },
                                          { "prim": "DIP",
                                            "args":
                                              [ [ { "prim": "DUP" },
                                                  { "prim": "CDR" },
                                                  { "prim": "SWAP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "CDR" } ] ] },
                                          { "prim": "PAIR" },
                                          { "prim": "PAIR" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "CDR" },
                                          { "prim": "ADD" },
                                          { "prim": "SWAP" },
                                          { "prim": "CAR" },
                                          { "prim": "PAIR" } ] ] },
                                  { "prim": "NIL",
                                    "args": [ { "prim": "operation" } ] },
                                  { "prim": "PAIR" } ],
                                [ { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "CDR" }, { "prim": "PAIR" },
                                  { "prim": "SWAP" }, { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "CAR" }, { "prim": "CDR" },
                                  { "prim": "DIG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "CAR" }, { "prim": "CAR" },
                                  { "prim": "PAIR" }, { "prim": "PAIR" },
                                  { "prim": "DUP" }, { "prim": "CAR" },
                                  { "prim": "CAR" }, { "prim": "SWAP" },
                                  { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "CAR" }, { "prim": "CDR" },
                                  { "prim": "DIG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "3" } ] },
                                  { "prim": "CDR" }, { "prim": "CAR" },
                                  { "prim": "DIG",
                                    "args": [ { "int": "3" } ] },
                                  { "prim": "CDR" }, { "prim": "CDR" },
                                  { "prim": "DIG",
                                    "args": [ { "int": "2" } ] },
                                  { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "3" } ] },
                                  { "prim": "DIG",
                                    "args": [ { "int": "4" } ] },
                                  { "prim": "DUP" },
                                  { "prim": "DUG",
                                    "args": [ { "int": "5" } ] },
                                  { "prim": "COMPARE" }, { "prim": "EQ" },
                                  { "prim": "IF",
                                    "args":
                                      [ [ { "prim": "DROP",
                                            "args": [ { "int": "4" } ] },
                                          { "prim": "PUSH",
                                            "args":
                                              [ { "prim": "string" },
                                                { "string":
                                                    "SameOriginAndDestination" } ] },
                                          { "prim": "FAILWITH" } ],
                                        [ { "prim": "DUP" },
                                          { "prim": "DIG",
                                            "args": [ { "int": "2" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "3" } ] },
                                          { "prim": "DIG",
                                            "args": [ { "int": "5" } ] },
                                          { "prim": "DUP" },
                                          { "prim": "DUG",
                                            "args": [ { "int": "6" } ] },
                                          { "prim": "PAIR" },
                                          { "prim": "PAIR" },
                                          { "prim": "DUP" },
                                          { "prim": "CAR" },
                                          { "prim": "CAR" },
                                          { "prim": "DUP" },
                                          { "prim": "SENDER" },
                                          { "prim": "COMPARE" },
                                          { "prim": "NEQ" },
                                          { "prim": "IF",
                                            "args":
                                              [ [ { "prim": "SWAP" },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "2" } ] },
                                                  { "prim": "CDR" },
                                                  { "prim": "CAR" },
                                                  { "prim": "CAR" },
                                                  { "prim": "SWAP" },
                                                  { "prim": "GET" },
                                                  { "prim": "IF_NONE",
                                                    "args":
                                                      [ [ { "prim": "DROP" },
                                                          { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "bool" },
                                                                { "prim":
                                                                    "False" } ] } ],
                                                        [ { "prim": "CAR" },
                                                          { "prim": "SENDER" },
                                                          { "prim": "GET" },
                                                          { "prim": "IF_NONE",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DROP" },
                                                                  { "prim":
                                                                    "PUSH",
                                                                    "args":
                                                                    [ { "prim":
                                                                    "bool" },
                                                                    { "prim":
                                                                    "False" } ] } ],
                                                                [ { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "CDR" },
                                                                  { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "COMPARE" },
                                                                  { "prim":
                                                                    "GE" } ] ] } ] ] } ],
                                                [ { "prim": "DROP",
                                                    "args":
                                                      [ { "int": "2" } ] },
                                                  { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "bool" },
                                                        { "prim": "True" } ] } ] ] },
                                          { "prim": "NOT" },
                                          { "prim": "IF",
                                            "args":
                                              [ [ { "prim": "DROP",
                                                    "args":
                                                      [ { "int": "4" } ] },
                                                  { "prim": "PUSH",
                                                    "args":
                                                      [ { "prim": "string" },
                                                        { "string":
                                                            "NotEnoughAllowance" } ] },
                                                  { "prim": "FAILWITH" } ],
                                                [ { "prim": "DUP" },
                                                  { "prim": "CAR" },
                                                  { "prim": "CAR" },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "4" } ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "5" } ] },
                                                  { "prim": "GET" },
                                                  { "prim": "IF_NONE",
                                                    "args":
                                                      [ [ { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "string" },
                                                                { "string":
                                                                    "NoAccount" } ] },
                                                          { "prim":
                                                              "FAILWITH" } ],
                                                        [] ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "CDR" },
                                                  { "prim": "DIG",
                                                    "args":
                                                      [ { "int": "3" } ] },
                                                  { "prim": "DUP" },
                                                  { "prim": "DUG",
                                                    "args":
                                                      [ { "int": "4" } ] },
                                                  { "prim": "COMPARE" },
                                                  { "prim": "GT" },
                                                  { "prim": "IF",
                                                    "args":
                                                      [ [ { "prim": "DROP",
                                                            "args":
                                                              [ { "int": "5" } ] },
                                                          { "prim": "PUSH",
                                                            "args":
                                                              [ { "prim":
                                                                    "string" },
                                                                { "string":
                                                                    "NotEnoughBalance" } ] },
                                                          { "prim":
                                                              "FAILWITH" } ],
                                                        [ { "prim": "DUP" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "3" } ] },
                                                          { "prim": "DUP" },
                                                          { "prim": "DUG",
                                                            "args":
                                                              [ { "int": "4" } ] },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "2" } ] },
                                                          { "prim": "CDR" },
                                                          { "prim": "SUB" },
                                                          { "prim": "ABS" },
                                                          { "prim": "SWAP" },
                                                          { "prim": "CAR" },
                                                          { "prim": "PAIR" },
                                                          { "prim": "SWAP" },
                                                          { "prim": "DUP" },
                                                          { "prim": "DUG",
                                                            "args":
                                                              [ { "int": "2" } ] },
                                                          { "prim": "CAR" },
                                                          { "prim": "CAR" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "4" } ] },
                                                          { "prim": "DUP" },
                                                          { "prim": "DUG",
                                                            "args":
                                                              [ { "int": "5" } ] },
                                                          { "prim": "GET" },
                                                          { "prim": "IF_NONE",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "DUG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "3" } ] },
                                                                  { "prim":
                                                                    "EMPTY_MAP",
                                                                    "args":
                                                                    [ { "prim":
                                                                    "address" },
                                                                    { "prim":
                                                                    "nat" } ] },
                                                                  { "prim":
                                                                    "PAIR" } ],
                                                                [ { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "4" } ] },
                                                                  { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "DUG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "5" } ] },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "CDR" },
                                                                  { "prim":
                                                                    "ADD" },
                                                                  { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "PAIR" } ] ] },
                                                          { "prim": "SWAP" },
                                                          { "prim": "DUP" },
                                                          { "prim": "DUG",
                                                            "args":
                                                              [ { "int": "2" } ] },
                                                          { "prim": "CAR" },
                                                          { "prim": "SENDER" },
                                                          { "prim": "GET" },
                                                          { "prim": "IF_NONE",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "3" } ] },
                                                                  { "prim":
                                                                    "DROP" },
                                                                  { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "DUG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "CAR" } ],
                                                                [ { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "DUG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "3" } ] },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "5" } ] },
                                                                  { "prim":
                                                                    "DIG",
                                                                    "args":
                                                                    [ { "int":
                                                                    "2" } ] },
                                                                  { "prim":
                                                                    "SUB" },
                                                                  { "prim":
                                                                    "ABS" },
                                                                  { "prim":
                                                                    "SOME" },
                                                                  { "prim":
                                                                    "SENDER" },
                                                                  { "prim":
                                                                    "UPDATE" } ] ] },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "3" } ] },
                                                          { "prim": "DUP" },
                                                          { "prim": "CAR" },
                                                          { "prim": "CAR" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "4" } ] },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "3" } ] },
                                                          { "prim": "SWAP" },
                                                          { "prim": "CDR" },
                                                          { "prim": "SWAP" },
                                                          { "prim": "PAIR" },
                                                          { "prim": "SOME" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "5" } ] },
                                                          { "prim": "UPDATE" },
                                                          { "prim": "DIP",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "CDR" },
                                                                  { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "CDR" } ] ] },
                                                          { "prim": "PAIR" },
                                                          { "prim": "PAIR" },
                                                          { "prim": "DUP" },
                                                          { "prim": "CAR" },
                                                          { "prim": "CAR" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "2" } ] },
                                                          { "prim": "SOME" },
                                                          { "prim": "DIG",
                                                            "args":
                                                              [ { "int": "3" } ] },
                                                          { "prim": "UPDATE" },
                                                          { "prim": "DIP",
                                                            "args":
                                                              [ [ { "prim":
                                                                    "DUP" },
                                                                  { "prim":
                                                                    "CDR" },
                                                                  { "prim":
                                                                    "SWAP" },
                                                                  { "prim":
                                                                    "CAR" },
                                                                  { "prim":
                                                                    "CDR" } ] ] },
                                                          { "prim": "PAIR" },
                                                          { "prim": "PAIR" } ] ] } ] ] } ] ] },
                                  { "prim": "NIL",
                                    "args": [ { "prim": "operation" } ] },
                                  { "prim": "PAIR" } ] ] } ] ] } ] ] } ] ] } ]
