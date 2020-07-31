import { Contract } from "../src/michelson-contract";
import { MichelsonError, formatError } from "../src/utils";
import { inspect } from "util";

describe('Typecheck mini scenarios', () => {
    it("authentication", () => {
        const src = `/*
    
    This contract is an example of using a cryptographic signature to
    handle authentication. A public key is stored, and only the owner of
    the secret key associated to this public key can interact with the
    contract. She is allowed to perform any list of operations by sending
    them wrapped in a lambda to the contract with a cryptographic
    signature.
    
    To ensure that each signature is used only once and is not replayed by
    an attacker, not only the lambda is signed but also the unique
    identifier of the contract (a pair of the contract address and the
    chain id) and a counter that is incremented at each successful call.
    
    More precisely, the signature should check against pack ((chain_id,
    self) (param, counter)).
    
    */
    parameter (pair (lambda unit (list operation)) signature);
    storage (pair (nat %counter) key);
    code
      {
        UNPPAIPAIR;
        DUUUP; DUUP ; SELF; CHAIN_ID ; PPAIPAIR; PACK;
        DIP { SWAP }; DUUUUUP ; DIP { SWAP };
        DUUUP; DIP {CHECK_SIGNATURE}; SWAP; IF {DROP} {FAILWITH};
        UNIT; EXEC;
        DIP { PUSH nat 1; ADD };
        PAPAIR
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

    it("big_map_magic", () => {
        const src = `# this contracts handles two big_maps
    storage
      (or (pair (big_map string string) (big_map string string)) unit) ;
    parameter
      # it has 5 entry points
      # swap: swaps the two maps.
      (or (unit %swap)
         # reset: resets storage, either to a new pair of maps, or to unit
          (or (or %reset (pair (big_map string string) (big_map string string)) unit)
              # import: drops the existing storage and creates two maps
              # from the given lists of string pairs.
              (or (pair %import (list (pair string string)) (list (pair string string)))
                  # add: adds the given list of key - value pairs into the
                  # first map
                  (or (list %add (pair string string))
                      # rem: removes the given list of key - value pairs
                      # from the first map
                      (list %rem string))))) ;
    code { UNPAIR ;
           IF_LEFT
             { DROP ; ASSERT_LEFT ; UNPAIR ; SWAP ; PAIR ; LEFT unit }
             { IF_LEFT
                 { SWAP ; DROP }
                 { IF_LEFT
                     { DIP { ASSERT_RIGHT ; DROP } ;
                       UNPAIR ;
                       DIP { EMPTY_BIG_MAP string string } ;
                       ITER { UNPAIR ; DIP { SOME } ; UPDATE } ;
                       SWAP ;
                       DIP { EMPTY_BIG_MAP string string } ;
                       ITER { UNPAIR ; DIP { SOME } ; UPDATE } ;
                       SWAP ;
                       PAIR ; LEFT unit }
                     { IF_LEFT
                         { DIP { ASSERT_LEFT ; UNPAIR } ;
                           ITER { UNPAIR ; DIP { SOME } ; UPDATE } ;
                           PAIR ; LEFT unit }
                         { DIP { ASSERT_LEFT ; UNPAIR } ;
                           ITER { DIP { NONE string } ; UPDATE } ;
                           PAIR ; LEFT unit } }} } ;
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

    it("create_contract", () => {
        const src = `/*
    - param: None:
    
      Create a contract then perform a recursive call on Some [addr] where
      [addr] is the address of the newly created contract.
    
      The created contract simply stores its parameter (a string).  It is
      initialized with the storage "dummy" and has an initial balance of
      100tz. It has no delegate so these 100tz are totally frozen.
    
    - param: Some [addr]:
    
      Check that the sender is self, call the contract at address [addr]
      with param "abcdefg" transferring 0tz.
    
    */
    parameter (option address) ;
    storage unit ;
    code { CAR ;
           IF_NONE
             { PUSH string "dummy" ;
               PUSH mutez 100000000 ; NONE key_hash ;
               CREATE_CONTRACT
                 { parameter string ;
                   storage string ;
                   code { CAR ; NIL operation ; PAIR } } ;
               DIP { SOME ; DIP { SELF ; PUSH mutez 0 } ; TRANSFER_TOKENS ;
                     NIL operation ; SWAP ; CONS } ;
               CONS ; UNIT ; SWAP ; PAIR }
             { SELF ; ADDRESS ; SENDER ; IFCMPNEQ { FAIL } {} ;
               CONTRACT string ; IF_SOME {} { FAIL } ;
               PUSH mutez 0 ; PUSH string "abcdefg" ; TRANSFER_TOKENS ;
               NIL operation; SWAP; CONS ; UNIT ; SWAP ; PAIR } } ;`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("create_contract_simple", () => {
        const src = `parameter unit;
    storage unit;
    code { CAR;
           PUSH string "foo";
           PUSH mutez 0;
           NONE key_hash;
           CREATE_CONTRACT
             { parameter string ;
               storage string ;
               code { CAR ; NIL operation ; PAIR } } ;
           DROP; DROP;
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

    it("default_account", () => {
        const src = `/*
    Send 100 tz to the implicit account given as parameter.
    */
    
    parameter key_hash;
    storage unit;
    code {DIP{UNIT}; CAR; IMPLICIT_ACCOUNT;
          PUSH mutez 100000000; UNIT; TRANSFER_TOKENS;
          NIL operation; SWAP; CONS; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("hardlimit", () => {
        const src = `parameter unit ;
    storage int ;
    code { # This contract stops accepting transactions after N incoming transactions
           CDR ; DUP ; PUSH int 0 ; CMPLT; IF {PUSH int -1 ; ADD} {FAIL};
           NIL operation ; PAIR} ;`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("lockup", () => {
        const src = `parameter unit;
    storage (pair timestamp (pair mutez address));
    code { CDR;                      # Ignore the parameter
           DUP;                      # Duplicate the storage
           CAR;                      # Get the timestamp
           NOW;                      # Push the current timestamp
           CMPLT;                    # Compare to the current time
           IF {FAIL} {};             # Fail if it is too soon
           DUP;                      # Duplicate the storage value
           # this must be on the bottom of the stack for us to call transfer tokens
           CDR;                      # Ignore the timestamp, focussing in on the transfer data
           DUP;                      # Duplicate the transfer information
           CAR;                      # Get the amount of the transfer on top of the stack
           DIP{CDR};                 # Put the contract underneath it
           DIP { CONTRACT unit ; ASSERT_SOME } ;
           UNIT;                     # Put the contract's argument type on top of the stack
           TRANSFER_TOKENS;          # Emit the transfer
           NIL operation; SWAP; CONS;# Make a singleton list of internal operations
           PAIR}                     # Pair up to meet the calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("multiple_en2", () => {
        const src = `{ parameter unit ;
      storage (option address) ;
      code { SENDER ;
             SELF ;
             ADDRESS ;
             { COMPARE ;
               EQ ;
               IF { CDR ;
                    { IF_NONE { { UNIT ; FAILWITH } } {} } ;
                    DIP { NIL operation } ;
                    DUP ;
                    CONTRACT %add unit ;
                    { IF_NONE {} { { UNIT ; FAILWITH } } } ;
                    DUP ;
                    CONTRACT %fact nat ;
                    { IF_NONE {} { { UNIT ; FAILWITH } } } ;
                    DUP ;
                    CONTRACT %add nat ;
                    { IF_NONE { { UNIT ; FAILWITH } } {} } ;
                    PUSH mutez 0 ;
                    PUSH nat 12 ;
                    TRANSFER_TOKENS ;
                    SWAP ;
                    DIP { CONS } ;
                    DUP ;
                    CONTRACT unit ;
                    { IF_NONE { { UNIT ; FAILWITH } } {} } ;
                    PUSH mutez 0 ;
                    PUSH unit Unit ;
                    TRANSFER_TOKENS ;
                    SWAP ;
                    DIP { CONS } ;
                    DUP ;
                    CONTRACT %sub nat ;
                    { IF_NONE { { UNIT ; FAILWITH } } {} } ;
                    PUSH mutez 0 ;
                    PUSH nat 3 ;
                    TRANSFER_TOKENS ;
                    SWAP ;
                    DIP { CONS } ;
                    DUP ;
                    CONTRACT %add nat ;
                    { IF_NONE { { UNIT ; FAILWITH } } {} } ;
                    PUSH mutez 0 ;
                    PUSH nat 5 ;
                    TRANSFER_TOKENS ;
                    SWAP ;
                    DIP { CONS } ;
                    DROP ;
                    DIP { NONE address } ;
                    PAIR }
                  { CAR ;
                    DUP ;
                    DIP { DIP { PUSH int 0 ; PUSH mutez 0 ; NONE key_hash } ;
                          DROP ;
                          CREATE_CONTRACT
                            { parameter (or (or (nat %add) (nat %sub)) (unit %default)) ;
                              storage int ;
                              code { AMOUNT ;
                                     PUSH mutez 0 ;
                                     { { COMPARE ; EQ } ; IF {} { { UNIT ; FAILWITH } } } ;
                                     { { DUP ; CAR ; DIP { CDR } } } ;
                                     IF_LEFT
                                       { IF_LEFT { ADD } { SWAP ; SUB } }
                                       { DROP ; DROP ; PUSH int 0 } ;
                                     NIL operation ;
                                     PAIR } } } ;
                    DIP { SELF ; PUSH mutez 0 } ;
                    TRANSFER_TOKENS ;
                    NIL operation ;
                    SWAP ;
                    CONS ;
                    SWAP ;
                    CONS ;
                    DIP { SOME } ;
                    PAIR } }
           } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("multiple_entrypoints_counter", () => {
        const src = `{ parameter unit ;
      storage (option address) ;
      code { SENDER ; SELF ; ADDRESS ;
             IFCMPEQ
               { CDR ; ASSERT_SOME ;
                 DIP { NIL operation } ;
                 DUP ; CONTRACT %add unit ; ASSERT_NONE ;
                 DUP ; CONTRACT %fact nat ; ASSERT_NONE ;
                 DUP ; CONTRACT %add nat ; ASSERT_SOME ; PUSH mutez 0 ; PUSH nat 12 ; TRANSFER_TOKENS ; SWAP ; DIP { CONS } ;
                 DUP ; CONTRACT unit ; ASSERT_SOME ; PUSH mutez 0 ; PUSH unit Unit ; TRANSFER_TOKENS ; SWAP ; DIP { CONS } ;
                 DUP ; CONTRACT %sub nat ; ASSERT_SOME ; PUSH mutez 0 ; PUSH nat 3 ; TRANSFER_TOKENS ; SWAP ; DIP { CONS } ;
                 DUP ; CONTRACT %add nat ; ASSERT_SOME ; PUSH mutez 0 ; PUSH nat 5 ; TRANSFER_TOKENS ; SWAP ; DIP { CONS } ;
                 DROP ; DIP { NONE address } ; PAIR }
               { CAR ; DUP ;
                 DIP
                   { DIP { PUSH int 0 ; PUSH mutez 0 ; NONE key_hash } ;
                     DROP ;
                     CREATE_CONTRACT
                       { parameter (or (or (nat %add) (nat %sub)) (unit %default)) ;
                         storage int ;
                         code { AMOUNT ; PUSH mutez 0 ; ASSERT_CMPEQ ;
                                UNPAIR ;
                                IF_LEFT
                                  { IF_LEFT { ADD } { SWAP ; SUB } }
                                  { DROP ; DROP ; PUSH int 0 } ;
                                NIL operation ; PAIR } } } ;
                 DIP { SELF ; PUSH mutez 0 } ; TRANSFER_TOKENS ;
                 NIL operation ; SWAP ; CONS ; SWAP ; CONS ;
                 DIP { SOME } ; PAIR } } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("parameterized_multisig", () => {
        const src = `storage (pair bool (pair (map nat (pair bool bool)) (pair key key)));
    parameter (or nat (pair signature nat));
    code { DUP; CAR; DIP{CDDR};       # Stack tangling
           IF_LEFT { DIP{DUP; CAR}; GET; # Get the value stored for that index
                     IF_NONE { PUSH bool False} # If not referenced, reject
                             { DUP; CAR; DIP{CDR}; AND};
                     PAIR}
                   { DUP; CAR; DIP{CDR; DUP; PACK ; BLAKE2B}; PAIR; SWAP; # Create the signature pair
                     DIP{ DIP{DUP; CDR; DIP{CAR}; DUP};
                          SWAP; CAR; DIP{DUP; UNPAIR}; CHECK_SIGNATURE }; # Check the first signature
                     SWAP;
                     # If the signature typechecked, get and update the first element of the pair
                     IF { DIP{DROP; SWAP; DUP}; DUP;
                          DIP{ GET; IF_NONE{PUSH (pair bool bool) (Pair False False)} {};
                               CDR; PUSH bool True; PAIR; SOME }}
                        # Check the second signature
                        { DIP{DIP{DUP; CDR}; SWAP; DIP {UNPAIR}; CHECK_SIGNATURE}; SWAP;
                          IF { DUP; DIP{DIP{SWAP; DUP}; GET}; SWAP;
                               IF_NONE {PUSH (pair bool bool) (Pair False False)} {};
                               CAR; PUSH bool True; SWAP; PAIR; SOME; SWAP}
                             {FAIL}};
                     # Update the stored value and finish off
                     UPDATE; PAIR; PUSH bool False; PAIR};
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

    it("replay", () => {
        const src = `# This contract always fail because it tries to execute twice the same operation
    parameter unit ;
    storage unit ;
    code { CDR ; NIL operation ;
           SELF ; PUSH mutez 0 ; UNIT ; TRANSFER_TOKENS ;
           DUP ; DIP { CONS } ; CONS ;
           PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("reveal_signed_preimage", () => {
        const src = `parameter (pair bytes signature) ;
    storage (pair bytes key) ;
    code {
           #check that sha256(param.bytes) == storage.bytes
           DUP ; UNPAIR ; CAR; SHA256; DIP { CAR } ; ASSERT_CMPEQ ;
    
           # check that the sig is a valid signature of the preimage
           DUP ; UNPAIR ; SWAP ; DIP { UNPAIR ; SWAP } ; CDR ; CHECK_SIGNATURE ; ASSERT ;
    
           # send all our tokens to the implicit account corresponding to the stored public key
           CDR ; DUP ; CDR ; HASH_KEY ; IMPLICIT_ACCOUNT ;
           BALANCE ; UNIT ; TRANSFER_TOKENS ;
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

    it("vote_for_delegate", () => {
        const src = `parameter (option key_hash) ;
    storage (pair
               (pair %mgr1 (address %addr) (option %key key_hash))
               (pair %mgr2 (address %addr) (option %key key_hash))) ;
    code { # Update the storage
           DUP ; CDAAR %addr @%; SENDER ; PAIR %@ %@; UNPAIR;
           IFCMPEQ
             { UNPAIR ; SWAP ; SET_CADR %key @changed_mgr1_key }
             { DUP ; CDDAR ; SENDER ;
               IFCMPEQ
                 { UNPAIR ; SWAP ; SET_CDDR %key }
                 { FAIL } } ;
           # Now compare the proposals
           DUP ; CADR ;
           DIP { DUP ; CDDR } ;
           IF_NONE
             { IF_NONE
                 { NONE key_hash ;
                   SET_DELEGATE ; NIL operation ; SWAP ; CONS }
                 { DROP ; NIL operation } }
             { SWAP ;
               IF_SOME
                 { DIP { DUP } ;
                   IFCMPEQ
                     { SOME ;
                       SET_DELEGATE ; NIL operation ; SWAP ; CONS }
                     { DROP ;
                       NIL operation }}
                 { DROP ; NIL operation }} ;
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

    it("weather_insurance", () => {
        const src = `parameter (pair (signature %signed_weather_data) (nat :rain %actual_level));
    # (pair (under_key over_key) (pair weather_service_key (pair rain_level days_in_future)))
    storage (pair (pair (address %under_key)
                        (address %over_key))
                  (pair (nat :rain %rain_level) (key %weather_service_key)));
    code { DUP; DUP;
           CAR; MAP_CDR{PACK ; BLAKE2B};
           SWAP; CDDDR %weather_service_key;
           DIP {UNPAIR} ; CHECK_SIGNATURE @sigok; # Check if the data has been correctly signed
           ASSERT; # If signature is not correct, end the execution
           DUP; DUP; DUP; DIIIP{CDR %storage}; # Place storage type on bottom of stack
           DIIP{CDAR};                # Place contracts below numbers
           DIP{CADR %actual_level};   # Get actual rain
           CDDAR %rain_level;         # Get rain threshold
           CMPLT; IF {CAR %under_key} {CDR %over_key};     # Select contract to receive tokens
           CONTRACT unit ; ASSERT_SOME ;
           BALANCE; UNIT ; TRANSFER_TOKENS @trans.op; # Setup and execute transfer
           NIL operation ; SWAP ; CONS ;
           PAIR };`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("xcat", () => {
        const src = `parameter (bytes);
    storage (unit);
    code {
           # Extract parameter from initial stack.
           CAR @preimage;
           DIP {
                 # Push contract constants to the stack.
                 #
                 # There's a temptation to use @storage to parametrize
                 # a contract but, in general, there's no reason to encumber
                 # @storage with immutable values.
                 PUSH @from key_hash "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"; #changeme
                 IMPLICIT_ACCOUNT ;
                 PUSH @to   key_hash "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"; #changeme
                 IMPLICIT_ACCOUNT ;
                 PUSH @target_hash bytes 0x123456; #changeme
                 PUSH @deadline timestamp "2018-08-08 00:00:00Z"; #changeme
               };
           # Test if the deadline has passed.
           SWAP; NOW;
           IFCMPLT
             # In case the deadline did pass:
             {
               # Ignore parameter, just transfer xtz balance back to @from
               DROP; DROP; DROP; BALANCE; UNIT; TRANSFER_TOKENS;
             }
             # In case the deadline hasn't passed yet:
             {
               # Test length of parameter.
               DUP; SIZE;
               PUSH @max_length nat 32;
               IFCMPLT
                 { PUSH string "preimage too long"; FAILWITH; }
                 {
                   # Test if it's a preimage of @target_hash.
                   SHA256 @candidate_hash;
                   IFCMPNEQ
                     { PUSH string "invalid preimage"; FAILWITH; }
                     {
                       # Transfer xtz balance to @to.
                       BALANCE; UNIT; TRANSFER_TOKENS; DIP { DROP };
                     };
                 };
             };
           # Transform single operation into a list.
           NIL operation; SWAP; CONS;
           UNIT; SWAP; PAIR
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

    it("xcat_dapp", () => {
        const src = `parameter (or
                 # First possible action is funding, to create an xcat
                 (pair %fund
                    (address %dest)
                    (pair %settings (bytes %target_hash) (timestamp %deadline)))
    
                 # Other possible action is to claim the tokens (or ask a refund)
                 (or %claim_refund
                    (bytes %preimage_claim)
                    (bytes %refund_hash)));
    
    storage (pair
               (big_map
                  bytes # The target hash is used as a key
                  (pair
                     # We store in %from the person who funded the xcat
                     (pair %recipients (address %from) (address %dest))
                     (pair %settings (mutez %amount) (timestamp %deadline)))
               )
               unit);
    
    code {
           NIL @operations operation; SWAP;
           UNPAPAIR @% @% @%; DIP {DUP};
           IF_LEFT  # Let's fund a new xcat!
             {
               # Unpack the parameters
               UNPAIR @% @%;
               # Assert that the destination address is of type unit.
               # This costs a bit more gas but limits foot-shooting.
               DUP; CONTRACT @dest unit; ASSERT_SOME; DROP;
               SWAP; UNPAIR @% @%;
               DIP
                 {
                   AMOUNT @amount;
                   SENDER;
                   DUP; CONTRACT @from unit; ASSERT_SOME; DROP;
                   DIP { PAIR; SWAP; }; PAIR; PAIR; SOME @xcat;
                   SWAP;
                 };
               DUP; DIP { MEM; NOT; ASSERT }; # Assert that this target hash isn't already in the map
               UPDATE; PAIR @new_storage; SWAP; PAIR;
             }
             {
               # Let's process a claim or a refund
               IF_LEFT
                 { # It's a claim!
                   DUP; SIZE; PUSH nat 32; ASSERT_CMPGE;
                   SHA256 @hash; DUP; DIP {SWAP};
                   DIIP {
                          GET; ASSERT_SOME;
                          # Check deadline and prepare transaction.
                          DUP; CADR @%; CONTRACT @dest unit; ASSERT_SOME;
                          SWAP; CDR @%;
                          UNPAIR @% @%; SWAP;
                          # The deadline must not have passed
                          NOW; ASSERT_CMPLT;
                          # prepare transaction
                          UNIT; TRANSFER_TOKENS;
                        };
                 }
                 { # It's a refund!
                   DUP;
                   DIP
                     {
                       GET; ASSERT_SOME;
                       DUP; CAAR @%; CONTRACT @from unit; ASSERT_SOME; SWAP; CDR;
                       UNPAIR @% @%; SWAP;
                       # The deadline must not HAVE passed
                       NOW; ASSERT_CMPGE;
                       UNIT; TRANSFER_TOKENS; SWAP;
                     };
                 };
               # Clear the big map
               NONE @none (pair (pair address address) (pair mutez timestamp));
               SWAP; UPDATE @cleared_map; SWAP; DIP { PAIR; SWAP };
               CONS; PAIR;
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
});

