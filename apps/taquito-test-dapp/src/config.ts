import { NetworkType } from "@airgap/beacon-sdk";

export const rpcUrl = {
  ghostnet: "https://ghostnet.ecadinfra.com/",
  oxfordnet: "https://oxfordnet.ecadinfra.com/",
  nairobinet: "https://nairobinet.ecadinfra.com/",
  mainnet: "https://mainnet.ecadinfra.com", //"https://mainnet-tezos.giganode.io"
  custom: "https://ghostnet.ecadinfra.com/"
};

export const defaultMatrixNode = "beacon-node-1.sky.papers.tech";

export const defaultNetworkType = NetworkType.GHOSTNET;

export const contractAddress = {
  ghostnet: "KT1QKmcNBcfzVTXG2kBcE6XqXtEuYYUzMcT5",
  oxfordnet: "KT1A2o9bDfzfmZW9npuWD5UtjUTqqZwDf24x",
  nairobinet: "KT1WoyF3wpUGRm6fbmmm1qKmpfneq1iijMT8",
  mainnet: "KT1ShtH2zCrKMuWGRejEd6RAcnePwxBQeMAN",
  custom: "KT1T2gL26SwYMxpkR5SZT1pHRBF84knfw8Cg",
};
