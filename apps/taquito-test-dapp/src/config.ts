import { NetworkType as NetworkTypeBeacon } from "@airgap/beacon-sdk";
import { NetworkType as NetworkTypeWc2 } from "@taquito/wallet-connect-2";

export type SupportedNetworks = NetworkTypeBeacon.MAINNET | NetworkTypeBeacon.GHOSTNET | NetworkTypeBeacon.PARISNET | NetworkTypeWc2.MAINNET | NetworkTypeWc2.GHOSTNET | NetworkTypeWc2.PARISNET | NetworkTypeBeacon.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkTypeBeacon.MAINNET]: "https://mainnet.ecadinfra.com",
  [NetworkTypeBeacon.GHOSTNET]: "https://ghostnet.ecadinfra.com/",
  [NetworkTypeBeacon.PARISNET]: "https://rpc.pariscnet.teztnets.com/",
  [NetworkTypeBeacon.CUSTOM]: "https://ghostnet.ecadinfra.com/",
};

export const getRpcUrl = (networkType: SupportedNetworks): string => {
  return rpcUrls[networkType];
}

export const getTzKtUrl = (networkType: SupportedNetworks): string | undefined => {
  switch (networkType) {
    case NetworkTypeBeacon.MAINNET:
    case NetworkTypeWc2.MAINNET:
      return "https://tzkt.io";
    case NetworkTypeBeacon.GHOSTNET:
    case NetworkTypeWc2.GHOSTNET:
      return "https://ghostnet.tzkt.io";
    case NetworkTypeBeacon.PARISNET:
    case NetworkTypeWc2.PARISNET:
      return "https://parisnet.tzkt.io";
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
  parisnet: "KT1E43cQefjM8fq7B5pEJFJoGbRmuNibDoBC",
};
