import { Contract } from "../src/michelson-contract";
import { MichelsonError } from "../src/utils";
import { inspect } from "util";

describe('Opcodes', () => {
    it("abs", () => {
        const src = `parameter nat;
storage unit;
code { CAR;
       DUP; NEG; ABS; COMPARE; ASSERT_EQ;
       UNIT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("add", () => {
        const src = `parameter unit;
storage unit;
code
  {
    CAR;

    PUSH int 2; PUSH int 2; ADD; PUSH int 4; ASSERT_CMPEQ;
    PUSH int 2; PUSH int 2; ADD; PUSH int 4; ASSERT_CMPEQ;
    PUSH int 2; PUSH nat 2; ADD; PUSH int 4; ASSERT_CMPEQ;
    PUSH nat 2; PUSH int 2; ADD; PUSH int 4; ASSERT_CMPEQ;
    PUSH nat 2; PUSH nat 2; ADD; PUSH nat 4; ASSERT_CMPEQ;

    # Offset a timestamp by 60 seconds
    PUSH int 60; PUSH timestamp "2019-09-09T12:08:37Z"; ADD;
    PUSH timestamp "2019-09-09T12:09:37Z"; ASSERT_CMPEQ;

    PUSH timestamp "2019-09-09T12:08:37Z"; PUSH int 60; ADD;
    PUSH timestamp "2019-09-09T12:09:37Z"; ASSERT_CMPEQ;

    PUSH mutez 1000; PUSH mutez 1000; ADD;
    PUSH mutez 2000; ASSERT_CMPEQ;

    NIL operation;
    PAIR;
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

    it("add_delta_timestamp", () => {
        const src = `parameter (pair int timestamp);
storage (option timestamp);
code { CAR; DUP; CAR; DIP{CDR}; ADD; SOME; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("add_timestamp_delta", () => {
        const src = `parameter (pair timestamp int);
storage (option timestamp);
code { CAR; DUP; CAR; DIP{CDR}; ADD; SOME; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("address", () => {
        const src = `parameter (contract unit);
storage (option address);
code {CAR; ADDRESS; SOME; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("and", () => {
        const src = `parameter (pair :param (bool %first) (bool %second));
storage (option bool);
code { CAR ; UNPAIR; AND @and; SOME @res; NIL @noop operation; PAIR; UNPAIR @x @y; PAIR %a %b };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("and_binary", () => {
        const src = `parameter unit;
storage unit;
code { DROP;

       # 0101 & 0110 = 0100
       PUSH nat 5; PUSH nat 6; AND; PUSH nat 4; ASSERT_CMPEQ;

       # 0110 & 0101 = 0100
       PUSH nat 6; PUSH int 5; AND; PUSH nat 4; ASSERT_CMPEQ;

       # Negative numbers are represented as with a initial virtual
       # infinite series of 1's.
       # Hence, AND with -1 (1111...) is identity:

       #   12 = ...1100
       # & -1 = ...1111
       #   ----
       # = 12 = ...1100
       PUSH nat 12; PUSH int -1; AND; PUSH nat 12; ASSERT_CMPEQ;

       #   12 = ...0001100
       # & -5 = ...1111011
       # -----------------
       #    8 = ...0001000
       PUSH nat 12; PUSH int -5; AND; PUSH nat 8; ASSERT_CMPEQ;

       UNIT; NIL @noop operation; PAIR; };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("and_logical_1", () => {
        const src = `parameter (pair bool bool);
storage bool;
code { CAR ; UNPAIR; AND @and; NIL @noop operation; PAIR; };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("balance", () => {
        const src = `parameter unit;
storage mutez;
code {DROP; BALANCE; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("big_map_mem_nat", () => {
        const src = `parameter nat;
storage (pair (big_map nat nat) (option bool)) ;
# stores (map, Some flag) where flag = parameter is a member of
# the map in first component of storage
code { UNPAIR;
       DIP { CAR; DUP };
       MEM; SOME; SWAP; PAIR; NIL operation; PAIR;}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("big_map_mem_string", () => {
        const src = `parameter string;
storage (pair (big_map string nat) (option bool)) ;
# stores (map, Some flag) where flag = parameter is a member of
# the map in first component of storage
code { UNPAIR;
       DIP { CAR; DUP };
       MEM; SOME; SWAP; PAIR; NIL operation; PAIR;}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("big_map_to_self", () => {
        const src = `parameter (or (pair %have_fun (big_map string nat) unit) (unit %default));
storage (big_map string nat);
code {
       UNPAIR;
       DIP {NIL operation};
       IF_LEFT {
                 DROP
               }
               {
                 DROP;
                 SELF %have_fun;
                 PUSH mutez 0;
                 DUP 4;
                 PUSH (option nat) (Some 8);
                 PUSH string "hahaha";
                 UPDATE;
                 UNIT; SWAP; PAIR;
                 TRANSFER_TOKENS;
                 CONS
               };
       PAIR
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

    it("car", () => {
        const src = `parameter (pair (nat :l) (nat :r));
storage nat;
code { CAR; CAR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("cdr", () => {
        const src = `parameter (pair (nat :l) (nat :r));
storage nat;
code { CAR; CDR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("chain_id", () => {
        const src = `parameter unit;
storage unit;
code { CHAIN_ID; DROP; CAR; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("chain_id_store", () => {
        const src = `parameter unit;
storage (option chain_id);
code { DROP; CHAIN_ID; SOME; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("check_signature", () => {
        const src = `parameter key;
storage (pair signature string);
code {
       DUP; DUP;
       DIP{ CDR; DUP; CAR;
            DIP{CDR; PACK}};
       CAR; CHECK_SIGNATURE;
       IF {} {FAIL} ;
       CDR; NIL operation ; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("compare", () => {
        const src = `parameter unit;
storage unit;
code {
       DROP;

       # bool
       PUSH bool True; DUP; COMPARE; ASSERT_EQ;
       PUSH bool False; DUP; COMPARE; ASSERT_EQ;
       PUSH bool False; PUSH bool True; COMPARE; ASSERT_GT;
       PUSH bool True; PUSH bool False; COMPARE; ASSERT_LT;

       # bytes
       PUSH bytes 0xAABBCC; DUP; COMPARE; ASSERT_EQ;
       PUSH bytes 0x; PUSH bytes 0x; COMPARE; ASSERT_EQ;
       PUSH bytes 0x; PUSH bytes 0x01; COMPARE; ASSERT_GT;
       PUSH bytes 0x01; PUSH bytes 0x02; COMPARE; ASSERT_GT;
       PUSH bytes 0x02; PUSH bytes 0x01; COMPARE; ASSERT_LT;

       # int
       PUSH int 1; DUP; COMPARE; ASSERT_EQ;
       PUSH int 10; PUSH int 5; COMPARE; ASSERT_LT;
       PUSH int -4; PUSH int 1923; COMPARE; ASSERT_GT;

       # nat
       PUSH nat 1; DUP; COMPARE; ASSERT_EQ;
       PUSH nat 10; PUSH nat 5; COMPARE; ASSERT_LT;
       PUSH nat 4; PUSH nat 1923; COMPARE; ASSERT_GT;

       # key_hash
       PUSH key_hash "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"; DUP; COMPARE; ASSERT_EQ;
       PUSH key_hash "tz1ddb9NMYHZi5UzPdzTZMYQQZoMub195zgv"; PUSH key_hash "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"; COMPARE; ASSERT_LT;
       PUSH key_hash "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"; PUSH key_hash "tz1ddb9NMYHZi5UzPdzTZMYQQZoMub195zgv"; COMPARE; ASSERT_GT;

       # mutez
       PUSH mutez 1; DUP; COMPARE; ASSERT_EQ;
       PUSH mutez 10; PUSH mutez 5; COMPARE; ASSERT_LT;
       PUSH mutez 4; PUSH mutez 1923; COMPARE; ASSERT_GT;

       # string
       PUSH string "AABBCC"; DUP; COMPARE; ASSERT_EQ;
       PUSH string ""; PUSH string ""; COMPARE; ASSERT_EQ;
       PUSH string ""; PUSH string "a"; COMPARE; ASSERT_GT;
       PUSH string "a"; PUSH string "b"; COMPARE; ASSERT_GT;
       PUSH string "b"; PUSH string "a"; COMPARE; ASSERT_LT;

       # timestamp
       PUSH timestamp "2019-09-16T08:38:05Z"; DUP; COMPARE; ASSERT_EQ;
       PUSH timestamp "2017-09-16T08:38:04Z"; PUSH timestamp "2019-09-16T08:38:05Z"; COMPARE; ASSERT_GT;
       PUSH timestamp "2019-09-16T08:38:05Z"; PUSH timestamp "2019-09-16T08:38:04Z"; COMPARE; ASSERT_LT;

       UNIT; NIL operation; PAIR;
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

    it("comparisons", () => {
        const src = `parameter (list int);
storage (list (list bool));
code {
       CAR;

       NIL (list bool);
       DIP {DUP; MAP { EQ; };}; SWAP; CONS;
       DIP {DUP; MAP { NEQ; };}; SWAP; CONS;
       DIP {DUP; MAP { LE; };}; SWAP; CONS;
       DIP {DUP; MAP { LT; };}; SWAP; CONS;
       DIP {DUP; MAP { GE; };}; SWAP; CONS;
       DIP {MAP { GT; };}; SWAP; CONS;

       NIL operation; PAIR;
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

    it("concat_hello", () => {
        const src = `parameter (list string);
storage (list string);
code{ CAR;
      MAP { PUSH @hello string "Hello "; CONCAT }; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("concat_hello_bytes", () => {
        const src = `parameter (list bytes);
storage (list bytes);
code{ CAR;
      MAP { PUSH bytes 0xFF; CONCAT }; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("concat_list", () => {
        const src = `parameter (list string);
storage string;
code {CAR; PUSH string ""; SWAP;
      ITER {SWAP; DIP{NIL string; SWAP; CONS}; CONS; CONCAT};
      NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("cons", () => {
        const src = `parameter int;
storage (list int);
code { UNPAIR; CONS; NIL operation; PAIR; };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("contains_all", () => {
        const src = `parameter (pair (list string) (list string));
storage (option bool);
code {CAR; DUP; CAR; DIP{CDR}; EMPTY_SET string; SWAP;
      ITER {PAIR; DUP; CAR; DIP{CDR}; PUSH bool True; SWAP; UPDATE};
      PUSH bool True; SWAP; PAIR; SWAP;
      ITER {PAIR; DUP; DUP; CAR; DIP{CDAR; DIP{CDDR}; DUP}; MEM; DIP{SWAP}; AND; SWAP; PAIR};
      CDR; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("contract", () => {
        const src = `parameter address;
storage unit;
code {
       CAR;
       CONTRACT unit;
       ASSERT_SOME;
       DROP;
       UNIT;
       NIL operation;
       PAIR
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

    it("create_contract", () => {
        const src = `parameter unit;
storage (option address);
code { DROP;
       UNIT; # starting storage for contract
       AMOUNT;                   # Push the starting balance
       NONE key_hash;                 # No delegate
       CREATE_CONTRACT          # Create the contract
         { parameter unit ;
           storage unit ;
           code
             { CDR;
               NIL operation;
               PAIR; } };
       DIP {SOME;NIL operation};CONS ; PAIR} # Ending calling convention stuff`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("create_contract_rootname", () => {
        const src = `# this contract creates a contract
parameter unit;
storage (option address);
code { DROP;
       UNIT; # starting storage for contract
       AMOUNT;                   # Push the starting balance
       NONE key_hash;                 # No delegate
       CREATE_CONTRACT          # Create the contract
         { parameter %root unit ;
           storage unit ;
           code
             { CDR;
               NIL operation;
               PAIR; } };
       DIP {SOME;NIL operation}; CONS ; PAIR} # Ending calling convention stuff`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("create_contract_rootname_alt", () => {
        const src = `parameter unit;
storage (option address);
code { DROP;
       UNIT; # starting storage for contract
       AMOUNT;                   # Push the starting balance
       NONE key_hash;                 # No delegate
       CREATE_CONTRACT          # Create the contract
         { parameter (unit %root) ;
           storage unit ;
           code
             { CDR;
               NIL operation;
               PAIR; } };
       DIP {SOME;NIL operation}; CONS ; PAIR} # Ending calling convention stuff`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("diff_timestamps", () => {
        const src = `parameter (pair timestamp timestamp);
storage int;
code { CAR; DUP; CAR; DIP{CDR}; SUB; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dig_eq", () => {
        const src = `parameter (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat (pair nat nat))))))))))))))));
storage unit;
# this contract receives a 17-tuple, unpairs it, reverses the order, reverses it again, and pairs it and verifies that the result is the same as the original tuple.
code { CAR;
       DUP;

       UNPAPAPAPAPAPAPAPAPAPAPAPAPAPAPAPAIR;
       DIG 0; DIG 1; DIG 2; DIG 3; DIG 4; DIG 5; DIG 6; DIG 7; DIG 8; DIG 9; DIG 10; DIG 11; DIG 12; DIG 13; DIG 14; DIG 15; DIG 16;
       # PUSH nat 1; ADD;
       DIG 0; DIG 1; DIG 2; DIG 3; DIG 4; DIG 5; DIG 6; DIG 7; DIG 8; DIG 9; DIG 10; DIG 11; DIG 12; DIG 13; DIG 14; DIG 15; DIG 16;
       PAPAPAPAPAPAPAPAPAPAPAPAPAPAPAPAIR;
       ASSERT_CMPEQ;

       UNIT; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dign", () => {
        const src = `parameter (pair (pair (pair (pair nat nat) nat) nat) nat);
storage nat;
code {CAR; UNPAIR ; UNPAIR ; UNPAIR ; UNPAIR ; DIG 4 ; DIP { DROP ; DROP ; DROP ; DROP } ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dip", () => {
        const src = `parameter (pair nat nat);
storage (pair nat nat);
code{
      CAR; UNPAIR;
      DUP; DIP { ADD };
      PAIR;
      NIL operation;
      PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dipn", () => {
        const src = `parameter (pair (pair (pair (pair nat nat) nat) nat) nat);
storage nat;
code {CAR; UNPAIR ; UNPAIR ; UNPAIR ; UNPAIR ; DIP 5 {PUSH nat 6} ; DROP ; DROP ; DROP ; DROP ; DROP ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dropn", () => {
        const src = `parameter (pair (pair (pair (pair nat nat) nat) nat) nat);
storage nat;
code {CAR; UNPAIR ; UNPAIR ; UNPAIR ; UNPAIR ; DROP 4 ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dugn", () => {
        const src = `parameter (pair (pair (pair (pair nat nat) nat) nat) nat);
storage nat;
code {CAR; UNPAIR ; UNPAIR ; UNPAIR ; UNPAIR ; DUG 4 ; DROP ; DROP ; DROP ; DROP ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("ediv", () => {
        const src = `parameter (pair int int);
storage (pair (option (pair int nat)) (pair (option (pair int nat)) (pair (option (pair int nat)) (option (pair nat nat)))));
code { CAR;
       # :: nat : nat : 'S   ->   option (pair nat nat) : 'S
       DUP; UNPAIR; ABS; DIP { ABS; }; EDIV; SWAP;
       # :: nat : int : 'S   ->   option (pair int nat) : 'S
       DUP; UNPAIR; ABS; EDIV; SWAP;
       # :: int : nat : 'S   ->   option (pair int nat) : 'S
       DUP; UNPAIR; DIP { ABS; }; EDIV; SWAP;
       # :: int : int : 'S   ->   option (pair int nat) : 'S
       UNPAIR; EDIV;
       PAPAPAIR;
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("ediv_mutez", () => {
        const src = `parameter (pair mutez (or mutez nat));
storage (or (option (pair nat mutez)) (option (pair mutez mutez)));
code { CAR;
       UNPAIR;
       SWAP;
       IF_LEFT {
                 SWAP; EDIV; LEFT (option (pair mutez mutez));
               }
               {
                 SWAP; EDIV; RIGHT (option (pair nat mutez));
               };
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("empty_map", () => {
        const src = `storage (map string string);
parameter unit;
code {DROP;
      EMPTY_MAP string string;
      PUSH string "world"; SOME; PUSH string "hello"; UPDATE;
      NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("exec_concat", () => {
        const src = `parameter string;
storage string;
code {CAR;
      LAMBDA string string
             {PUSH string "_abc"; NIL string ;
              SWAP ; CONS ; SWAP ; CONS ; CONCAT};
      SWAP; EXEC; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("first", () => {
        const src = `parameter (list nat);
storage nat;
code{CAR; IF_CONS {DIP{DROP}} {FAIL}; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("get_big_map_value", () => {
        const src = `parameter string;
storage (pair (big_map string string) (option string));
# retrieves the values stored in the big_map on the left side of the
# pair at the key denoted by the parameter and puts it in the right
# hand side of the storage
code {DUP; CAR; DIP{CDAR; DUP}; GET; SWAP; PAIR; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("get_map_value", () => {
        const src = `parameter string;
storage (pair (option string) (map string string));
code {DUP; CAR; DIP{CDDR; DUP}; GET; PAIR; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("hash_consistency_checker", () => {
        const src = `parameter (pair mutez (pair timestamp int)) ;
storage bytes ;
code { CAR ; PACK ; BLAKE2B ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("hash_key", () => {
        const src = `parameter key;
storage (option key_hash);
code {CAR; HASH_KEY; SOME ;NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("hash_string", () => {
        const src = `parameter string;
storage bytes;
code {CAR; PACK ; BLAKE2B; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("if", () => {
        const src = `parameter bool;
storage (option bool);
code {CAR; IF {PUSH bool True} {PUSH bool False}; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("if_some", () => {
        const src = `parameter (option string);
storage string;
code { CAR; IF_SOME {} {PUSH string ""}; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("int", () => {
        const src = `parameter nat;
storage (option int);
# this contract takes a natural number as parameter, converts it to an
# integer and stores it.
code { CAR; INT; SOME; NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("left_right", () => {
        const src = `parameter (or bool string);
storage (or string bool);
code {CAR; IF_LEFT {RIGHT string} {LEFT bool}; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_concat", () => {
        const src = `parameter (list string);
storage string;
code { UNPAIR ; SWAP ; CONS ; CONCAT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_concat_bytes", () => {
        const src = `parameter (list bytes);
storage bytes;
code { UNPAIR ; SWAP ; CONS ; CONCAT; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_id", () => {
        const src = `parameter (list string);
storage (list string);
code {CAR; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_id_map", () => {
        const src = `parameter (list string);
storage (list string);
code {CAR; MAP {}; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_iter", () => {
        const src = `parameter (list int);
storage int;
code { CAR; PUSH int 1; SWAP;
       ITER { MUL };
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_map_block", () => {
        const src = `parameter (list int);
storage (list int);
code { CAR; PUSH int 0; SWAP;
       MAP { DIP{DUP}; ADD; DIP{PUSH int 1; ADD}};
       NIL operation; PAIR; DIP{DROP}}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("list_size", () => {
        const src = `parameter (list int);
storage nat;
code {CAR; SIZE; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("loop_left", () => {
        const src = `parameter (list string);
storage (list string);
code { CAR; NIL string; SWAP; PAIR; LEFT (list string);
       LOOP_LEFT { DUP; CAR; DIP{CDR};
                   IF_CONS { SWAP; DIP{CONS}; PAIR; LEFT (list string) }
                           { RIGHT (pair (list string) (list string)) }; };
       NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_car", () => {
        const src = `parameter bool;
storage (pair (bool %b) (nat %n));
code { DUP; CAR; DIP{CDR}; SWAP;
       MAP_CAR @new_storage %b { AND };
       NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_id", () => {
        const src = `parameter (map nat nat);
storage (map nat nat);
code { CAR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_iter", () => {
        const src = `parameter (map (int :k) (int :e));
storage (pair (int :k) (int :e));
code { CAR; PUSH @acc_e (int :e) 0; PUSH @acc_k (int :k) 0; PAIR % %r; SWAP;
       ITER
         { DIP {DUP; CAR; DIP{CDR}}; DUP; # Last instr
           DIP{CAR; ADD}; SWAP; DIP{CDR; ADD}; PAIR % %r };
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_map", () => {
        const src = `parameter nat;
storage (map string nat);
# this contract adds the value passed by parameter to each entry in
# the stored map.
code { UNPAIR; SWAP;
       MAP { CDR; DIP {DUP}; ADD; };
       DIP { DROP; };
       NIL operation; PAIR; }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_map_sideeffect", () => {
        const src = `parameter nat;
storage (pair (map string nat) nat);
# this contract adds the value passed by parameter to each entry in
# the stored map, and it sets the second component of the pair to the
# sum of the map's elements
code { UNPAIR; SWAP; CAR;
       DIP 2 { PUSH @sum nat 0; };
       MAP { CDR; DIP {DUP}; ADD;
             DUP; DUG 2; DIP 2 { ADD @sum };
           };
       DIP { DROP; }; PAIR;
       NIL operation; PAIR; }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_mem_nat", () => {
        const src = `parameter nat;
storage (pair (map nat nat) (option bool)) ;
# stores (map, Some flag) where flag = parameter is a member of
# the map in first component of storage
code { UNPAIR;
       DIP { CAR; DUP };
       MEM; SOME; SWAP; PAIR; NIL operation; PAIR;}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_mem_string", () => {
        const src = `parameter string;
storage (pair (map string nat) (option bool)) ;
# stores (map, Some flag) where flag = parameter is a member of
# the map in first component of storage
code { UNPAIR;
       DIP { CAR; DUP };
       MEM; SOME; SWAP; PAIR; NIL operation; PAIR;}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("map_size", () => {
        const src = `parameter (map string nat);
storage nat;
code {CAR; SIZE; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("merge_comparable_pairs", () => {
        const src = `# tests that merging comparable pair types works
parameter (set (pair (nat %n) (pair %p (string %s) (int %i))));
storage nat;
code {UNPAIR;
      SWAP;
      PUSH nat 3;
      COMPARE;
      GT;
      IF {}
         {DROP;
          EMPTY_SET (pair nat (pair string int));};
      SIZE;
      NIL operation;
      PAIR;}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("mul", () => {
        const src = `parameter unit ;
storage unit ;
code { CAR ;
       DROP ;
       # tez-nat, no overflow
       PUSH nat 7987 ;
       PUSH mutez 10 ;
       MUL ;
       PUSH mutez 79870 ;
       COMPARE ;
       ASSERT_EQ ;
       # nat-tez, no overflow
       PUSH mutez 10 ;
       PUSH nat 7987 ;
       MUL ;
       PUSH mutez 79870 ;
       COMPARE ;
       ASSERT_EQ ;
       # int-int, no overflow
       PUSH int 10 ;
       PUSH int -7987 ;
       MUL ;
       PUSH int -79870 ;
       COMPARE ;
       ASSERT_EQ ;
       # int-nat, no overflow
       PUSH nat 10 ;
       PUSH int -7987 ;
       MUL ;
       PUSH int -79870 ;
       COMPARE ;
       ASSERT_EQ ;
       # nat-int, no overflow
       PUSH int -10 ;
       PUSH nat 7987 ;
       MUL ;
       PUSH int -79870 ;
       COMPARE ;
       ASSERT_EQ ;
       # nat-nat, no overflow
       PUSH nat 10 ;
       PUSH nat 7987 ;
       MUL ;
       PUSH nat 79870 ;
       COMPARE ;
       ASSERT_EQ ;

       UNIT ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("mul_overflow", () => {
        const src = `parameter (or unit unit) ;
storage unit ;
code { CAR ;
       IF_LEFT
         {
           PUSH nat 922337203685477580700 ;
           PUSH mutez 10 ;
           MUL ; # FAILURE
           DROP
         }
         {
           PUSH mutez 10 ;
           PUSH nat 922337203685477580700 ;
           MUL ; # FAILURE
           DROP
         } ;

       NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("neg", () => {
        const src = `parameter (or int nat);
storage int;
code {
       CAR;
       IF_LEFT {NEG} {NEG};
       NIL operation;
       PAIR
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

    it("none", () => {
        const src = `parameter unit;
storage (option nat);
code { DROP; NONE nat; NIL operation; PAIR; };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("noop", () => {
        const src = `parameter unit;
storage unit;
code {CDR; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("not", () => {
        const src = `parameter bool;
storage (option bool);
code {CAR; NOT; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("not_binary", () => {
        const src = `parameter (or int nat);
storage (option int);
code { CAR;
       IF_LEFT
         {
           NOT;
         }
         {
           NOT;
         } ;
       SOME; NIL operation ; PAIR
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

    it("or", () => {
        const src = `parameter (pair bool bool);
storage (option bool);
code {CAR; DUP; CAR; SWAP; CDR; OR; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("or_binary", () => {
        const src = `parameter (pair nat nat);
storage (option nat);
# This contract takes a pair of natural numbers as argument and
# stores the result of their binary OR.
code { CAR;
       UNPAIR;
       OR;
       SOME; NIL operation; PAIR
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

    it("packunpack", () => {
        const src = `parameter (pair (pair (pair string (list int)) (set nat)) bytes) ;
storage unit ;
code { CAR ; UNPAIR ; DIP { DUP } ;
       PACK ; ASSERT_CMPEQ ;
       UNPACK (pair (pair string (list int)) (set nat)) ; ASSERT_SOME ; DROP ;
       UNIT ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("packunpack_rev", () => {
        const src = `parameter (pair
             int
             (pair
                nat
                (pair
                   string
                   (pair bytes (pair mutez (pair bool (pair key_hash (pair timestamp address))))))));
storage unit ;
code { CAR;
       # Check the int
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK int; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the nat
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK nat; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the string
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK string; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the bytes
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK bytes; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the mutez
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK mutez; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the bool
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK bool; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the key_hash
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK key_hash; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the timestamp
       DUP; CAR; DIP { UNPAIR; }; PACK; UNPACK timestamp; ASSERT_SOME; ASSERT_CMPEQ;
       # Check the address
       DUP; PACK; UNPACK address; ASSERT_SOME; ASSERT_CMPEQ;

       # Assert failure modes of unpack
       PUSH int 0; PACK; UNPACK nat; ASSERT_SOME; DROP;
       PUSH int -1; PACK; UNPACK nat; ASSERT_NONE;

       # Try deserializing invalid byte sequence (no magic number)
       PUSH bytes 0x; UNPACK nat; ASSERT_NONE;
       PUSH bytes 0x04; UNPACK nat; ASSERT_NONE;

       # Assert failure for byte sequences that do not correspond to
       # any micheline value
       PUSH bytes 0x05; UNPACK nat; ASSERT_NONE;

       UNIT ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("packunpack_rev_cty", () => {
        const src = `parameter (pair key (pair unit (pair signature (pair (option signature) (pair (list unit) (pair (set bool) (pair (pair int int) (pair (or key_hash timestamp) (pair (map int string) (lambda string bytes))))))))));
storage unit ;
# for each uncomparable type t (we take an arbitrary parameter for
# parametric data-types e.g. pair, list),
# that is packable (which excludes big_map, operation, and contract)
# this contract receives a parameter v_t.
# it verifies that pack v_t == pack (unpack (pack v_t))
code { CAR;
       # packable uncomparable types
       # checking: key
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK key; ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: unit
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK unit; ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: signature
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (signature); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: option signature
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (option signature); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: list unit
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (list unit); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: set bool
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (set bool); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: pair int int
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (pair int int); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: or key_hash timestamp
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (or key_hash timestamp); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: map int string
       DUP; CAR; DIP { UNPAIR; }; PACK; DIP { PACK; UNPACK (map int string); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;
       # checking: lambda string bytes
       DUP; PACK; DIP { PACK; UNPACK (lambda string bytes); ASSERT_SOME; PACK; }; ASSERT_CMPEQ;

       UNIT ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("pair_id", () => {
        const src = `parameter (pair bool bool);
storage (option (pair bool bool));
code {CAR; SOME; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("pexec", () => {
        const src = `parameter nat;
storage nat;
code {
      LAMBDA (pair nat nat) nat
             {UNPAIR ; ADD};
      SWAP; UNPAIR ; DIP { APPLY } ; EXEC ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("pexec_2", () => {
        const src = `parameter int;
storage (list int);
code {
      UNPAIR @p @s ; # p :: s
      LAMBDA (pair int (pair int int)) int
             { UNPAIR ; DIP { UNPAIR } ; ADD ; MUL }; # l :: p :: s
      SWAP ; APPLY ; # l :: s
      PUSH int 3 ; APPLY ; # l :: s
      SWAP ; MAP { DIP { DUP } ; EXEC } ; # s :: l
      DIP { DROP } ; # s
      NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("proxy", () => {
        const src = `/* This proxy contract transfers the received amount to the contract given as parameter.
   It is used to test the SOURCE and SENDER opcodes; see source.tz and sender.tz. */
parameter (contract unit) ;
storage unit ;
code{
      UNPAIR;
      AMOUNT ;
      UNIT ;
      TRANSFER_TOKENS;
      DIP {NIL operation} ;
      CONS;
      PAIR
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

    it("ret_int", () => {
        const src = `parameter unit;
storage (option nat);
code {DROP; PUSH nat 300; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("reverse", () => {
        const src = `parameter (list string);
storage (list string);
code { CAR; NIL string; SWAP;
       ITER {CONS};
       NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("reverse_loop", () => {
        const src = `parameter (list string);
storage (list string);
code { CAR; NIL string; SWAP; PUSH bool True;
       LOOP { IF_CONS {SWAP; DIP{CONS}; PUSH bool True} {NIL string; PUSH bool False}};
       DROP; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("self", () => {
        const src = `parameter unit ;
storage address ;
code { DROP ; SELF ; ADDRESS ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("self_with_default_entrypoint", () => {
        const src = `parameter (or (or (nat %A) (bool %B)) (or %maybe_C (unit %default) (string %C)));
storage unit;
code {
       DROP;
       SELF; DROP;
       # Refers to entrypoint A of the current contract.
       SELF %A; DROP;
       # Refers to the default entry of the current contract
       SELF %default; PACK;
       # "SELF" w/o annotation also refers to the default
       # entry of the current contract. Internally, they are equal.
       SELF; PACK; ASSERT_CMPEQ;
       # The following instruction would not typecheck:
       #    SELF %D,
       # since there is no entrypoint D.
       UNIT;
       NIL operation;
       PAIR;
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

    it("self_with_entrypoint", () => {
        const src = `parameter (or (or (nat %A) (bool %B)) (or %maybe_C (unit %Z) (string %C)));
storage unit;
code {
       DROP;
       # Refers to entrypoint A of the current contract.
       SELF %A; PACK @Apacked;
       # Refers to the default entry of the current contract
       SELF %default; PACK @defpacked; DUP; DIP { SWAP }; ASSERT_CMPNEQ;
       # "SELF" w/o annotation also refers to the default
       # entry of the current contract
       SELF; PACK @selfpacked; ASSERT_CMPEQ;

       # Verify the types of the different entrypoints.  CAST is noop
       # if its argument is convertible with the type of the top of
       # the stack.
       SELF %A; CAST (contract nat); DROP;
       SELF %B; CAST (contract bool); DROP;
       SELF %maybe_C; CAST (contract (or (unit) (string))); DROP;
       SELF %Z; CAST (contract unit); DROP;
       SELF; CAST (contract (or (or (nat %A) (bool %B)) (or %maybe_C (unit %Z) (string %C)))); DROP;
       SELF %default; CAST (contract (or (or (nat %A) (bool %B)) (or %maybe_C (unit %Z) (string %C)))); DROP;

       UNIT;
       NIL operation;
       PAIR;
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

    it("sender", () => {
        const src = `parameter unit ;
storage address ;
code{
      DROP ;
      SENDER;
      NIL operation ;
      PAIR
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

    it("set_car", () => {
        const src = `parameter string;
storage (pair (string %s) (nat %n));
code { DUP; CDR; DIP{CAR}; SET_CAR %s; NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("set_cdr", () => {
        const src = `parameter nat;
storage (pair (string %s) (nat %n));
code { DUP; CDR; DIP{CAR}; SET_CDR %n; NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("set_delegate", () => {
        const src = `parameter (option key_hash);
storage unit;
code {
       UNPAIR;
       SET_DELEGATE;
       DIP {NIL operation};
       CONS;
       PAIR
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

    it("set_id", () => {
        const src = `parameter (set string);
storage (set string);
code { CAR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("set_iter", () => {
        const src = `parameter (set int);
storage int;
code { CAR; PUSH int 0; SWAP; ITER { ADD }; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("set_member", () => {
        const src = `parameter string;
storage (pair (set string) (option bool));
code {DUP; DUP; CAR; DIP{CDAR}; MEM; SOME; DIP {CDAR}; SWAP; PAIR ; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("set_size", () => {
        const src = `parameter (set int);
storage nat;
code {CAR; SIZE; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("shifts", () => {
        const src = `parameter (or (pair nat nat) (pair nat nat));
storage (option nat);
# this contract takes either (Left a b) and stores (a << b)
# or (Right a b) and stores (a >> b).
# i.e., in the first case, the first component shifted to the left by
# the second, and the second case, component shifted to the right by
# the second.
code { CAR;
       IF_LEFT {
                 UNPAIR; LSL;
               }
               {
                 UNPAIR; LSR;
               };
       SOME;
       NIL operation;
       PAIR;
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

    it("slice", () => {
        const src = `parameter (pair nat nat);
storage (option string);
code { UNPAIR; SWAP;
       IF_SOME {SWAP; UNPAIR; SLICE;} {DROP; NONE string;};
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("slice_bytes", () => {
        const src = `parameter (pair nat nat);
storage (option bytes);
code { UNPAIR; SWAP;
       IF_SOME {SWAP; UNPAIR; SLICE;} {DROP; NONE bytes;};
       NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("slices", () => {
        const src = `parameter (pair bytes signature) ;
storage key ;
code { DUP ;
       CAAR ; DUP ; SIZE ; PUSH nat 128 ; SWAP ; SUB ; ISNAT ; IF_SOME {} { FAIL } ;
       PUSH nat 128 ; SLICE @payload ; ASSERT_SOME ;
       DUP ; DIP { DIP { DUP ; CAAR ; PUSH nat 32 ; PUSH nat 0 ; SLICE ; ASSERT_SOME } ; SHA256 ; ASSERT_CMPEQ } ;
       DUP ; DIP { DIP { DUP ; CAAR ; PUSH nat 32 ; PUSH nat 32 ; SLICE ; ASSERT_SOME } ; BLAKE2B ; ASSERT_CMPEQ } ;
       DUP ; DIP { DIP { DUP ; CAAR ; PUSH nat 64 ; PUSH nat 64 ; SLICE ; ASSERT_SOME } ; SHA512 ; ASSERT_CMPEQ } ;
       DIP { DUP ; CDR ; DIP { DUP ; CADR }} ; SWAP ; DIP { SWAP } ; CHECK_SIGNATURE ; ASSERT ;
       CDR ; DUP ; HASH_KEY ; IMPLICIT_ACCOUNT ; BALANCE ; UNIT ; TRANSFER_TOKENS ;
       NIL operation ; SWAP ; CONS ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("source", () => {
        const src = `parameter unit ;

storage address ;

code{
      DROP ;
      SOURCE;
      NIL operation ;
      PAIR
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

    it("split_bytes", () => {
        const src = `parameter bytes ;
storage (list bytes) ;
code { UNPAIR ;
       DIP { NIL bytes ; SWAP ; ITER { CONS } } ;
       DUP ; SIZE ; PUSH nat 0 ; CMPNEQ ;
       DIP { PUSH @index nat 0 } ;
       LOOP
         { PAIR ; DUP ;
           DIP { UNPAIR ; DIP { PUSH nat 1 } ; SLICE ; ASSERT_SOME ; CONS @storage } ;
           UNPAIR ;
           PUSH nat 1 ; ADD @index ;
           DUP ; DIP { DIP { DUP } ; SWAP ; SIZE ; CMPNEQ } ; SWAP ;
         } ;
       DROP ; DROP ;
       NIL bytes ; SWAP ; ITER { CONS } ;
       NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("split_string", () => {
        const src = `parameter string ;
storage (list string) ;
code { UNPAIR ;
       DIP { NIL string ; SWAP ; ITER { CONS } } ;
       DUP ; SIZE ; PUSH nat 0 ; CMPNEQ ;
       DIP { PUSH @index nat 0 } ;
       LOOP
         { PAIR ; DUP ;
           DIP { UNPAIR ; DIP { PUSH nat 1 } ; SLICE ; ASSERT_SOME ; CONS @storage } ;
           UNPAIR ;
           PUSH nat 1 ; ADD @index ;
           DUP ; DIP { DIP { DUP } ; SWAP ; SIZE ; CMPNEQ } ; SWAP ;
         } ;
       DROP ; DROP ;
       NIL string ; SWAP ; ITER { CONS } ;
       NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("store_input", () => {
        const src = `parameter string;
storage string;
code {CAR; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("store_now", () => {
        const src = `parameter unit;
storage timestamp;
code {DROP; NOW; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("str_id", () => {
        const src = `parameter string;
storage (option string);
code { CAR ; SOME ; NIL operation ; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("sub_timestamp_delta", () => {
        const src = `parameter (pair timestamp int);
storage timestamp;
code { CAR; DUP; CAR; DIP{CDR}; SUB; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("subset", () => {
        const src = `parameter (pair (set string) (set string));
storage bool;
code { CAR; DUP; CDR; DIP{CAR}; # Unpack lists
       PUSH bool True;
       PAIR; SWAP;              # Setup accumulator
       ITER { DIP{ DUP; DUP; CDR;
                   DIP{CAR; DIP{CDR}}};
              MEM;            # Check membership
              AND;            # Combine accumulator and input
              PAIR};
       CAR;                     # Get the accumulator value
       NIL operation; PAIR}     # Calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("tez_add_sub", () => {
        const src = `parameter (pair mutez mutez);
storage (option (pair mutez mutez));
code {CAR; DUP; DUP; CAR; DIP{CDR}; ADD;
      DIP{DUP; CAR; DIP{CDR}; SUB};
      PAIR; SOME; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("transfer_amount", () => {
        const src = `parameter unit;
storage mutez;
code { DROP; AMOUNT; NIL operation; PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("transfer_tokens", () => {
        const src = `parameter (contract unit);
storage unit;
code { CAR; DIP{UNIT}; PUSH mutez 100000000; UNIT;
       TRANSFER_TOKENS;
       NIL operation; SWAP; CONS; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("update_big_map", () => {
        const src = `storage (pair (big_map string string) unit);
parameter (map string (option string));
# this contract the stored big_map according to the map taken in parameter
code { UNPAPAIR;
       ITER { UNPAIR; UPDATE; } ;
       PAIR; NIL operation; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("xor", () => {
        const src = `parameter (or (pair bool bool) (pair nat nat));
storage (option (or bool nat));
code {
       CAR;
       IF_LEFT
         {
           UNPAIR; XOR; LEFT nat
         }
         {
           UNPAIR; XOR; RIGHT bool
         } ;
       SOME; NIL operation ; PAIR
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
});
