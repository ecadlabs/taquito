export const saplingContractDouble = `storage (pair (sapling_state :left 8) (sapling_state :right 8) );
parameter (pair bool (pair (sapling_transaction :left 8) (sapling_transaction :right 8)) );
code { UNPAIR ;
       UNPAIR ;
       DIP {UNPAIR} ;
       DIIIP {UNPAIR} ;
       DIIP {SWAP} ;
       IF { SAPLING_VERIFY_UPDATE ;
            ASSERT_SOME ;
            UNPAIR ;
            DROP ;
            DIP {DIP {DUP};
                 SAPLING_VERIFY_UPDATE;
                 ASSERT_SOME ;
                 UNPAIR ;
                 DROP ;
                 DROP;};
          }
          { DIP { DUP};
            SAPLING_VERIFY_UPDATE;
            ASSERT_SOME;
            UNPAIR;
            DROP;
            DROP ;
            DIP { SAPLING_VERIFY_UPDATE ;
                  ASSERT_SOME ;
                  UNPAIR;
                  DROP ;
                  }};
       PAIR;
       NIL operation;
       PAIR;
     }`;

export const saplingContractDrop = `storage (unit);
parameter (list (sapling_transaction 8));
code { UNPAIR ;
       SAPLING_EMPTY_STATE 8;
       SWAP ;
       ITER { SAPLING_VERIFY_UPDATE ;
              ASSERT_SOME ;
              UNPAIR ;
              DROP ;
            } ;
       DROP ;
       NIL operation;
       PAIR;
     }`;

export const saplingContractSend = `storage (unit);
     parameter (pair (contract (or (sapling_transaction 8) (sapling_state 8))) (sapling_transaction 8));
     code { UNPAIR ;
            UNPAIR;
            SWAP ;
            SAPLING_EMPTY_STATE 8;
            SWAP ;
            SAPLING_VERIFY_UPDATE ;
            ASSERT_SOME ;
            UNPAIR ;
            DROP ;
            PUSH mutez 0;
            SWAP ;
            RIGHT (sapling_transaction 8);
            TRANSFER_TOKENS;
            NIL operation;
            SWAP;
            CONS;
            PAIR;
          }`;

export const saplingContractStateAsArg = `storage (option (sapling_transaction 8));
parameter (or (sapling_transaction 8) (sapling_state 8));
code { UNPAIR ;
       IF_LEFT
         {
           DIP {DROP;};
           SOME;
         }
         { DIP {ASSERT_SOME;};
           SWAP ;
           SAPLING_VERIFY_UPDATE;
           ASSERT_SOME;
           DROP ;
           NONE (sapling_transaction 8) ;
         };
       NIL operation;
       PAIR;
     }`;

export const saplingContractPushSaplingState = `
# Attempt to use 'PUSH sapling_state 0' where 0 is the ID of a sapling state.
# sapling_state is not allowed in the instruction PUSH.
parameter unit;
storage unit;
code { DROP;
       PUSH (sapling_state 8) 0;
       DROP;
       PUSH unit Unit;
       NIL operation;
       PAIR;
     }`;

export const saplingContractUseExistingState = `parameter (pair (sapling_transaction 8) (sapling_state 8));
storage (sapling_state 8);
code { UNPAIR;
       UNPAIR;
       DIIP { DROP };
       SAPLING_VERIFY_UPDATE;
       ASSERT_SOME;
       UNPAIR;
       DROP;
       NIL operation;
       PAIR;
     }`;
