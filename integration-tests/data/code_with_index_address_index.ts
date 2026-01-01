export const indexAddressStorage = { prim: 'None' };

export const indexAddressCode = [
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
            prim: "nat"
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
          prim: "INDEX_ADDRESS"
        },
        {
          prim: "SOME"
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