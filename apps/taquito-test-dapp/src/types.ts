export interface TestResult {
  success: boolean;
  opHash: string;
  output?: string;
  sigDetails?: { input: string; formattedInput: string; bytes: string };
  confirmationObsOutput?: { level: number; currentConfirmation: number }[];
}

export interface TestSettings {
  id: string;
  name: string;
  description: string;
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

export enum SigningType {
  RAW = "raw", // Arbitrary payload (string), which will be hashed before signing
  OPERATION = "operation", // "03" prefix
  MICHELINE = "micheline" // "05" prefix
}
