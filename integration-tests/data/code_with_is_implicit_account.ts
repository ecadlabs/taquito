export const isImplicitAccountStorage = { prim: 'None' };

export const isImplicitAccountCode = [
  {
    prim: "parameter",
    args: [
      {
        prim: "address"
      }
    ]
  },
  {
    prim: "storage",
    args: [
      {
        prim: "option",
        args: [
          {
            prim: "key_hash"
          }
        ]
      }
    ]
  },
  {
    prim: "code",
    args: [
      [
        {
          prim: "CAR"
        },
        {
          prim: "IS_IMPLICIT_ACCOUNT"
        },
        {
          prim: "NIL",
          args: [
            {
              prim: "operation"
            }
          ]
        },
        {
          prim: "PAIR"
        }
      ]
    ]
  }
]
