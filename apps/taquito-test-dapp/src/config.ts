import { NetworkType } from "@airgap/beacon-sdk";

export type SupportedNetworks = NetworkType.NAIROBINET | NetworkType.GHOSTNET | NetworkType.MAINNET | NetworkType.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkType.MAINNET]: "https://mainnet.ecadinfra.com",
  [NetworkType.GHOSTNET]: "https://ghostnet.ecadinfra.com/",
  [NetworkType.NAIROBINET]: "https://nairobinet.ecadinfra.com/",
  // [NetworkType.CUSTOM]: "https://ghostnet.ecadinfra.com/",
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
    case NetworkType.NAIROBINET:
      return "https://nairobinet.tzkt.io";
    case NetworkType.CUSTOM:
      return undefined;
  }
}

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  nairobinet: "KT1WoyF3wpUGRm6fbmmm1qKmpfneq1iijMT8"
};
