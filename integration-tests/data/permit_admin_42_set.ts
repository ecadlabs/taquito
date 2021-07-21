export const permit_admin_42_set = `{
    parameter (or (pair %permit key
                                (pair signature
                                      bytes))
                  (nat %wrapped));
    storage (pair (big_map address
                           (set bytes))
                  (pair nat
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
                          FAILWITH };
                     SWAP;
                     DUP;
                     CAR;
                     DIP { DIP { DUP;
                                 CDR;
                                 DUP;
                                 CAR;
                                 PUSH nat 1;
                                 ADD;
                                 DIP { CDR };
                                 PAIR;
                                 SWAP;
                                 CAR;
                                 DUP };
                           CDR;
                           DUP;
                           DIP { SWAP };
                           GET;
                           IF_NONE { EMPTY_SET bytes }
                                   {  };
                           PUSH bool True };
                     UPDATE;
                     SOME;
                     SWAP;
                     UPDATE;
                     PAIR;
                     NIL operation;
                     PAIR }
                   { DUP;
                     PUSH nat 42;
                     COMPARE;
                     EQ;
                     IF {  }
                        { PUSH string "not 42";
                          FAILWITH };
                     PACK;
                     BLAKE2B;
                     DIP { CDR;
                           DUP;
                           CAR;
                           DIP { CDR;
                                 DUP;
                                 CDR } };
                     SWAP;
                     DIP { PAIR };
                     SWAP;
                     PAIR;
                     DUP;
                     DUP;
                     CAR;
                     DIP { CDR };
                     DUP;
                     CDR;
                     DIP { SWAP };
                     GET;
                     IF_NONE { FAILWITH }
                             { SWAP;
                               DIP { DUP };
                               CAR;
                               MEM;
                               IF { DIP { DUP;
                                          CAR;
                                          DIP { CDR };
                                          DUP;
                                          CAR };
                                    SWAP;
                                    DIP { PUSH bool False };
                                    UPDATE;
                                    SOME;
                                    SWAP;
                                    CDR;
                                    UPDATE }
                                  { FAILWITH } };
                     PAIR;
                     NIL operation;
                     PAIR } };}`