
import BigNumber from 'bignumber.js';
import { MichelsonMap } from '@taquito/taquito';
type address = string;
type BigMap<K, T> = MichelsonMap<K, T>;
type nat = string | BigNumber | number;

type Storage = {
    admin?: {
        admin: address;
        paused: boolean;
        pending_admin?: address;
    };
    sales: BigMap<{
        sale_seller: address;
        token_for_sale_address: address;
        token_for_sale_token_id: nat;
        money_token_address: address;
        money_token_token_id: nat;
    }, nat>;
};

type Methods = {
    confirm_admin: () => Promise<void>;
    pause: (param: boolean) => Promise<void>;
    set_admin: (param: address) => Promise<void>;
    buy: (
        sale_seller: address,
        token_for_sale_address: address,
        token_for_sale_token_id: nat,
        money_token_address: address,
        money_token_token_id: nat,
    ) => Promise<void>;
    cancel: (
        sale_seller: address,
        token_for_sale_address: address,
        token_for_sale_token_id: nat,
        money_token_address: address,
        money_token_token_id: nat,
    ) => Promise<void>;
    sell: (
        sale_price: nat,
        token_for_sale_address: address,
        token_for_sale_token_id: nat,
        money_token_address: address,
        money_token_token_id: nat,
    ) => Promise<void>;
};

export type ExampleContract7ContractType = { methods: Methods, storage: Storage, code: { __type: 'ExampleContract7Code', protocol: string, code: unknown } };
