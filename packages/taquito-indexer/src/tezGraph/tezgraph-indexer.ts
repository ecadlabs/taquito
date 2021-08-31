import { HttpBackend } from '@taquito/http-utils';
import { OperationNotFound } from '../errors';
import { IndexerInterface } from '../taquito-indexer';
import { OperationContents } from '../types-indexers';
import { OperationsQuery } from './query/operation-by-hash';
import { operationsStandardizerFactory } from './standardize-operations-tezgraph';
import { TezGraphOperationByHashResponse } from './types-tezgraph';

const MAX_OP_PER_PAGE_GRAPHQL = 100;
const DEFAULT_OP_ORDER = {
    field: "chronological_order",
    direction: "asc"
};

/**
 * @description Implementation of the IndexerInterface that provides access to indexed Tezos data using the Tezgraph indexer
 * @warn The following operation kinds are currently not supported by the TezGraph indexer: 
 * OperationContentsDoubleEndorsement, OperationContentsDoubleBaking, OperationContentsActivateAccount, OperationContentsProposals, OperationContentsBallot
 * 
 * @param url A string representing the TezGraph server URL (default is 'https://mainnet.tezgraph.tez.ie/graphql')
 * @param headers An object allowing to pass additional information with the requests (ie.: authentication credentials) (default is {})
 * @param httpBackend An instance of the HttpBackend class which provides http functionality
 */
export class TezGraphIndexer implements IndexerInterface {
    constructor(
        private url: string = 'https://mainnet.tezgraph.tez.ie/graphql',
        private headers: { [key: string]: string } = {},
        private httpBackend: HttpBackend = new HttpBackend()
    ) { }

    /**
     * @description Retrieves operation details based on an operation hash
     * @param hash
     * @returns An array of OperationContents
     */
    async getOperation(hash: string) {
        let operations: Array<OperationContents> = [];
        let opResponse: TezGraphOperationByHashResponse;
        let cursor: string | undefined;
        // In case of batch containing more than `MAX_OP_PER_PAGE_GRAPHQL` operations, fetch all operations using `end_cursor`
        do {
            opResponse = await this.getOpByHashRequest(hash, cursor);
            if (!opResponse.data.operations) {
                throw new OperationNotFound(hash)
            }
            operations.push(...opResponse.data.operations.edges.map((node) => {
                return operationsStandardizerFactory(node.node)
            }))
            cursor = opResponse.data.operations.page_info.end_cursor;
        }
        while (opResponse.data.operations.page_info.has_next_page)
        return operations;
    }

    private async getOpByHashRequest(hash: string, cursor?: string) {
        const variables = {
            filter: { hash },
            orderBy: DEFAULT_OP_ORDER,
            opCount: MAX_OP_PER_PAGE_GRAPHQL,
            after: cursor
        };

        return this.httpBackend.createRequest<TezGraphOperationByHashResponse>({
            url: this.url,
            method: 'POST',
            headers: this.headers,
        },
            {
                query: OperationsQuery,
                variables
            }
        )
    }
}