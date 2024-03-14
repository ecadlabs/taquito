type TestSuccessResult = {
  success: true;
  opHash: string;
  output?: string;
  sigDetails?: { input: string; formattedInput: string; bytes: string };
  confirmationObsOutput?: { level: number; currentConfirmation: number }[];
}

type TestFailureResult =  {
  success: false;
  output?: string;
}

export type StateFeatures = {
  userAddress: string | undefined;
}

export type StoreFeatures = {
  updateConfirmationObservableTest(entry: { level: number; currentConfirmation: number; }): void;
  resetConfirmationObservableTest(): void;
  getState(): StateFeatures;
}


export type TestResult = TestSuccessResult | TestFailureResult;

export interface TestSettings {
  id: string;
  name: string;
  description: string;
  documentation?: string;
  keyword: string;
  run: (input?: any) => Promise<TestResult>;
  showExecutionTime: boolean;
  inputRequired: boolean;
  inputType?: "string" | "set-limits" | "sapling";
  lastResult: { option: "none" | "some"; val: boolean };
}

export type TezosContractAddress = `KT1${string}`;
export type TezosAccountAddress = `tz${"1" | "2" | "3"}${string}`;

// export enum NetworkType {
//   MAINNET = "mainnet",
//   DELPHINET = "delphinet",
//   EDONET = "edonet",
//   FLORENCENET = "florencenet",
//   GRANADANET = "granadanet",
//   HANGZHOUNET = "hangzhounet",
//   ITHACANET = "ithacanet",
//   GHOSTNET = "ghostnet",
//   JAKARTANET = "jakartanet",
//   CUSTOM = "custom"
// }
