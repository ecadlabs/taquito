export const permit_admin_42_expiry = `{
parameter (or (pair %permit key
                            (pair signature
                                  bytes))
              (or (pair %setExpiry (option bytes)
                                   (pair address
                                         nat))
                  (or (nat %defaultExpiry)
                      (nat %wrapped))));
storage (pair int
              (pair (pair (big_map address
                                   (pair (option int)
                                         (map bytes
                                              (pair timestamp
                                                    (option int)))))
                          (pair nat
                                address))
                    address));
code { DUP;
       CAR;
       IF_LEFT { DUP;
                 CAR;
                 DUP;
                 DIP { SWAP;
                       CDR;
                       DUP;
                       CAR;
                       DIP { CDR;
                             DUP;
                             DIP { DIP { HASH_KEY;
                                         IMPLICIT_ACCOUNT;
                                         ADDRESS };
                                   PAIR;
                                   SWAP };
                             SWAP;
                             CDR;
                             DUP;
                             CDR;
                             CAR;
                             CDR;
                             CAR;
                             DIP { SWAP };
                             PAIR;
                             SELF;
                             ADDRESS;
                             CHAIN_ID;
                             PAIR;
                             PAIR;
                             PACK } };
                 DIP { DIP { DUP } };
                 CHECK_SIGNATURE;
                 IF { DROP }
                    { PUSH string "missigned";
                      PAIR;
                      UNIT;
                      FAILWITH };
                 SWAP;
                 DIP { DUP;
                       CAR;
                       DIP { CDR;
                             DUP;
                             CAR;
                             DIP { CDR };
                             DUP;
                             CAR;
                             DIP { CDR } } };
                 SWAP;
                 DIP { DUP;
                       DIP { CDR;
                             DIP { DUP };
                             GET;
                             IF_NONE { NONE int;
                                       EMPTY_MAP bytes (pair timestamp (option int)) }
                                     { DUP;
                                       CDR;
                                       DIP { CAR } };
                             NONE int;
                             NOW;
                             PAIR;
                             SOME };
                       DUP;
                       CDR;
                       DIP { CAR;
                             UPDATE;
                             SWAP;
                             PAIR;
                             SOME };
                       UPDATE;
                       PAIR;
                       PAIR };
                 PAIR;
                 NIL operation;
                 PAIR }
               { IF_LEFT { DUP;
                           CAR;
                           DIP { DUP;
                                 CDR;
                                 DUP;
                                 DIP { CAR;
                                       DUP;
                                       SENDER;
                                       COMPARE;
                                       EQ;
                                       IF { DROP;
                                            DROP }
                                          { SWAP;
                                            PACK;
                                            BLAKE2B;
                                            PAIR;
                                            SWAP;
                                            DUP;
                                            CAR;
                                            DIP { CDR };
                                            DIP { DUP;
                                                  CAR;
                                                  DIP { CDR;
                                                        DUP;
                                                        CAR;
                                                        DIP { CDR };
                                                        DUP;
                                                        CDR;
                                                        DIP { CAR;
                                                              DUP;
                                                              DIP { DIG 2;
                                                                    DUP;
                                                                    DIP { CDR;
                                                                          GET;
                                                                          IF_NONE { UNIT;
                                                                                    FAILWITH }
                                                                                  {  };
                                                                          DUP;
                                                                          CDR };
                                                                    DUP;
                                                                    DIP { CAR;
                                                                          DUP;
                                                                          DIP { GET;
                                                                                IF_NONE { UNIT;
                                                                                          FAILWITH }
                                                                                        {  };
                                                                                DUP;
                                                                                CDR;
                                                                                IF_NONE { CAR;
                                                                                          SOME }
                                                                                        { SWAP;
                                                                                          CAR;
                                                                                          SWAP;
                                                                                          ADD;
                                                                                          NOW;
                                                                                          COMPARE;
                                                                                          LT;
                                                                                          IF {  }
                                                                                             { UNIT;
                                                                                               FAILWITH };
                                                                                          NONE timestamp };
                                                                                SWAP;
                                                                                DUP;
                                                                                CDR;
                                                                                DIP { CAR };
                                                                                NONE (pair timestamp (option int)) };
                                                                          UPDATE;
                                                                          SWAP;
                                                                          PAIR;
                                                                          SOME };
                                                                    CDR };
                                                              DUG 2;
                                                              UPDATE };
                                                        SWAP;
                                                        PAIR;
                                                        SWAP };
                                                  DUP;
                                                  DIP { SWAP;
                                                        IF_NONE { DROP }
                                                                { SWAP;
                                                                  ADD;
                                                                  NOW;
                                                                  COMPARE;
                                                                  LT;
                                                                  IF {  }
                                                                     { UNIT;
                                                                       FAILWITH } };
                                                        PAIR };
                                                  PAIR };
                                            PAIR };
                                       CDR } };
                           IF_NONE { DIP { DUP;
                                           DIP { CAR };
                                           CDR;
                                           DUP;
                                           CAR;
                                           DIP { CDR };
                                           DUP;
                                           CAR;
                                           DIP { CDR } };
                                     DUP;
                                     DIP { CDR;
                                           SWAP;
                                           DUP };
                                     CAR;
                                     DUP;
                                     DIP { GET;
                                           IF_NONE { SWAP;
                                                     INT;
                                                     DUP;
                                                     EQ;
                                                     IF { DROP;
                                                          EMPTY_MAP bytes (pair timestamp (option int));
                                                          NONE int;
                                                          PAIR }
                                                        { SOME;
                                                          EMPTY_MAP bytes (pair timestamp (option int));
                                                          SWAP;
                                                          PAIR } }
                                                   { DIG 2;
                                                     INT;
                                                     DUP;
                                                     EQ;
                                                     IF { DROP;
                                                          CDR;
                                                          NONE int }
                                                        { SOME;
                                                          DIP { CDR } };
                                                     PAIR };
                                           SOME };
                                     UPDATE;
                                     PAIR;
                                     DIG 2;
                                     DIP { PAIR };
                                     PAIR }
                                   { DIP { DIP { DUP;
                                                 DIP { CAR };
                                                 CDR;
                                                 DUP;
                                                 CAR;
                                                 DIP { CDR };
                                                 DUP;
                                                 CAR;
                                                 DIP { CDR };
                                                 DUP };
                                           DUP;
                                           CDR;
                                           DIP { CAR;
                                                 DUP;
                                                 DIP { GET;
                                                       IF_NONE { UNIT;
                                                                 FAILWITH }
                                                               {  } };
                                                 SWAP } };
                                     DIG 2;
                                     DUP;
                                     CAR;
                                     DIP { CDR;
                                           DUP;
                                           DIP { SWAP;
                                                 DUP;
                                                 DIP { GET;
                                                       IF_NONE { UNIT;
                                                                 FAILWITH }
                                                               {  };
                                                       CAR;
                                                       SWAP;
                                                       INT;
                                                       DUP;
                                                       EQ;
                                                       IF { DROP;
                                                            NONE int }
                                                          { SOME };
                                                       SWAP;
                                                       PAIR;
                                                       SOME } };
                                           DUG 2;
                                           UPDATE };
                                     PAIR;
                                     SOME;
                                     SWAP;
                                     UPDATE;
                                     PAIR;
                                     DIG 2;
                                     DIP { PAIR };
                                     PAIR };
                           NIL operation;
                           PAIR }
                         { IF_LEFT { DIP { CDR };
                                     SWAP;
                                     DUP;
                                     CDR;
                                     CDR;
                                     SENDER;
                                     COMPARE;
                                     EQ;
                                     IF {  }
                                        { UNIT; 
                                          FAILWITH };
                                     SWAP;
                                     INT;
                                     DIP { CDR };
                                     PAIR;
                                     NIL operation;
                                     PAIR }
                                   { PUSH nat 42;
                                     COMPARE;
                                     EQ;
                                     IF {  }
                                        { UNIT;
                                          FAILWITH };
                                     DUP;
                                     DIP { CAR };
                                     CDR;
                                     DUP;
                                     CDR;
                                     CDR;
                                     DUP;
                                     SENDER;
                                     COMPARE;
                                     EQ;
                                     IF { DROP;
                                          SWAP;
                                          DROP }
                                        { DIG 2;
                                          PACK;
                                          BLAKE2B;
                                          PAIR;
                                          SWAP;
                                          DUP;
                                          CAR;
                                          DIP { CDR;
                                                DUP;
                                                CAR;
                                                DIP { CDR };
                                                DUP;
                                                CDR;
                                                DIP { CAR;
                                                      DUP;
                                                      DIP { DIG 2;
                                                            DUP;
                                                            DIP { CDR;
                                                                  GET;
                                                                  IF_NONE { UNIT;
                                                                            FAILWITH }
                                                                          {  };
                                                                  DUP;
                                                                  CDR };
                                                            DUP;
                                                            DIP { CAR;
                                                                  DUP;
                                                                  DIP { GET;
                                                                        IF_NONE { UNIT;
                                                                                  FAILWITH }
                                                                                {  };
                                                                        DUP;
                                                                        CDR;
                                                                        IF_NONE { CAR;
                                                                                  SOME }
                                                                                { SWAP;
                                                                                  CAR;
                                                                                  SWAP;
                                                                                  ADD;
                                                                                  NOW;
                                                                                  COMPARE;
                                                                                  LT;
                                                                                  IF {  }
                                                                                     { UNIT;
                                                                                       FAILWITH };
                                                                                  NONE timestamp };
                                                                        SWAP;
                                                                        DUP;
                                                                        CDR;
                                                                        DIP { CAR };
                                                                        NONE (pair timestamp (option int)) };
                                                                  UPDATE;
                                                                  SWAP;
                                                                  PAIR;
                                                                  SOME };
                                                            CDR };
                                                      DUG 2;
                                                      UPDATE };
                                                SWAP;
                                                PAIR;
                                                SWAP };
                                          DUP;
                                          DIP { SWAP;
                                                IF_NONE { DROP }
                                                        { SWAP;
                                                          ADD;
                                                          NOW;
                                                          COMPARE;
                                                          LT;
                                                          IF {  }
                                                             { UNIT;
                                                               FAILWITH } };
                                                PAIR };
                                          PAIR };
                                     NIL operation;
                                     PAIR } } } };}`