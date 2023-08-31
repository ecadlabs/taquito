import { NetworkType } from "@airgap/beacon-sdk";

export const rpcUrl = {
  mumbainet: "https://mumbainet.ecadinfra.com/",
  nairobinet: "https://nairobinet.ecadinfra.com/",
  ghostnet: "https://ghostnet.ecadinfra.com/",
  ithacanet: "https://ithacanet.ecadinfra.com/",
  mainnet: "https://mainnet.ecadinfra.com", //"https://mainnet-tezos.giganode.io"
  custom: "https://ghostnet.ecadinfra.com/"
};

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
