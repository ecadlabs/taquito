---
title: Cancel HTTP requests
author: Roxane Letourneau
---

Having Taquito implemented in composable modules is a design choice to allow users to customize the modules to meet some of their specific needs.

One of these needs might be the ability to cancel HTTP requests to optimize the network. Indeed, Taquito has heavy methods that make a lot of requests to the RPC. For example, in some cases, users might want to cancel almost immediately a call when using it in user interfaces. It is possible to incorporate some logic into the `HttpBackend` and `RpcClient` classes to fulfill this need.

Here is an example in which we can click the `cancel` button during an estimation call to abort all requests. It will throw an exception.

```js live noInline abort
a security check test
const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Estimating the transfer of ${amount} ꜩ to ${address} : `);
Tezos.estimate
  .transfer({ to: address, amount: amount })
  .then((est) => {
    println(`burnFeeMutez : ${est.burnFeeMutez}, 
    gasLimit : ${est.gasLimit}, 
    minimalFeeMutez : ${est.minimalFeeMutez}, 
    storageLimit : ${est.storageLimit}, 
    suggestedFeeMutez : ${est.suggestedFeeMutez}, 
    totalCost : ${est.totalCost}, 
    usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

Here are the steps that we implemented to built the precedent example:

1. Create a custom `HttpBackend`  
We  created a class called `CancellableHttpBackend` which extended the `HttpBackend` class, and we overrode the `createRequest` method. We used the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to help to abort the fetch requests. We added logic to the `createRequest` method to handle the abort signal.

``` ts
import { HttpBackend, HttpRequestFailed, HttpResponseError, STATUS_CODE, HttpRequestOptions } from '@taquito/http-utils';
import AbortController from "abort-controller";

class CancellableHttpBackend extends HttpBackend {
  private abortCtrl: AbortController;
  constructor(){
    super();
    this.abortCtrl = new AbortController();
  }
  
  cancelRequest(){
    this.abortCtrl.abort();
  };

  createRequest<T>(
    { url, method, timeout, query, headers = {}, json = true, mimeType = undefined }: HttpRequestOptions,
    data?: {}
  ) {
    return new Promise<T>((resolve, reject) => {

      [...]

      request.onabort = function () {
        reject(
          new HttpResponseError(
            `Request canceled`,
            this.status as STATUS_CODE,
            request.statusText,
            request.response,
            url
          )
        );
      };

      const abort = () => {
        request.abort();
      }

      this.abortCtrl.signal.addEventListener("abort", abort);

      [...]
    });
  }
}
```

2. Create a custom `RpcClient`  
We created a class called `CancellableRpcClient` which extends the `RpcClient` class. We passed to its constructor an instance of our `CancellableHttpBackend` class. We also added a `cancelRequest` method which is used to trigger the abort signal.

``` ts
import { RpcClient } from '@taquito/rpc';

class CancellableRpcClient extends RpcClient {
  httpBackend: CancellableHttpBackend;

  constructor(
    url: string,
    chain: string = 'main',
    customHttpBackend: CancellableHttpBackend = new CancellableHttpBackend()
  ) {
    super(url, chain, customHttpBackend),
    this.httpBackend = customHttpBackend;
  }

  cancelRequest(){
    this.httpBackend.cancelRequest();
  }
}
```
3. Set the RpcProvider  
Then, we set our `CancellableRpcClient` on our `TezosToolkit` instance instead of using the default `RpcClient` class:

``` ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const signer: any = new InMemorySigner('your_key');
const customRpcClient = new CancellableRpcClient('your_RPC_URL')  
const tezos = new TezosToolkit(customRpcClient);
tezos.setSignerProvider(signer);
```

4. Trigger the abort signal  
We linked the `cancelRequest` method of the `CancellableRpcClient` class to a `cancel` button. The initiator of the abort signal might be different based on your use cases. Note that the cancelation action is not specific to a method in the example, meaning that all RPC calls will be aborted.

``` ts
Tezos.rpc.cancelRequest();
```

