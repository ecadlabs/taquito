---
title: Michelson Encoder
author: Roxane Letourneau
---

The purpose of the `Michelson-Encoder` package is to create an abstraction over the Michelson Language. It allows converting Michelson data into javascript-looking objects which are easier to use and reason about.

Its integration into the main `Taquito` package makes it easier to write the storage when deploying a contract and the parameter when calling a contract entry-point.

:::info
With the release of Taquito vevsion 20.0.0, we have made a breaking change in the Michelson Encoder package.
Please check the [Breaking Change to Field Numbering](#breaking-change-to-field-numbering) section of this document for more information and how to enable the old behavior.
:::

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
console.log(JSON.stringify(extractSchema, null, 2));
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
console.log(JSON.stringify(extractSchema, null, 2));
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
console.log(JSON.stringify(extractSchema, null, 2));
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
try {
	storageSchema.Typecheck({
		stored_counter: 10,
		threshold: 5,
		keys: ['edpkuLxx9PQD8fZ45eUzrK3yhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
	})
	console.log('Storage object is valid');
} catch (e) {
	console.log(`Storage is not valid: ${e}`);
}
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
console.log(JSON.stringify(michelsonData, null, 2));
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
console.log(JSON.stringify(data, null, 2));
```

The `Execute` method takes an optional parameter of type `Semantic`. It allows overriding the default representation returned by the Michelson Encoder for specific types.

Here is an example for the `big_map` type:
If we have a contract having a big map in its storage, when we fetch the contract's storage with the RPC, the returned value looks like the following `{ int: big_map_id }`.
In the Taquito main package, the `getStorage` method of the `ContractProvider` class uses the semantic parameter to override the representation of big map in the storage. When we fetch the storage of a contract using `Tezos.contract.getStorage('contractAddress')`, an instance of the `BigMapAbstraction` class is returned for the big map instead of its id.

```js live noInline
const schema = new Schema({ prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] });
const dataMichelson = { int: 123456 }

const data = schema.Execute(dataMichelson)
console.log(`Default value returned by the Michelson Encoder for big_map: ${JSON.stringify(data, null, 2)}`);

// instead of returning the big map id, we can override it
// we return an object in this case
const dataCustom = schema.Execute(dataMichelson, { big_map: (val) => Object({ id: val.int })})
console.log(`Customized representation of the big_map value: ${JSON.stringify(dataCustom)}`);
```
---
Here is an example for the `ticket` type:

```js live noInline
const schema = new Schema({"prim":"ticket","args":[{"prim":"string"}]});
const dataMichelson = {"prim":"Pair","args":[{"string":"KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw"},{"string":"test"},{"int":"2"}]}

const data = schema.Execute(dataMichelson)
console.log(`Default representation of the ticket value returned by the Michelson Encoder: ${JSON.stringify(data, null, 2)}`);

const dataCustom = schema.Execute(dataMichelson, { ticket: (val) => val.args[1].string})
console.log(`Customized representation of the ticket value: ${JSON.stringify(dataCustom)}`);
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
console.log(JSON.stringify(michelsonData, null, 2));
```
---
Here is an example of `encodeObject`:
```js live noInline
const parameterSchema = new ParameterSchema({"prim":"pair","args":[{"prim":"address","annots":[":spender"]},{"prim":"nat","annots":[":value"]}],"annots":["%approve"]});
const michelsonData = parameterSchema.EncodeObject({
    spender: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    value: '12'
})
console.log(JSON.stringify(michelsonData, null, 2));
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
console.log(JSON.stringify(annotatedSchema, null, 2));
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
console.log(JSON.stringify(noAnnotationsSchema, null, 2));
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
console.log(JSON.stringify(mixedSchema, null, 2));
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
console.log(JSON.stringify(mixedSchema, null, 2));
```

## Breaking Change to Field Numbering {#breaking-change-to-field-numbering}
When having nested `pair`s or unions (`or`), Taquito assigns numbers to fields when an annotation is not present.
In previous versions of Taquito, the nested object's fields were numbered were a continuation of the parent object's fields.
For example, the following schema:

```js live noInline
const param = {
    prim: 'or',
    args: [
        {
            prim: 'pair',
            args: [{ prim: 'address' }, { prim: 'nat' }],
            annots: ['%transfer']
        },
        {
            prim: 'or',
            args: [
                {
                    prim: 'pair',
                    args: [{ prim: 'address' }, { prim: 'nat' }],
                    annots: ['%approve']
                },
                {
                    prim: 'pair',
                    args: [{ prim: 'address' }, { prim: 'nat' }],
                    annots: ['%mint']
                }
            ]
        }
    ],
    annots: [':_entries']
};
const parameterSchema = new ParameterSchema(param);
Token.fieldNumberingStrategy = "Legacy"; //To bring back the old behavior
const value = parameterSchema.generateSchema();
console.log(JSON.stringify(value, null, 2));
Token.fieldNumberingStrategy = 'Latest'; //To restore the default (new) behavior
```

Please run the code above and check the output.

Please note how nested field numbers are not predictable. The field numbers are assigned in the order their parent were encountered during the traversal of the tree. For instance, in the above example, `approve` would get a field number of `1`. Because it has annotations, the field number is not used. But its nested fields would be numbered starting from `1` and not `2`.

While this behavior is not an error, it is prone to unexpected changes when the schema is modified. Also, predicting the field number of a specific field is not straightforward.

With the release of Taquito version 20.0.0, we have made a breaking change in the Michelson Encoder package. The field numbering is now predictable and consistent.
The field numbers for each nested object (`Or`/`Pair`) are now reset from zero. You can see that by commenting out the line: `Token.fieldNumberingStrategy = "Legacy";` and running the code again.

Below you can see a diff of the new versus old behavior:

```diff
{
  "__michelsonType": "or",
  "schema": {
    "transfer": {
      "__michelsonType": "pair",
      "schema": {
        "0": {
          "__michelsonType": "address",
          "schema": "address"
        },
        "1": {
          "__michelsonType": "nat",
          "schema": "nat"
        }
      }
    },
    "approve": {
      "__michelsonType": "pair",
      "schema": {
-        "1": {
+        "0": {
          "__michelsonType": "address",
          "schema": "address"
        },
-        "2": {
+        "1": {
          "__michelsonType": "nat",
          "schema": "nat"
        }
      }
    },
    "mint": {
      "__michelsonType": "pair",
      "schema": {
-        "2": {
+        "0": {
          "__michelsonType": "address",
          "schema": "address"
        },
-        "3": {
+        "1": {
          "__michelsonType": "nat",
          "schema": "nat"
        }
      }
    }
  }
}
```
You can enable the old behavior by setting the `Token.fieldNumberingStrategy = 'Legacy'`. Please note that this value should stay the same for the whole application.
The possible values are: `type FieldNumberingStrategy = 'Legacy' | 'ResetFieldNumbersInNestedObjects' | 'Latest';` For new applications, we recommend using the default value `Latest`.
