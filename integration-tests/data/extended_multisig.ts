export const extended_multisig = `{ parameter
  (or (unit %default)
      (pair %main
          (pair :payload
              (nat %counter)
              (or :action
                  (lambda %operation unit (list operation))
                  (pair %change_keys (nat %threshold) (list %keys key))))
          (list %sigs (option signature)))) ;
storage (pair (nat %stored_counter) (pair (nat %threshold) (list %keys key))) ;
code { UNPAIR ;
      IF_LEFT
      { DROP ; NIL operation ; PAIR }
      { PUSH mutez 0 ; # [pair %main ; storage]
          AMOUNT ;
          ASSERT_CMPEQ ; # checks 0 amount
          SWAP ; # [storage ; pair %main]
          DUP ; # [storage ; storage ; pair %main]
          DIP { SWAP } ; # [storage ; pair %main ; storage]
          DIP { UNPAIR ; # [storage ; pair :payload ; list %sigs ; storage]
              DUP ; # [storage ; pair :payload ; pair :payload; list %sigs ; storage]
              SELF ; 
              ADDRESS ; # [storage ; contract address ; pair :payload ; pair :payload; list %sigs ; storage]
              CHAIN_ID ; # [storage ; chain_id ; contract address ; pair :payload ; pair :payload; list %sigs ; storage]
              PAIR ; # [storage ; pair(chain_id ; contract address) ; pair :payload ; pair :payload; list %sigs ; storage]
              PAIR ; # [storage ; pair(pair(chain_id ; contract address) ; pair :payload) ; pair :payload; list %sigs ; storage]
              PACK ; # [storage ; bytes ; pair :payload; list %sigs ; storage]
              DIP { 
                      UNPAIR @counter ; # [storage ; bytes ; nat %counter ; or :action ; list %sigs ; storage]
                      DIP { SWAP } # [storage ; bytes ; nat %counter ; list %sigs ; or :action ; storage]
                  } ;
              SWAP } ; # [storage ; nat %counter ; bytes ; list %sigs ; or :action ; storage]
          UNPAIR @stored_counter ; # [nat %stored_counter ; pair (nat %threshold ; list %keys) ; nat %counter ; bytes ; list %sigs ; or :action ; storage]
          DIP { SWAP } ; # [nat %stored_counter ; nat %counter ; pair (nat %threshold ; list %keys) ; bytes ; list %sigs ; or :action ; storage]
          ASSERT_CMPEQ ;
          DIP { SWAP } ; # [pair (nat %threshold ; list %keys) ; list %sigs ; bytes ; or :action ; storage]
          UNPAIR @threshold @keys ; # [nat %threshold ; list %keys ; list %sigs ; bytes ; or :action ; storage]
          DIP { PUSH @valid nat 0 ; # [nat %threshold ; nat 0 ; list %keys ; list %sigs ; bytes ; or :action ; storage]
              SWAP ; # [nat %threshold ; list %keys ; nat 0 ; list %sigs ; bytes ; or :action ; storage]
              ITER { DIP { SWAP } ; # [nat %threshold ; list %keys ; list %sigs ; nat 0 ; bytes ; or :action ; storage]
                      SWAP ; # [nat %threshold ; list %sigs ; list %keys ; nat 0 ; bytes ; or :action ; storage]
                      IF_CONS
                      { IF_SOME
                          { SWAP ;
                              DIP { SWAP ;
                                  DIP 2 { DUP 2 } ;
                                  { DUP 3 ;
                                      DIP { CHECK_SIGNATURE } ;
                                      SWAP ;
                                      IF { DROP } { FAILWITH } } ;
                                  PUSH nat 1 ;
                                  ADD @valid } }
                          { SWAP ; DROP } }
                      { FAIL } ;
                      SWAP } 
              } ;
          ASSERT_CMPLE ; # [nat %threshold ; nat 0 + list_length ; bytes ; or :action ; storage]
          IF_CONS { FAIL } {} ;
          DROP ; # [or :action ; storage]
          DIP { UNPAIR ; PUSH nat 1 ; ADD @new_counter ; PAIR } ; # [or :action ; nat %stored_counter ; pair %threshold %keys]
          IF_LEFT 
          { 
              UNIT ; 
              EXEC # runs the lambda
          } 
          { 
              DIP { CAR } ; 
              SWAP ; 
              PAIR ; # replaces the storage with the provided values
              NIL operation
          } ;
          PAIR } } } 
        }`