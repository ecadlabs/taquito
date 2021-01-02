import { Address } from "./values/address";
import { Contract } from "./values/contract";
import { Int } from "./values/int"
import { Left } from "./values/left"
import { Pair } from "./values/pair"
import { Right } from "./values/right"

export type MichelsonValue = Pair | Int | Left | Right | Address | Contract;

export function createValues(value: any, type: any): any {
  switch (type.prim) {
    case "int":
      return Int.from(value)
    case "or":
      if (value.prim === "left") {
        return new Left(createValues(value.args[0], type.args[0]))
      } else {
        return new Right(createValues(value.args[0], type.args[1]))
      }
    case "pair":
      return new Pair(
        createValues(value.args[0], type.args[0]),
        createValues(value.args[1], type.args[1])
      )
    case "contract":
      return Contract.from(value)
    case "address":
      return Address.from(value)
  }
}
