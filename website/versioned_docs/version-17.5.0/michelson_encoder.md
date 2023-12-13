---
title: Michelson Encoder
author: Roxane Letourneau
---

The purpose of the `Michelson-Encoder` package is to create an abstraction over the Michelson Language. It allows converting Michelson data into javascript-looking objects which are easier to use and reason about.

Its integration into the main `Taquito` package makes it easier to write the storage when deploying a contract and the parameter when calling a contract entry-point.

## How it works?

There are three main classes in the Michelson Encoder:
- `Token`
- `ParameterSchema`
- `Schema`

[Here](/img/taquito-michelson-encoder.png) is a class diagram showing their members, methods, and relations.

A specific token class in the package represents each different Michelson type (i.e., `nat`, `list`, `pair`, `or`, ...). Each of these classes extends the abstract class `Token` and needs to implement these four inherited abstract methods:
- `Execute`: To convert Michelson data into familiar-looking javascript data
- `Encode`: To convert javascript array data to JSON Michelson
- `EncodeObject`: To convert javascript object data to JSON Michelson
- `GenerateSchema`: To show how the data should be structured in the javascript object format
- `ExtractSchema`: [deprecated] To show how the data should be structured in the javascript array format

We can reason about Michelson types and data as tree structures. Thus, the methods of the `Token` class use recursion to iterate over a Michelson parameter and create a specific token for each Michelson type encountered (i.e., each node and leaf of the tree).

The constructors of the `ParameterSchema` and `Schema` classes take a `MichelsonV1Expression` as a parameter (i.e., a Michelson type in JSON format). These two classes have a composition relationship with the `Token` class as they have a private member named `root`, which is a `Token` instance corresponding to the root type of the Michelson parameter. The root is the starting point of the recursive calls.

## The Schema class

In this section, we will use the schema class to represent the storage of a smart contract.

### Create a Schema instance

We can create an instance of `Schema` representing a contract's storage using the constructor and passing the storage type in Michelson JSON format or using the `fromRPCResponse` method. This second way allows creating the `Schema` instance with the script of the contract obtained from the `getScript` method of the `RpcClient` class.

Here are examples:

```js
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
---
or
```js
const script = await Tezos.rpc.getScript('KT1MTFjUeqBeZoFeW1NLSrzJdcS5apFiUXoB');
const storageSchema = Schema.fromRPCResponse({ script });
```
### The GenerateSchema method

We can use this method to obtain indications on how to write the storage when deploying a contract.

Here is an example with a contract storage having annotations and a `pair` at its root. The `ExtractSchema` method returns an object where the keys are the annotations, and the values show the corresponding type.

```js live noInline
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
const extractSchema = storageSchema.generateSchema();
println(JSON.stringify(extractSchema, null, 2));
```
---
When there is no annotation, the keys of the object are indexes starting from 0.
```js live noInline
const storageType = {
    prim: 'pair',
    args: [
        { prim: 'nat' },
        {
            prim: 'pair',
            args: [
                { prim: 'nat' },
                { prim: 'list', args: [ { prim: 'key' } ] }
            ]
        }
    ]
};
const storageSchema = new Schema(storageType);
const extractSchema = storageSchema.generateSchema();
println(JSON.stringify(extractSchema, null, 2));
```
---
Here is another example using a complex storage:
```js live noInline
const storageType =
{
	prim: 'pair',
	args: [
		{ prim: 'big_map', args: [ { prim: 'address' }, { prim: 'nat' } ] },
		{
			prim: 'pair',
			args: [
				{
					prim: 'pair',
					args: [
						{
							prim: 'contract',
							args: [
								{
									prim: 'or',
									args: [
										{
											prim: 'pair',
											args: [
												{ prim: 'address' },
												{
													prim: 'contract',
													args: [
														{
															prim: 'or',
															args: [
																{
																	prim: 'pair',
																	args: [
																		{ prim: 'address' },
																		{
																			prim: 'pair',
																			args: [
																				{ prim: 'address' },
																				{ prim: 'nat' }
																			]
																		}
																	]
																},
																{ prim: 'address' }
															]
														}
													]
												}
											]
										},
										{ prim: 'nat' }
									]
								}
							]
						},
						{
							prim: 'contract',
							args: [
								{
									prim: 'or',
									args: [
										{
											prim: 'pair',
											args: [
												{ prim: 'address' },
												{ prim: 'pair', args: [ { prim: 'address' }, { prim: 'nat' } ] }
											]
										},
										{ prim: 'address' }
									]
								}
							]
						}
					]
				},
				{
					prim: 'pair',
					args: [
						{ prim: 'nat' },
						{
							prim: 'map',
							args: [
								{ prim: 'address' },
								{
									prim: 'or',
									args: [
										{
											prim: 'or',
											args: [
												{
													prim: 'pair',
													args: [
														{ prim: 'nat' },
														{
															prim: 'pair',
															args: [ { prim: 'nat' }, { prim: 'timestamp' } ]
														}
													]
												},
												{
													prim: 'pair',
													args: [
														{ prim: 'pair', args: [ { prim: 'nat' }, { prim: 'mutez' } ] },
														{
															prim: 'pair',
															args: [ { prim: 'nat' }, { prim: 'timestamp' } ]
														}
													]
												}
											]
										},
										{
											prim: 'or',
											args: [
												{ prim: 'pair', args: [ { prim: 'nat' }, { prim: 'timestamp' } ] },
												{
													prim: 'pair',
													args: [
														{ prim: 'nat' },
														{
															prim: 'pair',
															args: [ { prim: 'mutez' }, { prim: 'timestamp' } ]
														}
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
			]
		}
	]
};
const storageSchema = new Schema(storageType);
const extractSchema = storageSchema.generateSchema();
println(JSON.stringify(extractSchema, null, 2));
```

### The Typecheck method

We can use the `Typecheck` method to validate the storage object. The method takes the storage object as a parameter and returns `true` if the storage object is compliant with the schema type or `false`. Validation of the properties is done. For example, the key used in the following code snippet is invalid, so the returned value of the `Typecheck` method is false.

```js live noInline
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
const typecheck = storageSchema.Typecheck({
    stored_counter: 10,
    threshold: 5,
    keys: ['edpkuLxx9PQD8fZ45eUzrK3yhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
})
println(typecheck);
```

### The Encode method

We use the `Encode` method to transform data from a javascript object to Michelson data.
Here is an example:

```js live noInline
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
const michelsonData = storageSchema.Encode({
    stored_counter: 10,
    threshold: 5,
    keys: ['edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g', 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
})
println(JSON.stringify(michelsonData, null, 2));
```

### The Execute method

We use the `Execute` method to transform data from Michelson to a javascript object.
Here is an example:

```js live noInline
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
}
const data = storageSchema.Execute(dataMichelson)
println(JSON.stringify(data, null, 2));
```

The `Execute` method takes an optional parameter of type `Semantic`. It allows overriding the default representation returned by the Michelson Encoder for specific types.

Here is an example for the `big_map` type:
If we have a contract having a big map in its storage, when we fetch the contract's storage with the RPC, the returned value looks like the following `{ int: big_map_id }`.
In the Taquito main package, the `getStorage` method of the `ContractProvider` class uses the semantic parameter to override the representation of big map in the storage. When we fetch the storage of a contract using `Tezos.contract.getStorage('contractAddress')`, an instance of the `BigMapAbstraction` class is returned for the big map instead of its id.

```js live noInline
const schema = new Schema({ prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] });
const dataMichelson = { int: 123456 }

const data = schema.Execute(dataMichelson)
println(`Default value returned by the Michelson Encoder for big_map: ${JSON.stringify(data, null, 2)}`);

// instead of returning the big map id, we can override it
// we return an object in this case
const dataCustom = schema.Execute(dataMichelson, { big_map: (val) => Object({ id: val.int })})
println(`Customized representation of the big_map value: ${JSON.stringify(dataCustom)}`);
```
---
Here is an example for the `ticket` type:

```js live noInline
const schema = new Schema({"prim":"ticket","args":[{"prim":"string"}]});
const dataMichelson = {"prim":"Pair","args":[{"string":"KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw"},{"string":"test"},{"int":"2"}]}

const data = schema.Execute(dataMichelson)
println(`Default representation of the ticket value returned by the Michelson Encoder: ${JSON.stringify(data, null, 2)}`);

const dataCustom = schema.Execute(dataMichelson, { ticket: (val) => val.args[1].string})
println(`Customized representation of the ticket value: ${JSON.stringify(dataCustom)}`);
```

### How the Schema class is used inside Taquito

The `Schema` class is internally used in Taquito:
- When calling `Tezos.contract.getStorage()`:
    It allows returning a well-formatted JSON object of the contract storage using the `Execute` method to convert the Michelson data into familiar-looking javascript data.
- When fetching a bigmap key with `BigMapAbstraction.get()` or `RpcContractProvider.getBigMapKey()`:
    It transforms the key we want to fetch into Michelson using the `EncodeBigMapKey` method, and it transforms the fetched value into a javascript object using the `ExecuteOnBigMapValue`.
- When deploying a contract:
    The `Encode` method allows transforming the javascript object used for the storage into Michelson data.
- In the tzip16 package:
    The `FindFirstInTopLevelPair` method allows finding a value in the storage matching a specified type (in this case, the big map named metadata).

## The ParameterSchema class

The `ParameterSchema` class is used to represent the smart contract methods. This class is similar to the `Schema` class except that the `Encode` method expects flattened parameters instead of a javascript object where `encodeObject` method expects javascript object.

Here is an example of `encode`:

```js live noInline
const parameterSchema = new ParameterSchema({"prim":"pair","args":[{"prim":"address","annots":[":spender"]},{"prim":"nat","annots":[":value"]}],"annots":["%approve"]});
const michelsonData = parameterSchema.Encode(
    'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    '12'
)
println(JSON.stringify(michelsonData, null, 2));
```
---
Here is an example of `encodeObject`:
```js live noInline
const parameterSchema = new ParameterSchema({"prim":"pair","args":[{"prim":"address","annots":[":spender"]},{"prim":"nat","annots":[":value"]}],"annots":["%approve"]});
const michelsonData = parameterSchema.EncodeObject({
    spender: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    value: '12'
})
println(JSON.stringify(michelsonData, null, 2));
```

### How the ParameterSchema class is used inside Taquito

The `ParameterSchema` class is internally used in Taquito:
- When we call a method, or a view of a contract using the `ContractAbstraction` class, the `Encode` method is used to transform the parameters into Michelson data.
- In the `tzip16` package, when we execute a Michelson view, the `Encode` method is used to transform the parameters into Michelson data.

## Flattening nested tokens (pair/union)

In the Michelson language, we can have nested `pair`s or unions (`or`). For example, the following Michelson type is a nested `pair`:

```js live noInline
const storageSchema = new Schema({
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
});
const annotatedSchema = storageSchema.ExtractSchema();
println(JSON.stringify(annotatedSchema, null, 2));
```
---
We can also have a similar definition without the annotations:
```js live noInline
const storageSchema = new Schema({
	prim: 'pair',
	args: [
		{ prim: 'nat' },
		{
			prim: 'pair',
			args: [
				{ prim: 'nat' },
				{ prim: 'list', args: [ { prim: 'key' } ] }
			]
		}
	]
});
const noAnnotationsSchema = storageSchema.ExtractSchema();
println(JSON.stringify(noAnnotationsSchema, null, 2));
```

In Taquito, we will flatten these nested `pair`s to make it easier to use them in typescript dApps. Please note how the result of `generateSchema` is different in the annotated vs non-annotated cases:

```js
//annotatedSchema:
{
  "stored_counter": "nat",
  "threshold": "nat",
  "keys": {
    "list": "key"
  }
}

//noAnnotationsSchema:
{
  "0": "nat",
  "1": "nat",
  "2": {
    "list": "key"
  }
}
```

Here, Taquito developers have made two decisions:
1. The elements of the nested `pair`s are flattened into a single object.
2. The keys of the object are:
   1. the annotations, if they exist
   1. the index of the element otherwise.

Formally speaking, the fields are the leaves of the three, ordered by traversing the tree (because we omit inner nodes of the tree, there is no difference between pre-order, in-order, or post-order traversal).
Also, in case you have a mixture of annotated and non-annotated fields, the fields numbers will keep increasing, even though annotated fields are named.

```js live noInline
const storageSchema = new Schema({
	prim: 'pair',
	args: [
		{ prim: 'nat' },
		{
			prim: 'pair',
			args: [
				{ prim: 'nat', annots: [ '%threshold' ] },
				{ prim: 'list', args: [ { prim: 'key' } ] }
			]
		}
	]
});
const mixedSchema = storageSchema.ExtractSchema();
println(JSON.stringify(mixedSchema, null, 2));
```

### Unions
For unions (`or`), we flatten them similarly, so instead of having `left` and `right` to refer to fields, you use the field number or annotation.

```js live noInline
const storageSchema = new Schema({
	prim: 'or',
	args: [
		{ prim: 'nat' },
		{
			prim: 'or',
			args: [
				{ prim: 'nat', annots: [ '%threshold' ] },
				{ prim: 'list', args: [ { prim: 'key' } ] }
			]
		}
	]
});
const mixedSchema = storageSchema.ExtractSchema();
println(JSON.stringify(mixedSchema, null, 2));
```
