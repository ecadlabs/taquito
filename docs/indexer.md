---
title: Indexer
author: Roxane Letourneau
---

The `@taquito/indexer` package provides Taquito users with a convenient way to access Tezos blockchain indexed data. The indexer package has a public interface called `IndexerInterface`. Each supported indexer is represented by a different provider that implements the `IndexerInterface`. The indexer package is structured to avoid locking Taquito users to a particular indexer by allowing them to switch between different indexers with the minimum development effort.

:::note
Please note that the package is currently under development and limited to query operation based on its hash using the Tezgraph indexer. More indexers and methods will be added to the package to pursue the objective set out above.
:::

## Why Indexers are needed?

A Blockchain is a linked list of blocks that contain operations. This data structure is optimized for its purpose as a blockchain, a distributed ledger of operations with strong correctness guarantees.

A linked list of blocks containing operations does not lend itself to querying and reporting data in the blockchain.

A Blockchain indexer reads data from the blockchain, starting at block zero and progressing to the latest "head" block. The indexer extracts the block's "operations at each block," transforms it into a new data structure, and writes that data to a database. Blockchain Indexers typically provide a web API from which users can query transaction data from the blockchain efficiently.

Each of the Tezos indexers offers its own API having features that are common and unique to that indexer.

## TezGraph indexer

> TezGraph is a GraphQL API that provides access to historical and real-time data from the Tezos blockchain. TezGraph is open-source (Apache-2.0), offered as a public API, and packaged to operate privately.

*Documentation about the TezGraph indexer and how to set up it locally can be found [here](https://tezgraph.com/quickStart).*

### The `TezGraphIndexer` class from `@taquito/indexer`

The constructor of the `TezGraphIndexer` class takes three optional parameters:
- `url`: A string representing the TezGraph server URL (default is 'https://mainnet.tezgraph.tez.ie/graphql')
- `headers`: An object allowing to pass additional information with the requests (ie.: authentication credentials)
- `httpBackend`: An instance of the HttpBackend class which provides http functionality

:::caution
Please note that the following operation kinds are not currently supported by the TezGraph indexer: OperationContentsDoubleEndorsement, OperationContentsDoubleBaking, OperationContentsActivateAccount, OperationContentsProposals and OperationContentsBallot.
:::

### Example of use: 

The following example shows how to create an instance of the `TezGraphIndexer` and retrieve operation details based on an operation hash on mainnet: 

```ts
// import { TezGraphIndexer } from '@taquito/indexer'

const hash = 'oogJQZM1bHNSzJ6egr6dAFweERUTmJLTjR7Nf9XbNrjMkQbddSs';
const idx = new TezGraphIndexer();
const op = await idx.getOperation(hash);
```