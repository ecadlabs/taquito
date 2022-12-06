export const recFactApplyStore = `{ storage (or int (lambda int int));
    parameter (or (unit %gen) (int %exec));
    code { UNPAIR;
           IF_LEFT{ DROP 2;
                    LAMBDA_REC (pair unit int) int
                               { UNPAIR;
                                 DUP 2;
                                 EQ;
                                 IF { PUSH int 1 }
                                    { DUP 2;
                                      DUP 4;
                                      DUP 3;
                                      APPLY;
                                      PUSH int 1;
                                      DUP 3;
                                      SUB;
                                      EXEC;
                                      MUL};
                                 DIP { DROP 3 }};
                    UNIT;
                    APPLY;
                    RIGHT int}
                  { DIP { ASSERT_RIGHT };
                    EXEC;
                    LEFT (lambda int int)};
           NIL operation;
           PAIR}}`

export const reduceMap = `parameter (pair (lambda int int) (list int));
storage (list int);
code { DIP{NIL int};
       CAR;
       DUP;
       DIP{CAR; PAIR};          # Unpack data and setup accumulator
       CDR;
       ITER {PAIR;
             DUP; CDAR;
             DIP{ DUP; DIP{CDAR}; DUP;
                  CAR; DIP{CDDR; SWAP}; EXEC; CONS};
             PAIR};
       CDR; DIP{NIL int}; # First reduce
       ITER {CONS}; # Reverse
       NIL operation; PAIR}     # Calling convention`

export const recursiveLambda = [
    [
        {
            "prim": "DUP"
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
                                "prim": "int"
                            },
                            {
                                "int": "1"
                            }
                        ]
                    }
                ],
                [
                    {
                        "prim": "DUP"
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
                        "prim": "DUP",
                        "args": [
                            {
                                "int": "4"
                            }
                        ]
                    },
                    {
                        "prim": "SUB"
                    },
                    {
                        "prim": "EXEC"
                    },
                    {
                        "prim": "MUL"
                    }
                ]
            ]
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
    ]
];