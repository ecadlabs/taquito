
import { address, MMap, mutez, nat, timestamp } from '@taquito/contract-type-generator';

type Storage = {
    transfers: Array<(
        {
            xtz_transfer_type: {
                amount: mutez;
                recipient: address;
            }
        }
        | {
            token_transfer_type: {
                contract_address: address;
                transfer_list: Array<{
                    from_: address;
                    txs: Array<{
                        to_: address;
                        token_id: nat;
                        amount: nat;
                    }>;
                }>;
            }
        }
    )>;
};

type Methods = {
    confirm_admin: () => Promise<void>;
    pause: (param: boolean) => Promise<void>;
    set_admin: (
        bid: nat,
        transfers: Array<(
            {
                xtz_transfer_type: {
                    amount: mutez;
                    recipient: address;
                }
            }
            | {
                token_transfer_type: {
                    contract_address: address;
                    transfer_list: Array<{
                        from_: address;
                        txs: Array<{
                            to_: address;
                            token_id: nat;
                            amount: nat;
                        }>;
                    }>;
                }
            }
        )>,
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
    propose: (
        frozen_token: nat,
        proposal_metadata: MMap<string, Array<(
            {
                xtz_transfer_type: {
                    amount: mutez;
                    recipient: address;
                }
            }
            | {
                token_transfer_type: {
                    contract_address: address;
                    transfer_list: Array<{
                        from_: address;
                        txs: Array<{
                            to_: address;
                            token_id: nat;
                            amount: nat;
                        }>;
                    }>;
                }
            }
        )>>,
    ) => Promise<void>;
};

export type ExampleContract5ContractType = { methods: Methods, storage: Storage, code: { __type: 'ExampleContract5Code', protocol: string, code: object[] } };
