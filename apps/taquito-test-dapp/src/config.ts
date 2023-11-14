import { NetworkType } from "@airgap/beacon-sdk";

export type SupportedNetworks = NetworkType.NAIROBINET | NetworkType.GHOSTNET | NetworkType.MAINNET | NetworkType.CUSTOM;

const rpcUrls: Record<SupportedNetworks, string> = {
  [NetworkType.NAIROBINET]: "https://nairobinet.ecadinfra.com/",
  [NetworkType.GHOSTNET]: "https://ghostnet.ecadinfra.com/",
  [NetworkType.MAINNET]: "https://mainnet.ecadinfra.com", //"https://mainnet-tezos.giganode.io"
  [NetworkType.CUSTOM]: "https://ghostnet.ecadinfra.com/",
};

export const getRpcUrl = (networkType: SupportedNetworks): string => {
  return rpcUrls[networkType];
}

export const getTzKtUrl = (networkType: SupportedNetworks): string | undefined => {
  switch (networkType) {
    case NetworkType.NAIROBINET:
      return "https://nairobinet.tzkt.io";
    case NetworkType.GHOSTNET:
      return "https://ghostnet.tzkt.io";
    case NetworkType.MAINNET:
      return "https://tzkt.io";
    case NetworkType.CUSTOM:
      return undefined;
  }
}

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

export const contractAddress = {
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  ithacanet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  custom: "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg",
  mumbainet: "KT1Tkm7U3NS9JWgeCGywrRTSQdLZJvDSgD5Z",
  nairobinet: "KT1Tkm7U3NS9JWgeCGywrRTSQdLZJvDSgD5Z" // TODO: originate the contract and update this.
};
