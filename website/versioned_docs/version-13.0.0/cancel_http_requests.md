---
title: Cancel HTTP requests
author: Roxane Letourneau
---

Having Taquito implemented in composable modules is a design choice to allow users to customize the modules to meet some of their specific needs.

One of these needs might be the ability to **cancel** HTTP requests to optimize the network. Indeed, Taquito has heavy methods that make a lot of requests to the RPC. For example, in some cases, users might want to cancel almost immediately a call when using it in user interfaces. It is possible to incorporate some logic into the `HttpBackend` and `RpcClient` classes to fulfill this need.

Here is one example to override `HttpBackend` and/or `RpcClient`:


#### **Create a custom** `HttpBackend`  
Create a class called `CancellableHttpBackend` which extends the `HttpBackend` class. Override the `createRequest` method to utilize an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to handle and capture abort signals. We also use [Axios](https://github.com/axios/axios) to send HTTP requests. For more information on cancelling Axios requests, refer to [this documentation](https://github.com/axios/axios#cancellation)

``` ts
class CancellableHttpBackend extends HttpBackend {
  private abortController: AbortController;
  constructor() {
    super();
    this.abortController = new AbortController();
  }

  resetAbortController() {
    this.abortController = new AbortController();
  }

  cancelRequest() {
    this.abortController.abort();
  }

  async createRequest<T>(
    [...]
    let response;
    try {
      response = await axios.request<T>({
        url: url + this.serialize(query),
        method: method ?? 'GET',
        headers: headers,
        responseType: resType,
        signal: this.abortController.signal,
        transformResponse,
        timeout: timeout,
        data: data,
      });
    } catch (err: any) {
      throw new HttpResponseError(
        `Http error response: (${err.response.status}) ${JSON.stringify(err.response.data)}`,
        err.response.status as STATUS_CODE,
        err.response.statusText,
        JSON.stringify(err.response.data),
        url + this.serialize(query)
      )
    }

    return response.data
  }
```   

#### **Create a custom** `RpcClient`  
Create a class called `CancellableRpcClient` which extends the `RpcClient` class. Pass its constructor an instance of our `CancellableHttpBackend` class. And lastly, add the `cancelRequest` method which is used to trigger the abort signal.

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

#### **Set the RpcProvider**  
Set `CancellableRpcClient` on our `TezosToolkit` instance instead of using the default `RpcClient` class:

``` ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const signer: any = new InMemorySigner('your_key');
const customRpcClient = new CancellableRpcClient('your_RPC_URL')  
const tezos = new TezosToolkit(customRpcClient);
tezos.setSignerProvider(signer);
```   
 
#### **Trigger the abort signal**  
Now that we've setup the customRpcClient, we can trigger request cancellations by calling:
```
await customRpcClient.cancelRequest();
```   

**Note** that this example we provided will abort all RPC calls when triggered. There are unquestionably other methods to override and modify Taquito, and this example is just one of many possible implementations.
