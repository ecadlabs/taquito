export interface TezGraphOperationByHashResponse {
    data: {
        operations: {
            page_info: PageInfo,
            edges: { node: TezGraphOperationsContent }[]
        },
    }
}

export interface PageInfo {
    has_previous_page: boolean,
    has_next_page: boolean,
    start_cursor: string,
    end_cursor: string
}

export type TezGraphOperationsContent =
 | TezGraphOperationContentsDelegation
 | TezGraphOperationContentsEndorsement
 | TezGraphOperationContentsTransaction
 | TezGraphOperationContentsOrigination
 | TezGraphOperationContentsReveal;

export interface TezGraphOperationContentsCommon {
    kind: string,
    hash: string,
    block: string,
    timestamp: string,
    level: number,
    sender: { address: string },
    status: string | null
    // batch_position: number,
}

export interface TezGraphOperationContentsDelegation extends TezGraphOperationContentsCommon {
    fee: string,
    counter: string | null,
    gas_limit: string | null,
    delegate: string | null,
    delegation_consumed_milligas: string | null
}

export interface TezGraphOperationContentsEndorsement extends TezGraphOperationContentsCommon {
    delegate: string | null,
    slots: number[]
}

export interface TezGraphOperationContentsTransaction extends TezGraphOperationContentsCommon {
    fee: string,
    counter: string | null,
    gas_limit: string | null,
    storage_limit: string | null,
    amount: string | null,
    parameters: string | null,
    entrypoint: string | null,
    destination: string | null,
    transaction_consumed_milligas: string
}

export interface TezGraphOperationContentsReveal extends TezGraphOperationContentsCommon {
    fee: string,
    counter: string | null,
    gas_limit: string | null,
    //public_key: string,
    reveal_consumed_milligas: string | null
}

export interface TezGraphOperationContentsOrigination extends TezGraphOperationContentsCommon {
    fee: string,
    counter: string | null,
    gas_limit: string | null,
    storage_limit: string | null,
    contract_address: string,
    origination_consumed_milligas: string
}
