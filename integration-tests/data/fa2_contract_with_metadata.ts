// Code obtains from https://github.com/tqtezos/stablecoin/#tezos-stablecoin
export const fa2ContractTzip16 = `{
    parameter
        (or
            (or
                (or
                    (or
                        (unit %accept_ownership)
                        (list %burn nat))
                    (or
                        (or %call_FA2
                            (or
                                (pair %balance_of
                                    (list %requests
                                        (pair
                                            (address %owner)
                                            (nat %token_id)))
                                    (contract %callback
                                        (list
                                            (pair
                                                (pair %request
                                                    (address %owner)
                                                    (nat %token_id))
                                                (nat %balance)))))
                                (contract %token_metadata_registry address))
                            (or
                                (list %transfer
                                    (pair
                                        (address %from_)
                                        (list %txs
                                            (pair
                                                (address %to_)
                                                (pair
                                                    (nat %token_id)
                                                    (nat %amount))))))
                                (list %update_operators
                                    (or
                                        (pair %add_operator
                                            (address %owner)
                                            (pair
                                                (address %operator)
                                                (nat %token_id)))
                                        (pair %remove_operator
                                            (address %owner)
                                            (pair
                                                (address %operator)
                                                (nat %token_id)))))))
                        (address %change_master_minter)))
                (or
                    (or
                        (address %change_pauser)
                        (pair %configure_minter
                            (address %minter)
                            (pair
                                (option %current_minting_allowance nat)
                                (nat %new_minting_allowance))))
                    (or
                        (list %mint
                            (pair
                                (address %to_)
                                (nat %amount)))
                        (unit %pause))))
            (or
                (or
                    (or
                        (pair %permit
                            key
                            (pair signature bytes))
                        (address %remove_minter))
                    (or
                        (pair %set_expiry
                            address
                            (pair
                                nat
                                (option bytes)))
                        (option %set_transferlist address)))
                (or
                    (address %transfer_ownership)
                    (unit %unpause))));
    storage
        (pair
            (pair
                (pair
                    (pair
                        (nat %default_expiry)
                        (big_map %ledger address nat))
                    (pair
                        (big_map %metadata string bytes)
                        (map %minting_allowances address nat)))
                (pair
                    (pair
                        (big_map %operators
                            (pair address address)
                            unit)
                        (bool %paused))
                    (pair
                        (nat %permit_counter)
                        (big_map %permits
                            address
                            (pair
                                (option %expiry nat)
                                (map %permits
                                    bytes
                                    (pair
                                        (timestamp %created_at)
                                        (option %expiry nat))))))))
            (pair
                (pair
                    (pair %roles
                        (pair
                            (address %master_minter)
                            (address %owner))
                        (pair
                            (address %pauser)
                            (option %pending_owner address)))
                    (address %token_metadata_registry))
                (option %transferlist_contract address)));
    code
        {
            LAMBDA
                nat
                unit
                {
                    PUSH nat 0;
                    SWAP;
                    COMPARE;
                    NEQ;
                    IF
                        {
                            PUSH string "FA2_TOKEN_UNDEFINED";
                            FAILWITH
                        }
                        {
                            UNIT
                        }
                };
            LAMBDA
                (pair
                    (pair
                        nat
                        (option nat))
                    (pair
                        timestamp
                        (option nat)))
                bool
                {
                    DUP;
                    CDR;
                    NOW;
                    SWAP;
                    DUP;
                    DUG 2;
                    CDR;
                    IF_NONE
                        {
                            DIG 2;
                            DUP;
                            DUG 3;
                            CAR;
                            CDR;
                            IF_NONE
                                {
                                    DIG 2;
                                    CAR;
                                    CAR
                                }
                                {
                                    DIG 3;
                                    DROP
                                }
                        }
                        {
                            DIG 3;
                            DROP
                        };
                    INT;
                    DIG 2;
                    CAR;
                    ADD;
                    COMPARE;
                    LT
                };
            DUP;
            LAMBDA
                (pair
                    (lambda
                        (pair
                            (pair
                                nat
                                (option nat))
                            (pair
                                timestamp
                                (option nat)))
                        bool)
                    (pair
                        (pair
                            address
                            (pair
                                (pair
                                    (pair
                                        (pair
                                            nat
                                            (big_map address nat))
                                        (pair
                                            (big_map string bytes)
                                            (map address nat)))
                                    (pair
                                        (pair
                                            (big_map
                                                (pair address address)
                                                unit)
                                            bool)
                                        (pair
                                            nat
                                            (big_map
                                                address
                                                (pair
                                                    (option nat)
                                                    (map
                                                        bytes
                                                        (pair
                                                            timestamp
                                                            (option nat))))))))
                                (pair
                                    (pair
                                        (pair
                                            (pair address address)
                                            (pair
                                                address
                                                (option address)))
                                        address)
                                    (option address))))
                        (pair
                            (or
                                (or
                                    (or
                                        (or
                                            unit
                                            (list nat))
                                        (or
                                            (or
                                                (or
                                                    (pair
                                                        (list
                                                            (pair address nat))
                                                        (contract
                                                            (list
                                                                (pair
                                                                    (pair address nat)
                                                                    nat))))
                                                    (contract address))
                                                (or
                                                    (list
                                                        (pair
                                                            address
                                                            (list
                                                                (pair
                                                                    address
                                                                    (pair nat nat)))))
                                                    (list
                                                        (or
                                                            (pair
                                                                address
                                                                (pair address nat))
                                                            (pair
                                                                address
                                                                (pair address nat))))))
                                            address))
                                    (or
                                        (or
                                            address
                                            (pair
                                                address
                                                (pair
                                                    (option nat)
                                                    nat)))
                                        (or
                                            (list
                                                (pair address nat))
                                            unit)))
                                (or
                                    (or
                                        (or
                                            (pair
                                                key
                                                (pair signature bytes))
                                            address)
                                        (or
                                            (pair
                                                address
                                                (pair
                                                    nat
                                                    (option bytes)))
                                            (option address)))
                                    (or address unit)))
                            string)))
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                {
                    DUP;
                    CDR;
                    SWAP;
                    CAR;
                    SWAP;
                    DUP;
                    CAR;
                    CAR;
                    SWAP;
                    DUP;
                    DUG 2;
                    CAR;
                    CDR;
                    DIG 2;
                    DUP;
                    DUG 3;
                    CDR;
                    CDR;
                    DIG 2;
                    DUP;
                    DUG 3;
                    SENDER;
                    COMPARE;
                    EQ;
                    IF
                        {
                            DROP;
                            SWAP;
                            DROP;
                            SWAP;
                            DROP;
                            SWAP;
                            DROP
                        }
                        {
                            DIG 3;
                            CDR;
                            CAR;
                            PACK;
                            BLAKE2B;
                            DIG 2;
                            DUP;
                            DUG 3;
                            CAR;
                            CDR;
                            CDR;
                            CDR;
                            DIG 4;
                            DUP;
                            DUG 5;
                            GET;
                            IF_NONE
                                {
                                    SWAP;
                                    DUP;
                                    DUG 2;
                                    FAILWITH
                                }
                                {
                                };
                            DUP;
                            CDR;
                            DIG 2;
                            DUP;
                            DUG 3;
                            GET;
                            IF_NONE
                                {
                                    DROP 2;
                                    SWAP;
                                    DROP;
                                    SWAP;
                                    DROP;
                                    SWAP;
                                    DROP;
                                    FAILWITH
                                }
                                {
                                    DIG 3;
                                    DROP;
                                    SWAP;
                                    DUP;
                                    DUG 2;
                                    CAR;
                                    DIG 4;
                                    DUP;
                                    DUG 5;
                                    CAR;
                                    CAR;
                                    CAR;
                                    CAR;
                                    PAIR;
                                    PAIR;
                                    DIG 5;
                                    SWAP;
                                    EXEC;
                                    IF
                                        {
                                            DROP 4;
                                            PUSH string "EXPIRED_PERMIT";
                                            FAILWITH
                                        }
                                        {
                                            DIG 2;
                                            DUP;
                                            CAR;
                                            CDR;
                                            CDR;
                                            CDR;
                                            DIG 2;
                                            DUP;
                                            CDR;
                                            DIG 4;
                                            NONE
                                                (pair
                                                    timestamp
                                                    (option nat));
                                            SWAP;
                                            UPDATE;
                                            SWAP;
                                            CAR;
                                            PAIR;
                                            SOME;
                                            DIG 3;
                                            UPDATE;
                                            DIP
                                                {
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR
                                        }
                                }
                        }
                };
            SWAP;
            APPLY;
            EMPTY_MAP
                bytes
                (pair
                    timestamp
                    (option nat));
            NONE nat;
            PAIR;
            LAMBDA
                (pair bool string)
                unit
                {
                    DUP;
                    CAR;
                    IF
                        {
                            CDR;
                            FAILWITH
                        }
                        {
                            DROP;
                            UNIT
                        }
                };
            DIG 2;
            DUP;
            DUG 3;
            LAMBDA
                (pair
                    (lambda
                        (pair
                            (pair
                                address
                                (pair
                                    (pair
                                        (pair
                                            (pair
                                                nat
                                                (big_map address nat))
                                            (pair
                                                (big_map string bytes)
                                                (map address nat)))
                                        (pair
                                            (pair
                                                (big_map
                                                    (pair address address)
                                                    unit)
                                                bool)
                                            (pair
                                                nat
                                                (big_map
                                                    address
                                                    (pair
                                                        (option nat)
                                                        (map
                                                            bytes
                                                            (pair
                                                                timestamp
                                                                (option nat))))))))
                                    (pair
                                        (pair
                                            (pair
                                                (pair address address)
                                                (pair
                                                    address
                                                    (option address)))
                                            address)
                                        (option address))))
                            (pair
                                (or
                                    (or
                                        (or
                                            (or
                                                unit
                                                (list nat))
                                            (or
                                                (or
                                                    (or
                                                        (pair
                                                            (list
                                                                (pair address nat))
                                                            (contract
                                                                (list
                                                                    (pair
                                                                        (pair address nat)
                                                                        nat))))
                                                        (contract address))
                                                    (or
                                                        (list
                                                            (pair
                                                                address
                                                                (list
                                                                    (pair
                                                                        address
                                                                        (pair nat nat)))))
                                                        (list
                                                            (or
                                                                (pair
                                                                    address
                                                                    (pair address nat))
                                                                (pair
                                                                    address
                                                                    (pair address nat))))))
                                                address))
                                        (or
                                            (or
                                                address
                                                (pair
                                                    address
                                                    (pair
                                                        (option nat)
                                                        nat)))
                                            (or
                                                (list
                                                    (pair address nat))
                                                unit)))
                                    (or
                                        (or
                                            (or
                                                (pair
                                                    key
                                                    (pair signature bytes))
                                                address)
                                            (or
                                                (pair
                                                    address
                                                    (pair
                                                        nat
                                                        (option bytes)))
                                                (option address)))
                                        (or address unit)))
                                string))
                        (pair
                            (pair
                                (pair
                                    (pair
                                        nat
                                        (big_map address nat))
                                    (pair
                                        (big_map string bytes)
                                        (map address nat)))
                                (pair
                                    (pair
                                        (big_map
                                            (pair address address)
                                            unit)
                                        bool)
                                    (pair
                                        nat
                                        (big_map
                                            address
                                            (pair
                                                (option nat)
                                                (map
                                                    bytes
                                                    (pair
                                                        timestamp
                                                        (option nat))))))))
                            (pair
                                (pair
                                    (pair
                                        (pair address address)
                                        (pair
                                            address
                                            (option address)))
                                    address)
                                (option address))))
                    (pair
                        (pair
                            (pair
                                (pair
                                    (pair
                                        nat
                                        (big_map address nat))
                                    (pair
                                        (big_map string bytes)
                                        (map address nat)))
                                (pair
                                    (pair
                                        (big_map
                                            (pair address address)
                                            unit)
                                        bool)
                                    (pair
                                        nat
                                        (big_map
                                            address
                                            (pair
                                                (option nat)
                                                (map
                                                    bytes
                                                    (pair
                                                        timestamp
                                                        (option nat))))))))
                            (pair
                                (pair
                                    (pair
                                        (pair address address)
                                        (pair
                                            address
                                            (option address)))
                                    address)
                                (option address)))
                        (or
                            (or
                                (or
                                    (or
                                        unit
                                        (list nat))
                                    (or
                                        (or
                                            (or
                                                (pair
                                                    (list
                                                        (pair address nat))
                                                    (contract
                                                        (list
                                                            (pair
                                                                (pair address nat)
                                                                nat))))
                                                (contract address))
                                            (or
                                                (list
                                                    (pair
                                                        address
                                                        (list
                                                            (pair
                                                                address
                                                                (pair nat nat)))))
                                                (list
                                                    (or
                                                        (pair
                                                            address
                                                            (pair address nat))
                                                        (pair
                                                            address
                                                            (pair address nat))))))
                                        address))
                                (or
                                    (or
                                        address
                                        (pair
                                            address
                                            (pair
                                                (option nat)
                                                nat)))
                                    (or
                                        (list
                                            (pair address nat))
                                        unit)))
                            (or
                                (or
                                    (or
                                        (pair
                                            key
                                            (pair signature bytes))
                                        address)
                                    (or
                                        (pair
                                            address
                                            (pair
                                                nat
                                                (option bytes)))
                                        (option address)))
                                (or address unit)))))
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                {
                    DUP;
                    CDR;
                    SWAP;
                    CAR;
                    SWAP;
                    DUP;
                    CAR;
                    PUSH string "NOT_CONTRACT_OWNER";
                    DIG 2;
                    CDR;
                    PAIR;
                    SWAP;
                    DUP;
                    CDR;
                    CAR;
                    CAR;
                    CAR;
                    CDR;
                    PAIR;
                    PAIR;
                    EXEC
                };
            SWAP;
            APPLY;
            DIG 3;
            DUP;
            DUG 4;
            LAMBDA
                (pair
                    (lambda
                        (pair
                            (pair
                                address
                                (pair
                                    (pair
                                        (pair
                                            (pair
                                                nat
                                                (big_map address nat))
                                            (pair
                                                (big_map string bytes)
                                                (map address nat)))
                                        (pair
                                            (pair
                                                (big_map
                                                    (pair address address)
                                                    unit)
                                                bool)
                                            (pair
                                                nat
                                                (big_map
                                                    address
                                                    (pair
                                                        (option nat)
                                                        (map
                                                            bytes
                                                            (pair
                                                                timestamp
                                                                (option nat))))))))
                                    (pair
                                        (pair
                                            (pair
                                                (pair address address)
                                                (pair
                                                    address
                                                    (option address)))
                                            address)
                                        (option address))))
                            (pair
                                (or
                                    (or
                                        (or
                                            (or
                                                unit
                                                (list nat))
                                            (or
                                                (or
                                                    (or
                                                        (pair
                                                            (list
                                                                (pair address nat))
                                                            (contract
                                                                (list
                                                                    (pair
                                                                        (pair address nat)
                                                                        nat))))
                                                        (contract address))
                                                    (or
                                                        (list
                                                            (pair
                                                                address
                                                                (list
                                                                    (pair
                                                                        address
                                                                        (pair nat nat)))))
                                                        (list
                                                            (or
                                                                (pair
                                                                    address
                                                                    (pair address nat))
                                                                (pair
                                                                    address
                                                                    (pair address nat))))))
                                                address))
                                        (or
                                            (or
                                                address
                                                (pair
                                                    address
                                                    (pair
                                                        (option nat)
                                                        nat)))
                                            (or
                                                (list
                                                    (pair address nat))
                                                unit)))
                                    (or
                                        (or
                                            (or
                                                (pair
                                                    key
                                                    (pair signature bytes))
                                                address)
                                            (or
                                                (pair
                                                    address
                                                    (pair
                                                        nat
                                                        (option bytes)))
                                                (option address)))
                                        (or address unit)))
                                string))
                        (pair
                            (pair
                                (pair
                                    (pair
                                        nat
                                        (big_map address nat))
                                    (pair
                                        (big_map string bytes)
                                        (map address nat)))
                                (pair
                                    (pair
                                        (big_map
                                            (pair address address)
                                            unit)
                                        bool)
                                    (pair
                                        nat
                                        (big_map
                                            address
                                            (pair
                                                (option nat)
                                                (map
                                                    bytes
                                                    (pair
                                                        timestamp
                                                        (option nat))))))))
                            (pair
                                (pair
                                    (pair
                                        (pair address address)
                                        (pair
                                            address
                                            (option address)))
                                    address)
                                (option address))))
                    (pair
                        (pair
                            (pair
                                (pair
                                    (pair
                                        nat
                                        (big_map address nat))
                                    (pair
                                        (big_map string bytes)
                                        (map address nat)))
                                (pair
                                    (pair
                                        (big_map
                                            (pair address address)
                                            unit)
                                        bool)
                                    (pair
                                        nat
                                        (big_map
                                            address
                                            (pair
                                                (option nat)
                                                (map
                                                    bytes
                                                    (pair
                                                        timestamp
                                                        (option nat))))))))
                            (pair
                                (pair
                                    (pair
                                        (pair address address)
                                        (pair
                                            address
                                            (option address)))
                                    address)
                                (option address)))
                        (or
                            (or
                                (or
                                    (or
                                        unit
                                        (list nat))
                                    (or
                                        (or
                                            (or
                                                (pair
                                                    (list
                                                        (pair address nat))
                                                    (contract
                                                        (list
                                                            (pair
                                                                (pair address nat)
                                                                nat))))
                                                (contract address))
                                            (or
                                                (list
                                                    (pair
                                                        address
                                                        (list
                                                            (pair
                                                                address
                                                                (pair nat nat)))))
                                                (list
                                                    (or
                                                        (pair
                                                            address
                                                            (pair address nat))
                                                        (pair
                                                            address
                                                            (pair address nat))))))
                                        address))
                                (or
                                    (or
                                        address
                                        (pair
                                            address
                                            (pair
                                                (option nat)
                                                nat)))
                                    (or
                                        (list
                                            (pair address nat))
                                        unit)))
                            (or
                                (or
                                    (or
                                        (pair
                                            key
                                            (pair signature bytes))
                                        address)
                                    (or
                                        (pair
                                            address
                                            (pair
                                                nat
                                                (option bytes)))
                                        (option address)))
                                (or address unit)))))
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                {
                    DUP;
                    CDR;
                    SWAP;
                    CAR;
                    SWAP;
                    DUP;
                    CAR;
                    PUSH string "NOT_MASTER_MINTER";
                    DIG 2;
                    CDR;
                    PAIR;
                    SWAP;
                    DUP;
                    CDR;
                    CAR;
                    CAR;
                    CAR;
                    CAR;
                    PAIR;
                    PAIR;
                    EXEC
                };
            SWAP;
            APPLY;
            LAMBDA
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                unit
                {
                    CAR;
                    CAR;
                    CDR;
                    CDR;
                    SENDER;
                    GET;
                    IF_NONE
                        {
                            PUSH string "NOT_MINTER";
                            FAILWITH
                        }
                        {
                            DROP;
                            UNIT
                        }
                };
            DIG 3;
            DUP;
            DUG 4;
            LAMBDA
                (pair
                    (lambda
                        (pair bool string)
                        unit)
                    (pair
                        (pair
                            (pair
                                (pair
                                    nat
                                    (big_map address nat))
                                (pair
                                    (big_map string bytes)
                                    (map address nat)))
                            (pair
                                (pair
                                    (big_map
                                        (pair address address)
                                        unit)
                                    bool)
                                (pair
                                    nat
                                    (big_map
                                        address
                                        (pair
                                            (option nat)
                                            (map
                                                bytes
                                                (pair
                                                    timestamp
                                                    (option nat))))))))
                        (pair
                            (pair
                                (pair
                                    (pair address address)
                                    (pair
                                        address
                                        (option address)))
                                address)
                            (option address))))
                unit
                {
                    DUP;
                    CDR;
                    SWAP;
                    CAR;
                    SWAP;
                    PUSH string "CONTRACT_PAUSED";
                    SWAP;
                    CAR;
                    CDR;
                    CAR;
                    CDR;
                    PAIR;
                    EXEC
                };
            SWAP;
            APPLY;
            LAMBDA
                (pair
                    (pair nat address)
                    (pair
                        (pair
                            (pair
                                (pair
                                    nat
                                    (big_map address nat))
                                (pair
                                    (big_map string bytes)
                                    (map address nat)))
                            (pair
                                (pair
                                    (big_map
                                        (pair address address)
                                        unit)
                                    bool)
                                (pair
                                    nat
                                    (big_map
                                        address
                                        (pair
                                            (option nat)
                                            (map
                                                bytes
                                                (pair
                                                    timestamp
                                                    (option nat))))))))
                        (pair
                            (pair
                                (pair
                                    (pair address address)
                                    (pair
                                        address
                                        (option address)))
                                address)
                            (option address))))
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                {
                    DUP;
                    CAR;
                    SWAP;
                    CDR;
                    PUSH nat 0;
                    DIG 2;
                    DUP;
                    DUG 3;
                    CAR;
                    DIG 2;
                    DUP;
                    DUG 3;
                    CAR;
                    CAR;
                    CAR;
                    CDR;
                    DIG 4;
                    DUP;
                    DUG 5;
                    CDR;
                    GET;
                    IF_NONE
                        {
                            SWAP
                        }
                        {
                            DIG 2;
                            SWAP;
                            DIP
                                {
                                    DROP
                                }
                        };
                    ADD;
                    SWAP;
                    DUP;
                    CAR;
                    CAR;
                    CAR;
                    CDR;
                    DIG 2;
                    SOME;
                    DIG 3;
                    CDR;
                    UPDATE;
                    DIP
                        {
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            CAR
                        };
                    SWAP;
                    PAIR;
                    PAIR;
                    PAIR;
                    PAIR
                };
            LAMBDA
                (pair
                    (pair nat address)
                    (pair
                        (pair
                            (pair
                                (pair
                                    nat
                                    (big_map address nat))
                                (pair
                                    (big_map string bytes)
                                    (map address nat)))
                            (pair
                                (pair
                                    (big_map
                                        (pair address address)
                                        unit)
                                    bool)
                                (pair
                                    nat
                                    (big_map
                                        address
                                        (pair
                                            (option nat)
                                            (map
                                                bytes
                                                (pair
                                                    timestamp
                                                    (option nat))))))))
                        (pair
                            (pair
                                (pair
                                    (pair address address)
                                    (pair
                                        address
                                        (option address)))
                                address)
                            (option address))))
                (pair
                    (pair
                        (pair
                            (pair
                                nat
                                (big_map address nat))
                            (pair
                                (big_map string bytes)
                                (map address nat)))
                        (pair
                            (pair
                                (big_map
                                    (pair address address)
                                    unit)
                                bool)
                            (pair
                                nat
                                (big_map
                                    address
                                    (pair
                                        (option nat)
                                        (map
                                            bytes
                                            (pair
                                                timestamp
                                                (option nat))))))))
                    (pair
                        (pair
                            (pair
                                (pair address address)
                                (pair
                                    address
                                    (option address)))
                            address)
                        (option address)))
                {
                    DUP;
                    CAR;
                    SWAP;
                    CDR;
                    SWAP;
                    DUP;
                    DUG 2;
                    CAR;
                    SWAP;
                    DUP;
                    DUG 2;
                    CAR;
                    CAR;
                    CAR;
                    CDR;
                    DIG 3;
                    DUP;
                    DUG 4;
                    CDR;
                    GET;
                    IF_NONE
                        {
                            PUSH nat 0
                        }
                        {
                        };
                    SUB;
                    ISNAT;
                    IF_NONE
                        {
                            PUSH string "FA2_INSUFFICIENT_BALANCE";
                            FAILWITH
                        }
                        {
                            PUSH nat 0;
                            SWAP;
                            DUP;
                            DUG 2;
                            COMPARE;
                            EQ;
                            IF
                                {
                                    DROP;
                                    NONE nat
                                }
                                {
                                    SOME
                                }
                        };
                    SWAP;
                    DUP;
                    CAR;
                    CAR;
                    CAR;
                    CDR;
                    DIG 2;
                    DIG 3;
                    CDR;
                    UPDATE;
                    DIP
                        {
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            DUP;
                            CDR;
                            SWAP;
                            CAR;
                            CAR
                        };
                    SWAP;
                    PAIR;
                    PAIR;
                    PAIR;
                    PAIR
                };
            LAMBDA
                (pair
                    (option address)
                    (list address))
                (list operation)
                {
                    NIL operation;
                    SWAP;
                    DUP;
                    DUG 2;
                    CAR;
                    IF_NONE
                        {
                            SWAP;
                            DROP
                        }
                        {
                            CONTRACT %assertReceivers
                                (list address);
                            IF_NONE
                                {
                                    DROP 2;
                                    PUSH string "BAD_TRANSFERLIST_CONTRACT";
                                    FAILWITH
                                }
                                {
                                    PUSH mutez 0;
                                    DIG 3;
                                    CDR;
                                    TRANSFER_TOKENS;
                                    CONS
                                }
                        }
                };
            DIG 12;
            DUP;
            DUG 13;
            CAR;
            DIG 13;
            CDR;
            PUSH string "XTZ_RECEIVED";
            PUSH mutez 0;
            AMOUNT;
            COMPARE;
            NEQ;
            PAIR;
            DIG 10;
            DUP;
            DUG 11;
            SWAP;
            EXEC;
            DROP;
            SWAP;
            DUP;
            DUG 2;
            IF_LEFT
                {
                    DIG 10;
                    DROP;
                    DIG 10;
                    DROP;
                    DIG 11;
                    DROP;
                    IF_LEFT
                        {
                            DIG 8;
                            DROP;
                            IF_LEFT
                                {
                                    DIG 5;
                                    DROP;
                                    DIG 7;
                                    DROP;
                                    DIG 8;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            PAIR;
                                            CDR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            DUP;
                                            CDR;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CDR;
                                            IF_NONE
                                                {
                                                    DROP 3;
                                                    PUSH string "NO_PENDING_OWNER_SET";
                                                    FAILWITH
                                                }
                                                {
                                                    DUP;
                                                    PUSH string "NOT_PENDING_OWNER";
                                                    DIG 4;
                                                    CDR;
                                                    PAIR;
                                                    DIG 3;
                                                    DIG 3;
                                                    PAIR;
                                                    PAIR;
                                                    DIG 2;
                                                    SWAP;
                                                    EXEC;
                                                    PAIR
                                                };
                                            DUP;
                                            CAR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            CDR;
                                            CAR;
                                            CAR;
                                            DUP;
                                            CAR;
                                            SWAP;
                                            CDR;
                                            CAR;
                                            NONE address;
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    CDR
                                                };
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CAR;
                                            CDR;
                                            CAR;
                                            CAR;
                                            DUP;
                                            CAR;
                                            SWAP;
                                            CDR;
                                            CAR;
                                            NONE address;
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    CDR
                                                };
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            CDR;
                                            CAR;
                                            CAR;
                                            DIG 2;
                                            CDR;
                                            DIP
                                                {
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    CDR
                                                };
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                        {
                                            DIG 2;
                                            DROP;
                                            DIG 6;
                                            DROP;
                                            PAIR;
                                            DUP;
                                            CDR;
                                            DUP;
                                            DIG 5;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            DUP;
                                            DIG 5;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            SENDER;
                                            NIL address;
                                            SENDER;
                                            CONS;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CDR;
                                            PAIR;
                                            DIG 4;
                                            SWAP;
                                            EXEC;
                                            DIG 2;
                                            DIG 3;
                                            CAR;
                                            ITER
                                                {
                                                    SWAP;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    DIG 3;
                                                    DUP;
                                                    DUG 4;
                                                    DIG 2;
                                                    CDR;
                                                    PAIR;
                                                    PAIR;
                                                    DIG 3;
                                                    DUP;
                                                    DUG 4;
                                                    SWAP;
                                                    EXEC
                                                };
                                            DIG 2;
                                            DROP;
                                            DIG 2;
                                            DROP;
                                            SWAP;
                                            PAIR
                                        }
                                }
                                {
                                    DIG 3;
                                    DROP;
                                    DIG 6;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 6;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CDR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CDR;
                                            DIG 2;
                                            CAR;
                                            CAR;
                                            IF_LEFT
                                                {
                                                    SWAP;
                                                    DROP;
                                                    DIG 2;
                                                    DROP;
                                                    DIG 2;
                                                    DROP;
                                                    DIG 2;
                                                    DROP;
                                                    DIG 2;
                                                    DROP;
                                                    IF_LEFT
                                                        {
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            MAP
                                                                {
                                                                    DUP;
                                                                    CDR;
                                                                    DIG 4;
                                                                    DUP;
                                                                    DUG 5;
                                                                    SWAP;
                                                                    EXEC;
                                                                    DROP;
                                                                    PUSH nat 0;
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    CAR;
                                                                    CAR;
                                                                    CAR;
                                                                    CDR;
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    CAR;
                                                                    GET;
                                                                    IF_NONE
                                                                        {
                                                                        }
                                                                        {
                                                                            DIP
                                                                                {
                                                                                    DROP
                                                                                }
                                                                        };
                                                                    SWAP;
                                                                    PAIR
                                                                };
                                                            DIG 3;
                                                            DROP;
                                                            DIG 2;
                                                            CDR;
                                                            PUSH mutez 0;
                                                            DIG 2;
                                                            TRANSFER_TOKENS;
                                                            SWAP;
                                                            NIL operation;
                                                            DIG 2;
                                                            CONS;
                                                            PAIR
                                                        }
                                                        {
                                                            DIG 2;
                                                            DROP;
                                                            PAIR;
                                                            DUP;
                                                            CDR;
                                                            DUP;
                                                            NIL operation;
                                                            DIG 3;
                                                            CAR;
                                                            PUSH mutez 0;
                                                            DIG 4;
                                                            CDR;
                                                            CAR;
                                                            CDR;
                                                            TRANSFER_TOKENS;
                                                            CONS;
                                                            PAIR
                                                        }
                                                }
                                                {
                                                    IF_LEFT
                                                        {
                                                            SWAP;
                                                            DUG 2;
                                                            PAIR;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            CAR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CDR;
                                                            DUP;
                                                            DIG 6;
                                                            SWAP;
                                                            EXEC;
                                                            DROP;
                                                            DIG 2;
                                                            CDR;
                                                            SWAP;
                                                            DIG 2;
                                                            DUP;
                                                            DUG 3;
                                                            PAIR;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            CAR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CDR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            MAP
                                                                {
                                                                    SWAP;
                                                                    DUP;
                                                                    DUG 2;
                                                                    CAR;
                                                                    CDR;
                                                                    CAR;
                                                                    CAR;
                                                                    SWAP;
                                                                    PAIR;
                                                                    SENDER;
                                                                    SWAP;
                                                                    DUP;
                                                                    DUG 2;
                                                                    CAR;
                                                                    CAR;
                                                                    DIG 2;
                                                                    CDR;
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    PAIR;
                                                                    MEM;
                                                                    DUG 2;
                                                                    COMPARE;
                                                                    EQ;
                                                                    OR;
                                                                    IF
                                                                        {
                                                                            PUSH bool True
                                                                        }
                                                                        {
                                                                            PUSH bool False
                                                                        }
                                                                };
                                                            PUSH bool True;
                                                            SWAP;
                                                            ITER
                                                                {
                                                                    AND
                                                                };
                                                            IF
                                                                {
                                                                    SWAP;
                                                                    DROP;
                                                                    SWAP;
                                                                    DROP;
                                                                    DIG 4;
                                                                    DROP
                                                                }
                                                                {
                                                                    SWAP;
                                                                    IF_CONS
                                                                        {
                                                                            CAR;
                                                                            PUSH string "FA2_NOT_OPERATOR";
                                                                            DIG 4;
                                                                            CDR;
                                                                            PAIR;
                                                                            DIG 3;
                                                                            DIG 2;
                                                                            DUP;
                                                                            DUG 3;
                                                                            PAIR;
                                                                            PAIR;
                                                                            DIG 6;
                                                                            SWAP;
                                                                            EXEC;
                                                                            DIG 2;
                                                                            ITER
                                                                                {
                                                                                    DIG 2;
                                                                                    DUP;
                                                                                    DUG 3;
                                                                                    SWAP;
                                                                                    CAR;
                                                                                    COMPARE;
                                                                                    NEQ;
                                                                                    IF
                                                                                        {
                                                                                            PUSH string "FA2_NOT_OPERATOR";
                                                                                            FAILWITH
                                                                                        }
                                                                                        {
                                                                                            UNIT
                                                                                        };
                                                                                    DROP
                                                                                };
                                                                            SWAP;
                                                                            DROP
                                                                        }
                                                                        {
                                                                            SWAP;
                                                                            DROP;
                                                                            DIG 4;
                                                                            DROP
                                                                        }
                                                                };
                                                            DUP;
                                                            NIL operation;
                                                            PAIR;
                                                            DIG 2;
                                                            DUP;
                                                            DUG 3;
                                                            ITER
                                                                {
                                                                    DIG 3;
                                                                    DUP;
                                                                    DUG 4;
                                                                    DIG 3;
                                                                    DUP;
                                                                    DUG 4;
                                                                    CDR;
                                                                    CDR;
                                                                    PAIR;
                                                                    DUP;
                                                                    CAR;
                                                                    IF_NONE
                                                                        {
                                                                            DROP;
                                                                            NIL operation
                                                                        }
                                                                        {
                                                                            CONTRACT %assertTransfers
                                                                                (list
                                                                                    (pair
                                                                                        (address %from)
                                                                                        (list %tos address)));
                                                                            IF_NONE
                                                                                {
                                                                                    DROP;
                                                                                    PUSH string "BAD_TRANSFERLIST_CONTRACT";
                                                                                    FAILWITH
                                                                                }
                                                                                {
                                                                                    NIL operation;
                                                                                    SWAP;
                                                                                    PUSH mutez 0;
                                                                                    DIG 3;
                                                                                    CDR;
                                                                                    MAP
                                                                                        {
                                                                                            DUP;
                                                                                            CDR;
                                                                                            MAP
                                                                                                {
                                                                                                    CAR
                                                                                                };
                                                                                            SWAP;
                                                                                            CAR;
                                                                                            PAIR
                                                                                        };
                                                                                    TRANSFER_TOKENS;
                                                                                    CONS
                                                                                }
                                                                        };
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    CDR;
                                                                    DIG 2;
                                                                    DUP;
                                                                    DUG 3;
                                                                    CDR;
                                                                    ITER
                                                                        {
                                                                            SWAP;
                                                                            PAIR;
                                                                            DUP;
                                                                            CDR;
                                                                            DUP;
                                                                            CDR;
                                                                            CAR;
                                                                            DIG 10;
                                                                            DUP;
                                                                            DUG 11;
                                                                            SWAP;
                                                                            EXEC;
                                                                            DROP;
                                                                            SWAP;
                                                                            CAR;
                                                                            DIG 3;
                                                                            DUP;
                                                                            DUG 4;
                                                                            CAR;
                                                                            DIG 2;
                                                                            DUP;
                                                                            DUG 3;
                                                                            CDR;
                                                                            CDR;
                                                                            PAIR;
                                                                            PAIR;
                                                                            DIG 7;
                                                                            DUP;
                                                                            DUG 8;
                                                                            SWAP;
                                                                            EXEC;
                                                                            SWAP;
                                                                            DUP;
                                                                            DUG 2;
                                                                            CAR;
                                                                            DIG 2;
                                                                            CDR;
                                                                            CDR;
                                                                            PAIR;
                                                                            PAIR;
                                                                            DIG 7;
                                                                            DUP;
                                                                            DUG 8;
                                                                            SWAP;
                                                                            EXEC
                                                                        };
                                                                    DIG 2;
                                                                    DROP;
                                                                    DIG 2;
                                                                    CAR;
                                                                    DIG 2;
                                                                    ITER
                                                                        {
                                                                            CONS
                                                                        };
                                                                    PAIR
                                                                };
                                                            SWAP;
                                                            DROP;
                                                            SWAP;
                                                            DROP;
                                                            SWAP;
                                                            DROP;
                                                            SWAP;
                                                            DROP;
                                                            SWAP;
                                                            DROP
                                                        }
                                                        {
                                                            DIG 3;
                                                            DROP;
                                                            DIG 3;
                                                            DROP;
                                                            SWAP;
                                                            DUG 2;
                                                            PAIR;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            CAR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CDR;
                                                            DUP;
                                                            DIG 4;
                                                            SWAP;
                                                            EXEC;
                                                            DROP;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            MAP
                                                                {
                                                                    IF_LEFT
                                                                        {
                                                                            CAR
                                                                        }
                                                                        {
                                                                            CAR
                                                                        }
                                                                };
                                                            PUSH string "NOT_TOKEN_OWNER";
                                                            SWAP;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            IF_CONS
                                                                {
                                                                    SWAP;
                                                                    ITER
                                                                        {
                                                                            SWAP;
                                                                            DUP;
                                                                            DUG 2;
                                                                            SWAP;
                                                                            COMPARE;
                                                                            NEQ;
                                                                            IF
                                                                                {
                                                                                    SWAP;
                                                                                    DUP;
                                                                                    DUG 2;
                                                                                    CDR;
                                                                                    FAILWITH
                                                                                }
                                                                                {
                                                                                    UNIT
                                                                                };
                                                                            DROP
                                                                        };
                                                                    SWAP;
                                                                    DROP;
                                                                    SOME
                                                                }
                                                                {
                                                                    DROP;
                                                                    NONE address
                                                                };
                                                            IF_NONE
                                                                {
                                                                    DIG 2;
                                                                    DROP;
                                                                    DIG 2;
                                                                    DROP
                                                                }
                                                                {
                                                                    PUSH string "NOT_TOKEN_OWNER";
                                                                    DIG 4;
                                                                    CDR;
                                                                    PAIR;
                                                                    DUG 2;
                                                                    PAIR;
                                                                    PAIR;
                                                                    DIG 2;
                                                                    SWAP;
                                                                    EXEC
                                                                };
                                                            DUP;
                                                            CAR;
                                                            CDR;
                                                            CAR;
                                                            CAR;
                                                            DIG 2;
                                                            ITER
                                                                {
                                                                    IF_LEFT
                                                                        {
                                                                            PAIR;
                                                                            DUP;
                                                                            CAR;
                                                                            DUP;
                                                                            CDR;
                                                                            CDR;
                                                                            DIG 4;
                                                                            DUP;
                                                                            DUG 5;
                                                                            SWAP;
                                                                            EXEC;
                                                                            DROP;
                                                                            SWAP;
                                                                            CDR;
                                                                            UNIT;
                                                                            SOME;
                                                                            DIG 2;
                                                                            DUP;
                                                                            DUG 3;
                                                                            CDR;
                                                                            CAR;
                                                                            DIG 3;
                                                                            CAR;
                                                                            PAIR;
                                                                            UPDATE
                                                                        }
                                                                        {
                                                                            PAIR;
                                                                            DUP;
                                                                            CAR;
                                                                            DUP;
                                                                            CDR;
                                                                            CDR;
                                                                            DIG 4;
                                                                            DUP;
                                                                            DUG 5;
                                                                            SWAP;
                                                                            EXEC;
                                                                            DROP;
                                                                            SWAP;
                                                                            CDR;
                                                                            SWAP;
                                                                            DUP;
                                                                            DUG 2;
                                                                            CDR;
                                                                            CAR;
                                                                            DIG 2;
                                                                            CAR;
                                                                            PAIR;
                                                                            NONE unit;
                                                                            SWAP;
                                                                            UPDATE
                                                                        }
                                                                };
                                                            DIG 2;
                                                            DROP;
                                                            DIP
                                                                {
                                                                    DUP;
                                                                    CDR;
                                                                    SWAP;
                                                                    CAR;
                                                                    DUP;
                                                                    CAR;
                                                                    SWAP;
                                                                    CDR;
                                                                    DUP;
                                                                    CDR;
                                                                    SWAP;
                                                                    CAR;
                                                                    CDR
                                                                };
                                                            PAIR;
                                                            PAIR;
                                                            SWAP;
                                                            PAIR;
                                                            PAIR;
                                                            NIL operation;
                                                            PAIR
                                                        }
                                                }
                                        }
                                        {
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            CDR;
                                            PAIR;
                                            DIG 2;
                                            SWAP;
                                            EXEC;
                                            SWAP;
                                            CAR;
                                            CAR;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    CDR
                                                };
                                            PAIR;
                                            PAIR;
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                }
                        }
                        {
                            DIG 4;
                            DROP;
                            DIG 10;
                            DROP;
                            IF_LEFT
                                {
                                    DIG 3;
                                    DROP;
                                    DIG 3;
                                    DROP;
                                    DIG 4;
                                    DROP;
                                    DIG 6;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            CDR;
                                            PAIR;
                                            DIG 2;
                                            SWAP;
                                            EXEC;
                                            SWAP;
                                            CAR;
                                            CAR;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CDR
                                                };
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                        {
                                            DIG 5;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CAR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            CDR;
                                            DUP;
                                            DIG 4;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            DIG 2;
                                            CDR;
                                            SWAP;
                                            PAIR;
                                            DIG 2;
                                            SWAP;
                                            EXEC;
                                            DUP;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CDR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CAR;
                                            GET;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CAR;
                                            IF_NONE
                                                {
                                                    IF_NONE
                                                        {
                                                            PUSH nat 12;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CAR;
                                                            CDR;
                                                            CDR;
                                                            SIZE;
                                                            COMPARE;
                                                            GE;
                                                            IF
                                                                {
                                                                    PUSH string "MINTER_LIMIT_REACHED";
                                                                    FAILWITH
                                                                }
                                                                {
                                                                    UNIT
                                                                }
                                                        }
                                                        {
                                                            DROP;
                                                            PUSH string "CURRENT_ALLOWANCE_REQUIRED";
                                                            FAILWITH
                                                        }
                                                }
                                                {
                                                    SWAP;
                                                    IF_NONE
                                                        {
                                                            DROP;
                                                            PUSH string "ADDR_NOT_MINTER";
                                                            FAILWITH
                                                        }
                                                        {
                                                            COMPARE;
                                                            NEQ;
                                                            IF
                                                                {
                                                                    PUSH string "ALLOWANCE_MISMATCH";
                                                                    FAILWITH
                                                                }
                                                                {
                                                                    UNIT
                                                                }
                                                        }
                                                };
                                            DROP;
                                            DUP;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CDR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CDR;
                                            SOME;
                                            DIG 3;
                                            CAR;
                                            UPDATE;
                                            DIP
                                                {
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                }
                                {
                                    DIG 7;
                                    DROP;
                                    DIG 7;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 2;
                                            DROP;
                                            DIG 6;
                                            DROP;
                                            SWAP;
                                            DUP;
                                            DIG 5;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            DUP;
                                            DIG 5;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            SENDER;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            MAP
                                                {
                                                    CAR
                                                };
                                            SENDER;
                                            CONS;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CDR;
                                            PAIR;
                                            DIG 4;
                                            SWAP;
                                            EXEC;
                                            DIG 2;
                                            DIG 3;
                                            ITER
                                                {
                                                    SWAP;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    DIG 4;
                                                    DUP;
                                                    DUG 5;
                                                    GET;
                                                    IF_NONE
                                                        {
                                                            DROP 2;
                                                            PUSH string "NOT_MINTER";
                                                            FAILWITH
                                                        }
                                                        {
                                                            DIG 2;
                                                            CDR;
                                                            DIG 2;
                                                            PAIR;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            CAR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CDR;
                                                            DUP;
                                                            CAR;
                                                            SWAP;
                                                            CDR;
                                                            PAIR;
                                                            DUP;
                                                            CAR;
                                                            DIG 3;
                                                            CDR;
                                                            SUB;
                                                            ISNAT;
                                                            IF_NONE
                                                                {
                                                                    PUSH string "ALLOWANCE_EXCEEDED";
                                                                    FAILWITH
                                                                }
                                                                {
                                                                };
                                                            DIG 2;
                                                            DUP;
                                                            DUG 3;
                                                            CAR;
                                                            CAR;
                                                            CDR;
                                                            CDR;
                                                            SWAP;
                                                            SOME;
                                                            SENDER;
                                                            UPDATE;
                                                            DIG 2;
                                                            SWAP;
                                                            DIP
                                                                {
                                                                    DUP;
                                                                    CDR;
                                                                    SWAP;
                                                                    CAR;
                                                                    DUP;
                                                                    CDR;
                                                                    SWAP;
                                                                    CAR;
                                                                    DUP;
                                                                    CAR;
                                                                    SWAP;
                                                                    CDR;
                                                                    CAR
                                                                };
                                                            SWAP;
                                                            PAIR;
                                                            SWAP;
                                                            PAIR;
                                                            PAIR;
                                                            PAIR;
                                                            SWAP;
                                                            PAIR;
                                                            DIG 3;
                                                            DUP;
                                                            DUG 4;
                                                            SWAP;
                                                            EXEC
                                                        }
                                                };
                                            DIG 2;
                                            DROP;
                                            DIG 2;
                                            DROP;
                                            SWAP;
                                            PAIR
                                        }
                                        {
                                            DIG 3;
                                            DROP;
                                            DIG 3;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CDR;
                                            DUP;
                                            DIG 3;
                                            SWAP;
                                            EXEC;
                                            DROP;
                                            PUSH string "NOT_PAUSER";
                                            DIG 2;
                                            CDR;
                                            PAIR;
                                            SWAP;
                                            DUP;
                                            CDR;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CAR;
                                            PAIR;
                                            PAIR;
                                            EXEC;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            CAR;
                                            DUP;
                                            CAR;
                                            SWAP;
                                            CDR;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            CAR;
                                            CAR;
                                            PUSH bool True;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                }
                        }
                }
                {
                    DIG 3;
                    DROP;
                    DIG 3;
                    DROP;
                    DIG 3;
                    DROP;
                    DIG 3;
                    DROP;
                    DIG 3;
                    DROP;
                    DIG 9;
                    DROP;
                    IF_LEFT
                        {
                            DIG 5;
                            DROP;
                            IF_LEFT
                                {
                                    DIG 4;
                                    DROP;
                                    DIG 5;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 2;
                                            DROP;
                                            DIG 2;
                                            DROP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CDR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            HASH_KEY;
                                            IMPLICIT_ACCOUNT;
                                            ADDRESS;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            DIG 4;
                                            DUP;
                                            DUG 5;
                                            CAR;
                                            CDR;
                                            CDR;
                                            CAR;
                                            PAIR;
                                            CHAIN_ID;
                                            SELF;
                                            ADDRESS;
                                            PAIR;
                                            PAIR;
                                            PACK;
                                            DUP;
                                            DIG 6;
                                            CDR;
                                            CAR;
                                            DIG 5;
                                            CHECK_SIGNATURE;
                                            IF
                                                {
                                                    DROP;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    PUSH nat 1;
                                                    DIG 4;
                                                    DUP;
                                                    DUG 5;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    CAR;
                                                    ADD;
                                                    DIP
                                                        {
                                                            DUP;
                                                            CDR;
                                                            SWAP;
                                                            CAR;
                                                            DUP;
                                                            CAR;
                                                            SWAP;
                                                            CDR;
                                                            DUP;
                                                            CAR;
                                                            SWAP;
                                                            CDR;
                                                            CDR
                                                        };
                                                    PAIR;
                                                    SWAP;
                                                    PAIR;
                                                    SWAP;
                                                    PAIR;
                                                    PAIR;
                                                    DIG 3;
                                                    DUP;
                                                    DUG 4;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    CDR;
                                                    DIG 3;
                                                    PAIR;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    DIG 4;
                                                    DUP;
                                                    DUG 5;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    PAIR;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    CDR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CDR;
                                                    CAR;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    CDR;
                                                    CDR;
                                                    DUP;
                                                    DIG 3;
                                                    DUP;
                                                    DUG 4;
                                                    GET;
                                                    IF_NONE
                                                        {
                                                            DIG 7
                                                        }
                                                        {
                                                            DIG 8;
                                                            DROP
                                                        };
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    PAIR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CAR;
                                                    DIG 6;
                                                    CAR;
                                                    CAR;
                                                    PAIR;
                                                    PAIR;
                                                    DUP;
                                                    CDR;
                                                    CAR;
                                                    CDR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CDR;
                                                    CDR;
                                                    GET;
                                                    IF_NONE
                                                        {
                                                            DROP;
                                                            UNIT
                                                        }
                                                        {
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CAR;
                                                            CDR;
                                                            DIG 2;
                                                            CAR;
                                                            CAR;
                                                            PAIR;
                                                            PAIR;
                                                            DIG 8;
                                                            DUP;
                                                            DUG 9;
                                                            SWAP;
                                                            EXEC;
                                                            IF
                                                                {
                                                                    UNIT
                                                                }
                                                                {
                                                                    PUSH string "DUP_PERMIT";
                                                                    FAILWITH
                                                                }
                                                        };
                                                    DROP;
                                                    DUP;
                                                    CDR;
                                                    NONE nat;
                                                    NOW;
                                                    PAIR;
                                                    DIG 4;
                                                    SWAP;
                                                    SOME;
                                                    SWAP;
                                                    UPDATE;
                                                    SWAP;
                                                    CAR;
                                                    PAIR;
                                                    SOME;
                                                    DIG 2;
                                                    UPDATE;
                                                    DIG 2;
                                                    DIG 3;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    PAIR;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    CDR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CDR;
                                                    DUP;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    GET;
                                                    IF_NONE
                                                        {
                                                            SWAP;
                                                            DROP;
                                                            SWAP;
                                                            DROP;
                                                            DIG 2;
                                                            DROP
                                                        }
                                                        {
                                                            DUP;
                                                            CDR;
                                                            SWAP;
                                                            DUP;
                                                            DUG 2;
                                                            CDR;
                                                            ITER
                                                                {
                                                                    DUP;
                                                                    CDR;
                                                                    DIG 3;
                                                                    DUP;
                                                                    DUG 4;
                                                                    CAR;
                                                                    DIG 7;
                                                                    DUP;
                                                                    DUG 8;
                                                                    CAR;
                                                                    CAR;
                                                                    PAIR;
                                                                    PAIR;
                                                                    DIG 8;
                                                                    DUP;
                                                                    DUG 9;
                                                                    SWAP;
                                                                    EXEC;
                                                                    IF
                                                                        {
                                                                            CAR;
                                                                            NONE
                                                                                (pair
                                                                                    timestamp
                                                                                    (option nat));
                                                                            SWAP;
                                                                            UPDATE
                                                                        }
                                                                        {
                                                                            DROP
                                                                        }
                                                                };
                                                            DIG 4;
                                                            DROP;
                                                            DIG 5;
                                                            DROP;
                                                            SWAP;
                                                            CAR;
                                                            PAIR;
                                                            SOME;
                                                            DIG 2;
                                                            UPDATE
                                                        };
                                                    DIP
                                                        {
                                                            DUP;
                                                            CDR;
                                                            SWAP;
                                                            CAR;
                                                            DUP;
                                                            CAR;
                                                            SWAP;
                                                            CDR;
                                                            DUP;
                                                            CAR;
                                                            SWAP;
                                                            CDR;
                                                            CAR
                                                        };
                                                    SWAP;
                                                    PAIR;
                                                    SWAP;
                                                    PAIR;
                                                    SWAP;
                                                    PAIR;
                                                    PAIR
                                                }
                                                {
                                                    SWAP;
                                                    DROP;
                                                    SWAP;
                                                    DROP;
                                                    SWAP;
                                                    DROP;
                                                    SWAP;
                                                    DROP;
                                                    SWAP;
                                                    DROP;
                                                    PUSH string "MISSIGNED";
                                                    PAIR;
                                                    FAILWITH
                                                };
                                            NIL operation;
                                            PAIR
                                        }
                                        {
                                            DIG 4;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CAR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CDR;
                                            DIG 2;
                                            CAR;
                                            CDR;
                                            PAIR;
                                            DIG 2;
                                            SWAP;
                                            EXEC;
                                            DUP;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CDR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            GET;
                                            IF_NONE
                                                {
                                                    PUSH string "ADDR_NOT_MINTER";
                                                    FAILWITH
                                                }
                                                {
                                                    DROP;
                                                    UNIT
                                                };
                                            DROP;
                                            DUP;
                                            CAR;
                                            CAR;
                                            CDR;
                                            CDR;
                                            DIG 2;
                                            NONE nat;
                                            SWAP;
                                            UPDATE;
                                            DIP
                                                {
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                }
                                {
                                    DIG 3;
                                    DROP;
                                    IF_LEFT
                                        {
                                            DIG 3;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CAR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            CDR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CAR;
                                            DIG 2;
                                            DUP;
                                            DUG 3;
                                            CDR;
                                            CAR;
                                            PUSH string "NOT_PERMIT_ISSUER";
                                            DIG 5;
                                            CDR;
                                            PAIR;
                                            DIG 3;
                                            DUP;
                                            DUG 4;
                                            DIG 3;
                                            DUP;
                                            DUG 4;
                                            PAIR;
                                            PAIR;
                                            DIG 6;
                                            SWAP;
                                            EXEC;
                                            DIG 4;
                                            CDR;
                                            CDR;
                                            IF_NONE
                                                {
                                                    DIG 3;
                                                    DROP;
                                                    DIG 4;
                                                    DROP;
                                                    DUP;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    CDR;
                                                    DIG 2;
                                                    DIG 3;
                                                    PAIR;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    CAR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CDR;
                                                    DUP;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    GET;
                                                    IF_NONE
                                                        {
                                                            DIG 4
                                                        }
                                                        {
                                                            DIG 5;
                                                            DROP
                                                        };
                                                    DIG 3;
                                                    CAR;
                                                    CDR;
                                                    SOME;
                                                    SWAP;
                                                    CDR;
                                                    SWAP;
                                                    PAIR;
                                                    SOME;
                                                    DIG 2;
                                                    UPDATE
                                                }
                                                {
                                                    DIG 5;
                                                    DROP;
                                                    DIG 4;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    CDR;
                                                    DIG 4;
                                                    PAIR;
                                                    DIG 2;
                                                    DIG 4;
                                                    PAIR;
                                                    PAIR;
                                                    PAIR;
                                                    DUP;
                                                    CAR;
                                                    CAR;
                                                    CAR;
                                                    SWAP;
                                                    DUP;
                                                    DUG 2;
                                                    CAR;
                                                    CAR;
                                                    CDR;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    CAR;
                                                    CDR;
                                                    CAR;
                                                    DIG 3;
                                                    DUP;
                                                    DUG 4;
                                                    CAR;
                                                    CDR;
                                                    CDR;
                                                    PUSH nat 31557600000;
                                                    DIG 2;
                                                    DUP;
                                                    DUG 3;
                                                    COMPARE;
                                                    LT;
                                                    IF
                                                        {
                                                            DUP;
                                                            DIG 4;
                                                            DUP;
                                                            DUG 5;
                                                            GET;
                                                            IF_NONE
                                                                {
                                                                    SWAP;
                                                                    DROP;
                                                                    SWAP;
                                                                    DROP;
                                                                    SWAP;
                                                                    DROP;
                                                                    SWAP;
                                                                    DROP;
                                                                    DIG 2;
                                                                    DROP
                                                                }
                                                                {
                                                                    DUP;
                                                                    CDR;
                                                                    DIG 4;
                                                                    DUP;
                                                                    DUG 5;
                                                                    GET;
                                                                    IF_NONE
                                                                        {
                                                                            DROP;
                                                                            SWAP;
                                                                            DROP;
                                                                            SWAP;
                                                                            DROP;
                                                                            SWAP;
                                                                            DROP;
                                                                            SWAP;
                                                                            DROP;
                                                                            DIG 2;
                                                                            DROP
                                                                        }
                                                                        {
                                                                            DUP;
                                                                            DIG 2;
                                                                            DUP;
                                                                            DUG 3;
                                                                            CAR;
                                                                            DIG 8;
                                                                            CDR;
                                                                            PAIR;
                                                                            PAIR;
                                                                            DIG 8;
                                                                            SWAP;
                                                                            EXEC;
                                                                            IF
                                                                                {
                                                                                    DROP;
                                                                                    DIG 2;
                                                                                    DROP;
                                                                                    DIG 2;
                                                                                    DROP
                                                                                }
                                                                                {
                                                                                    SWAP;
                                                                                    DUP;
                                                                                    CDR;
                                                                                    DIG 4;
                                                                                    DIG 3;
                                                                                    DUP;
                                                                                    DUG 2;
                                                                                    CAR;
                                                                                    NOW;
                                                                                    SUB;
                                                                                    SWAP;
                                                                                    DUP;
                                                                                    DUG 2;
                                                                                    INT;
                                                                                    SWAP;
                                                                                    COMPARE;
                                                                                    GE;
                                                                                    IF
                                                                                        {
                                                                                            DROP 2;
                                                                                            NONE
                                                                                                (pair
                                                                                                    timestamp
                                                                                                    (option nat))
                                                                                        }
                                                                                        {
                                                                                            SOME;
                                                                                            SWAP;
                                                                                            CAR;
                                                                                            PAIR;
                                                                                            SOME
                                                                                        };
                                                                                    DIG 4;
                                                                                    UPDATE;
                                                                                    SWAP;
                                                                                    CAR;
                                                                                    PAIR
                                                                                };
                                                                            SOME;
                                                                            DIG 2;
                                                                            UPDATE
                                                                        }
                                                                }
                                                        }
                                                        {
                                                            DROP 5;
                                                            SWAP;
                                                            DROP;
                                                            PUSH string "EXPIRY_TOO_BIG";
                                                            FAILWITH
                                                        }
                                                };
                                            DIP
                                                {
                                                    DUP;
                                                    CDR;
                                                    SWAP;
                                                    CAR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                        {
                                            DIG 4;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            DIG 4;
                                            DROP;
                                            PAIR;
                                            PAIR;
                                            DUP;
                                            CAR;
                                            CAR;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            CDR;
                                            DIG 2;
                                            CAR;
                                            CDR;
                                            PAIR;
                                            DIG 2;
                                            SWAP;
                                            EXEC;
                                            SWAP;
                                            DUP;
                                            DUG 2;
                                            IF_NONE
                                                {
                                                    UNIT
                                                }
                                                {
                                                    DUP;
                                                    CONTRACT %assertTransfers
                                                        (list
                                                            (pair
                                                                (address %from)
                                                                (list %tos address)));
                                                    IF_NONE
                                                        {
                                                            DROP;
                                                            PUSH string "BAD_TRANSFERLIST";
                                                            FAILWITH
                                                        }
                                                        {
                                                            DROP;
                                                            CONTRACT %assertReceivers
                                                                (list address);
                                                            IF_NONE
                                                                {
                                                                    PUSH string "BAD_TRANSFERLIST";
                                                                    FAILWITH
                                                                }
                                                                {
                                                                    DROP;
                                                                    UNIT
                                                                }
                                                        }
                                                };
                                            DROP;
                                            SWAP;
                                            DIP
                                                {
                                                    DUP;
                                                    CAR;
                                                    SWAP;
                                                    CDR;
                                                    CAR
                                                };
                                            SWAP;
                                            PAIR;
                                            SWAP;
                                            PAIR;
                                            NIL operation;
                                            PAIR
                                        }
                                }
                        }
                        {
                            DIG 3;
                            DROP;
                            DIG 5;
                            DROP;
                            DIG 6;
                            DROP;
                            IF_LEFT
                                {
                                    DIG 4;
                                    DROP;
                                    DIG 4;
                                    DROP;
                                    PAIR;
                                    PAIR;
                                    DUP;
                                    CDR;
                                    SWAP;
                                    DUP;
                                    DUG 2;
                                    CAR;
                                    CDR;
                                    PAIR;
                                    DIG 2;
                                    SWAP;
                                    EXEC;
                                    SWAP;
                                    CAR;
                                    CAR;
                                    SOME;
                                    DIP
                                        {
                                            DUP;
                                            CAR;
                                            SWAP;
                                            CDR;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            CAR;
                                            DUP;
                                            CDR;
                                            SWAP;
                                            CAR;
                                            DUP;
                                            CAR;
                                            SWAP;
                                            CDR;
                                            CAR
                                        };
                                    SWAP;
                                    PAIR;
                                    SWAP;
                                    PAIR;
                                    PAIR;
                                    PAIR;
                                    SWAP;
                                    PAIR;
                                    NIL operation;
                                    PAIR
                                }
                                {
                                    DIG 3;
                                    DROP;
                                    PAIR;
                                    PAIR;
                                    DUP;
                                    CAR;
                                    CDR;
                                    PUSH string "CONTRACT_NOT_PAUSED";
                                    SWAP;
                                    DUP;
                                    DUG 2;
                                    CAR;
                                    CDR;
                                    CAR;
                                    CDR;
                                    NOT;
                                    PAIR;
                                    DIG 3;
                                    SWAP;
                                    EXEC;
                                    DROP;
                                    PUSH string "NOT_PAUSER";
                                    DIG 2;
                                    CDR;
                                    PAIR;
                                    SWAP;
                                    DUP;
                                    CDR;
                                    CAR;
                                    CAR;
                                    CDR;
                                    CAR;
                                    PAIR;
                                    PAIR;
                                    EXEC;
                                    DUP;
                                    CDR;
                                    SWAP;
                                    CAR;
                                    DUP;
                                    CAR;
                                    SWAP;
                                    CDR;
                                    DUP;
                                    CDR;
                                    SWAP;
                                    CAR;
                                    CAR;
                                    PUSH bool False;
                                    SWAP;
                                    PAIR;
                                    PAIR;
                                    SWAP;
                                    PAIR;
                                    PAIR;
                                    NIL operation;
                                    PAIR
                                }
                        }
                }
        }
}`