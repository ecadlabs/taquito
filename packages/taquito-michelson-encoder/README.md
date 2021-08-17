
# Taquito Michelson Encoder package

`@taquito/michelson-encoder` provides a JavaScript abstraction based on a Tezos Smart contracts code, parameters and storage.

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.

## Example

Given the following michelson smart contract data, retrieved from a Tezos Nodes RPC:

```json
{
  "storage": {
    "prim": "Pair",
    "args": [
      [],
      {
        "prim": "Pair",
        "args": [
          { "int": "1" },
          {
            "prim": "Pair",
            "args": [
              { "int": "1000" },
              {
                "prim": "Pair",
                "args": [
                  { "string": "Token B" },
                  {
                    "prim": "Pair",
                    "args": [
                      { "string": "B" },
                      { "string": "tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

`@taquito/michelson-encoder` will generate an abstraction in the form of a plain old javascript object:

```javascript
{
  accounts: {},
  version: '1',
  totalSupply: '1000',
  name: 'Token B',
  symbol: 'B',
  owner: 'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS'
}
```

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_michelson_encoder.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
