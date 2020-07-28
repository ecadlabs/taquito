import { MichelsonType, MichelsonData } from "../src/michelson-types";
import { assertMichelsonInstruction, assertMichelsonType, assertMichelsonContract } from "../src/michelson-validator";
import { assertContractValid, assertDataValid, assertTypesEqual, TypeEqualityMode, functionType, MichelsonCodeError, contractEntrypoint } from "../src/michelson-typecheck";
import { Parser } from '../src/micheline-parser';
import { inspect } from "util";

describe('Typecheck', () => {
    it('assertDataValid: string', () => {
        const typedef: MichelsonType = { "prim": "string" };
        const data: MichelsonData<typeof typedef> = { "string": "test" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: int', () => {
        const typedef: MichelsonType = { "prim": "int" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: nat', () => {
        const typedef: MichelsonType = { "prim": "nat" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: bytes', () => {
        const typedef: MichelsonType = { "prim": "bytes" };
        const data: MichelsonData<typeof typedef> = { "bytes": "0xABCDEF42" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: bool', () => {
        const typedef: MichelsonType = { "prim": "bool" };
        const data: MichelsonData<typeof typedef> = { "prim": "True" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unit', () => {
        const typedef: MichelsonType = { "prim": "unit" };
        const data: MichelsonData<typeof typedef> = { "prim": "Unit" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: list', () => {
        const typedef: MichelsonType = { "prim": "list", args: [{ prim: "string" }] };
        const data: MichelsonData<typeof typedef> = [{ "string": "aaa" }, { "string": "bbb" }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: pair', () => {
        const typedef: MichelsonType = { "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Pair", args: [{ "string": "aaa" }, { "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: option nat', () => {
        const typedef: MichelsonType = { "prim": "option", args: [{ prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Some", args: [{ "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: option none', () => {
        const typedef: MichelsonType = { "prim": "option", args: [{ prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "None" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: or left', () => {
        const typedef: MichelsonType = { "prim": "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Left", args: [{ "string": "aaa" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: or right', () => {
        const typedef: MichelsonType = { "prim": "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Right", args: [{ "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: set', () => {
        const typedef: MichelsonType = { "prim": "set", args: [{ "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Pair", args: [{ "string": "aaa" }, { "int": "0" }] }, { prim: "Pair", args: [{ "string": "bbb" }, { "int": "1" }] }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unsorted set', () => {
        const typedef: MichelsonType = { "prim": "set", args: [{ "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Pair", args: [{ "string": "bbb" }, { "int": "0" }] }, { prim: "Pair", args: [{ "string": "aaa" }, { "int": "1" }] }];
        expect(() => assertDataValid(typedef, data)).toThrow();
    });

    it('assertDataValid: map', () => {
        const typedef: MichelsonType = { "prim": "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Elt", args: [{ "string": "aaa" }, { "int": "0" }] }, { prim: "Elt", args: [{ "string": "bbb" }, { "int": "1" }] }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unsorted map', () => {
        const typedef: MichelsonType = { "prim": "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Elt", args: [{ "string": "bbb" }, { "int": "0" }] }, { prim: "Elt", args: [{ "string": "aaa" }, { "int": "1" }] }];
        expect(() => assertDataValid(typedef, data)).toThrow();
    });

    it('assertDataValid: timestamp', () => {
        const typedef: MichelsonType = { "prim": "timestamp" };
        const data: MichelsonData<typeof typedef> = { "string": "2020-06-21T00:39:07Z" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: address', () => {
        const typedef: MichelsonType = { "prim": "address" };
        const data: MichelsonData<typeof typedef> = { "string": "tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: mutez', () => {
        const typedef: MichelsonType = { "prim": "mutez" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertTypesEqual: identical', () => {
        const pair: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        assertTypesEqual(pair, pair);
    });

    it('assertTypesEqual: different fields', () => {
        const pair0: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        const pair1: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%nn"] }
            ]
        };
        expect(() => assertTypesEqual(pair0, pair1)).toThrow();
    });

    it('assertTypesEqual: loose', () => {
        const pair0: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        const pair1: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat" }
            ]
        };
        assertTypesEqual(pair0, pair1, [], TypeEqualityMode.Loose);
    });

    it('contractEntrypoint', () => {
        const param: MichelsonType = {
            prim: 'or',
            args: [
                {
                    prim: 'pair',
                    annots: ['%have_fun'],
                    args: [
                        {
                            prim: 'big_map',
                            args: [{ prim: 'string' }, { prim: 'nat' }]
                        },
                        { prim: 'unit' }
                    ]
                },
                { prim: 'unit', annots: ['%default'] }
            ]
        };
        expect(contractEntrypoint(param, "%default")).toEqual(param.args[1]);
        expect(contractEntrypoint(param, "%have_fun")).toEqual(param.args[0]);
    });

    it('code', () => {
        const src = `
        parameter (or
            (or
              (or (pair %getVersion unit (contract nat))
                  (pair %getAllowance (pair (address :owner) (address :spender))
                                      (contract nat)))
              (or (pair %getBalance (address :owner) (contract nat))
                  (or (pair %getTotalSupply unit (contract nat))
                      (pair %getTotalMinted unit (contract nat)))))
            (or
              (or (pair %getTotalBurned unit (contract nat))
                  (pair %getOwner unit (contract address)))
              (or (pair %getRedeemAddress unit (contract address))
                  (or
                    (pair %getTokenMetadata (list nat)
                                            (contract (list (pair nat
                                                                (pair string
                                                                      (pair string
                                                                            (pair nat
                                                                                  (map
                                                                                    string
                                                                                    string))))))))
                    (or %safeEntrypoints
                      (or
                        (or
                          (or (pair %run string bytes)
                              (pair %upgrade
                                (pair (nat :currentVersion) (nat :newVersion))
                                (pair
                                  (lambda :migrationScript (big_map bytes bytes)
                                                           (big_map bytes bytes))
                                  (pair
                                    (option :newCode (lambda
                                                      (pair (pair string bytes)
                                                            (big_map bytes bytes))
                                                      (pair (list operation)
                                                            (big_map bytes bytes))))
                                    (option :newPermCode (lambda
                                                          (pair unit
                                                                (big_map bytes bytes))
                                                          (pair (list operation)
                                                                (big_map bytes bytes))))))))
                          (or (pair %epwBeginUpgrade (nat :current) (nat :new))
                              (lambda :migrationscript %epwApplyMigration
                                (big_map bytes bytes)
                                (big_map bytes bytes))))
                        (or
                          (or
                            (lambda :contractcode %epwSetCode
                              (pair (pair string bytes) (big_map bytes bytes))
                              (pair (list operation) (big_map bytes bytes)))
                            (unit %epwFinishUpgrade))
                          (or
                            (pair %transfer (address :from)
                                            (pair (address :to) (nat :value)))
                            (pair %approve (address :spender) (nat :value)))))
                      (or
                        (or
                          (or (pair %mint (address :to) (nat :value)) (nat :value %burn))
                          (or (address :operator %addOperator)
                              (address :operator %removeOperator)))
                        (or (or (address :redeem %setRedeemAddress) (unit %pause))
                            (or (unit %unpause)
                                (or (address :newOwner %transferOwnership)
                                    (unit %acceptOwnership))))))))));
storage (pair (big_map bytes bytes)
              (pair
                (lambda (pair (pair string bytes) (big_map bytes bytes))
                        (pair (list operation) (big_map bytes bytes)))
                (pair nat bool)));
code { CAST (pair
              (or
                (or
                  (or (pair unit (contract nat))
                      (pair (pair address address) (contract nat)))
                  (or (pair address (contract nat))
                      (or (pair unit (contract nat)) (pair unit (contract nat)))))
                (or (or (pair unit (contract nat)) (pair unit (contract address)))
                    (or (pair unit (contract address))
                        (or
                          (pair (list nat)
                                (contract (list (pair nat
                                                    (pair string
                                                          (pair string
                                                                (pair nat
                                                                      (map string string))))))))
                          (or
                            (or
                              (or
                                (or (pair string bytes)
                                    (pair (pair nat nat)
                                          (pair
                                            (lambda (big_map bytes bytes)
                                                    (big_map bytes bytes))
                                            (pair
                                              (option (lambda
                                                       (pair (pair string bytes)
                                                             (big_map bytes bytes))
                                                       (pair (list operation)
                                                             (big_map bytes bytes))))
                                              (option (lambda
                                                       (pair unit (big_map bytes bytes))
                                                       (pair (list operation)
                                                             (big_map bytes bytes))))))))
                                (or (pair nat nat)
                                    (lambda (big_map bytes bytes) (big_map bytes bytes))))
                              (or
                                (or
                                  (lambda
                                    (pair (pair string bytes) (big_map bytes bytes))
                                    (pair (list operation) (big_map bytes bytes)))
                                  unit)
                                (or (pair address (pair address nat)) (pair address nat))))
                            (or (or (or (pair address nat) nat) (or address address))
                                (or (or address unit) (or unit (or address unit)))))))))
              (pair (big_map bytes bytes)
                    (pair
                      (lambda (pair (pair string bytes) (big_map bytes bytes))
                              (pair (list operation) (big_map bytes bytes)))
                      (pair nat bool)))) ;
       DUP ;
       CAR ;
       DIP { CDR } ;
       IF_LEFT
         { IF_LEFT
             { IF_LEFT
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP } ; SWAP } ;
                     PAIR ;
                     CDR ;
                     CDR ;
                     CDR ;
                     CAR ;
                     DIP { AMOUNT } ;
                     TRANSFER_TOKENS ;
                     NIL operation ;
                     SWAP ;
                     CONS ;
                     PAIR } }
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { ADDRESS } ;
                     PAIR ;
                     PACK ;
                     PUSH string "callGetAllowance" ;
                     PAIR ;
                     DIP { DUP ;
                           CDR ;
                           CDR ;
                           CDR ;
                           IF
                             { UNIT ; PUSH string "UpgContractIsMigrating" ; PAIR ; FAILWITH }
                             {} ;
                           DUP ;
                           CAR ;
                           DIP { DUP ; CDR ; CAR } } ;
                     PAIR ;
                     EXEC ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                     PAIR } } }
             { IF_LEFT
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { ADDRESS } ;
                     PAIR ;
                     PACK ;
                     PUSH string "callGetBalance" ;
                     PAIR ;
                     DIP { DUP ;
                           CDR ;
                           CDR ;
                           CDR ;
                           IF
                             { UNIT ; PUSH string "UpgContractIsMigrating" ; PAIR ; FAILWITH }
                             {} ;
                           DUP ;
                           CAR ;
                           DIP { DUP ; CDR ; CAR } } ;
                     PAIR ;
                     EXEC ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                     PAIR } }
                 { IF_LEFT
                     { { DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { ADDRESS } ;
                         PAIR ;
                         PACK ;
                         PUSH string "callGetTotalSupply" ;
                         PAIR ;
                         DIP { DUP ;
                               CDR ;
                               CDR ;
                               CDR ;
                               IF
                                 { UNIT ;
                                   PUSH string "UpgContractIsMigrating" ;
                                   PAIR ;
                                   FAILWITH }
                                 {} ;
                               DUP ;
                               CAR ;
                               DIP { DUP ; CDR ; CAR } } ;
                         PAIR ;
                         EXEC ;
                         DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                         PAIR } }
                     { { DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { ADDRESS } ;
                         PAIR ;
                         PACK ;
                         PUSH string "callGetTotalMinted" ;
                         PAIR ;
                         DIP { DUP ;
                               CDR ;
                               CDR ;
                               CDR ;
                               IF
                                 { UNIT ;
                                   PUSH string "UpgContractIsMigrating" ;
                                   PAIR ;
                                   FAILWITH }
                                 {} ;
                               DUP ;
                               CAR ;
                               DIP { DUP ; CDR ; CAR } } ;
                         PAIR ;
                         EXEC ;
                         DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                         PAIR } } } } }
         { IF_LEFT
             { IF_LEFT
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { ADDRESS } ;
                     PAIR ;
                     PACK ;
                     PUSH string "callGetTotalBurned" ;
                     PAIR ;
                     DIP { DUP ;
                           CDR ;
                           CDR ;
                           CDR ;
                           IF
                             { UNIT ; PUSH string "UpgContractIsMigrating" ; PAIR ; FAILWITH }
                             {} ;
                           DUP ;
                           CAR ;
                           DIP { DUP ; CDR ; CAR } } ;
                     PAIR ;
                     EXEC ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                     PAIR } }
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { ADDRESS } ;
                     PAIR ;
                     PACK ;
                     PUSH string "callGetOwner" ;
                     PAIR ;
                     DIP { DUP ;
                           CDR ;
                           CDR ;
                           CDR ;
                           IF
                             { UNIT ; PUSH string "UpgContractIsMigrating" ; PAIR ; FAILWITH }
                             {} ;
                           DUP ;
                           CAR ;
                           DIP { DUP ; CDR ; CAR } } ;
                     PAIR ;
                     EXEC ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                     PAIR } } }
             { IF_LEFT
                 { { DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { ADDRESS } ;
                     PAIR ;
                     PACK ;
                     PUSH string "callGetRedeemAddress" ;
                     PAIR ;
                     DIP { DUP ;
                           CDR ;
                           CDR ;
                           CDR ;
                           IF
                             { UNIT ; PUSH string "UpgContractIsMigrating" ; PAIR ; FAILWITH }
                             {} ;
                           DUP ;
                           CAR ;
                           DIP { DUP ; CDR ; CAR } } ;
                     PAIR ;
                     EXEC ;
                     DUP ;
                     CAR ;
                     DIP { CDR } ;
                     DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                     PAIR } }
                 { IF_LEFT
                     { { DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { ADDRESS } ;
                         PAIR ;
                         PACK ;
                         PUSH string "callGetTokenMetadata" ;
                         PAIR ;
                         DIP { DUP ;
                               CDR ;
                               CDR ;
                               CDR ;
                               IF
                                 { UNIT ;
                                   PUSH string "UpgContractIsMigrating" ;
                                   PAIR ;
                                   FAILWITH }
                                 {} ;
                               DUP ;
                               CAR ;
                               DIP { DUP ; CDR ; CAR } } ;
                         PAIR ;
                         EXEC ;
                         DUP ;
                         CAR ;
                         DIP { CDR } ;
                         DIP { DIP { DUP ; DIP { CDR } ; CAR } ; SWAP ; DROP ; PAIR } ;
                         PAIR } }
                     { { IF_LEFT
                           { IF_LEFT
                               { IF_LEFT
                                   { IF_LEFT
                                       { { DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { { DIP { DUP ;
                                                 CAR ;
                                                 PUSH bytes 0x0501000000056f776e6572 ;
                                                 GET ;
                                                 IF_NONE
                                                   { PUSH string "UStore: no field owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 UNPACK address ;
                                                 IF_NONE
                                                   { PUSH string "UStore: failed to unpack owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 SENDER ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "SenderIsNotOwner" ;
                                                     PAIR ;
                                                     FAILWITH } ;
                                                 DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} } ;
                                           DUP ;
                                           DIP { CAR ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CDR ; CAR } ;
                                                 DIP { DUP } ;
                                                 SWAP ;
                                                 DIP { DUP } ;
                                                 SWAP ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   { DROP ; DROP }
                                                   { PAIR ;
                                                     PUSH string "UpgVersionMismatch" ;
                                                     PAIR ;
                                                     FAILWITH } } ;
                                           DUP ;
                                           DIP { CAR ;
                                                 CDR ;
                                                 DIP { DUP ; CDR } ;
                                                 DIP { DUP ; DIP { CAR } ; CDR } ;
                                                 DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR ;
                                                 SWAP ;
                                                 PAIR ;
                                                 DIP { DUP ; DIP { CAR } ; CDR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 SWAP ;
                                                 PAIR } ;
                                           DUP ;
                                           CDR ;
                                           CAR ;
                                           SWAP ;
                                           DIP { DIP { DUP ; CAR } ;
                                                 SWAP ;
                                                 EXEC ;
                                                 DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           CDR ;
                                           CDR ;
                                           CAR ;
                                           IF_NONE
                                             {}
                                             { DIP { DUP ; CDR } ;
                                               DIP { DUP ; DIP { CDR } ; CAR } ;
                                               SWAP ;
                                               DROP ;
                                               PAIR ;
                                               DIP { DUP ; DIP { CAR } ; CDR } ;
                                               SWAP ;
                                               DROP ;
                                               SWAP ;
                                               PAIR } ;
                                           NIL operation ;
                                           PAIR } } }
                                   { IF_LEFT
                                       { { DIP { DUP ;
                                                 CAR ;
                                                 PUSH bytes 0x0501000000056f776e6572 ;
                                                 GET ;
                                                 IF_NONE
                                                   { PUSH string "UStore: no field owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 UNPACK address ;
                                                 IF_NONE
                                                   { PUSH string "UStore: failed to unpack owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 SENDER ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "SenderIsNotOwner" ;
                                                     PAIR ;
                                                     FAILWITH } ;
                                                 DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} } ;
                                           DUP ;
                                           DIP { CAR ;
                                                 DIP { DUP ; CDR ; CDR ; CAR } ;
                                                 DIP { DUP } ;
                                                 SWAP ;
                                                 DIP { DUP } ;
                                                 SWAP ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   { DROP ; DROP }
                                                   { PAIR ;
                                                     PUSH string "UpgVersionMismatch" ;
                                                     PAIR ;
                                                     FAILWITH } } ;
                                           CDR ;
                                           DIP { DUP ; CDR } ;
                                           DIP { DUP ; DIP { CAR } ; CDR } ;
                                           DIP { DUP ; DIP { CDR } ; CAR } ;
                                           SWAP ;
                                           DROP ;
                                           PAIR ;
                                           SWAP ;
                                           PAIR ;
                                           DIP { DUP ; DIP { CAR } ; CDR } ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           DUP ;
                                           CDR ;
                                           DUP ;
                                           DIP { CAR } ;
                                           CDR ;
                                           DUP ;
                                           DIP { CAR } ;
                                           CDR ;
                                           PUSH bool True ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           SWAP ;
                                           PAIR ;
                                           DIP { DUP ; DIP { CAR } ; CDR } ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           NIL operation ;
                                           PAIR } }
                                       { { DIP { DUP ;
                                                 CAR ;
                                                 PUSH bytes 0x0501000000056f776e6572 ;
                                                 GET ;
                                                 IF_NONE
                                                   { PUSH string "UStore: no field owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 UNPACK address ;
                                                 IF_NONE
                                                   { PUSH string "UStore: failed to unpack owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 SENDER ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "SenderIsNotOwner" ;
                                                     PAIR ;
                                                     FAILWITH } ;
                                                 DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsNotMigrating" ;
                                                     PAIR ;
                                                     FAILWITH } } ;
                                           DIP { DUP ; CAR } ;
                                           SWAP ;
                                           EXEC ;
                                           DIP { DUP ; DIP { CDR } ; CAR } ;
                                           SWAP ;
                                           DROP ;
                                           PAIR ;
                                           NIL operation ;
                                           PAIR } } } }
                               { IF_LEFT
                                   { IF_LEFT
                                       { { DIP { DUP ;
                                                 CAR ;
                                                 PUSH bytes 0x0501000000056f776e6572 ;
                                                 GET ;
                                                 IF_NONE
                                                   { PUSH string "UStore: no field owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 UNPACK address ;
                                                 IF_NONE
                                                   { PUSH string "UStore: failed to unpack owner" ;
                                                     FAILWITH }
                                                   {} ;
                                                 SENDER ;
                                                 COMPARE ;
                                                 EQ ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "SenderIsNotOwner" ;
                                                     PAIR ;
                                                     FAILWITH } ;
                                                 DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   {}
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsNotMigrating" ;
                                                     PAIR ;
                                                     FAILWITH } } ;
                                           DIP { DUP ; CDR } ;
                                           DIP { DUP ; DIP { CDR } ; CAR } ;
                                           SWAP ;
                                           DROP ;
                                           PAIR ;
                                           DIP { DUP ; DIP { CAR } ; CDR } ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           NIL operation ;
                                           PAIR } }
                                       { DROP ;
                                         { DUP ;
                                           CAR ;
                                           PUSH bytes 0x0501000000056f776e6572 ;
                                           GET ;
                                           IF_NONE
                                             { PUSH string "UStore: no field owner" ;
                                               FAILWITH }
                                             {} ;
                                           UNPACK address ;
                                           IF_NONE
                                             { PUSH string "UStore: failed to unpack owner" ;
                                               FAILWITH }
                                             {} ;
                                           SENDER ;
                                           COMPARE ;
                                           EQ ;
                                           IF
                                             {}
                                             { UNIT ;
                                               PUSH string "SenderIsNotOwner" ;
                                               PAIR ;
                                               FAILWITH } ;
                                           DUP ;
                                           CDR ;
                                           CDR ;
                                           CDR ;
                                           IF
                                             {}
                                             { UNIT ;
                                               PUSH string "UpgContractIsNotMigrating" ;
                                               PAIR ;
                                               FAILWITH } ;
                                           DUP ;
                                           CDR ;
                                           DUP ;
                                           DIP { CAR } ;
                                           CDR ;
                                           DUP ;
                                           DIP { CAR } ;
                                           CDR ;
                                           PUSH bool False ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           SWAP ;
                                           PAIR ;
                                           DIP { DUP ; DIP { CAR } ; CDR } ;
                                           SWAP ;
                                           DROP ;
                                           SWAP ;
                                           PAIR ;
                                           NIL operation ;
                                           PAIR } } }
                                   { IF_LEFT
                                       { { PACK ;
                                           PUSH string "callTransfer" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { { PACK ;
                                           PUSH string "callApprove" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } } } } }
                           { IF_LEFT
                               { IF_LEFT
                                   { IF_LEFT
                                       { { PACK ;
                                           PUSH string "callMint" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { { PACK ;
                                           PUSH string "callBurn" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } } }
                                   { IF_LEFT
                                       { { PACK ;
                                           PUSH string "callAddOperator" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { { PACK ;
                                           PUSH string "callRemoveOperator" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } } } }
                               { IF_LEFT
                                   { IF_LEFT
                                       { { PACK ;
                                           PUSH string "callSetRedeemAddress" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { { PACK ;
                                           PUSH string "callPause" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } } }
                                   { IF_LEFT
                                       { { PACK ;
                                           PUSH string "callUnpause" ;
                                           PAIR ;
                                           DIP { DUP ;
                                                 CDR ;
                                                 CDR ;
                                                 CDR ;
                                                 IF
                                                   { UNIT ;
                                                     PUSH string "UpgContractIsMigrating" ;
                                                     PAIR ;
                                                     FAILWITH }
                                                   {} ;
                                                 DUP ;
                                                 CAR ;
                                                 DIP { DUP ; CDR ; CAR } } ;
                                           PAIR ;
                                           EXEC ;
                                           DUP ;
                                           CAR ;
                                           DIP { CDR } ;
                                           DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                 SWAP ;
                                                 DROP ;
                                                 PAIR } ;
                                           PAIR } }
                                       { IF_LEFT
                                           { { PACK ;
                                               PUSH string "callTransferOwnership" ;
                                               PAIR ;
                                               DIP { DUP ;
                                                     CDR ;
                                                     CDR ;
                                                     CDR ;
                                                     IF
                                                       { UNIT ;
                                                         PUSH string "UpgContractIsMigrating" ;
                                                         PAIR ;
                                                         FAILWITH }
                                                       {} ;
                                                     DUP ;
                                                     CAR ;
                                                     DIP { DUP ; CDR ; CAR } } ;
                                               PAIR ;
                                               EXEC ;
                                               DUP ;
                                               CAR ;
                                               DIP { CDR } ;
                                               DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                     SWAP ;
                                                     DROP ;
                                                     PAIR } ;
                                               PAIR } }
                                           { { PACK ;
                                               PUSH string "callAcceptOwnership" ;
                                               PAIR ;
                                               DIP { DUP ;
                                                     CDR ;
                                                     CDR ;
                                                     CDR ;
                                                     IF
                                                       { UNIT ;
                                                         PUSH string "UpgContractIsMigrating" ;
                                                         PAIR ;
                                                         FAILWITH }
                                                       {} ;
                                                     DUP ;
                                                     CAR ;
                                                     DIP { DUP ; CDR ; CAR } } ;
                                               PAIR ;
                                               EXEC ;
                                               DUP ;
                                               CAR ;
                                               DIP { CDR } ;
                                               DIP { DIP { DUP ; DIP { CDR } ; CAR } ;
                                                     SWAP ;
                                                     DROP ;
                                                     PAIR } ;
                                               PAIR } } } } } } } } } } } }
`;

        const p = new Parser({ expandMacros: true });
        const contract = p.parseScript(src);

        if (contract !== null && assertMichelsonContract(contract)) {
            try {
                assertContractValid(contract);
            } catch (err) {
                console.log(inspect(err, false, null));
                throw err;
            }
        }
    });
});