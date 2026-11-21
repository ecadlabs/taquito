# Taquito HTTP Utilities package
*TypeDoc style documentation is available [here](https://taquito.io/typedoc/modules/_taquito_http_utils.html)*

`@taquito/http-utils` is an npm package that provides developers with http functionality for Taquito.

## General Information

The `HttpBackend` class contains a `createRequest` method which accepts options to be passed for the HTTP request (url, method, timeout, json, query, headers). This method will help users interact with the RPC with a more familiar HTTP format.

Parameters for `createRequest`:

`url`(string): RPC URL pointing to the Tezos node 
`method`(string): HTTP method of the request
`timeout`(number): request timeout 
`json`(boolean): Parse response into JSON when set to `true`; defaults to `true`
`query`(object): Query that we would like to pass as an HTTP request
`headers`(object): HTTP request header


## Install
The package(s) need to be installed as follows
```
npm install @taquito/http-utils
```

## Usage
Create an instance of `HttpBackend` and call it's member function `createRequest` to construct an HTTP request. 
```ts
import { HttpBackend } from '@taquito/http-utils';

const httpBackend = new HttpBackend();
const response = httpBackend.createRequest<string>({
    url: `/chains/${chain}/blocks/${block}/context/contracts/${address}/script`,
    method: 'GET',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    json: false
});

```

## Additional Info
Taquito uses the built-in `globalThis.fetch` (requires Node.js >= 22 or a browser environment).

For diagnostics, you can emit request timing logs with:

`TAQUITO_HTTP_TRACE=true`

Optionally adjust the slow-request threshold (milliseconds):

`TAQUITO_HTTP_TRACE_SLOW_MS=1500`

See the top-level https://github.com/ecadlabs/taquito file for details on reporting issues, contributing, and versioning.

## GET rate limits

After receiving an HTTP 429 response, `HttpBackend` can retry GET requests. Status retries and transport retries share `TAQUITO_HTTP_RETRY_COUNT`, which defaults to one retry. Set it to zero to disable both. POST response handling is unchanged, including injection, forging and preapplication.

`Retry-After` can contain integer seconds or an HTTP date. A valid delay up to 30 seconds is honored. A longer delay returns the original HTTP error instead of retrying early. Missing or invalid headers use the existing exponential backoff and jitter. Browsers can read this header only when the server exposes it through CORS. Past dates retry without a delay.

`HttpBackend` discards the unused 429 response body in the background so a quick response can leave the connection open for reuse. It cancels the read if the read reaches 10 ms or consumes more than 64 KiB. This does not delay the retry. If the response ends the retry sequence, `HttpResponseError` still includes the body when it can be read. The timeout applies to each attempt. An external abort cancels any retry wait, including gateway and transport backoff.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
