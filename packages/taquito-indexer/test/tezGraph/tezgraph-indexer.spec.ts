import { OperationsQuery } from '../../src/tezGraph/query/operation-by-hash';
import { TezGraphIndexer } from '../../src/tezGraph/tezgraph-indexer';
import { OpKind } from '../../src/types-indexers';
import BigNumber from 'bignumber.js';

/**
 * TezGraphIndexer test
 */
describe('TezGraphIndexer test', () => {
    let mockHttpBackend: {
        createRequest: jest.Mock<any, any>;
    };

    beforeEach(async () => {
        mockHttpBackend = {
            createRequest: jest.fn(),
        }
    });

    it('TezGraphIndexer is instantiable with parameters', () => {
        expect(
            new TezGraphIndexer(
                'https://mainnet.tezgraph.tez.ie/graphql',
                {},
                mockHttpBackend as any,
            )
        ).toBeInstanceOf(TezGraphIndexer);
    });

    it('Should retrieve operation', async () => {
        mockHttpBackend.createRequest.mockResolvedValue({
            "data": {
                "operations": {
                    "page_info": {
                        "has_previous_page": false,
                        "has_next_page": false,
                        "start_cursor": "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK:0:0",
                        "end_cursor": "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK:0:0"
                    },
                    "edges": [
                        {
                            "node": {
                                "kind": "Endorsement",
                                "hash": "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
                                "sender": {
                                    "address": "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS"
                                },
                                "timestamp": "2018-12-15T06:40:56.000Z",
                                "level": 228196,
                                "block": "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
                                "status": null,
                                "delegate": "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS",
                                "slots": [
                                    23
                                ]
                            }
                        }
                    ]
                }
            }
        });

        const indexer = new TezGraphIndexer(
            'https://mainnet.tezgraph.tez.ie/graphql',
            {},
            mockHttpBackend as any,
        )
        const operation = await indexer.getOperation('hash');
        expect(mockHttpBackend.createRequest).toHaveBeenCalledWith({
            url: 'https://mainnet.tezgraph.tez.ie/graphql',
            method: 'POST',
            headers: {},
        },
            {
                query: OperationsQuery,
                variables: {
                    filter: { hash: 'hash' },
                    orderBy: {
                        field: "chronological_order",
                        direction: "asc"
                    },
                    opCount: 100
                }
            }
        );
        expect(mockHttpBackend.createRequest).toHaveBeenCalledTimes(1);
        expect(operation).toEqual([{
            kind: OpKind.ENDORSEMENT,
            hash: "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
            block: "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
            timestamp: "2018-12-15T06:40:56.000Z",
            level: 228196,
            sender: "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS",
            delegate: 'tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS',
            slots: 1
        }]);
    })

    it('Should retrieve all operations if pagination', async () => {
        mockHttpBackend.createRequest.mockResolvedValueOnce({
            "data": {
                "operations": {
                    "page_info": {
                        "has_previous_page": false,
                        "has_next_page": true,
                        "start_cursor": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y:1:0",
                        "end_cursor": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y:1:0"
                    },
                    "edges": [
                        {
                            "node": {
                                "kind": "Delegation",
                                "hash": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
                                "sender": {
                                    "address": "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1"
                                },
                                "timestamp": "2019-11-28T11:14:13.000Z",
                                "level": 712767,
                                "block": "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
                                "status": "applied",
                                "fee": "30000",
                                "counter": "2438767",
                                "gas_limit": "10000",
                                "delegate": "tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT",
                                "delegation_consumed_milligas": "10000000"
                            }
                        }
                    ]
                }
            }
        });

        mockHttpBackend.createRequest.mockResolvedValueOnce({
            "data": {
                "operations": {
                    "page_info": {
                        "has_previous_page": false,
                        "has_next_page": false,
                        "start_cursor": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y:0:0",
                        "end_cursor": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y:0:0"
                    },
                    "edges": [
                        {
                            "node": {
                                "kind": "Reveal",
                                "hash": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
                                "sender": {
                                    "address": "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1"
                                },
                                "timestamp": "2019-11-28T11:14:13.000Z",
                                "level": 712767,
                                "block": "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
                                "status": "applied",
                                "fee": "1269",
                                "counter": "2438766",
                                "gas_limit": "10000",
                                "reveal_consumed_milligas": "10000000"
                            }
                        }
                    ]
                }
            }
        });

        const indexer = new TezGraphIndexer(
            'https://mainnet.tezgraph.tez.ie/graphql',
            {},
            mockHttpBackend as any,
        )
        const operation = await indexer.getOperation('hash');
        expect(mockHttpBackend.createRequest).toHaveBeenNthCalledWith(1, {
            url: 'https://mainnet.tezgraph.tez.ie/graphql',
            method: 'POST',
            headers: {},
        },
            {
                query: OperationsQuery,
                variables: {
                    filter: { hash: 'hash' },
                    orderBy: {
                        field: "chronological_order",
                        direction: "asc"
                    },
                    opCount: 100
                }
            }
        );
        expect(mockHttpBackend.createRequest).toHaveBeenNthCalledWith(2, {
            url: 'https://mainnet.tezgraph.tez.ie/graphql',
            method: 'POST',
            headers: {},
        },
            {
                query: OperationsQuery,
                variables: {
                    filter: { hash: 'hash' },
                    orderBy: {
                        field: "chronological_order",
                        direction: "asc"
                    },
                    opCount: 100,
                    after: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y:1:0"
                }
            }
        );
        expect(mockHttpBackend.createRequest).toHaveBeenCalledTimes(2);
        expect(operation).toEqual([{
            kind: OpKind.DELEGATION,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            delegate: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
            gas_limit: new BigNumber("10000"),
            consumed_gas: new BigNumber("10000"),
            counter: new BigNumber("2438767"),
            status: "applied",
            fee: new BigNumber(30000)
        },
        {
            kind: OpKind.REVEAL,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            fee: new BigNumber("1269"),
            counter: new BigNumber(2438766),
            gas_limit: new BigNumber("10000"),
            status: "applied",
            consumed_gas: new BigNumber(10000)
        }]);
    });

    it('Should throw an OperationNotFound error when there is no operation found', async () => {
        mockHttpBackend.createRequest.mockResolvedValue({
            "data": {
                "operations": null
            }
        });

        const indexer = new TezGraphIndexer(
            'https://mainnet.tezgraph.tez.ie/graphql',
            {},
            mockHttpBackend as any,
        );
        try {
            await indexer.getOperation('hash')
        } catch (e) {
            expect(e.message).toContain('Unable to retrieve the operation: hash')
        }

        expect(mockHttpBackend.createRequest).toHaveBeenCalledTimes(1);
    })
});