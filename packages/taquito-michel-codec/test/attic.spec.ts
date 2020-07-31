import { Contract } from "../src/michelson-contract";
import { MichelsonError } from "../src/utils";
import { inspect } from "util";

describe('Typecheck attic', () => {
    it("accounts", () => {
        const src = `# This is a very simple accounts system.
# (Left key) initializes or deposits into an account
# (Right key (pair mutez (signed mutez))) withdraws mutez amount to a
# IMPLICIT_ACCOUNT created from the key if the balance is available
# and the key is correctly signed
parameter (or (key_hash %Initialize)
              (pair     %Withdraw
                 (key %from)
                 (pair
                    (mutez     %withdraw_amount)
                    (signature %sig))));
# Maps the key to the balance they have stored
storage (map :stored_balance key_hash mutez);
code { DUP; CAR;
       # Deposit into account
       IF_LEFT { DUP; DIIP{ CDR %stored_balance; DUP };
                 DIP{ SWAP }; GET @opt_prev_balance;
                 # Create the account
                 IF_SOME # Add to an existing account
                   { RENAME @previous_balance;
                     AMOUNT; ADD; SOME; SWAP; UPDATE; NIL operation; PAIR }
                   { DIP{ AMOUNT; SOME }; UPDATE; NIL operation; PAIR }}
               # Withdrawal
               { DUP; DUP; DUP; DUP;
                 # Check signature on data
                 CAR %from;
                 DIIP{ CDAR %withdraw_amount; PACK ; BLAKE2B @signed_amount };
                 DIP{ CDDR %sig }; CHECK_SIGNATURE;
                 IF {} { PUSH string "Bad signature"; FAILWITH };
                 # Get user account information
                 DIIP{ CDR %stored_balance; DUP };
                 CAR %from; HASH_KEY @from_hash; DUP; DIP{ DIP { SWAP }; SWAP}; GET;
                 # Account does not exist
                 IF_NONE { PUSH string "Account does not exist"; PAIR; FAILWITH }
                         # Account exists
                         { RENAME @previous_balance;
                           DIP { DROP };
                           DUP; DIIP{ DUP; CDAR %withdraw_amount; DUP };
                           # Ensure funds are available
                           DIP{ CMPLT @not_enough }; SWAP;
                           IF { PUSH string "Not enough funds"; FAILWITH }
                              { SUB @new_balance; DIP{ DUP; DIP{ SWAP }}; DUP;
                                # Delete account if balance is 0
                                PUSH @zero mutez 0; CMPEQ @null_balance;
                                IF { DROP; NONE @new_balance mutez }
                                   # Otherwise update storage with new balance
                                   { SOME @new_balance };
                                SWAP; CAR %from; HASH_KEY @from_hash; UPDATE;
                                SWAP; DUP; CDAR %withdraw_amount;
                                # Execute the transfer
                                DIP{ CAR %from; HASH_KEY @from_hash; IMPLICIT_ACCOUNT @from_account}; UNIT;
                                TRANSFER_TOKENS @withdraw_transfer_op;
                                NIL operation; SWAP; CONS;
                                PAIR }}}}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("add1", () => {
        const src = `parameter int;
storage int;
code {CAR;                      # Get the parameter
      PUSH int 1;               # We're adding 1, so we need to put 1 on the stack
      ADD;                      # Add the two numbers
      NIL operation;            # We put an empty list of operations on the stack
      PAIR}                     # Create the end value`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("add1_list", () => {
        const src = `parameter (list int);
storage (list int);
code { CAR;                                # Get the parameter
       MAP { PUSH int 1; ADD };            # Map over the list adding one
       NIL operation;                      # No internal op
       PAIR }                              # Match the calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("after_strategy", () => {
        const src = `parameter nat;
storage (pair (pair nat bool) timestamp);
code {DUP; CAR; DIP{CDDR; DUP; NOW; CMPGT}; PAIR; PAIR ; NIL operation ; PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("always", () => {
        const src = `parameter nat;
storage (pair nat bool);
code { CAR; PUSH bool True; SWAP;
       PAIR; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("append", () => {
        const src = `parameter (pair (list int) (list int));
storage (list int);
code { CAR; UNPAIR  ; # Unpack lists
       NIL int; SWAP; # Setup reverse accumulator
       ITER {CONS};   # Reverse list
       ITER {CONS};   # Append reversed list
       NIL operation;
       PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("at_least", () => {
        const src = `parameter unit;
storage mutez;                    # How much you have to send me
code {CDR; DUP;                 # Get the amount required (once for comparison, once to save back in storage)
      AMOUNT; CMPLT;            # Check to make sure no one is wasting my time
      IF {FAIL}                 # Reject the person
         {NIL operation;PAIR}}  # Finish the transaction`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("auction", () => {
        const src = `parameter key_hash;
storage (pair timestamp (pair mutez key_hash));
code { DUP; CDAR; DUP; NOW; CMPGT; IF {FAIL} {}; SWAP; # Check if auction has ended
       DUP; CAR; DIP{CDDR}; AMOUNT; PAIR; SWAP; DIP{SWAP; PAIR}; # Setup replacement storage
       DUP; CAR; AMOUNT; CMPLE; IF {FAIL} {};  # Check to make sure that the new amount is greater
       DUP; CAR;                               # Get amount of refund
       DIP{CDR; IMPLICIT_ACCOUNT}; UNIT; TRANSFER_TOKENS; # Make refund
       NIL operation; SWAP; CONS; PAIR} # Calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("bad_lockup", () => {
        const src = `parameter unit;
storage (pair timestamp (pair address address));
code { CDR; DUP; CAR; NOW; CMPLT; IF {FAIL} {};
       DUP; CDAR; CONTRACT unit ; ASSERT_SOME ; PUSH mutez 100000000; UNIT; TRANSFER_TOKENS; SWAP;
       DUP; CDDR; CONTRACT unit ; ASSERT_SOME ; PUSH mutez 100000000; UNIT; TRANSFER_TOKENS; DIP {SWAP} ;
       NIL operation ; SWAP ; CONS ; SWAP ; CONS ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("big_map_union", () => {
        const src = `parameter (list (pair string int)) ;
storage (pair (big_map string int) unit) ;
code { UNPAPAIR ;
       ITER { UNPAIR ; DUUUP ; DUUP; GET ;
              IF_NONE { PUSH int 0 } {} ;
              SWAP ; DIP { ADD ; SOME } ;
              UPDATE } ;
       PAIR ; NIL operation ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("cadr_annotation", () => {
        const src = `parameter (pair (pair %p1 unit (string %no_name)) bool);
storage unit;
code { CAR @param; CADR @name %no_name; DROP; UNIT; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("concat", () => {
        const src = `parameter string;
storage string;
code { DUP;
       DIP { CDR ; NIL string ; SWAP ; CONS } ;
       CAR ; CONS ;
       CONCAT;
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

    it("conditionals", () => {
        const src = `parameter (or string (option int));
storage string;
code { CAR;                      # Access the storage
       IF_LEFT {}                # The string is on top of the stack, nothing to do
               { IF_NONE { FAIL}  # Fail if None
                         { PUSH int 0; CMPGT; # Check for negative number
                           IF {FAIL}          # Fail if negative
                              {PUSH string ""}}}; # Push the empty string
       NIL operation; PAIR}                       # Calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("cons_twice", () => {
        const src = `parameter nat;
storage (list nat);
code { DUP;                     # Duplicate the storage and parameter
       CAR;                     # Extract the parameter
       DIP{CDR};                # Extract the storage
       DUP;                     # Duplicate the parameter
       DIP{CONS};               # Add the first instance of the parameter to the list
       CONS;                    # Add the second instance of the parameter to the list
       NIL operation; PAIR}     # Finish the calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("cps_fact", () => {
        const src = `storage nat ;
parameter nat ;
code { UNPAIR ;
       DIP { SELF ; ADDRESS ; SENDER;
             IFCMPEQ {} { DROP ; PUSH @storage nat 1 } };
       DUP ;
       PUSH nat 1 ;
       IFCMPGE
         { DROP ; NIL operation ; PAIR }
         { PUSH nat 1 ; SWAP ; SUB @parameter ; ISNAT ;
           IF_NONE
             { NIL operation ; PAIR }
             { DUP ; DIP { PUSH nat 1 ; ADD ; MUL @storage } ; SWAP;
               DIP { DIP { SELF; PUSH mutez 0 } ;
                     TRANSFER_TOKENS ; NIL operation ; SWAP ; CONS } ;
               SWAP ; PAIR } } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("create_add1_lists", () => {
        const src = `parameter unit;
storage address;
code { DROP; NIL int; # starting storage for contract
       AMOUNT;                   # Push the starting balance
       NONE key_hash;                 # No delegate
       CREATE_CONTRACT          # Create the contract
         { parameter (list int) ;
           storage (list int) ;
           code
             { CAR;
               MAP {PUSH int 1; ADD};
               NIL operation;
               PAIR } };
       NIL operation; SWAP; CONS; PAIR} # Ending calling convention stuff`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("data_publisher", () => {
        const src = `parameter (pair signature (pair string nat));
storage (pair (pair key nat) string);
code { DUP; CAR; DIP{CDR; DUP};
       SWAP; DIP{DUP}; CAAR; DIP{DUP; CAR; DIP{CDR; PACK ; BLAKE2B}};
       CHECK_SIGNATURE;
       IF { CDR; DUP; DIP{CAR; DIP{CAAR}}; CDR; PUSH nat 1; ADD;
            DIP{SWAP}; SWAP; PAIR; PAIR; NIL operation; PAIR}
          {FAIL}}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("dispatch", () => {
        const src = `parameter (or string (pair string (lambda unit string)));
storage (pair string (map string (lambda unit string)));
code { DUP; DIP{CDDR}; CAR;      # Unpack stack
       IF_LEFT { DIP{DUP}; GET; # Get lambda if it exists
                 IF_NONE {FAIL} {}; # Fail if it doesn't
                 UNIT; EXEC }        # Execute the lambda
               { DUP; CAR; DIP {CDR; SOME}; UPDATE; PUSH string ""}; # Update the storage
       PAIR;
       NIL operation; PAIR} # Calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("empty", () => {
        const src = `parameter unit;
storage unit;
code {CDR; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("fail_amount", () => {
        const src = `# Fail if the amount transferred is less than 10
parameter unit;
storage unit;
code { DROP;
       AMOUNT; PUSH mutez 10000000; CMPGT; IF {FAIL} {};
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

    it("faucet", () => {
        const src = `parameter key_hash ;
storage timestamp ;
code { UNPAIR ; SWAP ;
       PUSH int 300 ; ADD @FIVE_MINUTES_LATER ;
       NOW ; ASSERT_CMPGE ;
       IMPLICIT_ACCOUNT ; PUSH mutez 1000000 ; UNIT ; TRANSFER_TOKENS ;
       NIL operation ; SWAP ; CONS ; DIP { NOW } ; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("forward", () => {
        const src = `parameter
  (or string nat) ;
storage
  (pair
     (pair nat (pair mutez mutez)) # counter from_buyer from_seller
     (pair
        (pair nat (pair timestamp timestamp)) # Q T Z
        (pair
           (pair mutez mutez) # K C
           (pair
              (pair address address) # B S
              address)))) ; # W
code
  { DUP ; CDDADDR ; # Z
    PUSH int 86400 ; SWAP ; ADD ; # one day in second
    NOW ; COMPARE ; LT ;
    IF { # Before Z + 24
         DUP ; CAR ; # we must receive (Left "buyer") or (Left "seller")
         IF_LEFT
           { DUP ; PUSH string "buyer" ; COMPARE ; EQ ;
             IF { DROP ;
                  DUP ; CDADAR ; # amount already versed by the buyer
                  DIP { AMOUNT } ; ADD ; # transaction
                  #  then we rebuild the globals
                  DIP { DUP ; CDADDR } ; PAIR ; # seller amount
                  PUSH nat 0 ; PAIR ; # delivery counter at 0
                  DIP { CDDR } ; PAIR ; # parameters
                  # and return Unit
                  NIL operation ; PAIR }
                { PUSH string "seller" ; COMPARE ; EQ ;
                  IF { DUP ; CDADDR ; # amount already versed by the seller
                       DIP { AMOUNT } ; ADD ; # transaction
                       #  then we rebuild the globals
                       DIP { DUP ; CDADAR } ; SWAP ; PAIR ; # buyer amount
                       PUSH nat 0 ; PAIR ; # delivery counter at 0
                       DIP { CDDR } ; PAIR ; # parameters
                       # and return Unit
                       NIL operation ; PAIR }
                     { FAIL } } } # (Left _)
           { FAIL } } # (Right _)
       { # After Z + 24
         # if balance is emptied, just fail
         BALANCE ; PUSH mutez 0 ; IFCMPEQ { FAIL } {} ;
         # test if the required amount is reached
         DUP ; CDDAAR ; # Q
         DIP { DUP ; CDDDADR } ; MUL ; # C
         PUSH nat 2 ; MUL ;
         BALANCE ; COMPARE ; LT ; # balance < 2 * (Q * C)
         IF { # refund the parties
              CDR ; DUP ; CADAR ; # amount versed by the buyer
              DIP { DUP ; CDDDAAR } ; # B
              DIP { CONTRACT unit ; ASSERT_SOME } ;
              UNIT ; TRANSFER_TOKENS ;
              NIL operation ; SWAP ; CONS ; SWAP ;
              DUP ; CADDR ; # amount versed by the seller
              DIP { DUP ; CDDDADR } ; # S
              DIP { CONTRACT unit ; ASSERT_SOME } ;
              UNIT ; TRANSFER_TOKENS ; SWAP ;
              DIP { CONS } ;
              DUP ; CADAR ; DIP { DUP ; CADDR } ; ADD ;
              BALANCE ; SUB ; # bonus to the warehouse
              DIP { DUP ; CDDDDR } ; # W
              DIP { CONTRACT unit ; ASSERT_SOME } ;
              UNIT ; TRANSFER_TOKENS ;
              DIP { SWAP } ; CONS ;
              # leave the storage as-is, as the balance is now 0
              PAIR }
            { # otherwise continue
              DUP ; CDDADAR ; # T
              NOW ; COMPARE ; LT ;
              IF { FAIL } # Between Z + 24 and T
                 { # after T
                   DUP ; CDDADAR ; # T
                   PUSH int 86400 ; ADD ; # one day in second
                   NOW ; COMPARE ; LT ;
                   IF { # Between T and T + 24
                        # we only accept transactions from the buyer
                        DUP ; CAR ; # we must receive (Left "buyer")
                        IF_LEFT
                          { PUSH string "buyer" ; COMPARE ; EQ ;
                            IF { DUP ; CDADAR ; # amount already versed by the buyer
                                 DIP { AMOUNT } ; ADD ; # transaction
                                 # The amount must not exceed Q * K
                                 DUP ;
                                 DIIP { DUP ; CDDAAR ; # Q
                                        DIP { DUP ; CDDDAAR } ; MUL ; } ; # K
                                 DIP { COMPARE ; GT ; # new amount > Q * K
                                       IF { FAIL } { } } ; # abort or continue
                                 #  then we rebuild the globals
                                 DIP { DUP ; CDADDR } ; PAIR ; # seller amount
                                 PUSH nat 0 ; PAIR ; # delivery counter at 0
                                 DIP { CDDR } ; PAIR ; # parameters
                                 # and return Unit
                                 NIL operation ; PAIR }
                               { FAIL } } # (Left _)
                          { FAIL } } # (Right _)
                      { # After T + 24
                        # test if the required payment is reached
                        DUP ; CDDAAR ; # Q
                        DIP { DUP ; CDDDAAR } ; MUL ; # K
                        DIP { DUP ; CDADAR } ; # amount already versed by the buyer
                        COMPARE ; NEQ ;
                        IF { # not reached, pay the seller
                             BALANCE ;
                             DIP { DUP ; CDDDDADR } ; # S
                             DIIP { CDR } ;
                             DIP { CONTRACT unit ; ASSERT_SOME } ;
                             UNIT ; TRANSFER_TOKENS ;
                             NIL operation ; SWAP ; CONS ; PAIR }
                           { # otherwise continue
                             DUP ; CDDADAR ; # T
                             PUSH int 86400 ; ADD ;
                             PUSH int 86400 ; ADD ; # two days in second
                             NOW ; COMPARE ; LT ;
                             IF { # Between T + 24 and T + 48
                                  # We accept only delivery notifications, from W
                                  DUP ; CDDDDDR ; # W
                                  SENDER ;
                                  COMPARE ; NEQ ;
                                  IF { FAIL } {} ; # fail if not the warehouse
                                  DUP ; CAR ; # we must receive (Right amount)
                                  IF_LEFT
                                    { FAIL } # (Left _)
                                    { # We increment the counter
                                      DIP { DUP ; CDAAR } ; ADD ;
                                      # And rebuild the globals in advance
                                      DIP { DUP ; CDADR } ; PAIR ;
                                      DIP { CDDR } ; PAIR ;
                                      UNIT ; PAIR ;
                                      # We test if enough have been delivered
                                      DUP ; CDAAR ;
                                      DIP { DUP ; CDDAAR } ;
                                      COMPARE ; LT ; # counter < Q
                                      IF { CDR ; NIL operation } # wait for more
                                         { # Transfer all the money to the seller
                                           BALANCE ;
                                           DIP { DUP ; CDDDDADR } ; # S
                                           DIIP { CDR } ;
                                           DIP { CONTRACT unit ; ASSERT_SOME } ;
                                           UNIT ; TRANSFER_TOKENS ;
                                           NIL operation ; SWAP ; CONS } } ;
                                  PAIR }
                                { # after T + 48, transfer everything to the buyer
                                  BALANCE ;
                                  DIP { DUP ; CDDDDAAR } ; # B
                                  DIIP { CDR } ;
                                  DIP { CONTRACT unit ; ASSERT_SOME } ;
                                  UNIT ; TRANSFER_TOKENS ;
                                  NIL operation ; SWAP ; CONS ;
                                  PAIR} } } } } } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("id", () => {
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

    it("infinite_loop", () => {
        const src = `parameter unit;
storage unit;
code { DROP; PUSH bool True; LOOP {PUSH bool True}; UNIT; NIL operation; PAIR }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("insertion_sort", () => {
        const src = `parameter (list int) ;
storage (list int) ;
code { CAR ;
       NIL int ; SWAP ;
       ITER { SWAP; DIIP{NIL int} ; PUSH bool True ;
              LOOP
                { IF_CONS
                    { SWAP ;
                      DIP{DUP ; DIIP{DUP} ; DIP{CMPLT} ; SWAP} ;
                      SWAP ;
                      IF { DIP{SWAP ; DIP{CONS}} ; PUSH bool True}
                         { SWAP ; CONS ; PUSH bool False}}
                    { NIL int ; PUSH bool False}} ;
              SWAP ; CONS ; SWAP ;
              ITER {CONS}} ;
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

    it("int_publisher", () => {
        const src = `# (signed hash of the string, string)
parameter (option (pair signature int));
storage (pair key int);
code {DUP; DUP; CAR;
      IF_NONE {PUSH mutez 1000000; # Fee pattern from July 26
               AMOUNT; CMPLE; IF {FAIL} {};
               # Provide the data
               CDR; DIP {CDDR}}
              {DUP; DIP{SWAP}; SWAP; CDAR; # Move key to the top
               DIP {DUP; CAR; DIP {CDR; PACK ; BLAKE2B}}; # Arrange the new piece of data
               CHECK_SIGNATURE;                    # Check to ensure the data is authentic
               # Update data
               IF {CDR; SWAP; DIP{DUP}; CDAR; PAIR}
                  # Revert the update. This could be replaced with FAIL
                  {DROP; DUP; CDR; DIP{CDDR}}};
      # Cleanup
      DIP{DROP}; NIL operation; PAIR}`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("king_of_tez", () => {
        const src = `parameter key_hash;
storage (pair timestamp (pair mutez key_hash));
code { DUP; CDAR;
       # If the time is more than 2 weeks, any amount makes you king
       NOW; CMPGT;
       # User becomes king of mutez
       IF { CAR; AMOUNT; PAIR; NOW; PUSH int 604800; ADD; PAIR;
            NIL operation }
          # Check balance to see if user has paid enough to become the new king
          { DUP; CDDAR; AMOUNT; CMPLT;
            IF { FAIL }             # user has not paid out
               { CAR; DUP;
                 # New storage
                 DIP{ AMOUNT; PAIR; NOW; PUSH int 604800; ADD; PAIR };
                 # Pay funds to old king
                 IMPLICIT_ACCOUNT; AMOUNT; UNIT; TRANSFER_TOKENS;
                 NIL operation; SWAP; CONS}};
       # Cleanup
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

    it("list_of_transactions", () => {
        const src = `parameter unit;
storage (list address);
code { CDR; DUP;
       DIP {NIL operation}; PUSH bool True;     # Setup loop
       LOOP {IF_CONS { CONTRACT unit ; ASSERT_SOME ; PUSH mutez 1000000; UNIT; TRANSFER_TOKENS; # Make transfer
                       SWAP; DIP {CONS}; PUSH bool True}                   # Setup for next round of loop
                     { NIL address ; PUSH bool False}}; # Data to satisfy types and end loop
       DROP; PAIR};                                                 # Calling convention`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("queue", () => {
        const src = `parameter (option string);
storage (pair (option string) (pair (pair nat nat) (map nat string)));
code { DUP; CAR;
       # Retrieving an element
       IF_NONE { CDDR; DUP; CAR; DIP{CDR; DUP}; DUP;
                 CAR; SWAP; DIP{GET}; # Check if an element is available
                 SWAP;
                 # Put NONE on stack and finish
                 IF_NONE { NONE string; DIP{PAIR}; PAIR}
                         # Reoption the element and remove the entry from the map
                         { SOME;
                           DIP{ DUP; DIP{ CAR; DIP{ NONE string }; UPDATE };
                                # Increment the counter and cleanup
                                DUP; CAR; PUSH nat 1; ADD; DIP{ CDR }; PAIR; PAIR};
                           PAIR }}
               # Arrange the stack
               { DIP{DUP; CDDAR; DIP{CDDDR}; DUP}; SWAP; CAR;
                 # Add the element to the map
                 DIP{ SOME; SWAP; CDR; DUP; DIP{UPDATE};
                      # Increment the second number
                      PUSH nat 1; ADD};
                 # Cleanup and finish
                 PAIR; PAIR; NONE string; PAIR };
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

    it("reduce_map", () => {
        const src = `
parameter (pair (lambda int int) (list int));
storage (list int);
code { DIP{NIL int};
       CAR;
       DUP;
       DIP{CAR; PAIR};          # Unpack data and setup accumulator
       CDR;
       ITER {PAIR;
             DUP; CDAR;
             DIP{ DUP; DIP{CDAR}; DUP;
                  CAR; DIP{CDDR; SWAP}; EXEC; CONS};
             PAIR};
       CDR; DIP{NIL int}; # First reduce
       ITER {CONS}; # Reverse
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

    it("reentrancy", () => {
        const src = `parameter unit;
storage (pair address address);
code { CDR; DUP; CAR;
       CONTRACT unit ; ASSERT_SOME ; PUSH mutez 5000000; UNIT; TRANSFER_TOKENS;
       DIP {DUP; CDR;
            CONTRACT unit ; ASSERT_SOME ; PUSH mutez 5000000; UNIT; TRANSFER_TOKENS};
       DIIP{NIL operation};DIP{CONS};CONS;PAIR};`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("reservoir", () => {
        const src = `parameter unit ;
storage
  (pair
     (pair (timestamp %T) (mutez %N))
     (pair (address %A) (address %B))) ;
code
  { CDR ; DUP ; CAAR %T; # T
    NOW ; COMPARE ; LE ;
    IF { DUP ; CADR %N; # N
         BALANCE ;
         COMPARE ; LE ;
         IF { NIL operation ; PAIR }
            { DUP ; CDDR %B; # B
              CONTRACT unit ; ASSERT_SOME ;
              BALANCE ; UNIT ;
              TRANSFER_TOKENS ;
              NIL operation ; SWAP ; CONS ;
              PAIR } }
       { DUP ; CDAR %A; # A
         CONTRACT unit ; ASSERT_SOME ;
         BALANCE ;
         UNIT ;
         TRANSFER_TOKENS ;
         NIL operation ; SWAP ; CONS ;
         PAIR } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("scrutable_reservoir", () => {
        const src = `parameter unit ;
storage
  (pair
     string # S
     (pair
        timestamp # T
        (pair
           (pair mutez mutez) # P N
           (pair
              address # X
              (pair address address))))) ; # A B
code
  { DUP ; CDAR ; # S
    PUSH string "open" ;
    COMPARE ; NEQ ;
    IF { FAIL } # on "success", "timeout" or a bad init value
       { DUP ; CDDAR ; # T
         NOW ;
         COMPARE ; LT ;
         IF { # Before timeout
              # We compute (P + N) mutez
              PUSH mutez 0 ;
              DIP { DUP ; CDDDAAR } ; ADD ; # P
              DIP { DUP ; CDDDADR } ; ADD ; # N
              # We compare to the cumulated amount
              BALANCE ;
              COMPARE; LT ;
              IF { # Not enough cash, we just accept the transaction
                   # and leave the global untouched
                   CDR ; NIL operation ; PAIR }
                 { # Enough cash, successful ending
                   # We update the global
                   CDDR ; PUSH string "success" ; PAIR ;
                   # We transfer the fee to the broker
                   DUP ; CDDAAR ; # P
                   DIP { DUP ; CDDDAR } ; # X
                   DIP { CONTRACT unit ; ASSERT_SOME } ;
                   UNIT ; TRANSFER_TOKENS ;
                   # We transfer the rest to A
                   DIP { DUP ; CDDADR ; # N
                         DIP { DUP ; CDDDDAR } ; # A
                         DIP { CONTRACT unit ; ASSERT_SOME } ;
                         UNIT ; TRANSFER_TOKENS } ;
                   NIL operation ; SWAP ; CONS ; SWAP ; CONS ;
                   PAIR } }
            { # After timeout, we refund
              # We update the global
              CDDR ; PUSH string "timeout" ; PAIR ;
              # We try to transfer the fee to the broker
              BALANCE ; # available
              DIP { DUP ; CDDAAR } ; # P
              COMPARE ; LT ; # available < P
              IF { BALANCE ; # available
                   DIP { DUP ; CDDDAR } ; # X
                   DIP { CONTRACT unit ; ASSERT_SOME } ;
                   UNIT ; TRANSFER_TOKENS }
                 { DUP ; CDDAAR ; # P
                   DIP { DUP ; CDDDAR } ; # X
                   DIP { CONTRACT unit ; ASSERT_SOME } ;
                   UNIT ; TRANSFER_TOKENS } ;
              # We transfer the rest to B
              DIP { BALANCE ; # available
                    DIP { DUP ; CDDDDDR } ; # B
                    DIP { CONTRACT unit ; ASSERT_SOME } ;
                    UNIT ; TRANSFER_TOKENS } ;
              NIL operation ; SWAP ; CONS ; SWAP ; CONS ;
              PAIR } } }`;
        try {
            Contract.parse(src);
        } catch (err) {
            if (err instanceof MichelsonError) {
                console.log(inspect(err, false, null));
            }
            throw err;
        }
    });

    it("spawn_identities", () => {
        const src = `parameter nat;
storage (list address);
code { DUP;
       CAR;                     # Get the number
       DIP{CDR; NIL operation}; # Put the accumulators on the stack
       PUSH bool True;          # Push true so we have a do while loop
       LOOP { DUP; PUSH nat 0; CMPEQ; # Check if the number is 0
              IF { PUSH bool False}   # End the loop
                 { PUSH nat 1; SWAP; SUB; ABS; # Subtract 1. The ABS is to make it back into a nat
                   PUSH string "init"; # Storage type
                   PUSH mutez 5000000; # Starting balance
                   NONE key_hash;
                   CREATE_CONTRACT
                     { parameter string ;
                       storage string ;
                       code { CAR ; NIL operation ; PAIR } } ; # Make the contract
                   SWAP ; DIP { SWAP ; DIP { CONS } } ; # emit the operation
                   SWAP ; DIP { SWAP ; DIP { CONS } } ; # add to the list
                   PUSH bool True}}; # Continue the loop
       DROP; PAIR}    # Calling convention`;
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
