export const securityWrongAnnotations = `{ parameter
  (or (or (or (pair %add (nat %valueA) (nat %valueB)) (pair %addNoAnnot nat nat))
          (or (pair %addWrongAnnot (nat %a) (nat %b))
              (pair %call (string %entrypoint) (pair %param (nat %valueA) (nat %valueB)))))
      (or (pair %callNoAnnot (string %entrypoint) (pair %param nat nat))
          (pair %callWrongAnnot (string %entrypoint) (pair %param (nat %a) (nat %b))))) ;
storage nat ;
code { UNPAIR ;
       IF_LEFT
         { IF_LEFT
             { SWAP ;
               DROP ;
               IF_LEFT
                 { UNPAIR ; ADD ; NIL operation ; PAIR }
                 { UNPAIR ; ADD ; NIL operation ; PAIR } }
             { IF_LEFT
                 { SWAP ; DROP ; UNPAIR ; ADD ; NIL operation ; PAIR }
                 { NIL operation ;
                   PUSH string "Add" ;
                   DUP 3 ;
                   CAR ;
                   COMPARE ;
                   EQ ;
                   IF { SELF_ADDRESS ;
                        CONTRACT %add (pair (nat %valueA) (nat %valueB)) ;
                        IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                        PUSH mutez 0 ;
                        DUP 4 ;
                        CDR ;
                        TRANSFER_TOKENS ;
                        UNIT ;
                        DUG 2 ;
                        CONS ;
                        PAIR }
                      { UNIT ; SWAP ; PAIR } ;
                   CAR ;
                   PUSH string "AddNoAnnot" ;
                   DUP 3 ;
                   CAR ;
                   COMPARE ;
                   EQ ;
                   IF { SELF_ADDRESS ;
                        CONTRACT %addNoAnnot (pair (nat %valueA) (nat %valueB)) ;
                        IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                        PUSH mutez 0 ;
                        DUP 4 ;
                        CDR ;
                        TRANSFER_TOKENS ;
                        UNIT ;
                        DUG 2 ;
                        CONS ;
                        PAIR }
                      { UNIT ; SWAP ; PAIR } ;
                   CAR ;
                   PUSH string "AddWrongAnnot" ;
                   DUP 3 ;
                   CAR ;
                   COMPARE ;
                   EQ ;
                   IF { SELF_ADDRESS ;
                        CONTRACT %addWrongAnnot (pair (nat %valueA) (nat %valueB)) ;
                        IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                        PUSH mutez 0 ;
                        DIG 3 ;
                        CDR ;
                        TRANSFER_TOKENS ;
                        UNIT ;
                        DUG 2 ;
                        CONS ;
                        PAIR }
                      { SWAP ; DROP ; UNIT ; SWAP ; PAIR } ;
                   CAR ;
                   PAIR } } }
         { IF_LEFT
             { NIL operation ;
               PUSH string "Add" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %add (pair nat nat) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DUP 4 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { UNIT ; SWAP ; PAIR } ;
               CAR ;
               PUSH string "AddNoAnnot" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %addNoAnnot (pair nat nat) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DUP 4 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { UNIT ; SWAP ; PAIR } ;
               CAR ;
               PUSH string "AddWrongAnnot" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %addWrongAnnot (pair nat nat) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DIG 3 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { SWAP ; DROP ; UNIT ; SWAP ; PAIR } ;
               CAR ;
               PAIR }
             { NIL operation ;
               PUSH string "Add" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %add (pair (nat %a) (nat %b)) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DUP 4 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { UNIT ; SWAP ; PAIR } ;
               CAR ;
               PUSH string "AddNoAnnot" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %addNoAnnot (pair (nat %a) (nat %b)) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DUP 4 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { UNIT ; SWAP ; PAIR } ;
               CAR ;
               PUSH string "AddWrongAnnot" ;
               DUP 3 ;
               CAR ;
               COMPARE ;
               EQ ;
               IF { SELF_ADDRESS ;
                    CONTRACT %addWrongAnnot (pair (nat %a) (nat %b)) ;
                    IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                    PUSH mutez 0 ;
                    DIG 3 ;
                    CDR ;
                    TRANSFER_TOKENS ;
                    UNIT ;
                    DUG 2 ;
                    CONS ;
                    PAIR }
                  { SWAP ; DROP ; UNIT ; SWAP ; PAIR } ;
               CAR ;
               PAIR } } } }`