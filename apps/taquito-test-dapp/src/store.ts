import { writable } from "svelte/store";
import type { TezosToolkit } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import { defaultMatrixNode, defaultNetworkType } from "./config";
import type { TestSettings } from "./types";
import type { WalletConnect2, NetworkType as NetworkTypeWc2 } from "@taquito/wallet-connect-2";

export enum SDK {
  BEACON,
  WC2
}

interface State {
  sdk: SDK;
  Tezos: TezosToolkit;
  userAddress: string;
  availableAccounts: string[];
  userBalance: number;
  wallet: BeaconWallet | WalletConnect2;
  disableDefaultEvents: boolean;
  networkType: NetworkTypeBeacon | NetworkTypeWc2;
  customNetworkUrl: string;
  matrixNode: string;
  confirmationObservableTest: { level: number; currentConfirmation: number }[];
  selectedTest: string;
  tests: Array<TestSettings>;
}

const initialState: State = {
  sdk: undefined,
  Tezos: undefined,
  userAddress: undefined,
  availableAccounts: undefined,
  userBalance: undefined,
  wallet: undefined,
  matrixNode: defaultMatrixNode,
  disableDefaultEvents: false,
  networkType: defaultNetworkType,
  customNetworkUrl: undefined,
  confirmationObservableTest: undefined,
  selectedTest: undefined,
  tests: []
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateSdk: (sdk: SDK) =>
    store.update(store => ({
      ...store,
      sdk
    })),
  updateUserAddress: (address: string) =>
    store.update(store => ({
      ...store,
      userAddress: address
    })),
  updateAvailableAccounts: (addresses: string[]) =>
    store.update(store => ({
      ...store,
      availableAccounts: addresses
    })),
  updateUserBalance: (balance: number) =>
    store.update(store => ({
      ...store,
      userBalance: balance
    })),
  updateTezos: (Tezos: TezosToolkit) =>
    store.update(store => ({
      ...store,
      Tezos
    })),
  updateWallet: (wallet: BeaconWallet | WalletConnect2) =>
    store.update(store => ({
      ...store,
      wallet
    })),
  updateMatrixNode: (matrixNode: string) =>
    store.update(store => ({
      ...store,
      matrixNode
    })),
  updateDefaultEvents: () =>
    store.update(store => ({
      ...store,
      disableDefaultEvents: !store.disableDefaultEvents
    })),
  updateNetworkType: (networkType: NetworkTypeBeacon, url?: string) =>
    store.update(store => ({
      ...store,
      networkType,
      customNetworkUrl: url
    })),
  updateConfirmationObservableTest: (conf: any) =>
    store.update(store => ({
      ...store,
      confirmationObservableTest:
        store.confirmationObservableTest &&
          Array.isArray(store.confirmationObservableTest)
          ? [...store.confirmationObservableTest, conf]
          : [conf]
    })),
  resetConfirmationObservableTest: () =>
    store.update(store => ({
      ...store,
      confirmationObservableTest: undefined
    })),
  updateSelectedTest: (testId: string) =>
    store.update(store => ({
      ...store,
      selectedTest: testId
    })),
  updateTests: (tests: Array<TestSettings>) =>
    store.update(store => ({
      ...store,
      tests
    })),
  updateTestResult: (id: string, res: boolean) =>
    store.update(store => ({
      ...store,
      tests: store.tests.map(test =>
        test.id === id
          ? { ...test, lastResult: { option: "some", val: res } }
          : test
      )
    }))
};

export default state;
