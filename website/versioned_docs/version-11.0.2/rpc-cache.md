---
title: RPC caching
author: Roxane Letourneau
---

## Description

The `RpcClientCache` class aims to improve the performance of dApps built using Taquito by reducing the number of calls made to the RPC.  

The constructor of the `RpcClientCache` class takes a `RpcClient` instance as a parameter and an optional `ttl` (time to live). By default, the `ttl` is of 1000 milliseconds. The `RpcClientCache` acts as a decorator over the RpcClient instance. The `RpcClient` responses will be cached for the period defined by the `ttl`.  

### Example of use: 

The following example shows how to integrate the `RpcClientCache` with the TezosToolkit:

```js
import { TezosToolkit } from '@taquito/taquito';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

const rpcClient = new RpcClient('replace_with_RPC_URL');
const tezos = new TezosToolkit(new RpcClientCache(rpcClient));
```