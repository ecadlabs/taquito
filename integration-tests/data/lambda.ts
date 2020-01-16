export const transferImplicit2 = (key: string, key2: string, mutez: number) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'key_hash' }, { string: key }],
    },
    { prim: 'IMPLICIT_ACCOUNT' },
    {
      prim: 'PUSH',
      args: [{ prim: 'mutez' }, { int: `${mutez}` }],
    },
    { prim: 'UNIT' },
    { prim: 'TRANSFER_TOKENS' },
    { prim: 'CONS' },
    {
      prim: 'PUSH',
      args: [{ prim: 'key_hash' }, { string: key2 }],
    },
    { prim: 'IMPLICIT_ACCOUNT' },
    {
      prim: 'PUSH',
      args: [{ prim: 'mutez' }, { int: `${mutez}` }],
    },
    { prim: 'UNIT' },
    { prim: 'TRANSFER_TOKENS' },
    { prim: 'CONS' },
  ];
};

export const originate = () => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    { "prim": "NIL", "args": [{ "prim": "int" }] },
    { "prim": "AMOUNT" },
    {
      "prim": "NONE",
      "args": [{ "prim": "key_hash" }]
    },
    {
      "prim": "CREATE_CONTRACT",
      "args":
        [[{
          "prim": "parameter",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "storage",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "code",
          "args":
            [[{ "prim": "CAR" },
            {
              "prim": "MAP",
              "args":
                [[{
                  "prim": "PUSH",
                  "args":
                    [{ "prim": "int" },
                    { "int": "1" }]
                },
                { "prim": "ADD" }]]
            },
            {
              "prim": "NIL",
              "args":
                [{ "prim": "operation" }]
            },
            { "prim": "PAIR" }]]
        }]]
    },
    { prim: "SWAP" },
    { prim: "DROP" },
    { "prim": "CONS" }
  ]
}

export const originate2 = () => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    { "prim": "NIL", "args": [{ "prim": "int" }] },
    { "prim": "AMOUNT" },
    {
      "prim": "NONE",
      "args": [{ "prim": "key_hash" }]
    },
    {
      "prim": "CREATE_CONTRACT",
      "args":
        [[{
          "prim": "parameter",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "storage",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "code",
          "args":
            [[{ "prim": "CAR" },
            {
              "prim": "MAP",
              "args":
                [[{
                  "prim": "PUSH",
                  "args":
                    [{ "prim": "int" },
                    { "int": "1" }]
                },
                { "prim": "ADD" }]]
            },
            {
              "prim": "NIL",
              "args":
                [{ "prim": "operation" }]
            },
            { "prim": "PAIR" }]]
        }]]
    },
    { prim: "SWAP" },
    { prim: "DROP" },
    { "prim": "CONS" },
    { "prim": "NIL", "args": [{ "prim": "int" }] },
    { "prim": "AMOUNT" },
    {
      "prim": "NONE",
      "args": [{ "prim": "key_hash" }]
    },
    {
      "prim": "CREATE_CONTRACT",
      "args":
        [[{
          "prim": "parameter",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "storage",
          "args":
            [{
              "prim": "list",
              "args": [{ "prim": "int" }]
            }]
        },
        {
          "prim": "code",
          "args":
            [[{ "prim": "CAR" },
            {
              "prim": "MAP",
              "args":
                [[{
                  "prim": "PUSH",
                  "args":
                    [{ "prim": "int" },
                    { "int": "1" }]
                },
                { "prim": "ADD" }]]
            },
            {
              "prim": "NIL",
              "args":
                [{ "prim": "operation" }]
            },
            { "prim": "PAIR" }]]
        }]]
    },
    { prim: "SWAP" },
    { prim: "DROP" },
    { "prim": "CONS" }
  ]
}
