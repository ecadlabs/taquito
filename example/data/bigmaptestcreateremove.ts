export const contractBigMapCreateRemove =  `{ parameter (or (unit %createBigMap) (unit %removeBigMap));
    storage (big_map address (pair int int));
    code { EMPTY_BIG_MAP address (pair int int) ;
           PUSH int 2 ;
           PUSH int 1 ;
           PAIR ;
           SOME ;
           PUSH address "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" ;
           UPDATE ;
           SWAP ;
           CAR ;
           IF_LEFT
             { DROP 2 ;
               EMPTY_BIG_MAP address (pair int int) ;
               PUSH int 2 ;
               PUSH int 1 ;
               PAIR ;
               SOME ;
               PUSH address "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" ;
               UPDATE }
             { DROP ; NONE (pair int int) ; PUSH address "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" ; UPDATE } ;
           NIL operation ;
           PAIR }}
     `