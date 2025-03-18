import { NetworkType as NetworkTypeBeacon } from "@airgap/beacon-types";
import { NetworkType as NetworkTypeWc } from "@taquito/wallet-connect";

export type SupportedNetworks = NetworkTypeBeacon.MAINNET | NetworkTypeBeacon.GHOSTNET  | NetworkTypeBeacon.QUEBECNET | NetworkTypeWc.MAINNET | NetworkTypeWc.GHOSTNET | NetworkTypeWc.QUEBECNET | NetworkTypeBeacon.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkTypeBeacon.MAINNET]: "https://mainnet.tezos.ecadinfra.com",
  [NetworkTypeBeacon.GHOSTNET]: "https://ghostnet.tezos.ecadinfra.com/",
  [NetworkTypeBeacon.QUEBECNET]: "https://rpc.quebecnet.teztnets.com",
  [NetworkTypeBeacon.CUSTOM]: "https://ghostnet.tezos.ecadinfra.com/",
};

export const getRpcUrl = (networkType: SupportedNetworks): string => {
  return rpcUrls[networkType];
}

export const getTzKtUrl = (networkType: SupportedNetworks): string | undefined => {
  switch (networkType) {
    case NetworkTypeBeacon.MAINNET:
    case NetworkTypeWc.MAINNET:
      return "https://tzkt.io";
    case NetworkTypeBeacon.GHOSTNET:
    case NetworkTypeWc.GHOSTNET:
      return "https://ghostnet.tzkt.io";
    case NetworkTypeBeacon.QUEBECNET:
    case NetworkTypeWc.QUEBECNET:
        return "https://quebecnet.tzkt.io";
    case NetworkTypeBeacon.CUSTOM:
      return undefined;
  }
}

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkTypeBeacon.GHOSTNET;

// new protocol updated rpc url in example/data/test-dapp-contract.ts and npm -w example run example:deploy-dapp
export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  oxfordnet: "KT1GYx1KDhMQt2GJEztRh8EyYxJUPM6fnAMM",
  quebecnet: "KT1JZ3H8zMn6GXoftLpRzGUwRD4fP7mmxKqW"
};
