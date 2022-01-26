export const contractIncrementing =  `{ parameter (or (int %decrement) (int %increment)) ;
    storage int ;
    code { DUP ;
           CDR ;
           DIP { DUP } ;
           SWAP ;
           CAR ;
           IF_LEFT
             { DIP { DUP } ;
               SWAP ;
               DIP { DUP } ;
               PAIR ;
               DUP ;
               CAR ;
               DIP { DUP ; CDR } ;
               SUB ;
               DIP { DROP 2 } }
             { DIP { DUP } ;
               SWAP ;
               DIP { DUP } ;
               PAIR ;
               DUP ;
               CAR ;
               DIP { DUP ; CDR } ;
               ADD ;
               DIP { DROP 2 } } ;
           NIL operation ;
           PAIR ;
           DIP { DROP 2 } } }
        `