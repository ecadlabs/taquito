import { NetworkType } from '@airgap/beacon-types';

export type SupportedNetworks = NetworkType.PARISNET | NetworkType.OXFORDNET | NetworkType.GHOSTNET | NetworkType.MAINNET | NetworkType.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: "https://mainnet.ecadinfra.com",
  [NetworkType.GHOSTNET]: "https://ghostnet.ecadinfra.com/",
  [NetworkType.OXFORDNET]: "https://oxfordnet.ecadinfra.com/",
  [NetworkType.PARISNET]: "https://rpc.pariscnet.teztnets.com/",
  [NetworkType.CUSTOM]: "https://ghostnet.ecadinfra.com/",
};

export const getRpcUrl = (networkType: SupportedNetworks): string => {
  return rpcUrls[networkType];
}

export const getTzKtUrl = (networkType: SupportedNetworks): string | undefined => {
  switch (networkType) {
    case NetworkType.MAINNET:
      return "https://tzkt.io";
    case NetworkType.GHOSTNET:
      return "https://ghostnet.tzkt.io";
    case NetworkType.OXFORDNET:
      return "https://oxfordnet.tzkt.io";
    case NetworkType.PARISNET:
      return "https://parisnet.tzkt.io";
    case NetworkType.CUSTOM:
      return undefined;
  }
}

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

// new protocol updated rpc url in example/data/test-dapp-contract.ts and npm -w example run example:deploy-dapp
export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  oxfordnet: "KT1GYx1KDhMQt2GJEztRh8EyYxJUPM6fnAMM",
  parisnet: "KT1E43cQefjM8fq7B5pEJFJoGbRmuNibDoBC",
};
