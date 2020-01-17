open Jest;
open Expect;
open Js.Promise;
open PromiseMonad;

open Taquito;
let bootstrap1_sk = "edsk3gUfUPyBSfrS9CCgmCiQsTCHGkviBDusMxDJstFtojtc1zcpsh";
let bootstrap1 = "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx";
let bootstrap2 = "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN";
let server = "http://localhost:18731";
%bs.raw
{|
 jest.setTimeout(2000000);
|};

module T = {
  type t = int;

  let cast = a => {
    %bs.raw
    {| parseInt(a) |};
  };
};
module ApplicationStorage = Taquito.ContractProvider(T);

describe("init", () => {
  let inMemorySigner = new_inMemorySigner(bootstrap1_sk);
  let providerParams = {rpc: server, signer: inMemorySigner};
  tezos->setProvider(providerParams);

  testPromise("verify balance bootstrap2", () =>
    tezos->Basic.get_balance(bootstrap2)
    |> then_(actual => {
         let expected = BigNumber.make("4000000000004")->BigNumber.to_string;
         let actual = BigNumber.to_string(actual);
         actual |> expect |> toBe(expected) |> resolve;
       })
  );
});

describe("transfer", () => {
  let inMemorySigner = new_inMemorySigner(bootstrap1_sk);
  let providerParams = {rpc: server, signer: inMemorySigner};
  tezos->setProvider(providerParams);

  testPromise("balance post transfer", () =>
    tezos->Basic.get_balance(bootstrap2)
    |> then_(balance_bootstrap2 =>
         {
           Js.log("before transfer;");
           let x = tezos->Transfer.mutez(
             ~source=bootstrap1,
             ~to_=bootstrap2,
             ~amount=1,
             (),
           );
           Js.log("after tranfer");
           x
         }
         |> then_(op =>
              Transfer.confirmation(
                op,
                ~confirmations=0.,
                ~interval=0.1,
                ~timeout=30.,
              )
              |> then_(_ =>
                   tezos->Basic.get_balance(bootstrap2)
                   |> then_(actual => {
                        let expected =
                          BigNumber.plus_int(balance_bootstrap2, 1)
                          ->BigNumber.to_string;
                        let actual = BigNumber.to_string(actual);
                        actual |> expect |> toEqual(expected) |> resolve;
                      })
                 )
            )
       )
  );
});

describe("origination", () => {
  let code = "parameter int; storage int; code { CAR; NIL operation; PAIR}";
  let balance = 1;
  let init = Michelson.(to_json(Int(BigNumber.make("10"))));
  let fee = 1000000000;
  let gasLimit = 500000;
  let storageLimit = 1500;
  let simple_contract =
    Origination.{code, balance, init, fee, gasLimit, storageLimit};

  testPromise("call store", () => {
    tezos->Origination.originate(simple_contract)
    >>= (
      orig => {
        Js.log(Origination.contractAddress(orig));
        Origination.confirmation(
          orig,
          ~confirmations=0.,
          ~interval=0.001,
          ~timeout=30.,
        )
        >>- (_ => orig);
      }
    )
    >>= (
      orig => {
        let contractAddress = Origination.contractAddress(orig);
        tezos->Transfer.call(
          ~entrypoint="default",
          ~value=Michelson.Int(BigNumber.make("392392")),
          ~to_=contractAddress,
          ~source=bootstrap1,
          ~amount=1,
          (),
        )
        >>- (transfer => (transfer, orig));
      }
    )
    >>= (
      ((transfer, orig)) => {
        Transfer.confirmation(
          transfer,
          ~confirmations=0.,
          ~interval=0.001,
          ~timeout=30.,
        )
        >>- (_ => orig);
      }
    )
    >>= (
      orig => {
        let contractAddress = Origination.contractAddress(orig);
        tezos->ApplicationStorage.get_storage(contractAddress);
      }
    )
    >>- (r => expect(r) |> toBe(392392))
  });
}) /* })*/;

// describe("origination/get_storage", () => {
//   let code = "parameter int; storage int; code { CAR; NIL operation; PAIR}";
//   let balance = 1;
//   let init = "10";
//   let fee = 100000000000;
//   let gasLimit = 500000;
//   let storageLimit = 1500;
//   let simple_contract =
//     ApplicationStorage.originateParams(
//       ~code,
//       ~balance,
//       ~init,
//       ~fee,
//       ~gasLimit,
//       ~storageLimit,
//     );

//   testPromise("call get_storage", () =>
//     tezos->ApplicationStorage.originate(simple_contract)
//     |> then_(op => {
//          Js.log(ApplicationStorage.contractAddress(op));
//          Origination.confirmation(
//            op,
//            ~confirmations=0.,
//            ~interval=0.1,
//            ~timeout=10.,
//          )
//          >>= (
//            _ => {
//              let contractAddress = ApplicationStorage.contractAddress(op);
//              tezos->ApplicationStorage.get_storage(contractAddress);
//            }
//          )
//          >>- (r => expect(r) |> toBe(10));
//        })
//   );