
import BigNumber from 'bignumber.js';
import { MichelsonMap } from '@taquito/taquito';
type address = string;
type BigMap<K, T> = MichelsonMap<K, T>;
type bytes = string;
type contract = string;
type MMap<K, T> = MichelsonMap<K, T>;
type nat = string | BigNumber | number;
type unit = (true | undefined);

type Storage = {
    admin?: {
        admin: address;
        paused: boolean;
        pending_admin?: address;
    };
    assets: {
        ledger: BigMap<{
            0: address;
            1: nat;
        }, nat>;
        operators: BigMap<{
            0: address;
            1: address;
            2: nat;
        }, unit>;
        token_metadata: BigMap<nat, {
            token_id: nat;
            token_info: MMap<string, bytes>;
        }>;
        token_total_supply: BigMap<nat, nat>;
    };
    metadata: BigMap<string, bytes>;
};

type Methods = {
    confirm_admin: () => Promise<void>;
    pause: (param: boolean) => Promise<void>;
    set_admin: (param: address) => Promise<void>;
    balance_of: (
        requests: Array<{
            owner: address;
            token_id: nat;
        }>,
        callback: contract,
    ) => Promise<void>;
    transfer: (param: Array<{
            from_: address;
            txs: Array<{
                to_: address;
                token_id: nat;
                amount: nat;
            }>;
        }>) => Promise<void>;
    add_operator: (
        owner: address,
        operator: address,
        token_id: nat,
    ) => Promise<void>;
    remove_operator: (
        owner: address,
        operator: address,
        token_id: nat,
    ) => Promise<void>;
    burn_tokens: (param: Array<{
            owner: address;
            token_id: nat;
            amount: nat;
        }>) => Promise<void>;
    create_token: (
        token_id: nat,
        token_info: MMap<string, bytes>,
    ) => Promise<void>;
    mint_tokens: (param: Array<{
            owner: address;
            token_id: nat;
            amount: nat;
        }>) => Promise<void>;
};

export type ExampleContract6ContractType = { methods: Methods, storage: Storage, code: { __type: 'ExampleContract6Code', protocol: string, code: unknown } };
