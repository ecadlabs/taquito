export interface TestResult {
  success: boolean;
  opHash: string;
  output?: string;
  sigDetails?: { input: string; formattedInput: string; bytes: string };
  confirmationObsOutput?: { level: number; currentConfirmation: number }[];
  error?: Error;
}

export interface TestSettings {
  id: string;
  name: string;
  description: string;
  documentation?: string;
  keyword: string;
  run: (input?: any) => Promise<TestResult>;
  showExecutionTime: boolean;
  inputRequired: boolean;
  inputType?: "string" | "set-limits" | "sapling" | "delegate" | "stake" | "unstake" | "etherlink";
  lastResult: { option: "none" | "some"; val: boolean };
}

export type TezosContractAddress = `KT1${string}`;
export type TezosAccountAddress = `tz${"1" | "2" | "3"}${string}`;
