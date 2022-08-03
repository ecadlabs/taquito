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
| ECAD Labs        | Jakartanet  | https://jakartanet.ecadinfra.com   | [Check](https://jakartanet.ecadinfra.com/chains/main/blocks/head/header)      |
| ECAD Labs        | Kathmandunet| https://kathmandunet.ecadinfra.com | [Check](https://kathmandunet.ecadinfra.com/chains/main/blocks/head/header)      |
| ECAD Labs        | Ghostnet    | https://ghostnet.ecadinfra.com     | [Check](https://ghostnet.ecadinfra.com/chains/main/blocks/head/header)      |
| SmartPy          | Mainnet     | https://mainnet.smartpy.io         | [Check](https://mainnet.smartpy.io/chains/main/blocks/head/header)     |
| SmartPy          | Jakartanet  | https://jakartanet.smartpy.io/     | [Check](https://jakartanet.smartpy.io/chains/main/blocks/head/header)    |
| SmartPy          | Ghostnet    | https://ghostnet.smartpy.io/       | [Check](https://ghostnet.smartpy.io/chains/main/blocks/head/header)    |
| Tezos Foundation | Mainnet     | https://rpc.tzbeta.net/            | [Check](https://rpc.tzbeta.net/chains/main/blocks/head/header)      |
| Tezos Foundation | Jakartanet  | https://rpczero.tzbeta.net/        | [Check](https://rpczero.tzbeta.net/chains/main/blocks/head/header)      |
| GigaNode         | Mainnet     | https://mainnet-tezos.giganode.io  |  [Check](https://mainnet-tezos.giganode.io/chains/main/blocks/head/header)     |
| GigaNode         | Jakartanet  | https://testnet-tezos.giganode.io/ | [Check](https://testnet-tezos.giganode.io/chains/main/blocks/head/header)      |
| Marigold         | Mainnet     | https://mainnet.tezos.marigold.dev/    | [Check](https://mainnet.tezos.marigold.dev/chains/main/blocks/head/header)     |
| Marigold         | Jakartanet  | https://jakartanet.tezos.marigold.dev/ | [Check](https://jakartanet.tezos.marigold.dev/chains/main/blocks/head/header)  |
| Marigold         | Kathmandunet| https://kathmandunet.tezos.marigold.dev/  | [Check](https://kathmandunet.tezos.marigold.dev/chains/main/blocks/head/header)   |
| Marigold         | Ghostnet    | https://ghostnet.tezos.marigold.dev/  | [Check](https://ghostnet.tezos.marigold.dev/chains/main/blocks/head/header)   |

## List of commercial node operators

* [MIDL.dev Tezos RPC service](https://midl.dev/tezos-rpc) offers a commercial node service for a fee

## How to run a node

Running a node is a good way of contributing to Tezos by increasing the decentralization of the network.

There are many ways to set up a node. Here are some links providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)

