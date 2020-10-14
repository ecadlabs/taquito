---
title: RPC nodes
author: Roxane Letourneau
---

:::caution note
Before version 7, Taquito was configured to use our default RPC node; the default value was set in the constructor of the RpcClient class. We took this approach so that users can get started quickly, and Taquito should "just work" with minimal fiddling. Users could import a ready to use `Tezos` singleton, an instance of the TezosToolkit class using the default RPC URL. 

However, in version 7 of Taquito, we decided to remove the default RPC node. The reason behind this choice is to avoid that a lot of applications rely on our default node and thus centralize a part of the ecosystem on one node.

When creating an instance of the TezosToolkit, it is now required to specify the RPC node. The `Tezos` singleton has been replaced by a function taking an RPC node as a parameter. Both ways are equivalent, and the second one has only been kept for users familiar with the `Tezos` singleton.

``` js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

//is equivalent too

import { Tezos } '@taquito/taquito';
const tezos = Tezos('https://YOUR_PREFERRED_RPC_URL');
```
:::

## What to considere when chosing a node

- Trust
    - Returns accurate/exact data when sending querries
    - Won't filter and discard your operation, make sure that your transaction will be broadcastes to the network
- Disponibility


## List of community-run nodes

- Tezos Giga Node from Tezos Ukraine
    - Carthage mainnet: https://mainnet-tezos.giganode.io
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
- Luke Youngblood nodes: 
    - Mainnet: https://rpc.tzbeta.net/
    - Delphinet: https://rpczero.tzbeta.net/
    - Carthagenet: https://rpcalpha.tzbeta.net/ and https://rpctest.tzbeta.net/
- Ecad Labs nodes:
    - Mainnet: https://api.tez.ie/rpc/mainnet
    - Carthagenet: https://api.tez.ie/rpc/carthagenet
    - Delphinet: https://api.tez.ie/rpc/delphinet

## How to run a node

Contributing to Tezos, decentralization

- [Use docker images](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Build from sources](https://tezos.gitlab.io/introduction/howtoget.html#docker-images)
- [Use Ansible Role](https://github.com/ecadlabs/ansible-role-tezos-node/blob/master/README.md)