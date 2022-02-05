
# Taquito Michelson Encoder package
*Documentation can be found [here](https://tezostaquito.io/docs/michelson_encoder)*  
*TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_michelson_encoder.html)*

`@taquito/michelson-encoder` provides a JavaScript abstraction based on a Tezos Smart contracts code, parameters, storage, and views.

## General Information

The Michelson-Encoder package aims to create an abstraction over the Michelson Language. It allows converting Michelson data into javascript-looking objects which are easier to use and reason about.

Its integration into the main Taquito package makes it easier to write the storage when deploying a contract and the parameter when calling a contract entry-point or executing a view. It also provides an abstraction on the storage read value of the contract. 

The `Schema` class is intended to represent the contract storage, while the `ParameterSchema` represents its entry points. The `Execute` method takes a parameter in Michelson format and converts it into the JavaScript abstraction. The `Encode` method does the opposite; it takes a JavaScript object as a parameter and converts it into Michelson data.

## Install 
```
npm i --save @taquito/michelson-encoder
```

## Usage

## Example

The constructor of the `Schema` class takes a Michelson type as a parameter which is retrieved from a Tezos Nodes RPC:

```ts
const storageType = {
    prim: 'pair',
    args: [
        { prim: 'nat', annots: [ '%stored_counter' ] },
        {
            prim: 'pair',
            args: [
                { prim: 'nat', annots: [ '%threshold' ] },
                { prim: 'list', args: [ { prim: 'key' } ], annots: [ '%keys' ] }
            ]
        }
    ]
};
const storageSchema = new Schema(storageType);
```

The `Execute` method takes a Michelson value as a parameter and generates an abstraction in the form of a plain old javascript object:

```ts
// dataMichelson is the storage of a contract retrieved from the RPC
const dataMichelson = {
  "prim": "Pair",
  "args": [
    {
      "int": "10"
    },
    {
      "prim": "Pair",
      "args": [
        {
          "int": "5"
        },
        [
          {
            "string": "edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g"
          },
          {
            "string": "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"
          }
        ]
      ]
    }
  ]
};

const data = storageSchema.Execute(dataMichelson);
console.log(data);

/* output:
{
  "stored_counter": "10",
  "threshold": "5",
  "keys": [
    "edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g",
    "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"
  ]
} 
*/
```

Note that the Michelson type annotations represent the javascript object's keys.


The `Encode` method takes a javascript object as a parameter and converts it into Michelson:

```ts
const data = storageSchema.Encode({
  "stored_counter": "10",
  "threshold": "5",
  "keys": [
    "edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g",
    "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"
  ]
});

console.log(data);

/* output:
{
  "prim": "Pair",
  "args": [
    {
      "int": "10"
    },
    {
      "prim": "Pair",
      "args": [
        {
          "int": "5"
        },
        [
          {
            "string": "edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g"
          },
          {
            "string": "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"
          }
        ]
      ]
    }
  ]
} 
*/
```
## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
