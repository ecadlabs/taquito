import { setChildRecordParam, updateDetailsParam } from '../data/sample15';
import { ParameterSchema } from '../src/schema/parameter';
import { MichelsonMap } from '../src/michelson-map';

describe('Schema test when calling contract with complex object as param and null value', () => {

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(setChildRecordParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //address(optional)
      dataMap,//data
      'AAAA', //label
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //owner
      'FFFF', //parent
      '1' //ttl(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "Some",
                  "args": [
                    {
                      "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                    }
                  ]
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Hello World"
                      },
                      {
                        "prim": "Left",
                        "args": [
                          {
                            "prim": "Left",
                            "args": [
                              {
                                "prim": "Left",
                                "args": [
                                  {
                                    "prim": "Right",
                                    "args": [
                                      {
                                        "prim": "True"
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
              ]
            },
            {
              "prim": "Pair",
              "args": [
                {
                  "bytes": "AAAA"
                },
                {
                  "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                }
              ]
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "FFFF"
            },
            {
              "prim": "Some",
              "args": [
                {
                  "int": "1"
                }
              ]
            }
          ]
        }
      ]
    });
  });

  it('Should encode parameter schema properly when first element which is optional is null', () => {
    const schema = new ParameterSchema(setChildRecordParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      null, //address(optional)
      dataMap,//data
      'AAAA', //label
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //owner
      'FFFF', //parent
      '1' //ttl(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "None"
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Hello World"
                      },
                      {
                        "prim": "Left",
                        "args": [
                          {
                            "prim": "Left",
                            "args": [
                              {
                                "prim": "Left",
                                "args": [
                                  {
                                    "prim": "Right",
                                    "args": [
                                      {
                                        "prim": "True"
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
              ]
            },
            {
              "prim": "Pair",
              "args": [
                {
                  "bytes": "AAAA"
                },
                {
                  "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                }
              ]
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "FFFF"
            },
            {
              "prim": "Some",
              "args": [
                {
                  "int": "1"
                }
              ]
            }
          ]
        }
      ]
    });
  });

  it('Should encode parameter schema properly when last element which is optional is null', () => {
    const schema = new ParameterSchema(setChildRecordParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //address(optional)
      dataMap,//data
      'AAAA', //label
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //owner
      'FFFF', //parent
      null //ttl(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "Some",
                  "args": [
                    {
                      "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                    }
                  ]
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Hello World"
                      },
                      {
                        "prim": "Left",
                        "args": [
                          {
                            "prim": "Left",
                            "args": [
                              {
                                "prim": "Left",
                                "args": [
                                  {
                                    "prim": "Right",
                                    "args": [
                                      {
                                        "prim": "True"
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
              ]
            },
            {
              "prim": "Pair",
              "args": [
                {
                  "bytes": "AAAA"
                },
                {
                  "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                }
              ]
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "FFFF"
            },
            {
              "prim": "None"
            }
          ]
        }
      ]
    });
  });

  it('Should encode parameter schema properly when first and last element which are optional are null', () => {
    const schema = new ParameterSchema(setChildRecordParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      null, //address(optional)
      dataMap,//data
      'AAAA', //label
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //owner
      'FFFF', //parent
      null //ttl(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "prim": "Pair",
              "args": [
                {
                  "prim": "None"
                },
                [
                  {
                    "prim": "Elt",
                    "args": [
                      {
                        "string": "Hello World"
                      },
                      {
                        "prim": "Left",
                        "args": [
                          {
                            "prim": "Left",
                            "args": [
                              {
                                "prim": "Left",
                                "args": [
                                  {
                                    "prim": "Right",
                                    "args": [
                                      {
                                        "prim": "True"
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
              ]
            },
            {
              "prim": "Pair",
              "args": [
                {
                  "bytes": "AAAA"
                },
                {
                  "string": "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
                }
              ]
            }
          ]
        },
        {
          "prim": "Pair",
          "args": [
            {
              "bytes": "FFFF"
            },
            {
              "prim": "None"
            }
          ]
        }
      ]
    });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(updateDetailsParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      '5',//id
      'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //new_controller(optional)
      'AAAA', //new_profile(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "5"
            },
            {
              "prim": "Some",
              "args": [
                {
                  "string": "tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr"
                }
              ]
            }
          ]
        },
        {
          "prim": "Some",
          "args": [
            {
              "bytes": "AAAA"
            }
          ]
        }
      ]
    });
  });

  it('Should encode parameter schema properly if last element which is optinal is null', () => {
    const schema = new ParameterSchema(updateDetailsParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      '5',//id
      'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //new_controller(optional)
      null, //new_profile(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "5"
            },
            {
              "prim": "Some",
              "args": [
                {
                  "string": "tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr"
                }
              ]
            }
          ]
        },
        {
          "prim": "None"
        }
      ]
    });
  });

  it('Should encode parameter schema properly if second and last elements which are optional are null', () => {
    const schema = new ParameterSchema(updateDetailsParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      '5',//id
      null, //new_controller(optional)
      null, //new_profile(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "5"
            },
            {
              "prim": "None"
            }
          ]
        },
        {
          "prim": "None"
        }
      ]
    });
  });

  it('Should encode parameter schema properly if second element which is optional is null', () => {
    const schema = new ParameterSchema(updateDetailsParam);
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", {bool:true})
    const result = schema.Encode(
      '5',//id
      null, //new_controller(optional)
      'AAAA', //new_profile(optional)
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({
      "prim": "Pair",
      "args": [
        {
          "prim": "Pair",
          "args": [
            {
              "int": "5"
            },
            {
              "prim": "None"
            }
          ]
        },
        {
          "prim": "Some",
          "args": [
            {
              "bytes": "AAAA"
            }
          ]
        }
      ]
    });
  });

});
