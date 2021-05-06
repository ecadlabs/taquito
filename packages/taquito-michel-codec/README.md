[![pkgsign status](https://us-central1-pkgsign.cloudfunctions.net/pkgsign-badge?name=@taquito/michelson-encoder&expectedIdentity=%40jevonearth)](https://github.com/RedpointGames/pkgsign)

# Taquito michel-codec package

`@taquito/michel-codec` Converts and validates Michelson expressions between JSON based Michelson and Micheline.

This package can:

* Retrieve Michelson in JSON form from the Tezos Node RPC and convert it to plain Michelson. 
* Parse plain Michelson (including Macros) and expand/convert it to JSON Michelson suitable for injection into the Tezo Blockchain.
* Validate Michelson to ensure correctness

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.
## Examples

### Michelson expression to JSON

```js
    const code = `(Pair 
                     (Pair { Elt 1 (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx") 0x0501000000026869)}
                           10000000)
                     (Pair 2 333)
                  )`;

    const p = new Parser()

    const result = p.parseMichelineExpression(code)
    console.log(JSON.stringify(result))
```

Output:

```json
{"prim":"Pair","args":[{"prim":"Pair","args":[[{"prim":"Elt","args":[{"int":"1"},{"prim":"Pair","args":[{"prim":"Pair","args":[{"string":"tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN"},{"string":"tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"}]},{"bytes":"0501000000026869"}]}]}],{"int":"10000000"}]},{"prim":"Pair","args":[{"int":"2"},{"int":"333"}]}]}
```

### Pretty Print a Michelson contract 

```
    const contract = await Tezos.contract.at('KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv')
    const p = new Parser()

    const michelsonCode = p.parseJSON(contract.script.code as JSON[])
    console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}))
```

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_michel_codec.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


