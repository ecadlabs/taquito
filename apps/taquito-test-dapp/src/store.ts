import { writable } from "svelte/store";
import type { TezosToolkit } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import { defaultMatrixNode, defaultNetworkType, type SupportedNetworks } from "./config";
import type { TestSettings } from "./types";
import type { WalletConnect } from "@taquito/wallet-connect";

export enum SDK {
  BEACON,
  WC2
}

interface State {
  sdk: SDK | undefined;
  Tezos: TezosToolkit | undefined;
  userAddress: string | undefined;
  availableAccounts: string[] | undefined;
  userBalance: number | undefined;
  wallet: BeaconWallet | WalletConnect | undefined;
  disableDefaultEvents: boolean;
  enableMetrics: boolean;
  networkType: SupportedNetworks;
  customNetworkUrl: string | undefined;
  matrixNode: string;
  confirmationObservableTest: { level: number; currentConfirmation: number }[] | undefined;
  selectedTest: string | undefined;
  tests: Array<TestSettings>;
  eventLogs: Array<string>;
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
  enableMetrics: true,
  networkType: defaultNetworkType,
  customNetworkUrl: undefined,
  confirmationObservableTest: undefined,
  selectedTest: undefined,
  tests: [],
  eventLogs: ['dApp started'],
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateSdk: (sdk: SDK) =>
    store.update(store => ({
      ...store,
      sdk
    })),
  updateUserAddress: (address: string | undefined) =>
    store.update(store => ({
      ...store,
      userAddress: address
    })),
  updateAvailableAccounts: (addresses: string[]) =>
    store.update(store => ({
      ...store,
      availableAccounts: addresses
    })),
  updateUserBalance: (balance: number | undefined) =>
    store.update(store => ({
      ...store,
      userBalance: balance
    })),
  updateTezos: (Tezos: TezosToolkit) =>
    store.update(store => ({
      ...store,
      Tezos
    })),
  updateWallet: (wallet: BeaconWallet | WalletConnect | undefined) =>
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
  updateEnableMetrics: () =>
    store.update(store => ({
      ...store,
      enableMetrics: !store.enableMetrics
    })),
  updateNetworkType: (networkType: SupportedNetworks, url?: string) =>
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
  updateSelectedTest: (testId: string | undefined) =>
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
    })),
  addEvent: (newEvent: string) =>
    store.update(store => ({
      ...store,
      eventLogs: [...store.eventLogs, newEvent]
    })),
  clearEvents: () => store.update(store => ({ ...store, eventLogs: [] })),
};

export default state;
