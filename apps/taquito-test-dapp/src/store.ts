import { writable } from "svelte/store";
import type { NetworkType } from "@airgap/beacon-sdk";
import type { TezosToolkit } from "@taquito/taquito";
import type { BeaconWallet } from "@taquito/beacon-wallet";
import { defaultMatrixNode } from "./config";
import type { TestSettings } from "./types";

interface State {
  Tezos: TezosToolkit;
  userAddress: string;
  userBalance: number;
  wallet: BeaconWallet;
  disableDefaultEvents: boolean;
  networkType: NetworkType;
  matrixNode: string;
  confirmationObservableTest: { level: number; currentConfirmation: number }[];
  selectedTest: string;
  tests: Array<TestSettings>;
}

const initialState: State = {
  Tezos: undefined,
  userAddress: undefined,
  userBalance: undefined,
  wallet: undefined,
  matrixNode: defaultMatrixNode,
  disableDefaultEvents: false,
  networkType: undefined,
  confirmationObservableTest: undefined,
  selectedTest: undefined,
  tests: []
};

const store = writable(initialState);

const state = {
  subscribe: store.subscribe,
  updateUserAddress: (address: string) =>
    store.update(store => ({
      ...store,
      userAddress: address
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
  updateWallet: (wallet: BeaconWallet) =>
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
  updateNetworkType: (networkType: NetworkType) =>
    store.update(store => ({
      ...store,
      networkType
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
