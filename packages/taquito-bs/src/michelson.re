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
  | Map(list((t, t)));

module Json_short = {
  open Json.Encode;

  let o = object_;
  let s = string;
  let null = null;
  let a = array;
  let l = list;
  let p = pair;
  let simple_prim = name =>
    o([("prim", s(name))])
  let prim = (name, args) =>
    o([("prim", s(name)), ("args", args)])
};

open Json_short

let rec opt_json = t => {
  switch (t) {
  | None => simple_prim("None")
  | Some(t) => prim("Some", l(to_json)([t]))
  };
}

and map = a => {
  List.map(elt => {
    prim("Elt", p(to_json, to_json, elt))
  }, a)
  |> Array.of_list
  |> Json.Encode.jsonArray

}
and to_json = t => {
    switch (t) {
    | Int(n) => o([("int", s(BigNumber.to_string(n)))])
    | Nat(n) => o([("nat", s(BigNumber.to_string(n)))])
    | String(str) => o([("string", s(str))])
    | Left(t) => prim("Left", l(to_json)([t]))
    | Right(t) => prim("Right", l(to_json)([t]))
    | Pair(a, b) => prim("Pair", l(to_json)([a, b]))
    | Option(opt) => opt_json(opt)
    | List(a)
    | Set(a) => l(to_json, a)
    | Map(a) => map(a)
    }
};