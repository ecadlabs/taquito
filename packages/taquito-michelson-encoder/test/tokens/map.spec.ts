import { MapToken } from "../../src/tokens/map";
import { MichelsonMap } from "../../src/michelson-map";
import { createToken } from "../../src/tokens/createToken";
import BigNumber from "bignumber.js";

describe('Map token', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken({ prim: 'map', args: [{ prim: "string" }, { prim: "int" }], annots: [] }, 0) as MapToken;
  });

  it('Encode properly an empty map', () => {
    const map = new MichelsonMap()
    const result = token.Encode([map])
    expect(result).toEqual([])
  })


  it('Encode properly a map with one value', () => {
    const map = new MichelsonMap()
    map.set("test", 1)
    const result = token.Encode([map])
    expect(result).toEqual([{ prim: "Elt", args: [{ string: "test" }, { int: "1" }] }])
  })
})

describe('Map token with pair', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken({ prim: 'map', args: [{ prim: "pair", args: [{ prim: "string" }, { prim: "string" }] }, { prim: "int" }], annots: [] }, 0) as MapToken;
  });

  it('Encode properly an empty map', () => {
    const map = new MichelsonMap()
    const result = token.Encode([map])
    expect(result).toEqual([])
  })


  it('Encode properly a map with one value', () => {
    const map = new MichelsonMap()
    map.set({ 0: "test", 1: "1test" }, 2)
    map.set({ 0: "test1", 1: "test" }, 3)
    const result = token.Encode([map])
    expect(result).toEqual([
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test" }, { string: "1test" }] }, { int: "2" }] },
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test1" }, { string: "test" }] }, { int: "3" }] }
    ])
  })

  it('EncodeObject properly a map with one value', () => {
    const map = new MichelsonMap()
    map.set({ 0: "test", 1: "1test" }, 2)
    map.set({ 0: "test1", 1: "test" }, 3)
    const result = token.EncodeObject(map)
    expect(result).toEqual([
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test" }, { string: "1test" }] }, { int: "2" }] },
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test1" }, { string: "test" }] }, { int: "3" }] }
    ])
  })

  it('Execute properly on storage', () => {
    const result = token.Execute([
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test" }, { string: "1test" }] }, { int: "2" }] },
      { prim: "Elt", args: [{ prim: "Pair", args: [{ string: "test1" }, { string: "test" }] }, { int: "3" }] }
    ])

    expect(result).toBeInstanceOf(MichelsonMap);
    expect(result.get({ 0: "test", 1: "1test" })).toBeInstanceOf(BigNumber);
    expect(result.get({ 0: "test", 1: "1test" }).toString()).toEqual('2');

    expect(result.get({ 0: "test1", 1: "test" })).toBeInstanceOf(BigNumber);
    expect(result.get({ 0: "test1", 1: "test" }).toString()).toEqual('3');
  })
})
