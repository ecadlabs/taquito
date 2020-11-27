# @taquito/michel-typing

## Library API

See `src/typegen.ts`

## Command line tool

Usage:

`npx michel-typing [-input INFILE] [-json] [-prefix PREFIX]`

## Typing rules

| Michelson type(s)                         | TypeScript equivalent              |
| ----------------------------------------- | ---------------------------------- |
| int, nat, mutez                           | bigint \| number                   |
| string, key_hash, address, key, signature | string                             |
| bytes, chain_id                           | Uint8Array \| number\[\] \| string |
| bool                                      | boolean                            |
| timestamp                                 | string \| number \| Date           |
| unit                                      | "Unit"                             |
| (option T)                                | T \| null                          |
| pair                                      | See below                          |
| or                                        | See below                          |
| list T, set T                             | T\[\]                              |
| map K V, big_map K, V                     | Map\<K,V\> \| \[K, V\]\[\]`        |
| lambda                                    | MichelsonCode                      |

### Pair types

Nested pairs with annotated fields becomes interfaces with field annotations translated into properties. If pair's fields aren't annotated and at least one of its members is not a pair then this pair becomes a tuple.

For example

```
(pair
    (pair (nat %nat) (string %string))
    (pair (option %opt_int int) (pair %tuple string string))
)
```

will be translated into

```typescript
{
    nat: bigint | number;
    string: string;
    opt_int?: bigint | number | null;
    tuple: [
        string,
        string
    ];
}
```

### Or types

Or's or are translated into interfaces with mutually exclusive properties (i.e. only one property can be non `undefined`) using similar expansion rule.

For example

```
(or (address %addr) (int %int))
```

Becomes

```typescript
{
    addr: string;
    int?: undefined;
} | {
    addr?: undefined;
    int: bigint | number;
}
```

## Generated module interface

For every Michelson type (i.e. contract storage type, parameter root type and all its entry points) the following types, constants and functions are generated

### Types

#### Parameter

Represents TypeScript equivalent of contract's parameter type

#### ParameterType

An exact subtype of `MichelsonType` covering contract's parameter Michelson type (an AST tree type)

#### ParameterData

Parameter data literal type. An alias for `MichelsonData<ParameterType>`

#### Storage

Represents TypeScript equivalent of contract's storage type

#### StorageType

An exact subtype of `MichelsonType` covering contract's storage Michelson type (an AST tree type)

#### StorageData

Storage data literal type. An alias for `MichelsonData<StorageType>`

#### EntryPointID

Union type representing entry point names

#### EntryPointArg\<id extends EntryPointID\>

Conditional type that expands into TypeScript equivalent of the entry point argument type

#### EntryPointType\<id extends EntryPointID\>

Conditional type that expands into entry point argument Michelson type (an AST tree type)

#### EntryPointData\<id extends EntryPointID\>

Conditional type that expands into entry point argument data literal type

### Constants

#### parameter: ParameterType

An AST representation of the parameter type

#### storage: ParameterType

An AST representation of the storage type

#### entryPoints

An entry point table with corresponding Michelson types

### Functions

#### decodeParameter(src: ParameterData): Parameter

Decode Michelson data literal into corresponding TypeScript object

#### encodeParameter(src: Parameter): ParameterData

Encode TypeScript object as Michelson data literal

#### isParameterData(d: MichelsonData): d is ParameterData

Returns true if `d` matches parameter data literal. Calls `assertDataValid(d, parameter, ctx)`

#### assertParameterData(d: MichelsonData): d is ParameterData

Throws an exception if `d` isn't matching parameter data literal. Has a type guard annotation for convenience but never return false.

#### decodeStorage(src: StorageData): Storage

Decode Michelson data literal into corresponding TypeScript object

#### encodeStorage(src: Storage): StorageData

Encode TypeScript object as Michelson data literal

#### isStorageData(d: MichelsonData): d is StorageData

Returns true if `d` matches storage data literal. Calls `assertDataValid(d, storage, ctx)`

#### assertStorageData(d: MichelsonData): d is StorageData

Throws an exception if `d` doesn't match storage data literal. Has a type guard annotation for convenience but never returns false.

#### decodeEntryPointArg\<T extends EntryPointID\>(id: T, src: EntryPointData\<T\>): EntryPointArg\<T\>

Decode Michelson data literal into corresponding TypeScript object

#### encodeEntryPointArg\<T extends EntryPointID\>(id: T, src: EntryPointArg\<T\>): EntryPointData\<T\>

Encode TypeScript object as Michelson data literal

#### isEntryPointData\<T extends EntryPointID\>(id: T, d: MichelsonData): d is EntryPointData\<T\>

Returns true if `d` matches entry point's argument data literal

#### assertEntryPointData\<T extends EntryPointID\>(id: T, d: MichelsonData): d is EntryPointData\<T\>

Throws an exception if `d` doesn't match entry point's argument data literal. Has a type guard annotation for convenience but never returns false.

## Full example

Contract code:

```
storage (pair
    (pair (nat %nat) (string %string))
    (pair (option %opt_int int) (pair %tuple string string))
);

parameter %root (or
    (or (string %use_string) (address %use_addr))
    (or (bytes %use_bytes) (timestamp %use_ts))
);

code {
    CDR;
    NIL operation;
    PAIR;
};
```

Generated TypeScript module:

```typescript
/* The code is automatically generated; DO NOT EDIT. */

import {
    MichelsonContract,
    MichelsonData,
    MichelsonType,
    MichelsonTypeOption,
    MichelsonTypeOr,
    MichelsonTypePair,
    assertDataValid
} from "@taquito/michel-codec";

/* Parameter */

export type ParameterType = MichelsonTypeOr<
    MichelsonTypeOr<
        MichelsonType<"string">,
        MichelsonType<"address">>,
    MichelsonTypeOr<
        MichelsonType<"bytes">,
        MichelsonType<"timestamp">>>;

export type Parameter = {
    use_string: string;
    use_addr?: undefined;
    use_bytes?: undefined;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr: string;
    use_bytes?: undefined;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr?: undefined;
    use_bytes: Uint8Array | number[] | string;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr?: undefined;
    use_bytes?: undefined;
    use_ts: string | number | Date;
};

export type ParameterData = MichelsonData<ParameterType>;

export const parameter: ParameterType = {
    prim: "or",
    args: [
        {
            prim: "or",
            args: [
                {
                    prim: "string",
                    annots: ["%use_string"]
                },
                {
                    prim: "address",
                    annots: ["%use_addr"]
                }
            ]
        },
        {
            prim: "or",
            args: [
                {
                    prim: "bytes",
                    annots: ["%use_bytes"]
                },
                {
                    prim: "timestamp",
                    annots: ["%use_ts"]
                }
            ]
        }
    ]
};

export const decodeParameter = (src: ParameterData): Parameter => (src.prim === "Left" ?
    src.args[0].prim === "Left" ?
        {
            use_string: src.args[0].args[0].string
        } :
        {
            use_addr: src.args[0].args[0].string
        } :
    src.args[0].prim === "Left" ?
        {
            use_bytes: (v => {
                const b: number[] = [];
                for (let i = 0; i < v.bytes.length; i += 2) {
                    b.push(parseInt(v.bytes.slice(i, i + 2), 16));
                }
                return b;
            })(src.args[0].args[0])
        } :
        {
            use_ts: (v => new Date("string" in v ? v.string : parseInt(v.int, 10) * 1000))(src.args[0].args[0])
        });

export const encodeParameter = (src: Parameter): ParameterData => (src.use_string !== undefined ?
    {
        prim: "Left",
        args: [{
            prim: "Left",
            args: [{ string: src.use_string }]
        }]
    } :
    src.use_addr !== undefined ?
        {
            prim: "Left",
            args: [{
                prim: "Right",
                args: [{ string: src.use_addr }]
            }]
        } :
        src.use_bytes !== undefined ?
            {
                prim: "Right",
                args: [{
                    prim: "Left",
                    args: [{ bytes: (v => typeof v === "string" ? v : [...v].map(x => (x >> 4 & 0xf).toString(16) + (x & 0xf).toString(16)).join(""))(src.use_bytes) }]
                }]
            } :
            {
                prim: "Right",
                args: [{
                    prim: "Right",
                    args: [{ string: (v => v instanceof Date ? v.toISOString() : typeof v === "number" ? new Date(v * 1000).toISOString() : v)(src.use_ts) }]
                }]
            });

export function assertParameterData(d: MichelsonData): d is ParameterData {
    return assertDataValid(d, parameter, { contract: contract });
}

export function isParameterData(d: MichelsonData): d is ParameterData {
    try {
        return assertDataValid(d, parameter, { contract: contract });
    } catch {
        return false;
    }
}

/* Storage */

export type StorageType = MichelsonTypePair<
    MichelsonTypePair<
        MichelsonType<"nat">,
        MichelsonType<"string">>,
    MichelsonTypePair<
        MichelsonTypeOption<MichelsonType<"int">>,
        MichelsonTypePair<
            MichelsonType<"string">,
            MichelsonType<"string">>>>;

export type Storage = {
    nat: bigint | number;
    string: string;
    opt_int?: bigint | number | null;
    tuple: [
        string,
        string
    ];
};

export type StorageData = MichelsonData<StorageType>;

export const storage: StorageType = {
    prim: "pair",
    args: [
        {
            prim: "pair",
            args: [
                {
                    prim: "nat",
                    annots: ["%nat"]
                },
                {
                    prim: "string",
                    annots: ["%string"]
                }
            ]
        },
        {
            prim: "pair",
            args: [
                {
                    prim: "option",
                    args: [
                        {
                            prim: "int"
                        }
                    ],
                    annots: ["%opt_int"]
                },
                {
                    prim: "pair",
                    args: [
                        {
                            prim: "string"
                        },
                        {
                            prim: "string"
                        }
                    ],
                    annots: ["%tuple"]
                }
            ]
        }
    ]
};

export const decodeStorage = (src: StorageData): Storage => ({
    nat: BigInt(src.args[0].args[0].int),
    string: src.args[0].args[1].string,
    opt_int: src.args[1].args[0].prim === "Some" ? BigInt(src.args[1].args[0].args[0].int) : null,
    tuple: [
        src.args[1].args[1].args[0].string,
        src.args[1].args[1].args[1].string
    ],
});

export const encodeStorage = (src: Storage): StorageData => ({
    prim: "Pair",
    args: [
        {
            prim: "Pair",
            args: [
                { int: String(src.nat) },
                { string: src.string }
            ]
        },
        {
            prim: "Pair",
            args: [
                src.opt_int !== undefined && src.opt_int !== null ? {
                    prim: "Some",
                    args: [{ int: String(src.opt_int) }]
                } : { prim: "None" },
                {
                    prim: "Pair",
                    args: [
                        { string: src.tuple[0] },
                        { string: src.tuple[1] }
                    ]
                }
            ]
        }
    ]
});

export function assertStorageData(d: MichelsonData): d is StorageData {
    return assertDataValid(d, storage, { contract: contract });
}

export function isStorageData(d: MichelsonData): d is StorageData {
    try {
        return assertDataValid(d, storage, { contract: contract });
    } catch {
        return false;
    }
}

/* EntryPointRoot */

type EntryPointRootType = MichelsonTypeOr<
    MichelsonTypeOr<
        MichelsonType<"string">,
        MichelsonType<"address">>,
    MichelsonTypeOr<
        MichelsonType<"bytes">,
        MichelsonType<"timestamp">>>;

type EntryPointRootArg = {
    use_string: string;
    use_addr?: undefined;
    use_bytes?: undefined;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr: string;
    use_bytes?: undefined;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr?: undefined;
    use_bytes: Uint8Array | number[] | string;
    use_ts?: undefined;
} | {
    use_string?: undefined;
    use_addr?: undefined;
    use_bytes?: undefined;
    use_ts: string | number | Date;
};

type EntryPointRootData = MichelsonData<EntryPointRootType>;

const entryPointRoot: EntryPointRootType = {
    prim: "or",
    args: [
        {
            prim: "or",
            args: [
                {
                    prim: "string",
                    annots: ["%use_string"]
                },
                {
                    prim: "address",
                    annots: ["%use_addr"]
                }
            ]
        },
        {
            prim: "or",
            args: [
                {
                    prim: "bytes",
                    annots: ["%use_bytes"]
                },
                {
                    prim: "timestamp",
                    annots: ["%use_ts"]
                }
            ]
        }
    ]
};

const decodeEntryPointRootArg = (src: EntryPointRootData): EntryPointRootArg => (src.prim === "Left" ?
    src.args[0].prim === "Left" ?
        {
            use_string: src.args[0].args[0].string
        } :
        {
            use_addr: src.args[0].args[0].string
        } :
    src.args[0].prim === "Left" ?
        {
            use_bytes: (v => {
                const b: number[] = [];
                for (let i = 0; i < v.bytes.length; i += 2) {
                    b.push(parseInt(v.bytes.slice(i, i + 2), 16));
                }
                return b;
            })(src.args[0].args[0])
        } :
        {
            use_ts: (v => new Date("string" in v ? v.string : parseInt(v.int, 10) * 1000))(src.args[0].args[0])
        });

const encodeEntryPointRootArg = (src: EntryPointRootArg): EntryPointRootData => (src.use_string !== undefined ?
    {
        prim: "Left",
        args: [{
            prim: "Left",
            args: [{ string: src.use_string }]
        }]
    } :
    src.use_addr !== undefined ?
        {
            prim: "Left",
            args: [{
                prim: "Right",
                args: [{ string: src.use_addr }]
            }]
        } :
        src.use_bytes !== undefined ?
            {
                prim: "Right",
                args: [{
                    prim: "Left",
                    args: [{ bytes: (v => typeof v === "string" ? v : [...v].map(x => (x >> 4 & 0xf).toString(16) + (x & 0xf).toString(16)).join(""))(src.use_bytes) }]
                }]
            } :
            {
                prim: "Right",
                args: [{
                    prim: "Right",
                    args: [{ string: (v => v instanceof Date ? v.toISOString() : typeof v === "number" ? new Date(v * 1000).toISOString() : v)(src.use_ts) }]
                }]
            });

function assertEntryPointRootData(d: MichelsonData): d is EntryPointRootData {
    return assertDataValid(d, entryPointRoot, { contract: contract });
}

function isEntryPointRootData(d: MichelsonData): d is EntryPointRootData {
    try {
        return assertDataValid(d, entryPointRoot, { contract: contract });
    } catch {
        return false;
    }
}

/* EntryPointUseString */

type EntryPointUseStringType = MichelsonType<"string">;

type EntryPointUseStringArg = string;

type EntryPointUseStringData = MichelsonData<EntryPointUseStringType>;

const entryPointUseString: EntryPointUseStringType = {
    prim: "string",
    annots: ["%use_string"]
};

const decodeEntryPointUseStringArg = (src: EntryPointUseStringData): EntryPointUseStringArg => (src.string);

const encodeEntryPointUseStringArg = (src: EntryPointUseStringArg): EntryPointUseStringData => ({ string: src });

function assertEntryPointUseStringData(d: MichelsonData): d is EntryPointUseStringData {
    return assertDataValid(d, entryPointUseString, { contract: contract });
}

function isEntryPointUseStringData(d: MichelsonData): d is EntryPointUseStringData {
    try {
        return assertDataValid(d, entryPointUseString, { contract: contract });
    } catch {
        return false;
    }
}

/* EntryPointUseAddr */

type EntryPointUseAddrType = MichelsonType<"address">;

type EntryPointUseAddrArg = string;

type EntryPointUseAddrData = MichelsonData<EntryPointUseAddrType>;

const entryPointUseAddr: EntryPointUseAddrType = {
    prim: "address",
    annots: ["%use_addr"]
};

const decodeEntryPointUseAddrArg = (src: EntryPointUseAddrData): EntryPointUseAddrArg => (src.string);

const encodeEntryPointUseAddrArg = (src: EntryPointUseAddrArg): EntryPointUseAddrData => ({ string: src });

function assertEntryPointUseAddrData(d: MichelsonData): d is EntryPointUseAddrData {
    return assertDataValid(d, entryPointUseAddr, { contract: contract });
}

function isEntryPointUseAddrData(d: MichelsonData): d is EntryPointUseAddrData {
    try {
        return assertDataValid(d, entryPointUseAddr, { contract: contract });
    } catch {
        return false;
    }
}

/* EntryPointUseBytes */

type EntryPointUseBytesType = MichelsonType<"bytes">;

type EntryPointUseBytesArg = Uint8Array | number[] | string;

type EntryPointUseBytesData = MichelsonData<EntryPointUseBytesType>;

const entryPointUseBytes: EntryPointUseBytesType = {
    prim: "bytes",
    annots: ["%use_bytes"]
};

const decodeEntryPointUseBytesArg = (src: EntryPointUseBytesData): EntryPointUseBytesArg => ((v => {
    const b: number[] = [];
    for (let i = 0; i < v.bytes.length; i += 2) {
        b.push(parseInt(v.bytes.slice(i, i + 2), 16));
    }
    return b;
})(src));

const encodeEntryPointUseBytesArg = (src: EntryPointUseBytesArg): EntryPointUseBytesData => ({ bytes: (v => typeof v === "string" ? v : [...v].map(x => (x >> 4 & 0xf).toString(16) + (x & 0xf).toString(16)).join(""))(src) });

function assertEntryPointUseBytesData(d: MichelsonData): d is EntryPointUseBytesData {
    return assertDataValid(d, entryPointUseBytes, { contract: contract });
}

function isEntryPointUseBytesData(d: MichelsonData): d is EntryPointUseBytesData {
    try {
        return assertDataValid(d, entryPointUseBytes, { contract: contract });
    } catch {
        return false;
    }
}

/* EntryPointUseTs */

type EntryPointUseTsType = MichelsonType<"timestamp">;

type EntryPointUseTsArg = string | number | Date;

type EntryPointUseTsData = MichelsonData<EntryPointUseTsType>;

const entryPointUseTs: EntryPointUseTsType = {
    prim: "timestamp",
    annots: ["%use_ts"]
};

const decodeEntryPointUseTsArg = (src: EntryPointUseTsData): EntryPointUseTsArg => ((v => new Date("string" in v ? v.string : parseInt(v.int, 10) * 1000))(src));

const encodeEntryPointUseTsArg = (src: EntryPointUseTsArg): EntryPointUseTsData => ({ string: (v => v instanceof Date ? v.toISOString() : typeof v === "number" ? new Date(v * 1000).toISOString() : v)(src) });

function assertEntryPointUseTsData(d: MichelsonData): d is EntryPointUseTsData {
    return assertDataValid(d, entryPointUseTs, { contract: contract });
}

function isEntryPointUseTsData(d: MichelsonData): d is EntryPointUseTsData {
    try {
        return assertDataValid(d, entryPointUseTs, { contract: contract });
    } catch {
        return false;
    }
}

/* Contract literal with trimmed code section */

const contract: MichelsonContract = [
    {
        prim: "parameter",
        args: [parameter],
        annots: ["%root"],
    },
    {
        prim: "storage",
        args: [storage],
    },
    {
        prim: "code",
        args: [[]],
    }
];

/* Entry Points */

export type EntryPointID = "root" |
    "use_string" |
    "use_addr" |
    "use_bytes" |
    "use_ts";

export type EntryPointArg<id extends EntryPointID> = id extends "root" ? EntryPointRootArg :
    id extends "use_string" ? EntryPointUseStringArg :
    id extends "use_addr" ? EntryPointUseAddrArg :
    id extends "use_bytes" ? EntryPointUseBytesArg :
    EntryPointUseTsArg;

export type EntryPointType<id extends EntryPointID> = id extends "root" ? EntryPointRootType :
    id extends "use_string" ? EntryPointUseStringType :
    id extends "use_addr" ? EntryPointUseAddrType :
    id extends "use_bytes" ? EntryPointUseBytesType :
    EntryPointUseTsType;

export type EntryPointData<id extends EntryPointID> = id extends "root" ? EntryPointRootData :
    id extends "use_string" ? EntryPointUseStringData :
    id extends "use_addr" ? EntryPointUseAddrData :
    id extends "use_bytes" ? EntryPointUseBytesData :
    EntryPointUseTsData;

export const entryPoints = {
    "root": entryPointRoot,
    "use_string": entryPointUseString,
    "use_addr": entryPointUseAddr,
    "use_bytes": entryPointUseBytes,
    "use_ts": entryPointUseTs
} as const;

export function assertEntryPointData<T extends EntryPointID>(id: T, d: MichelsonData): d is EntryPointData<T> {
    switch (id) {
        case "root":
            return assertEntryPointRootData(d);
        case "use_string":
            return assertEntryPointUseStringData(d);
        case "use_addr":
            return assertEntryPointUseAddrData(d);
        case "use_bytes":
            return assertEntryPointUseBytesData(d);
        default:
            return assertEntryPointUseTsData(d);
    }
}

export function isEntryPointData<T extends EntryPointID>(id: T, d: MichelsonData): d is EntryPointData<T> {
    switch (id) {
        case "root":
            return isEntryPointRootData(d);
        case "use_string":
            return isEntryPointUseStringData(d);
        case "use_addr":
            return isEntryPointUseAddrData(d);
        case "use_bytes":
            return isEntryPointUseBytesData(d);
        default:
            return isEntryPointUseTsData(d);
    }
}

export function decodeEntryPointArg<T extends EntryPointID>(id: T, src: EntryPointData<T>): EntryPointArg<T> {
    switch (id) {
        case "root":
            return decodeEntryPointRootArg(src as EntryPointRootData) as EntryPointArg<T>;
        case "use_string":
            return decodeEntryPointUseStringArg(src as EntryPointUseStringData) as EntryPointArg<T>;
        case "use_addr":
            return decodeEntryPointUseAddrArg(src as EntryPointUseAddrData) as EntryPointArg<T>;
        case "use_bytes":
            return decodeEntryPointUseBytesArg(src as EntryPointUseBytesData) as EntryPointArg<T>;
        default:
            return decodeEntryPointUseTsArg(src as EntryPointUseTsData) as EntryPointArg<T>;
    }
}

export function encodeEntryPointArg<T extends EntryPointID>(id: T, src: EntryPointArg<T>): EntryPointData<T> {
    switch (id) {
        case "root":
            return encodeEntryPointRootArg(src as EntryPointRootArg) as EntryPointData<T>;
        case "use_string":
            return encodeEntryPointUseStringArg(src as EntryPointUseStringArg) as EntryPointData<T>;
        case "use_addr":
            return encodeEntryPointUseAddrArg(src as EntryPointUseAddrArg) as EntryPointData<T>;
        case "use_bytes":
            return encodeEntryPointUseBytesArg(src as EntryPointUseBytesArg) as EntryPointData<T>;
        default:
            return encodeEntryPointUseTsArg(src as EntryPointUseTsArg) as EntryPointData<T>;
    }
}
```

## Usage examples

### Example 1

```typescript
import { Expr, isMichelsonData, Parser } from "@taquito/michel-codec";
import * as MyContract from "./generated";

// jsonStorage may be originated in Tezos RPC
function printContractStorageNatArg(jsonStorage: object) {
    // Validate jsonStorage as Michelson expression
    const data: Expr = new Parser({ expandMacros: true }).parseJSON(jsonStorage);

    // Use type guards
    if (isMichelsonData(data) && MyContract.isStorageData(data)) {
        const param = MyContract.decodeStorage(data);
        console.log(param.nat);
    } else {
        console.log("Invalid data literal");
    }
}
```

### Example 2

```typescript
import { encodeEntryPointArg, EntryPointArg } from "./generated";

function callBytesEndPoint() {
    const arg: EntryPointArg<"use_bytes"> = "deadbeef";
    const data = encodeEntryPointArg("use_bytes", arg);

    // Use data to forge an operation
    // ...
}
```

