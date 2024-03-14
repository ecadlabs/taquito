export default [
  {
    prim: "parameter",
    args: [
      {
        prim: "pair",
        args: [
          { prim: "address", annots: ["%to"] },
          { prim: "nat", annots: ["%tokens"] }
        ]
      }
    ]
  },
  {
    prim: "storage",
    args: [
      {
        prim: "big_map",
        args: [{ prim: "address" }, { prim: "nat" }],
        annots: [":ledger"]
      }
    ]
  },
  {
    prim: "code",
    args: [
      [
        { prim: "AMOUNT" },
        { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
        [
          { prim: "COMPARE" },
          { prim: "NEQ" },
          {
            prim: "IF",
            args: [
              [
                {
                  prim: "PUSH",
                  args: [{ prim: "string" }, { string: "NOAMOUNTALLOWED" }]
                },
                { prim: "FAILWITH" }
              ],
              []
            ]
          }
        ],
        [
          [
            { prim: "DUP" },
            { prim: "CAR" },
            { prim: "DIP", args: [[{ prim: "CDR" }]] }
          ],
          [
            { prim: "DUP" },
            { prim: "CAR" },
            { prim: "DIP", args: [[{ prim: "CDR" }]] }
          ]
        ],
        { prim: "DUP" },
        { prim: "SENDER" },
        [
          { prim: "COMPARE" },
          { prim: "EQ" },
          {
            prim: "IF",
            args: [
              [
                {
                  prim: "PUSH",
                  args: [{ prim: "string" }, { string: "FORBIDDENSELFTRANFER" }]
                },
                { prim: "FAILWITH" }
              ],
              []
            ]
          }
        ],
        { prim: "DIG", args: [{ int: "2" }] },
        { prim: "DUP" },
        { prim: "SENDER" },
        { prim: "MEM" },
        {
          prim: "IF",
          args: [
            [
              { prim: "DUP" },
              { prim: "SENDER" },
              { prim: "GET" },
              {
                prim: "IF_NONE",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [{ prim: "string" }, { string: "ERROR" }]
                    },
                    { prim: "FAILWITH" }
                  ],
                  [
                    { prim: "DUP" },
                    { prim: "DIP", args: [{ int: "4" }, [{ prim: "DUP" }]] },
                    { prim: "DIG", args: [{ int: "4" }] },
                    [
                      { prim: "COMPARE" },
                      { prim: "GT" },
                      {
                        prim: "IF",
                        args: [
                          [
                            {
                              prim: "PUSH",
                              args: [
                                { prim: "string" },
                                { string: "INSUFFICIENTBALANCE" }
                              ]
                            },
                            { prim: "FAILWITH" }
                          ],
                          []
                        ]
                      }
                    ]
                  ]
                ]
              },
              { prim: "DIP", args: [{ int: "3" }, [{ prim: "DUP" }]] },
              { prim: "DIG", args: [{ int: "3" }] },
              { prim: "SWAP" },
              { prim: "SUB" },
              { prim: "ABS" },
              { prim: "SOME" },
              { prim: "SENDER" },
              { prim: "UPDATE" },
              { prim: "DIP", args: [[{ prim: "DUP" }]] },
              { prim: "SWAP" },
              { prim: "DIP", args: [[{ prim: "DUP" }]] },
              { prim: "MEM" },
              {
                prim: "IF",
                args: [
                  [
                    { prim: "SWAP" },
                    { prim: "DIP", args: [[{ prim: "DUP" }]] },
                    { prim: "DUP" },
                    { prim: "DIP", args: [[{ prim: "SWAP" }]] },
                    { prim: "GET" },
                    {
                      prim: "IF_NONE",
                      args: [
                        [
                          {
                            prim: "PUSH",
                            args: [
                              { prim: "string" },
                              { string: "UNKNOWNBALANCE" }
                            ]
                          },
                          { prim: "FAILWITH" }
                        ],
                        [
                          { prim: "DIG", args: [{ int: "3" }] },
                          { prim: "ADD" },
                          { prim: "SOME" },
                          { prim: "SWAP" },
                          { prim: "UPDATE" }
                        ]
                      ]
                    }
                  ],
                  [
                    { prim: "DUG", args: [{ int: "2" }] },
                    { prim: "DIP", args: [[{ prim: "SOME" }]] },
                    { prim: "UPDATE" }
                  ]
                ]
              },
              { prim: "NIL", args: [{ prim: "operation" }] },
              { prim: "PAIR" }
            ],
            [
              {
                prim: "PUSH",
                args: [{ prim: "string" }, { string: "UNKNOWNSPENDER" }]
              },
              { prim: "FAILWITH" }
            ]
          ]
        }
      ]
    ]
  }
];
