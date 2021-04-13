
import BigNumber from 'bignumber.js';
type address = string;
type mutez = string | BigNumber | number;
type nat = string | BigNumber | number;
type timestamp = Date | string;

type Storage = {
    transfers: (
        {
            amount: mutez;
            recipient: address;
        }
        | {
            fa2: address;
            1: Array<{
                from_: address;
                txs: Array<{
                    to_: address;
                    token_id: nat;
                    amount: nat;
                }>;
            }>;
        }
    );
};

type Methods = {
    confirm_admin: () => Promise<void>;
    pause: (param: boolean) => Promise<void>;
    set_admin: (
        bid: nat,
        transfers: (
            {
                amount: mutez;
                recipient: address;
            }
            | {
                fa2: address;
                1: Array<{
                    from_: address;
                    txs: Array<{
                        to_: address;
                        token_id: nat;
                        amount: nat;
                    }>;
                }>;
            }
        ),
    ) => Promise<void>;
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
    resolve: (param: (
            {
                amount: mutez;
                recipient: address;
            }
            | {
                fa2: address;
                1: Array<{
                    from_: address;
                    txs: Array<{
                        to_: address;
                        token_id: nat;
                        amount: nat;
                    }>;
                }>;
            }
        )) => Promise<void>;
};

export type ExampleContract5ContractType = { methods: Methods, storage: Storage, code: { __type: 'ExampleContract5Code', protocol: string, code: unknown } };
