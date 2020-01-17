type sk = string;
type pk = string;
type addr = string;

type signer;
type toolkit;
type contractProvider;
let new_inMemorySigner: sk => signer;
let new_tezbridge_signer: unit => signer;
let tezos: toolkit;

type providerParamObj = {
  rpc: string,
  signer,
};

let setProvider: (toolkit, providerParamObj) => unit;

module Basic: {let get_balance: (toolkit, addr) => Js.Promise.t(BigNumber.t);
};

module Origination: {
  type t = {contractAddress: string};
  type params = {
    code: string,
    balance: int,
    init: Js.Json.t,
    fee: int,
    gasLimit: int,
    storageLimit: int,
  };

  let originate: (toolkit, params) => Js.Promise.t(t);
  let confirmation:
    (t, ~confirmations: float, ~interval: float, ~timeout: float) =>
    Js.Promise.t(unit);
  let contractAddress: t => addr;
  let hash: t => string;
};

module Transfer: {
  type t;
  let mutez:
    (
      toolkit,
      ~to_: string,
      ~amount: int,
      ~source: string,
      ~fee: int=?,
      unit
    ) =>
    Js.Promise.t(t);
  let tez:
    (
      toolkit,
      ~to_: string,
      ~amount: int,
      ~source: string,
      ~fee: int=?,
      unit
    ) =>
    Js.Promise.t(t);
  let call:
    (
      toolkit,
      ~entrypoint: string,
      ~value: Michelson.t,
      ~to_: string,
      ~amount: int,
      ~source: string,
      ~fee: int=?,
      ~gasLimit: int=?,
      unit
    ) =>
    Js.Promise.t(t);
  let confirmation:
    (t, ~confirmations: float, ~interval: float, ~timeout: float) =>
    Js.Promise.t(unit);
};

module type StorageType = {
  type t;
  let cast: Js.Json.t => t;
};

module ContractProvider: (T: StorageType) => {
  let get_storage: toolkit => addr => Js.Promise.t(T.t);
}