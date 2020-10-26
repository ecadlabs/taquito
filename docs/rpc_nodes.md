---
title: RPC nodes
author: Roxane Letourneau
---

## What to consider when choosing a node

- **Trust**: Choose a node that you can trust the people who operate it.
    - It should not alter your requests, for example, changing the operation data before forging it.
    - It should not censor your operations; you want to make sure that your transactions will be broadcasted to the network.
- **Disponibility**: You might want to choose a node with some mechanisms to guarantee reasonable uptime for your use cases.
- **Endpoints support**: Depending on your use cases, you want the required endpoints to be exposed by the node you chose. We wrote [integration tests](rpc_nodes_integration_test.md) to show what methods in the taquito RPC package, which maps to the RPC endpoints, work on which nodes of the following section. These tests can be found here: integration-tests/rpc-nodes.spec.ts.
- **Reliable**: You want a node that is in sync with the rest of the network, for example, you don't want a node that is always five blocks behind.
- **Maintenance/support**: You might want to choose a node that is kept to date and that you can contact the support team if you need assistance in case of trouble.


## List of community-run nodes

*If a public node is missing, or information is inaccurate, please help us by submitting a pull request on our GitHub page.*

- Tezos Giga Node from Tezos Ukraine
    - Mainnet: https://mainnet-tezos.giganode.io
    - Carthage testnet: https://testnet-tezos.giganode.io 
    - Delphinet testnet: https://delphinet-tezos.giganode.io
    - Labnet testnet: https://labnet-tezos.giganode.io
- SmartPy nodes
    - Mainnet: https://mainnet.smartpy.io
    - Zeronet: https://zeronet.smartpy.io
    - Carthagenet: https://carthagenet.smartpy.io
    - Delphinet: https://delphinet.smartpy.io
    - Dalphanet: https://dalphanet.smartpy.io
- Nodes operated by Blockscale on behalf of the Tezos Foundation: 
    - Mainnet: https://rpc.tzbeta.net/
    - Current protocol/version testnet (Carthagenet): https://rpctest.tzbeta.net/
    - Next protocol/version testnet (Delphinet): https://rpczero.tzbeta.net/
- Ecad Labs nodes:
    - Mainnet: https://api.tez.ie/rpc/mainnet
    - Carthagenet: https://api.tez.ie/rpc/carthagenet
    - Delphinet: https://api.tez.ie/rpc/delphinet

## How to run a node

Running a node is a good way of contributing to Tezos by increasing the decentralization of the network.

There are many ways to set up a node, here are some links providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)