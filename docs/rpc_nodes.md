---
title: RPC nodes
author: Roxane Letourneau
---

:::note

>Please be aware that version 7 of taquito introduces breaking changes related to the following classes, where it is now required to specify an RPC node in their constructor:
- RpcClient
- Context  
- TezosToolkit 

Before version 7, Taquito was configured to use our default RPC node; the default value was set in the constructor of the RpcClient class. We took this approach so that users can get started quickly, and Taquito should "just work" with minimal fiddling. Users could import a ready to use Tezos singleton, an instance of the TezosToolkit class using the default RPC URL.    

However, in version 7 of Taquito, we decided to remove the default RPC node. The reason behind this choice is to avoid that a lot of applications rely on our default node and thus centralize a part of the ecosystem on one node.

When creating an instance of the TezosToolkit, it is now required to specify the RPC node. The Tezos singleton has been replaced by a function taking an RPC node as a parameter. Both ways are equivalent, and the second one has been kept for users familiar with the Tezos singleton.

**Change required:**

~~const tezos = new TezosToolkit()~~

``` js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

// or

import { Tezos } '@taquito/taquito';
const tezos = Tezos('https://YOUR_PREFERRED_RPC_URL');
```

Here is an example of the compilation error you would get when updating Taquito to version 7, if the RPC URL is not specified: 

`Type '(rpcClient: string | RpcClient) => TezosToolkit' is missing the following properties from type 'TezosToolkit': _rpc, _context, _stream, _options, and 20 more.`
:::

## What to consider when choosing a node

- Trust: You might want to choose a node that you can trust the people who operate it.
    - It should returns accurate/exact data when you send queries.
    - It should not filter/discard your operations; you want to make sure that your transactions will be broadcasted to the network.
- Disponibility: You might want to choose a node that has some mechanisms to guarantee full-time availability.
- Privacy
- Security


## List of community-run nodes

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
- Cryptium Labs nodes:
    - Mainnet: http://mainnet.tezos.cryptium.ch:8732
    - Carthagenet: http://carthagenet.tezos.cryptium.ch:8732
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

There are many ways to set up a node, here are some link providing general instructions:

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)