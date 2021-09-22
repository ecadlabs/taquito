import { OpKind } from '../../src/types-indexers';
import { operationsStandardizerFactory } from '../../src/tezGraph/standardize-operations-tezgraph';
import { TezGraphOperationContentsDelegation, TezGraphOperationContentsEndorsement, TezGraphOperationContentsOrigination, TezGraphOperationContentsReveal, TezGraphOperationContentsTransaction } from '../../src/tezGraph/types-tezgraph';
import BigNumber from 'bignumber.js';

describe('operationsStandardizerFactory test with origination operations', () => {
    it(`Transforms origination operation content from Tezgraph into uniform format`, () => {
        const tezgraphOriginationSample: TezGraphOperationContentsOrigination = {
            "kind": 'Origination',
            "hash": "ooQfLJHv9k5upzZ8JKsXh8X2Cdef9FCur6Fz4ytFMkomo8mgzS7",
            "sender": {
                "address": "tz1Sqp74HwDHRgfnhzKuqzDcCvefmLKAK2Tr"
            },
            "timestamp": "2021-01-25T16:12:49.000Z",
            "level": 1316888,
            "block": "BLrdGgPLcs74gM1zzJ3bg2tnj7WJ8DQNVY4ZaHximAM1uATxwTk",
            "counter": "9963273",
            "status": "applied",
            "contract_address": "KT1Ver4XYFBJZH8vXHDYeKqUQuW8zSMVqZvm",
            "fee": "713",
            "gas_limit": "2136",
            "storage_limit": "411",
            "origination_consumed_milligas": "2035606"
        }
        const expected = {
            kind: OpKind.ORIGINATION,
            hash: "ooQfLJHv9k5upzZ8JKsXh8X2Cdef9FCur6Fz4ytFMkomo8mgzS7",
            block: "BLrdGgPLcs74gM1zzJ3bg2tnj7WJ8DQNVY4ZaHximAM1uATxwTk",
            timestamp: "2021-01-25T16:12:49.000Z",
            level: 1316888,
            sender: "tz1Sqp74HwDHRgfnhzKuqzDcCvefmLKAK2Tr",
            status: "applied",
            fee: new BigNumber("713"),
            counter: new BigNumber(9963273),
            gas_limit: new BigNumber("2136"),
            consumed_gas: new BigNumber(2035.606),
            storage_limit: new BigNumber("411"),
            contract_address: "KT1Ver4XYFBJZH8vXHDYeKqUQuW8zSMVqZvm",
        }
        const result = operationsStandardizerFactory(tezgraphOriginationSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms origination operation content from Tezgraph into uniform format when some properties are null`, () => {
        const tezgraphOriginationSample: TezGraphOperationContentsOrigination = {
            "kind": 'Origination',
            "hash": "ooQfLJHv9k5upzZ8JKsXh8X2Cdef9FCur6Fz4ytFMkomo8mgzS7",
            "sender": {
                "address": "tz1Sqp74HwDHRgfnhzKuqzDcCvefmLKAK2Tr"
            },
            "timestamp": "2021-01-25T16:12:49.000Z",
            "level": 1316888,
            "block": "BLrdGgPLcs74gM1zzJ3bg2tnj7WJ8DQNVY4ZaHximAM1uATxwTk",
            "counter": null,
            "status": "applied",
            "contract_address": "KT1Ver4XYFBJZH8vXHDYeKqUQuW8zSMVqZvm",
            "fee": "713",
            "gas_limit": null,
            "storage_limit": null,
            "origination_consumed_milligas": "2035606"
        }
        const expected = {
            kind: OpKind.ORIGINATION,
            hash: "ooQfLJHv9k5upzZ8JKsXh8X2Cdef9FCur6Fz4ytFMkomo8mgzS7",
            block: "BLrdGgPLcs74gM1zzJ3bg2tnj7WJ8DQNVY4ZaHximAM1uATxwTk",
            timestamp: "2021-01-25T16:12:49.000Z",
            level: 1316888,
            status: "applied",
            sender: "tz1Sqp74HwDHRgfnhzKuqzDcCvefmLKAK2Tr",
            fee: new BigNumber("713"),
            consumed_gas: new BigNumber(2035.606),
            contract_address: "KT1Ver4XYFBJZH8vXHDYeKqUQuW8zSMVqZvm",
        }
        const result = operationsStandardizerFactory(tezgraphOriginationSample);
        expect(result).toEqual(expected);
    });
});

describe('operationsStandardizerFactory test with delegation operations', () => {
    it(`Transforms delegation operation content from Tezgraph into uniform format`, () => {
        const tezgraphDelegationSample: TezGraphOperationContentsDelegation = {
            "kind": 'Delegation',
            "hash": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            "sender": {
                "address": "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1"
            },
            "timestamp": "2019-11-28T11:14:13.000Z",
            "level": 712767,
            "status": "applied",
            "block": "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            "fee": "30000",
            "counter": "2438767",
            "gas_limit": "10000",
            "delegate": "tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT",
            "delegation_consumed_milligas": "10000000"
        }
        const expected = {
            kind: OpKind.DELEGATION,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            status: "applied",
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            fee: new BigNumber("30000"),
            counter: new BigNumber(2438767),
            gas_limit: new BigNumber("10000"),
            consumed_gas: new BigNumber(10000),
            delegate: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT'
        }
        const result = operationsStandardizerFactory(tezgraphDelegationSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms delegation operation content from Tezgraph into uniform format when some properties are null`, () => {
        const tezgraphDelegationSample: TezGraphOperationContentsDelegation = {
            "kind": 'Delegation',
            "hash": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            "sender": {
                "address": "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1"
            },
            "timestamp": "2019-11-28T11:14:13.000Z",
            "level": 712767,
            "status": "applied",
            "block": "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            "fee": "30000",
            "counter": null,
            "gas_limit": null,
            "delegate": null,
            "delegation_consumed_milligas": null
        }
        const expected = {
            kind: OpKind.DELEGATION,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            status: "applied",
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            fee: new BigNumber("30000")
        }
        const result = operationsStandardizerFactory(tezgraphDelegationSample);
        expect(result).toEqual(expected);
    });
});

describe('operationsStandardizerFactory test with reveal operations', () => {
    it(`Transforms reveal operation content from Tezgraph into uniform format`, () => {
        const tezgraphRevealSample: TezGraphOperationContentsReveal = {
            "kind": 'Reveal',
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
        const expected = {
            kind: OpKind.REVEAL,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            status: "applied",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            fee: new BigNumber("1269"),
            counter: new BigNumber(2438766),
            gas_limit: new BigNumber("10000"),
            consumed_gas: new BigNumber(10000)
        }
        const result = operationsStandardizerFactory(tezgraphRevealSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms reveal operation content from Tezgraph into uniform format when some properties are null`, () => {
        const tezgraphRevealSample: TezGraphOperationContentsReveal = {
            "kind": 'Reveal',
            "hash": "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            "sender": {
                "address": "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1"
            },
            "timestamp": "2019-11-28T11:14:13.000Z",
            "level": 712767,
            "block": "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            "fee": "1269",
            "counter": null,
            "status": "applied",
            "gas_limit": null,
            "reveal_consumed_milligas": null
        }
        const expected = {
            kind: OpKind.REVEAL,
            hash: "onwbonv722FrR2m8isDPgCz4XzSmkC4oaQEHcFsYw3SLiPgKE7y",
            block: "BLD1denfmAXrnMZBk5VcLNiV6YB3ybLuai42hiLKGHUNAFMT1n9",
            timestamp: "2019-11-28T11:14:13.000Z",
            level: 712767,
            status: "applied",
            sender: "tz1a3Gs9whDXUAVzKSbJ3abYaEUxhQm1wdb1",
            fee: new BigNumber("1269")
        }
        const result = operationsStandardizerFactory(tezgraphRevealSample);
        expect(result).toEqual(expected);
    });
})

describe('operationsStandardizerFactory test with transaction operations', () => {
    it(`Transforms transaction operation content (between implicit accounts) from Tezgraph into uniform format`, () => {
        const tezgraphTransactionSample: TezGraphOperationContentsTransaction = {
            "kind": 'Transaction',
            "hash": "oogJQZM1bHNSzJ6egr6dAFweERUTmJLTjR7Nf9XbNrjMkQbddSs",
            "sender": {
                "address": "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe"
            },
            "timestamp": "2021-01-22T20:44:09.000Z",
            "level": 1313000,
            "block": "BLXcuHzsHVHo3tdWvAuX5RpB8zMx3MGu2NeCagCQN7bzbXy92pC",
            "fee": "414",
            "counter": "2156619",
            "status": "applied",
            "gas_limit": "1507",
            "storage_limit": "257",
            "amount": "1000000",
            "parameters": "{\"prim\":\"Unit\"}",
            "entrypoint": "default",
            "destination": "tz1Uffy7L7CRZPdUuKj1jt5XxDwAsZKjkfBc",
            "transaction_consumed_milligas": "1427000"
        }
        const expected = {
            kind: OpKind.TRANSACTION,
            hash: "oogJQZM1bHNSzJ6egr6dAFweERUTmJLTjR7Nf9XbNrjMkQbddSs",
            block: "BLXcuHzsHVHo3tdWvAuX5RpB8zMx3MGu2NeCagCQN7bzbXy92pC",
            timestamp: "2021-01-22T20:44:09.000Z",
            level: 1313000,
            sender: "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe",
            fee: new BigNumber("414"),
            counter: new BigNumber(2156619),
            status: "applied",
            gas_limit: new BigNumber("1507"),
            consumed_gas: new BigNumber(1427),
            storage_limit: new BigNumber(257),
            amount: new BigNumber(1000000),
            parameters: {
                entrypoint: 'default',
                value: { prim: "Unit" }
            },
            destination: "tz1Uffy7L7CRZPdUuKj1jt5XxDwAsZKjkfBc"
        }
        const result = operationsStandardizerFactory(tezgraphTransactionSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms transaction operation content (implicit to originated) from Tezgraph into uniform format`, () => {
        const tezgraphTransactionSample: TezGraphOperationContentsTransaction = {
            "kind": 'Transaction',
            "hash": "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            "sender": {
                "address": "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe"
            },
            "timestamp": "2021-01-26T17:46:14.000Z",
            "level": 1318362,
            "block": "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            "fee": "833",
            "counter": "2156620",
            "status": "applied",
            "gas_limit": "4943",
            "storage_limit": "0",
            "amount": "0",
            "parameters": "[{\"prim\":\"DROP\"},{\"prim\":\"NIL\",\"args\":[{\"prim\":\"operation\"}]},{\"prim\":\"PUSH\",\"args\":[{\"prim\":\"key_hash\"},{\"string\":\"tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe\"}]},{\"prim\":\"IMPLICIT_ACCOUNT\"},{\"prim\":\"PUSH\",\"args\":[{\"prim\":\"mutez\"},{\"int\":\"5000\"}]},{\"prim\":\"UNIT\"},{\"prim\":\"TRANSFER_TOKENS\"},{\"prim\":\"CONS\"}]",
            "entrypoint": "do",
            "destination": "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8",
            "transaction_consumed_milligas": "3435546"
        }
        const expected = {
            kind: OpKind.TRANSACTION,
            hash: "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            block: "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            timestamp: "2021-01-26T17:46:14.000Z",
            level: 1318362,
            sender: "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe",
            fee: new BigNumber("833"),
            counter: new BigNumber(2156620),
            status: "applied",
            gas_limit: new BigNumber("4943"),
            consumed_gas: new BigNumber(3435.546),
            storage_limit: new BigNumber(0),
            amount: new BigNumber(0),
            parameters: {
                entrypoint: 'do',
                value: [{ "prim": "DROP" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PUSH", "args": [{ "prim": "key_hash" }, { "string": "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe" }] }, { "prim": "IMPLICIT_ACCOUNT" }, { "prim": "PUSH", "args": [{ "prim": "mutez" }, { "int": "5000" }] }, { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" }, { "prim": "CONS" }]
            },
            destination: "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8"
        }
        const result = operationsStandardizerFactory(tezgraphTransactionSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms transaction operation content (originated to implicit) from Tezgraph into uniform format`, () => {
        const tezgraphTransactionSample: TezGraphOperationContentsTransaction = {
            "kind": 'Transaction',
            "hash": "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            "sender": {
                "address": "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8"
            },
            "timestamp": "2021-01-26T17:46:14.000Z",
            "level": 1318362,
            "block": "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            "fee": "833",
            "counter": null,
            status: "applied",
            "gas_limit": null,
            "storage_limit": null,
            "amount": "5000",
            "parameters": "{\"prim\":\"Unit\"}",
            "entrypoint": "default",
            "destination": "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe",
            "transaction_consumed_milligas": "1427000"
        }
        const expected = {
            kind: OpKind.TRANSACTION,
            hash: "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            block: "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            timestamp: "2021-01-26T17:46:14.000Z",
            level: 1318362,
            sender: "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8",
            status: "applied",
            fee: new BigNumber("833"),
            consumed_gas: new BigNumber(1427),
            amount: new BigNumber(5000),
            parameters: {
                entrypoint: 'default',
                value: { "prim": "Unit" }
            },
            destination: "tz1YPCK2iRxWZYHxeUtKBKRosdQ1SAHKeACe"
        }
        const result = operationsStandardizerFactory(tezgraphTransactionSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms transaction operation content (originated to implicit) from Tezgraph into uniform format when some properties are null`, () => {
        const tezgraphTransactionSample: TezGraphOperationContentsTransaction = {
            "kind": 'Transaction',
            "hash": "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            "sender": {
                "address": "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8"
            },
            "timestamp": "2021-01-26T17:46:14.000Z",
            "level": 1318362,
            "block": "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            "fee": "833",
            "status": "applied",
            "counter": null,
            "gas_limit": null,
            "storage_limit": null,
            "amount": null,
            "parameters": null,
            "entrypoint": null,
            "destination": null,
            "transaction_consumed_milligas": "1427000"
        }
        const expected = {
            kind: OpKind.TRANSACTION,
            hash: "onsZtZR1xWQ3Un8zpJUadaTRbxJfMjaL343TdZQg3zbPYvJXU8Q",
            block: "BMUUcF23hbincYixL1oGR34HUyxWw8RTPxg7aprSv33vbyQ3B7B",
            timestamp: "2021-01-26T17:46:14.000Z",
            level: 1318362,
            sender: "KT1LdKDekzfeQEzTpj1yaJsXGfXUGhsexwq8",
            status: "applied",
            fee: new BigNumber("833"),
            consumed_gas: new BigNumber(1427)
        }
        const result = operationsStandardizerFactory(tezgraphTransactionSample);
        expect(result).toEqual(expected);
    });
})

describe('operationsStandardizerFactory test with endorsement operations', () => {
    it(`Transforms endorsement operation content from Tezgraph into uniform format`, () => {
        const tezgraphEndorsementSample: TezGraphOperationContentsEndorsement = {
            "kind": 'Endorsement',
            "hash": "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
            "sender": {
                "address": "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS"
            },
            "timestamp": "2018-12-15T06:40:56.000Z",
            "level": 228196,
            "status": null,
            "block": "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
            "delegate": "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS",
            "slots": [
                23
            ]
        }
        const expected = {
            kind: OpKind.ENDORSEMENT,
            hash: "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
            block: "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
            timestamp: "2018-12-15T06:40:56.000Z",
            level: 228196,
            sender: "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS",
            delegate: 'tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS',
            slots: 1
        }
        const result = operationsStandardizerFactory(tezgraphEndorsementSample);
        expect(result).toEqual(expected);
    });

    it(`Transforms endorsement operation content from Tezgraph into uniform format when some properties are null`, () => {
        const tezgraphEndorsementSample: TezGraphOperationContentsEndorsement = {
            "kind": 'Endorsement',
            "hash": "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
            "sender": {
                "address": "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS"
            },
            "timestamp": "2018-12-15T06:40:56.000Z",
            "level": 228196,
            "status": null,
            "block": "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
            "delegate": null,
            "slots": [
                23
            ]
        }
        const expected = {
            kind: OpKind.ENDORSEMENT,
            hash: "ooiS1StmuxRTs6nVYM7kUgWCwVH5FKup1Rq1UGXkwcpY98RyLAK",
            block: "BLKNFsozy1kuXqwmd8uGmc12u5KWfC2LKvH2TANW87C3ZeztDQu",
            timestamp: "2018-12-15T06:40:56.000Z",
            level: 228196,
            sender: "tz1MBidfvWhJ64MuJapKExcP5SV4HQWyiJwS",
            slots: 1
        }
        const result = operationsStandardizerFactory(tezgraphEndorsementSample);
        expect(result).toEqual(expected);
    });
});