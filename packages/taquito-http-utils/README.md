# Taquito HTTP Utilities package
*TypeDoc style documentation is available [here](https://taquito.io/typedoc/modules/_taquito_http_utils.html)*

`@taquito/http-utils` is an npm package that provides developers with http functionality for Taquito.

## General Information

The `HttpBackend` class contains a `createRequest` method which accepts options to be passed for the HTTP request (url, method, timeout, json, query, headers, mimeType). This method will help users interact with the RPC with a more familiar HTTP format.

Parameters for `createRequest`:

`url`(string): RPC URL pointing to the Tezos node 
`method`(string): HTTP method of the request
`timeout`(number): request timeout 
`json`(boolean): Parse response into JSON when set to `true`; defaults to `true`
`query`(object): Query that we would like to pass as an HTTP request
`headers`(object): HTTP request header 
`mimeType`(string): Sets the MIME type of the request; see [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)


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
    mimeType: "text; charset=utf-8",
    json: false
});

```

## Additional Info
See the top-level https://github.com/ecadlabs/taquito file for details on reporting issues, contributing, and versioning.


## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
