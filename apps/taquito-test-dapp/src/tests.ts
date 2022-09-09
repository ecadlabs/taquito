import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  MichelsonMap,
  OpKind
} from "@taquito/taquito";
import type { ContractProvider } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import { char2Bytes, verifySignature } from "@taquito/utils";
import type { RequestSignPayloadInput } from "@airgap/beacon-sdk";
import { SigningType } from "./types";
import { get } from "svelte/store";
import type { TestSettings, TestResult } from "./types";
import store from "./store";
import contractToOriginate from "./contractToOriginate";
import localStore from "./store";

const preparePayloadToSign = (
  input: string,
  userAddress: string
): {
  payload: RequestSignPayloadInput;
  formattedInput: string;
} => {
  const formattedInput = `Tezos Signed Message: taquito-test-dapp.netlify.app/ ${new Date().toISOString()} ${input}`;
  const bytes = char2Bytes(formattedInput);
  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: "05" + "0100" + char2Bytes(bytes.length.toString()) + bytes,
    sourceAddress: userAddress
  };
  return {
    payload,
    formattedInput
  };
};

const sendTez = async (Tezos: TezosToolkit): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await Tezos.wallet
      .transfer({ to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb", amount: 0.1 })
      .send();
    await op.confirmation();
    opHash = op.opHash;
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const sendInt = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.simple_param(5).send();
    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const sendComplexParam = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    // const op = await contract.methods.complex_param(5, "Taquito").send();
    const op = await contract.methodsObject
      .complex_param({ 0: 5, 1: "Taquito" })
      .send();
    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const callFail = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.fail([["unit"]]).send();
    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    console.log(error);
    if (
      error.hasOwnProperty("data") &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1].hasOwnProperty("with") &&
      error.data[1].with.hasOwnProperty("string") &&
      error.data[1].with.string === "Fail entrypoint"
    ) {
      return { success: true, opHash };
    } else {
      return { success: false, opHash: "" };
    }
  }
};

const callFaiWithInt = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.fail_with_int([["unit"]]).send();
    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    console.log(error);
    if (
      error.hasOwnProperty("data") &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1].hasOwnProperty("with") &&
      error.data[1].with.hasOwnProperty("int") &&
      error.data[1].with.int == 5
    ) {
      return { success: true, opHash };
    } else {
      return { success: false, opHash: "" };
    }
  }
};

const callFaiWithPair = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.fail_with_pair([["unit"]]).send();
    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    console.log(error);
    if (
      error.hasOwnProperty("data") &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1].hasOwnProperty("with") &&
      error.data[1].with.hasOwnProperty("prim") &&
      error.data[1].with.prim === "Pair" &&
      error.data[1].with.hasOwnProperty("args") &&
      Array.isArray(error.data[1].with.args) &&
      error.data[1].with.args.length === 2 &&
      error.data[1].with.args[0].hasOwnProperty("int") &&
      error.data[1].with.args[0].int == 6 &&
      error.data[1].with.args[1].hasOwnProperty("string") &&
      error.data[1].with.args[1].string === "taquito"
    ) {
      return { success: true, opHash };
    } else {
      return { success: false, opHash: "" };
    }
  }
};

const originateSuccess = async (Tezos: TezosToolkit): Promise<TestResult> => {
  let opHash = "";
  try {
    // fetches contract code
    const storage = new MichelsonMap();
    const op = await Tezos.wallet
      .originate({ code: contractToOriginate, storage })
      .send();
    opHash = op.opHash;
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const batchApiTest = async (Tezos: TezosToolkit): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await Tezos.wallet
      .batch([
        {
          kind: OpKind.TRANSACTION,
          to: "tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu",
          amount: 300000,
          mutez: true
        },
        {
          kind: OpKind.TRANSACTION,
          to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
          amount: 300000,
          mutez: true
        },
        {
          kind: OpKind.TRANSACTION,
          to: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
          amount: 300000,
          mutez: true
        }
      ])
      .send();
    opHash = op.opHash;
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const batchApiContractCallsTest = async (
  Tezos: TezosToolkit,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>,
  callToContract
): Promise<TestResult> => {
  let opHash = "";
  try {
    const storage: any = await contract.storage();
    /*const batch = Tezos.wallet
        .batch()
        .withContractCall(contract.methods.simple_param(5))
        .withContractCall(contract.methods.simple_param(6))
        .withContractCall(contract.methods.simple_param(7));
      const op = await batch.send();*/
    const batch = [
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods.simple_param(5).toTransferParams()
      },
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods.simple_param(6).toTransferParams()
      },
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods.simple_param(7).toTransferParams()
      }
    ];
    const op = await callToContract.batch(batch).send();
    opHash = op.opHash;
    await op.confirmation();
    const newStorage: any = await contract.storage();
    if (
      newStorage.simple.toNumber() ===
      storage.simple.toNumber() + 5 + 6 + 7
    ) {
      return { success: true, opHash };
    } else {
      throw `Unexpected number in storage, expected ${storage.simple.toNumber()}, got ${newStorage.simple.toNumber()}`;
    }
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const signPayload = async (
  input: string,
  wallet: BeaconWallet
): Promise<TestResult> => {
  const userAddress = await wallet.getPKH();
  const { payload, formattedInput } = preparePayloadToSign(input, userAddress);
  try {
    const signedPayload = await wallet.client.requestSignPayload(payload);
    return {
      success: true,
      opHash: "",
      output: signedPayload.signature,
      sigDetails: { input, formattedInput, bytes: payload.payload }
    };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "", output: JSON.stringify(error) };
  }
};

const signPayloadAndSend = async (
  input: string,
  wallet: BeaconWallet,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  if (!input) throw "No input provided";

  const userAddress = await wallet.getPKH();
  const { payload, formattedInput } = preparePayloadToSign(input, userAddress);
  try {
    const signedPayload = await wallet.client.requestSignPayload(payload);
    // gets user's public key
    const activeAccount = await wallet.client.getActiveAccount();
    const publicKey = activeAccount.publicKey;
    // sends transaction to contract
    const op = await contract.methods
      .check_signature(publicKey, signedPayload.signature, payload.payload)
      .send();
    await op.confirmation();
    return {
      success: true,
      opHash: op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"],
      output: signedPayload.signature,
      sigDetails: { input, formattedInput, bytes: payload.payload }
    };
  } catch (error) {
    return { success: false, opHash: "", output: JSON.stringify(error) };
  }
};

const verifySignatureWithTaquito = async (
  input: string,
  wallet: BeaconWallet,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  if (!input) throw "No input provided";

  const userAddress = await wallet.getPKH();
  const { payload, formattedInput } = preparePayloadToSign(input, userAddress);
  try {
    const signedPayload = await wallet.client.requestSignPayload(payload);
    // gets user's public key
    const activeAccount = await wallet.client.getActiveAccount();
    const publicKey = activeAccount.publicKey;
    // verifies signature
    const isSignatureCorrect = verifySignature(
      payload.payload,
      publicKey,
      signedPayload.signature
    );
    if (isSignatureCorrect) {
      return {
        success: true,
        opHash: "",
        output: signedPayload.signature,
        sigDetails: { input, formattedInput, bytes: payload.payload }
      };
    } else {
      throw "Forged signature is incorrect";
    }
  } catch (error) {
    return { success: false, opHash: "", output: JSON.stringify(error) };
  }
};

const setTransactionLimits = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>,
  fee: string,
  storageLimit: string,
  gasLimit: string
): Promise<TestResult> => {
  let opHash = "";
  try {
    let op;
    if (isNaN(+fee) || isNaN(+storageLimit) || isNaN(+gasLimit)) {
      // if one of the parameters is missing, transaction is sent as is
      op = await contract.methods.simple_param(5).send();
    } else {
      op = await contract.methods.simple_param(5).send({
        storageLimit: +storageLimit,
        gasLimit: +gasLimit,
        fee: +fee
      });
    }

    opHash = op.hasOwnProperty("opHash") ? op["opHash"] : op["hash"];
    await op.confirmation();
    console.log("Operation successful with op hash:", opHash);
    return { success: true, opHash };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const tryConfirmationObservable = async (
  contract: ContractAbstraction<Wallet>
): Promise<TestResult> => {
  let opHash = "";
  try {
    /*const op = await Tezos.wallet
        .transfer({ to: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb", amount: 1 })
        .send();*/
    store.resetConfirmationObservableTest();

    const storage: any = await contract.storage();
    const val = storage.simple.toNumber() + 1;
    const op = await contract.methods.simple_param(val).send();

    const entries = await new Promise((resolve, reject) => {
      const evts: any[] = [];
      op.confirmationObservable(3).subscribe(
        event => {
          console.log(event);
          const entry = {
            level: event.block.header.level,
            currentConfirmation: event.currentConfirmation
          };
          store.updateConfirmationObservableTest(entry);
          evts.push(entry);
        },
        () => reject(null),
        () => resolve(evts)
      );
    });

    console.log({ entries });

    return { success: true, opHash, confirmationObsOutput: entries as any };
  } catch (error) {
    console.log(error);
    return { success: false, opHash: "" };
  }
};

const permit = async (Tezos: TezosToolkit, wallet: BeaconWallet) => {
  const store = get(localStore);

  const expectedBytes =
    "05070707070a00000004f5f466ab0a0000001601c6ac120153e9a6f3daa3ecdfbf0bb13f529f832500070700000a0000002105a6a36a686b864c75b0cf59816d24c8649f6f6fb0ea10c4beaed8988d1d55edef";

  try {
    const contractAddress = "KT1ShFVQPoLvekQu21pvuJst7cG1TjtnzdvW";
    const contract = await Tezos.wallet.at(contractAddress);
    // hashes the parameter for the contract call
    const mintParam: any = contract.methods
      .mint(store.userAddress, 100)
      .toTransferParams().parameter?.value;
    const mintParamType = contract.entrypoints.entrypoints["mint"];
    // packs the entrypoint call
    const rawPacked = await Tezos.rpc.packData({
      data: mintParam,
      type: mintParamType
    });
    const packedParam = rawPacked.packed;
    const paramHash = packedParam;
    /*"05" +
        buf2hex(blake.blake2b(hex2buf(packedParam), null, 32).buffer as Buffer);*/
    // hashes the parameter for the signature
    const chainId = await Tezos.rpc.getChainId();
    const contractStorage: any = await contract.storage();
    const counter = contractStorage.counter;
    const sigParamData: any = {
      prim: "Pair",
      args: [
        {
          prim: "Pair",
          args: [
            {
              string: chainId
            },
            {
              string: contractAddress
            }
          ]
        },
        {
          prim: "Pair",
          args: [
            {
              int: counter
            },
            {
              string: paramHash
            }
          ]
        }
      ]
    };
    const sigParamType = {
      prim: "pair",
      args: [
        {
          prim: "pair",
          args: [
            {
              prim: "chain_id"
            },
            { prim: "address" }
          ]
        },
        {
          prim: "pair",
          args: [{ prim: "nat" }, { prim: "string" }]
        }
      ]
    };
    const sigParamPacked = await Tezos.rpc.packData({
      data: sigParamData,
      type: sigParamType
    });
    console.log(sigParamPacked.packed, paramHash);
    // signs the hash
    /*const sig = await wallet.client.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: paramHash,
        sourceAddress: store.userAddress
      });
      const { publicKey } = await wallet.client.getActiveAccount();
      const permitMethodOp = await contract.methods
        .permit([{ 0: publicKey, 1: sig.signature, 2: paramHash }])
        .send();
      await permitMethodOp.confirmation();
      console.log(permitMethodOp.opHash);*/
  } catch (error) {
    console.error(error);
  }

  return { success: false, opHash: "" };
};

const sapling = async (
  contract: ContractAbstraction<Wallet>
): Promise<TestResult> => {
  return { success: false, opHash: "" };
};

export const list = [
  "Send tez",
  "Contract call with int",
  "Contract call with (pair nat string)",
  "Contract call that fails",
  "Contract call that fails with int",
  "Contract call that fails with (pair int string)",
  "Originate smart contract with success",
  "Use the Batch API with a wallet",
  "Use the Batch API for contract calls",
  "Sign the provided payload",
  "Sign and send the signature to the contract",
  "Verify a provided signature",
  "Set the transaction limits",
  "Subscribe to confirmations",
  "Permit contract",
  "Sapling"
];

export const init = (
  Tezos: TezosToolkit,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>,
  wallet: BeaconWallet | undefined
): TestSettings[] => [
  {
    id: "send-tez",
    name: "Send tez",
    description: "This test sends 0.1 tez to Alice's address",
    run: () => sendTez(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-simple-type",
    name: "Contract call with int",
    description: "This test calls a contract entrypoint and passes an int",
    run: () => sendInt(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-complex-type",
    name: "Contract call with (pair nat string)",
    description:
      "This test calls a contract entrypoint and passes a pair holding a nat and a string",
    run: () => sendComplexParam(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail",
    name: "Contract call that fails",
    description:
      'This test calls a contract entrypoint that fails with the message "Fail entrypoint"',
    run: () => callFail(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail-with-int",
    name: "Contract call that fails with int",
    description: "This test calls a contract entrypoint that fails with an int",
    run: () => callFaiWithInt(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail-with-pair",
    name: "Contract call that fails with (pair int string)",
    description: "This test calls a contract entrypoint that fails with a pair",
    run: () => callFaiWithPair(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "originate-success",
    name: "Originate smart contract with success",
    description: "This test successfully originates a smart contract",
    run: () => originateSuccess(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "batch-api",
    name: "Use the Batch API with a wallet",
    description: "This test sends 0.3 tez to 3 different addresses",
    run: () => batchApiTest(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "batch-api-contract-call",
    name: "Use the Batch API for contract calls",
    description: "This test calls the same entrypoint 3 times in 1 transaction",
    run: () =>
      batchApiContractCallsTest(
        Tezos,
        contract,
        wallet ? Tezos.wallet : Tezos.contract
      ),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "sign-payload",
    name: "Sign the provided payload",
    description: "This test signs the payload provided by the user",
    run: input => signPayload(input.text, wallet),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "sign-payload-and-send",
    name: "Sign and send the signature to the contract",
    description:
      "This test signs the provided payload and sends it to the contract to check it",
    run: input => signPayloadAndSend(input.text, wallet, contract),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "verify-signature",
    name: "Verify a provided signature",
    description:
      "This test signs the provided payload and uses Taquito to verify the signature",
    run: input => verifySignatureWithTaquito(input.text, wallet, contract),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "set-transaction-limits",
    name: "Set the transaction limits",
    description:
      "This test allows you to set the fee, storage limit and gas limit manually",
    run: input =>
      setTransactionLimits(
        contract,
        input.fee,
        input.storageLimit,
        input.gasLimit
      ),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "set-limits",
    lastResult: { option: "none", val: false }
  },
  {
    id: "confirmation-observable",
    name: "Subscribe to confirmations",
    description:
      "This test updates the underlying contract and subscribes to 3 confirmations",
    run: () =>
      tryConfirmationObservable(contract as ContractAbstraction<Wallet>),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "permit",
    name: "Permit contract",
    description: "This test implements TZIP-17",
    run: () => permit(Tezos, wallet),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "sapling",
    name: "Sapling transactions",
    description: "This test sends a sapling transaction",
    run: () => sapling(contract as ContractAbstraction<Wallet>),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "sapling",
    lastResult: { option: "none", val: false }
  }
  /*{
        id: "originate-fail",
        name: "Originate smart contract that fails",
        description: "This test originates a smart contract that fails",
        run: () => console.log("originate-fail")
      }*/
];
