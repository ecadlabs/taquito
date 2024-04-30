import { NetworkType } from '@airgap/beacon-types';

export type SupportedNetworks = NetworkType.OXFORDNET | NetworkType.GHOSTNET | NetworkType.MAINNET | NetworkType.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: "https://mainnet.ecadinfra.com",
  [NetworkType.GHOSTNET]: "http://ecad-ghostnet-rolling-2.i.tez.ie:8732/",
  [NetworkType.OXFORDNET]: "http://ecad-oxfordnet-full.i.tez.ie:8732",
  [NetworkType.CUSTOM]: "http://ecad-ghostnet-rolling-2.i.tez.ie:8732/",
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
};
