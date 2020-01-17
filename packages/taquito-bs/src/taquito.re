// Bindings for @taquito/taquito

open PromiseMonad;

type toolkit;
type signer;

type providerParam = {
  rpc: string,
  signer,
};

type tzProvider;
type contractProvider;

type contractParams = {source: string};

type operation;
type contract;
type nat = BigNumber.t;

type sk = string;
type pk = string;
type addr = string;

/* Signers */

[@bs.module "@taquito/signer"] [@bs.new]
external inMemorySigner: sk => signer = "InMemorySigner";

[@bs.module "@taquito/tezbridge-signer"] [@bs.new]
external tezbridgeSigner: unit => signer = "TezBridgeSigner";

let new_inMemorySigner = sk => inMemorySigner(sk);
let new_tezbridge_signer = () => tezbridgeSigner();


/* The main object */

[@bs.module "@taquito/taquito"] external tezos: toolkit = "Tezos";

type providerParamObj = {
  rpc: string,
  signer,
};

[@bs.send]
external setProvider: (toolkit, providerParamObj) => unit = "setProvider";

// Tezos node
[@bs.get] external tzProvider: toolkit => tzProvider = "tz";
[@bs.get] external contractProvider: toolkit => contractProvider = "contract";
[@bs.get] external signer: toolkit => signer = "signer";

[@bs.send]
external getBalance: (tzProvider, addr) => Js.Promise.t(BigNumber.t) =
  "getBalance";

module Basic = {
  let get_balance = (toolkit, addr) => {
    getBalance(toolkit->tzProvider, addr);
  };
};

module Origination = {
  type t = {contractAddress: string};
  type params = {
    code: string,
    balance: int,
    init: Js.Json.t,
    fee: int,
    gasLimit: int,
    storageLimit: int,
  };

  [@bs.send]
  external originate:
    (contractProvider, params) => Js.Promise.t(t) =
    "originate";

  let originate = (toolkit, originateParams) => {
    originate(toolkit->contractProvider, originateParams);
  };

  [@bs.send]
  external confirmation:
    (t, float, float, float) => Js.Promise.t(unit) =
    "confirmation";

  let confirmation = (operation, ~confirmations, ~interval, ~timeout) => {
    confirmation(operation, confirmations, interval, timeout);
  };

  [@bs.get]
  external contractAddress: t => addr = "contractAddress";

  [@bs.get] external hash: t => string = "hash";
};

module Contract = {
  // This doesn't work
  type f;
  [@bs.get] external methods: contract => array((string, f)) = "methods";

  let call_meth = (contract, method_, args) => {
    let methods = methods(contract);
    let f = methods->Array.to_list->List.assoc(method_);
    f(args);
  };
};

type any;
module type StorageType = {
  type t;
  let cast: Js.Json.t => t;
};

module Transfer = {
  type t;

  type transferParams = {
    [@bs.as "to"]
    to_: string,
    amount: int,
    source: string,
    parameter: option(Js.Json.t),
    gasLimit: option(int),
    storageLimit: option(int),
    mutez: option(bool),
    rawParam: option(bool),
    fee: option(int),
  };

   [@bs.send]
  external confirmation:
    (t, float, float, float) => Js.Promise.t(unit) =
    "confirmation";


  [@bs.send]
  external transfer_ext:
    (contractProvider, transferParams) => Js.Promise.t(t) =
    "transfer";

  let transfer = (toolkit, to_, amount, source, ~fee=?, mutez) => {
    let params = {
      to_,
      amount,
      source,
      mutez,
      parameter: None,
      gasLimit: None,
      storageLimit: None,
      rawParam: None,
      fee
    }
    toolkit->contractProvider->transfer_ext(params)
  }

  let mutez = (toolkit, ~to_, ~amount, ~source, ~fee=?, ()) => {
    transfer(toolkit, to_, amount, source, ~fee?, Some(true))
  }

  let tez = (toolkit, ~to_, ~amount, ~source, ~fee=?, ()) => {
    transfer(toolkit, to_, amount, source, ~fee?, Some(false))
  }

  let call = (toolkit, ~entrypoint, ~value, ~to_, ~amount, ~source, ~fee=?, ~gasLimit=?, ()) => {
    let parameter =
      Json.Encode.(
        object_([
          ("entrypoint", string(entrypoint)),
          ("value", Michelson.to_json(value)),
        ])
      );
    let transfer_params = {
      to_,
      amount,
      source,
      parameter: Some(parameter),
      fee,
      gasLimit,
      storageLimit: None,
      mutez: Some(true),
      rawParam: Some(true)
    }
    toolkit->contractProvider->transfer_ext(transfer_params)
  };


  let confirmation = (operation, ~confirmations, ~interval, ~timeout) => {
    confirmation(operation, confirmations, interval, timeout);
  };
};

module ContractProvider = (T: StorageType) => {
  [@bs.send]
  external getStorage: (contractProvider, addr) => Js.Promise.t(Js.Json.t) =
    "getStorage";

  let get_storage = (toolkit, addr) => {
    getStorage(toolkit->contractProvider, addr)
    >>- (
      result => {
        Js.log(result);
        T.cast(result);
      }
    );
  };
};

module RpcClient = {};