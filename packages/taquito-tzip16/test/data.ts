export const example005 = {
    "name": "example-from-the-source",
    "description": "This is a fake metadata blob constructed at\nsrc/lib_contract_metadata/core/metadata_contents.ml in the Tezos codebase.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\neiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\nminim veniam, quis nostrud exercitation ullamco laboris nisi ut\naliquip ex ea commodo consequat.\n          \nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum\ndolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\nproident, sunt in culpa qui officia deserunt mollit anim id est\nlaborum.\n",
    "version": "0.42.0",
    "license": {
      "name": "MIT",
      "details": "The MIT License"
    },
    "homepage": "https://gitlab.com/tezos/tezos",
    "interfaces": [
      "TZIP-16",
      "TZIP-12"
    ],
    "views": [
      {
        "name": "view0",
        "implementations": [
          {
            "michelson-storage-view": {
              "return-type": {
                "prim": "nat"
              },
              "code": []
            }
          },
          {
            "rest-api-query": {
              "specification-uri": "https://example.com/v1.json",
              "path": "/get-something"
            }
          }
        ],
        "pure": true
      },
      {
        "name": "view-01",
        "implementations": [
          {
            "michelson-storage-view": {
              "parameter": {
                "prim": "pair",
                "args": [
                  {
                    "prim": "mutez",
                    "annots": [
                      "%amount"
                    ]
                  },
                  {
                    "prim": "string",
                    "annots": [
                      "%name"
                    ]
                  }
                ]
              },
              "return-type": {
                "prim": "map",
                "args": [
                  {
                    "prim": "string"
                  },
                  {
                    "prim": "string"
                  }
                ]
              },
              "code": [
                {
                  "prim": "DUP"
                },
                {
                  "prim": "DIP",
                  "args": [
                    [
                      {
                        "prim": "CDR"
                      },
                      {
                        "prim": "PUSH",
                        "args": [
                          {
                            "prim": "string"
                          },
                          {
                            "string": "Huh"
                          }
                        ]
                      },
                      {
                        "prim": "FAILWITH"
                      }
                    ]
                  ]
                }
              ],
              "annotations": [
                {
                  "name": "%amount",
                  "description": "The amount which should mean something in context. It's in `mutez` which should also mean something more than lorem ipsum dolor whatever …"
                },
                {
                  "name": "%name",
                  "description": "The name of the thing being queried."
                }
              ],
              "version": "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb"
            }
          }
        ]
      }
    ]
  }
  