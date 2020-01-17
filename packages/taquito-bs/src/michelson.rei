type t = 
  | Int(BigNumber.t)
  | Nat(BigNumber.t)
  | String(string)
  | Option(option(t))
  | Pair(t, t)
  | Left(t)
  | Right(t)
  | List(list(t))
  | Set(list(t))
  | Map(list((t, t)))

let to_json: Json.Encode.encoder(t)