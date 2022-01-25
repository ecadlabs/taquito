 export const contractIssue1101 =
 [{"prim":"parameter","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"pair","args":[{"prim":"key"},{"prim":"pair","args":[{"prim":"signature"},{"prim":"bytes"}]}],"annots":["%check_signature"]},{"prim":"pair","args":[{"prim":"or","args":[{"prim":"int","annots":["%int"]},{"prim":"string","annots":["%string"]}]},{"prim":"or","args":[{"prim":"int","annots":["%int"]},{"prim":"string","annots":["%string"]}]}],"annots":["%complex_optional_param"]}]},{"prim":"or","args":[{"prim":"pair","args":[{"prim":"nat"},{"prim":"string"}],"annots":["%complex_param"]},{"prim":"unit","annots":["%fail"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"unit","annots":["%fail_with_int"]},{"prim":"unit","annots":["%fail_with_pair"]}]},{"prim":"int","annots":["%simple_param"]}]}]}]},{"prim":"storage","args":[{"prim":"pair","args":[{"prim":"int","annots":["%simple"]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"nat"},{"prim":"string"}],"annots":["%complex"]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"or","args":[{"prim":"int","annots":["%int"]},{"prim":"string","annots":["%string"]}],"annots":["%or1"]},{"prim":"or","args":[{"prim":"int","annots":["%int"]},{"prim":"string","annots":["%string"]}],"annots":["%or2"]}],"annots":["%optional"]},{"prim":"option","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"bytes","annots":["%msg"]},{"prim":"address","annots":["%sender"]}]},{"prim":"signature","annots":["%sig_"]}]}],"annots":["%last_checked_sig"]}]}]}]}]},{"prim":"code","args":[[[[{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"CDR"}]]}]],{"prim":"IF_LEFT","args":[[{"prim":"IF_LEFT","args":[[{"prim":"IF_LEFT","args":[[[[{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"CDR"}]]}]],{"prim":"SWAP"},[[{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"CDR"}]]}]],{"prim":"SENDER"},[{"prim":"DIP","args":[{"int":"3"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"4"}]}],{"prim":"HASH_KEY"},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"ADDRESS"},{"prim":"COMPARE"},{"prim":"NEQ"},{"prim":"IF","args":[[{"prim":"DROP","args":[{"int":"4"}]},{"prim":"PUSH","args":[{"prim":"string"},{"string":"DIFFERENT_SIGNER_SENDER"}]},{"prim":"FAILWITH"}],[{"prim":"SWAP"},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"SWAP"},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"DIG","args":[{"int":"4"}]},{"prim":"CHECK_SIGNATURE"},{"prim":"IF","args":[[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"SWAP"},{"prim":"SENDER"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"SOME"},{"prim":"UPDATE","args":[{"int":"6"}]}],[{"prim":"DROP","args":[{"int":"3"}]},{"prim":"PUSH","args":[{"prim":"string"},{"string":"DIFFERENT_SIGNER"}]},{"prim":"FAILWITH"}]]}]]}],[{"prim":"UPDATE","args":[{"int":"5"}]}]]}],[{"prim":"IF_LEFT","args":[[{"prim":"DUP"},{"prim":"CAR"},[{"prim":"DIP","args":[{"int":"2"},[{"prim":"DUP"}]]},{"prim":"DIG","args":[{"int":"3"}]}],{"prim":"CAR"},{"prim":"ADD"},{"prim":"ABS"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"PAIR"},{"prim":"UPDATE","args":[{"int":"3"}]}],[{"prim":"DROP","args":[{"int":"2"}]},{"prim":"PUSH","args":[{"prim":"string"},{"string":"Fail entrypoint"}]},{"prim":"FAILWITH"}]]}]]}],[{"prim":"IF_LEFT","args":[[{"prim":"IF_LEFT","args":[[{"prim":"DROP"},{"prim":"PUSH","args":[{"prim":"int"},{"int":"5"}]},{"prim":"FAILWITH"}],[{"prim":"DROP"},{"prim":"PUSH","args":[{"prim":"pair","args":[{"prim":"int"},{"prim":"string"}]},{"prim":"Pair","args":[{"int":"6"},{"string":"taquito"}]}]},{"prim":"FAILWITH"}]]}],[{"prim":"SWAP"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"ADD"},{"prim":"UPDATE","args":[{"int":"1"}]}]]}]]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}]
 
 
 //  `{ parameter (or
//   (or
//     (or (pair %check_signature key (pair signature bytes))
//         (pair %complex_optional_param (or (int %int) (string %string))
//                                       (or (int %int) (string %string))))
//     (or (pair %complex_param nat string) (unit %fail)))
//   (or (or (unit %fail_with_int) (unit %fail_with_pair)) (int %simple_param)));
// storage (pair (int %simple)
//     (pair (pair %complex nat string)
//           (pair
//             (pair %optional (or %or1 (int %int) (string %string))
//                             (or %or2 (int %int) (string %string)))
//             (option %last_checked_sig (pair
//                                        (pair (bytes %msg) (address %sender))
//                                        (signature %sig_))))));
// code { { { DUP ; CAR ; DIP { CDR } } } ;
// IF_LEFT
// { IF_LEFT
//    { IF_LEFT
//        { { { DUP ; CAR ; DIP { CDR } } } ;
//          SWAP ;
//          { { DUP ; CAR ; DIP { CDR } } } ;
//          SENDER ;
//          { DIP 3 { DUP } ; DIG 4 } ;
//          HASH_KEY ;
//          IMPLICIT_ACCOUNT ;
//          ADDRESS ;
//          COMPARE ;
//          NEQ ;
//          IF
//            { DROP 4 ; PUSH string "DIFFERENT_SIGNER_SENDER" ; FAILWITH }
//            { SWAP ;
//              DUP ;
//              DUG 2 ;
//              SWAP ;
//              DUP ;
//              DUG 2 ;
//              DIG 4 ;
//              CHECK_SIGNATURE ;
//              IF
//                { DIG 2 ; SWAP ; SENDER ; DIG 3 ; PAIR ; PAIR ; SOME ; UPDATE 6 }
//                { DROP 3 ; PUSH string "DIFFERENT_SIGNER" ; FAILWITH } } }
//        { UPDATE 5 } }
//    { IF_LEFT
//        { DUP ; CAR ; { DIP 2 { DUP } ; DIG 3 } ; CAR ; ADD ; ABS ; DUG 2 ; CDR ; DIG 2 ; PAIR ; UPDATE 3 }
//        { DROP 2 ; PUSH string "Fail entrypoint" ; FAILWITH } } }
// { IF_LEFT
//    { IF_LEFT
//        { DROP ; PUSH int 5 ; FAILWITH }
//        { DROP ; PUSH (pair int string) (Pair 6 "taquito") ; FAILWITH } }
//    { SWAP ; DUP ; CAR ; DIG 2 ; ADD ; UPDATE 1 } } ;
// NIL operation ;
// PAIR }`