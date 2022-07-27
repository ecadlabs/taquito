---
title: RPC nodes
author: Roxane Letourneau
---

## What to consider when choosing a node

- **Trust**: Choose a node that you can trust the people who operate it.
    - It should not alter your requests, for example, changing the operation data before forging it.
    - It should not censor your operations; you want to know that your operations will reach the network.
- **Reliability**: Consider your requirements for uptime, and choose your node option accordingly. If node availability is critical for your user-case,  consider self-hosting a node or contracting someone to operate a node specifically for you.
- ** End-points support**: Public nodes have different policies on the end-points that they expose. Your use case may require specific end-points to be available to your app. We have made a suite of [integration tests](rpc_nodes_integration_test.md) for the Taquito RPC package. These tests show what RPC end-points are available on a given node. These tests are available here: integration-tests/rpc-nodes.spec.ts.

## List of community-run nodes

*If you are aware of a public node missing from our list or our information is inaccurate, please help us by submitting an issue or pull request on our GitHub page.*

| Provider         | Net         | URL                                | Header      |  
|------------------|-------------|------------------------------------|-------|
| ECAD Labs        | Mainnet     | https://mainnet.api.tez.ie         | [Check](https://mainnet.api.tez.ie/chains/main/blocks/head/header)      |
| ECAD Labs        | Ithacanet   | https://ithacanet.ecadinfra.com    | [Check](https://ithacanet.ecadinfra.com/chains/main/blocks/head/header)      |
| ECAD Labs        | Jakartanet  | https://jakartanet.ecadinfra.com   | [Check](https://jakartanet.ecadinfra.com/chains/main/blocks/head/header)      |
| SmartPy          | Mainnet     | https://mainnet.smartpy.io         |  [Check](https://mainnet.smartpy.io/chains/main/blocks/head/header)     |
| SmartPy          | Ithacanet   | https://ithacanet.smartpy.io/      | [Check](https://ithacanet.smartpy.io/chains/main/blocks/head/header)    |
| Tezos Foundation | Mainnet     | https://rpc.tzbeta.net/            | [Check](https://rpc.tzbeta.net/chains/main/blocks/head/header)      |
| Tezos Foundation | Jakartanet  | https://rpczero.tzbeta.net/        | [Check](https://rpczero.tzbeta.net/chains/main/blocks/head/header)      |
| GigaNode         | Mainnet     | https://mainnet-tezos.giganode.io  |  [Check](https://mainnet-tezos.giganode.io/chains/main/blocks/head/header)     |
| GigaNode         | Ithacanet   | https://testnet-tezos.giganode.io/ | [Check](https://testnet-tezos.giganode.io/chains/main/blocks/head/header)      |
| Marigold         | Mainnet     | https://mainnet.tezos.marigold.dev/    | [Check](https://mainnet.tezos.marigold.dev/chains/main/blocks/head/header)     |
| Marigold         | Ithacanet   | https://ithacanet.tezos.marigold.dev/  | [Check](https://ithacanet.tezos.marigold.dev/chains/main/blocks/head/header)   |
| Marigold         | Jakartanet  | https://jakartanet.tezos.marigold.dev/ | [Check](https://jakartanet.tezos.marigold.dev/chains/main/blocks/head/header)  |

## How to run a node

Running a node is a good way of contributing to Tezos by increasing the decentralization of the network.

There are many ways to set up a node. Here are some links providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)

