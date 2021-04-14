
import BigNumber from 'bignumber.js';
import { MichelsonMap } from '@taquito/taquito';
type address = string;
type BigMap<K, T> = MichelsonMap<K, T>;
type int = string | BigNumber | number;
type mutez = string | BigNumber | number;
type nat = string | BigNumber | number;
type timestamp = Date | string;

type Storage = {
    pauseable_admin?: {
        admin: address;
        paused: boolean;
        pending_admin?: address;
    };
    current_id: nat;
    max_auction_time: nat;
    max_config_to_start_time: nat;
    auctions: BigMap<nat, {
        seller: address;
        current_bid: mutez;
        start_time: timestamp;
        last_bid_time: timestamp;
        round_time: int;
        extend_time: int;
        asset: Array<{
            fa2_address: address;
            fa2_batch: Array<{
                token_id: nat;
                amount: nat;
            }>;
        }>;
        min_raise_percent: nat;
        min_raise: mutez;
        end_time: timestamp;
        highest_bidder: address;
    }>;
};

type Methods = {
    confirm_admin: () => Promise<void>;
    pause: (param: boolean) => Promise<void>;
    set_admin: (param: address) => Promise<void>;
    bid: (param: nat) => Promise<void>;
    cancel: (param: nat) => Promise<void>;
    configure: (
        opening_price: mutez,
        min_raise_percent: nat,
        min_raise: mutez,
        round_time: nat,
        extend_time: nat,
        asset: Array<{
            fa2_address: address;
            fa2_batch: Array<{
                token_id: nat;
                amount: nat;
            }>;
        }>,
        start_time: timestamp,
        end_time: timestamp,
    ) => Promise<void>;
    resolve: (param: nat) => Promise<void>;
};

export type ExampleContract1ContractType = { methods: Methods, storage: Storage, code: { __type: 'ExampleContract1Code', protocol: string, code: unknown } };
