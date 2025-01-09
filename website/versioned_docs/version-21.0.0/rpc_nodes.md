---
title: RPC nodes
author: Roxane Letourneau
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What to consider when choosing a node

- **Trust**: Choose a node that you can trust the people who operate it.
    - It should not alter your requests, for example, changing the operation data before forging it.
    - It should not censor your operations; you want to know that your operations will reach the network.
- **Reliability**: Consider your requirements for uptime, and choose your node option accordingly. If node availability is critical for your user-case,  consider self-hosting a node or contracting someone to operate a node specifically for you.
- ** End-points support**: Public nodes have different policies on the end-points that they expose. Your use case may require specific end-points to be available to your app. We have made a suite of [integration tests](rpc_nodes_integration_test.md) for the Taquito RPC package. These tests show what RPC end-points are available on a given node. These tests are available here: [integration-tests/rpc-nodes.spec.ts](https://github.com/ecadlabs/taquito/blob/master/integration-tests/rpc-nodes.spec.ts).

<Tabs
defaultValue="communityNodes"
values={[
{label: "Community Run Nodes", value: 'communityNodes'},
{label: 'Commercial Nodes', value: 'commercialNodes'},
]}>
<TabItem value="communityNodes">

| Provider         | Net          | URL                                      | Header                                                                          |
|------------------|--------------|------------------------------------------|---------------------------------------------------------------------------------|
| ECAD Labs        | Mainnet      | https://mainnet.tezos.ecadinfra.com      | [Check](https://mainnet.tezos.ecadinfra.com/chains/main/blocks/head/header)     |
| ECAD Labs        | Ghostnet     | https://ghostnet.tezos.ecadinfra.com     | [Check](https://ghostnet.tezos.ecadinfra.com/chains/main/blocks/head/header)    |
| SmartPy          | Mainnet      | https://mainnet.smartpy.io               | [Check](https://mainnet.smartpy.io/chains/main/blocks/head/header)              |
| SmartPy          | Ghostnet     | https://ghostnet.smartpy.io              | [Check](https://ghostnet.smartpy.io/chains/main/blocks/head/header)             |
| Tezos Foundation | Mainnet      | https://rpc.tzbeta.net/                  | [Check](https://rpc.tzbeta.net/chains/main/blocks/head/header)                  |
| Tezos Foundation | Ghostnet     | https://rpc.ghostnet.teztnets.com/       | [Check](https://rpc.ghostnet.teztnets.com/chains/main/blocks/head/header)       |
| Tezos Foundation | Parisnet     | https://rpc.pariscnet.teztnets.com/      | [Check](https://rpc.pariscnet.teztnets.com/chains/main/blocks/head/header)      |
| Tezos Foundation | Quebecnet    | https://rpc.quebecnet.teztnets.com/      | [Check](https://rpc.quebecnet.teztnets.com/chains/main/blocks/head/header)      |
| Tzkt             | Mainnet      | https://rpc.tzkt.io/mainnet/             | [Check](https://rpc.tzkt.io/mainnet/chains/main/blocks/head/header)             |
| Tzkt             | Ghostnet     | https://rpc.tzkt.io/ghostnet             | [Check](https://rpc.tzkt.io/ghostnet/chains/main/blocks/head/header)            |
| Tzkt             | Parisnet     | https://rpc.tzkt.io/parisnet             | [Check](https://rpc.tzkt.io/parisnet/chains/main/blocks/head/header)            |
| Tzkt             | Quebecnet    | https://rpc.tzkt.io/quebecnet            | [Check](https://rpc.tzkt.io/quebecnet/chains/main/blocks/head/header)           |

https://api.mainnet.tzkt.io/
*If you are aware of a public node missing from our list or our information is inaccurate, please help us by submitting an issue or pull request on our GitHub page.*
</TabItem>
  <TabItem value="commercialNodes">

| Provider         |  Details                                    |
|------------------|---------------------------------------------|
| MIDL.dev         |  https://midl.dev/tezos-rpc/                |
| Exaion           |  https://node.exaion.com                    |

*If you are aware of a private node missing from our list or our information is inaccurate, please help us by submitting an issue or pull request on our GitHub page.*

  </TabItem>
</Tabs>

## How to run a node

Running a node is a good way of contributing to Tezos by increasing the decentralization of the network.

There are many ways to set up a node. Here are some links providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)
