export const getAddressIndexStorage = { prim: 'None' };

export const getAddressIndexCode = [
  {
    "prim": "parameter",
    "args": [
      {
        "prim": "address"
      }
    ]
  },
  {
    "prim": "storage",
    "args": [
      {
        "prim": "option",
        "args": [
          {
            "prim": "nat"
          }
        ]
      }
    ]
  },
  {
    "prim": "code",
    "args": [
      [
        {
          "prim": "CAR"
        },
        {
          "prim": "GET_ADDRESS_INDEX"
        },
        {
          "prim": "NIL",
          "args": [
            {
              "prim": "operation"
            }
          ]
        },
        {
          "prim": "PAIR"
        }
      ]
    ]
  }
]