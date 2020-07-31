import { Contract } from "../src/michelson-contract";
import { MichelsonError, formatError } from "../src/utils";

describe("Contract macros", () => {
    it("assert", () => {
        const src = `parameter bool;
    storage unit;
    code {CAR; ASSERT; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmpeq", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPEQ; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmpge", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPGE; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmpgt", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPGT; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmple", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPLE; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmplt", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPLT; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_cmpneq", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; ASSERT_CMPNEQ; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_eq", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_EQ; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_ge", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_GE; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_gt", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_GT; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_le", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_LE; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_lt", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_LT; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("assert_neq", () => {
        const src = `parameter (pair int int);
    storage unit;
    code {CAR; DUP; CAR; DIP{CDR}; COMPARE; ASSERT_NEQ; UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("big_map_get_add", () => {
        const src = `parameter (pair (pair %set_pair int (option int)) (pair %check_pair int (option int))) ;
    storage (pair (big_map int int) unit) ;
    code { DUP ; DIP { CDAR } ;
           DUP ; DIP { CADR; DUP ; CAR ; DIP { CDR } ; UPDATE ; DUP } ;
           CADR ; DUP ; CDR ; DIP { CAR ; GET } ;
           IF_SOME { SWAP ; IF_SOME { ASSERT_CMPEQ } {FAIL}} { ASSERT_NONE } ;
           UNIT ; SWAP ; PAIR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("big_map_mem", () => {
        const src = `# Fails if the boolean does not match the membership criteria
    parameter (pair int bool) ;
    storage (pair (big_map int unit) unit) ;
    code { DUP ; DUP ; CADR ; DIP { CAAR ; DIP { CDAR ; DUP } ; MEM } ;
           ASSERT_CMPEQ ; UNIT ; SWAP ; PAIR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("build_list", () => {
        const src = `parameter nat;
    storage (list nat);
    code { CAR @counter; NIL @acc nat; SWAP; DUP @cmp_num; PUSH nat 0; CMPNEQ;
           LOOP { DUP; DIP {SWAP}; CONS @acc; SWAP; PUSH nat 1; SWAP; SUB @counter;
                  DUP; DIP{ABS}; PUSH int 0; CMPNEQ};
           CONS; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("compare", () => {
        const src = `parameter (pair mutez mutez);
    storage (list bool);
    code {CAR; DUP; DUP; DUP; DUP; DIIIIIP {NIL bool};
          DIIIIP {DUP; CAR; DIP {CDR}; COMPARE; LE; CONS};
          DIIIP {DUP; CAR; DIP {CDR}; COMPARE; GE; CONS};
          DIIP{DUP; CAR; DIP {CDR}; COMPARE; LT; CONS};
          DIP {DUP; CAR; DIP {CDR}; COMPARE; GT; CONS};
          DUP; CAR; DIP {CDR}; COMPARE; EQ; CONS;
          NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("compare_bytes", () => {
        const src = `parameter (pair bytes bytes);
    storage (list bool);
    code {CAR; DUP; DUP; DUP; DUP; DIIIIIP {NIL bool};
          DIIIIP {DUP; CAR; DIP {CDR}; COMPARE; LE; CONS};
          DIIIP {DUP; CAR; DIP {CDR}; COMPARE; GE; CONS};
          DIIP{DUP; CAR; DIP {CDR}; COMPARE; LT; CONS};
          DIP {DUP; CAR; DIP {CDR}; COMPARE; GT; CONS};
          DUP; CAR; DIP {CDR}; COMPARE; EQ; CONS;
          NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("fail", () => {
        const src = `parameter unit;
    storage unit;
    code
      { # This contract will never accept a incoming transaction
        FAIL};`;

        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("guestbook", () => {
        const src = `parameter string;
    storage (map address (option string));
    
    code { UNPAIR @message @guestbook; SWAP;
           DUP; SENDER; GET @previous_message;
           ASSERT_SOME;
           ASSERT_NONE;
           SWAP; SOME; SOME; SENDER; UPDATE;
           NIL operation;
           PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("macro_annotations", () => {
        const src = `parameter unit;
    storage (pair (unit %truc) unit);
    code { DROP; UNIT ; UNIT ; PAIR %truc ; UNIT ;
           DUUP @new_storage ;
           DIP { DROP ; DROP } ;
           NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("map_caddaadr", () => {
        const src = `parameter unit;
    storage (pair (pair nat (pair nat (pair (pair (pair (nat %p) (mutez %value)) nat) nat))) nat);
    code { MAP_CDADDAADR @new_storage %value { PUSH mutez 1000000 ; ADD } ;
           NIL operation ; SWAP; SET_CAR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("max_in_list", () => {
        const src = `parameter (list int);
    storage (option int);
    code {CAR; DIP{NONE int};
          ITER {SWAP;
                IF_NONE {SOME}
                        {DIP {DUP}; DUP; DIP{SWAP};
                         CMPLE; IF {DROP} {DIP {DROP}};
                         SOME}};
          NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("min", () => {
        const src = `
    parameter (pair int int);
    storage int;
    code { CAR;                     # Ignore the storage
           DUP;                     # Duplicate so we can get both the numbers passed as parameters
           DUP;                     # Second dup so we can access the lesser number
           CAR; DIP{CDR};           # Unpack the numbers on top of the stack
           CMPLT;                   # Compare the two numbers, placing a boolean on top of the stack
           IF {CAR} {CDR};          # Access the first number if the boolean was true
           NIL operation;           # Return no op
           PAIR}                    # Pair the numbers satisfying the calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("pair_macro", () => {
        const src = `parameter unit;
    storage unit;
    code { UNIT; UNIT; UNIT; UNIT; UNIT;
           PAPAPAPAIR @name %x1 %x2 %x3 %x4 %x5;
           CDDDAR %x4 @fourth;
           DROP; CDR; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("set_caddaadr", () => {
        const src = `parameter mutez;
    storage (pair (pair nat (pair nat (pair (pair (pair (nat %p) (mutez %value)) nat) nat))) nat);
    code { DUP ; CAR ; SWAP ; CDR ;
           SET_CADDAADR @toplevel_pair_name %value ;
           NIL operation ; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("take_my_money", () => {
        const src = `parameter key_hash;
    storage unit;
    code { CAR; IMPLICIT_ACCOUNT; # Create an account for the recipient of the funds
           DIP{UNIT};             # Push a value of the storage type below the contract
           PUSH mutez 1000000;       # The person can have a ꜩ
           UNIT;                 # Push the contract's argument type
           TRANSFER_TOKENS;      # Run the transfer
           NIL operation; SWAP; CONS;
           PAIR };                # Cleanup and put the return values`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });

    it("unpair_macro", () => {
        const src = `parameter (unit :param_unit);
    storage (unit :u1);
    code { DROP ;
           UNIT :u4 @a4; UNIT :u3 @a3; UNIT :u2 @a2; UNIT :u1 @a1;
           PAIR; UNPAIR @x1 @x2;
           PPAIPAIR @p1 %x1 %x2 %x3 %x4; UNPPAIPAIR %x1 % %x3 %x4 @uno @due @tre @quattro;
           PAPAPAIR @p2 %x1 %x2 %x3 %x4; UNPAPAPAIR @un @deux @trois @quatre;
           PAPPAIIR @p3 %x1 %x2 %x3 %x4; UNPAPPAIIR @one @two @three @four;
           DIP { DROP; DROP; DROP }; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(formatError(err));
            }
            throw err;
        }
    });
});

