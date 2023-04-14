import {
  TezosToolkit,
  ContractAbstraction,
  Wallet,
  MichelsonMap,
  OpKind,
  ParamsWithKind,
  WalletParamsWithKind,
  TransactionOperation,
  TransactionWalletOperation
} from "@taquito/taquito";
import type { ContractProvider } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import { verifySignature } from "@taquito/utils";
import type { TestSettings, TestResult } from "./types";
import store from "./store";
import contractToOriginate from "./contractToOriginate";
import { preparePayloadToSign } from "./utils";


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
    return { success: false, opHash: "" };
  }
};

const sendInt = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.simple_param(5).send();
    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    return { success: false, opHash: "" };
  }
};

const sendComplexParam = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    // const op = await contract.methods.complex_param(5, "Taquito").send(); // This is the old way of calling a contract with multiple parameters
    const op = await contract.methodsObject
      .complex_param({ 0: 5, 1: "Taquito" })
      .send();
    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    return { success: false, opHash: "" };
  }
};

const callFail = async (
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
): Promise<TestResult> => {
  let opHash = "";
  try {
    const op = await contract.methods.fail([["unit"]]).send();
    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    if (
      error["data"] &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1]["with"] &&
      error.data[1].with["string"] &&
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
    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    if (
      error["data"] &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1]["with"] &&
      error.data[1].with["int"] &&
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
    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    if (
      error["data"] &&
      Array.isArray(error.data) &&
      error.data.length === 2 &&
      error.data[1]["with"] &&
      error.data[1].with["prim"] &&
      error.data[1].with.prim === "Pair" &&
      error.data[1].with["args"] &&
      Array.isArray(error.data[1].with.args) &&
      error.data[1].with.args.length === 2 &&
      error.data[1].with.args[0]["int"] &&
      error.data[1].with.args[0].int == 6 &&
      error.data[1].with.args[1]["string"] &&
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
    const storage = new MichelsonMap();
    const op = await Tezos.wallet
      .originate({ code: contractToOriginate, storage })
      .send();
    opHash = op.opHash;
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    return { success: false, opHash: "" };
  }
};

const originateFail = async (Tezos: TezosToolkit): Promise<TestResult> => {
  let opHash = "";
  try {
    const storage = new MichelsonMap();
    const op = await Tezos.wallet.originate({ code: contractToOriginate, storage, storageLimit: 0 }).send();
    opHash = op.opHash;
    await op.confirmation();
    return { success: false, opHash: "" };
  } catch (error) {
    return { success: true, opHash };
  }
}

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
    return { success: false, opHash: "" };
  }
};

const batchApiContractCallsTest = async (
  _Tezos: TezosToolkit,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>,
  callToContract: Wallet | ContractProvider
): Promise<TestResult> => {
  let opHash = "";
  try {
    const storage: { simple: string } = await contract.storage();
    /*const batch = Tezos.wallet
        .batch()
        .withContractCall(contract.methods.simple_param(5))
        .withContractCall(contract.methods.simple_param(6))
        .withContractCall(contract.methods.simple_param(7));
      const op = await batch.send();*/
    const batch: WalletParamsWithKind[] & ParamsWithKind[] = [
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
    opHash = op['opHash'] ? op['opHash'] : op['hash'];
    await op.confirmation();
    const newStorage: { simple: string } = await contract.storage();
    if (
      Number(newStorage.simple) ===
      Number(storage.simple) + 5 + 6 + 7
    ) {
      return { success: true, opHash };
    } else {
      throw `Unexpected number in storage, expected ${Number(storage.simple)}, got ${Number(newStorage.simple)}`;
    }
  } catch (error) {
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
      opHash: op["opHash"] ? op["opHash"] : op["hash"],
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
  _contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>
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
    let op: TransactionOperation | TransactionWalletOperation;
    if (isNaN(+fee) || isNaN(+storageLimit) || isNaN(+gasLimit)) {
      // if one of the parameters is missing, transaction is sent as is
      return { success: false, opHash: "", output: `Expected as numbers fee: ${isNaN(+fee)}, storageLimit: ${isNaN(+storageLimit)}, gasLimit: ${isNaN(+gasLimit)}`};
    } else {
      op = await contract.methods.simple_param(5).send({
        storageLimit: +storageLimit,
        gasLimit: +gasLimit,
        fee: +fee
      });
    }

    opHash = op["opHash"] ? op["opHash"] : op["hash"];
    await op.confirmation();
    return { success: true, opHash };
  } catch (error) {
    return { success: false, opHash: "", output: `Expected as numbers fee: ${isNaN(+fee)}, storageLimit: ${isNaN(+storageLimit)}, gasLimit: ${isNaN(+gasLimit)}`};
  }
};

const tryConfirmationObservable = async (
  contract: ContractAbstraction<Wallet>
): Promise<TestResult> => {
  let opHash = "";
  try {
    store.resetConfirmationObservableTest();
    const storage: { simple: string} = await contract.storage();
    const val = Number(storage.simple) + 1;
    const op = await contract.methods.simple_param(val).send();

    opHash = op["opHash"] ? op["opHash"] : op["hash"];

    const entries = await new Promise<TestResult['confirmationObsOutput']>((resolve, reject) => {
      const evts: TestResult['confirmationObsOutput'] = [];
      op.confirmationObservable(3).subscribe(
        event => {
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

    return { success: true, opHash, confirmationObsOutput: entries };
  } catch (error) {
    return { success: false, opHash: "" };
  }
};

export const list = {
  sendTez: "Send tez",
  contractWithInt: "Contract call with int",
  contractWithPair: "Contract call with (pair nat string)",
  contractFail: "Contract call that fails",
  contractFailInt: "Contract call that fails with int",
  contractFailPair: "Contract call that fails with (pair int string)",
  originate: "Originate smart contract with success",
  originateFail: "Originate smart contract that fails",
  batch: "Use the Batch API with a wallet",
  batchContract: "Use the Batch API for contract calls",
  sign: "Sign the provided payload",
  signAndSend: "Sign and send the signature to the contract",
  signAndVerify: "Verify a provided signature",
  setLimits: "Set the transaction limits",
  subscribe: "Subscribe to confirmations",
};

export const init = (
  Tezos: TezosToolkit,
  contract: ContractAbstraction<Wallet> | ContractAbstraction<ContractProvider>,
  wallet: BeaconWallet | undefined
): TestSettings[] => [
  {
    id: "send-tez",
    name: list.sendTez,
    description: "This test sends 0.1 tez to Alice's address",
    documentation: 'https://tezostaquito.io/docs/wallet_API#making-transfers',
    keyword: 'transfer',
    run: () => sendTez(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-simple-type",
    name: list.contractWithInt,
    description: "This test calls a contract entrypoint and passes an int",
    documentation: 'https://tezostaquito.io/docs/smartcontracts',
    keyword: 'methods',
    run: () => sendInt(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-complex-type",
    name: list.contractWithPair,
    description:
      "This test calls a contract entrypoint and passes a pair holding a nat and a string",
    documentation: 'https://tezostaquito.io/docs/smartcontracts/#choosing-between-the-methods-or-methodsobject-members-to-interact-with-smart-contracts',
    keyword: 'methodsObject',
    run: () => sendComplexParam(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail",
    name: list.contractFail,
    description:
      'This test calls a contract entrypoint that fails with the message "Fail entrypoint"',
    documentation: 'https://tezostaquito.io/docs/failwith_errors/',
    keyword: 'failwith',
    run: () => callFail(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail-with-int",
    name: list.contractFailInt,
    description: "This test calls a contract entrypoint that fails with an int",
    documentation: 'https://tezostaquito.io/docs/failwith_errors/',
    keyword: 'failwith',
    run: () => callFaiWithInt(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "contract-call-fail-with-pair",
    name: list.contractFailPair,
    description: "This test calls a contract entrypoint that fails with a pair",
    documentation: 'https://tezostaquito.io/docs/failwith_errors/',
    keyword: 'failwith',
    run: () => callFaiWithPair(contract),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "originate-success",
    name: list.originate,
    description: "This test successfully originates a smart contract",
    documentation: 'https://tezostaquito.io/docs/originate/#originate-the-contract-using-taquito',
    keyword: 'originate',
    run: () => originateSuccess(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "originate-fail",
    name: list.originateFail,
    description: "This test originates a smart contract that fails",
    keyword: 'failwith',
    run: (Tezos) => originateFail(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "batch-api",
    name: list.batch,
    description: "This test sends 0.3 tez to 3 different addresses",
    documentation: 'https://tezostaquito.io/docs/batch_api/#--the-withtransfer-method',
    keyword: 'withTransfer',
    run: () => batchApiTest(Tezos),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
  {
    id: "batch-api-contract-call",
    name: list.batchContract,
    description: "This test calls the same entrypoint 3 times in 1 transaction",
    documentation: 'https://tezostaquito.io/docs/batch_api/#--the-withcontractcall-method',
    keyword: 'withcontractcall',
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
    name: list.sign,
    description: "This test signs the payload provided by the user",
    documentation: 'https://tezostaquito.io/docs/signing/#generating-a-signature-with-beacon-sdk',
    keyword: 'requestSignPayload',
    run: input => signPayload(input.text, wallet),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "sign-payload-and-send",
    name: list.signAndSend,
    description:
      "This test signs the provided payload and sends it to the contract to check it",
      documentation: 'https://tezostaquito.io/docs/signing/#sending-the-signature-to-a-smart-contract',
      keyword: 'check_signature',
    run: input => signPayloadAndSend(input.text, wallet, contract),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "verify-signature",
    name: list.signAndVerify,
    description:
      "This test signs the provided payload and uses Taquito to verify the signature",
      documentation: 'https://tezostaquito.io/docs/signing/#verifying-a-signature',
      keyword: 'verifySignature',
    run: input => verifySignatureWithTaquito(input.text, wallet, contract),
    showExecutionTime: false,
    inputRequired: true,
    inputType: "string",
    lastResult: { option: "none", val: false }
  },
  {
    id: "set-transaction-limits",
    name: list.setLimits,
    description:
      "This test allows you to set the fee, storage limit and gas limit manually",
      documentation: 'https://tezostaquito.io/docs/transaction_limits/#setting-the-limits',
      keyword: 'transaction limits',
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
    name: list.subscribe,
    description:
      "This test updates the underlying contract and subscribes to 3 confirmations",
      documentation: 'https://tezostaquito.io/docs/confirmation_event_stream/#setting-up-the-observable',
      keyword: 'confirmationObservable',
    run: () =>
      tryConfirmationObservable(contract as ContractAbstraction<Wallet>),
    showExecutionTime: false,
    inputRequired: false,
    lastResult: { option: "none", val: false }
  },
];
