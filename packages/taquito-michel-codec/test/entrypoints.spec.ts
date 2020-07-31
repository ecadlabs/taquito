import { Contract } from "../src/michelson-contract";
import { MichelsonError } from "../src/utils";
import { inspect } from "util";

describe('Entrypoints', () => {
    it("big_map_entrypoints", () => {
        const src = `storage
      (pair (big_map string nat) (big_map string nat)) ;
    parameter
      (or (unit %default)
          (or (or %mem (string %mem_left) (string %mem_right))
              (or (or %add (pair %add_left string nat) (pair %add_right string nat))
                  (or %rem (string %rem_left) (string %rem_right))))) ;
    code { UNPAIR ;
           IF_LEFT
             { DROP ;
               DUP ; CAR ;
               PUSH mutez 0 ;
               NONE key_hash ;
               CREATE_CONTRACT
                 { parameter string ;
                   storage (big_map string nat) ;
                   code { UNPAIR ; DROP ; NIL operation ; PAIR }} ;
               DIP { DROP } ;
               NIL operation ; SWAP ; CONS ; PAIR }
             { IF_LEFT
                 { IF_LEFT
                     { DIP { UNPAIR } ; DIP { DUP } ; MEM ; ASSERT }
                     { DIP { UNPAIR ; SWAP } ; DIP { DUP } ; MEM ; ASSERT ; SWAP } }
                 { IF_LEFT
                     { IF_LEFT
                         { UNPAIR ; DIIP { UNPAIR } ; DIP { SOME } ; UPDATE }
                         { UNPAIR ; DIIP { UNPAIR ; SWAP } ; DIP { SOME } ; UPDATE ; SWAP } }
                     { IF_LEFT
                         { DIP { UNPAIR } ; DIP { NONE nat } ; UPDATE }
                         { DIP { UNPAIR ; SWAP } ; DIP { NONE nat } ; UPDATE ; SWAP } } } ;
               PAIR ; NIL operation ; PAIR } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("delegatable_target", () => {
        const src = `# Michelson pseudo-code to transform from source script.
      # This transformation adds 'set_delegate' entrypoint, e.g.:
      #
      #  parameter <parameter_expr> ;
      #  storage <storage_expr> ;
      #  code <code_expr> ;
      #
      # to:
    parameter
      (or
         (or (key_hash %set_delegate)
             (unit %remove_delegate))
         (or %default string nat)
      ) ;
    
    storage
      (pair
         key_hash # manager
         (pair string nat)
      ) ;
    
    code {
           DUP ;
           CAR ;
           IF_LEFT
             { # 'set_delegate'/'remove_delegate' entrypoints
               # Assert no token was sent:
               # to send tokens, the default entry point should be used
               PUSH mutez 0 ;
               AMOUNT ;
               ASSERT_CMPEQ ;
               # Assert that the sender is the manager
               DUUP ;
               CDR ;
               CAR ;
               IMPLICIT_ACCOUNT ; ADDRESS ;
               SENDER ;
               IFCMPNEQ
                 { SENDER ;
                   PUSH string "Only the owner can operate." ;
                   PAIR ;
                   FAILWITH ;
                 }
                 { DIP { CDR ; NIL operation } ;
                   IF_LEFT
                     { # 'set_delegate' entrypoint
                       SOME ;
                       SET_DELEGATE ;
                       CONS ;
                       PAIR ;
                     }
                     { # 'remove_delegate' entrypoint
                       DROP ;
                       NONE key_hash ;
                       SET_DELEGATE ;
                       CONS ;
                       PAIR ;
                     }
                 }
             }
             { # Transform the inputs to the original script types
               DIP { CDR ; DUP ; CDR } ;
               PAIR ;
    
               # 'default' entrypoint - original code
               { UNPAIR;
                 IF_LEFT
                   { DIP { UNPAIR ; DROP } }
                   { DUG 1; UNPAIR ; DIP { DROP } } ;
                 PAIR ; NIL operation ; PAIR }
               # Transform the outputs to the new script types (manager's storage is unchanged)
               SWAP ;
               CAR ;
               SWAP ;
               UNPAIR ;
               DIP { SWAP ; PAIR } ;
               PAIR ;
             }
         }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("manager", () => {
        const src = `parameter
      (or
         (lambda %do unit (list operation))
         (unit %default));
    storage key_hash;
    code
      { UNPAIR ;
        IF_LEFT
          { # 'do' entrypoint
            # Assert no token was sent:
            # to send tokens, the default entry point should be used
            PUSH mutez 0 ;
            AMOUNT ;
            ASSERT_CMPEQ ;
            # Assert that the sender is the manager
            DUUP ;
            IMPLICIT_ACCOUNT ;
            ADDRESS ;
            SENDER ;
            ASSERT_CMPEQ ;
            # Execute the lambda argument
            UNIT ;
            EXEC ;
            PAIR ;
          }
          { # 'default' entrypoint
            DROP ;
            NIL operation ;
            PAIR ;
          }
      };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("no_default_target", () => {
        const src = `storage (pair string nat) ;
    parameter
      (or unit (or %data string nat)) ;
    code { UNPAIR ;
           IF_LEFT
             { DROP ; NIL operation ; PAIR }
             { IF_LEFT
                 { DIP { UNPAIR ; DROP } }
                 { DUG 1; UNPAIR ; DIP { DROP } } ;
               PAIR ; NIL operation ; PAIR }
         }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("no_entrypoint_target", () => {
        const src = `storage (pair string nat) ;
    parameter
      (or unit (or string nat)) ;
    code { UNPAIR ;
           IF_LEFT
             { DROP ; NIL operation ; PAIR }
             { IF_LEFT
                 { DIP { UNPAIR ; DROP } }
                 { DUG 1; UNPAIR ; DIP { DROP } } ;
               PAIR ; NIL operation ; PAIR }
         }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("rooted_target", () => {
        const src = `storage (pair string nat) ;
    parameter
      (or %root unit (or %default string nat)) ;
    code { UNPAIR ;
           IF_LEFT
             { DROP ; NIL operation ; PAIR }
             { IF_LEFT
                 { DIP { UNPAIR ; DROP } }
                 { DUG 1; UNPAIR ; DIP { DROP } } ;
               PAIR ; NIL operation ; PAIR }
         }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("simple_entrypoints", () => {
        const src = `# A trivial contract with some entrypoints
    parameter (or (unit %A) (or (string %B) (nat %C))) ;
    storage unit;
    code { CDR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });
});
