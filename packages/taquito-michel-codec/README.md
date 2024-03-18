# Taquito michel-codec package

`@taquito/michel-codec` Converts and validates Michelson expressions between JSON based Michelson and Micheline.

This package can:

- Retrieve Michelson in JSON form from the Tezos Node RPC and convert it to plain Michelson.
- Parse plain Michelson (including Macros) and expand/convert it to JSON Michelson suitable for injection into the Tezo Blockchain.
- Validate Michelson to ensure correctness

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.

## Examples

### Michelson expression to JSON

```js
const code = `(Pair 
                     (Pair { Elt 1 (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx") 0x0501000000026869)}
                           10000000)
                     (Pair 2 333)
                  )`;

const p = new Parser();

const result = p.parseMichelineExpression(code);
console.log(JSON.stringify(result));
```

Output:

```json
{
  "prim": "Pair",
  "args": [
    {
      "prim": "Pair",
      "args": [
        [
          {
            "prim": "Elt",
            "args": [
              { "int": "1" },
              {
                "prim": "Pair",
                "args": [
                  {
                    "prim": "Pair",
                    "args": [
                      { "string": "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" },
                      { "string": "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" }
                    ]
                  },
                  { "bytes": "0501000000026869" }
                ]
              }
            ]
          }
        ],
        { "int": "10000000" }
      ]
    },
    { "prim": "Pair", "args": [{ "int": "2" }, { "int": "333" }] }
  ]
}
```

### Pretty Print a Michelson contract

```js
    const contract = await Tezos.contract.at('KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv')
    const p = new Parser()

    const michelsonCode = p.parseJSON(contract.script.code as JSON[])
    console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}))
```

### Pack Michelson data

Serializes any value of packable type to its optimized binary representation identical to the one used by PACK and UNPACK Michelson instructions.
Without a type definition (not recommended) the data will be encoded as a binary form of a generic Michelson expression.
Type definition allows some types like `timestamp` and `address` and other base58 representable types to be encoded to corresponding optimized binary forms borrowed from the Tezos protocol.

```js
const data: MichelsonData = {
  string: 'KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo',
};

const typ: MichelsonType = {
  prim: 'address',
};

const packed = packData(data, typ);
// 050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f

// alternatively
const packedBytes = packDataBytes(data, typ);
// { bytes: "050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f" }
```

Without a type definition the base58 encoded address will be treated as a string

```js
const data: MichelsonData = {
  string: 'KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo',
};

const packed = packData(data);
// 0501000000284b543152766b7746344637707a3167436f786b795a724731526b7278517933676d46547625666f6f

// alternatively
const packedBytes = packDataBytes(data);
// {
//     bytes: "0501000000284b543152766b7746344637707a3167436f786b795a724731526b7278517933676d46547625666f6f"
// }
```

### Unpack Michelson data

Deserialize a byte array into the corresponding Michelson value.
Without a type definition (not recommended) the binary data will be treated as a binary form of a generic Michelson expression and returned as is.
Type definition allows some types like `timestamp` and `address` and other types usually encoded in optimized binary forms to be transformed back to their string representations like base58 and ISO timestamps.

```js
const src = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];

const typ: MichelsonType = {
  prim: 'timestamp',
};

const data = unpackData(src, typ);
// { string: "2019-09-26T10:59:51Z" }
```

Alternatively

```js
const src = { bytes: '0500a7e8e4d80b' };

const typ: MichelsonType = {
  prim: 'timestamp',
};

const data = unpackDataBytes(src, typ);
// { string: "2019-09-26T10:59:51Z" }
```

Same binary data without a type definition

```js
const src = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];

const data = unpackData(src);
// { int: "1569495591" }
```

Alternatively

```js
const src = { bytes: '0500a7e8e4d80b' };

const data = unpackDataBytes(src);
// { int: "1569495591" }
```

## API Documentation

TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_michel_codec.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
