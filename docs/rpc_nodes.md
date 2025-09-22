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
| ECAD Infra       | mainnet      | https://mainnet.tezos.ecadinfra.com      | [Check](https://mainnet.tezos.ecadinfra.com/chains/main/blocks/head/header) |
| ECAD Infra       | ghostnet     | https://ghostnet.tezos.ecadinfra.com     | [Check](https://ghostnet.tezos.ecadinfra.com/chains/main/blocks/head/header) |
| ECAD Infra       | shadownet    | https://shadownet.tezos.ecadinfra.com    | [Check](https://shadownet.tezos.ecadinfra.com/chains/main/blocks/head/header) |
| ECAD Infra       | seoulnet     | https://seoulnet.tezos.ecadinfra.com     | [Check](https://seoulnet.tezos.ecadinfra.com/chains/main/blocks/head/header) |
| SmartPy          | mainnet      | https://mainnet.smartpy.io               | [Check](https://mainnet.smartpy.io/chains/main/blocks/head/header) |
| SmartPy          | ghostnet     | https://ghostnet.smartpy.io              | [Check](https://ghostnet.smartpy.io/chains/main/blocks/head/header) |
| Tezos Foundation | mainnet      | https://rpc.tzbeta.net                   | [Check](https://rpc.tzbeta.net/chains/main/blocks/head/header) |
| Tezos Foundation | ghostnet     | https://rpc.ghostnet.teztnets.com        | [Check](https://rpc.ghostnet.teztnets.com/chains/main/blocks/head/header) |
| Tezos Foundation | shadownet    | https://rpc.shadownet.teztnets.com       | [Check](https://rpc.shadownet.teztnets.com/chains/main/blocks/head/header) |
| Tezos Foundation | seoulnet     | https://rpc.seoulnet.teztnets.com        | [Check](https://rpc.seoulnet.teztnets.com/chains/main/blocks/head/header) |
| TzKT             | mainnet      | https://rpc.tzkt.io/mainnet              | [Check](https://rpc.tzkt.io/mainnet/chains/main/blocks/head/header) |
| TzKT             | ghostnet     | https://rpc.tzkt.io/ghostnet             | [Check](https://rpc.tzkt.io/ghostnet/chains/main/blocks/head/header) |
| TzKT             | shadownet    | https://rpc.tzkt.io/shadownet            | [Check](https://rpc.tzkt.io/shadownet/chains/main/blocks/head/header) |
| TzKT             | seoulnet     | https://rpc.tzkt.io/seoulnet             | [Check](https://rpc.tzkt.io/seoulnet/chains/main/blocks/head/header) |

<!-- when updating this table make sure to update the website/static/docs/rpc_nodes.json first and rerun example/convert-rpc-json-to-md.ts to replace the output table above -->
*- You can also find a machine readable list in [rpc_nodes.json](https://taquito.io/docs/rpc_nodes.json).*

*- If you are aware of a public node missing from our list or our information is inaccurate, please help us by submitting an issue or pull request on our [GitHub page](https://github.com/ecadlabs/taquito).*

</TabItem>
  <TabItem value="commercialNodes">

| Provider         |  Details                                    |
|------------------|---------------------------------------------|
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
