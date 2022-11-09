export const nftContract = `{ parameter
    (or (or (or (pair %balance_of
                   (list %requests (pair (address %owner) (nat %token_id)))
                   (contract %callback
                      (list (pair (pair %request (address %owner) (nat %token_id)) (nat %balance)))))
                (list %mint (pair (nat %token_id) (bytes %ipfs_hash) (address %owner))))
            (or (unit %pause)
                (list %transfer
                   (pair (address %from_) (list %txs (pair (address %to_) (nat %token_id) (nat %amount)))))))
        (or (or (address %update_admin) (bytes %update_metadata))
            (or (list %update_operators
                   (or (pair %add_operator (address %owner) (address %operator) (nat %token_id))
                       (pair %remove_operator (address %owner) (address %operator) (nat %token_id))))
                (pair %update_token_metadata nat bytes)))) ;
  storage
    (pair (pair (pair (address %admin) (big_map %ledger (pair address nat) nat))
                (big_map %metadata string bytes)
                (big_map %operators (pair (address %owner) (address %operator) (nat %token_id)) unit))
          (pair (bool %paused)
                (big_map %token_metadata nat (pair (nat %token_id) (map %token_info string bytes))))
          (nat %total_supply)) ;
  code { UNPAIR ;
         PUSH mutez 0 ;
         AMOUNT ;
         COMPARE ;
         NEQ ;
         IF { DROP 2 ; PUSH string "NO_XTZ_AMOUNT" ; FAILWITH }
            { IF_LEFT
                { IF_LEFT
                    { IF_LEFT
                        { DUP ;
                          CAR ;
                          MAP { DUP 3 ;
                                CDR ;
                                CAR ;
                                CDR ;
                                DUP 2 ;
                                CDR ;
                                MEM ;
                                NOT ;
                                IF { DROP ; PUSH string "FA2_TOKEN_UNDEFINED" ; FAILWITH }
                                   { DUP 3 ;
                                     CAR ;
                                     CAR ;
                                     CDR ;
                                     DUP 2 ;
                                     CDR ;
                                     DUP 3 ;
                                     CAR ;
                                     PAIR ;
                                     GET ;
                                     IF_NONE { PUSH nat 0 } {} ;
                                     SWAP ;
                                     PAIR } } ;
                          DIG 2 ;
                          NIL operation ;
                          DIG 3 ;
                          CDR ;
                          PUSH mutez 0 ;
                          DIG 4 ;
                          TRANSFER_TOKENS ;
                          CONS ;
                          PAIR }
                        { DUP 2 ;
                          CDR ;
                          CAR ;
                          CAR ;
                          IF { DROP 2 ; PUSH string "CONTRACT_IS_PAUSED" ; FAILWITH }
                             { PUSH nat 0 ;
                               DUP 2 ;
                               SIZE ;
                               COMPARE ;
                               EQ ;
                               IF { DROP 2 ; PUSH string "EMPTY_LIST" ; FAILWITH }
                                  { DUP 2 ;
                                    SWAP ;
                                    ITER { UNPAIR 3 ;
                                           DUP 4 ;
                                           CDR ;
                                           CAR ;
                                           CDR ;
                                           DUP 2 ;
                                           MEM ;
                                           IF { DROP 4 ; PUSH string "TOKEN_ID_ALREADY_EXISTS" ; FAILWITH }
                                              { DUP 5 ;
                                                CDR ;
                                                DUP 6 ;
                                                CAR ;
                                                CDR ;
                                                DUP 6 ;
                                                CAR ;
                                                CAR ;
                                                CDR ;
                                                PUSH nat 1 ;
                                                DUP 5 ;
                                                DIG 7 ;
                                                PAIR ;
                                                SWAP ;
                                                SOME ;
                                                SWAP ;
                                                UPDATE ;
                                                DUP 7 ;
                                                CAR ;
                                                CAR ;
                                                CAR ;
                                                PAIR ;
                                                PAIR ;
                                                PAIR ;
                                                DUP ;
                                                CDR ;
                                                CDR ;
                                                DUP 5 ;
                                                CDR ;
                                                CAR ;
                                                CDR ;
                                                EMPTY_MAP string bytes ;
                                                DIG 5 ;
                                                SOME ;
                                                PUSH string "" ;
                                                UPDATE ;
                                                DUP 5 ;
                                                PAIR ;
                                                DIG 4 ;
                                                SWAP ;
                                                SOME ;
                                                SWAP ;
                                                UPDATE ;
                                                DUP 3 ;
                                                CDR ;
                                                CAR ;
                                                CAR ;
                                                PAIR ;
                                                PAIR ;
                                                SWAP ;
                                                CAR ;
                                                PAIR ;
                                                PUSH nat 1 ;
                                                DIG 2 ;
                                                CDR ;
                                                CDR ;
                                                ADD ;
                                                DUP 2 ;
                                                CDR ;
                                                CAR ;
                                                PAIR ;
                                                SWAP ;
                                                CAR ;
                                                PAIR } } ;
                                    SWAP ;
                                    DROP } ;
                               NIL operation ;
                               PAIR } } }
                    { IF_LEFT
                        { DROP ;
                          DUP ;
                          CAR ;
                          CAR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          NEQ ;
                          IF { DROP ; PUSH string "NOT_AN_ADMIN" ; FAILWITH }
                             { DUP ;
                               CDR ;
                               CDR ;
                               DUP 2 ;
                               CDR ;
                               CAR ;
                               CDR ;
                               DUP 3 ;
                               CDR ;
                               CAR ;
                               CAR ;
                               NOT ;
                               PAIR ;
                               PAIR ;
                               SWAP ;
                               CAR ;
                               PAIR } ;
                          NIL operation ;
                          PAIR }
                        { DUP 2 ;
                          CDR ;
                          CAR ;
                          CAR ;
                          IF { DROP 2 ; PUSH string "CONTRACT_IS_PAUSED" ; FAILWITH }
                             { ITER { UNPAIR ;
                                      DIG 2 ;
                                      SWAP ;
                                      PAIR ;
                                      SWAP ;
                                      ITER { SWAP ;
                                             UNPAIR ;
                                             DIG 2 ;
                                             UNPAIR 3 ;
                                             DUP 5 ;
                                             CDR ;
                                             CAR ;
                                             CDR ;
                                             DUP 3 ;
                                             MEM ;
                                             NOT ;
                                             IF { DROP 5 ; PUSH string "FA2_TOKEN_UNDEFINED" ; FAILWITH }
                                                { DUP 5 ;
                                                  CAR ;
                                                  CAR ;
                                                  CDR ;
                                                  DUP 3 ;
                                                  DUP 6 ;
                                                  PAIR ;
                                                  GET ;
                                                  IF_NONE
                                                    { PUSH string "FA2_NOT_OWNER" ; FAILWITH }
                                                    { PUSH nat 0 ;
                                                      DUP 5 ;
                                                      COMPARE ;
                                                      GT ;
                                                      PUSH nat 0 ;
                                                      DUP 3 ;
                                                      COMPARE ;
                                                      EQ ;
                                                      AND ;
                                                      IF { DROP ; PUSH string "FA2_INSUFFICIENT_BALANCE" ; FAILWITH }
                                                         { DUP ;
                                                           DUP 5 ;
                                                           COMPARE ;
                                                           GT ;
                                                           IF { DROP ; PUSH string "FA2_INSUFFICIENT_BALANCE" ; FAILWITH } {} } } ;
                                                  DUP 3 ;
                                                  SENDER ;
                                                  DUP 7 ;
                                                  PAIR 3 ;
                                                  DUP 7 ;
                                                  CAR ;
                                                  CDR ;
                                                  CDR ;
                                                  SWAP ;
                                                  MEM ;
                                                  NOT ;
                                                  DUP 6 ;
                                                  SENDER ;
                                                  COMPARE ;
                                                  NEQ ;
                                                  AND ;
                                                  IF { DROP 6 ; PUSH string "FA2_NOT_OPERATOR" ; FAILWITH }
                                                     { PUSH int 0 ;
                                                       DUP 5 ;
                                                       DUP 3 ;
                                                       SUB ;
                                                       COMPARE ;
                                                       EQ ;
                                                       IF { DROP ;
                                                            DUP 5 ;
                                                            CAR ;
                                                            CAR ;
                                                            CDR ;
                                                            DUP 3 ;
                                                            DUP 6 ;
                                                            PAIR ;
                                                            NONE nat ;
                                                            SWAP ;
                                                            UPDATE }
                                                          { DUP 6 ;
                                                            CAR ;
                                                            CAR ;
                                                            CDR ;
                                                            DUP 5 ;
                                                            DIG 2 ;
                                                            SUB ;
                                                            ABS ;
                                                            SOME ;
                                                            DUP 4 ;
                                                            DUP 7 ;
                                                            PAIR ;
                                                            UPDATE } ;
                                                       DUP ;
                                                       DUP 4 ;
                                                       DUP 4 ;
                                                       PAIR ;
                                                       GET ;
                                                       IF_NONE
                                                         { DUG 3 ; PAIR ; SWAP ; SOME ; SWAP ; UPDATE }
                                                         { SWAP ; DIG 4 ; DIG 2 ; ADD ; SOME ; DIG 3 ; DIG 3 ; PAIR ; UPDATE } ;
                                                       DUP 3 ;
                                                       CDR ;
                                                       DUP 4 ;
                                                       CAR ;
                                                       CDR ;
                                                       DIG 2 ;
                                                       DIG 4 ;
                                                       CAR ;
                                                       CAR ;
                                                       CAR ;
                                                       PAIR ;
                                                       PAIR ;
                                                       PAIR ;
                                                       SWAP ;
                                                       PAIR } } } ;
                                      CDR } ;
                               NIL operation ;
                               PAIR } } } }
                { IF_LEFT
                    { IF_LEFT
                        { DUP 2 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          NEQ ;
                          IF { DROP 2 ; PUSH string "NOT_AN_ADMIN" ; FAILWITH }
                             { DUP 2 ;
                               CDR ;
                               DUP 3 ;
                               CAR ;
                               CDR ;
                               DIG 3 ;
                               CAR ;
                               CAR ;
                               CDR ;
                               DIG 3 ;
                               PAIR ;
                               PAIR ;
                               PAIR } }
                        { DUP 2 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          NEQ ;
                          IF { DROP 2 ; PUSH string "NOT_AN_ADMIN" ; FAILWITH }
                             { DUP 2 ;
                               CDR ;
                               DUP 3 ;
                               CAR ;
                               CDR ;
                               CDR ;
                               DUP 4 ;
                               CAR ;
                               CDR ;
                               CAR ;
                               DIG 3 ;
                               SOME ;
                               PUSH string "contents" ;
                               UPDATE ;
                               PAIR ;
                               DIG 2 ;
                               CAR ;
                               CAR ;
                               PAIR ;
                               PAIR } } ;
                      NIL operation ;
                      PAIR }
                    { IF_LEFT
                        { DUP 2 ;
                          CDR ;
                          CAR ;
                          CAR ;
                          IF { DROP 2 ; PUSH string "CONTRACT_IS_PAUSED" ; FAILWITH }
                             { SENDER ;
                               DUG 2 ;
                               ITER { IF_LEFT
                                        { DUP ;
                                          CAR ;
                                          DUP 4 ;
                                          COMPARE ;
                                          NEQ ;
                                          IF { DROP 2 ; PUSH string "FA2_NOT_OWNER" ; FAILWITH }
                                             { DUP 2 ;
                                               CDR ;
                                               DUP 3 ;
                                               CAR ;
                                               CDR ;
                                               CDR ;
                                               UNIT ;
                                               DIG 3 ;
                                               SWAP ;
                                               SOME ;
                                               SWAP ;
                                               UPDATE ;
                                               DUP 3 ;
                                               CAR ;
                                               CDR ;
                                               CAR ;
                                               PAIR ;
                                               DIG 2 ;
                                               CAR ;
                                               CAR ;
                                               PAIR ;
                                               PAIR } }
                                        { DUP ;
                                          CAR ;
                                          DUP 4 ;
                                          COMPARE ;
                                          NEQ ;
                                          IF { DROP 2 ; PUSH string "FA2_NOT_OWNER" ; FAILWITH }
                                             { DUP 2 ;
                                               CDR ;
                                               DUP 3 ;
                                               CAR ;
                                               CDR ;
                                               CDR ;
                                               DIG 2 ;
                                               NONE unit ;
                                               SWAP ;
                                               UPDATE ;
                                               DUP 3 ;
                                               CAR ;
                                               CDR ;
                                               CAR ;
                                               PAIR ;
                                               DIG 2 ;
                                               CAR ;
                                               CAR ;
                                               PAIR ;
                                               PAIR } } } ;
                               SWAP ;
                               DROP ;
                               NIL operation ;
                               PAIR } }
                        { DUP 2 ;
                          CAR ;
                          CAR ;
                          CAR ;
                          SENDER ;
                          COMPARE ;
                          NEQ ;
                          IF { DROP 2 ; PUSH string "NOT_AN_ADMIN" ; FAILWITH }
                             { UNPAIR ;
                               DUP 3 ;
                               CDR ;
                               CAR ;
                               CDR ;
                               DUP 2 ;
                               MEM ;
                               NOT ;
                               IF { DROP 3 ; PUSH string "FA2_TOKEN_UNDEFINED" ; FAILWITH }
                                  { DUP 3 ;
                                    CDR ;
                                    CDR ;
                                    DUP 4 ;
                                    CDR ;
                                    CAR ;
                                    CDR ;
                                    EMPTY_MAP string bytes ;
                                    DIG 4 ;
                                    SOME ;
                                    PUSH string "" ;
                                    UPDATE ;
                                    DUP 4 ;
                                    PAIR ;
                                    SOME ;
                                    DIG 3 ;
                                    UPDATE ;
                                    DUP 3 ;
                                    CDR ;
                                    CAR ;
                                    CAR ;
                                    PAIR ;
                                    PAIR ;
                                    SWAP ;
                                    CAR ;
                                    PAIR } } ;
                          NIL operation ;
                          PAIR } } } } } }`
