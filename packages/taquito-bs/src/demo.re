open Taquito

let bootstrap1 = "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx";
let bootstrap1_sk = "edsk3gUfUPyBSfrS9CCgmCiQsTCHGkviBDusMxDJstFtojtc1zcpsh";
let inMemorySigner = new_inMemorySigner(bootstrap1_sk);

tezos -> setProvider({ rpc : "http://localhost:18732", signer: inMemorySigner});

Js.log("retrieve balance of " ++ bootstrap1);

tezos -> Basic.get_balance(bootstrap1) -> Js.log;

//provider ->
//ContractProvider.originate({ source : "tz1wdkowkdwo" }) ->
//Js.log ;

