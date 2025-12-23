export const getAddressIndexStorage = {
  string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
};

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