export type BalanceResponse = string
export type StorageResponse = unknown
export type ScriptResponse = unknown
export type BigMapGetResponse = unknown
export type ManagerResponse = unknown
export type DelegateResponse = string | null
export type BigMapKey = { key: { [key: string]: string }; type: { prim: string } }

export interface ContractResponse {
  manager: string
  balance: string
  spendable: boolean
  delegate: Delegate
  script: Script
  counter: string
}

interface Script {
  code: {}[]
  storage: Storage
}

interface Storage {
  prim: string
  args: {}[]
}

interface Delegate {
  setable: boolean
}
