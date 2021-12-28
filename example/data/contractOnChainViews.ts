export const contractOnChainViews = `{ view "add" nat nat { UNPAIR ; ADD } ;
  view "fib" nat nat
        { CAR ;
          DUP ;
          PUSH nat 0 ;
          COMPARE ;
          EQ ;
          IF
            {}
            { DUP ;
              PUSH nat 1 ;
              COMPARE ;
              EQ ;
              IF
                {}
                { DUP ;
                  PUSH nat 1 ;
                  SWAP ;
                  SUB ;
                  ABS ;
                  SELF_ADDRESS ;
                  SWAP ;
                  VIEW "fib" nat ;
                  { IF_NONE
                      { { UNIT ; FAILWITH } }
                      { SWAP ;
                        PUSH nat 2 ;
                        SWAP ;
                        SUB ;
                        ABS ;
                        SELF_ADDRESS ;
                        SWAP ;
                        VIEW "fib" nat ;
                        { IF_NONE { { UNIT ; FAILWITH } } { ADD } } } } } } } ;
  view "id" nat (pair nat nat) {} ;
  view "is_twenty" (pair nat address) nat
        { CAR ;
          DUP ;
          CAR ;
          PUSH nat 20 ;
          COMPARE ;
          EQ ;
          IF
            { CAR }
            { DUP ; CDR ; SWAP ; VIEW "succ" nat ; { IF_NONE { { UNIT ; FAILWITH } } {} } } } ;
  view "step_constants" unit
        (pair (pair mutez mutez) (pair (pair address address) address))
        { DROP ; SOURCE ; SENDER ; SELF_ADDRESS ; PAIR ; PAIR ; BALANCE ; AMOUNT ; PAIR ; PAIR } ;
  view "succ" (pair nat address) nat
        { CAR ;
          UNPAIR ;
          PUSH nat 1 ;
          ADD ;
          PAIR ;
          DUP ;
          CDR ;
          SWAP ;
          VIEW "is_twenty" nat ;
          { IF_NONE { { UNIT ; FAILWITH } } {} } } ;
  view "test_failwith" nat (pair nat nat) { FAILWITH } ;
  parameter nat ;
  storage nat ;
  code { CAR ; NIL operation ; PAIR } }`