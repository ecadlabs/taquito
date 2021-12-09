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

- ECAD Labs nodes:
    - Mainnet: https://mainnet.api.tez.ie
    - Hangzhounet: https://hangzhounet.api.tez.ie protocol `PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx`
    - ~~Granadanet: https://granadanet.api.tez.ie protocol~~ ~~`PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV`~~
        - Granadanet has been replaced with Hangzhou.
    - Idiazabalnet: https://idiazabalnet.ecadinfra.com/ protocol: `ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK`
        - Idiazabalnet is an early testnet protocol that will become the `I` proposal. It includes many features, the most notable being the new "tenderbake" consensus algorithim. 
- SmartPy public Tezos nodes
    - Mainnet: https://mainnet.smartpy.io
    - Granadanet: https://granadanet.smartpy.io/
- Blockscale public nodes operated on behalf of the Tezos Foundation: 
    - Mainnet: https://rpc.tzbeta.net/
    - Next protocol/version testnet (Granadanet): https://rpczero.tzbeta.net/
- Teznode Public nodes operated by LetzBake!:
    - Mainnet: https://teznode.letzbake.com
- ~~Tezos Giga Node from Tezos Ukraine~~ Was expected cease to operations on Oct 1st 2021, but status is unkown. See
  [Announcment](https://twitter.com/GigaNode/status/1435265400699342854)
    - ~~Mainnet: https://mainnet-tezos.giganode.io~~
    - ~~Granada testnet: https://testnet-tezos.giganode.io/~~

## How to run a node

Running a node is a good way of contributing to Tezos by increasing the decentralization of the network.

There are many ways to set up a node. Here are some links providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)

